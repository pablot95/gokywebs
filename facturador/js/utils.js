// Helpers compartidos entre clientes.js, facturacion.js y arca-setup.js.

export const $ = id => document.getElementById(id);

export function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
}

export function formatPesos(n) {
    return Number(n || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
}

// Version corta para etiquetas chicas (ej. arriba de una barra de grafico).
export function formatPesosCorto(n) {
    const v = Number(n || 0);
    if (Math.abs(v) >= 1_000_000) return '$' + (v / 1_000_000).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + 'M';
    if (Math.abs(v) >= 1000) return '$' + (v / 1000).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + 'k';
    return formatPesos(v);
}

export function fechaInput(desplazamientoDias = 0) {
    const d = new Date();
    d.setDate(d.getDate() + desplazamientoDias);
    return d.toISOString().slice(0, 10);
}

export function generarRequestId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Catalogos espejo de config/arca/receptor.php — el PHP no es alcanzable desde
// el cliente, así que se duplican acá los valores fijos (no dependen de ARCA).
export const SIN_IDENTIFICAR = 99;
export const TIPO_DOC_CUIT = 80;
export const CONDICION_IVA_RESPONSABLE_INSCRIPTO = 1;

export const TIPOS_DOCUMENTO_CLIENTE = { 80: 'CUIT', 96: 'DNI', 86: 'CUIL' };

export const CONDICIONES_IVA_RESPALDO = [
    { id: 1, descripcion: 'IVA Responsable Inscripto' },
    { id: 4, descripcion: 'IVA Sujeto Exento' },
    { id: 5, descripcion: 'Consumidor Final' },
    { id: 6, descripcion: 'Responsable Monotributo' },
    { id: 7, descripcion: 'Sujeto No Categorizado' },
    { id: 8, descripcion: 'Proveedor del Exterior' },
    { id: 9, descripcion: 'Cliente del Exterior' },
    { id: 10, descripcion: 'IVA Liberado - Ley N° 19.640' },
    { id: 13, descripcion: 'Monotributista Social' },
    { id: 15, descripcion: 'IVA No Alcanzado' },
    { id: 16, descripcion: 'Monotributo Trabajador Independiente Promovido' },
];

export const ALICUOTAS_IVA = [
    { id: 5, pct: 21 },
    { id: 4, pct: 10.5 },
    { id: 6, pct: 27 },
];

// Condiciones frente al IVA que puede declarar el EMISOR (config de ARCA propia).
export const CONDICIONES_EMISOR = ['Responsable Monotributo', 'Responsable Inscripto', 'IVA Exento'];

export function llenarSelect(select, opciones, seleccionado) {
    select.replaceChildren(...opciones.map(o => {
        const option = document.createElement('option');
        option.value = String(o.valor);
        option.textContent = o.texto;
        return option;
    }));
    if (seleccionado !== undefined && seleccionado !== null) select.value = String(seleccionado);
}

// Snapshot de los campos de un modal (form o div) para poder comparar antes de
// cerrarlo y avisar si hay cambios sin guardar. No depende de que este dentro
// de un <form> real -- junta cualquier input/select/textarea con id adentro.
export function snapshotCampos(contenedor) {
    const campos = contenedor.querySelectorAll('input, select, textarea');
    const snap = {};
    campos.forEach((c) => { if (c.id) snap[c.id] = c.value; });
    return JSON.stringify(snap);
}

// true si esta bien seguir cerrando (sin cambios, o el usuario confirmo
// descartarlos); false si hay que cancelar el cierre.
export function confirmarDescartarCambios(contenedor, snapshotInicial) {
    if (snapshotInicial === null || snapshotCampos(contenedor) === snapshotInicial) return true;
    return confirm('Hay cambios sin guardar. ¿Descartarlos y cerrar?');
}

export function toast(msg, tipo = 'ok') {
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:200;padding:12px 20px;border-radius:10px;font-size:.9rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.15);transition:opacity .2s;';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = tipo === 'error' ? '#fbe9e7' : '#e6f4ea';
    el.style.color = tipo === 'error' ? '#b3261e' : '#1e4620';
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 3000);
}
