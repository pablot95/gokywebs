// Historial de facturas emitidas: lista completa (api/estadisticas.php, mismo
// endpoint que la página de Estadísticas), filtro por período, descarga
// individual e impresión conjunta de todo lo que esté filtrado en pantalla.
import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { $, escapeHtml, formatPesos, toast } from './utils.js';
import { estado } from './state.js';

const LETRA = { 1: 'A', 6: 'B', 11: 'C' };
let facturas = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    estado.user = user;
    await cargar();
});

async function cargar() {
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/estadisticas.php', { headers: { Authorization: 'Bearer ' + token } });
        const datos = await res.json();
        facturas = datos.ok ? (datos.facturas || []) : [];
    } catch (err) {
        facturas = [];
    }

    $('loadingState').hidden = true;
    if (!facturas.length) {
        $('emptyState').hidden = false;
        return;
    }

    $('facturasContent').hidden = false;
    wireFiltro();
    wireAcciones();
    render();
}

function formatFecha(yyyymmdd) {
    if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd || '—';
    return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(0, 4)}`;
}

function comprobanteLabel(f) {
    return `${LETRA[f.tipoComprobante] || f.tipoComprobante} ${String(f.puntoVenta).padStart(5, '0')}-${String(f.numero).padStart(8, '0')}`;
}

function wireFiltro() {
    $('filtroDesde').addEventListener('change', render);
    $('filtroHasta').addEventListener('change', render);
    $('limpiarFiltroBtn').addEventListener('click', () => {
        $('filtroDesde').value = '';
        $('filtroHasta').value = '';
        render();
    });
}

function facturasFiltradas() {
    const desde = $('filtroDesde').value.replaceAll('-', '');
    const hasta = $('filtroHasta').value.replaceAll('-', '');
    return facturas.filter(f => (!desde || f.fecha >= desde) && (!hasta || f.fecha <= hasta));
}

function render() {
    const lista = facturasFiltradas();

    $('cantidadResultado').textContent = lista.length === 1 ? '1 factura' : `${lista.length} facturas`;
    $('imprimirTodasBtn').disabled = !lista.length;
    $('imprimirTodasBtn').textContent = lista.length ? `Imprimir todas (${lista.length})` : 'Imprimir todas';

    $('sinResultados').hidden = lista.length > 0;
    $('tableWrapper').hidden = lista.length === 0;

    $('facturasBody').innerHTML = lista.map(f => `
        <tr data-request-id="${escapeHtml(f.requestId)}">
            <td>${formatFecha(f.fecha)}</td>
            <td>${escapeHtml(comprobanteLabel(f))}</td>
            <td>${escapeHtml(f.cliente || 'Consumidor final')}</td>
            <td class="num">${formatPesos(f.total)}</td>
            <td class="num"><button type="button" class="btn-ghost" data-action="descargar" style="padding:6px 12px">Descargar</button></td>
        </tr>`).join('');
}

function wireAcciones() {
    $('facturasBody').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="descargar"]');
        if (!btn) return;
        const requestId = btn.closest('tr').dataset.requestId;
        descargarFactura(requestId, btn);
    });

    $('imprimirTodasBtn').addEventListener('click', imprimirTodas);
}

async function descargarFactura(requestId, boton) {
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Generando…';
    try {
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
        const nombre = res.headers.get('X-Nombre-Archivo') || 'factura.pdf';
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
        toast('No se pudo descargar: ' + err.message, 'error');
    } finally {
        boton.disabled = false;
        boton.textContent = textoOriginal;
    }
}

// Trae el HTML imprimible de una factura ya emitida y devuelve solo lo que hace
// falta para combinarlas: el <style> (igual en todas, mismo template) y el
// contenido de ".hoja" (la hoja en sí, sin el <html>/<head> que la envuelve).
async function obtenerHojaImprimible(requestId, token) {
    const res = await fetch('api/comprobante.php?formato=html', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
    });
    const html = await res.text();
    if (!res.ok) {
        let detalle = html;
        try { detalle = JSON.parse(html).error || html; } catch (e) {}
        throw new Error(detalle);
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const estilo = doc.querySelector('style')?.textContent || '';
    const hoja = doc.querySelector('.hoja')?.outerHTML || '';
    if (!hoja) throw new Error('Respuesta sin contenido');
    return { estilo, hoja };
}

async function imprimirTodas() {
    const lista = facturasFiltradas();
    if (!lista.length) return;
    if (!confirm(`¿Generar la impresión de ${lista.length} factura${lista.length === 1 ? '' : 's'}?`)) return;

    // La ventana se abre YA, en respuesta directa al click -- si se abriera
    // recién después del await de abajo, el navegador la trataría como popup
    // y la bloquearía.
    const ventana = window.open('', '_blank');
    if (!ventana) {
        toast('El navegador bloqueó la ventana de impresión. Permití las ventanas emergentes e intentá de nuevo.', 'error');
        return;
    }
    ventana.document.write(`<p style="font:14px sans-serif;padding:24px">Generando ${lista.length} comprobante(s)…</p>`);
    ventana.document.close();

    try {
        const token = await estado.user.getIdToken();
        const resultados = await Promise.allSettled(lista.map(f => obtenerHojaImprimible(f.requestId, token)));
        const ok = resultados.filter(r => r.status === 'fulfilled').map(r => r.value);
        const fallidas = resultados.length - ok.length;
        if (fallidas) {
            resultados.filter(r => r.status === 'rejected').forEach(r => console.error(r.reason));
            toast(`${fallidas} comprobante(s) no se pudieron generar y quedaron afuera de la impresión.`, 'error');
        }
        if (!ok.length) throw new Error('No se pudo generar ningún comprobante.');

        const estilo = ok[0].estilo;
        const hojas = ok.map(o => o.hoja).join('\n');

        ventana.document.open();
        ventana.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Facturas</title>
<style>
${estilo}
.hoja { page-break-after: always; }
.hoja:last-child { page-break-after: auto; }
</style>
</head>
<body>
${hojas}
<script>
window.onload = function () {
    window.print();
    window.onafterprint = function () { window.close(); };
};
<\/script>
</body>
</html>`);
        ventana.document.close();
    } catch (err) {
        console.error(err);
        ventana.document.open();
        ventana.document.write('<p style="font:14px sans-serif;color:#b3261e;padding:24px">No se pudo generar la impresión: ' + escapeHtml(err.message) + '</p>');
        ventana.document.close();
    }
}
