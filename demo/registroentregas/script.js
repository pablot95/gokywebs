'use strict';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CLAVE = 'gk-registroentregas-v1';
const CLAVE_SESION = 'gk-registroentregas-sesion';
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MOTIVOS = ['Es otra familia que vive en la misma casa', 'Autorizado por la coordinación', 'Otro motivo'];
const EJEMPLOS = ['Ramírez', 'Los Aromos 1520', 'Benítez', 'Ojeda', '33298456'];
const MAX_RESULTADOS = 8;

const MUESTRA = [
  ['Ana', 'Ramírez', '32415876', 'Los Aromos 1520', 2, 3, '11 3264-1187', ''],
  ['Luis', 'Ramírez', '35112904', 'Los Aromos 1520', 1, 0, '11 5821-4410', ''],
  ['Carla', 'Gómez', '40221553', 'Los Aromos 1520', 1, 2, '11 6034-2291', ''],
  ['Rosa', 'Benítez', '27884310', 'Manzana 4 Casa 12', 2, 4, '11 4977-3102', ''],
  ['Brenda', 'Benítez', '43017265', 'Mz. 4 Casa 12', 1, 1, '11 3390-7714', ''],
  ['Jorge', 'Sosa', '30552781', 'Belgrano 450', 2, 2, '11 2745-9036', ''],
  ['Daniela', 'Ojeda', '38904127', 'Av. Belgrano 450 dpto. 2', 1, 2, '11 6612-0458', ''],
  ['Graciela', 'Ledesma', '25670143', 'Pasaje 14 Nº 233', 1, 0, '11 4128-5567', ''],
  ['Marcelo', 'Villalba', '33298456', 'Pje. 14 233', 2, 3, '11 5503-8821', ''],
  ['María', 'Fernández', '29341778', 'Sarmiento 1180', 2, 1, '11 3871-2290', ''],
  ['Silvia', 'López', '26115902', 'Mitre 742', 1, 2, '11 4402-6135', ''],
  ['Héctor', 'Acosta', '22908341', 'Rivadavia 2310', 2, 0, '11 6278-1149', ''],
  ['Lorena', 'Acosta', '35887021', 'Rivadavia 2310', 1, 2, '11 2956-4470', ''],
  ['Norma', 'Díaz', '20447815', 'San Martín 95', 1, 0, '11 4719-0362', 'Retira su hija con autorización firmada'],
  ['Nahuel', 'Cabrera', '42580317', 'Los Ceibos 1044', 1, 1, '11 5164-9927', ''],
  ['Cintia', 'Romero', '39662048', 'Las Acacias 318', 2, 4, '11 3047-5583', 'Un niño celíaco: separar productos sin TACC'],
  ['Romina', 'Giménez', '36745120', 'Manzana 7 Casa 3', 2, 3, '11 6890-2214', ''],
  ['Julio', 'Herrera', '24019663', 'Moreno 1501', 2, 2, '11 4351-7708', ''],
  ['Valeria', 'Medina', '37406882', 'Calle 9 Nº 120', 1, 3, '11 2289-6641', ''],
  ['Mirta', 'Aguirre', '18765430', 'Las Heras 860', 1, 0, '', ''],
  ['Cristian', 'Quiroga', '34871259', 'Juan B. Justo 2045', 2, 2, '11 5732-0186', ''],
  ['Yanina', 'Molina', '41203376', 'Manzana 2 Casa 8', 1, 2, '11 6145-3379', ''],
  ['Ramón', 'Castro', '21550297', 'Alsina 377', 2, 1, '11 4063-8852', ''],
  ['Patricia', 'Ríos', '28133904', 'Los Aromos 1488', 2, 2, '11 3518-2047', ''],
  ['Micaela', 'Paz', '44120558', 'Colón 612', 1, 1, '11 6720-5513', ''],
  ['Gladys', 'Duarte', '19982765', 'Pasaje 6 Nº 41', 1, 0, '11 2871-0934', ''],
  ['Jonathan', 'Vera', '40987112', 'Sarmiento 1220', 2, 3, '11 5096-4428', ''],
  ['Elsa', 'Ayala', '23411580', 'Brown 930', 1, 1, '11 4285-6671', ''],
  ['Rocío', 'Juárez', '42015633', 'Manzana 9 Casa 21', 1, 2, '11 3629-1580', ''],
  ['Marcelo', 'Correa', '31770248', 'Lavalle 1305', 2, 2, '11 5548-2763', ''],
  ['Sofía', 'Toledo', '45338190', 'Las Acacias 402', 1, 1, '11 6307-9145', ''],
  ['Lucas', 'Peralta', '38215774', 'Garibaldi 88', 2, 0, '11 2410-3856', ''],
  ['Gabriela', 'Sosa', '33650912', 'Belgrano 1730', 2, 3, '11 4796-2031', ''],
  ['Teresa', 'Villalba', '17890456', 'Calle 11 Nº 560', 1, 0, '', ''],
  ['Diego', 'Benítez', '36001245', 'Mitre 1120', 2, 2, '11 5317-6604', ''],
  ['Florencia', 'Ojeda', '41764093', 'Garibaldi 210', 1, 2, '11 6458-7792', '']
];
const RETIRARON_HOY = ['p01', 'p06', 'p08', 'p10', 'p04', 'p12', 'p15', 'p11'];

const ic = d => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC = {
  verde: ic('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>'),
  naranja: ic('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  rojo: ic('<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>'),
  casa: ic('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
  check: ic('<path d="M20 6 9 17l-5-5"/>'),
  info: ic('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  descarga: ic('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'),
  chevron: ic('<path d="m6 9 6 6 6-6"/>'),
  persona: ic('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>'),
  papelera: ic('<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>')
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sinAcentos = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const normTexto = s => sinAcentos(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const soloDigitos = s => String(s ?? '').replace(/\D/g, '');
const fmtDni = d => soloDigitos(d).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const dos = n => String(n).padStart(2, '0');
const isoDe = d => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
const hoyISO = () => isoDe(new Date());
const fechaDe = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const horaDe = min => `${dos(Math.floor(min / 60))}:${dos(min % 60)}`;
const horaAhora = () => { const d = new Date(); return horaDe(d.getHours() * 60 + d.getMinutes()); };
const fechaCorta = iso => { const d = fechaDe(iso); return `${DIAS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; };
const fechaLarga = iso => { const d = fechaDe(iso); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const fechaNumerica = iso => { const d = fechaDe(iso); return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`; };
const mayuscula = s => s.charAt(0).toUpperCase() + s.slice(1);
const cuando = iso => (iso === hoyISO() ? 'hoy' : `el ${fechaCorta(iso)}`);
const nombreDe = p => `${p.apellido}, ${p.nombre}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const totalDe = x => (Number(x.adultos) || 0) + (Number(x.ninos) || 0);
const numero = n => Number(n).toLocaleString('es-AR');
const nuevoId = pre => pre + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const cmpNombre = (a, b) => a.apellido.localeCompare(b.apellido, 'es') || a.nombre.localeCompare(b.nombre, 'es');
const esEscritorio = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const DOM_EQUIV = new Map([
  ['mz', 'manzana'], ['mza', 'manzana'], ['mzna', 'manzana'], ['manz', 'manzana'],
  ['pje', 'pasaje'], ['psje', 'pasaje'],
  ['dpto', 'depto'], ['dto', 'depto'], ['departamento', 'depto'],
  ['av', ''], ['avda', ''], ['avenida', ''], ['calle', ''],
  ['nro', ''], ['numero', ''], ['num', ''], ['n', ''], ['no', '']
]);

function normDomicilio(s) {
  return sinAcentos(s).toLowerCase()
    .replace(/[º°]/g, ' ')
    .replace(/([a-z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-z])/g, '$1 $2')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(w => (DOM_EQUIV.has(w) ? DOM_EQUIV.get(w) : w))
    .filter(Boolean)
    .join(' ');
}

function distancia(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let previa = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const fila = [i];
    for (let j = 1; j <= b.length; j++) {
      fila[j] = Math.min(previa[j] + 1, fila[j - 1] + 1, previa[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previa = fila;
  }
  return previa[b.length];
}

function domParecido(a, b) {
  if (!a || !b || a === b) return false;
  const corto = a.length < b.length ? a : b;
  const largo = corto === a ? b : a;
  if (largo.startsWith(corto + ' ') && /\d/.test(corto)) return true;
  const numA = a.match(/\d+/g) || [];
  const numB = b.match(/\d+/g) || [];
  if (!numA.length || numA.join(' ') !== numB.join(' ')) return false;
  const letrasA = a.replace(/[\d ]+/g, '');
  const letrasB = b.replace(/[\d ]+/g, '');
  if (letrasA.length < 4 || letrasB.length < 4) return false;
  return distancia(letrasA, letrasB) <= 2;
}

let datos = null;
const estado = { vista: 'entregar', fecha: hoyISO(), filtro: 'todos', abiertas: new Set() };

function persistir() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch (e) {}
}

function guardar() {
  datos.tocado = true;
  persistir();
}

function azarCon(semilla) {
  let s = semilla;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lunesAnteriores(cantidad) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  const atras = (d.getDay() + 6) % 7 || 7;
  d.setDate(d.getDate() - atras);
  const lista = [];
  for (let i = 0; i < cantidad; i++) {
    lista.push(isoDe(d));
    d.setDate(d.getDate() - 7);
  }
  return lista;
}

function generarMuestra() {
  const azar = azarCon(1520);
  const personas = MUESTRA.map((m, i) => ({
    id: 'p' + dos(i + 1), nombre: m[0], apellido: m[1], dni: m[2], domicilio: m[3],
    adultos: m[4], ninos: m[5], telefono: m[6], notas: m[7]
  }));
  const entregas = [];
  let n = 0;
  const sumar = (p, fecha, hora, motivo = '') => {
    n += 1;
    entregas.push({
      id: 'e' + n, personaId: p.id, fecha, hora, motivo,
      nombre: p.nombre, apellido: p.apellido, dni: p.dni, domicilio: p.domicilio,
      telefono: p.telefono, adultos: p.adultos, ninos: p.ninos
    });
  };

  lunesAnteriores(6).reverse().forEach(fecha => {
    const orden = personas.slice();
    for (let i = orden.length - 1; i > 0; i--) {
      const j = Math.floor(azar() * (i + 1));
      [orden[i], orden[j]] = [orden[j], orden[i]];
    }
    const casas = new Set();
    let minuto = 9 * 60 + Math.floor(azar() * 6);
    orden.forEach(p => {
      if (azar() > 0.84) return;
      const casa = normDomicilio(p.domicilio);
      let motivo = '';
      if (casas.has(casa)) {
        if (azar() > 0.22) return;
        motivo = MOTIVOS[0];
      }
      casas.add(casa);
      sumar(p, fecha, horaDe(minuto), motivo);
      minuto += 3 + Math.floor(azar() * 5);
    });
  });

  const ahora = new Date();
  let minuto = ahora.getHours() * 60 + ahora.getMinutes() - 5;
  if (minuto < 9 * 60 + 50) minuto = 10 * 60 + 40;
  const horas = [];
  for (let i = RETIRARON_HOY.length - 1; i >= 0; i--) {
    horas[i] = minuto;
    minuto -= 6 + Math.floor(azar() * 6);
  }
  RETIRARON_HOY.forEach((id, i) => sumar(personas.find(p => p.id === id), hoyISO(), horaDe(horas[i])));

  return { version: 1, semilla: hoyISO(), tocado: false, personas, entregas };
}

function cargarDatos() {
  let d = null;
  try {
    d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
  } catch (e) {
    d = null;
  }
  const valido = d && Array.isArray(d.personas) && Array.isArray(d.entregas);
  if (!valido || (!d.tocado && d.semilla !== hoyISO())) {
    datos = generarMuestra();
    persistir();
    return;
  }
  datos = d;
}

const porId = id => datos.personas.find(p => p.id === id);
const vivo = e => {
  const p = porId(e.personaId);
  return p ? { ...e, nombre: p.nombre, apellido: p.apellido, dni: p.dni, domicilio: p.domicilio, telefono: p.telefono } : e;
};
const entregasDe = fecha => datos.entregas.filter(e => e.fecha === fecha);
const masNuevaPrimero = (a, b) => b.fecha.localeCompare(a.fecha) || b.hora.localeCompare(a.hora);

function convivientesDe(p) {
  const casa = normDomicilio(p.domicilio);
  return datos.personas.filter(o => o.id !== p.id && normDomicilio(o.domicilio) === casa).sort(cmpNombre);
}

function ultimaEntrega(personaId, salvoFecha) {
  return datos.entregas
    .filter(e => e.personaId === personaId && e.fecha !== salvoFecha)
    .sort(masNuevaPrimero)[0] || null;
}

function estadoDe(p, fecha) {
  const delDia = entregasDe(fecha).map(vivo);
  const propia = delDia.find(e => e.personaId === p.id);
  if (propia) return { color: 'rojo', tipo: 'retiro', e: propia };
  const mismoDni = delDia.find(e => soloDigitos(e.dni) === p.dni);
  if (mismoDni) return { color: 'rojo', tipo: 'dni', e: mismoDni };
  const casa = normDomicilio(p.domicilio);
  const enCasa = delDia.filter(e => normDomicilio(e.domicilio) === casa);
  if (enCasa.length) return { color: 'naranja', tipo: 'casa', es: enCasa };
  const parecidos = delDia.filter(e => domParecido(casa, normDomicilio(e.domicilio)));
  if (parecidos.length) return { color: 'naranja', tipo: 'parecido', es: parecidos };
  const nombre = normTexto(`${p.nombre} ${p.apellido}`);
  const homonimos = delDia.filter(e => normTexto(`${e.nombre} ${e.apellido}`) === nombre);
  if (homonimos.length) return { color: 'naranja', tipo: 'nombre', es: homonimos };
  return { color: 'verde', tipo: 'ok', ultima: ultimaEntrega(p.id, fecha) };
}

function textoEstado(est, fecha) {
  const c = cuando(fecha);
  const quien = e => `<b>${esc(nombreDe(e))}</b> (${esc(e.hora)})`;
  switch (est.tipo) {
    case 'retiro':
      return { titulo: `Ya retiró ${c}`, detalle: `a las ${esc(est.e.hora)}${est.e.motivo ? ` · ${esc(est.e.motivo)}` : ''}` };
    case 'dni':
      return { titulo: `Este DNI ya retiró ${c}`, detalle: `Está cargado también como ${quien(est.e)}. Revisá si es la misma persona.` };
    case 'casa':
      return { titulo: `Su domicilio ya retiró ${c}`, detalle: `${est.es.length === 1 ? 'Retiró' : 'Retiraron'} ${est.es.map(quien).join(', ')}` };
    case 'parecido':
      return { titulo: `Un domicilio parecido ya retiró ${c}`, detalle: est.es.map(e => `${quien(e)} en ${esc(e.domicilio)}`).join(', ') };
    case 'nombre':
      return { titulo: `Alguien con el mismo nombre retiró ${c}`, detalle: est.es.map(e => `DNI ${fmtDni(e.dni)}, ${esc(e.domicilio)} (${esc(e.hora)})`).join(', ') };
    default:
      return { titulo: 'Puede retirar', detalle: est.ultima ? `Última entrega: ${fechaCorta(est.ultima.fecha)}` : 'Primera vez que retira' };
  }
}

function buscar(consulta) {
  const texto = normTexto(consulta);
  if (!texto) return [];
  const digitos = soloDigitos(consulta);
  const palabras = texto.split(' ');
  const encontrados = [];
  datos.personas.forEach(p => {
    let puntaje = 0;
    if (digitos.length >= 3 && p.dni.includes(digitos)) puntaje = p.dni.startsWith(digitos) ? 100 : 70;
    if (!puntaje) {
      const pajar = `${normTexto(`${p.apellido} ${p.nombre} ${p.domicilio}`)} ${normDomicilio(p.domicilio)}`;
      if (palabras.every(w => pajar.includes(w))) {
        puntaje = normTexto(p.apellido).startsWith(palabras[0]) ? 60 : 40;
      }
    }
    if (puntaje) encontrados.push({ p, puntaje });
  });
  return encontrados.sort((a, b) => b.puntaje - a.puntaje || cmpNombre(a.p, b.p)).map(r => r.p);
}

function grupoTexto(x) {
  const ninos = Number(x.ninos) || 0;
  return `${plural(Number(x.adultos) || 0, 'adulto', 'adultos')} · ${ninos ? plural(ninos, 'niño', 'niños') : 'sin niños'}`;
}

function htmlFicha(p) {
  const est = estadoDe(p, estado.fecha);
  const t = textoEstado(est, estado.fecha);
  const casa = convivientesDe(p);
  let accion = '';
  if (est.color === 'verde') {
    accion = `<button type="button" class="btn btn--primario" data-accion="entregar" data-id="${p.id}">${IC.check}Registrar entrega</button>`;
  } else if (est.color === 'naranja') {
    accion = `<button type="button" class="btn btn--aviso" data-accion="entregar" data-id="${p.id}">Entregar igual…</button>`;
  }
  return `<article class="ficha ficha--${est.color}">
    <div class="ficha__estado">${IC[est.color]}<p><strong>${t.titulo}</strong> <span>${t.detalle}</span></p></div>
    <div class="ficha__cuerpo">
      <div class="ficha__datos">
        <h3>${esc(nombreDe(p))}</h3>
        <p class="ficha__linea"><span>DNI ${fmtDni(p.dni)}</span><span>${IC.casa}${esc(p.domicilio)}</span>${p.telefono ? `<span>${esc(p.telefono)}</span>` : ''}</p>
        <p class="ficha__grupo"><b>${plural(totalDe(p), 'persona', 'personas')}</b> · ${grupoTexto(p)}</p>
        ${casa.length ? `<p class="ficha__casa">También en este domicilio: ${casa.map(o => `<b>${esc(`${o.nombre} ${o.apellido}`)}</b>`).join(' · ')}</p>` : ''}
        ${p.notas ? `<p class="ficha__nota">${IC.info}<span>${esc(p.notas)}</span></p>` : ''}
      </div>
      <div class="ficha__acciones">${accion}<button type="button" class="btn btn--texto" data-accion="editar" data-id="${p.id}">Ver ficha</button></div>
    </div>
  </article>`;
}

function renderResultados() {
  const consulta = $('#buscar').value;
  $('#limpiar-busqueda').hidden = !consulta;
  const caja = $('#resultados');
  if (!consulta.trim()) {
    caja.innerHTML = `<div class="ejemplos"><p>Para probar la muestra, tocá un ejemplo:</p><div class="ejemplos__chips">${EJEMPLOS.map(q => `<button type="button" class="chip" data-accion="ejemplo" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div></div>`;
    return;
  }
  const lista = buscar(consulta);
  if (!lista.length) {
    caja.innerHTML = `<div class="vacio"><p>No hay nadie cargado con «${esc(consulta.trim())}».<small>Si es la primera vez que viene, cargala ahora: el sistema revisa el DNI y el domicilio mientras escribís.</small></p><button type="button" class="btn btn--primario" data-accion="nueva-desde-busqueda">${IC.persona}Cargar persona nueva</button></div>`;
    return;
  }
  const cuenta = lista.length === 1 ? '1 persona encontrada' : `${lista.length} personas encontradas`;
  const corte = lista.length > MAX_RESULTADOS ? ` · se muestran ${MAX_RESULTADOS}, seguí escribiendo para achicar` : '';
  caja.innerHTML = `<p class="resultados__cuenta">${cuenta}${corte}</p>${lista.slice(0, MAX_RESULTADOS).map(htmlFicha).join('')}<p class="resultados__otra">¿No es ninguna de estas personas? <button type="button" class="enlace" data-accion="nueva-desde-busqueda">Cargar persona nueva</button></p>`;
}

function renderJornada() {
  const f = estado.fecha;
  const esHoy = f === hoyISO();
  $('#titulo-jornada').textContent = esHoy ? `Hoy, ${fechaLarga(f)}` : mayuscula(fechaLarga(f));
  $('#fecha-jornada').value = f;
  $('#aviso-fecha').hidden = esHoy;
}

function renderHoy(resaltar) {
  const f = estado.fecha;
  const lista = entregasDe(f).map(vivo).sort(masNuevaPrimero);
  $('#hoy-titulo').textContent = f === hoyISO() ? 'Entregas de hoy' : `Entregas del ${fechaCorta(f)}`;
  $('#hoy-fecha').textContent = `${fechaLarga(f)} de ${fechaDe(f).getFullYear()}`;
  const adultos = lista.reduce((s, e) => s + (Number(e.adultos) || 0), 0);
  const ninos = lista.reduce((s, e) => s + (Number(e.ninos) || 0), 0);
  $('#c-familias').textContent = numero(lista.length);
  $('#c-personas').textContent = numero(adultos + ninos);
  $('#c-adultos').textContent = numero(adultos);
  $('#c-ninos').textContent = numero(ninos);
  $('#lista-hoy').innerHTML = lista.length
    ? lista.map(e => `<li class="hoy-item${e.id === resaltar ? ' hoy-item--nuevo' : ''}">
        <span class="hoy-item__hora">${esc(e.hora)}</span>
        <div class="hoy-item__datos"><strong>${esc(nombreDe(e))}</strong><span>${esc(e.domicilio)} · ${plural(totalDe(e), 'persona', 'personas')}</span>${e.motivo ? `<span class="hoy-item__motivo">Entregada igual: ${esc(e.motivo.toLowerCase())}</span>` : ''}</div>
        <button type="button" class="btn btn--texto" data-accion="anular" data-id="${e.id}" aria-label="Anular la entrega de ${esc(nombreDe(e))}">Anular</button>
      </li>`).join('')
    : '<li class="hoy-vacio">Todavía no hay entregas registradas en esta fecha.</li>';
}

function conteoCasas() {
  const conteo = new Map();
  datos.personas.forEach(p => {
    const casa = normDomicilio(p.domicilio);
    conteo.set(casa, (conteo.get(casa) || 0) + 1);
  });
  return conteo;
}

function renderPadron() {
  const conteo = conteoCasas();
  const palabras = normTexto($('#buscar-padron').value).split(' ').filter(Boolean);
  const digitos = soloDigitos($('#buscar-padron').value);
  let lista = datos.personas.slice().sort(cmpNombre);
  if (estado.filtro === 'compartidos') lista = lista.filter(p => conteo.get(normDomicilio(p.domicilio)) > 1);
  if (estado.filtro === 'ninos') lista = lista.filter(p => Number(p.ninos) > 0);
  if (palabras.length) {
    lista = lista.filter(p => {
      if (digitos.length >= 3 && p.dni.includes(digitos)) return true;
      const pajar = `${normTexto(`${p.apellido} ${p.nombre} ${p.domicilio} ${p.telefono}`)} ${normDomicilio(p.domicilio)}`;
      return palabras.every(w => pajar.includes(w));
    });
  }
  if (estado.filtro === 'compartidos') {
    lista.sort((a, b) => normDomicilio(a.domicilio).localeCompare(normDomicilio(b.domicilio)) || cmpNombre(a, b));
  }

  const casas = conteo.size;
  const compartidas = [...conteo.values()].filter(v => v > 1).length;
  $('#padron-resumen').textContent = `${plural(datos.personas.length, 'persona cargada', 'personas cargadas')} · ${plural(casas, 'domicilio', 'domicilios')} · ${plural(compartidas, 'domicilio compartido', 'domicilios compartidos')}`;
  $$('.segmentado [data-filtro]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === estado.filtro)));

  const hoy = estado.fecha;
  $('#tbody-padron').innerHTML = lista.length
    ? lista.map(p => {
      const enCasa = conteo.get(normDomicilio(p.domicilio));
      const deHoy = entregasDe(hoy).find(e => e.personaId === p.id);
      const ultima = deHoy || ultimaEntrega(p.id, '');
      const textoUltima = deHoy
        ? `<span class="pastilla pastilla--hoy">${hoy === hoyISO() ? 'Hoy' : mayuscula(fechaCorta(hoy))}, ${esc(deHoy.hora)}</span>`
        : (ultima ? mayuscula(fechaCorta(ultima.fecha)) : 'Nunca retiró');
      return `<tr data-accion="editar" data-id="${p.id}" tabindex="0">
        <td class="celda-titulo"><span class="celda-principal"><strong>${esc(nombreDe(p))}</strong><small>DNI ${fmtDni(p.dni)}</small></span></td>
        <td data-etiqueta="Domicilio"><span class="celda-domicilio">${esc(p.domicilio)}${enCasa > 1 ? `<span class="pastilla pastilla--casa">${enCasa} en la casa</span>` : ''}</span></td>
        <td data-etiqueta="Grupo"><span class="celda-principal"><strong>${plural(totalDe(p), 'persona', 'personas')}</strong><small>${grupoTexto(p)}</small></span></td>
        <td data-etiqueta="Teléfono">${p.telefono ? esc(p.telefono) : '<span class="celda-principal"><small>Sin teléfono</small></span>'}</td>
        <td data-etiqueta="Última entrega">${textoUltima}</td>
        <td class="celda-acciones"><button type="button" class="btn btn--chico" data-accion="editar" data-id="${p.id}">Ver ficha</button></td>
      </tr>`;
    }).join('')
    : '<tr class="fila-vacia"><td colspan="6">No hay personas con esa búsqueda o filtro.</td></tr>';
}

function renderHistorial() {
  const porFecha = new Map();
  datos.entregas.forEach(e => {
    if (!porFecha.has(e.fecha)) porFecha.set(e.fecha, []);
    porFecha.get(e.fecha).push(e);
  });
  const fechas = [...porFecha.keys()].sort().reverse();
  const maximo = Math.max(1, ...fechas.map(f => porFecha.get(f).length));
  const total = datos.entregas.length;
  $('#historial-resumen').textContent = fechas.length
    ? `${plural(fechas.length, 'jornada', 'jornadas')} · ${numero(total)} entregas · promedio de ${Math.round(total / fechas.length)} familias por jornada`
    : 'Todavía no hay entregas registradas.';

  $('#lista-jornadas').innerHTML = fechas.map(f => {
    const lista = porFecha.get(f).map(vivo).sort((a, b) => a.hora.localeCompare(b.hora));
    const personas = lista.reduce((s, e) => s + totalDe(e), 0);
    const ninos = lista.reduce((s, e) => s + (Number(e.ninos) || 0), 0);
    const iguales = lista.filter(e => e.motivo).length;
    const abierta = estado.abiertas.has(f);
    const d = fechaDe(f);
    return `<article class="jornada-fila">
      <div class="jornada-fila__cab">
        <button type="button" class="jornada-fila__abrir" data-accion="ver-jornada" data-fecha="${f}" aria-expanded="${abierta}">
          <span class="jornada-fila__fecha"><strong>${f === hoyISO() ? 'Hoy' : `${DIAS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`}</strong><small>${fechaNumerica(f)}</small></span>
          <span class="jornada-fila__medio">
            <span class="jornada-fila__datos"><span><b>${lista.length}</b> familias</span><span><b>${personas}</b> personas</span><span><b>${ninos}</b> niños</span>${iguales ? `<span class="pastilla pastilla--igual">${plural(iguales, 'entregada igual', 'entregadas igual')}</span>` : ''}</span>
            <span class="jornada-fila__barra" aria-hidden="true"><span style="--p:${Math.round((lista.length / maximo) * 100)}%"></span></span>
          </span>
          ${IC.chevron}
        </button>
        <button type="button" class="btn btn--chico" data-accion="exportar-jornada" data-fecha="${f}">${IC.descarga}Excel</button>
      </div>
      ${abierta ? `<div class="jornada-fila__detalle"><table class="tabla">
        <thead><tr><th scope="col">Persona</th><th scope="col">Hora</th><th scope="col">Domicilio</th><th scope="col">Grupo</th><th scope="col">Observación</th></tr></thead>
        <tbody>${lista.map(e => `<tr>
          <td class="celda-titulo"><span class="celda-principal"><strong>${esc(nombreDe(e))}</strong><small>DNI ${fmtDni(e.dni)}</small></span></td>
          <td data-etiqueta="Hora">${esc(e.hora)}</td>
          <td data-etiqueta="Domicilio">${esc(e.domicilio)}</td>
          <td data-etiqueta="Grupo">${plural(totalDe(e), 'persona', 'personas')}</td>
          <td data-etiqueta="Observación">${e.motivo ? `<span class="pastilla pastilla--igual">Entregada igual</span> ${esc(e.motivo)}` : '—'}</td>
        </tr>`).join('')}</tbody>
      </table></div>` : ''}
    </article>`;
  }).join('');
}

function renderTodo(resaltar) {
  renderJornada();
  if (estado.vista === 'entregar') {
    renderResultados();
    renderHoy(resaltar);
  }
  if (estado.vista === 'padron') renderPadron();
  if (estado.vista === 'historial') renderHistorial();
}

function mostrarVista(vista) {
  estado.vista = vista;
  $$('.vista').forEach(s => { s.hidden = s.id !== `vista-${vista}`; });
  $$('.pestana').forEach(b => b.setAttribute('aria-current', b.dataset.vista === vista ? 'page' : 'false'));
  renderTodo();
  window.scrollTo(0, 0);
  if (vista === 'entregar' && esEscritorio()) $('#buscar').focus();
}

function toast(mensaje, opciones = {}) {
  let caja = $('.toast-wrap');
  if (!caja) {
    caja = document.createElement('div');
    caja.className = 'toast-wrap';
    caja.setAttribute('aria-live', 'polite');
    document.body.appendChild(caja);
  }
  const t = document.createElement('div');
  t.className = `toast${opciones.tipo ? ` toast--${opciones.tipo}` : ''}`;
  t.setAttribute('role', 'status');
  t.innerHTML = `${opciones.tipo === 'aviso' ? IC.naranja : IC.check}<span>${esc(mensaje)}</span>${opciones.accion ? `<button type="button" class="toast__accion">${esc(opciones.accion)}</button>` : ''}`;
  const cerrar = () => {
    if (!t.isConnected || t.classList.contains('hiding')) return;
    t.classList.add('hiding');
    setTimeout(() => t.remove(), 220);
  };
  if (opciones.accion) {
    t.querySelector('.toast__accion').addEventListener('click', () => {
      opciones.alHacer();
      cerrar();
    });
  }
  while (caja.children.length > 2) caja.firstElementChild.remove();
  caja.appendChild(t);
  setTimeout(cerrar, opciones.accion ? 6500 : 3400);
}

const dlgConfirmar = $('#dlg-confirmar');

function confirmar({ titulo, texto, motivos = null, boton = 'Confirmar', tipo = 'aviso' }) {
  $('#conf-titulo').textContent = titulo;
  $('#conf-texto').innerHTML = texto;
  $('#conf-icono').innerHTML = tipo === 'peligro' ? IC.papelera : IC.naranja;
  dlgConfirmar.classList.toggle('dialogo--peligro', tipo === 'peligro');
  $('#conf-motivos').hidden = !motivos;
  $('#conf-opciones').innerHTML = motivos
    ? motivos.map((m, i) => `<label class="opcion"><input type="radio" name="motivo" value="${esc(m)}"${i === 0 ? ' checked' : ''}><span>${esc(m)}</span></label>`).join('')
    : '';
  const si = $('#conf-si');
  si.textContent = boton;
  si.className = `btn ${tipo === 'peligro' ? 'btn--peligro' : 'btn--aviso'}`;
  dlgConfirmar.returnValue = '';
  dlgConfirmar.showModal();
  return new Promise(resolver => {
    dlgConfirmar.addEventListener('close', () => {
      const elegido = dlgConfirmar.querySelector('input[name="motivo"]:checked');
      resolver({ ok: dlgConfirmar.returnValue === 'si', motivo: motivos && elegido ? elegido.value : '' });
    }, { once: true });
  });
}

async function intentarEntrega(p) {
  const est = estadoDe(p, estado.fecha);
  if (est.color === 'rojo') {
    toast(`${nombreDe(p)}: ${textoEstado(est, estado.fecha).titulo.toLowerCase()}`, { tipo: 'aviso' });
    renderResultados();
    return;
  }
  let motivo = '';
  if (est.color === 'naranja') {
    const t = textoEstado(est, estado.fecha);
    const r = await confirmar({
      titulo: t.titulo,
      texto: `${t.detalle}. ¿Le entregás igual a <b>${esc(nombreDe(p))}</b>?`,
      motivos: MOTIVOS,
      boton: 'Entregar igual'
    });
    if (!r.ok) return;
    motivo = r.motivo;
  }
  registrarEntrega(p, motivo);
}

function registrarEntrega(p, motivo) {
  const e = {
    id: nuevoId('e'), personaId: p.id, fecha: estado.fecha, hora: horaAhora(), motivo,
    nombre: p.nombre, apellido: p.apellido, dni: p.dni, domicilio: p.domicilio,
    telefono: p.telefono, adultos: p.adultos, ninos: p.ninos
  };
  datos.entregas.push(e);
  guardar();
  if (estado.vista !== 'entregar') mostrarVista('entregar');
  $('#buscar').value = '';
  renderTodo(e.id);
  toast(`Entrega registrada: ${nombreDe(p)}`, { accion: 'Deshacer', alHacer: () => anular(e.id, true) });
  if (esEscritorio()) $('#buscar').focus();
}

function anular(id, silencioso = false) {
  const i = datos.entregas.findIndex(e => e.id === id);
  if (i < 0) return;
  const [e] = datos.entregas.splice(i, 1);
  guardar();
  renderTodo();
  if (silencioso) {
    toast('Entrega deshecha');
    return;
  }
  toast(`Entrega anulada: ${nombreDe(vivo(e))}`, {
    accion: 'Deshacer',
    alHacer: () => {
      datos.entregas.splice(Math.min(i, datos.entregas.length), 0, e);
      guardar();
      renderTodo(e.id);
    }
  });
}

const dlgPersona = $('#dlg-persona');
const formPersona = $('#form-persona');
const campos = formPersona.elements;
let modoPersona = 'alta';
let editandoId = null;
let temporizador = null;
let pendiente = false;

function leerPersona() {
  const entero = (v, min) => Math.min(20, Math.max(min, parseInt(v, 10) || 0));
  return {
    nombre: campos.nombre.value.trim().replace(/\s+/g, ' '),
    apellido: campos.apellido.value.trim().replace(/\s+/g, ' '),
    dni: soloDigitos(campos.dni.value),
    domicilio: campos.domicilio.value.trim().replace(/\s+/g, ' '),
    adultos: entero(campos.adultos.value, 0),
    ninos: entero(campos.ninos.value, 0),
    telefono: campos.telefono.value.trim(),
    notas: campos.notas.value.trim()
  };
}

function pintarAviso(clave, aviso, campo) {
  const caja = $(`[data-aviso="${clave}"]`, formPersona);
  caja.hidden = !aviso;
  caja.className = `aviso-campo campos__ancho${aviso ? ` aviso-campo--${aviso.color}` : ''}`;
  caja.innerHTML = aviso ? `${IC[aviso.color]}<span>${aviso.html}</span>` : '';
  (Array.isArray(campo) ? campo : [campo]).forEach(nombre => {
    const label = campos[nombre].closest('.campo');
    label.classList.toggle('campo--naranja', aviso?.color === 'naranja');
    label.classList.toggle('campo--rojo', aviso?.color === 'rojo');
  });
}

function revisarPersona() {
  const v = leerPersona();
  const fecha = estado.fecha;
  const otros = datos.personas.filter(p => p.id !== editandoId);
  const delDia = entregasDe(fecha);
  const retiroDe = id => delDia.find(e => e.personaId === id);

  let avisoDni = null;
  if (v.dni.length >= 6) {
    const otro = otros.find(p => p.dni === v.dni);
    if (otro) {
      const r = retiroDe(otro.id);
      avisoDni = {
        color: 'rojo',
        html: `Este DNI ya está cargado: <b>${esc(nombreDe(otro))}</b>, ${esc(otro.domicilio)}${r ? `. <b>Ya retiró ${cuando(fecha)} a las ${esc(r.hora)}.</b>` : '.'} <button type="button" class="enlace" data-accion="ir-persona" data-id="${otro.id}">Ver su ficha</button>`
      };
    }
  }

  let avisoNombre = null;
  if (v.nombre && v.apellido) {
    const nombre = normTexto(`${v.nombre} ${v.apellido}`);
    const iguales = otros.filter(p => normTexto(`${p.nombre} ${p.apellido}`) === nombre && p.dni !== v.dni);
    if (iguales.length) {
      avisoNombre = {
        color: 'naranja',
        html: `Ya hay ${iguales.length === 1 ? 'una persona cargada' : `${iguales.length} personas cargadas`} con este nombre: ${iguales.map(p => `DNI ${fmtDni(p.dni)}, ${esc(p.domicilio)}`).join(' · ')}. Revisá que no sea la misma.`
      };
    }
  }

  let avisoDomicilio = null;
  const casa = normDomicilio(v.domicilio);
  if (casa.length >= 4 && /\d/.test(casa)) {
    const iguales = otros.filter(p => normDomicilio(p.domicilio) === casa).sort(cmpNombre);
    const parecidos = iguales.length ? [] : otros.filter(p => domParecido(casa, normDomicilio(p.domicilio))).sort(cmpNombre);
    const lista = iguales.length ? iguales : parecidos;
    if (lista.length) {
      const retiraron = lista.map(p => retiroDe(p.id)).filter(Boolean);
      let html = iguales.length
        ? `${modoPersona === 'alta' ? 'En este domicilio ya' : 'Comparte el domicilio con'} ${modoPersona === 'alta' ? (iguales.length === 1 ? 'hay 1 persona cargada: ' : `hay ${iguales.length} personas cargadas: `) : ''}${iguales.map(p => `<b>${esc(`${p.nombre} ${p.apellido}`)}</b>`).join(', ')}.`
        : `Domicilio parecido a ${parecidos.map(p => `<b>${esc(p.domicilio)}</b> (${esc(`${p.nombre} ${p.apellido}`)})`).join(', ')}.`;
      if (retiraron.length) {
        html += ` <b>${mayuscula(cuando(fecha))} ya ${retiraron.length === 1 ? 'retiró' : 'retiraron'} ${retiraron.map(e => `${esc(`${e.nombre} ${e.apellido}`)} (${esc(e.hora)})`).join(', ')}.</b>`;
      }
      avisoDomicilio = { color: retiraron.length ? 'rojo' : 'naranja', html };
    }
  }

  pintarAviso('dni', avisoDni, 'dni');
  pintarAviso('nombre', avisoNombre, ['nombre', 'apellido']);
  pintarAviso('domicilio', avisoDomicilio, 'domicilio');

  const faltan = [];
  if (!v.nombre) faltan.push(['nombre', 'el nombre']);
  if (!v.apellido) faltan.push(['apellido', 'el apellido']);
  if (v.dni.length < 6) faltan.push(['dni', v.dni ? 'un DNI completo' : 'el DNI']);
  if (!v.domicilio) faltan.push(['domicilio', 'el domicilio']);
  if (v.adultos < 1) faltan.push(['adultos', 'al menos un adulto']);

  const total = v.adultos + v.ninos;
  $('#total-grupo').textContent = total;
  $('#total-grupo-texto').textContent = total === 1 ? 'persona' : 'personas';

  return { v, faltan, dniRepetido: Boolean(avisoDni) };
}

function marcarFaltantes(faltan) {
  ['nombre', 'apellido', 'dni', 'domicilio'].forEach(n => {
    campos[n].closest('.campo').classList.toggle('campo--falta', faltan.some(f => f[0] === n));
  });
  const caja = $('#falta-persona');
  caja.hidden = !faltan.length;
  caja.textContent = faltan.length ? `Falta completar ${unirLista(faltan.map(f => f[1]))}.` : '';
}

function unirLista(partes) {
  if (partes.length < 2) return partes.join('');
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;
}

function estadoGuardado(tipo, texto = '') {
  const el = $('#estado-guardado');
  el.hidden = !tipo;
  el.className = `guardado${tipo === 'ok' ? ' guardado--ok' : ''}${tipo === 'error' ? ' guardado--error' : ''}`;
  el.textContent = tipo === 'guardando' ? 'Guardando…' : tipo === 'ok' ? 'Guardado' : texto;
}

function renderHistorialPersona(p) {
  const caja = $('#historial-persona');
  if (!p) {
    caja.hidden = true;
    caja.innerHTML = '';
    return;
  }
  const lista = datos.entregas.filter(e => e.personaId === p.id).sort(masNuevaPrimero);
  caja.hidden = false;
  caja.innerHTML = `<h3>Entregas</h3>${lista.length
    ? `<p>Retiró ${lista.length === 1 ? '1 vez' : `${lista.length} veces`}${lista.length > 10 ? '. Se muestran las últimas 10' : ''}.</p><ul class="fechas">${lista.slice(0, 10).map(e => `<li${e.motivo ? ' class="fechas__igual" title="Entregada igual"' : ''}>${e.fecha === hoyISO() ? `Hoy, ${esc(e.hora)}` : fechaCorta(e.fecha)}</li>`).join('')}</ul>`
    : '<p>Todavía no retiró mercadería.</p>'}`;
}

function abrirPersona(p = null, inicial = {}) {
  if (dlgPersona.open) {
    guardarEdicion();
    dlgPersona.close();
  }
  modoPersona = p ? 'editar' : 'alta';
  editandoId = p ? p.id : null;
  const v = p || { nombre: '', apellido: '', dni: '', domicilio: '', adultos: 1, ninos: 0, telefono: '', notas: '', ...inicial };
  campos.nombre.value = v.nombre;
  campos.apellido.value = v.apellido;
  campos.dni.value = v.dni ? fmtDni(v.dni) : '';
  campos.domicilio.value = v.domicilio;
  campos.adultos.value = v.adultos;
  campos.ninos.value = v.ninos;
  campos.telefono.value = v.telefono;
  campos.notas.value = v.notas;
  $('#dlg-persona-titulo').textContent = p ? nombreDe(p) : 'Cargar persona nueva';
  $$('[data-modo]', formPersona).forEach(el => { el.hidden = el.dataset.modo !== modoPersona; });
  estadoGuardado('');
  marcarFaltantes([]);
  revisarPersona();
  renderHistorialPersona(p);
  pendiente = false;
  dlgPersona.showModal();
  $('.dialogo__cuerpo', dlgPersona).scrollTop = 0;
  if (!p) {
    const vacio = ['nombre', 'apellido', 'dni', 'domicilio'].find(n => !campos[n].value);
    campos[vacio || 'nombre'].focus();
  } else {
    $('[data-accion="cerrar-persona"]', dlgPersona).focus();
  }
}

function programarGuardado() {
  const r = revisarPersona();
  clearTimeout(temporizador);
  if (r.faltan.length || r.dniRepetido) {
    pendiente = false;
    estadoGuardado('error', r.dniRepetido ? 'Sin guardar: el DNI ya está cargado' : `Sin guardar: falta ${r.faltan[0][1]}`);
    return;
  }
  pendiente = true;
  estadoGuardado('guardando');
  temporizador = setTimeout(guardarEdicion, 600);
}

function guardarEdicion() {
  clearTimeout(temporizador);
  if (modoPersona !== 'editar' || !pendiente) return;
  pendiente = false;
  const r = revisarPersona();
  const p = porId(editandoId);
  if (!p || r.faltan.length || r.dniRepetido) return;
  Object.assign(p, r.v);
  guardar();
  estadoGuardado('ok');
  $('#dlg-persona-titulo').textContent = nombreDe(p);
  renderTodo();
}

formPersona.addEventListener('input', e => {
  if (e.target.name === 'dni') {
    const limpio = e.target.value.replace(/[^\d.\s]/g, '');
    if (limpio !== e.target.value) e.target.value = limpio;
  }
  if (modoPersona === 'editar') {
    programarGuardado();
  } else {
    const r = revisarPersona();
    if (!$('#falta-persona').hidden) marcarFaltantes(r.faltan);
  }
});

formPersona.addEventListener('focusout', e => {
  if (e.target.name === 'dni' && soloDigitos(e.target.value)) e.target.value = fmtDni(e.target.value);
});

formPersona.addEventListener('click', e => {
  const b = e.target.closest('[data-paso]');
  if (!b) return;
  const campo = campos[b.dataset.campo];
  const minimo = Number(campo.min) || 0;
  campo.value = Math.min(20, Math.max(minimo, (parseInt(campo.value, 10) || 0) + Number(b.dataset.paso)));
  campo.dispatchEvent(new Event('input', { bubbles: true }));
});

formPersona.addEventListener('submit', e => {
  e.preventDefault();
  if (modoPersona !== 'alta') {
    guardarEdicion();
    dlgPersona.close();
    return;
  }
  const r = revisarPersona();
  marcarFaltantes(r.faltan);
  if (r.faltan.length) {
    campos[r.faltan[0][0]].focus();
    return;
  }
  if (r.dniRepetido) {
    campos.dni.focus();
    toast('Ese DNI ya está en el padrón: abrí su ficha en vez de cargarla de nuevo', { tipo: 'aviso' });
    return;
  }
  const p = { id: nuevoId('p'), ...r.v };
  datos.personas.push(p);
  guardar();
  dlgPersona.close();
  if (e.submitter && e.submitter.value === 'cargar-entregar') {
    toast(`Se cargó a ${nombreDe(p)} en el padrón`);
    if (estado.vista !== 'entregar') mostrarVista('entregar');
    intentarEntrega(p);
    return;
  }
  toast(`Se cargó a ${nombreDe(p)} en el padrón`);
  if (estado.vista === 'entregar') $('#buscar').value = fmtDni(p.dni);
  renderTodo();
});

dlgPersona.addEventListener('close', () => {
  if (modoPersona === 'editar' && pendiente) guardarEdicion();
  const r = modoPersona === 'editar' ? revisarPersona() : null;
  if (r && (r.faltan.length || r.dniRepetido)) toast('El último cambio no se guardó: faltaban datos', { tipo: 'aviso' });
});

dlgPersona.addEventListener('cancel', () => {
  if (modoPersona === 'editar') guardarEdicion();
});

function prefillDesde(consulta) {
  const q = consulta.trim();
  const digitos = soloDigitos(q);
  if (digitos.length >= 6 && digitos.length === q.replace(/[.\s]/g, '').length) return { dni: digitos };
  if (/\d/.test(q)) return { domicilio: q };
  const capital = s => s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
  return { apellido: capital(q) };
}

function descargarCSV(nombre, filas) {
  const celda = v => {
    const s = String(v ?? '');
    return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = `sep=;\r\n${filas.map(f => f.map(celda).join(';')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function exportar(fecha) {
  const lista = (fecha ? entregasDe(fecha) : datos.entregas.slice())
    .map(vivo)
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));
  const filas = [['Fecha', 'Hora', 'Apellido', 'Nombre', 'DNI', 'Domicilio', 'Adultos', 'Niños', 'Total', 'Teléfono', 'Observación']]
    .concat(lista.map(e => [fechaNumerica(e.fecha), e.hora, e.apellido, e.nombre, e.dni, e.domicilio, e.adultos, e.ninos, totalDe(e), e.telefono || '', e.motivo ? `Entregada igual: ${e.motivo}` : '']));
  descargarCSV(fecha ? `entregas-${fecha}.csv` : 'entregas-todas.csv', filas);
  toast(fecha ? `Se descargó la jornada del ${fechaCorta(fecha)}` : 'Se descargaron todas las entregas');
}

function cambiarFecha(iso) {
  estado.fecha = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : hoyISO();
  renderTodo();
}

function abrirMenu(abrir) {
  const boton = $('[data-accion="menu"]');
  $('#menu-usuario').hidden = !abrir;
  boton.setAttribute('aria-expanded', String(abrir));
}

function entrar() {
  try {
    sessionStorage.setItem(CLAVE_SESION, '1');
  } catch (e) {}
  $('#login').hidden = true;
  $('#app').hidden = false;
  mostrarVista('entregar');
}

function salir() {
  try {
    sessionStorage.removeItem(CLAVE_SESION);
  } catch (e) {}
  abrirMenu(false);
  $('#app').hidden = true;
  $('#login').hidden = false;
  window.scrollTo(0, 0);
}

async function restablecer() {
  abrirMenu(false);
  const r = await confirmar({
    titulo: 'Volver a los datos de muestra',
    texto: 'Se borran las personas y entregas que cargaste en este navegador y vuelven los datos de ejemplo.',
    boton: 'Volver a la muestra',
    tipo: 'peligro'
  });
  if (!r.ok) return;
  datos = generarMuestra();
  persistir();
  estado.fecha = hoyISO();
  estado.abiertas.clear();
  $('#buscar').value = '';
  $('#buscar-padron').value = '';
  estado.filtro = 'todos';
  renderTodo();
  toast('Volvieron los datos de muestra');
}

async function eliminarPersona() {
  const p = porId(editandoId);
  if (!p) return;
  const r = await confirmar({
    titulo: `Eliminar a ${nombreDe(p)}`,
    texto: 'Sale del padrón. Sus entregas anteriores quedan en el historial.',
    boton: 'Eliminar',
    tipo: 'peligro'
  });
  if (!r.ok) return;
  pendiente = false;
  datos.personas = datos.personas.filter(o => o.id !== p.id);
  guardar();
  modoPersona = 'alta';
  dlgPersona.close();
  renderTodo();
  toast(`Se eliminó a ${nombreDe(p)} del padrón`);
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-accion]');
  if (!$('#menu-usuario').hidden && !e.target.closest('.usuario')) abrirMenu(false);
  if (!b) return;
  const id = b.dataset.id;
  switch (b.dataset.accion) {
    case 'vista':
      mostrarVista(b.dataset.vista);
      break;
    case 'entregar': {
      const p = porId(id);
      if (p) intentarEntrega(p);
      break;
    }
    case 'editar': {
      if (e.target.closest('button') && e.target.closest('button') !== b) break;
      const p = porId(id);
      if (p) abrirPersona(p);
      break;
    }
    case 'ir-persona': {
      const p = porId(id);
      if (p) abrirPersona(p);
      break;
    }
    case 'cerrar-persona':
      guardarEdicion();
      dlgPersona.close();
      break;
    case 'eliminar-persona':
      eliminarPersona();
      break;
    case 'ejemplo':
      $('#buscar').value = b.dataset.q;
      renderResultados();
      if (esEscritorio()) $('#buscar').focus();
      break;
    case 'nueva-desde-busqueda':
      abrirPersona(null, prefillDesde($('#buscar').value));
      break;
    case 'nueva-persona':
      abrirPersona(null);
      break;
    case 'anular':
      anular(id);
      break;
    case 'volver-hoy':
      cambiarFecha(hoyISO());
      break;
    case 'filtro':
      estado.filtro = b.dataset.filtro;
      renderPadron();
      break;
    case 'ver-jornada': {
      const f = b.dataset.fecha;
      if (estado.abiertas.has(f)) estado.abiertas.delete(f);
      else estado.abiertas.add(f);
      renderHistorial();
      break;
    }
    case 'exportar-jornada':
      exportar(b.dataset.fecha);
      break;
    case 'exportar-todo':
      exportar();
      break;
    case 'menu':
      abrirMenu($('#menu-usuario').hidden);
      break;
    case 'restablecer':
      restablecer();
      break;
    case 'salir':
      salir();
      break;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#menu-usuario').hidden) {
    abrirMenu(false);
    $('[data-accion="menu"]').focus();
  }
  if (e.key === 'Enter' && e.target.matches('tr[data-accion="editar"]')) {
    const p = porId(e.target.dataset.id);
    if (p) abrirPersona(p);
  }
});

$('#buscar').addEventListener('input', renderResultados);
$('#buscar').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const primero = $('#resultados .ficha [data-accion="entregar"], #resultados [data-accion="nueva-desde-busqueda"]');
    if (primero) primero.focus();
  }
  if (e.key === 'Escape' && e.target.value) {
    e.preventDefault();
    e.target.value = '';
    renderResultados();
  }
});
$('#limpiar-busqueda').addEventListener('click', () => {
  $('#buscar').value = '';
  renderResultados();
  $('#buscar').focus();
});
$('#fecha-jornada').addEventListener('change', e => cambiarFecha(e.target.value));
$('#buscar-padron').addEventListener('input', renderPadron);
$('#form-login').addEventListener('submit', e => {
  e.preventDefault();
  entrar();
});

cargarDatos();
let conSesion = false;
try {
  conSesion = sessionStorage.getItem(CLAVE_SESION) === '1';
} catch (e) {}
if (conSesion) entrar();
