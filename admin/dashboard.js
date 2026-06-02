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

const statCount = null; // eliminado

document.getElementById("openModalBtn").addEventListener("click", () => openModal());
document.getElementById("closeModalBtn").addEventListener("click", tryCloseModal);
document.getElementById("cancelBtn").addEventListener("click", tryCloseModal);
modal.addEventListener("click", (e) => { if (e.target === modal) tryCloseModal(); });
searchInput.addEventListener("input", render);

// --- Tabs ---
let activeTab = "clientes";
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.dataset.tab;
        document.getElementById("tabClientes").hidden   = activeTab !== "clientes";
        document.getElementById("tabCalendario").hidden = activeTab !== "calendario";
        document.getElementById("tabPropuestas").hidden = activeTab !== "propuestas";
        if (activeTab === "calendario") renderCal();
    });
});

// --- Calendario DOM ---
const calGrid = document.getElementById("calGrid");
const calMonthLabel = document.getElementById("calMonthLabel");
const dayModal = document.getElementById("dayModal");
const dayModalTitle = document.getElementById("dayModalTitle");
const dayModalBody = document.getElementById("dayModalBody");
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

document.getElementById("calPrev").addEventListener("click", () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCal();
});
document.getElementById("calNext").addEventListener("click", () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCal();
});
document.getElementById("closeDayModalBtn").addEventListener("click", () => { dayModal.hidden = true; });
dayModal.addEventListener("click", (e) => { if (e.target === dayModal) dayModal.hidden = true; });

// --- Estado ---
let clients = [];
let propuestas = [];
let activeFilter = "seguimiento1";

// --- Filtros de viñeta ---
document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        render();
    });
});

function getEstado(c) {
    const e = c.estadoCliente || "seguimiento1";
    if (e === "seguimiento" || e === "demo-presentada" || e === "quiere-demo") return "seguimiento2";
    if (e === "interesado") return "seguimiento1";
    return e;
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
        if (activeTab === "calendario") renderCal();
    }, (err) => {
        console.error(err);
        tbody.innerHTML = `<tr class="empty-row"><td colspan="9">Error cargando clientes: ${escapeHtml(err.message)}</td></tr>`;
    });

    // ── Propuestas realtime ──
    const qProp = query(collection(db, "propuestas"), orderBy("createdAt", "desc"));
    onSnapshot(qProp, (snap) => {
        propuestas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderPropuestas();
        const el = document.getElementById("countPropuestas");
        if (el) el.textContent = propuestas.length;
    }, (err) => {
        console.error("Propuestas error:", err);
    });
}

function render() {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = activeFilter === "seguimiento1" ? clients.filter(c => getEstado(c) === "seguimiento1")
        : activeFilter === "seguimiento2" ? clients.filter(c => getEstado(c) === "seguimiento2")
        : activeFilter === "seguimiento3" ? clients.filter(c => getEstado(c) === "seguimiento3")
        : clients.filter(c => getEstado(c) === "cliente");
    const list = term
        ? filtered.filter(c =>
            (c.nombre || "").toLowerCase().includes(term) ||
            (c.proyecto || "").toLowerCase().includes(term) ||
            (c.telefono || "").toLowerCase().includes(term))
        : filtered;

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
                    const estado = getEstado(c);
                    const estadoLabel = estado === "cliente" ? "Cliente" : estado === "seguimiento3" ? "Seguimiento 3" : estado === "seguimiento2" ? "Seguimiento 2" : "Seguimiento 1";
                    return `
                <tr class="client-row" data-row-id="${c.id}">
                    <td>${escapeHtml(c.nombre)}</td>
                    <td class="col-proyecto" title="${escapeHtml(c.proyecto)}">${escapeHtml(c.proyecto)}</td>
                    <td class="col-telefono">${escapeHtml(c.telefono)}</td>
                    <td class="num">${fmtMoney(c.valorTotal)}</td>
                    <td class="num">${fmtMoney(c.abono)}</td>
                    <td class="center">
                        <select class="inline-status-select ${estado}" data-status-id="${c.id}">
                            <option value="seguimiento1"${estado === 'seguimiento1' ? ' selected' : ''}>Seguimiento 1</option>
                            <option value="seguimiento2"${estado === 'seguimiento2' ? ' selected' : ''}>Seguimiento 2</option>
                            <option value="seguimiento3"${estado === 'seguimiento3' ? ' selected' : ''}>Seguimiento 3</option>
                            <option value="cliente"${estado === 'cliente' ? ' selected' : ''}>Cliente</option>
                        </select>
                    </td>
                    <td class="center">
                        <div class="date-cell" data-date-id="${c.id}">
                            <span class="date-label${c.hablarleElDia ? ' has-date' : ''}">${formatDate(c.hablarleElDia)}</span>
                            <input type="date" class="inline-date" value="${escapeHtml(c.hablarleElDia || '')}">
                        </div>
                    </td>
                    <td class="notes-col">
                        <div class="notes-cell" data-note-id="${c.id}">
                            <span class="notes-label${c.notas ? ' has-note' : ''}">${escapeHtml(c.notas || 'Agregar nota…')}</span>
                            <textarea class="notes-input" maxlength="500" rows="2" data-original="${escapeHtml(c.notas || '')}">${escapeHtml(c.notas || '')}</textarea>
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

    // Contadores de viñetas
    const countSeg1 = clients.filter(c => getEstado(c) === "seguimiento1").length;
    const countSeg2 = clients.filter(c => getEstado(c) === "seguimiento2").length;
    const countSeg3 = clients.filter(c => getEstado(c) === "seguimiento3").length;
    const countClientes = clients.filter(c => getEstado(c) === "cliente").length;
    document.getElementById("countSeg1").textContent = countSeg1;
    document.getElementById("countSeg2").textContent = countSeg2;
    document.getElementById("countSeg3").textContent = countSeg3;
    document.getElementById("countClientes").textContent = countClientes;

    // Calcular total pendiente de cobro solo de clientes
    const totalPendiente = clients
        .filter(c => getEstado(c) === "cliente")
        .reduce((sum, c) => {
            const valorTotal = Number(c.valorTotal) || 0;
            const abonado = Number(c.abono) || 0;
            const pendiente = valorTotal - abonado;
            return sum + (pendiente > 0 ? pendiente : 0);
        }, 0);
    document.getElementById("totalPendiente").textContent = fmtMoney(totalPendiente);

    // Listeners de acciones
    tbody.querySelectorAll(".client-row").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest("button, input, select, .date-cell, .actions-col, .notes-col")) return;
            openModal(row.dataset.rowId);
        });
    });
    tbody.querySelectorAll(".icon-btn.edit").forEach(b =>
        b.addEventListener("click", () => openModal(b.dataset.id)));
    tbody.querySelectorAll(".icon-btn.delete").forEach(b =>
        b.addEventListener("click", () => removeClient(b.dataset.id)));
    tbody.querySelectorAll("[data-status-id]").forEach(sel => {
        sel.addEventListener("change", () => setStatus(sel.dataset.statusId, sel.value));
    });
    tbody.querySelectorAll(".notes-cell").forEach(cell => {
        const label = cell.querySelector(".notes-label");
        const textarea = cell.querySelector(".notes-input");
        label.addEventListener("click", () => {
            cell.classList.add("editing");
            textarea.focus();
        });
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                textarea.value = textarea.dataset.original;
                cell.classList.remove("editing");
            }
        });
        textarea.addEventListener("blur", async () => {
            const val = textarea.value.trim();
            cell.classList.remove("editing");
            label.textContent = val || "Agregar nota…";
            label.className = "notes-label" + (val ? " has-note" : "");
            textarea.dataset.original = val;
            await updateField(cell.dataset.noteId, "notas", val);
        });
    });
    tbody.querySelectorAll(".date-cell").forEach(cell => {
        const label = cell.querySelector(".date-label");
        const input = cell.querySelector(".inline-date");
        label.addEventListener("click", () => {
            cell.classList.add("editing");
            input.focus();
            try { input.showPicker(); } catch (e) {}
        });
        input.addEventListener("click", () => {
            try { input.showPicker(); } catch (e) {}
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

async function setStatus(id, value) {
    try {
        const c = clients.find(x => x.id === id);
        const prevEstado = c ? getEstado(c) : null;

        const updateData = {
            estadoCliente: value,
            updatedAt: serverTimestamp()
        };

        // Avanzar fecha automáticamente según la transición
        if (prevEstado === "seguimiento1" && value === "seguimiento2") {
            const d = new Date();
            d.setDate(d.getDate() + 3);
            updateData.hablarleElDia = d.toISOString().split("T")[0];
        } else if (prevEstado === "seguimiento2" && value === "seguimiento3") {
            const d = new Date();
            d.setDate(d.getDate() + 10);
            updateData.hablarleElDia = d.toISOString().split("T")[0];
        }

        await updateDoc(doc(db, "clientes", id), updateData);
    } catch (err) {
        console.error(err);
        alert("Error al actualizar: " + err.message);
    }
}

function openModal(id = null) {
    form.reset();
    formDirty = false;
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
        document.getElementById("estadoCliente").value = getEstado(c);
        document.getElementById("hablarleElDia").value = c.hablarleElDia || "";

        // Mostrar datos de propuesta original si existen
        const propSection = document.getElementById("propuestaInfoSection");
        const propBody    = document.getElementById("propuestaInfoBody");
        const hasPropData = c.contactoNombre || c.colores || c.tipografias || c.referencias || c.logoUrl || c.extra;
        if (hasPropData) {
            const logoRow = c.logoUrl
                ? `<div class="prop-row"><span class="prop-label">Logo</span><span><a href="${escapeHtml(c.logoUrl)}" target="_blank" download="${escapeHtml(c.logoNombre || 'logo')}" style="color:var(--accent-green);font-weight:600">⬇ Descargar logo</a> <span class="muted" style="font-size:11px">(${escapeHtml(c.logoNombre || '')})</span></span></div>`
                : `<div class="prop-row"><span class="prop-label">Logo</span><span class="muted">No subió logo</span></div>`;
            propBody.innerHTML = `
                ${c.contactoNombre ? `<div class="prop-row"><span class="prop-label">Contacto</span><span>${escapeHtml(c.contactoNombre)}</span></div>` : ""}
                ${c.colores     ? `<div class="prop-row prop-row-block"><span class="prop-label">Colores</span><p class="prop-text">${escapeHtml(c.colores)}</p></div>` : ""}
                ${c.tipografias ? `<div class="prop-row"><span class="prop-label">Tipografías</span><span>${escapeHtml(c.tipografias)}</span></div>` : ""}
                ${c.referencias ? `<div class="prop-row prop-row-block"><span class="prop-label">Referencias</span><p class="prop-text">${escapeHtml(c.referencias)}</p></div>` : ""}
                ${c.extra       ? `<div class="prop-row prop-row-block"><span class="prop-label">Algo más</span><p class="prop-text">${escapeHtml(c.extra)}</p></div>` : ""}
                ${logoRow}
                ${c.propuestaFecha  ? `<div class="prop-row muted" style="font-size:12px"><span class="prop-label">Fecha propuesta</span><span>${escapeHtml(c.propuestaFecha)}</span></div>` : ""}
            `;
            propSection.style.display = "";
        } else {
            propSection.style.display = "none";
            propBody.innerHTML = "";
        }
    } else {
        modalTitle.textContent = "Nuevo cliente";
        document.getElementById("abono").value = 0;
        document.getElementById("estadoCliente").value = "seguimiento1";
        document.getElementById("propuestaInfoSection").style.display = "none";
        document.getElementById("propuestaInfoBody").innerHTML = "";
    }
    syncEstadoSelect();
    modal.hidden = false;
    // Marcar dirty a partir del primer cambio del usuario
    setTimeout(() => {
        form.querySelectorAll("input, select, textarea").forEach(el => {
            el.addEventListener("input", markDirty, { once: false });
            el.addEventListener("change", markDirty, { once: false });
        });
    }, 0);
}

let formDirty = false;
function markDirty() { formDirty = true; }

function tryCloseModal() {
    if (formDirty && !confirm("Tenés cambios sin guardar. ¿Salir de todos modos?")) return;
    closeModal();
}

function closeModal() {
    modal.hidden = true;
}

function syncEstadoSelect() {
    const sel = document.getElementById("estadoCliente");
    sel.dataset.estado = sel.value;
}

document.getElementById("estadoCliente").addEventListener("change", syncEstadoSelect);

document.getElementById("hablarleElDia").addEventListener("click", function () {
    try { this.showPicker(); } catch (e) {}
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("clientId").value;
    const data = {
        nombre: document.getElementById("nombre").value.trim(),
        proyecto: document.getElementById("proyecto").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        estadoCliente: document.getElementById("estadoCliente").value,
        hablarleElDia: document.getElementById("hablarleElDia").value || "",
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
        formDirty = false;
        closeModal();
    } catch (err) {
        console.error(err);
        alert("Error al guardar: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Guardar";
    }
});

// --- Propuestas ---
const propuestaModal     = document.getElementById("propuestaModal");
const propuestaModalBody = document.getElementById("propuestaModalBody");
const propuestaModalTitle = document.getElementById("propuestaModalTitle");
const searchPropuestasInput = document.getElementById("searchPropuestas");

document.getElementById("closePropuestaModalBtn").addEventListener("click", () => { propuestaModal.hidden = true; });
propuestaModal.addEventListener("click", (e) => { if (e.target === propuestaModal) propuestaModal.hidden = true; });
searchPropuestasInput.addEventListener("input", renderPropuestas);

function renderPropuestas() {
    const tbody = document.getElementById("propuestasTbody");
    const term  = searchPropuestasInput.value.trim().toLowerCase();
    const list  = term
        ? propuestas.filter(p =>
            (p.nombre_negocio  || "").toLowerCase().includes(term) ||
            (p.rubro           || "").toLowerCase().includes(term) ||
            (p.contacto_nombre || "").toLowerCase().includes(term) ||
            (p.contacto_cel    || "").toLowerCase().includes(term))
        : propuestas;

    if (list.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No hay propuestas${term ? " para esa búsqueda" : " recibidas aún"}.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(p => {
        const fecha = p.createdAt?.toDate
            ? p.createdAt.toDate().toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit", year:"numeric" })
            : (p.fecha || "—");
        const coloresTexto = p.colores || p.colores_extra || "";
        return `
            <tr class="client-row" data-row-prop-id="${p.id}" style="cursor:pointer">
                <td>${escapeHtml(fecha)}</td>
                <td><strong>${escapeHtml(p.nombre_negocio || "—")}</strong></td>
                <td>
                    <div>${escapeHtml(p.nombre || p.contacto_nombre || "—")}</div>
                    <div class="muted" style="font-size:12px">${escapeHtml(p.telefono || p.contacto_cel || "")}</div>
                </td>
                <td>${escapeHtml(p.rubro || "—")}</td>
                <td style="font-size:12px;max-width:160px">${escapeHtml(coloresTexto || "—")}</td>
                <td class="actions-col">
                    <button class="btn-ghost" data-prop-id="${p.id}" style="font-size:13px">Ver →</button>
                    <button class="btn-presentada-prop" data-prop-presentada="${p.id}" style="font-size:13px">Presentada</button>
                    <button class="icon-btn delete" data-prop-del="${p.id}" title="Eliminar">🗑</button>
                </td>
            </tr>
        `;
    }).join("");

    tbody.querySelectorAll("[data-row-prop-id]").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest("button, .actions-col")) return;
            openPropuestaModal(row.dataset.rowPropId);
        });
    });
    tbody.querySelectorAll("[data-prop-id]").forEach(btn => {
        btn.addEventListener("click", () => openPropuestaModal(btn.dataset.propId));
    });
    tbody.querySelectorAll("[data-prop-presentada]").forEach(btn => {
        btn.addEventListener("click", () => openPresentadaModal(btn.dataset.propPresentada));
    });
    tbody.querySelectorAll("[data-prop-del]").forEach(btn => {
        btn.addEventListener("click", () => removePropuesta(btn.dataset.propDel));
    });
}

function openPropuestaModal(id) {
    const p = propuestas.find(x => x.id === id);
    if (!p) return;
    propuestaModalTitle.textContent = p.nombre_negocio || "Propuesta";

    const coloresTexto = p.colores || p.colores_extra || "";

    const ynLabel = { si: "✅ Sí", no: "❌ No", ns: "🤷 No sé", "(no respondió)": "—" };
    const yn = v => ynLabel[v] || escapeHtml(v || "—");

    const logoRow = p.logoUrl
        ? `<div class="prop-row"><span class="prop-label">Logo</span><span><a href="${escapeHtml(p.logoUrl)}" target="_blank" download="${escapeHtml(p.logoNombre || 'logo')}" style="color:var(--accent-green);font-weight:600">⬇ Descargar logo</a> <span class="muted" style="font-size:11px">(${escapeHtml(p.logoNombre || '')})</span></span></div>`
        : `<div class="prop-row"><span class="prop-label">Logo</span><span class="muted">No subió logo</span></div>`;

    propuestaModalBody.innerHTML = `
        <div class="prop-row"><span class="prop-label">Nombre</span><span>${escapeHtml(p.nombre || p.contacto_nombre || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Teléfono / WhatsApp</span><span>${escapeHtml(p.telefono || p.contacto_cel || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Negocio / Marca</span><span>${escapeHtml(p.nombre_negocio || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Rubro</span><span>${escapeHtml(p.rubro || "—")}</span></div>
        ${coloresTexto ? `<div class="prop-row prop-row-block"><span class="prop-label">Colores</span><p class="prop-text">${escapeHtml(coloresTexto)}</p></div>` : ""}
        <div class="prop-row"><span class="prop-label">Tipografías</span><span>${escapeHtml(p.tipografias || "(no completó)")}</span></div>
        <div class="prop-row prop-row-block"><span class="prop-label">Referencias visuales</span><p class="prop-text">${escapeHtml(p.referencias || "(no completó)")}</p></div>
        ${p.extra ? `<div class="prop-row prop-row-block"><span class="prop-label">Algo más</span><p class="prop-text">${escapeHtml(p.extra)}</p></div>` : ""}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
        ${logoRow}
        <div class="prop-row muted" style="font-size:12px"><span class="prop-label">Fecha</span><span>${escapeHtml(p.fecha || "—")}</span></div>
    `;
    propuestaModal.hidden = false;
}

async function removePropuesta(id) {
    const p = propuestas.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`¿Eliminar la propuesta de "${p.nombre_negocio || "este negocio"}"? No se puede deshacer.`)) return;
    try {
        await deleteDoc(doc(db, "propuestas", id));
    } catch (err) {
        console.error(err);
        alert("Error al eliminar: " + err.message);
    }
}

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

// --- Modal Presentada (propuesta → seguimiento en clientes) ---
const presentadaModal = document.getElementById("presentadaModal");
const presentadaForm  = document.getElementById("presentadaForm");

document.getElementById("closePresentadaModalBtn").addEventListener("click", () => { presentadaModal.hidden = true; });
document.getElementById("cancelPresentadaBtn").addEventListener("click", () => { presentadaModal.hidden = true; });
presentadaModal.addEventListener("click", (e) => { if (e.target === presentadaModal) presentadaModal.hidden = true; });

function openPresentadaModal(propId) {
    const p = propuestas.find(x => x.id === propId);
    if (!p) return;
    document.getElementById("presentadaPropId").value = propId;
    document.getElementById("presentadaNombre").value = p.nombre_negocio || "";
    document.getElementById("presentadaFecha").value = "";
    document.getElementById("presentadaValor").value = 0;
    presentadaModal.hidden = false;
}

presentadaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const propId  = document.getElementById("presentadaPropId").value;
    const nombre  = document.getElementById("presentadaNombre").value.trim();
    const fecha   = document.getElementById("presentadaFecha").value || "";
    const valor   = Number(document.getElementById("presentadaValor").value) || 0;

    const p = propuestas.find(x => x.id === propId);
    if (!p) return;

    const saveBtn = document.getElementById("savePresentadaBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";

    try {
        await addDoc(collection(db, "clientes"), {
            nombre,
            proyecto:        p.rubro || "",
            telefono:        p.telefono || p.contacto_cel || "",
            estadoCliente:   "seguimiento1",
            hablarleElDia:   fecha,
            valorTotal:      valor,
            abono:           0,
            notas:           "",
            // ── Datos originales de la propuesta ──
            propuestaId:     propId,
            propuestaFecha:  p.fecha || "",
            contactoNombre:  p.nombre || p.contacto_nombre || "",
            colores:         p.colores || p.colores_extra || "",
            tipografias:     p.tipografias || "",
            referencias:     p.referencias || "",
            logoUrl:         p.logoUrl || "",
            logoNombre:      p.logoNombre || "",
            extra:           p.extra || "",
            createdAt:      serverTimestamp(),
            createdBy:      currentUser?.uid || null
        });
        await deleteDoc(doc(db, "propuestas", propId));
        presentadaModal.hidden = true;
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Confirmar";
    }
});

// --- Calendario ---
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function getDemosForDate(dateStr) {
    return clients.filter(c => {
        const e = getEstado(c);
        return (e === "seguimiento1" || e === "seguimiento2" || e === "seguimiento3") && c.hablarleElDia === dateStr;
    });
}

function getDemosByStatus(dateStr, status) {
    return clients.filter(c => getEstado(c) === status && c.hablarleElDia === dateStr);
}

function renderCal() {
    calMonthLabel.textContent = `${MONTHS_ES[calMonth]} ${calYear}`;
    const firstDow = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const startOffset = (firstDow + 6) % 7;

    const today = new Date();
    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();

    let html = `<div class="cal-day-names">
        <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
    </div><div class="cal-days">`;

    for (let i = 0; i < startOffset; i++) {
        html += `<div class="cal-cell empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const seg1 = getDemosByStatus(dateStr, "seguimiento1");
        const seg2 = getDemosByStatus(dateStr, "seguimiento2");
        const seg3 = getDemosByStatus(dateStr, "seguimiento3");
        const hasAny = seg1.length + seg2.length + seg3.length > 0;
        const isToday = todayY === calYear && todayM === calMonth && todayD === d;
        const cls = ["cal-cell", isToday ? "today" : "", hasAny ? "has-demos" : ""].filter(Boolean).join(" ");
        let badges = "";
        if (seg1.length > 0) badges += `<span class="cal-badge badge-seg1">${seg1.length}</span>`;
        if (seg2.length > 0) badges += `<span class="cal-badge badge-seg2">${seg2.length}</span>`;
        if (seg3.length > 0) badges += `<span class="cal-badge badge-seg3">${seg3.length}</span>`;
        html += `<div class="${cls}" data-date="${dateStr}">
            <span class="cal-day-num">${d}</span>
            ${badges}
        </div>`;
    }

    html += `</div>`;
    calGrid.innerHTML = html;

    calGrid.querySelectorAll(".cal-cell[data-date]").forEach(cell => {
        cell.addEventListener("click", () => openDayModal(cell.dataset.date));
    });
}

function openDayModal(dateStr) {
    const demos = getDemosForDate(dateStr);
    const [y, m, d] = dateStr.split("-");
    dayModalTitle.textContent = `${parseInt(d)} de ${MONTHS_ES[parseInt(m) - 1]} ${y}`;

    if (demos.length === 0) {
        dayModalBody.innerHTML = `<p class="muted" style="padding:16px 0">No hay eventos para este día.</p>`;
    } else {
        dayModalBody.innerHTML = `<div class="demo-list">${demos.map(c => {
            const estado = getEstado(c);
            const estadoLabel = estado === "cliente" ? "Cliente" : estado === "seguimiento3" ? "Seguimiento 3" : estado === "seguimiento2" ? "Seguimiento 2" : "Seguimiento 1";
            const saldo = Math.max(0, (Number(c.valorTotal) || 0) - (Number(c.abono) || 0));
            return `
            <div class="demo-item" data-item-id="${c.id}">
                <div class="demo-item-header">
                    <div class="demo-item-main">
                        <span class="demo-item-name">${escapeHtml(c.nombre)}</span>
                        <span class="demo-item-proyecto">${escapeHtml(c.proyecto)}</span>
                    </div>
                    <div style="display:flex;gap:6px;align-items:center">
                        <button class="btn-check-done" data-check-id="${c.id}" title="Marcar como hecho">&#10003; Hecho</button>
                        <button class="icon-btn delete btn-cal-delete" data-cal-del-id="${c.id}" title="Eliminar cliente">🗑</button>
                    </div>
                </div>
                <div class="demo-item-details">
                    <div class="demo-detail"><span class="demo-detail-label">Teléfono</span><span>${escapeHtml(c.telefono || '—')}</span></div>
                    <div class="demo-detail"><span class="demo-detail-label">Valor total</span><span>${fmtMoney(c.valorTotal)}</span></div>
                    <div class="demo-detail"><span class="demo-detail-label">Abonado</span><span class="abonado-val">${fmtMoney(c.abono)}</span></div>
                    <div class="demo-detail"><span class="demo-detail-label">Saldo</span><span class="saldo-val">${fmtMoney(saldo)}</span></div>
                    <div class="demo-detail full-width"><span class="demo-detail-label">Estado</span><span class="estado-mini ${estado}">${estadoLabel}</span></div>
                    <div class="demo-detail full-width">
                        <span class="demo-detail-label">Cambiar fecha</span>
                        <input type="date" class="inline-date cal-change-date" data-cal-date-id="${c.id}" value="${escapeHtml(c.hablarleElDia || '')}">
                    </div>
                </div>
                ${c.notas ? `<div class="demo-item-notas">📝 ${escapeHtml(c.notas)}</div>` : ''}
                <div class="demo-item-actions">
                    <button class="btn-presentada" data-mark-id="${c.id}" data-mark-next="cliente">Confirmar cliente</button>
                </div>
            </div>
        `;
        }).join("")}</div>`;

        // Visual: marcar/desmarcar hecho (sin Firestore)
        dayModalBody.querySelectorAll(".btn-check-done").forEach(btn => {
            btn.addEventListener("click", () => {
                const item = dayModalBody.querySelector(`.demo-item[data-item-id="${btn.dataset.checkId}"]`);
                const isDone = item.classList.toggle("done");
                btn.classList.toggle("checked", isDone);
                btn.textContent = isDone ? "✓ Hecho" : "✓ Hecho";
            });
        });

        // Cambiar fecha desde el modal del calendario
        dayModalBody.querySelectorAll(".cal-change-date").forEach(input => {
            input.addEventListener("change", async () => {
                const id = input.dataset.calDateId;
                const newDate = input.value || "";
                await updateField(id, "hablarleElDia", newDate);
                renderCal();
                openDayModal(dateStr);
            });
        });

        // Eliminar cliente desde el modal del calendario
        dayModalBody.querySelectorAll(".btn-cal-delete").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.calDelId;
                const c = clients.find(x => x.id === id);
                if (!c) return;
                if (!confirm(`¿Eliminar al cliente "${c.nombre}"? Esta acción no se puede deshacer.`)) return;
                try {
                    await deleteDoc(doc(db, "clientes", id));
                    renderCal();
                    openDayModal(dateStr);
                } catch (err) {
                    console.error(err);
                    alert("Error al eliminar: " + err.message);
                }
            });
        });

        // Presentada: guarda en Firestore
        dayModalBody.querySelectorAll(".btn-presentada").forEach(btn => {
            btn.addEventListener("click", async () => {
                btn.disabled = true;
                btn.textContent = "Guardando...";
                await updateField(btn.dataset.markId, "estadoCliente", btn.dataset.markNext);
                dayModal.hidden = true;
            });
        });
    }

    dayModal.hidden = false;
}
