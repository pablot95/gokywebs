// Wizard de 3 pasos: datos de la empresa -> generar CSR -> subir el .crt de ARCA.
import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { $ } from './utils.js';
import { estado } from './state.js';

let estadoActual = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    estado.user = user;
    await cargarEstado();
});

async function cargarEstado() {
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/config.php', { headers: { Authorization: 'Bearer ' + token } });
        estadoActual = await res.json();
    } catch (err) {
        estadoActual = { ok: false, configurado: false };
    }
    pintarEstado();
}

function marcarPaso(pasoId, badgeId, done) {
    $(pasoId).dataset.done = String(done);
    const badge = $(badgeId);
    badge.textContent = done ? 'Listo' : 'Pendiente';
    badge.className = 'badge ' + (done ? 'badge-done' : 'badge-pending');
}

function pintarEstado() {
    const paso1Done = !!estadoActual.configurado;
    const paso2Done = !!estadoActual.claveGenerada;
    const paso3Done = !!estadoActual.certListo;

    marcarPaso('paso1', 'badge1', paso1Done);
    marcarPaso('paso2', 'badge2', paso2Done);
    marcarPaso('paso3', 'badge3', paso3Done);

    $('generarCsrBtn').disabled = !paso1Done;
    $('generarCsrBtn').textContent = paso2Done ? 'Generar de nuevo (reemplaza la actual)' : 'Generar y descargar .csr';
    $('certificadoInput').disabled = !paso2Done;
    $('subirCertBtn').disabled = !paso2Done;

    $('listoBanner').hidden = !paso3Done;

    if (paso1Done && estadoActual.config) {
        const c = estadoActual.config;
        $('cuit').value = c.cuit || '';
        $('puntoVenta').value = c.puntoVenta || '';
        $('alias').value = c.alias || '';
        $('condicionIva').value = c.emisor?.condicionIva || '';
        $('razonSocial').value = c.emisor?.razonSocial || '';
        $('domicilio').value = c.emisor?.domicilio || '';
        $('inicioActividades').value = c.emisor?.inicioActividades || '';
        $('ingresosBrutos').value = c.emisor?.ingresosBrutos || '';
    }
}

$('formPaso1').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = $('errorPaso1');
    errEl.hidden = true;
    const btn = $('guardarPaso1Btn');
    btn.disabled = true;
    btn.textContent = 'Guardando…';
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/config.php', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cuit: $('cuit').value.replace(/\D/g, ''),
                puntoVenta: Number($('puntoVenta').value),
                alias: $('alias').value.trim(),
                condicionIva: $('condicionIva').value,
                razonSocial: $('razonSocial').value.trim(),
                domicilio: $('domicilio').value.trim(),
                inicioActividades: $('inicioActividades').value.trim(),
                ingresosBrutos: $('ingresosBrutos').value.trim(),
            }),
        });
        const datos = await res.json();
        if (!datos.ok) throw new Error(datos.error || 'No se pudo guardar');
        await cargarEstado();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.hidden = false;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar datos';
    }
});

$('generarCsrBtn').addEventListener('click', async () => {
    const errEl = $('errorPaso2');
    errEl.hidden = true;
    const yaExiste = !!estadoActual?.claveGenerada;
    if (yaExiste && !confirm('Ya generaste una clave antes. Si generás una nueva vas a tener que volver a subirla a ARCA y subir el certificado de nuevo acá.\n\n¿Generar de todas formas?')) {
        return;
    }

    const btn = $('generarCsrBtn');
    btn.disabled = true;
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/generar-csr.php', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ confirmarRegenerar: yaExiste }),
        });
        if (!res.ok) {
            const cuerpo = await res.json().catch(() => ({}));
            throw new Error(cuerpo.error || `Error HTTP ${res.status}`);
        }
        const nombre = (res.headers.get('Content-Disposition') || '').match(/filename="(.+)"/)?.[1] || 'certificado.csr';
        const url = URL.createObjectURL(await res.blob());
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        await cargarEstado();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.hidden = false;
    } finally {
        btn.disabled = false;
    }
});

$('subirCertBtn').addEventListener('click', async () => {
    const errEl = $('errorPaso3');
    const okEl = $('successPaso3');
    errEl.hidden = true;
    okEl.hidden = true;

    const input = $('certificadoInput');
    if (!input.files.length) {
        errEl.textContent = 'Elegí el archivo .crt que descargaste de ARCA.';
        errEl.hidden = false;
        return;
    }

    const btn = $('subirCertBtn');
    btn.disabled = true;
    btn.textContent = 'Subiendo…';
    try {
        const token = await estado.user.getIdToken();
        const fd = new FormData();
        fd.append('certificado', input.files[0]);
        const res = await fetch('api/subir-certificado.php', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token },
            body: fd,
        });
        const datos = await res.json();
        if (!datos.ok) throw new Error(datos.error || 'No se pudo subir el certificado');
        okEl.textContent = '¡Certificado cargado! Ya podés facturar.';
        okEl.hidden = false;
        input.value = '';
        await cargarEstado();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.hidden = false;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Subir certificado';
    }
});
