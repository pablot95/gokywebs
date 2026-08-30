const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;
const normalize = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const getCurso = id => CURSOS.find(c => c.id === id);

/* ============ ÍCONOS (Lucide-style, inline) ============ */
const ICON = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 2,8 12,14 22,8"/><polyline points="2,14 12,20 22,14"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/></svg>',
  lectura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5c3-1 6-1 8 0 2-1 5-1 8 0v14c-3-1-6-1-8 0-2-1-5-1-8 0z"/></svg>',
  descargable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>',
};
const ICON_TIPO = { video: ICON.video, lectura: ICON.lectura, descargable: ICON.descargable };
const CAT_META = {
  'Monotributo y Autónomos': { cls: 'cat-monotributo', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6z"/><path d="m9 12 2 2 4-4"/></svg>' },
  'Impuestos y ARCA/AFIP': { cls: 'cat-impuestos', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><line x1="8" y1="16" x2="16" y2="8"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/></svg>' },
  'Pymes y Sociedades': { cls: 'cat-pymes', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/></svg>' },
  'Sueldos y Personal': { cls: 'cat-sueldos', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2c2.4.5 4.5 2.6 4.5 5.8"/></svg>' },
  'Herramientas Digitales': { cls: 'cat-herramientas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M2 19h20"/></svg>' },
};

/* ============ DATOS ============ */
const DOCENTE = {
  id: 'nadia-neira',
  nombre: 'Nadia Neira',
  rol: 'Titular de Estudio Contable & Impositivo N.N',
  bio: 'Al frente de la gestión contable e impositiva de monotributistas, autónomos y pymes de Chilecito y toda La Rioja. Dicta las capacitaciones con la misma lógica práctica que usa en la atención diaria del estudio.',
};

const PLAN = {
  id: 'acceso-total',
  nombre: 'Suscripción Acceso Total',
  precio: 19900,
  periodo: 'mes',
  descripcionCorta: 'Acceso a las 9 capacitaciones del estudio, incluidas las que sumemos más adelante, mientras tu suscripción esté activa.',
};

const CURSOS = [
  { id: 1, slug: 'monotributo-desde-cero', titulo: 'Monotributo desde Cero', categoria: 'Monotributo y Autónomos', nivel: 'Inicial', modalidad: 'Grabado', precio: 14900, descuento: 0, duracion: '3 horas', cantidadClases: 9, destacado: true,
    descripcionCorta: 'Todo lo que necesitás para inscribirte al Monotributo y empezar a facturar sin errores.',
    descripcionCompleta: 'Pensado para quien está por dar de alta su Monotributo o acaba de hacerlo y no quiere pisar el palito en los primeros meses. Vas a entender cómo funciona el sistema, qué categoría te corresponde y cómo mantenerte en regla desde la primera factura.',
    resultados: ['Elegir la categoría correcta según tu actividad', 'Inscribirte en ARCA/AFIP paso a paso', 'Entender qué tenés que pagar cada mes', 'Evitar los errores más comunes al arrancar'],
    requisitos: ['Tener o tramitar tu CUIT', 'Conexión a internet para hacer los trámites junto con las clases'],
    incluye: ['9 clases grabadas', 'Certificado de finalización', 'Planilla de seguimiento de facturación'],
    modulos: [
      { titulo: 'Antes de inscribirte', clases: [{ titulo: '¿Monotributo o Responsable Inscripto?', duracion: '12:40', tipo: 'video', preview: true }, { titulo: 'Categorías y topes 2026', duracion: '15:20', tipo: 'video' }, { titulo: 'Documentación que vas a necesitar', duracion: '8:10', tipo: 'lectura' }] },
      { titulo: 'El alta paso a paso', clases: [{ titulo: 'Alta en ARCA/AFIP online', duracion: '18:00', tipo: 'video' }, { titulo: 'Alta en ingresos brutos', duracion: '11:30', tipo: 'video' }, { titulo: 'Errores comunes del alta', duracion: '9:45', tipo: 'video' }] },
      { titulo: 'Ya sos monotributista', clases: [{ titulo: 'Cómo facturar tu primera venta', duracion: '14:15', tipo: 'video' }, { titulo: 'Vencimientos y recategorización', duracion: '13:00', tipo: 'video' }, { titulo: 'Cuándo pedir ayuda profesional', duracion: '7:20', tipo: 'lectura' }] },
    ] },
  { id: 2, slug: 'recategorizacion-monotributo-sin-errores', titulo: 'Recategorización de Monotributo sin Errores', categoria: 'Monotributo y Autónomos', nivel: 'Inicial', modalidad: 'Grabado', precio: 9900, descuento: 0, duracion: '1 h 30 min', cantidadClases: 5, destacado: false,
    descripcionCorta: 'La recategorización explicada para que nunca te agarre por sorpresa ni pagues de más.',
    descripcionCompleta: 'Un curso corto y directo al grano sobre las dos fechas del año que todo monotributista tiene que tener marcadas en el calendario, y cómo calcularlas sin depender de una planilla ajena.',
    resultados: ['Saber cuándo te toca recategorizar', 'Calcular tus últimos 12 meses de ingresos', 'Evitar la exclusión de oficio', 'Corregir una recategorización mal hecha'],
    requisitos: ['Estar inscripto en Monotributo'],
    incluye: ['5 clases grabadas', 'Certificado de finalización', 'Planilla de cálculo de recategorización'],
    modulos: [
      { titulo: 'Entendé la recategorización', clases: [{ titulo: 'Qué mira ARCA/AFIP para recategorizarte', duracion: '10:00', tipo: 'video', preview: true }, { titulo: 'Enero y julio: las dos fechas clave', duracion: '9:30', tipo: 'video' }] },
      { titulo: 'Hacelo sin errores', clases: [{ titulo: 'Cómo calcular tus últimos 12 meses', duracion: '13:00', tipo: 'video' }, { titulo: 'Cargar la recategorización en el sistema', duracion: '11:00', tipo: 'video' }, { titulo: 'Qué hacer si te excluyeron de oficio', duracion: '8:00', tipo: 'lectura' }] },
    ] },
  { id: 3, slug: 'facturacion-electronica-arca-paso-a-paso', titulo: 'Facturación Electrónica y ARCA Paso a Paso', categoria: 'Impuestos y ARCA/AFIP', nivel: 'Inicial', modalidad: 'Grabado', precio: 12900, descuento: 15, duracion: '2 h 15 min', cantidadClases: 7, destacado: true,
    descripcionCorta: 'Aprendé a facturar online sin depender de nadie, con el sistema de ARCA explicado desde cero.',
    descripcionCompleta: 'Vas a perder el miedo al sistema de comprobantes en línea: qué tipo de factura emitir en cada caso, cómo corregir un error y cómo llevar tu propio registro de ventas mes a mes.',
    resultados: ['Emitir factura C, A o B según corresponda', 'Corregir una factura mal emitida', 'Llevar tu propio registro de ventas', 'Entender qué mira ARCA en cada comprobante'],
    requisitos: ['CUIT activo y clave fiscal'],
    incluye: ['7 clases grabadas', 'Certificado de finalización', 'Checklist de facturación mensual'],
    modulos: [
      { titulo: 'Primeros pasos', clases: [{ titulo: 'Clave fiscal y accesos en ARCA', duracion: '9:00', tipo: 'video', preview: true }, { titulo: 'Qué tipo de factura te corresponde', duracion: '11:20', tipo: 'video' }, { titulo: 'El comprobante en línea explicado', duracion: '14:00', tipo: 'video' }] },
      { titulo: 'Facturar sin errores', clases: [{ titulo: 'Emitir tu primera factura', duracion: '12:00', tipo: 'video' }, { titulo: 'Notas de crédito y débito', duracion: '10:30', tipo: 'video' }, { titulo: 'Errores que generan observaciones', duracion: '9:15', tipo: 'video' }] },
      { titulo: 'Organización mensual', clases: [{ titulo: 'Tu propio libro de ventas', duracion: '8:40', tipo: 'descargable' }] },
    ] },
  { id: 4, slug: 'iva-y-ganancias-para-autonomos', titulo: 'IVA y Ganancias para Autónomos', categoria: 'Impuestos y ARCA/AFIP', nivel: 'Intermedio', modalidad: 'Grabado', precio: 18900, descuento: 0, duracion: '4 horas', cantidadClases: 11, destacado: true,
    descripcionCorta: 'Entendé cómo se calculan IVA y Ganancias como Responsable Inscripto, sin depender de una calculadora ajena.',
    descripcionCompleta: 'De débito y crédito fiscal a tu propia declaración jurada de Ganancias: la lógica de los dos impuestos que más dolores de cabeza dan, explicada con casos reales.',
    resultados: ['Calcular el IVA a pagar de tu período', 'Entender las categorías de Ganancias para autónomos', 'Aplicar las deducciones que te corresponden', 'Leer tu propia declaración jurada'],
    requisitos: ['Ser Responsable Inscripto o tener nociones básicas de Monotributo', 'Se recomienda haber visto Monotributo desde Cero si estás empezando'],
    incluye: ['11 clases grabadas', 'Certificado de finalización', 'Planilla de cálculo de IVA'],
    modulos: [
      { titulo: 'IVA sin vueltas', clases: [{ titulo: 'Débito y crédito fiscal explicados', duracion: '16:00', tipo: 'video', preview: true }, { titulo: 'Cómo se arma la declaración de IVA', duracion: '18:30', tipo: 'video' }, { titulo: 'Casos prácticos de cálculo', duracion: '15:00', tipo: 'video' }, { titulo: 'Errores frecuentes en la liquidación', duracion: '10:00', tipo: 'video' }] },
      { titulo: 'Ganancias para autónomos', clases: [{ titulo: 'Categorías y mínimo no imponible', duracion: '14:00', tipo: 'video' }, { titulo: 'Deducciones que podés aplicar', duracion: '17:00', tipo: 'video' }, { titulo: 'Anticipos y saldos a favor', duracion: '12:00', tipo: 'video' }] },
      { titulo: 'Tu declaración jurada', clases: [{ titulo: 'Armado paso a paso', duracion: '20:00', tipo: 'video' }, { titulo: 'Revisión antes de presentar', duracion: '9:00', tipo: 'lectura' }] },
    ] },
  { id: 5, slug: 'constitucion-de-sas-guia-practica', titulo: 'Constitución de SAS: Guía Práctica', categoria: 'Pymes y Sociedades', nivel: 'Inicial', modalidad: 'Grabado', precio: 16900, descuento: 0, duracion: '2 h 45 min', cantidadClases: 8, destacado: false,
    descripcionCorta: 'Los pasos reales para constituir tu Sociedad por Acciones Simplificada, de punta a punta.',
    descripcionCompleta: 'Vas a recorrer el trámite completo de constitución de una SAS: qué decidir antes de arrancar, cómo armar el estatuto y qué obligaciones asumís una vez que ya sos sociedad.',
    resultados: ['Decidir si te conviene una SAS u otra figura', 'Armar el estatuto y el capital inicial', 'Completar el trámite de constitución', 'Entender tus obligaciones como sociedad'],
    requisitos: ['Tener definidos los socios (podés ser vos solo/a)'],
    incluye: ['8 clases grabadas', 'Certificado de finalización', 'Modelo de estatuto editable'],
    modulos: [
      { titulo: 'Antes de constituir', clases: [{ titulo: 'SAS, SRL o Monotributo: qué te conviene', duracion: '13:00', tipo: 'video', preview: true }, { titulo: 'Capital social y socios', duracion: '11:00', tipo: 'video' }] },
      { titulo: 'El trámite', clases: [{ titulo: 'Estatuto paso a paso', duracion: '16:00', tipo: 'video' }, { titulo: 'Firma digital y trámite online', duracion: '14:00', tipo: 'video' }, { titulo: 'Inscripción y CUIT de la sociedad', duracion: '10:00', tipo: 'video' }] },
      { titulo: 'Ya sos sociedad', clases: [{ titulo: 'Libros y obligaciones societarias', duracion: '12:00', tipo: 'video' }, { titulo: 'Cuándo sumar un socio nuevo', duracion: '9:00', tipo: 'lectura' }, { titulo: 'Errores frecuentes al constituir', duracion: '8:00', tipo: 'video' }] },
    ] },
  { id: 6, slug: 'balance-de-tu-pyme', titulo: 'Cómo Armar el Balance de tu Pyme', categoria: 'Pymes y Sociedades', nivel: 'Intermedio', modalidad: 'Grabado', precio: 21900, descuento: 10, duracion: '3 h 30 min', cantidadClases: 10, destacado: true,
    descripcionCorta: 'De los registros diarios al balance anual: la lógica contable de tu pyme, sin tecnicismos.',
    descripcionCompleta: 'Vas a entender la lógica completa detrás del balance que hoy te entrega tu contador: cómo se registra el día a día, qué ajustes se hacen antes de cerrar y cómo leer el resultado final.',
    resultados: ['Ordenar tus registros contables mes a mes', 'Armar un balance de sumas y saldos', 'Entender activo, pasivo y patrimonio neto', 'Leer el balance que hoy te entrega tu contador'],
    requisitos: ['Tener una sociedad o pyme con registros contables básicos'],
    incluye: ['10 clases grabadas', 'Certificado de finalización', 'Plantilla de balance en Excel'],
    modulos: [
      { titulo: 'La base contable', clases: [{ titulo: 'Activo, pasivo y patrimonio neto', duracion: '15:00', tipo: 'video', preview: true }, { titulo: 'El libro diario y el mayor', duracion: '14:00', tipo: 'video' }, { titulo: 'Registrar una venta y una compra', duracion: '13:00', tipo: 'video' }] },
      { titulo: 'Cierre del ejercicio', clases: [{ titulo: 'Ajustes antes de cerrar', duracion: '16:00', tipo: 'video' }, { titulo: 'Sumas y saldos', duracion: '12:00', tipo: 'video' }, { titulo: 'Armado del balance', duracion: '18:00', tipo: 'video' }, { titulo: 'Estado de resultados', duracion: '14:00', tipo: 'video' }] },
      { titulo: 'Después del balance', clases: [{ titulo: 'Qué mirar antes de presentar', duracion: '10:00', tipo: 'lectura' }, { titulo: 'Cómo usarlo para decidir en tu pyme', duracion: '11:00', tipo: 'video' }, { titulo: 'Errores que más se repiten', duracion: '9:00', tipo: 'video' }] },
    ] },
  { id: 7, slug: 'liquidacion-de-sueldos-y-cargas-sociales', titulo: 'Liquidación de Sueldos y Cargas Sociales', categoria: 'Sueldos y Personal', nivel: 'Intermedio', modalidad: 'Grabado', precio: 19900, descuento: 0, duracion: '3 horas', cantidadClases: 9, destacado: false,
    descripcionCorta: 'Aprendé a liquidar sueldos, cargas sociales y aguinaldo si tenés empleados en relación de dependencia.',
    descripcionCompleta: 'Un recorrido completo por la liquidación de sueldos: desde el alta del empleado hasta el aguinaldo, con las presentaciones mensuales que hay que hacer para estar en regla.',
    resultados: ['Liquidar un recibo de sueldo completo', 'Calcular aportes y contribuciones', 'Liquidar el SAC (aguinaldo) correctamente', 'Saber qué presentar cada mes ante los organismos'],
    requisitos: ['Tener o planear tener empleados en relación de dependencia'],
    incluye: ['9 clases grabadas', 'Certificado de finalización', 'Planilla de liquidación de sueldos'],
    modulos: [
      { titulo: 'Antes de liquidar', clases: [{ titulo: 'Alta del empleado y categoría', duracion: '12:00', tipo: 'video', preview: true }, { titulo: 'Conceptos de un recibo de sueldo', duracion: '14:00', tipo: 'video' }] },
      { titulo: 'La liquidación', clases: [{ titulo: 'Aportes y contribuciones paso a paso', duracion: '16:00', tipo: 'video' }, { titulo: 'Liquidar horas extra y presentismo', duracion: '11:00', tipo: 'video' }, { titulo: 'El aguinaldo (SAC)', duracion: '10:00', tipo: 'video' }, { titulo: 'Vacaciones y su liquidación', duracion: '9:00', tipo: 'video' }] },
      { titulo: 'Obligaciones mensuales', clases: [{ titulo: 'Presentaciones ante los organismos', duracion: '13:00', tipo: 'video' }, { titulo: 'Pago de cargas sociales', duracion: '8:00', tipo: 'video' }, { titulo: 'Errores que generan multas', duracion: '9:00', tipo: 'lectura' }] },
    ] },
  { id: 8, slug: 'excel-aplicado-a-la-gestion-contable', titulo: 'Excel Aplicado a la Gestión Contable', categoria: 'Herramientas Digitales', nivel: 'Inicial', modalidad: 'Grabado', precio: 11900, descuento: 0, duracion: '2 horas', cantidadClases: 6, destacado: false,
    descripcionCorta: 'Las planillas que un estudio contable usa todos los días, armadas por vos mismo desde cero.',
    descripcionCompleta: 'Vas a armar, paso a paso, las mismas planillas que se usan en la gestión diaria de un estudio: ingresos y egresos, cálculo automático de IVA y un flujo de caja simple.',
    resultados: ['Armar una planilla de ingresos y egresos', 'Calcular IVA y totales automáticamente', 'Ordenar tu facturación mes a mes', 'Armar un flujo de caja simple'],
    requisitos: ['Excel o Google Sheets instalado, nociones básicas de planillas'],
    incluye: ['6 clases grabadas', 'Certificado de finalización', '3 plantillas descargables'],
    modulos: [
      { titulo: 'Bases de la planilla', clases: [{ titulo: 'Fórmulas que vas a usar siempre', duracion: '11:00', tipo: 'video', preview: true }, { titulo: 'Armar tu planilla de ingresos y egresos', duracion: '15:00', tipo: 'video' }] },
      { titulo: 'Automatizar tu contabilidad', clases: [{ titulo: 'Calcular IVA automáticamente', duracion: '13:00', tipo: 'video' }, { titulo: 'Tablas dinámicas para ver tus números', duracion: '14:00', tipo: 'video' }, { titulo: 'Flujo de caja simple', duracion: '12:00', tipo: 'video' }, { titulo: 'Plantilla lista para usar', duracion: '6:00', tipo: 'descargable' }] },
    ] },
  { id: 9, slug: 'auditoria-interna-para-pymes', titulo: 'Auditoría Interna para Pymes', categoria: 'Pymes y Sociedades', nivel: 'Avanzado', modalidad: 'Grabado', precio: 24900, descuento: 0, duracion: '4 h 15 min', cantidadClases: 12, destacado: false,
    descripcionCorta: 'Un método propio para revisar los números de tu pyme y detectar errores antes de que sean un problema.',
    descripcionCompleta: 'Vas a armar un plan de auditoría interna de punta a punta: qué revisar primero, cómo documentar un hallazgo y cómo presentarlo en un informe claro para la dirección.',
    resultados: ['Armar un plan de auditoría interna simple', 'Detectar inconsistencias entre caja, banco y contabilidad', 'Revisar el circuito de compras y ventas', 'Presentar un informe de hallazgos'],
    requisitos: ['Conocimientos contables básicos o haber visto Cómo Armar el Balance de tu Pyme'],
    incluye: ['12 clases grabadas', 'Certificado de finalización', 'Modelo de informe de auditoría'],
    modulos: [
      { titulo: 'Planificar la auditoría', clases: [{ titulo: 'Qué es auditar y qué no', duracion: '10:00', tipo: 'video', preview: true }, { titulo: 'Armar tu plan de revisión', duracion: '14:00', tipo: 'video' }, { titulo: 'Materialidad: qué revisar primero', duracion: '11:00', tipo: 'video' }] },
      { titulo: 'Revisar los circuitos', clases: [{ titulo: 'Conciliación bancaria a fondo', duracion: '16:00', tipo: 'video' }, { titulo: 'Circuito de compras', duracion: '15:00', tipo: 'video' }, { titulo: 'Circuito de ventas y cobranzas', duracion: '15:00', tipo: 'video' }, { titulo: 'Caja y arqueos', duracion: '12:00', tipo: 'video' }] },
      { titulo: 'El informe final', clases: [{ titulo: 'Cómo documentar un hallazgo', duracion: '13:00', tipo: 'video' }, { titulo: 'Armar el informe para la dirección', duracion: '14:00', tipo: 'video' }, { titulo: 'Seguimiento de recomendaciones', duracion: '9:00', tipo: 'lectura' }, { titulo: 'Caso integrador', duracion: '20:00', tipo: 'video' }, { titulo: 'Cierre y próximos pasos', duracion: '6:00', tipo: 'lectura' }] },
    ] },
];

/* ============ CART ============ */
const Cart = {
  KEY: 'estudiocontablenn_cursos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  hasPlan() { return this.get().some(i => i.type === 'plan'); },
  hasCurso(id) { return this.get().some(i => i.type === 'curso' && i.id === id); },
  addCurso(id) {
    if (this.hasPlan()) { showToast('Ya tenés Acceso Total: incluye todas las capacitaciones.'); return; }
    if (this.hasCurso(id)) { showToast('Ya está en tu carrito.'); return; }
    const items = this.get(); items.push({ type: 'curso', id, qty: 1 }); this.save(items);
    showToast('Capacitación agregada al carrito.');
  },
  addPlan() {
    let items = this.get();
    const hadCursos = items.some(i => i.type === 'curso');
    items = items.filter(i => i.type !== 'curso');
    if (!items.some(i => i.type === 'plan')) items.push({ type: 'plan', id: PLAN.id, qty: 1 });
    this.save(items);
    showToast(hadCursos ? 'Sumamos Acceso Total y sacamos las capacitaciones sueltas del carrito.' : 'Acceso Total sumado al carrito.');
  },
  remove(type, id) { this.save(this.get().filter(i => !(i.type === type && i.id === id))); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() {
    return this.get().reduce((sum, i) => {
      if (i.type === 'plan') return sum + PLAN.precio;
      const c = getCurso(i.id); return c ? sum + precioFinal(c) : sum;
    }, 0);
  },
};

/* ============ TOAST ============ */
function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status');
  toast.innerHTML = `${ICON.check}<span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

/* ============ FOCUS TRAP ============ */
function trapFocus(container) {
  const selector = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  let lastFocused = document.activeElement;
  function handleKeydown(e) {
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll(selector)].filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container.addEventListener('keydown', handleKeydown);
  const firstItem = container.querySelector(selector);
  firstItem?.focus();
  return () => { container.removeEventListener('keydown', handleKeydown); lastFocused?.focus(); };
}

/* ============ CARD DE CURSO ============ */
function cursoMetaHTML(c) {
  return `<span>${ICON.layers}${esc(c.nivel)}</span><span>${ICON.clock}${esc(c.duracion)}</span><span>${ICON.play}${c.cantidadClases} clases</span>`;
}
function cursoPrecioHTML(c) {
  const final = precioFinal(c);
  return c.descuento > 0
    ? `<div class="curso-precio"><strong>${formatearPrecio(final)}</strong><del>${formatearPrecio(c.precio)}</del></div>`
    : `<div class="curso-precio"><strong>${formatearPrecio(final)}</strong></div>`;
}
function cursoCardHTML(c, animate) {
  const meta = CAT_META[c.categoria] || CAT_META['Herramientas Digitales'];
  const attrAnim = animate ? ' data-animate style="opacity:0;transform:translateY(28px)"' : '';
  const enCarrito = Cart.hasCurso(c.id);
  return `
  <article class="curso-card"${attrAnim} data-curso-id="${c.id}">
    <div class="curso-cover ${meta.cls}">
      ${meta.icon}
      <span class="curso-badge">${esc(c.categoria)}</span>
      ${c.nuevo ? '<span class="curso-badge-nuevo">Nuevo</span>' : ''}
    </div>
    <div class="curso-body">
      <span class="curso-cat">${esc(c.modalidad)}</span>
      <h4>${esc(c.titulo)}</h4>
      <p class="curso-docente">Con ${esc(DOCENTE.nombre)}</p>
      <div class="curso-meta">${cursoMetaHTML(c)}</div>
      <div class="curso-foot">
        ${cursoPrecioHTML(c)}
        <button type="button" class="curso-btn" data-open-curso="${c.id}">${enCarrito ? 'Ver en el carrito' : 'Ver curso'}</button>
      </div>
    </div>
  </article>`;
}
function renderGrid(container, list, animate) {
  container.innerHTML = list.map(c => cursoCardHTML(c, animate)).join('');
  if (!animate) container.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
}

/* ============ CATÁLOGO Y FILTROS ============ */
function initCursos() {
  const destacadosGrid = document.getElementById('destacadosGrid');
  const catalogoGrid = document.getElementById('catalogoGrid');
  const buscador = document.getElementById('buscadorCursos');
  const filtroCategoria = document.getElementById('filtroCategoria');
  const filtroNivel = document.getElementById('filtroNivel');
  const resultadosCount = document.getElementById('resultadosCount');
  const catalogoEmpty = document.getElementById('catalogoEmpty');

  renderGrid(destacadosGrid, CURSOS.filter(c => c.destacado), true);

  const categorias = [...new Set(CURSOS.map(c => c.categoria))];
  categorias.forEach(cat => filtroCategoria.insertAdjacentHTML('beforeend', `<option value="${esc(cat)}">${esc(cat)}</option>`));
  ['Inicial', 'Intermedio', 'Avanzado'].filter(n => CURSOS.some(c => c.nivel === n))
    .forEach(n => filtroNivel.insertAdjacentHTML('beforeend', `<option value="${esc(n)}">${esc(n)}</option>`));

  function applyFilters(animateFirst) {
    const q = normalize(buscador.value.trim());
    const cat = filtroCategoria.value;
    const nivel = filtroNivel.value;
    const filtered = CURSOS.filter(c => {
      const haystack = normalize(`${c.titulo} ${c.categoria} ${c.nivel} ${c.modalidad} ${DOCENTE.nombre} ${c.descripcionCorta}`);
      return (!q || haystack.includes(q)) && (!cat || c.categoria === cat) && (!nivel || c.nivel === nivel);
    });
    renderGrid(catalogoGrid, filtered, !!animateFirst);
    resultadosCount.textContent = `${filtered.length} capacitaci${filtered.length === 1 ? 'ón' : 'ones'} encontrada${filtered.length === 1 ? '' : 's'}`;
    catalogoEmpty.hidden = filtered.length !== 0;
    catalogoGrid.hidden = filtered.length === 0;
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  }
  applyFilters(true);

  buscador.addEventListener('input', () => applyFilters(false));
  filtroCategoria.addEventListener('change', () => applyFilters(false));
  filtroNivel.addEventListener('change', () => applyFilters(false));
  const limpiar = () => { buscador.value = ''; filtroCategoria.value = ''; filtroNivel.value = ''; applyFilters(false); };
  document.getElementById('limpiarFiltros').addEventListener('click', limpiar);
  document.getElementById('limpiarFiltros2').addEventListener('click', limpiar);

  document.getElementById('capacitaciones').addEventListener('click', e => {
    const btn = e.target.closest('[data-open-curso]');
    if (btn) openModalCurso(Number(btn.dataset.openCurso));
  });

  document.getElementById('planPrecio').textContent = formatearPrecio(PLAN.precio);
  document.getElementById('planAddBtn').addEventListener('click', () => { Cart.addPlan(); syncPlanButton(); });
  document.addEventListener('cart:updated', syncPlanButton);
  syncPlanButton();

  function syncPlanButton() {
    const btn = document.getElementById('planAddBtn');
    const added = Cart.hasPlan();
    btn.textContent = added ? 'Ya está en tu carrito' : 'Sumar Acceso Total';
    btn.classList.toggle('is-added', added);
  }
}

/* ============ MODAL DE CURSO ============ */
let closeModalFocusTrap = null;
function openModalCurso(id) {
  const c = getCurso(id);
  if (!c) return;
  const meta = CAT_META[c.categoria] || CAT_META['Herramientas Digitales'];
  const body = document.getElementById('modalBody');
  const programaHTML = c.modulos.map((m, i) => `
    <details class="modulo" ${i === 0 ? 'open' : ''}>
      <summary>${esc(m.titulo)} ${ICON.chevron}</summary>
      ${m.clases.map(cl => `<div class="modal-clase"><span class="modal-clase-tipo">${ICON_TIPO[cl.tipo] || ICON.video}${esc(cl.titulo)}${cl.preview ? '<span class="modal-preview-tag">Preview</span>' : ''}</span><span>${esc(cl.duracion)}</span></div>`).join('')}
    </details>`).join('');
  body.innerHTML = `
    <div class="modal-cover ${meta.cls}">${meta.icon}</div>
    <span class="curso-cat">${esc(c.categoria)} · ${esc(c.modalidad)}</span>
    <h2 id="modalCursoTitulo">${esc(c.titulo)}</h2>
    <div class="modal-meta"><span>${ICON.layers}${esc(c.nivel)}</span><span>${ICON.clock}${esc(c.duracion)}</span><span>${ICON.play}${c.cantidadClases} clases</span><span>${ICON.award}Certificado</span></div>
    <p class="modal-desc">${esc(c.descripcionCompleta)}</p>

    <h3 class="modal-section-title">Qué vas a lograr</h3>
    <ul class="modal-list">${c.resultados.map(r => `<li>${ICON.check}${esc(r)}</li>`).join('')}</ul>

    <h3 class="modal-section-title">Programa</h3>
    <div class="modal-programa">${programaHTML}</div>

    <h3 class="modal-section-title">Requisitos</h3>
    <ul class="modal-list">${c.requisitos.map(r => `<li>${ICON.check}${esc(r)}</li>`).join('')}</ul>

    <h3 class="modal-section-title">Incluye</h3>
    <ul class="modal-list">${c.incluye.map(r => `<li>${ICON.check}${esc(r)}</li>`).join('')}</ul>

    <div class="modal-docente">
      <span class="modal-docente-avatar">N·N</span>
      <div><h5>${esc(DOCENTE.nombre)}</h5><p>${esc(DOCENTE.rol)}</p></div>
    </div>

    <div class="modal-footer">
      ${cursoPrecioHTML(c)}
      <button type="button" class="btn btn-cta" id="modalAddBtn">Agregar al carrito</button>
    </div>`;

  function syncAddBtn() {
    const btn = document.getElementById('modalAddBtn');
    if (!btn) return;
    if (Cart.hasPlan()) { btn.textContent = 'Incluido en Acceso Total'; btn.disabled = true; }
    else if (Cart.hasCurso(c.id)) { btn.textContent = 'Ya está en tu carrito'; btn.disabled = true; }
    else { btn.textContent = 'Agregar al carrito'; btn.disabled = false; }
  }
  syncAddBtn();
  document.getElementById('modalAddBtn').addEventListener('click', () => { Cart.addCurso(c.id); syncAddBtn(); });
  document.addEventListener('cart:updated', syncAddBtn);

  document.getElementById('modalBackdrop').hidden = false;
  const modal = document.getElementById('modalCurso');
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  closeModalFocusTrap = trapFocus(modal);
}
function closeModalCurso() {
  document.getElementById('modalCurso').hidden = true;
  document.getElementById('modalBackdrop').hidden = true;
  document.body.classList.remove('no-scroll');
  closeModalFocusTrap?.();
  closeModalFocusTrap = null;
}

/* ============ DRAWER DEL CARRITO ============ */
let closeCartFocusTrap = null;
function renderCartDrawer() {
  const items = Cart.get();
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!items.length) {
    body.innerHTML = '<p class="cart-empty">Todavía no agregaste ninguna capacitación.</p>';
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map(i => {
    if (i.type === 'plan') {
      return `<div class="cart-line">
        <span class="cart-line-icon">${ICON.award}</span>
        <div class="cart-line-info">
          <h5>${esc(PLAN.nombre)}</h5>
          <p>Suscripción mensual · acceso a todas las capacitaciones</p>
          <p class="cart-line-price">${formatearPrecio(PLAN.precio)} / mes</p>
          <button type="button" class="cart-line-remove" data-remove="plan:${esc(PLAN.id)}">Quitar</button>
        </div>
      </div>`;
    }
    const c = getCurso(i.id);
    if (!c) return '';
    return `<div class="cart-line">
      <span class="cart-line-icon">${ICON.play}</span>
      <div class="cart-line-info">
        <h5>${esc(c.titulo)}</h5>
        <p>${esc(c.modalidad)} · ${esc(c.duracion)}</p>
        <p class="cart-line-price">${formatearPrecio(precioFinal(c))}</p>
        <button type="button" class="cart-line-remove" data-remove="curso:${c.id}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
}
function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.body.classList.add('no-scroll');
  closeCartFocusTrap = trapFocus(document.getElementById('cartDrawer'));
}
function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.classList.remove('no-scroll');
  closeCartFocusTrap?.();
  closeCartFocusTrap = null;
}

/* ============ NAV MOBILE (canónico) ============ */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = document.getElementById('navBackdrop');
  (header || document.body).appendChild(bd);
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

/* ============ FLOATS carrito + whatsapp ============ */
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
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

/* ============ REVEALS (canónico) ============ */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`; });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false; let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) { window.removeEventListener('scroll', queueSweep); window.removeEventListener('resize', queueSweep); }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

/* ============ ANTI-COPIA ============ */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

/* ============ MOVIMIENTO — GSAP ============ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof window.DrawSVGPlugin !== 'undefined') gsap.registerPlugin(window.DrawSVGPlugin);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initHeroTimeline() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const photo = document.querySelector('.hero-photo-card');
  if (!photo) return;
  gsap.timeline({ delay: .15 }).fromTo(photo, { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' });
}

function initSealDraw() {
  if (typeof gsap === 'undefined' || typeof window.DrawSVGPlugin === 'undefined' || reduceMotion) return;
  const ring = document.querySelector('.hero-seal-stamp .seal-draw');
  if (!ring) return;
  gsap.set(ring, { drawSVG: '0%' });
  gsap.to(ring, { drawSVG: '100%', duration: 1.3, ease: 'power2.inOut', delay: .5,
    scrollTrigger: { trigger: '.hero', start: 'top 70%', once: true } });
}

function initMagnetic() {
  if (reduceMotion || window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * .16}px, ${y * .32}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

function initProceso() {
  const stage = document.getElementById('procesoStage');
  const visual = document.getElementById('procesoVisual');
  const seal = document.getElementById('procesoSeal');
  const docs = [...visual.querySelectorAll('.proceso-doc')];
  const steps = [...document.querySelectorAll('#procesoSteps li')];
  let current = -1;
  function setStep(index) {
    index = Math.max(0, Math.min(docs.length - 1, index));
    if (index === current) return;
    current = index;
    docs.forEach((d, i) => d.classList.toggle('is-active', i === index));
    steps.forEach((s, i) => s.classList.toggle('is-on', i === index));
    seal.classList.remove('is-stamping'); void seal.offsetWidth; seal.classList.add('is-stamping');
  }
  docs[0]?.classList.add('is-active');

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 1081px)', mobile: '(max-width: 1080px)', reduced: '(prefers-reduced-motion: reduce)' }, ctx => {
    if (ctx.conditions.reduced) { setStep(docs.length - 1); return; }
    if (ctx.conditions.desktop) {
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: '+=220%', pin: true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(Math.min(docs.length - 1, Math.floor(self.progress * docs.length))),
      });
      return () => st.kill();
    }
    if (ctx.conditions.mobile) {
      stage.classList.add('is-sticky-mobile');
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top+=90', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(Math.min(docs.length - 1, Math.floor(self.progress * docs.length))),
      });
      return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
    }
  });
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initCursos();
  initReveals();
  initNav();
  initFloats();
  updateCartBadge();
  initHeroTimeline();
  initSealDraw();
  initMagnetic();
  initProceso();

  document.getElementById('cartCloseBtn').addEventListener('click', closeCartDrawer);
  document.getElementById('cartCheckoutBtn').addEventListener('click', () => {
    if (!Cart.count()) return;
    showToast('¡Listo! El pago y el acceso a tu panel se habilitan al llevar la plataforma a producción.');
    Cart.clear(); closeCartDrawer();
  });
  document.getElementById('cartBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    const [type, id] = btn.dataset.remove.split(':');
    Cart.remove(type, type === 'plan' ? id : Number(id));
    renderCartDrawer();
  });
  document.addEventListener('cart:updated', () => { if (document.getElementById('cartDrawer').classList.contains('open')) renderCartDrawer(); });

  document.getElementById('modalCloseBtn').addEventListener('click', closeModalCurso);
  document.getElementById('modalBackdrop').addEventListener('click', closeModalCurso);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modalCurso').hidden) { closeModalCurso(); }
    else if (document.getElementById('cartDrawer').classList.contains('open')) { closeCartDrawer(); }
  });
});
