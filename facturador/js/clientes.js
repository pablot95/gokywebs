// CRUD de clientes (Firestore, sin backend PHP) + edición inline de descripción/precio.
import { db } from '../firebase-config.js';
import {
    collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {
    $, escapeHtml, formatPesos, llenarSelect, toast,
    TIPOS_DOCUMENTO_CLIENTE, CONDICIONES_IVA_RESPALDO,
} from './utils.js';
import { estado, arcaListoParaFacturar } from './state.js';
import { abrirFacturaModal } from './facturacion.js';

let clientes = [];

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

    wireModal();
    wireInlineEditDelegation();
    wireRowActionsDelegation();
}

function render() {
    $('emptyState').hidden = clientes.length > 0;
    $('tableWrapper').hidden = clientes.length === 0;
    if (!clientes.length) return;

    $('clientsBody').innerHTML = clientes.map(filaCliente).join('');
}

function filaCliente(c) {
    const docLabel = c.documento ? `${TIPOS_DOCUMENTO_CLIENTE[c.tipoDocumento] || ''} ${escapeHtml(c.documento)}`.trim() : '';
    const puedeFacturar = arcaListoParaFacturar();
    return `
    <tr data-id="${c.id}">
        <td>
            <div class="client-name-cell">
                <strong>${escapeHtml(c.nombre)}</strong>
                ${docLabel ? `<span>${docLabel}</span>` : ''}
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
    $('closeClienteModalBtn').addEventListener('click', cerrarModalCliente);
    $('clienteCancelarBtn').addEventListener('click', cerrarModalCliente);
    $('clienteModal').addEventListener('click', (e) => {
        if (e.target === $('clienteModal')) cerrarModalCliente();
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
}

function cerrarModalCliente() {
    $('clienteModal').hidden = true;
}
