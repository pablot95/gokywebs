import { auth, db } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Auth guard ---
let currentUser = null;
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("index.html");
        return;
    }
    currentUser = user;
    document.getElementById("userEmail").textContent = user.email || "";
    initRealtime();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.replace("index.html");
});

// --- Referencias DOM ---
const tbody = document.getElementById("clientsTbody");
const modal = document.getElementById("clientModal");
const form = document.getElementById("clientForm");
const modalTitle = document.getElementById("modalTitle");
const searchInput = document.getElementById("searchInput");

const statCount = document.getElementById("statCount");
const statTotal = document.getElementById("statTotal");
const statPaid = document.getElementById("statPaid");
const statPending = document.getElementById("statPending");

document.getElementById("openModalBtn").addEventListener("click", () => openModal());
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
searchInput.addEventListener("input", render);

// --- Estado ---
let clients = [];

function getEstado(c) {
    if (c.estadoCliente) return c.estadoCliente;
    return c.esCliente ? "cliente" : "interesado";
}

function formatDate(val) {
    if (!val) return "—";
    const [, m, d] = val.split("-");
    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return `${parseInt(d)} de ${months[parseInt(m) - 1]}`;
}

function fmtMoney(n) {
    const v = Number(n) || 0;
    return v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

function initRealtime() {
    const q = query(collection(db, "clientes"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
        clients = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        render();
    }, (err) => {
        console.error(err);
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">Error cargando clientes: ${escapeHtml(err.message)}</td></tr>`;
    });
}

function render() {
    const term = searchInput.value.trim().toLowerCase();
    const list = term
        ? clients.filter(c =>
            (c.nombre || "").toLowerCase().includes(term) ||
            (c.proyecto || "").toLowerCase().includes(term) ||
            (c.telefono || "").toLowerCase().includes(term))
        : clients;

    list.sort((a, b) => {
        const da = a.hablarleElDia || "";
        const db2 = b.hablarleElDia || "";
        if (da && db2) return da < db2 ? -1 : da > db2 ? 1 : 0;
        if (da) return -1;
        if (db2) return 1;
        return 0;
    });

    if (list.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="9">No hay clientes${term ? " para esa búsqueda" : ""}.</td></tr>`;
    } else {
        tbody.innerHTML = list.map(c => {
            const saldo = (Number(c.valorTotal) || 0) - (Number(c.abono) || 0);
            const demo = !!c.demoPresentada;
                    const estado = getEstado(c);
                    const estadoLabel = estado === "cliente" ? "Cliente" : estado === "quiere-demo" ? "Quiere demo" : "Solo interesado";
                    return `
                <tr class="client-row" data-row-id="${c.id}">
                    <td>${escapeHtml(c.nombre)}</td>
                    <td class="col-proyecto" title="${escapeHtml(c.proyecto)}">${escapeHtml(c.proyecto)}</td>
                    <td class="col-telefono">${escapeHtml(c.telefono)}</td>
                    <td class="num">${fmtMoney(c.valorTotal)}</td>
                    <td class="num">${fmtMoney(c.abono)}</td>
                    <td class="center">
                        <button class="toggle-pill status ${estado}" data-cycle-status="${c.id}" title="Click para cambiar">
                            ${estadoLabel}
                        </button>
                    </td>
                    <td class="center">
                        <button class="toggle-pill ${demo ? 'on' : 'off'}" data-toggle-demo="${c.id}" title="Click para cambiar">
                            ${demo ? 'Sí' : 'No'}
                        </button>
                    </td>
                    <td class="center">
                        <div class="date-cell" data-date-id="${c.id}">
                            <span class="date-label${c.hablarleElDia ? ' has-date' : ''}">${formatDate(c.hablarleElDia)}</span>
                            <input type="date" class="inline-date" value="${escapeHtml(c.hablarleElDia || '')}">
                        </div>
                    </td>
                    <td class="actions-col">
                        <button class="icon-btn edit" data-id="${c.id}" title="Editar">✎</button>
                        <button class="icon-btn delete" data-id="${c.id}" title="Eliminar">🗑</button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // Stats globales (no dependen del filtro)
    const totals = clients.reduce((acc, c) => {
        acc.total += Number(c.valorTotal) || 0;
        acc.paid += Number(c.abono) || 0;
        return acc;
    }, { total: 0, paid: 0 });
    const pendingSoloClientes = clients
        .filter(c => getEstado(c) === "cliente")
        .reduce((acc, c) => acc + Math.max(0, (Number(c.valorTotal) || 0) - (Number(c.abono) || 0)), 0);
    statCount.textContent = clients.length;
    statTotal.textContent = fmtMoney(totals.total);
    statPaid.textContent = fmtMoney(totals.paid);
    statPending.textContent = fmtMoney(pendingSoloClientes);

    // Listeners de acciones
    tbody.querySelectorAll(".client-row").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest("button, input, .date-cell, .actions-col")) return;
            openModal(row.dataset.rowId);
        });
    });
    tbody.querySelectorAll(".icon-btn.edit").forEach(b =>
        b.addEventListener("click", () => openModal(b.dataset.id)));
    tbody.querySelectorAll(".icon-btn.delete").forEach(b =>
        b.addEventListener("click", () => removeClient(b.dataset.id)));
    tbody.querySelectorAll("[data-toggle-demo]").forEach(b =>
        b.addEventListener("click", () => toggleField(b.dataset.toggleDemo, "demoPresentada")));
    tbody.querySelectorAll("[data-cycle-status]").forEach(b =>
        b.addEventListener("click", () => cycleStatus(b.dataset.cycleStatus)));
    tbody.querySelectorAll(".date-cell").forEach(cell => {
        const label = cell.querySelector(".date-label");
        const input = cell.querySelector(".inline-date");
        label.addEventListener("click", () => {
            cell.classList.add("editing");
            input.focus();
        });
        input.addEventListener("change", async () => {
            await updateField(cell.dataset.dateId, "hablarleElDia", input.value || "");
            label.textContent = formatDate(input.value);
            label.className = "date-label" + (input.value ? " has-date" : "");
            cell.classList.remove("editing");
        });
        input.addEventListener("blur", () => {
            cell.classList.remove("editing");
        });
    });
}

async function updateField(id, field, value) {
    try {
        await updateDoc(doc(db, "clientes", id), {
            [field]: value,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(err);
        alert("Error al actualizar: " + err.message);
    }
}

async function toggleField(id, field) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    try {
        await updateDoc(doc(db, "clientes", id), {
            [field]: !c[field],
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(err);
        alert("Error al actualizar: " + err.message);
    }
}

async function cycleStatus(id) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    const current = getEstado(c);
    const next = current === "interesado" ? "quiere-demo" : current === "quiere-demo" ? "cliente" : "interesado";
    try {
        await updateDoc(doc(db, "clientes", id), {
            estadoCliente: next,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(err);
        alert("Error al actualizar: " + err.message);
    }
}

function openModal(id = null) {
    form.reset();
    document.getElementById("clientId").value = "";
    if (id) {
        const c = clients.find(x => x.id === id);
        if (!c) return;
        modalTitle.textContent = "Editar cliente";
        document.getElementById("clientId").value = c.id;
        document.getElementById("nombre").value = c.nombre || "";
        document.getElementById("proyecto").value = c.proyecto || "";
        document.getElementById("telefono").value = c.telefono || "";
        document.getElementById("valorTotal").value = c.valorTotal ?? 0;
        document.getElementById("abono").value = c.abono ?? 0;
        document.getElementById("demoPresentada").checked = !!c.demoPresentada;
        document.getElementById("estadoCliente").value = getEstado(c);
    } else {
        modalTitle.textContent = "Nuevo cliente";
        document.getElementById("abono").value = 0;
        document.getElementById("demoPresentada").checked = false;
        document.getElementById("estadoCliente").value = "interesado";
    }
    modal.hidden = false;
}

function closeModal() {
    modal.hidden = true;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("clientId").value;
    const data = {
        nombre: document.getElementById("nombre").value.trim(),
        proyecto: document.getElementById("proyecto").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        demoPresentada: document.getElementById("demoPresentada").checked,
        estadoCliente: document.getElementById("estadoCliente").value,
        valorTotal: Number(document.getElementById("valorTotal").value) || 0,
        abono: Number(document.getElementById("abono").value) || 0,
        updatedAt: serverTimestamp()
    };

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";

    try {
        if (id) {
            await updateDoc(doc(db, "clientes", id), data);
        } else {
            await addDoc(collection(db, "clientes"), {
                ...data,
                createdAt: serverTimestamp(),
                createdBy: currentUser?.uid || null
            });
        }
        closeModal();
    } catch (err) {
        console.error(err);
        alert("Error al guardar: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Guardar";
    }
});

async function removeClient(id) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    if (!confirm(`¿Eliminar al cliente "${c.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
        await deleteDoc(doc(db, "clientes", id));
    } catch (err) {
        console.error(err);
        alert("Error al eliminar: " + err.message);
    }
}
