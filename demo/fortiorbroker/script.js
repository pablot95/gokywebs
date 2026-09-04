/* ==========================================================================
   Fortior Broker — demo visual v2.1
   Todo el contenido es inventado a modo de demostración.
   No hay backend: los formularios y acciones no persisten nada.
   ========================================================================== */
(function () {
'use strict';

/* ==========================================================================
   1. DATOS
   ========================================================================== */

var COBERTURAS = [
  { id: 'sancor', nombre: 'SanCor Salud', logo: 'images/sancor.webp',
    desc: 'Cobertura nacional con fuerte presencia en el interior y una red propia de centros de atención.',
    alcance: 'Todo el país', afiliados: 'Relación de dependencia, monotributo y particular',
    cotizador: 'Portal Asociados SanCor', app: 'SanCor Salud Móvil',
    planes: [
      { n: 'S1500', t: 'Esencial', nivel: 2, feats: ['Cartilla regional', 'Consultas y prácticas básicas', 'Urgencias 24 h'] },
      { n: 'S2500', t: 'Intermedio', nivel: 3, feats: ['Cartilla ampliada', 'Especialidades sin cargo', 'Odontología incluida'] },
      { n: 'S3500', t: 'Superior', nivel: 4, feats: ['Sanatorios de primer nivel', 'Maternidad completa', 'Reintegros ampliados'] },
      { n: 'S4500', t: 'Premium', nivel: 5, feats: ['Habitación individual', 'Cobertura internacional', 'Sin coseguros'] } ] },
  { id: 'swiss', nombre: 'Swiss Medical', logo: 'images/swissmedical.png',
    desc: 'Una de las redes más amplias del AMBA, con sanatorios propios y cartilla de alta complejidad.',
    alcance: 'AMBA, Córdoba, Rosario y Mendoza', afiliados: 'Relación de dependencia, monotributo y particular',
    cotizador: 'Swiss Medical Cotizador', app: 'Swiss Medical Mobile',
    planes: [
      { n: 'SMG02', t: 'Esencial', nivel: 2, feats: ['Cartilla cerrada', 'Consultas programadas', 'Urgencias 24 h'] },
      { n: 'SMG20', t: 'Intermedio', nivel: 3, feats: ['Cartilla abierta', 'Prácticas de mediana complejidad', 'Odontología'] },
      { n: 'SMG30', t: 'Superior', nivel: 4, feats: ['Sanatorios propios', 'Alta complejidad', 'Reintegros por profesional'] },
      { n: 'SMG40', t: 'Premium', nivel: 5, feats: ['Habitación individual', 'Cobertura en el exterior', 'Atención domiciliaria'] } ] },
  { id: 'galeno', nombre: 'Galeno', logo: 'images/galeno.png',
    desc: 'Estructura propia de clínicas y una cartilla fuerte en Capital y Gran Buenos Aires.',
    alcance: 'AMBA y principales ciudades', afiliados: 'Relación de dependencia, monotributo y particular',
    cotizador: 'Galeno Cotizador Online', app: 'Galeno App',
    planes: [
      { n: 'Azul 220', t: 'Esencial', nivel: 2, feats: ['Cartilla Galeno', 'Consultas y estudios básicos', 'Urgencias'] },
      { n: 'Plata 330', t: 'Intermedio', nivel: 3, feats: ['Cartilla ampliada', 'Maternidad', 'Odontología'] },
      { n: 'Oro 440', t: 'Superior', nivel: 4, feats: ['Clínicas propias', 'Alta complejidad', 'Reintegros'] },
      { n: 'Platino 550', t: 'Premium', nivel: 5, feats: ['Habitación individual', 'Cobertura internacional', 'Sin coseguros'] } ] },
  { id: 'omint', nombre: 'Omint', logo: 'images/omint.svg',
    desc: 'Perfil premium, orientado a planes altos y cobertura internacional.',
    alcance: 'AMBA, Córdoba y Rosario', afiliados: 'Relación de dependencia y particular',
    cotizador: 'Omint Cotizador', app: 'Omint Salud',
    planes: [
      { n: 'Plan 2500', t: 'Intermedio', nivel: 3, feats: ['Cartilla Omint', 'Consultas sin cargo', 'Urgencias 24 h'] },
      { n: 'Plan 4500', t: 'Superior', nivel: 4, feats: ['Cartilla ampliada', 'Alta complejidad', 'Maternidad completa'] },
      { n: 'Plan 6500', t: 'Premium', nivel: 5, feats: ['Habitación individual', 'Reintegros ampliados', 'Segunda opinión médica'] },
      { n: 'Plan 8500', t: 'Alta gama', nivel: 5, feats: ['Cobertura internacional', 'Sin coseguros', 'Concierge médico'] } ] },
  { id: 'medife', nombre: 'Medifé', logo: 'images/medife-logo.webp',
    desc: 'Cobertura de alcance nacional con foco en prevención y programas de salud.',
    alcance: 'Todo el país', afiliados: 'Relación de dependencia, monotributo y particular',
    cotizador: 'Medifé Cotizá Online', app: 'Medifé App',
    planes: [
      { n: 'Bienestar', t: 'Esencial', nivel: 2, feats: ['Cartilla regional', 'Programas de prevención', 'Urgencias'] },
      { n: 'Integral 200', t: 'Intermedio', nivel: 3, feats: ['Cartilla nacional', 'Especialidades', 'Odontología'] },
      { n: 'Integral 300', t: 'Superior', nivel: 4, feats: ['Alta complejidad', 'Maternidad completa', 'Reintegros'] },
      { n: 'Premium', t: 'Premium', nivel: 5, feats: ['Habitación individual', 'Cobertura ampliada', 'Atención domiciliaria'] } ] },
  { id: 'avalian', nombre: 'Avalian', logo: 'images/avalian.png',
    desc: 'Ex ACA Salud. Red federal con buena penetración en el interior del país.',
    alcance: 'Todo el país', afiliados: 'Relación de dependencia, monotributo y particular',
    cotizador: 'Avalian Cotizador', app: 'Avalian Salud',
    planes: [
      { n: 'A1', t: 'Esencial', nivel: 2, feats: ['Cartilla regional', 'Consultas básicas', 'Urgencias 24 h'] },
      { n: 'A3', t: 'Intermedio', nivel: 3, feats: ['Cartilla ampliada', 'Estudios de complejidad media', 'Odontología'] },
      { n: 'A5', t: 'Superior', nivel: 4, feats: ['Alta complejidad', 'Maternidad', 'Reintegros'] },
      { n: 'A7', t: 'Premium', nivel: 5, feats: ['Habitación individual', 'Cartilla nacional completa', 'Sin coseguros'] } ] },
  { id: 'premedic', nombre: 'Premedic', logo: 'images/premedic-logo.webp',
    desc: 'Alternativa competitiva en planes de entrada, con crecimiento en zona sur del AMBA.',
    alcance: 'AMBA y La Plata', afiliados: 'Relación de dependencia y monotributo',
    cotizador: 'Premedic Web', app: 'Premedic Móvil',
    planes: [
      { n: 'Clásico', t: 'Esencial', nivel: 2, feats: ['Cartilla propia', 'Consultas y prácticas', 'Urgencias'] },
      { n: 'Superior', t: 'Intermedio', nivel: 3, feats: ['Cartilla ampliada', 'Especialidades', 'Odontología'] },
      { n: 'Premium', t: 'Superior', nivel: 4, feats: ['Sanatorios de referencia', 'Maternidad', 'Reintegros'] } ] },
  { id: 'doctored', nombre: 'DoctoRed', logo: 'images/doctored-logo.webp',
    desc: 'Estructura liviana, buena relación precio-cobertura para monotributistas.',
    alcance: 'AMBA', afiliados: 'Monotributo y particular',
    cotizador: 'DoctoRed Cotizador', app: 'DoctoRed',
    planes: [
      { n: 'Red 100', t: 'Esencial', nivel: 1, feats: ['Cartilla cerrada', 'Consultas programadas', 'Urgencias'] },
      { n: 'Red 200', t: 'Intermedio', nivel: 3, feats: ['Cartilla ampliada', 'Estudios básicos', 'Odontología'] },
      { n: 'Red 300', t: 'Superior', nivel: 4, feats: ['Alta complejidad', 'Maternidad', 'Reintegros'] } ] },
  { id: 'prevencion', nombre: 'Prevención Salud', logo: 'images/prevencion-salud-logo.webp',
    desc: 'Del grupo Sancor Seguros. Cobertura nacional con red de centros propios.',
    alcance: 'Todo el país', afiliados: 'Relación de dependencia, monotributo y particular',
    cotizador: 'Prevención Salud Cotizador', app: 'Prevención Salud App',
    planes: [
      { n: 'A1', t: 'Esencial', nivel: 1, feats: ['Cartilla regional', 'Consultas básicas', 'Urgencias'] },
      { n: 'A2', t: 'Esencial+', nivel: 2, feats: ['Cartilla ampliada', 'Prácticas ambulatorias', 'Odontología'] },
      { n: 'A4', t: 'Intermedio', nivel: 3, feats: ['Internación', 'Maternidad', 'Especialidades'] },
      { n: 'A5', t: 'Superior', nivel: 4, feats: ['Alta complejidad', 'Reintegros', 'Cartilla nacional'] },
      { n: 'A6', t: 'Premium', nivel: 5, feats: ['Habitación individual', 'Sin coseguros', 'Atención domiciliaria'] } ] }
];

var PRESTADORES = [
  { n: 'Hospital Italiano', img: 'images/hospitalitaliano.png' },
  { n: 'Hospital Alemán', img: 'images/hospitalaleman.png' },
  { n: 'Hospital Británico', img: 'images/hospitalbritanico.png' },
  { n: 'CEMIC', img: 'images/cemic.png' },
  { n: 'Fundación Favaloro', img: 'images/fundacionfavaloro.png' },
  { n: 'Clínica Bazterrica', img: 'images/clinicabazterrica.png' },
  { n: 'Sanatorio Finochietto', img: 'images/sanatoriofinochietto.png' },
  { n: 'Sanatorio de la Trinidad', img: 'images/sanatoriodelatrinidad.png' },
  { n: 'Sanatorio Anchorena', img: 'images/satanorioanchorena.png' },
  { n: 'Sanatorio Mater Dei', img: 'images/sanatoriomaterdei.jpeg' },
  { n: 'Sanatorio Los Arcos', img: 'images/sanatoriolosarcos.jpeg' },
  { n: 'Clínico y Maternidad Suizo', img: 'images/clinicoymaternidadsuizo.jpg' },
  { n: 'Hospital San Juan de Dios', img: 'images/hospitalsanjuandedios.png' },
  { n: 'DIM Centros de Diagnóstico', img: 'images/dimcentrosdediagnostico.jpg' }
];

var FAQ = [
  { q: '¿Cuánto cuesta el asesoramiento?', a: 'Nada. Como productores asesores cobramos una comisión de la compañía con la que finalmente te afilies, así que el servicio para vos es sin costo, cotices o no.' },
  { q: '¿Qué es la opción de cambio?', a: 'Es el derecho a derivar tus aportes de obra social hacia otra entidad. Si trabajás en relación de dependencia o sos monotributista, una parte de lo que ya aportás puede ir a tu prepaga y reducir la cuota.' },
  { q: '¿Puedo afiliarme con una enfermedad preexistente?', a: 'En la mayoría de los casos sí, aunque la compañía puede aplicar un valor diferencial. Lo declaramos desde el principio: es la única forma de que la cobertura después responda.' },
  { q: '¿Cuánto tarda el trámite?', a: 'Presentada la documentación completa, la mayoría de las afiliaciones se aprueban entre 5 y 15 días hábiles según la compañía y el tipo de alta.' },
  { q: '¿Puedo incluir a mi familia?', a: 'Sí. Se puede armar un grupo familiar con cónyuge o conviviente e hijos, y en algunos planes también familiares a cargo. El valor por integrante varía según edad.' },
  { q: '¿Trabajan con empresas chicas?', a: 'Sí, desde 3 empleados. Es donde más se nota la diferencia de negociar con un bróker en lugar de ir directo a una compañía.' }
];

var HERRAMIENTAS = [
  { g: 'Validar a la persona', items: [
    { n: 'Padrón Superintendencia', d: 'Obra social actual y opciones de cambio previas' },
    { n: 'Aportes en línea', d: 'Últimos aportes registrados en ANSES' },
    { n: 'CODEM', d: 'Constancia de opción y datos del empadronamiento' },
    { n: 'Certificación negativa', d: 'Constancia de que no registra aportes' },
    { n: 'Constancia de CUIL', d: 'Descarga del CUIL desde ANSES' },
    { n: 'Padrón de obras sociales', d: 'Listado oficial de entidades habilitadas' },
    { n: 'ARCA', d: 'Clave fiscal, constancia de inscripción y monotributo' },
    { n: 'Monotributo', d: 'Categoría, recategorización y credencial de pago' } ] },
  { g: 'Preparar la documentación', items: [
    { n: 'iLovePDF', d: 'Unir, dividir, comprimir y ordenar páginas' },
    { n: 'SmallPDF', d: 'Convertir imágenes y documentos a PDF' } ] },
  { g: 'Otros accesos', items: [
    { n: 'Mi SSSalud', d: 'Trámite de opción de cambio del afiliado' },
    { n: 'Turnero de trámites', d: 'Agenda de las delegaciones de la Superintendencia' } ] }
];

var INSTRUCTIVOS = [
  { n: 'Cómo hacer una opción de cambio', t: 'Trámite', up: '28/08/2026' },
  { n: 'Cómo solicitar la clave fiscal', t: 'ARCA', up: '22/08/2026' },
  { n: 'Cómo generar el monotributo', t: 'ARCA', up: '19/08/2026' },
  { n: 'Aportes y derivación explicados', t: 'Concepto', up: '14/08/2026' },
  { n: 'Qué es el CODEM y cómo se lee', t: 'Concepto', up: '14/08/2026' },
  { n: 'Certificación negativa paso a paso', t: 'Trámite', up: '07/08/2026' },
  { n: 'Documentación por tipo de afiliado', t: 'Checklist', up: '01/09/2026' },
  { n: 'Guion de atención telefónica', t: 'Capacitación', up: '30/08/2026' },
  { n: 'Errores frecuentes en la carga de ventas', t: 'Capacitación', up: '25/08/2026' }
];

var ESTADOS = {
  nueva:      { l: 'Consulta nueva', c: 'neutral' },
  validando:  { l: 'Pendiente de validación', c: 'warn' },
  apto:       { l: 'Apto para cotizar', c: 'ok' },
  cotizado:   { l: 'Cotización enviada', c: 'info' },
  seguimiento:{ l: 'En seguimiento', c: 'warn' },
  docum:      { l: 'Pendiente de documentación', c: 'warn' },
  cargada:    { l: 'Venta cargada', c: 'info' },
  observada:  { l: 'Venta observada', c: 'bad' },
  presentada: { l: 'Presentada a la prepaga', c: 'info' },
  aprobada:   { l: 'Aprobada', c: 'ok' },
  noapto:     { l: 'No apto', c: 'bad' }
};

var PROSPECTOS = [
  { n: 'Rodrigo Cabrera',   dni: '34.812.660', tel: '11 5412-8890', cob: 'swiss',      plan: 'SMG30',       est: 'presentada', ases: 'M. Álvarez', dias: 1, origen: 'WhatsApp' },
  { n: 'Lucía Ferreyra',    dni: '38.204.117', tel: '11 6033-2471', cob: 'sancor',     plan: 'S2500',       est: 'observada',  ases: 'M. Álvarez', dias: 0, origen: 'Referido' },
  { n: 'Grupo Marlex SRL',  dni: '30-71148902-3', tel: '11 4771-0092', cob: 'galeno',  plan: 'Oro 440',     est: 'seguimiento',ases: 'J. Sosa',    dias: 2, origen: 'Corporativo' },
  { n: 'Emiliano Quiroga',  dni: '29.556.031', tel: '351 622-4419', cob: 'avalian',    plan: 'A5',          est: 'docum',      ases: 'M. Álvarez', dias: 3, origen: 'Instagram' },
  { n: 'Vanina Peralta',    dni: '41.330.788', tel: '11 3388-7712', cob: 'medife',     plan: 'Integral 200',est: 'cotizado',   ases: 'C. Duarte',  dias: 1, origen: 'Web' },
  { n: 'Marcos Ibarra',     dni: '27.114.905', tel: '11 5900-1183', cob: 'omint',      plan: 'Plan 4500',   est: 'apto',       ases: 'J. Sosa',    dias: 0, origen: 'WhatsApp' },
  { n: 'Sofía Cardozo',     dni: '43.902.554', tel: '221 471-2260', cob: 'prevencion', plan: 'A4',          est: 'validando',  ases: 'C. Duarte',  dias: 0, origen: 'Web' },
  { n: 'Distribuidora Onix',dni: '30-70992145-8', tel: '11 4302-8874', cob: 'swiss',   plan: 'SMG20',       est: 'seguimiento',ases: 'J. Sosa',    dias: 5, origen: 'Corporativo' },
  { n: 'Héctor Villalba',   dni: '22.780.114', tel: '11 6712-3390', cob: 'doctored',   plan: 'Red 200',     est: 'nueva',      ases: 'M. Álvarez', dias: 0, origen: 'Llamada' },
  { n: 'Camila Ríos',       dni: '40.117.902', tel: '11 2288-5514', cob: 'premedic',   plan: 'Superior',    est: 'aprobada',   ases: 'C. Duarte',  dias: 4, origen: 'Referido' },
  { n: 'Nahuel Sandoval',   dni: '36.771.220', tel: '341 550-8823', cob: 'sancor',     plan: 'S3500',       est: 'cargada',    ases: 'M. Álvarez', dias: 2, origen: 'WhatsApp' },
  { n: 'Paula Genovese',    dni: '33.045.881', tel: '11 5566-9027', cob: 'galeno',     plan: 'Plata 330',   est: 'noapto',     ases: 'J. Sosa',    dias: 6, origen: 'Web' },
  { n: 'Iván Maldonado',    dni: '39.660.412', tel: '11 3010-7745', cob: 'medife',     plan: 'Premium',     est: 'cotizado',   ases: 'C. Duarte',  dias: 1, origen: 'Instagram' },
  { n: 'Textiles del Sur',  dni: '30-71455093-1', tel: '11 4899-3320', cob: 'omint',   plan: 'Plan 2500',   est: 'docum',      ases: 'J. Sosa',    dias: 3, origen: 'Corporativo' },
  { n: 'Brenda Ocampo',     dni: '42.556.190', tel: '11 5120-4478', cob: 'avalian',    plan: 'A3',          est: 'nueva',      ases: 'C. Duarte',  dias: 0, origen: 'Web' },
  { n: 'Julián Bustos',     dni: '31.209.774', tel: '11 6644-2201', cob: 'swiss',      plan: 'SMG20',       est: 'nueva',      ases: 'M. Álvarez', dias: 0, origen: 'Instagram' },
  { n: 'Agustina Leiva',    dni: '37.881.436', tel: '223 500-7719', cob: 'medife',     plan: 'Bienestar',   est: 'validando',  ases: 'J. Sosa',    dias: 1, origen: 'WhatsApp' },
  { n: 'Fernando Rúa',      dni: '25.663.028', tel: '11 4188-9903', cob: 'galeno',     plan: 'Azul 220',    est: 'validando',  ases: 'C. Duarte',  dias: 1, origen: 'Llamada' },
  { n: 'Carla Benítez',     dni: '35.774.512', tel: '11 5877-3364', cob: 'prevencion', plan: 'A5',          est: 'apto',       ases: 'M. Álvarez', dias: 0, origen: 'Referido' },
  { n: 'Metalúrgica Kern',  dni: '30-70228741-6', tel: '11 4455-2210', cob: 'sancor', plan: 'S3500',       est: 'apto',       ases: 'J. Sosa',    dias: 2, origen: 'Corporativo' },
  { n: 'Damián Ledesma',    dni: '32.908.117', tel: '11 6099-4432', cob: 'omint',      plan: 'Plan 6500',   est: 'cotizado',   ases: 'C. Duarte',  dias: 2, origen: 'Web' },
  { n: 'Rocío Aguirre',     dni: '44.201.663', tel: '11 3377-8890', cob: 'doctored',   plan: 'Red 300',     est: 'cotizado',   ases: 'M. Álvarez', dias: 1, origen: 'Instagram' },
  { n: 'Gonzalo Peña',      dni: '28.440.951', tel: '11 5233-6607', cob: 'premedic',   plan: 'Premium',     est: 'presentada', ases: 'J. Sosa',    dias: 3, origen: 'Referido' },
  { n: 'Andrea Sotelo',     dni: '30.117.288', tel: '11 4922-1145', cob: 'medife',     plan: 'Integral 300',est: 'presentada', ases: 'C. Duarte',  dias: 2, origen: 'WhatsApp' },
  { n: 'Leandro Farías',    dni: '26.998.410', tel: '11 5044-7723', cob: 'avalian',    plan: 'A7',          est: 'aprobada',   ases: 'M. Álvarez', dias: 5, origen: 'Web' },
  { n: 'Constructora Vela', dni: '30-71880254-9', tel: '11 4711-6650', cob: 'galeno', plan: 'Platino 550', est: 'aprobada',   ases: 'J. Sosa',    dias: 6, origen: 'Corporativo' },
  { n: 'Mariela Ponce',     dni: '34.550.907', tel: '11 6188-2094', cob: 'swiss',      plan: 'SMG40',       est: 'seguimiento',ases: 'C. Duarte',  dias: 4, origen: 'Llamada' }
];

var PIPELINE = [
  { l: 'Consulta nueva',  k: 'nueva' }, { l: 'Validación', k: 'validando' }, { l: 'Apto / cotizar', k: 'apto' },
  { l: 'Cotización enviada', k: 'cotizado' }, { l: 'En seguimiento', k: 'seguimiento' }, { l: 'Documentación', k: 'docum' },
  { l: 'Presentada', k: 'presentada' }, { l: 'Aprobada', k: 'aprobada' }
];

var DOCS_VENTA = [
  { n: 'DNI frente y dorso', e: 'ok' }, { n: 'Constancia de CUIL', e: 'ok' }, { n: 'Últimos 3 recibos de sueldo', e: 'ok' },
  { n: 'CODEM', e: 'warn' }, { n: 'Formulario de opción de cambio firmado', e: 'warn' },
  { n: 'Declaración jurada de salud', e: 'bad' }, { n: 'DNI del grupo familiar', e: 'neutral' }
];
var DOC_EST = { ok: 'Aprobado', warn: 'Pendiente', bad: 'Incorrecto', neutral: 'No aplica' };

/* Cotizaciones de un mismo prospecto (para comparar) */
var COTIZACIONES = [
  { cob: 'swiss',  plan: 'SMG30',        total: 412300, aporte: 168000, fecha: '28/08/2026', vence: '28/09/2026', elegida: true },
  { cob: 'galeno', plan: 'Oro 440',      total: 389900, aporte: 168000, fecha: '28/08/2026', vence: '28/09/2026', elegida: false },
  { cob: 'omint',  plan: 'Plan 4500',    total: 468750, aporte: 168000, fecha: '27/08/2026', vence: '27/09/2026', elegida: false },
  { cob: 'medife', plan: 'Integral 300', total: 352400, aporte: 168000, fecha: '27/08/2026', vence: '27/09/2026', elegida: false }
];

/* ==========================================================================
   2. UTILIDADES
   ========================================================================== */

var $ = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function cober(id) { for (var i = 0; i < COBERTURAS.length; i++) { if (COBERTURAS[i].id === id) return COBERTURAS[i]; } return COBERTURAS[0]; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function iniciales(n) { var p = n.trim().split(/\s+/); return ((p[0] || '')[0] + (p[1] || '')[0] || '?').toUpperCase(); }
function pill(k) { var e = ESTADOS[k] || ESTADOS.nueva; return '<span class="pill pill--' + e.c + '">' + e.l + '</span>'; }
function ars(n) { return '$ ' + n.toLocaleString('es-AR'); }
function meter(nivel) {
  var h = '<div class="plan__meter">';
  for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= nivel ? 'is-on' : '') + '"></i>';
  return h + '</div>';
}
function nivelTxt(n) { return n <= 2 ? 'esencial' : n === 3 ? 'intermedia' : n === 4 ? 'superior' : 'premium'; }

/* ==========================================================================
   3. RENDER — sitio público
   ========================================================================== */

function renderPublico() {
  $('#logosGrid').innerHTML = COBERTURAS.map(function (c) {
    return '<button data-cober="' + c.id + '" aria-label="' + esc(c.nombre) + '"><img src="' + c.logo + '" alt="' + esc(c.nombre) + '" loading="lazy"></button>';
  }).join('');

  $('#planChips').innerHTML = COBERTURAS.map(function (c, i) {
    return '<button class="chip' + (i === 0 ? ' is-on' : '') + '" data-chip="' + c.id + '">' + esc(c.nombre) + '</button>';
  }).join('');
  pintarPlanes(COBERTURAS[0].id);

  var band = PRESTADORES.map(function (p) {
    return '<img src="' + p.img + '" alt="' + esc(p.n) + '" loading="lazy" title="' + esc(p.n) + '">';
  }).join('');
  $('#marquee').innerHTML = band + band;

  $('#faqList').innerHTML = FAQ.map(function (f) {
    return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>';
  }).join('');

  $('#footerCober').innerHTML = COBERTURAS.map(function (c) {
    return '<li><a href="#planes" data-chip-link="' + c.id + '">' + esc(c.nombre) + '</a></li>';
  }).join('');
}

function pintarPlanes(id) {
  var c = cober(id);
  $$('.logos button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.cober === id); });
  $('#planGrid').innerHTML = c.planes.map(function (p, i) {
    return '<article class="plan' + (i === c.planes.length - 1 ? ' is-top' : '') + '">' +
      '<span class="plan__tag">' + esc(p.t) + '</span>' +
      '<h3 class="plan__name">' + esc(p.n) + '</h3>' + meter(p.nivel) +
      '<ul class="chev plan__feats">' + p.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
      '<p class="plan__foot">Cobertura ' + nivelTxt(p.nivel) + '. Valor según edad, grupo y aportes: lo cotizamos en el momento.</p>' +
    '</article>';
  }).join('');
}

/* ==========================================================================
   4. HERO
   ========================================================================== */

function initHero() {
  var slides = $$('.hero__slide'), dots = $('#heroDots');
  var i = 0, timer = null, DUR = 6500;
  dots.innerHTML = slides.map(function (s, n) {
    return '<button class="hero__dot' + (n === 0 ? ' is-on' : '') + '" data-dot="' + n + '" role="tab" aria-label="Slide ' + (n + 1) + '"></button>';
  }).join('');
  var dotEls = $$('.hero__dot');
  function ir(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    dotEls.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
  }
  function play() { if (reduce) return; stop(); timer = setInterval(function () { ir(i + 1); }, DUR); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  $$('[data-hero]').forEach(function (b) { b.addEventListener('click', function () { ir(i + (b.dataset.hero === 'next' ? 1 : -1)); play(); }); });
  dotEls.forEach(function (d) { d.addEventListener('click', function () { ir(+d.dataset.dot); play(); }); });
  var hero = $('.hero');
  hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', play);
  hero.addEventListener('focusin', stop); hero.addEventListener('focusout', play);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
  ir(0); play();
}

/* ==========================================================================
   5. Reveals + nav
   ========================================================================== */

function initReveals() {
  var els = $$('.site [data-animate], .site .poster h2, .site .poster h3').filter(function (el, i, list) { return list.indexOf(el) === i; });
  if (reduce || !('IntersectionObserver' in window)) return;
  els.forEach(function (el) {
    var isTitle = /^H[23]$/.test(el.tagName);
    el.style.opacity = 0;
    el.style.transform = isTitle ? 'translateX(-150px)' : 'translateY(76px)';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transition = 'opacity 2.2s cubic-bezier(.16,1,.3,1) ' + (idx * 0.25) + 's, transform 3s cubic-bezier(.16,1,.3,1) ' + (idx * 0.25) + 's';
      el.style.opacity = 1; el.style.transform = 'none';
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  els.forEach(function (el) { io.observe(el); });
}

function initNav() {
  var menu = $('#navMenu'), burger = $('#navBurger');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  });
}

/* ==========================================================================
   6. Login falso
   ========================================================================== */

function initLogin() {
  var login = $('#login'), lastFocus = null;
  function abrir() {
    lastFocus = document.activeElement; login.classList.add('is-on'); document.body.classList.add('is-locked');
    var menu = $('#navMenu'), burger = $('#navBurger');
    if (menu) menu.classList.remove('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    setTimeout(function () { $('#loginUser').focus(); }, 120);
  }
  function cerrar() { login.classList.remove('is-on'); document.body.classList.remove('is-locked'); if (lastFocus) lastFocus.focus(); }
  function entrar() { login.classList.remove('is-on'); document.body.classList.remove('is-locked'); document.body.classList.add('is-app'); window.scrollTo(0, 0); verApp('escritorio'); }
  function salir() { document.body.classList.remove('is-app'); window.scrollTo(0, 0); }
  $$('[data-open-login]').forEach(function (b) { b.addEventListener('click', abrir); });
  $$('[data-close-login]').forEach(function (b) { b.addEventListener('click', cerrar); });
  $$('[data-close-app]').forEach(function (b) { b.addEventListener('click', salir); });
  $('#loginForm').addEventListener('submit', function (e) { e.preventDefault(); entrar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && login.classList.contains('is-on')) cerrar(); });
  login.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button, input, [href]', login).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ==========================================================================
   7. PLATAFORMA — vistas
   ========================================================================== */

function kpi(l, v, d, bad) {
  return '<div class="kpi"><p class="kpi__label">' + l + '</p><p class="kpi__value">' + v + '</p><p class="kpi__delta' + (bad ? ' is-bad' : '') + '">' + d + '</p></div>';
}
function quick(ico, t, d, attr) {
  return '<button class="quick__item" ' + (attr || '') + '><svg><use href="#' + ico + '"/></svg><b>' + t + '</b><span>' + d + '</span></button>';
}
function tl(t, s, p) {
  return '<li><span class="timeline__dot"></span><div class="timeline__body"><b>' + t + '</b><span>' + s + '</span><p>' + p + '</p></div></li>';
}
function tabla(lista) {
  return '<table class="tbl"><thead><tr><th>Prospecto</th><th>Cobertura</th><th>Plan</th><th>Estado</th><th>Asesor</th><th>Último contacto</th></tr></thead><tbody>' +
    lista.map(function (p) {
      var c = cober(p.cob);
      return '<tr>' +
        '<td><div class="tbl__name"><span class="avatar" style="width:28px;height:28px;font-size:.66rem">' + iniciales(p.n) + '</span><span><b>' + esc(p.n) + '</b><span>' + p.dni + '</span></span></div></td>' +
        '<td><div class="tbl__name"><img class="tbl__logo" src="' + c.logo + '" alt=""><span>' + esc(c.nombre) + '</span></div></td>' +
        '<td>' + esc(p.plan) + '</td><td>' + pill(p.est) + '</td><td>' + esc(p.ases) + '</td>' +
        '<td>' + (p.dias === 0 ? 'Hoy' : p.dias === 1 ? 'Ayer' : 'Hace ' + p.dias + ' días') + '</td></tr>';
    }).join('') + '</tbody></table>';
}
function campo(l, v) { return '<div class="field"><label>' + l + '</label><input type="text" value="' + esc(v) + '" readonly></div>'; }
function select(l, opts) { return '<div class="field"><label>' + l + '</label><select>' + opts.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select></div>'; }
function docs() {
  return '<ul class="doclist">' + DOCS_VENTA.map(function (d) {
    return '<li><svg><use href="#i-doc"/></svg>' + esc(d.n) + '<span class="pill pill--' + d.e + '">' + DOC_EST[d.e] + '</span></li>';
  }).join('') + '</ul>';
}

function vEscritorio() {
  return '<div class="view view--dashboard">' +
    '<div class="view__head"><div><span class="view__eyebrow">Gestión comercial</span><h1 class="view__title">Panel comercial</h1><p class="view__sub">Martes 2 de septiembre · Resumen de actividad del equipo</p></div>' +
    '<div class="view__actions"><button class="btn btn--outline btn--sm" data-view="cotizaciones">Nueva cotización</button><button class="btn btn--azul btn--sm" data-view="ventas">Nueva oportunidad</button></div></div>' +
    '<div class="dashboard-layout"><main class="dashboard-main">' +
      '<div class="dash-kpis">' + kpi('Nuevas oportunidades', '38', '<b>+18%</b> vs. mes anterior') + kpi('Ventas cerradas', '19', '<b>+24%</b> vs. mes anterior') + kpi('Solicitudes activas', '27', '<b>+12%</b> en seguimiento') + '</div>' +
      '<div class="dashboard-grid">' +
        '<section class="panel panel--funnel"><div class="panel__head"><h2 class="panel__title">Oportunidades por etapa</h2><button class="panel__link" data-view="pipeline">Ver embudo</button></div><div class="funnel-wrap"><div class="funnel" aria-label="Embudo de oportunidades"><i style="--w:100%;--c:#4338ca"></i><i style="--w:82%;--c:#2563eb"></i><i style="--w:64%;--c:#0891b2"></i><i style="--w:46%;--c:#14b8a6"></i><i style="--w:30%;--c:#2dd4bf"></i></div><ul class="funnel-legend"><li><i style="--c:#4338ca"></i><span>Nuevas</span><b>38</b></li><li><i style="--c:#2563eb"></i><span>Contacto</span><b>26</b></li><li><i style="--c:#0891b2"></i><span>Cotización</span><b>18</b></li><li><i style="--c:#14b8a6"></i><span>Propuesta</span><b>12</b></li><li><i style="--c:#2dd4bf"></i><span>Cierre</span><b>7</b></li></ul></div></section>' +
        '<section class="panel"><div class="panel__head"><h2 class="panel__title">Actividad reciente</h2><button class="panel__link" data-view="prospectos">Ver toda</button></div><ul class="activity-list"><li><span class="activity-ico"><svg><use href="#i-users"/></svg></span><span><b>Llamada con María Gómez</b><small>Seguimiento comercial</small></span><time>11:30</time></li><li><span class="activity-ico"><svg><use href="#i-doc"/></svg></span><span><b>Cotización enviada a Carlos López</b><small>Swiss Medical · SMG30</small></span><time>10:15</time></li><li><span class="activity-ico"><svg><use href="#i-shield"/></svg></span><span><b>Nueva solicitud de Ana Fernández</b><small>Ingresó desde la web</small></span><time>Ayer</time></li><li><span class="activity-ico"><svg><use href="#i-plus"/></svg></span><span><b>Cambio de plan de Laura Pérez</b><small>Documentación completa</small></span><time>01/09</time></li></ul></section>' +
        '<section class="panel"><div class="panel__head"><h2 class="panel__title">Ventas por prepaga</h2><button class="panel__link" data-view="reportes">Ver detalle</button></div><div class="sales-split"><div class="donut"><span><b>19</b><small>ventas</small></span></div><ul class="sales-legend"><li><i style="--c:#4338ca"></i>Swiss Medical <b>35%</b></li><li><i style="--c:#0891b2"></i>Galeno <b>27%</b></li><li><i style="--c:#14b8a6"></i>Omint <b>22%</b></li><li><i style="--c:#c4b5fd"></i>Otras <b>16%</b></li></ul></div></section>' +
        '<section class="panel"><div class="panel__head"><h2 class="panel__title">Evolución de ventas</h2><span class="trend-up">+16%</span></div><div class="chart-bars" aria-label="Evolución mensual"><i style="--h:31%"><span>Mar</span></i><i style="--h:46%"><span>Abr</span></i><i style="--h:42%"><span>May</span></i><i style="--h:61%"><span>Jun</span></i><i style="--h:74%"><span>Jul</span></i><i style="--h:92%"><span>Ago</span></i></div></section>' +
      '</div>' +
    '</main><aside class="dashboard-rail">' +
      '<section class="wallet-card"><span class="wallet-card__ico"><svg><use href="#i-wallet"/></svg></span><p>Tu monedero</p><small>Saldo disponible</small><strong>$ 124.500</strong><div><span>Próxima liquidación</span><b>$ 86.450</b></div><button data-view="monedero">Ver movimientos <svg><use href="#i-arrow"/></svg></button></section>' +
      '<section class="panel"><div class="panel__head"><h2 class="panel__title">Próximas actividades</h2><button class="panel__link" data-view="agenda">Ver agenda</button></div><ul class="agenda-list"><li><time><b>04</b>SEP</time><span><b>Reunión con María Gómez</b><small>11:00 · Videollamada</small></span></li><li><time><b>05</b>SEP</time><span><b>Seguimiento cotización</b><small>10:30 · WhatsApp</small></span></li><li><time><b>08</b>SEP</time><span><b>Presentación empresa</b><small>15:00 · Presencial</small></span></li></ul></section>' +
      '<section class="panel"><div class="panel__head"><h2 class="panel__title">Accesos rápidos</h2></div><div class="quick quick--compact">' + quick('i-calc', 'Cotizador', 'Comparar planes', 'data-view="cotizaciones"') + quick('i-doc', 'Nueva venta', 'Cargar operación', 'data-view="ventas"') + quick('i-tools', 'Herramientas', 'Recursos de venta', 'data-view="herramientas"') + quick('i-book', 'Capacitación', 'Material del equipo', 'data-view="biblioteca"') + '</div></section>' +
    '</aside></div></div>';
}

function vHerramientas() {
  return '<div class="view view--hub"><div class="view__head"><div><span class="view__eyebrow">Fortior Hub</span><h1 class="view__title">Centro de herramientas</h1><p class="view__sub">Todo lo que necesitás para asesorar y vender, en un solo lugar.</p></div><div class="view__actions"><button class="btn btn--azul btn--sm" data-view="cotizaciones">Abrir cotizador</button></div></div>' +
    '<section class="hub-section"><div class="panel__head"><div><span class="hub-label">Trabajá por compañía</span><h2>Elegí una prepaga</h2></div><button class="panel__link" data-view="coberturas">Ver todas</button></div><div class="hub-coverages">' + COBERTURAS.slice(0, 5).map(function (c) { return '<button class="hub-cober" data-ficha="' + c.id + '"><img src="' + c.logo + '" alt="' + esc(c.nombre) + '"><ul><li>Cotizar</li><li>Planes y cartilla</li><li>Nueva venta</li></ul><span>Ir a ' + esc(c.nombre) + ' <svg><use href="#i-arrow"/></svg></span></button>'; }).join('') + '<button class="hub-cober hub-cober--all" data-view="coberturas"><span class="hub-plus">+</span><b>Ver todas<br>las prepagas</b></button></div></section>' +
    '<section class="hub-strip"><div><span>Accesos rápidos</span><p>Las tareas que más usás, siempre a mano.</p></div>' + quick('i-calc', 'Cotizador online', 'Compará planes', 'data-view="cotizaciones"') + quick('i-doc', 'Nueva venta', 'Cargá una operación', 'data-view="ventas"') + quick('i-shield', 'Opción de cambio', 'Consultá el estado') + quick('i-calc', 'Calculadora', 'Estimá aportes') + '</section>' +
    '<section class="hub-section"><div class="panel__head"><div><span class="hub-label">Recursos visuales</span><h2>Herramientas destacadas</h2></div></div><div class="hub-features"><article class="hub-feature hub-feature--photo" style="--bg:url(images/detalle-firma-1600x1300.webp)"><span>Comparador</span><h3>Planes claros.<br>Decisiones simples.</h3><p>Compará precios y coberturas en segundos.</p><button data-view="cotizaciones">Abrir herramienta <svg><use href="#i-arrow"/></svg></button></article><article class="hub-feature"><span>Argumentarios</span><h3>La información justa para cada conversación.</h3><p>Beneficios, objeciones y respuestas listas para compartir.</p><button>Explorar recursos <svg><use href="#i-arrow"/></svg></button></article><article class="hub-feature hub-feature--photo hub-feature--violet" style="--bg:url(images/escena-consulta-1920x1080.webp)"><span>Capacitación</span><h3>Aprendé. Vendé.<br>Resolvé.</h3><p>Contenido práctico para potenciar tus resultados.</p><button data-view="biblioteca">Ver contenidos <svg><use href="#i-arrow"/></svg></button></article></div></section>' +
    '<div class="hub-news-grid"><section class="panel"><div class="panel__head"><h2 class="panel__title">Novedades comerciales</h2><button class="panel__link">Ver todas</button></div><ul class="hub-news"><li><img src="images/escena-corporativa-1920x1080.webp" alt=""><span><em>Nuevo</em><b>Nuevos planes corporativos</b><small>Conocé beneficios y diferenciales.</small></span><time>03/09</time></li><li><img src="images/escena-salud-1600x1300.webp" alt=""><span><em>Actualización</em><b>Cambios en cartillas</b><small>Redes y prestadores actualizados.</small></span><time>02/09</time></li></ul></section><section class="panel"><div class="panel__head"><h2 class="panel__title">Próximos webinars</h2><button class="panel__link" data-view="agenda">Calendario</button></div><ul class="agenda-list"><li><time><b>09</b>SEP</time><span><b>Novedades Swiss Medical</b><small>11:00 · 40 minutos</small></span></li><li><time><b>16</b>SEP</time><span><b>Venta consultiva efectiva</b><small>16:00 · 60 minutos</small></span></li></ul></section></div>' +
  '</div>';
}

function vBiblioteca() {
  return '<div class="view"><div class="view__head"><div><h1 class="view__title">Instructivos</h1><p class="view__sub">Material de consulta y capacitación para el equipo</p></div><div class="view__actions"><button class="btn btn--outline btn--sm">Subir material</button></div></div>' +
    '<div class="tools__grid">' + INSTRUCTIVOS.map(function (i) {
      return '<button class="tool"><span class="tool__ico"><svg><use href="#i-doc"/></svg></span><span><b>' + esc(i.n) + '</b><span>' + i.t + ' · actualizado ' + i.up + '</span></span></button>';
    }).join('') + '</div></div>';
}

function vCoberturas() {
  return '<div class="view"><div class="view__head"><div><h1 class="view__title">Coberturas</h1><p class="view__sub">Nueve compañías. Entrá a una para ver accesos, requisitos y material</p></div></div>' +
    '<div class="tools__grid">' + COBERTURAS.map(function (c) {
      return '<button class="tool" data-ficha="' + c.id + '" style="align-items:center"><img src="' + c.logo + '" alt="" style="width:56px;height:40px;object-fit:contain;flex:0 0 auto"><span><b>' + esc(c.nombre) + '</b><span>' + esc(c.alcance) + ' · ' + c.planes.length + ' planes</span></span></button>';
    }).join('') + '</div></div>';
}

function vFicha(id) {
  var c = cober(id);
  return '<div class="view">' +
    '<div class="view__head"><div><button class="panel__link" data-view="coberturas" style="margin:0 0 .5rem;display:block">&lsaquo; Coberturas</button><h1 class="view__title">' + esc(c.nombre) + '</h1><p class="view__sub">' + esc(c.desc) + '</p></div>' +
    '<div class="view__actions"><span class="pill pill--ok">Actualizada 01/09/2026</span></div></div>' +
    '<div class="ficha__hero"><span class="ficha__logo"><img src="' + c.logo + '" alt="' + esc(c.nombre) + '"></span>' +
      '<div><p class="kpi__label">Alcance</p><p style="font-weight:700">' + esc(c.alcance) + '</p></div>' +
      '<div><p class="kpi__label">Tipos de afiliación</p><p style="font-weight:700">' + esc(c.afiliados) + '</p></div></div>' +
    '<div class="ficha__links">' + quick('i-link', c.cotizador, 'Cotizador externo') + quick('i-link', c.app, 'Aplicación móvil') + quick('i-doc', 'Instructivo para cotizar', 'PDF · 6 páginas') + quick('i-book', 'Reglamento de cruces', 'PDF · vigente 2026') + '</div>' +
    '<div class="grid-2 grid-2--even">' +
      '<section class="panel"><div class="panel__head"><h2 class="panel__title">Planes</h2></div><div class="planes">' + c.planes.map(function (p) {
        return '<article class="plan"><span class="plan__tag">' + esc(p.t) + '</span><h3 class="plan__name">' + esc(p.n) + '</h3>' + meter(p.nivel) + '<ul class="chev plan__feats">' + p.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></article>';
      }).join('') + '</div></section>' +
      '<div class="stack">' +
        '<section class="panel"><div class="panel__head"><h2 class="panel__title">Documentación de ingreso</h2></div>' + docs() + '</section>' +
        '<section class="panel"><div class="panel__head"><h2 class="panel__title">Material comercial</h2></div><div class="tools__grid">' +
          '<button class="tool"><span class="tool__ico"><svg><use href="#i-doc"/></svg></span><span><b>Flyer particulares</b><span>JPG · 1080x1350</span></span></button>' +
          '<button class="tool"><span class="tool__ico"><svg><use href="#i-doc"/></svg></span><span><b>Flyer corporativo</b><span>PDF · A4</span></span></button>' +
          '<button class="tool"><span class="tool__ico"><svg><use href="#i-book"/></svg></span><span><b>Cartilla por zona</b><span>PDF · 2026</span></span></button>' +
          '<button class="tool"><span class="tool__ico"><svg><use href="#i-link"/></svg></span><span><b>Video: cómo usar la app</b><span>YouTube · 4:12</span></span></button>' +
        '</div></section>' +
        '<section class="panel" style="background:var(--warn-bg);border-color:transparent"><div class="panel__head"><h2 class="panel__title" style="color:var(--warn)">Observaciones internas</h2></div>' +
          '<p style="font-size:.84rem;color:var(--warn)">Las altas por opción de cambio se presentan antes del día 20 para que tomen el mes siguiente. Grupos familiares de más de 4 integrantes requieren autorización previa del ejecutivo de cuenta.</p></section>' +
      '</div></div></div>';
}

function vProspectos() {
  return '<div class="view"><div class="view__head"><div><h1 class="view__title">Prospectos</h1><p class="view__sub">' + PROSPECTOS.length + ' registros · 3 asesores</p></div>' +
    '<div class="view__actions"><button class="btn btn--outline btn--sm">Exportar a Excel</button><button class="btn btn--azul btn--sm">Nuevo prospecto</button></div></div>' +
    '<div class="tabs"><button class="tab is-on">Todos</button><button class="tab">Sin contactar</button><button class="tab">En seguimiento</button><button class="tab">Documentación pendiente</button><button class="tab">Observadas</button><button class="tab">Corporativo</button></div>' +
    '<section class="panel"><div class="tbl-wrap">' + tabla(PROSPECTOS) + '</div></section></div>';
}

function vCotizaciones() {
  var p = PROSPECTOS[0];
  return '<div class="view">' +
    '<div class="view__head"><div><h1 class="view__title">Cotizaciones</h1><p class="view__sub">' + esc(p.n) + ' · ' + p.dni + ' · relación de dependencia · aporta ' + ars(168000) + ' por mes</p></div>' +
    '<div class="view__actions"><button class="btn btn--outline btn--sm">Copiar para el cliente</button><button class="btn btn--azul btn--sm">Nueva cotización</button></div></div>' +
    '<div class="kpis">' + kpi('Cotizaciones', '4', '2 compañías más disponibles') + kpi('Mejor precio', ars(352400), 'Medifé Integral 300') + kpi('Elegida', 'SMG30', 'Swiss Medical · ' + ars(412300)) + kpi('Vencen', '27/09', '<b>25 días</b> para decidir') + '</div>' +
    '<div class="cot-grid">' + COTIZACIONES.map(function (q) {
      var c = cober(q.cob);
      return '<article class="cot' + (q.elegida ? ' is-chosen' : '') + '">' +
        (q.elegida ? '<span class="pill pill--info cot__badge">Elegida</span>' : '') +
        '<div class="cot__head"><img src="' + c.logo + '" alt=""><div><b>' + esc(c.nombre) + '</b><span>' + esc(q.plan) + '</span></div></div>' +
        '<div class="cot__price">' + ars(q.total - q.aporte) + '<small>A pagar por mes</small></div>' +
        '<div class="cot__rows"><div><span>Valor del plan</span><b>' + ars(q.total) + '</b></div><div><span>Aporte derivado</span><b>- ' + ars(q.aporte) + '</b></div><div><span>Cotizada</span><b>' + q.fecha + '</b></div><div><span>Vigente hasta</span><b>' + q.vence + '</b></div></div>' +
        '<div class="cot__foot"><button class="btn btn--outline btn--sm">PDF</button><button class="btn btn--sm ' + (q.elegida ? 'btn--azul' : 'btn--outline') + '">' + (q.elegida ? 'Elegida' : 'Elegir') + '</button></div>' +
      '</article>';
    }).join('') + '</div>' +
    '<section class="panel" style="margin-top:1rem"><div class="panel__head"><h2 class="panel__title">Historial</h2></div><ul class="timeline">' +
      tl('Eligió Swiss Medical SMG30', '30/08 18:20', 'Confirmado por WhatsApp. Pasa a documentación.') +
      tl('Se enviaron 4 cotizaciones', '28/08 12:05', 'Por correo y WhatsApp, con comparativa en PDF.') +
      tl('Aportes verificados', '28/08 10:40', 'Aporte mensual ' + ars(168000) + ', apto para opción de cambio.') +
    '</ul></section></div>';
}

function vPipeline() {
  return '<div class="view view--pipeline"><div class="view__head"><div><h1 class="view__title">Pipeline</h1><p class="view__sub">La operación completa, de la consulta a la afiliación</p></div></div>' +
    '<div class="board">' + PIPELINE.map(function (col) {
      var items = PROSPECTOS.filter(function (p) { return p.est === col.k; });
      return '<div class="board__col"><div class="board__head">' + esc(col.l) + '<span class="board__count">' + items.length + '</span></div>' +
        items.map(function (p) { var c = cober(p.cob); return '<div class="board__card"><b>' + esc(p.n) + '</b><div class="board__meta"><img class="tbl__logo" src="' + c.logo + '" alt="">' + esc(p.plan) + '</div><div class="board__meta">' + esc(p.ases) + ' · ' + esc(p.origen) + '</div></div>'; }).join('') +
      '</div>';
    }).join('') + '</div></div>';
}

function vVentas() {
  return '<div class="view"><div class="view__head"><div><h1 class="view__title">Carga de venta</h1><p class="view__sub">Un solo formulario: datos, documentación y observaciones viven en la misma operación</p></div><div class="view__actions"><span class="pill pill--warn">Borrador</span></div></div>' +
    '<div class="tabs"><button class="tab is-on">Datos del titular</button><button class="tab">Grupo familiar</button><button class="tab">Cobertura y plan</button><button class="tab">Documentación</button><button class="tab">Corporativo</button><button class="tab">Historial</button></div>' +
    '<div class="grid-2">' +
      '<section class="panel"><div class="panel__head"><h2 class="panel__title">Datos del titular</h2></div><div class="form-grid">' +
        campo('Nombre y apellido', 'Rodrigo Cabrera') + campo('DNI', '34.812.660') + campo('CUIL', '20-34812660-4') + campo('Fecha de nacimiento', '14/06/1989') +
        campo('Teléfono', '11 5412-8890') + campo('Correo electrónico', 'rcabrera@correo.com') + campo('Localidad', 'Vicente López') + campo('Provincia', 'Buenos Aires') +
        select('Situación laboral', ['Relación de dependencia', 'Monotributo', 'Particular', 'Autónomo']) + select('Obra social actual', ['OSDE', 'OSECAC', 'OSPRERA', 'Sin obra social']) +
        select('Cobertura solicitada', COBERTURAS.map(function (c) { return c.nombre; })) + select('Origen del contacto', ['WhatsApp', 'Web', 'Instagram', 'Referido', 'Llamada', 'Corporativo']) +
      '</div><div class="form-note">Demo: el formulario no guarda información. Los campos vienen precargados para mostrar el diseño.</div></section>' +
      '<div class="stack">' +
        '<section class="panel"><div class="panel__head"><h2 class="panel__title">Documentación</h2><span class="panel__link">4 de 7</span></div>' + docs() + '<button class="btn btn--outline btn--sm btn--block" style="margin-top:1rem">Adjuntar archivos</button></section>' +
        '<section class="panel"><div class="panel__head"><h2 class="panel__title">Historial</h2></div><ul class="timeline">' +
          tl('Venta presentada a Swiss Medical', '01/09 16:20', 'Cargada por M. Álvarez con 6 de 7 documentos.') + tl('Documentación completada', '30/08 11:05', 'Se adjuntaron los recibos de sueldo.') +
          tl('Cotización aceptada', '28/08 18:40', 'El titular eligió el plan SMG30.') + tl('Prospecto creado', '26/08 10:15', 'Ingresó por WhatsApp desde la landing.') +
        '</ul></section>' +
    '</div></div></div>';
}

function vAgenda() {
  var dias = [
    { d: 'Lunes', n: '04', e: [['09:30', 'Revisión de documentación', 'Rodrigo Cabrera'], ['15:00', 'Presentación corporativa', 'Grupo Marlex SRL']] },
    { d: 'Martes', n: '05', e: [['10:30', 'Seguimiento de cotización', 'María Gómez'], ['16:00', 'Webinar Swiss Medical', 'Equipo comercial']] },
    { d: 'Miércoles', n: '06', e: [['11:00', 'Llamada de cierre', 'Carlos López']] },
    { d: 'Jueves', n: '07', e: [['09:00', 'Alta de nueva venta', 'Ana Fernández'], ['13:30', 'Control de cartera', 'Equipo comercial']] },
    { d: 'Viernes', n: '08', e: [['10:00', 'Capacitación interna', 'Objeciones frecuentes'], ['14:00', 'Cierre semanal', 'Revisión de resultados']] }
  ];
  return '<div class="view"><div class="view__head"><div><span class="view__eyebrow">Organización</span><h1 class="view__title">Agenda comercial</h1><p class="view__sub">Reuniones, seguimientos y vencimientos de esta semana.</p></div><div class="view__actions"><button class="btn btn--azul btn--sm">Nueva actividad</button></div></div><div class="calendar-board">' + dias.map(function (dia, i) {
    return '<section class="calendar-day"><p>' + dia.d + '<b>' + dia.n + '</b></p>' + dia.e.map(function (ev, j) { return '<article class="calendar-event' + ((i + j) % 2 ? ' calendar-event--teal' : '') + '"><b>' + ev[0] + ' · ' + ev[1] + '</b><small>' + ev[2] + '</small></article>'; }).join('') + '</section>';
  }).join('') + '</div></div>';
}

function vMonedero() {
  return '<div class="view"><div class="view__head"><div><span class="view__eyebrow">Comisiones</span><h1 class="view__title">Mi monedero</h1><p class="view__sub">Saldo, liquidaciones y movimientos comerciales.</p></div><div class="view__actions"><button class="btn btn--outline btn--sm">Descargar resumen</button></div></div>' +
    '<div class="wallet-view-grid"><section class="wallet-card"><span class="wallet-card__ico"><svg><use href="#i-wallet"/></svg></span><p>Saldo disponible</p><small>Comisiones acreditadas</small><strong>$ 124.500</strong><div><span>Próxima liquidación · 06/09</span><b>$ 86.450</b></div><button>Solicitar retiro <svg><use href="#i-arrow"/></svg></button></section>' +
    '<div class="stack"><div class="kpis">' + kpi('Comisiones del mes', '$ 210.950', '<b>+12%</b> vs. agosto') + kpi('Ventas liquidadas', '14', '<b>3</b> esta semana') + kpi('Pendiente', '$ 52.300', 'Se acredita al aprobar') + '</div>' +
    '<section class="panel"><div class="panel__head"><h2 class="panel__title">Últimos movimientos</h2><button class="panel__link">Ver todos</button></div>' +
      '<div class="movement"><span class="movement__ico"><svg><use href="#i-plus"/></svg></span><span><b>Comisión · Swiss Medical SMG30</b><small>Rodrigo Cabrera · 03/09</small></span><strong>+$ 28.600</strong></div>' +
      '<div class="movement"><span class="movement__ico"><svg><use href="#i-plus"/></svg></span><span><b>Comisión · Galeno Oro 440</b><small>Grupo Marlex SRL · 01/09</small></span><strong>+$ 41.200</strong></div>' +
      '<div class="movement movement--out"><span class="movement__ico"><svg><use href="#i-wallet"/></svg></span><span><b>Retiro acreditado</b><small>Transferencia bancaria · 30/08</small></span><strong>-$ 75.000</strong></div>' +
      '<div class="movement"><span class="movement__ico"><svg><use href="#i-plus"/></svg></span><span><b>Premio por objetivo mensual</b><small>Agosto 2026 · 29/08</small></span><strong>+$ 32.500</strong></div>' +
    '</section></div></div></div>';
}

function vReportes() {
  var porCober = COBERTURAS.map(function (c) { return { n: c.nombre, v: PROSPECTOS.filter(function (p) { return p.cob === c.id; }).length }; }).sort(function (a, b) { return b.v - a.v; });
  var max = Math.max.apply(null, porCober.map(function (x) { return x.v; })) || 1;
  return '<div class="view"><div class="view__head"><div><h1 class="view__title">Reportes</h1><p class="view__sub">Septiembre 2026 · equipo completo</p></div><div class="view__actions"><button class="btn btn--outline btn--sm">Exportar PDF</button><button class="btn btn--outline btn--sm">Exportar Excel</button></div></div>' +
    '<div class="kpis">' + kpi('Conversión general', '31%', '<b>+4 pts</b> vs. agosto') + kpi('Tiempo medio de cierre', '9 días', '<b>-2 días</b> vs. agosto') + kpi('Cotizaciones por venta', '2,8', 'estable') + kpi('Ventas rechazadas', '4', '<b>2</b> por documentación', true) + '</div>' +
    '<div class="grid-2">' +
      '<section class="panel"><div class="panel__head"><h2 class="panel__title">Prospectos por cobertura</h2></div>' + porCober.map(function (x) {
        return '<div class="barrow"><span>' + esc(x.n) + '</span><span class="bar"><i style="width:' + Math.round(x.v / max * 100) + '%"></i></span><b>' + x.v + '</b></div>';
      }).join('') + '</section>' +
      '<section class="panel"><div class="panel__head"><h2 class="panel__title">Actividad por asesor</h2></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Asesor</th><th>Prospectos</th><th>Cotizaciones</th><th>Ventas</th></tr></thead><tbody>' +
        [['Micaela Álvarez', 14, 22, 8], ['Juan Sosa', 12, 18, 6], ['Carla Duarte', 12, 14, 5]].map(function (r) {
          return '<tr><td><div class="tbl__name"><span class="avatar" style="width:28px;height:28px;font-size:.66rem">' + iniciales(r[0]) + '</span><b>' + r[0] + '</b></div></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
        }).join('') + '</tbody></table></div></section>' +
    '</div></div>';
}

var VISTAS = { escritorio: vEscritorio, herramientas: vHerramientas, biblioteca: vBiblioteca, coberturas: vCoberturas, prospectos: vProspectos, cotizaciones: vCotizaciones, pipeline: vPipeline, ventas: vVentas, agenda: vAgenda, monedero: vMonedero, reportes: vReportes };

function verApp(nombre, arg) {
  var cont = $('#appView');
  cont.innerHTML = arg ? vFicha(arg) : (VISTAS[nombre] || vEscritorio)();
  window.scrollTo(0, 0);
  $$('.side__link').forEach(function (b) { b.classList.toggle('is-on', b.dataset.view === (arg ? 'coberturas' : nombre)); });
  $('#side').classList.remove('is-open'); $('#appScrim').classList.remove('is-on');
}

function initApp() {
  document.addEventListener('click', function (e) {
    var v = e.target.closest('[data-view]'); if (v) { verApp(v.dataset.view); return; }
    var f = e.target.closest('[data-ficha]'); if (f) { verApp('coberturas', f.dataset.ficha); return; }
    var t = e.target.closest('.tab'); if (t) { $$('.tab', t.parentNode).forEach(function (x) { x.classList.remove('is-on'); }); t.classList.add('is-on'); }
  });
  var side = $('#side'), scrim = $('#appScrim'), toggle = $('#sideToggle');
  function syncToggle() { toggle.style.display = window.innerWidth <= 860 ? 'grid' : 'none'; }
  syncToggle(); window.addEventListener('resize', syncToggle);
  toggle.addEventListener('click', function () { side.classList.add('is-open'); scrim.classList.add('is-on'); });
  scrim.addEventListener('click', function () { side.classList.remove('is-open'); scrim.classList.remove('is-on'); });
}

/* ==========================================================================
   8. Comparador y atajos del sitio
   ========================================================================== */

function initPublicoEventos() {
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-chip]');
    if (chip) { $$('.chip').forEach(function (c) { c.classList.remove('is-on'); }); chip.classList.add('is-on'); pintarPlanes(chip.dataset.chip); return; }
    var logo = e.target.closest('[data-cober]');
    if (logo) { var t = $('[data-chip="' + logo.dataset.cober + '"]'); if (t) t.click(); $('#planes').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; }
    var link = e.target.closest('[data-chip-link]');
    if (link) { var t2 = $('[data-chip="' + link.dataset.chipLink + '"]'); if (t2) t2.click(); }
  });
  $('#demoFlag').addEventListener('click', function () {
    alert('Demo de presentación de Fortior Broker.\n\nEs una maqueta visual: el ingreso no valida usuario, los formularios no guardan datos y los enlaces a organismos no están conectados.\n\nTodo el contenido (prospectos, planes, cotizaciones, novedades) es inventado para mostrar el diseño.');
  });
}

function init() {
  renderPublico(); initHero(); initReveals(); initNav(); initLogin(); initApp(); initPublicoEventos();
  var vistaDirecta = new URLSearchParams(window.location.search).get('view');
  if (vistaDirecta && VISTAS[vistaDirecta]) { document.body.classList.add('is-app'); verApp(vistaDirecta); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
