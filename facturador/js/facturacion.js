// Modal "Facturar" — puerto de admin/dashboard.js (tabs consumidor final / con
// datos, SIN_IDENTIFICAR, idempotencia por requestId) con dos diferencias:
// precarga desde el cliente de Firestore (no se pisa con la respuesta de ARCA),
// y si el emisor es Responsable Inscripto deriva sola si corresponde A o B según
// la pestaña/documento elegido (nunca un selector aparte que se pueda desincronizar).
import {
    $, formatPesos, fechaInput, generarRequestId, llenarSelect,
    SIN_IDENTIFICAR, TIPO_DOC_CUIT, CONDICION_IVA_RESPONSABLE_INSCRIPTO, ALICUOTAS_IVA,
} from './utils.js';
import { estado, emisorEsResponsableInscripto } from './state.js';

const facturaModal = $('facturaModal');
let clienteAFacturar = null;
let facturaRequestId = null;
let facturaModo = 'final'; // 'final' | 'identificado'
let tipoComprobanteActual = null;

function campoFactura(id) { return $('factura' + id); }

function letraDe(tipo) { return { 1: 'A', 6: 'B', 11: 'C' }[tipo] || 'C'; }

function numeroComprobante(tipo, puntoVenta, numero) {
    return `Factura ${letraDe(tipo)} ${String(puntoVenta).padStart(5, '0')}-${String(numero).padStart(8, '0')}`;
}

// A solo corresponde si el receptor está identificado con CUIT y es Responsable
// Inscripto; cualquier otra combinación (consumidor final, DNI, otra condición)
// es B. Se deriva de los campos reales del formulario, nunca de un selector aparte.
function tipoComprobanteDerivado() {
    if (!emisorEsResponsableInscripto()) return 11;
    if (facturaModo !== 'identificado') return 6;
    const tipoDoc = Number(campoFactura('TipoDoc').value);
    const condIva = Number(campoFactura('CondicionIva').value);
    return (tipoDoc === TIPO_DOC_CUIT && condIva === CONDICION_IVA_RESPONSABLE_INSCRIPTO) ? 1 : 6;
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

async function abrirComprobante(factura) {
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/comprobante.php', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ factura }),
        });
        if (!res.ok) {
            const cuerpo = await res.text();
            let detalle = cuerpo;
            try { detalle = JSON.parse(cuerpo).error || cuerpo; } catch (e) {}
            throw new Error(detalle);
        }
        const nombre = res.headers.get('X-Nombre-Archivo') || `${numeroComprobante(factura.tipoComprobante, factura.puntoVenta, factura.numero)}.pdf`;
        const url = URL.createObjectURL(await res.blob());
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombre;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
        console.error(err);
        alert('No se pudo generar el comprobante: ' + err.message);
    }
}

async function refrescarProximo() {
    const tipo = tipoComprobanteDerivado();
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
        llenarSelect(campoFactura('CondicionIva'), (datos.condicionesIva || []).map(c => ({ valor: c.id, texto: c.descripcion })), campoFactura('CondicionIva').value);

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
    llenarSelect(campoFactura('CondicionIva'), [], cliente.condicionIva || '');
    sincronizarCamposPeriodo();
    sincronizarCamposReceptor();
    mostrarErrorFactura('');

    // Arranca identificado si el cliente ya tiene documento cargado; si no, consumidor final.
    elegirModoFactura(cliente.tipoDocumento && cliente.documento ? 'identificado' : 'final');

    facturaModal.hidden = false;
    await refrescarProximo();
}

function cerrarFacturaModal() {
    facturaModal.hidden = true;
    clienteAFacturar = null;
    facturaRequestId = null;
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

    if (!confirm(`¿Emitir la Factura ${letra} por ${formatPesos(total)} a "${cliente.nombre}"?\n\nUna vez emitida no se puede anular, solo con una nota de crédito.`)) return;

    mostrarErrorFactura('');
    boton.disabled = true;
    boton.textContent = 'Emitiendo…';

    try {
        const cuerpo = {
            requestId: facturaRequestId,
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
        cerrarFacturaModal();
        if (f.observaciones) {
            alert(`${numeroComprobante(f.tipoComprobante, f.puntoVenta, f.numero)} emitida, pero ARCA devolvió observaciones:\n\n${f.observaciones}`);
        }
        await abrirComprobante(f);
    } catch (err) {
        console.error(err);
        mostrarErrorFactura(err.message);
    } finally {
        boton.disabled = false;
        boton.textContent = 'Emitir factura';
    }
});

$('facturaCancelarBtn').addEventListener('click', cerrarFacturaModal);
$('closeFacturaModalBtn').addEventListener('click', cerrarFacturaModal);
facturaModal.addEventListener('click', (e) => {
    if (e.target === facturaModal && !window.getSelection().toString().length) cerrarFacturaModal();
});
