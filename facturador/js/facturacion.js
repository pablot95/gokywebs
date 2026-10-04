// Modal "Facturar" — puerto de admin/dashboard.js (tabs consumidor final / con
// datos, SIN_IDENTIFICAR, idempotencia por requestId) con dos diferencias:
// precarga desde el cliente de Firestore (no se pisa con la respuesta de ARCA),
// y si el emisor es Responsable Inscripto deriva sola si corresponde A o B según
// la pestaña/documento elegido (nunca un selector aparte que se pueda desincronizar).
import {
    $, formatPesos, fechaInput, generarRequestId, llenarSelect, snapshotCampos, confirmarDescartarCambios,
    SIN_IDENTIFICAR, TIPO_DOC_CUIT, CONDICION_IVA_RESPONSABLE_INSCRIPTO, CONDICION_IVA_MONOTRIBUTO, ALICUOTAS_IVA,
    prepararCarpetaFacturas, guardarFactura,
} from './utils.js';
import { estado, emisorEsResponsableInscripto } from './state.js';

const facturaModal = $('facturaModal');
let clienteAFacturar = null;
let facturaRequestId = null;
let facturaModo = 'final'; // 'final' | 'identificado'
let tipoComprobanteActual = null;
let snapshotFacturaInicial = null;

function cuerpoFacturaModal() { return facturaModal.querySelector('.modal-body'); }

function campoFactura(id) { return $('factura' + id); }

function letraDe(tipo) { return { 1: 'A', 6: 'B', 11: 'C' }[tipo] || 'C'; }

function numeroComprobante(tipo, puntoVenta, numero) {
    return `Factura ${letraDe(tipo)} ${String(puntoVenta).padStart(5, '0')}-${String(numero).padStart(8, '0')}`;
}

// A solo corresponde si el receptor está identificado con CUIT y es Responsable
// Inscripto; cualquier otra combinación (consumidor final, DNI, otra condición)
// es B. Se deriva de los campos reales del formulario, nunca de un selector aparte.
// Misma regla que api/facturar.php: A para CUIT de Responsable Inscripto o de
// Responsable Monotributo.
function corresponderiaA(tipoDoc, condIva) {
    return Number(tipoDoc) === TIPO_DOC_CUIT && [CONDICION_IVA_RESPONSABLE_INSCRIPTO, CONDICION_IVA_MONOTRIBUTO].includes(Number(condIva));
}

function tipoComprobanteDerivado() {
    if (!emisorEsResponsableInscripto()) return 11;
    if (facturaModo !== 'identificado') return 6;
    // Antes de la primera consulta a ARCA el select de condición está vacío: vale
    // la que tiene guardada el cliente (si no, nunca se llegaba a la Factura A).
    const condIva = campoFactura('CondicionIva').value || clienteAFacturar?.condicionIva;
    return corresponderiaA(campoFactura('TipoDoc').value, condIva) ? 1 : 6;
}

function mostrarErrorFactura(mensaje) {
    const el = $('facturaError');
    el.textContent = mensaje;
    el.hidden = !mensaje;
}

function sincronizarCamposReceptor() {
    campoFactura('Documento').maxLength = campoFactura('TipoDoc').value === '96' ? 10 : 13;
}

function sincronizarCamposPeriodo() {
    campoFactura('PeriodoCampos').hidden = campoFactura('Concepto').value === '1';
}

function elegirModoFactura(modo) {
    facturaModo = modo;
    const identificado = modo === 'identificado';
    campoFactura('ModoFinal').classList.toggle('active', !identificado);
    campoFactura('ModoFinal').setAttribute('aria-selected', String(!identificado));
    campoFactura('ModoIdentificado').classList.toggle('active', identificado);
    campoFactura('ModoIdentificado').setAttribute('aria-selected', String(identificado));
    $('facturaPanelFinal').hidden = identificado;
    $('facturaPanelIdentificado').hidden = !identificado;
}

// Neto/IVA a partir del total cargado (IVA incluido) y la alícuota elegida —
// el usuario piensa en el importe final, no en el neto.
function recalcularIva() {
    const tipo = tipoComprobanteDerivado();
    $('facturaIvaBloque').hidden = tipo === 11;
    if (tipo === 11) return null;

    const total = parseFloat(campoFactura('Total').value) || 0;
    const alicuotaId = Number(campoFactura('Alicuota').value);
    const pct = ALICUOTAS_IVA.find(a => a.id === alicuotaId)?.pct ?? 21;
    const neto = Math.round((total / (1 + pct / 100)) * 100) / 100;
    const iva = Math.round((total - neto) * 100) / 100;
    $('facturaIvaDetalle').textContent = `Neto ${formatPesos(neto)} + IVA ${pct}% (${formatPesos(iva)}) = ${formatPesos(total)}`;
    return { alicuotaId, baseImponible: neto, importe: iva };
}

async function llamarFacturacion(accion, cuerpo, extra = {}) {
    const token = await estado.user.getIdToken();
    const opciones = { headers: { Authorization: 'Bearer ' + token } };
    if (cuerpo) {
        opciones.method = 'POST';
        opciones.headers['Content-Type'] = 'application/json';
        opciones.body = JSON.stringify(cuerpo);
    }
    const params = new URLSearchParams({ accion, ...extra });
    const res = await fetch('api/facturar.php?' + params, opciones);
    const datos = await res.json().catch(() => null);
    if (!datos) throw new Error(`El servidor no respondió JSON (HTTP ${res.status})`);
    return datos;
}

// Genera el PDF de una factura emitida y lo guarda (carpeta elegida o Descargas).
// El servidor lo arma desde su registro, por el requestId de la emisión.
async function guardarComprobante(requestId, factura, carpeta, opciones = {}) {
    const token = await estado.user.getIdToken();
    const res = await fetch('api/comprobante.php', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
    });
    if (!res.ok) {
        const cuerpo = await res.text();
        let detalle = cuerpo;
        try { detalle = JSON.parse(cuerpo).error || cuerpo; } catch (e) {}
        throw new Error(detalle);
    }
    const nombre = res.headers.get('X-Nombre-Archivo') || `${numeroComprobante(factura.tipoComprobante, factura.puntoVenta, factura.numero)}.pdf`;
    await guardarFactura(await res.blob(), nombre, carpeta, opciones);
}

async function abrirComprobante(requestId, factura, carpeta) {
    try {
        await guardarComprobante(requestId, factura, carpeta);
    } catch (err) {
        console.error(err);
        alert('No se pudo generar el comprobante: ' + err.message);
    }
}

/* ---------- Emitir todas (4-oct) ----------
   Factura a un cliente sin abrir el modal, con lo que tiene cargado: precio,
   descripción y, si tiene documento, sus datos fiscales (si no, consumidor
   final). Lo demás va con los mismos valores que propone el modal: servicios,
   período de los últimos 30 días, vencimiento hoy, Contado y, si corresponde
   A o B, IVA 21% incluido en el precio. */
export function facturaDeClienteIdentificada(cliente) {
    return !!(cliente.tipoDocumento && cliente.documento);
}

export function tipoComprobanteDeCliente(cliente) {
    if (!emisorEsResponsableInscripto()) return 11;
    if (!facturaDeClienteIdentificada(cliente)) return 6;
    return corresponderiaA(cliente.tipoDocumento, cliente.condicionIva) ? 1 : 6;
}

// Por qué este cliente no se puede facturar en tanda ('' si se puede).
export function motivoParaNoEmitir(cliente) {
    if (!(Number(cliente.precio) > 0)) return 'no tiene precio cargado';
    if (facturaDeClienteIdentificada(cliente) && !cliente.condicionIva) return 'tiene documento pero le falta la condición frente al IVA';
    return '';
}

export function letraDeCliente(cliente) {
    return letraDe(tipoComprobanteDeCliente(cliente));
}

// El requestId de la tanda es fijo por cliente y mes: si una tanda se corta y se
// vuelve a tocar, el servidor reconoce la que ya salió (o la verifica en ARCA si
// quedó sin respuesta) en vez de emitir otra.
function requestIdDeTanda(cliente) {
    const d = new Date();
    return `tanda-${cliente.id}-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Emite la factura y guarda el PDF. Devuelve { factura, errorPdf }. Si no se
// emitió, tira un Error con .grave = true cuando no tiene sentido seguir con los
// demás (no se sabe si salió, falta configurar ARCA); un rechazo de ARCA o un
// dato inválido de este cliente no es grave.
export async function emitirFacturaDeCliente(cliente, carpeta) {
    const tipo = tipoComprobanteDeCliente(cliente);
    const total = Math.round(Number(cliente.precio) * 100) / 100;
    let ivaDetalle = null;
    if (tipo !== 11) {
        const neto = Math.round((total / 1.21) * 100) / 100;
        ivaDetalle = [{ alicuotaId: 5, baseImponible: neto, importe: Math.round((total - neto) * 100) / 100 }];
    }
    const cuerpo = {
        requestId: requestIdDeTanda(cliente),
        clienteId: cliente.id,
        cliente: cliente.nombre,
        total,
        tipoComprobante: tipo,
        concepto: 2,
        descripcion: cliente.descripcion || '',
        condicionVenta: 'Contado',
        servicioDesde: fechaInput(-30),
        servicioHasta: fechaInput(),
        vencimientoPago: fechaInput(),
        ...(facturaDeClienteIdentificada(cliente)
            ? {
                tipoDocumento: Number(cliente.tipoDocumento),
                documento: cliente.documento,
                condicionIva: Number(cliente.condicionIva),
                nombre: cliente.nombre,
            }
            : { tipoDocumento: SIN_IDENTIFICAR, documento: '' }),
        ...(ivaDetalle ? { ivaDetalle } : {}),
    };

    let datos;
    try {
        datos = await llamarFacturacion('emitir', cuerpo);
    } catch (err) {
        // Sin respuesta del servidor no se sabe si se emitió: se corta la tanda.
        err.grave = true;
        throw err;
    }
    if (datos.necesitaConfiguracion) {
        const err = new Error('Falta terminar de configurar ARCA.');
        err.grave = true;
        throw err;
    }
    if (!datos.ok) {
        const err = new Error(datos.error || 'No se pudo emitir la factura');
        // Datos inválidos (400) o rechazo de ARCA: es de este cliente y no salió nada.
        err.grave = !(datos.datosInvalidos || datos.rechazada);
        throw err;
    }

    const factura = datos.factura;
    estado.facturadosEsteMes.add(cliente.id);
    let errorPdf = '';
    try {
        await guardarComprobante(cuerpo.requestId, factura, carpeta, { silencioso: true });
    } catch (err) {
        console.error(err);
        errorPdf = err.message;
    }
    return { factura, errorPdf, numero: numeroComprobante(factura.tipoComprobante, factura.puntoVenta, factura.numero) };
}

async function refrescarProximo() {
    const tipo = tipoComprobanteDerivado();
    const esPrimeraCarga = tipoComprobanteActual === null; // recien acá se sabe si hay que precargar la condición IVA guardada del cliente
    recalcularIva();
    if (tipoComprobanteActual !== null && tipo === tipoComprobanteActual) return;

    campoFactura('Comprobante').textContent = 'Consultando a ARCA…';
    campoFactura('EmitirBtn').disabled = true;

    try {
        const datos = await llamarFacturacion('proximo', null, { clienteId: clienteAFacturar.id, tipoComprobante: tipo });
        if (!clienteAFacturar) return;
        if (datos.necesitaConfiguracion) {
            window.location.href = 'arca-config.html';
            return;
        }
        if (!datos.ok) throw new Error(datos.error || 'Error al consultar ARCA');

        tipoComprobanteActual = tipo;
        campoFactura('Comprobante').textContent = numeroComprobante(tipo, datos.puntoVenta, datos.proximoNumero);
        campoFactura('EmitirBtn').disabled = false;

        llenarSelect(
            campoFactura('TipoDoc'),
            Object.entries(datos.tiposDocumento || {}).filter(([valor]) => Number(valor) !== SIN_IDENTIFICAR).map(([valor, texto]) => ({ valor, texto })),
            campoFactura('TipoDoc').value || TIPO_DOC_CUIT,
        );
        llenarSelect(campoFactura('CondicionVenta'), (datos.condicionesVenta || ['Contado']).map(c => ({ valor: c, texto: c })), campoFactura('CondicionVenta').value || 'Contado');
        // Primera carga del modal: precargar la condición IVA que ya tiene guardada
        // el cliente (antes no se podía, porque este select todavía no tenía las
        // opciones reales de ARCA). Refrescos posteriores (cambio de tipo de doc,
        // de pestaña, o el propio select) respetan lo que el usuario ya eligió.
        const condicionIvaPreferida = esPrimeraCarga ? (clienteAFacturar.condicionIva ?? '') : campoFactura('CondicionIva').value;
        llenarSelect(campoFactura('CondicionIva'), (datos.condicionesIva || []).map(c => ({ valor: c.id, texto: c.descripcion })), condicionIvaPreferida);

        // Recien con el catalogo real cargado se puede re-derivar con precision
        // (antes del primer fetch se arranca con una suposicion basada en el cliente).
        recalcularIva();
        sincronizarCamposReceptor();
    } catch (err) {
        if (!clienteAFacturar) return;
        campoFactura('Comprobante').textContent = '—';
        mostrarErrorFactura('No se pudo consultar el próximo número: ' + err.message);
    }
}

export async function abrirFacturaModal(cliente) {
    clienteAFacturar = cliente;
    facturaRequestId = generarRequestId();
    tipoComprobanteActual = null;

    $('facturaCliente').textContent = cliente.nombre;
    campoFactura('Total').value = cliente.precio ? Number(cliente.precio) : '';
    campoFactura('Descripcion').value = cliente.descripcion || '';
    campoFactura('Comprobante').textContent = 'Consultando a ARCA…';
    campoFactura('EmitirBtn').disabled = true;
    campoFactura('Concepto').value = '2';
    campoFactura('Desde').value = fechaInput(-30);
    campoFactura('Hasta').value = fechaInput();
    campoFactura('Vencimiento').value = fechaInput();
    campoFactura('Documento').value = cliente.documento || '';
    campoFactura('Nombre').value = cliente.nombre || '';
    campoFactura('Alicuota').value = '5';
    llenarSelect(campoFactura('TipoDoc'), [{ valor: 80, texto: 'CUIT' }, { valor: 96, texto: 'DNI' }, { valor: 86, texto: 'CUIL' }], cliente.tipoDocumento || TIPO_DOC_CUIT);
    llenarSelect(campoFactura('CondicionVenta'), [{ valor: 'Contado', texto: 'Contado' }]);
    llenarSelect(campoFactura('CondicionIva'), []); // se precarga con el catálogo real en refrescarProximo()
    sincronizarCamposPeriodo();
    sincronizarCamposReceptor();
    mostrarErrorFactura('');

    // Arranca identificado si el cliente ya tiene documento cargado; si no, consumidor final.
    elegirModoFactura(cliente.tipoDocumento && cliente.documento ? 'identificado' : 'final');

    facturaModal.hidden = false;
    await refrescarProximo();
    snapshotFacturaInicial = snapshotCampos(cuerpoFacturaModal());
}

function cerrarFacturaModal() {
    facturaModal.hidden = true;
    clienteAFacturar = null;
    facturaRequestId = null;
    snapshotFacturaInicial = null;
}

// Cierre por X / Cancelar / click en el fondo: si hay cambios sin guardar, pide
// confirmacion antes. El cierre despues de emitir con exito no pasa por acá.
function intentarCerrarFacturaModal() {
    if (!confirmarDescartarCambios(cuerpoFacturaModal(), snapshotFacturaInicial)) return;
    cerrarFacturaModal();
}

campoFactura('ModoFinal').addEventListener('click', () => { elegirModoFactura('final'); refrescarProximo(); });
campoFactura('ModoIdentificado').addEventListener('click', () => { elegirModoFactura('identificado'); refrescarProximo(); });
campoFactura('Concepto').addEventListener('change', sincronizarCamposPeriodo);
campoFactura('TipoDoc').addEventListener('change', () => { sincronizarCamposReceptor(); refrescarProximo(); });
campoFactura('CondicionIva').addEventListener('change', refrescarProximo);
campoFactura('Total').addEventListener('input', recalcularIva);
campoFactura('Alicuota').addEventListener('change', recalcularIva);

$('facturaEmitirBtn').addEventListener('click', async () => {
    if (!clienteAFacturar) return;
    const cliente = clienteAFacturar;
    const boton = $('facturaEmitirBtn');
    const total = parseFloat(campoFactura('Total').value);
    const tipo = tipoComprobanteActual ?? tipoComprobanteDerivado();

    if (!(total > 0)) {
        mostrarErrorFactura('El importe tiene que ser mayor a cero.');
        return;
    }

    const ivaCalculado = tipo !== 11 ? recalcularIva() : null;
    const letra = letraDe(tipo);
    const requestId = facturaRequestId;
    const carpeta = await prepararCarpetaFacturas();

    if (!confirm(`¿Emitir la Factura ${letra} por ${formatPesos(total)} a "${cliente.nombre}"?\n\nUna vez emitida no se puede anular, solo con una nota de crédito.`)) return;

    mostrarErrorFactura('');
    boton.disabled = true;
    boton.textContent = 'Emitiendo…';

    try {
        const cuerpo = {
            requestId,
            clienteId: cliente.id,
            cliente: cliente.nombre,
            total,
            tipoComprobante: tipo,
            concepto: Number(campoFactura('Concepto').value),
            descripcion: campoFactura('Descripcion').value,
            condicionVenta: campoFactura('CondicionVenta').value,
            servicioDesde: campoFactura('Desde').value,
            servicioHasta: campoFactura('Hasta').value,
            vencimientoPago: campoFactura('Vencimiento').value,
            ...(facturaModo === 'identificado'
                ? {
                    tipoDocumento: Number(campoFactura('TipoDoc').value),
                    documento: campoFactura('Documento').value,
                    condicionIva: Number(campoFactura('CondicionIva').value),
                    nombre: campoFactura('Nombre').value,
                }
                : { tipoDocumento: SIN_IDENTIFICAR, documento: '' }),
            ...(ivaCalculado ? { ivaDetalle: [ivaCalculado] } : {}),
        };

        const datos = await llamarFacturacion('emitir', cuerpo);
        if (datos.necesitaConfiguracion) {
            window.location.href = 'arca-config.html';
            return;
        }
        if (!datos.ok) throw new Error(datos.error || 'No se pudo emitir la factura');

        const f = datos.factura;
        estado.facturadosEsteMes.add(cliente.id);
        document.dispatchEvent(new CustomEvent('facturador:factura-emitida'));
        cerrarFacturaModal();
        if (f.observaciones) {
            alert(`${numeroComprobante(f.tipoComprobante, f.puntoVenta, f.numero)} emitida, pero ARCA devolvió observaciones:\n\n${f.observaciones}`);
        }
        await abrirComprobante(requestId, f, carpeta);
    } catch (err) {
        console.error(err);
        mostrarErrorFactura(err.message);
    } finally {
        boton.disabled = false;
        boton.textContent = 'Emitir factura';
    }
});

$('facturaCancelarBtn').addEventListener('click', intentarCerrarFacturaModal);
$('closeFacturaModalBtn').addEventListener('click', intentarCerrarFacturaModal);
facturaModal.addEventListener('click', (e) => {
    if (e.target === facturaModal && !window.getSelection().toString().length) intentarCerrarFacturaModal();
});
