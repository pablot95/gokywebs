import { auth } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const stateEl   = document.getElementById("state");
const contentEl = document.getElementById("content");
const searchEl  = document.getElementById("search");

let currentUser = null;
let currentRange = "7d";
let lastData = null;   // último payload del server (para filtrar sin re-pedir)

/* ── Gate de sesión: sin login → al formulario de acceso ── */
onAuthStateChanged(auth, (user) => {
    if (!user) { window.location.replace("index.html"); return; }
    currentUser = user;
    load();
});

document.getElementById("logoutBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.replace("index.html");
});

/* ── Selector de rango ── */
document.getElementById("ranges").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-range]");
    if (!btn) return;
    document.querySelectorAll("#ranges button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentRange = btn.dataset.range;
    load();
});

/* ── Buscador (filtra en memoria) ── */
searchEl.addEventListener("input", () => { if (lastData) render(lastData); });

async function load() {
    if (!currentUser) return;
    stateEl.className = "state";
    stateEl.textContent = "Cargando…";
    contentEl.innerHTML = "";
    contentEl.appendChild(stateEl);
    try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`/demo/track.php?range=${currentRange}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        lastData = data;
        render(data);
    } catch (err) {
        stateEl.className = "state err";
        stateEl.textContent = "No se pudieron cargar las visitas (" + (err.message || err) + ").";
    }
}

function fmtLast(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return "recién";
    if (diff < 3600) return "hace " + Math.floor(diff / 60) + " min";
    if (diff < 86400) return "hace " + Math.floor(diff / 3600) + " h";
    if (diff < 172800) return "ayer";
    if (diff < 2592000) return "hace " + Math.floor(diff / 86400) + " días";
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function render(data) {
    // Tarjetas de totales.
    document.getElementById("cVisits").textContent  = (data.totals?.visits ?? 0).toLocaleString("es-AR");
    document.getElementById("cUniques").textContent = (data.totals?.uniques ?? 0).toLocaleString("es-AR");
    document.getElementById("cDemos").textContent   = (data.totals?.demos ?? 0).toLocaleString("es-AR");

    let demos = Array.isArray(data.demos) ? data.demos : [];
    const q = (searchEl.value || "").trim().toLowerCase();
    if (q) demos = demos.filter((d) => d.demo.toLowerCase().includes(q));

    if (!demos.length) {
        contentEl.innerHTML = "";
        stateEl.className = "state";
        stateEl.textContent = q
            ? "Ningún demo coincide con la búsqueda."
            : "Todavía no hay visitas registradas en este período.";
        contentEl.appendChild(stateEl);
        return;
    }

    const maxVisits = demos.reduce((m, d) => Math.max(m, d.visits), 0) || 1;

    const rows = demos.map((d) => {
        const url = "https://gokywebs.com/demo/" + encodeURIComponent(d.demo) + "/";
        const pct = Math.round((d.visits / maxVisits) * 100);
        return `<tr>
            <td>
                <div class="demo-name">
                    <a href="${esc(url)}" target="_blank" rel="noopener">${esc(d.demo)}</a>
                    <a class="open" href="${esc(url)}" target="_blank" rel="noopener" title="Abrir muestra">↗</a>
                </div>
            </td>
            <td class="num">${d.visits.toLocaleString("es-AR")}</td>
            <td class="num"><span class="uni">${d.uniques.toLocaleString("es-AR")}</span></td>
            <td class="last">${esc(fmtLast(d.last))}</td>
            <td class="col-bar"><div class="bar-wrap"><div class="bar" style="width:${pct}%"></div></div></td>
        </tr>`;
    }).join("");

    contentEl.innerHTML = `<table>
        <thead><tr>
            <th>Demo</th>
            <th class="num">Visitas</th>
            <th class="num">Personas</th>
            <th>Última</th>
            <th class="col-bar">Relativo</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}
