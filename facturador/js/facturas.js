// Historial de facturas emitidas: lista completa (api/estadisticas.php, mismo
// endpoint que la página de Estadísticas), filtro por período, descarga
// individual e impresión conjunta de todo lo que esté filtrado en pantalla.
import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { $, escapeHtml, formatPesos, toast, prepararCarpetaFacturas, guardarFactura } from './utils.js?v=20261004';
import { estado } from './state.js?v=20261004';

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
    $('descargarTodasBtn').addEventListener('click', descargarTodas);
}

// Descargar todas (4-oct): el PDF de cada factura de la lista filtrada, una por
// una. En Chrome/Edge van directo a la carpeta elegida, sin preguntar nada; en
// los otros navegadores van a Descargas y el navegador pide una vez permiso
// para bajar varios archivos.
let descargandoTodas = false;

async function descargarTodas() {
    if (descargandoTodas) return;
    const lista = facturasFiltradas();
    if (!lista.length) return;
    const boton = $('descargarTodasBtn');
    descargandoTodas = true;
    boton.disabled = true;
    try {
        const carpeta = await prepararCarpetaFacturas();
        if (!confirm(`¿Descargar ${lista.length} factura${lista.length === 1 ? '' : 's'}?`
            + (carpeta ? `\n\nSe guardan en la carpeta ${carpeta.name}.` : '\n\nSe bajan a Descargas: si el navegador pregunta si permitís descargar varios archivos, decile que sí.'))) return;
        const token = await estado.user.getIdToken();
        let ok = 0;
        const fallidas = [];
        for (const [i, f] of lista.entries()) {
            boton.textContent = `Descargando ${i + 1} de ${lista.length}…`;
            try {
                const res = await fetch('api/comprobante.php', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requestId: f.requestId }),
                });
                if (!res.ok) {
                    const cuerpo = await res.text();
                    let detalle = cuerpo;
                    try { detalle = JSON.parse(cuerpo).error || cuerpo; } catch (e) {}
                    throw new Error(detalle);
                }
                const nombre = res.headers.get('X-Nombre-Archivo') || `factura-${i + 1}.pdf`;
                await guardarFactura(await res.blob(), nombre, carpeta, { silencioso: true });
                ok++;
                // Sin carpeta, cada archivo es una descarga del navegador: un respiro
                // entre una y otra para que no las descarte.
                if (!carpeta) await new Promise(r => setTimeout(r, 400));
            } catch (err) {
                console.error(err);
                fallidas.push(err.message);
            }
        }
        if (fallidas.length) {
            toast(`${ok} descargada${ok === 1 ? '' : 's'}; ${fallidas.length} no se pudo generar: ${fallidas[0]}`, 'error');
        } else {
            toast(carpeta ? `${ok} factura${ok === 1 ? '' : 's'} guardada${ok === 1 ? '' : 's'} en ${carpeta.name}.` : `${ok} factura${ok === 1 ? '' : 's'} descargada${ok === 1 ? '' : 's'}.`);
        }
    } finally {
        descargandoTodas = false;
        boton.disabled = false;
        boton.textContent = 'Descargar todas';
    }
}

async function descargarFactura(requestId, boton) {
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Generando…';
    try {
        const carpeta = await prepararCarpetaFacturas();
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
        await guardarFactura(await res.blob(), nombre, carpeta);
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
