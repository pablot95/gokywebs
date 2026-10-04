// CRUD de clientes (Firestore, sin backend PHP) + edición inline de descripción/precio.
import { db } from '../firebase-config.js';
import {
    collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {
    $, escapeHtml, formatPesos, llenarSelect, toast, snapshotCampos, confirmarDescartarCambios,
    TIPOS_DOCUMENTO_CLIENTE, CONDICIONES_IVA_RESPALDO, prepararCarpetaFacturas,
} from './utils.js?v=20261004';
import { estado, arcaListoParaFacturar } from './state.js?v=20261004';
import { abrirFacturaModal, emitirFacturaDeCliente, motivoParaNoEmitir, letraDeCliente } from './facturacion.js?v=20261004';

let clientes = [];
let snapshotClienteInicial = null;

function coleccionClientes() {
    return collection(db, 'facturador_usuarios', estado.user.uid, 'clientes');
}

export function initClientes() {
    llenarSelect($('clienteCondicionIva'), [
        { valor: '', texto: 'Sin dato' },
        ...CONDICIONES_IVA_RESPALDO.map(c => ({ valor: c.id, texto: c.descripcion })),
    ]);

    onSnapshot(query(coleccionClientes(), orderBy('nombre')), (snap) => {
        clientes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        render();
    }, (err) => {
        console.error(err);
        toast('No se pudo cargar la lista de clientes.', 'error');
    });

    cargarFacturadosEsteMes();
    // facturacion.js avisa por acá al emitir, para no importarse mutuamente.
    document.addEventListener('facturador:factura-emitida', render);

    wireModal();
    wireInlineEditDelegation();
    wireRowActionsDelegation();
    $('emitirTodasBtn').addEventListener('click', emitirTodas);
}

function mesActualYYYYMM() {
    const d = new Date();
    return String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0');
}

// De dónde sale la "marquita" de facturado: el historial real de facturas
// (facturador/data/{uid}/emitidas.json vía api/estadisticas.php), filtrado al mes
// calendario actual -- no un flag aparte que se pueda desincronizar, y se resetea
// solo al empezar el mes que viene.
// Devuelve true si se pudo leer el historial (Emitir todas no arranca sin eso:
// sin la lista de facturados del mes le volvería a facturar a todos).
async function cargarFacturadosEsteMes() {
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/estadisticas.php', { headers: { Authorization: 'Bearer ' + token } });
        const datos = await res.json();
        if (!datos.ok) return false;
        const mes = mesActualYYYYMM();
        estado.facturadosEsteMes = new Set(
            (datos.facturas || [])
                .filter(f => f.clienteId && f.fecha?.slice(0, 6) === mes)
                .map(f => f.clienteId),
        );
        render();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// ---------- Emitir todas (4-oct) ----------
// Factura, uno por uno, a cada cliente que todavía no se facturó este mes, con
// lo que tiene cargado (precio, descripción, documento y condición frente al
// IVA; sin documento, consumidor final). Los que no tienen precio o les falta
// un dato fiscal quedan afuera y se avisan. Cada PDF va a la carpeta elegida
// (o a Descargas), sin un aviso por archivo.
let emitiendoTodas = false;

async function emitirTodas() {
    if (emitiendoTodas) return;
    if (!arcaListoParaFacturar()) {
        toast('Configurá ARCA primero.', 'error');
        return;
    }
    const boton = $('emitirTodasBtn');
    emitiendoTodas = true;
    boton.disabled = true;
    try {
        // Primero la carpeta: el navegador solo deja pedirla en el mismo clic.
        const carpeta = await prepararCarpetaFacturas();
        if (!(await cargarFacturadosEsteMes())) {
            alert('No se pudo leer el historial de facturas de este mes, así que no se sabe a quién ya le facturaste. Probá de nuevo en un rato.');
            return;
        }
        const pendientes = clientes.filter(c => !estado.facturadosEsteMes.has(c.id));
        const yaFacturados = clientes.length - pendientes.length;
        const listos = pendientes.filter(c => !motivoParaNoEmitir(c));
        const afuera = pendientes.filter(c => motivoParaNoEmitir(c));
        const lineasAfuera = afuera.map(c => `• ${c.nombre}: ${motivoParaNoEmitir(c)}`);

        if (!listos.length) {
            alert('No hay nada para emitir.'
                + (yaFacturados ? `\n\n${yaFacturados} cliente${yaFacturados === 1 ? '' : 's'} ya ${yaFacturados === 1 ? 'tiene' : 'tienen'} factura este mes.` : '')
                + (lineasAfuera.length ? `\n\nNo se pueden facturar así:\n${lineasAfuera.join('\n')}` : ''));
            return;
        }

        const total = listos.reduce((s, c) => s + Number(c.precio), 0);
        const lineas = listos.map(c => `• ${c.nombre} — Factura ${letraDeCliente(c)} por ${formatPesos(Number(c.precio))}${c.documento ? '' : ' (consumidor final)'}`);
        if (!confirm(`¿Emitir ${listos.length} factura${listos.length === 1 ? '' : 's'} por un total de ${formatPesos(total)}?\n\n`
            + lineas.join('\n')
            + (yaFacturados ? `\n\nQuedan afuera ${yaFacturados} que ya facturaste este mes.` : '')
            + (lineasAfuera.length ? `\n\nTambién quedan afuera:\n${lineasAfuera.join('\n')}` : '')
            + '\n\nCada una sale con su precio y su descripción, servicios de los últimos 30 días y Contado. Una vez emitidas no se pueden anular, solo con una nota de crédito.')) return;

        const avisarAlSalir = (e) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', avisarAlSalir);
        const emitidas = [];
        const fallidas = [];
        let cortada = null;
        let fallasSeguidas = 0;
        render(); // los Facturar de cada fila quedan deshabilitados mientras dura la tanda
        try {
            for (const [i, c] of listos.entries()) {
                boton.textContent = `Emitiendo ${i + 1} de ${listos.length}…`;
                try {
                    emitidas.push({ cliente: c, ...(await emitirFacturaDeCliente(c, carpeta)) });
                    fallasSeguidas = 0;
                    render();
                } catch (err) {
                    console.error(err);
                    fallidas.push({ cliente: c, error: err.message });
                    // Tres seguidas ya no es un cliente: es ARCA o la conexión.
                    if (err.grave || ++fallasSeguidas >= 3) { cortada = c; break; }
                }
            }
        } finally {
            window.removeEventListener('beforeunload', avisarAlSalir);
        }

        const faltaron = cortada ? listos.slice(listos.indexOf(cortada) + 1) : [];
        const sinPdf = emitidas.filter(e => e.errorPdf);
        const conObservaciones = emitidas.filter(e => e.factura.observaciones);
        const partes = [];
        if (emitidas.length) partes.push(`Emitidas (${emitidas.length}):\n${emitidas.map(e => `• ${e.cliente.nombre}: ${e.numero}`).join('\n')}`
            + (carpeta ? `\n\nLos PDF quedaron en la carpeta ${carpeta.name}.` : '\n\nLos PDF se bajaron a Descargas.'));
        if (fallidas.length) partes.push(`No se emitieron (${fallidas.length}):\n${fallidas.map(f => `• ${f.cliente.nombre}: ${f.error}`).join('\n')}`);
        if (cortada) partes.push(`Se frenó ahí para no seguir con ARCA o la conexión fallando. Quedaron sin intentar: ${faltaron.length ? faltaron.map(c => c.nombre).join(', ') : 'ninguno'}. Volvé a tocar "Emitir todas" en un rato: los que ya salieron no se repiten.`);
        if (sinPdf.length) partes.push(`Emitidas, pero no se pudo guardar el PDF (bajalo desde Facturas):\n${sinPdf.map(e => `• ${e.numero}: ${e.errorPdf}`).join('\n')}`);
        if (conObservaciones.length) partes.push(`ARCA devolvió observaciones:\n${conObservaciones.map(e => `• ${e.numero}: ${e.factura.observaciones}`).join('\n')}`);
        alert(partes.join('\n\n'));
        cargarFacturadosEsteMes();
    } finally {
        emitiendoTodas = false;
        boton.disabled = false;
        boton.textContent = 'Emitir todas';
        render();
    }
}

function render() {
    $('emptyState').hidden = clientes.length > 0;
    $('tableWrapper').hidden = clientes.length === 0;
    $('emitirTodasBtn').hidden = clientes.length === 0;
    if (!emitiendoTodas) $('emitirTodasBtn').disabled = !arcaListoParaFacturar();
    if (!clientes.length) return;

    $('clientsBody').innerHTML = clientes.map(filaCliente).join('');
}

function filaCliente(c) {
    const docLabel = c.documento ? `${TIPOS_DOCUMENTO_CLIENTE[c.tipoDocumento] || ''} ${escapeHtml(c.documento)}`.trim() : '';
    const puedeFacturar = arcaListoParaFacturar() && !emitiendoTodas;
    const facturado = estado.facturadosEsteMes.has(c.id);
    return `
    <tr data-id="${c.id}">
        <td>
            <div class="client-name-cell">
                <strong>${escapeHtml(c.nombre)}</strong>
                ${docLabel ? `<span>${docLabel}</span>` : ''}
                ${facturado ? '<span class="badge badge-done">✓ Facturado este mes</span>' : ''}
            </div>
        </td>
        <td>
            <div class="inline-edit" data-field="descripcion">
                <div class="inline-edit-label${c.descripcion ? '' : ' placeholder'}" tabindex="0">${c.descripcion ? escapeHtml(c.descripcion) : 'Agregar descripción…'}</div>
                <textarea class="inline-edit-input" rows="2" maxlength="300" data-original="${escapeHtml(c.descripcion || '')}">${escapeHtml(c.descripcion || '')}</textarea>
            </div>
        </td>
        <td>
            <div class="inline-edit" data-field="notas">
                <div class="inline-edit-label${c.notas ? '' : ' placeholder'}" tabindex="0">${c.notas ? escapeHtml(c.notas) : 'Agregar nota…'}</div>
                <textarea class="inline-edit-input" rows="2" maxlength="500" data-original="${escapeHtml(c.notas || '')}">${escapeHtml(c.notas || '')}</textarea>
            </div>
        </td>
        <td class="num">
            <div class="inline-edit" data-field="precio">
                <div class="inline-edit-label${c.precio ? '' : ' placeholder'}" tabindex="0">${c.precio ? formatPesos(c.precio) : 'Agregar precio…'}</div>
                <input type="number" class="inline-edit-input precio" min="0" step="0.01" value="${c.precio || ''}" data-original="${c.precio || ''}">
            </div>
        </td>
        <td>
            <div class="row-actions">
                <button type="button" class="btn-primary" data-action="facturar" style="padding:8px 14px" ${puedeFacturar ? '' : 'disabled title="Configurá ARCA primero"'}>Facturar</button>
                <button type="button" class="icon-btn" data-action="editar" aria-label="Editar cliente">✎</button>
                <button type="button" class="icon-btn delete" data-action="eliminar" aria-label="Eliminar cliente">🗑</button>
            </div>
        </td>
    </tr>`;
}

// ---------- Edición inline (descripción / precio) ----------
// Mismo patrón que admin/dashboard.js (.notes-cell): click en el label entra en
// modo edición; blur guarda; Escape cancela y restaura el valor original.
function wireInlineEditDelegation() {
    $('clientsBody').addEventListener('click', (e) => {
        const label = e.target.closest('.inline-edit-label');
        if (!label) return;
        const cell = label.closest('.inline-edit');
        cell.classList.add('editing');
        cell.querySelector('.inline-edit-input').focus();
    });

    $('clientsBody').addEventListener('focusout', async (e) => {
        const input = e.target.closest('.inline-edit-input');
        if (!input) return;
        const cell = input.closest('.inline-edit');
        const row = input.closest('tr');
        cell.classList.remove('editing');

        const campo = cell.dataset.field;
        const valorOriginal = input.dataset.original;
        const valorNuevo = input.value.trim();
        if (valorNuevo === valorOriginal) return;

        const label = cell.querySelector('.inline-edit-label');
        const placeholders = { descripcion: 'Agregar descripción…', notas: 'Agregar nota…' };
        try {
            if (campo === 'precio') {
                const num = valorNuevo === '' ? 0 : Math.max(0, parseFloat(valorNuevo) || 0);
                await updateDoc(doc(coleccionClientes(), row.dataset.id), { precio: num, updatedAt: serverTimestamp() });
                label.textContent = num ? formatPesos(num) : 'Agregar precio…';
                label.classList.toggle('placeholder', !num);
                input.dataset.original = num || '';
            } else {
                await updateDoc(doc(coleccionClientes(), row.dataset.id), { [campo]: valorNuevo, updatedAt: serverTimestamp() });
                label.textContent = valorNuevo || placeholders[campo] || '';
                label.classList.toggle('placeholder', !valorNuevo);
                input.dataset.original = valorNuevo;
            }
        } catch (err) {
            console.error(err);
            toast('No se pudo guardar el cambio.', 'error');
            input.value = valorOriginal;
        }
    });

    $('clientsBody').addEventListener('keydown', (e) => {
        const input = e.target.closest('.inline-edit-input');
        if (!input) return;
        if (e.key === 'Escape') {
            input.value = input.dataset.original;
            input.blur();
        } else if (e.key === 'Enter' && input.tagName === 'INPUT') {
            e.preventDefault();
            input.blur();
        }
    });
}

// ---------- Acciones por fila: Facturar / Editar / Eliminar ----------
function wireRowActionsDelegation() {
    $('clientsBody').addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = btn.closest('tr').dataset.id;
        const cliente = clientes.find(c => c.id === id);
        if (!cliente) return;

        if (btn.dataset.action === 'facturar') {
            abrirFacturaModal(cliente);
        } else if (btn.dataset.action === 'editar') {
            abrirModalCliente(cliente);
        } else if (btn.dataset.action === 'eliminar') {
            if (!confirm(`¿Eliminar a "${cliente.nombre}"? Esta acción no se puede deshacer.`)) return;
            try {
                await deleteDoc(doc(coleccionClientes(), id));
                toast('Cliente eliminado.');
            } catch (err) {
                console.error(err);
                toast('No se pudo eliminar.', 'error');
            }
        }
    });
}

// ---------- Modal Agregar / Editar cliente ----------
function wireModal() {
    $('addClientBtn').addEventListener('click', () => abrirModalCliente(null));
    $('addClientBtnEmpty').addEventListener('click', () => abrirModalCliente(null));
    $('closeClienteModalBtn').addEventListener('click', intentarCerrarModalCliente);
    $('clienteCancelarBtn').addEventListener('click', intentarCerrarModalCliente);
    $('clienteModal').addEventListener('click', (e) => {
        if (e.target === $('clienteModal')) intentarCerrarModalCliente();
    });

    $('clientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errEl = $('clienteError');
        errEl.hidden = true;

        const nombre = $('clienteNombre').value.trim();
        if (!nombre) {
            errEl.textContent = 'Falta el nombre o razón social.';
            errEl.hidden = false;
            return;
        }

        const tipoDocumento = $('clienteTipoDoc').value ? Number($('clienteTipoDoc').value) : null;
        const condicionIva = $('clienteCondicionIva').value ? Number($('clienteCondicionIva').value) : null;

        const datos = {
            nombre,
            descripcion: $('clienteDescripcion').value.trim(),
            precio: parseFloat($('clientePrecio').value) || 0,
            email: $('clienteEmail').value.trim(),
            telefono: $('clienteTelefono').value.trim(),
            domicilio: $('clienteDomicilio').value.trim(),
            notas: $('clienteNotas').value.trim(),
            tipoDocumento,
            documento: tipoDocumento ? $('clienteDocumento').value.replace(/\D/g, '') : '',
            condicionIva,
            updatedAt: serverTimestamp(),
        };

        const btn = $('clienteGuardarBtn');
        btn.disabled = true;
        try {
            const id = $('clienteId').value;
            if (id) {
                await updateDoc(doc(coleccionClientes(), id), datos);
            } else {
                await addDoc(coleccionClientes(), { ...datos, createdAt: serverTimestamp() });
            }
            cerrarModalCliente();
            toast('Cliente guardado.');
        } catch (err) {
            console.error(err);
            errEl.textContent = 'No se pudo guardar: ' + err.message;
            errEl.hidden = false;
        } finally {
            btn.disabled = false;
        }
    });
}

function abrirModalCliente(cliente) {
    $('clienteModalTitulo').textContent = cliente ? 'Editar cliente' : 'Agregar cliente';
    $('clienteId').value = cliente?.id || '';
    $('clienteNombre').value = cliente?.nombre || '';
    $('clienteDescripcion').value = cliente?.descripcion || '';
    $('clientePrecio').value = cliente?.precio || '';
    $('clienteEmail').value = cliente?.email || '';
    $('clienteTelefono').value = cliente?.telefono || '';
    $('clienteDomicilio').value = cliente?.domicilio || '';
    $('clienteNotas').value = cliente?.notas || '';
    $('clienteTipoDoc').value = cliente?.tipoDocumento || '';
    $('clienteDocumento').value = cliente?.documento || '';
    $('clienteCondicionIva').value = cliente?.condicionIva || '';
    $('clienteFiscalDetails').open = !!(cliente?.tipoDocumento);
    $('clienteError').hidden = true;
    $('clienteModal').hidden = false;
    $('clienteNombre').focus();
    snapshotClienteInicial = snapshotCampos($('clientForm'));
}

function cerrarModalCliente() {
    $('clienteModal').hidden = true;
    snapshotClienteInicial = null;
}

// Cierre por X / Cancelar / click en el fondo: si hay cambios sin guardar, pide
// confirmacion antes. El cierre despues de guardar con exito no pasa por acá.
function intentarCerrarModalCliente() {
    if (!confirmarDescartarCambios($('clientForm'), snapshotClienteInicial)) return;
    cerrarModalCliente();
}
