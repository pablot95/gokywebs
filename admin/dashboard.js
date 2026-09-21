import { auth, db } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    collection,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const TYPE_LABELS = { landing: 'Landing Page', 'web-completa': 'Web Completa', ecommerce: 'E-commerce', inmobiliaria: 'Inmobiliaria' };

// --- Checklist de entrega (solo clientes confirmados) ---
const TAREAS_CLIENTE = [
    { key: "ecommerce", label: "Completar el ecommerce (admin)" },
    { key: "firebase",  label: "Crear Firebase" },
    { key: "dominio",   label: "Conectar con dominio" },
    { key: "mail",      label: "Crear mail" },
    { key: "emailjs",   label: "Conectar EmailJS" },
    { key: "mp",        label: "Conectar Mercado Pago" },
    { key: "probada",   label: "Probarla" },
];

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
    sincronizarNoLeidosWabot();
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
modal.addEventListener("click", (e) => { if (e.target === modal && !window.getSelection().toString().length) tryCloseModal(); });
searchInput.addEventListener("input", render);

// --- Tabs ---
let activeTab = "clientes";
// ¿El panel del bot está en pantalla fija (Conversaciones) o crece con su
// contenido (Textos, Entrenamiento)? Lo avisa el propio iframe por postMessage.
let wabotPantallaFija = true;
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const tabAnterior = activeTab;
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.dataset.tab;
        document.getElementById("tabClientes").hidden      = activeTab !== "clientes";
        document.getElementById("tabCalendario").hidden    = activeTab !== "calendario";
        document.getElementById("tabPropuestas").hidden    = activeTab !== "propuestas";
        document.getElementById("tabPresupuestos").hidden  = activeTab !== "presupuestos";
        document.getElementById("tabLeads").hidden         = activeTab !== "leads";
        document.getElementById("tabCompletados").hidden   = activeTab !== "completados";
        document.getElementById("tabSeguimientos").hidden  = activeTab !== "seguimientos";
        document.getElementById("tabMetricas").hidden      = activeTab !== "metricas";
        document.getElementById("tabWabot").hidden         = activeTab !== "wabot";
        // La página deja de scrollear solo si el panel está en pantalla fija
        // (Conversaciones). En las pestañas largas del bot scrollea el admin.
        document.body.classList.toggle("wabot-tab", activeTab === "wabot");
        document.body.classList.toggle("wabot-tab", activeTab === "wabot");
    document.body.classList.toggle("wabot-full", activeTab === "wabot" && wabotPantallaFija);
        document.body.classList.toggle("propuestas-tab", activeTab === "propuestas");
        document.getElementById("tabMantenimiento").hidden = activeTab !== "mantenimiento";
        if (activeTab === "calendario") renderCal();
        if (activeTab === "propuestas") sincronizarAvisosBoceto();
        if (activeTab === "seguimientos") { renderSeg(); sincronizarPresentados(); }
        if (activeTab === "completados") renderCompletados();
        if (activeTab === "metricas") renderSubMetrica(subMetrica);
        if (activeTab === "wabot") { abrirWabot(); requestAnimationFrame(ajustarAltoWabot); }
        if (activeTab === "mantenimiento") renderMantenimiento();
        if (tabAnterior === "wabot" && activeTab !== "wabot") sincronizarNoLeidosWabot();
    });
});

/* ── Sub-pestañas de Métricas (Stats · Embudo · Visitas demos) ──
   Van juntas bajo una sola pestaña para no llenar la barra de arriba. */
let subMetrica = "stats";

function renderSubMetrica(sub) {
    subMetrica = sub;
    document.querySelectorAll("#metricasNav .subtab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.sub === sub);
    });
    document.getElementById("tabStats").hidden  = sub !== "stats";
    document.getElementById("tabEmbudo").hidden = sub !== "embudo";
    document.getElementById("tabDemos").hidden  = sub !== "demos";
    if (sub === "stats")  renderStats();
    if (sub === "embudo") { renderEmbudo(); renderEmbudoPresupuesto(); }
    if (sub === "demos")  renderDemos();
}

document.querySelectorAll("#metricasNav .subtab-btn").forEach(btn => {
    btn.addEventListener("click", () => renderSubMetrica(btn.dataset.sub));
});

/* ¿Está a la vista esta métrica? Los onSnapshot de abajo la usan para redibujar
   solo lo que el usuario está mirando (antes alcanzaba con activeTab). */
function enMetrica(sub) {
    return activeTab === "metricas" && subMetrica === sub;
}

/* ── Panel del bot de WhatsApp (wabot/admin.php en un iframe) ──
   Se carga recién al entrar a la pestaña: así el admin no arranca una sesión
   PHP ni consulta las conversaciones si Pablo nunca abre esta solapa. */

// Handshake: le pasamos el ID token de Firebase a wabot/auth.php, que lo
// valida contra Google y abre la sesión del panel. Así no pide otra clave.
// La usan tanto el iframe como los fetch directos a wabot/admin.php.
async function wabotAuthHandshake() {
    const idToken = currentUser ? await currentUser.getIdToken() : "";
    if (!idToken) return;
    await fetch("../wabot/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id_token: idToken }),
        credentials: "same-origin"
    });
}

async function abrirWabot() {
    const f = document.getElementById("wabotFrame");
    if (!f || f.src.indexOf("wabot") !== -1) return;

    // Si el handshake falla, el iframe carga igual y muestra su propio login.
    try { await wabotAuthHandshake(); } catch (e) {
        console.warn("No se pudo abrir sesión automática en el panel del bot:", e);
    }
    f.src = "../wabot/admin.php?embed=1";
}

/* ── Modal "Ver chat" desde Bocetos: el chat del bot en un modal, sin salir
   de la pestaña. Mismo panel embebido que la pestaña WhatsApp (mismo iframe,
   mismo handshake de sesión), pero apuntado directo a esa conversación y
   sobre un modal en vez de navegar a otra pestaña o abrir otra ventana. */
const chatModal = document.getElementById("chatModal");
const chatModalFrame = document.getElementById("chatModalFrame");

async function abrirChatModal(tel, titulo) {
    if (!tel) return;
    document.getElementById("chatModalTitle").textContent = titulo || tel;
    document.getElementById("chatModalAparte").href = "../wabot/admin.php?tab=conversaciones&ver=" + encodeURIComponent(tel);
    chatModal.hidden = false;
    chatModalFrame.src = "about:blank";

    try { await wabotAuthHandshake(); } catch (e) {
        console.warn("No se pudo abrir sesión automática en el panel del bot:", e);
    }
    // Si mientras esperaba el handshake Pablo ya cerró el modal, no cargar nada.
    if (chatModal.hidden) return;
    chatModalFrame.src = "../wabot/admin.php?tab=conversaciones&ver=" + encodeURIComponent(tel) + "&embed=1";
}

function cerrarChatModal() {
    chatModal.hidden = true;
    // Corta el polling/refresco propio del panel embebido apenas se cierra.
    chatModalFrame.src = "about:blank";
    // Si desde el chat se mandó el template de 72 h, la fila de Seguimientos lo muestra ya.
    if (activeTab === "seguimientos") sincronizarPresentados();
}
document.getElementById("closeChatModalBtn").addEventListener("click", cerrarChatModal);
chatModal.addEventListener("click", (e) => { if (e.target === chatModal) cerrarChatModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chatModal.hidden) cerrarChatModal(); });

/* ── Sincronización con "Presentados" del bot ──
   El bot corre por cron: manda el recordatorio a las 48h sin confirmar y
   archiva el chat a la semana. Esto refleja esos dos hechos en Firestore
   (Seguimiento → Último mensaje / borrado) apenas el admin está abierto.
   La misma lista pinta el botón del template de 72 h de cada fila. */
let wabotPresentados = [];
let wabotPresentadosFirma = "";
async function sincronizarPresentados() {
    if (!currentUser) return;
    try {
        await wabotAuthHandshake();
        const res = await fetch("../wabot/admin.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ accion: "presentados_estado" }),
            credentials: "same-origin"
        });
        const data = await res.json();
        wabotPresentados = data.items || [];
        // Repinta solo si cambió algo que el botón muestra: renderSeg rehace la
        // tabla y se llevaría puesta una nota que Pablo esté escribiendo.
        const firma = JSON.stringify(wabotPresentados.map(it => [it.clave, it.cliente_id, it.canal, it.template_72h_ts]));
        if (firma !== wabotPresentadosFirma) {
            wabotPresentadosFirma = firma;
            if (activeTab === "seguimientos") renderSeg();
        }
        for (const item of (data.items || [])) {
            if (!item.cliente_id) continue;
            if (item.archivado) {
                // Desde el 10-sep-2026 el cliente con la web entregada se queda en
                // Clientes con su plan mensual: un chat archivado nunca lo borra.
                // Si todavía no está en la lista cargada, se deja para la próxima vuelta.
                const archivado = clients.find(x => x.id === item.cliente_id);
                if (!archivado || getEstado(archivado) === "cliente") continue;
                try { await deleteDoc(doc(db, "clientes", item.cliente_id)); } catch (_) {}
                continue;
            }
            if (item.recordatorio_enviado && !item.confirmado) {
                const c = clients.find(x => x.id === item.cliente_id);
                if (c && getEstado(c) !== "ultimo-mensaje") await setStatus(item.cliente_id, "ultimo-mensaje");
            }
        }
    } catch (e) {
        console.warn("No se pudo sincronizar Presentados con el bot:", e);
    }
}
setInterval(sincronizarPresentados, 10 * 60 * 1000);

/* ── Contador de "sin leer" en la pestaña WhatsApp ──
   Mismo criterio que la pestaña "No leídos" del panel embebido: el ÚLTIMO
   mensaje de la charla lo mandó el cliente (nadie —ni el bot, ni vos— le
   contestó todavía). Si el bot ya respondió, no cuenta como pendiente aunque
   nunca hayas abierto esa respuesta. Los archivados no cuentan. Se consulta
   aparte (no depende de que el iframe esté cargado) para verlo sin entrar. */
async function sincronizarNoLeidosWabot() {
    if (!currentUser) return;
    try {
        await wabotAuthHandshake();
        const res = await fetch("../wabot/admin.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ accion: "lista" }),
            credentials: "same-origin"
        });
        const data = await res.json();
        const items = data.items || [];
        // Mismo criterio que la pestaña del panel (ver GRUPOS_SIN_LEER en
        // wabot/admin.php): solo parte 2 y cola de demos, con el cliente
        // esperando respuesta y el chat sin abrir.
        const GRUPOS_SIN_LEER = ["pago", "presentados", "presentadas_48", "muestra"];
        const noLeidos = items.filter(it =>
            it.grupo !== "archivado"
            && (GRUPOS_SIN_LEER.includes(it.grupo) || it.espera || it.handoff_pendiente)
            && it.quien === "cliente" && it.no_leido).length;
        const el = document.getElementById("countWabotNoLeidos");
        if (el) el.textContent = noLeidos;
    } catch (e) {
        console.warn("No se pudo sincronizar los no leídos del bot:", e);
    }
}
setInterval(sincronizarNoLeidosWabot, 60 * 1000);

/* ── Puntito del aviso de la mañana, en Bocetos ──
   Guarda por teléfono cuándo salió el aviso de la mañana (wabot) y cuándo
   escribió el cliente por última vez. Con eso, cada fila calcula si ya
   pasaron 24h sin contestar (puntito rojo) o cuánto falta para eso. */
let wabotAvisos = {};
async function sincronizarAvisosBoceto() {
    if (!currentUser) return;
    try {
        await wabotAuthHandshake();
        const res = await fetch("../wabot/admin.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ accion: "avisos_estado" }),
            credentials: "same-origin"
        });
        const data = await res.json();
        wabotAvisos = {};
        for (const item of (data.items || [])) {
            const clave = cleanArgPhone(item.tel);
            if (clave) wabotAvisos[clave] = item;
        }
        renderPropuestas();
    } catch (e) {
        console.warn("No se pudo sincronizar el aviso de la mañana con el bot:", e);
    }
}
setInterval(sincronizarAvisosBoceto, 10 * 60 * 1000);
// Sin fetch nuevo: solo repinta para que la cuenta regresiva no quede vieja.
setInterval(() => { if (Object.keys(wabotAvisos).length) renderPropuestas(); }, 60 * 1000);

/** Estado del puntito para un boceto: null si no aplica (sin aviso o ya contestó). */
function estadoAvisoBoceto(p) {
    const clave = cleanArgPhone(p.telefono || p.contacto_cel);
    const item = clave ? wabotAvisos[clave] : null;
    if (!item) return null;
    if (item.ultimo_cliente_ts > item.muestra_aviso_ts) return null; // ya contestó

    // La ventana de Meta la reabre el CLIENTE, no el aviso que mandó el bot:
    // contarla desde muestra_aviso_ts daba hasta 24 h de más y el boceto figuraba
    // con tiempo de sobra cuando en realidad ya no se le podía escribir.
    if (!item.ultimo_cliente_ts) return { vencido: true };
    const limite = (item.ultimo_cliente_ts + 24 * 3600) * 1000;
    const faltan = limite - Date.now();
    if (faltan <= 0) return { vencido: true };

    const h = Math.floor(faltan / 3600000);
    const m = Math.floor((faltan % 3600000) / 60000);
    return { vencido: false, texto: h > 0 ? `faltan ${h}h ${m}min` : `faltan ${m}min` };
}

/* El panel del bot nunca tiene scroll propio: o crece hasta su alto real y
   scrollea la página del admin (pestañas largas como Textos o Entrenamiento),
   o se ajusta a la ventana cuando el propio panel avisa que va a pantalla fija
   (Conversaciones, donde scrollea la lista y el chat). Un solo scroll siempre.
   El alto lo manda el iframe por postMessage; esto es solo el fallback inicial. */
function ajustarAltoWabot() {
    const f = document.getElementById("wabotFrame");
    if (!f || activeTab !== "wabot" || !wabotPantallaFija) return;
    const top = f.getBoundingClientRect().top;
    f.style.height = Math.max(360, window.innerHeight - top - 4) + "px";
}
window.addEventListener("resize", ajustarAltoWabot);

window.addEventListener("message", (ev) => {
    if (ev.origin !== location.origin) return;
    const d = ev.data;
    if (!d || d.wabot !== true) return;

    const f = document.getElementById("wabotFrame");
    if (!f) return;

    wabotPantallaFija = !!d.full;
    document.body.classList.toggle("wabot-full", activeTab === "wabot" && wabotPantallaFija);

    // Sin margen extra: cualquier suma acá se acumula vuelta a vuelta.
    if (wabotPantallaFija) ajustarAltoWabot();
    else if (d.alto > 0) f.style.height = d.alto + "px";
});

/* ── Rango de fechas: presets + rango a medida (compartido embudo/demos) ──
   Arma el query string para track.php: si hay fecha "Desde"/"Hasta" cargada,
   manda ?from&to (rango a medida); si no, cae al preset activo (?range). */
function rangeQuery(preset, fromId, toId) {
    const from = document.getElementById(fromId)?.value || "";
    const to   = document.getElementById(toId)?.value || "";
    if (from || to) {
        const p = new URLSearchParams();
        if (from) p.set("from", from);
        if (to)   p.set("to", to);
        return p.toString();
    }
    return "range=" + preset;
}

/* Cablea un bloque de rango de fechas a medida: al elegir una fecha se desactivan
   los presets; "Limpiar" vuelve al preset activo. `onChange` re-renderiza. */
function wireDateRange({ fromId, toId, clearId, rangesSel, getPreset, onChange }) {
    const fromEl  = document.getElementById(fromId);
    const toEl    = document.getElementById(toId);
    const clearEl = document.getElementById(clearId);
    if (!fromEl || !toEl || !clearEl) return;

    // Sin fechas futuras.
    const hoy = new Date().toLocaleDateString("en-CA");   // YYYY-MM-DD local
    fromEl.max = hoy;
    toEl.max   = hoy;

    const onDate = () => {
        const any = fromEl.value || toEl.value;
        document.querySelectorAll(rangesSel + " button").forEach(x => x.classList.remove("active"));
        clearEl.hidden = !any;
        onChange();
    };
    fromEl.addEventListener("change", onDate);
    toEl.addEventListener("change", onDate);

    clearEl.addEventListener("click", () => {
        fromEl.value = "";
        toEl.value   = "";
        clearEl.hidden = true;
        const preset = document.querySelector(`${rangesSel} button[data-range="${getPreset()}"]`);
        document.querySelectorAll(rangesSel + " button").forEach(x => x.classList.remove("active"));
        if (preset) preset.classList.add("active");
        onChange();
    });
}

// --- Embudo del formulario (datos desde /form/track.php) ---
let embudoRange = "7d";

document.querySelectorAll("#embudoRanges button").forEach(b => {
    b.addEventListener("click", () => {
        // Un preset descarta el rango a medida cargado en las fechas.
        const f = document.getElementById("embudoFrom"), t = document.getElementById("embudoTo");
        if (f) f.value = ""; if (t) t.value = "";
        document.getElementById("embudoDatesClear").hidden = true;
        document.querySelectorAll("#embudoRanges button").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        embudoRange = b.dataset.range;
        renderEmbudo();
        renderEmbudoPresupuesto();
    });
});

wireDateRange({
    fromId: "embudoFrom", toId: "embudoTo", clearId: "embudoDatesClear",
    rangesSel: "#embudoRanges", getPreset: () => embudoRange,
    onChange: () => { renderEmbudo(); renderEmbudoPresupuesto(); },
});

async function renderEmbudo() {
    // Reactivado 03-ago-2026 (había quedado comentado en dashboard.html el
    // 31-jul-2026). El guard queda igual por las dudas de que el contenedor
    // no esté en el DOM.
    const cont = document.getElementById("embudoContent");
    if (!cont) return;
    cont.innerHTML = '<p class="muted">Cargando…</p>';

    let data;
    try {
        const token = currentUser ? await currentUser.getIdToken() : "";
        const res = await fetch(`/form/track.php?${rangeQuery(embudoRange, "embudoFrom", "embudoTo")}`, {
            cache: "no-store",
            headers: { "Authorization": "Bearer " + token }
        });
        data = await res.json();
    } catch (e) {
        cont.innerHTML = '<p class="muted">No se pudieron cargar los datos del embudo.</p>';
        return;
    }

    const s      = data.stages || {};
    // El form ya no tiene paso de precio: enter → paso 2 → enviaron (24-jul-2026).
    // 'precio_visto' queda como evento legado en los leads viejos, ya no se grafica.
    const order  = ["enter", "step2", "success"];
    const labels = { enter: "Entraron", step2: "Llegaron al paso 2", success: "Enviaron sus datos" };
    const icons  = { enter: "👀", step2: "✍️", success: "✅" };
    const enter  = s.enter || 0;
    const pct    = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

    if (enter === 0) {
        cont.innerHTML = '<p class="muted">Todavía no hay datos en este rango. Apenas entre gente al formulario, se refleja acá.</p>';
        return;
    }

    const origenIcons = {
        whatsapp: '<svg viewBox="0 0 24 24" fill="#25D366" aria-hidden="true" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.113 1.522 5.85L.057 23.5l5.797-1.44A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.805 9.805 0 01-5.031-1.384l-.36-.214-3.44.855.876-3.36-.234-.375A9.818 9.818 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/></svg>',
        instagram: '<img src="InstagramPng.png" alt="" aria-hidden="true" style="width:1em;height:1em;vertical-align:-0.15em;object-fit:contain">',
        nativo: "🌐",
    };
    const origenLabels = { whatsapp: "WhatsApp", instagram: "Instagram", nativo: "Web" };
    const origenTotals = data.origenTotals || { whatsapp: 0, instagram: 0, nativo: 0 };

    let html = '<div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">';

    html += '<div style="display:flex;flex-direction:column;gap:10px;flex:1 1 380px;max-width:640px">';
    order.forEach((ev, i) => {
        const count = s[ev] || 0;
        const width = Math.max(pct(count, enter), 4);
        const so = (data.stageOrigenes || {})[ev];
        const soLine = so ? ["whatsapp", "instagram", "nativo"]
            .filter(k => (so[k] || 0) > 0)
            .map(k => `${origenIcons[k]} <b style="color:#e6ecf7">${so[k]}</b>`)
            .join(' &nbsp;·&nbsp; ') : "";
        html += `<div style="position:relative;background:#111d35;border:1px solid #1e2c49;border-radius:12px;padding:14px 16px;overflow:hidden">
            <div style="position:absolute;top:0;bottom:0;left:0;width:${width}%;background:linear-gradient(90deg,rgba(37,99,235,.30),rgba(96,165,250,.08))"></div>
            <div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px">
                <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:1.3rem">${icons[ev]}</span>
                    <div>
                        <div style="font-weight:600;color:#e6ecf7">${labels[ev]}</div>
                        ${ev !== "enter" ? `<div style="font-size:.78rem;color:#8a9bb8">${pct(count, enter)}% de los que entraron</div>` : ""}
                        ${soLine ? `<div style="font-size:.8rem;color:#8a9bb8;margin-top:4px">${soLine}</div>` : ""}
                    </div>
                </div>
                <div style="font-size:1.7rem;font-weight:800;color:#fff">${count}</div>
            </div>
        </div>`;
        if (i < order.length - 1) {
            const next = order[i + 1];
            const lost = count - (s[next] || 0);
            html += `<div style="text-align:center;font-size:.76rem;color:#6e7f9e">▼ se pierden <b style="color:#f19a9a">${lost}</b> (${pct(lost, count)}%)</div>`;
        }
    });
    html += "</div>";

    html += '<div style="display:flex;flex-direction:column;gap:10px;min-width:140px">';
    ["whatsapp", "instagram", "nativo"].forEach(o => {
        html += `<div style="background:#111d35;border:1px solid #1e2c49;border-radius:12px;padding:12px 14px;text-align:center">
            <div style="font-size:1.3rem">${origenIcons[o]}</div>
            <div style="font-size:1.3rem;font-weight:800;color:#fff">${origenTotals[o] || 0}</div>
            <div style="font-size:.72rem;color:#8a9bb8">${origenLabels[o]}</div>
        </div>`;
    });
    // Sesiones que llegaron con el form pre-cargado por el bot (link con parámetros).
    const prefillCount = (data.fields || {}).prefill || 0;
    if (prefillCount > 0) {
        html += `<div style="background:#111d35;border:1px solid rgba(37,180,90,.4);border-radius:12px;padding:12px 14px;text-align:center">
            <div style="font-size:1.3rem">🔗</div>
            <div style="font-size:1.3rem;font-weight:800;color:#fff">${prefillCount}</div>
            <div style="font-size:.72rem;color:#8a9bb8">Pre-cargados<br>por el bot</div>
        </div>`;
    }
    html += "</div>";

    html += "</div>";

    // ── ¿Dónde se quedan? — micro-embudo de campos del paso 1 ──
    const f = data.fields || {};
    const fieldOrder = ["form_start", "field_negocio", "field_rubro", "field_productos", "field_telefono"];
    const fieldLabels = {
        form_start:      "✋ Tocaron el formulario",
        field_negocio:   "Completaron: Nombre del negocio",
        field_rubro:     "Completaron: ¿A qué se dedica?",
        field_productos: "Completaron: ¿Qué ofrecés?",
        field_telefono:  "Completaron: Teléfono / WhatsApp",
    };
    html += '<h3 style="margin:24px 0 4px;font-size:.95rem;color:#c7d3e8">🔍 ¿Dónde se quedan? · campos del paso 1</h3>';
    html += '<p style="margin:0 0 10px;font-size:.76rem;color:#6e7f9e">Embudo acumulativo: cada fila cuenta únicamente sesiones que también completaron todos los requisitos anteriores. La caída entre filas muestra dónde se frenó el avance. Ojo: el 18/07/2026 se reordenó el paso 1 (contacto al final) — los rangos que crucen esa fecha mezclan las dos mediciones.</p>';
    if (fieldOrder.some(k => (f[k] || 0) > 0)) {
        html += '<div style="display:flex;flex-direction:column;gap:6px;max-width:640px">';
        fieldOrder.forEach(k => {
            const c = f[k] || 0;
            const p = pct(c, enter);
            const width = Math.max(p, 3);
            html += `<div style="position:relative;background:#111d35;border:1px solid #1e2c49;border-radius:10px;padding:9px 14px;overflow:hidden">
                <div style="position:absolute;top:0;bottom:0;left:0;width:${width}%;background:linear-gradient(90deg,rgba(139,92,246,.30),rgba(167,139,250,.08))"></div>
                <div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px">
                    <div style="font-size:.86rem;color:#e6ecf7">${fieldLabels[k]}</div>
                    <div style="display:flex;align-items:baseline;gap:8px">
                        <span style="font-size:.74rem;color:#8a9bb8">${p}% de los que entraron</span>
                        <b style="font-size:1.05rem;color:#fff">${c}</b>
                    </div>
                </div>
            </div>`;
        });
        html += '</div>';
    } else {
        html += '<p class="muted" style="max-width:640px;background:#111d35;border:1px dashed #1e2c49;border-radius:10px;padding:12px 14px;font-size:.84rem">Todavía no hay datos de campos en este rango. Se registran desde que subiste esta mejora — apenas alguien toque el formulario, aparecen las barras acá. 💡 Podés probarlo vos: entrá a gokywebs.com/form, escribí algo en "Nombre del negocio", tocá afuera del campo y refrescá este panel.</p>';
    }

    const byDay = data.byDay || [];
    if (byDay.length) {
        const formatOrigenCell = (o) => {
            const parts = ["whatsapp", "instagram", "nativo"]
                .filter(k => (o?.[k] || 0) > 0)
                .map(k => `${origenIcons[k]} ${o[k]}`);
            return parts.length ? parts.join(" &nbsp; ") : "—";
        };
        html += '<h3 style="margin:24px 0 10px;font-size:.95rem;color:#c7d3e8">Por día</h3>';
        html += '<div class="table-wrapper"><table class="clients-table"><thead><tr>' +
                '<th>Fecha</th><th class="num">Entraron</th><th class="num">Paso 2</th>' +
                '<th class="num">Enviaron</th><th class="num">Conv.</th><th>Origen</th>' +
                '</tr></thead><tbody>';
        byDay.forEach(d => {
            html += `<tr>
                <td>${d.date.slice(8, 10)}/${d.date.slice(5, 7)}</td>
                <td class="num">${d.enter}</td>
                <td class="num">${d.step2}</td>
                <td class="num">${d.success}</td>
                <td class="num">${pct(d.success, d.enter)}%</td>
                <td style="white-space:nowrap;font-size:.85rem">${formatOrigenCell(d.origenes)}</td>
            </tr>`;
        });
        html += "</tbody></table></div>";
    }

    cont.innerHTML = html;
}

/* ── Embudo del presupuesto (datos desde Firestore, no track.php) ──
   Cada visita a gokywebs.com/presupuesto escribe UN doc por sesión en
   `presupuesto_funnel` (ver script.js de esa carpeta), que se va completando
   con merge a medida que avanza: step1At (entró) → step2At → step3At →
   precioAt (vio el resultado) → muestraAt (tocó "Quiero mi muestra") →
   confirmoAt (confirmó el boceto). Al ser un único doc por sesión el embudo
   es monótono por construcción — no hace falta cruzar `presupuestos`/
   `propuestas` a mano, y no distingue origen (WhatsApp/Instagram/web) porque
   no se pidió ese desglose acá. Reusa el MISMO selector de fechas de arriba
   (embudoRange/embudoFrom/embudoTo), acotando por step1At (el momento en que
   arrancó la sesión). Sin datos históricos: empieza a acumular desde que se
   subió esta mejora (31-jul-2026) — antes solo existían los hitos "calculó
   precio" y "confirmó boceto", visibles en las pestañas Presupuestos/Bocetos. */
function embudoDateBounds(preset, fromId, toId) {
    const from = document.getElementById(fromId)?.value || "";
    const to   = document.getElementById(toId)?.value || "";
    let since = 0, until = 0;
    if (from || to) {
        if (from) since = new Date(from + "T00:00:00").getTime();
        if (to)   until = new Date(to + "T23:59:59").getTime();
    } else {
        const days = { today: 1, "7d": 7, "30d": 30, all: 0 }[preset] ?? 7;
        if (days) {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            since = startOfToday.getTime() - (days - 1) * 86400000;
        }
    }
    return { since, until };
}

function renderEmbudoPresupuesto() {
    const cont = document.getElementById("embudoPresupuestoContent");
    if (!cont) return;

    const { since, until } = embudoDateBounds(embudoRange, "embudoFrom", "embudoTo");
    const toMs = (ts) => ts?.toDate ? ts.toDate().getTime() : null;
    const inRange = (f) => {
        const t = toMs(f);
        if (t === null) return false;
        if (since && t < since) return false;
        if (until && t > until) return false;
        return true;
    };

    // Se ancla en step1At (el arranque de la sesión): una sesión "pertenece"
    // al rango elegido por cuándo entró, no por cuándo tocó cada botón después.
    const sesiones = presupuestoFunnel.filter(f => inRange(f.step1At));

    if (sesiones.length === 0) {
        cont.innerHTML = '<p class="muted" style="max-width:640px;background:#111d35;border:1px dashed #1e2c49;border-radius:10px;padding:12px 14px;font-size:.84rem">Todavía no hay datos en este rango. Este embudo se registra desde el 31/07/2026 — apenas alguien entre a gokywebs.com/presupuesto, se refleja acá.</p>';
        return;
    }

    const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);
    const entraron  = sesiones.length;
    const stages = [
        { step: 1, label: "Entraron a la calculadora",     detail: "Abrieron gokywebs.com/presupuesto.",                              icon: "👀", count: entraron },
        { step: 2, label: "Llegaron al paso 2",             detail: "Cargaron rubro y WhatsApp, y avanzaron.",                         icon: "🧭", count: sesiones.filter(s => s.step2At).length },
        { step: 3, label: "Llegaron al paso 3",             detail: "Eligieron el objetivo principal de la web.",                      icon: "🧩", count: sesiones.filter(s => s.step3At).length },
        { step: 4, label: "Vieron el precio calculado",     detail: "Tocaron \"Calcular precio\" y vieron el resultado.",              icon: "🧮", count: sesiones.filter(s => s.precioAt).length },
        { step: 5, label: "Tocaron \"Quiero mi muestra\"",  detail: "Abrieron el modal para pedir su boceto gratis.",                  icon: "🎁", count: sesiones.filter(s => s.muestraAt).length },
        { step: 6, label: "Confirmaron su boceto",          detail: "Eligieron colores, describieron la web y confirmaron.",           icon: "✅", count: sesiones.filter(s => s.confirmoAt).length },
    ];

    let html = '<div class="presupuesto-funnel" aria-label="Pasos del embudo del presupuesto">';
    stages.forEach((st, i) => {
        const width = Math.max(pct(st.count, entraron), 4);
        html += `<article class="presupuesto-funnel-step">
            <div class="presupuesto-funnel-progress" style="width:${width}%"></div>
            <div class="presupuesto-funnel-step-number">Paso ${st.step}</div>
            <div class="presupuesto-funnel-step-content">
                <span class="presupuesto-funnel-icon">${st.icon}</span>
                <div class="presupuesto-funnel-copy">
                    <div class="presupuesto-funnel-label">${st.label}</div>
                    <div class="presupuesto-funnel-detail">${st.detail}</div>
                    ${i > 0 ? `<div class="presupuesto-funnel-conversion">${pct(st.count, entraron)}% del total que entró</div>` : ""}
                </div>
                <div class="presupuesto-funnel-count">
                    <strong>${st.count}</strong>
                    <span>personas</span>
                </div>
            </div>
        </article>`;
        if (i < stages.length - 1) {
            const nextCount = stages[i + 1].count;
            const lost = Math.max(st.count - nextCount, 0);
            html += `<div class="presupuesto-funnel-drop">
                <span>↓</span>
                <span>No avanzaron: <b>${lost}</b> (${pct(lost, st.count)}%)</span>
            </div>`;
        }
    });
    html += "</div>";

    // Únicos por teléfono, quedándose con la sesión más reciente por esa fecha
    // (una misma persona puede haber entrado más de una vez en el rango).
    const dedupPorTelefono = (lista, fechaField) => {
        lista.sort((a, b) => (toMs(b[fechaField]) || 0) - (toMs(a[fechaField]) || 0));
        const vistos = new Set();
        return lista.filter(s => {
            const key = s.phone.replace(/\D/g, "");
            if (!key || vistos.has(key)) return false;
            vistos.add(key);
            return true;
        });
    };

    // ── Para llamar: vieron el precio pero nunca pidieron la muestra ──
    const vieronPrecioSinMuestra = dedupPorTelefono(
        sesiones.filter(s => s.precioAt && !s.muestraAt && s.phone),
        "precioAt"
    );

    // ── Para llamar: vieron el precio, pidieron la muestra, pero no confirmaron ──
    const faltanUnicos = dedupPorTelefono(
        sesiones.filter(s => s.precioAt && s.muestraAt && !s.confirmoAt && s.phone),
        "muestraAt"
    );

    const renderLeakList = (lista, fechaField, fechaTexto) => {
        if (lista.length === 0) return "";
        let out = '<div class="funnel-leak-list">';
        lista.forEach(s => {
            const fecha = toMs(s[fechaField])
                ? new Date(toMs(s[fechaField])).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "—";
            const tipo = TYPE_LABELS[s.siteType] || s.siteType || "";
            /* `presupuesto_funnel` no guarda el flag `sinPrecio` (su allowlist de
               firestore.rules lo rechazaría): un total en 0 con precioAt ya
               registrado solo puede ser una sesión vieja del catálogo de +100
               productos. El total es el precio que se vio en pantalla: desde el
               15-sep-2026, el pago único; si la sesión guardó además la
               mensualidad, se muestran las dos modalidades. Las sesiones del 10 al
               14-sep (primerPago, o total igual a la mensualidad) quedan con su total. */
            const precio = fmtPrecioOACotizar(s.totalPrice, Number(s.totalPrice) === 0);
            const conMensual = _num(s.mensualidad) && !_num(s.primerPago) && _num(s.totalPrice) !== _num(s.mensualidad);
            out += `<a class="funnel-leak-item" href="https://wa.me/${s.phone.replace(/\D/g, "")}" target="_blank" rel="noopener" title="Abrir WhatsApp">
                <span class="funnel-leak-phone">${escapeHtml(s.phone)}</span>
                <span class="funnel-leak-meta">${tipo ? escapeHtml(tipo) + " · " : ""}${precio}${conMensual ? ` o ${fmtMoney(s.mensualidad)}/mes` : ""} · ${fechaTexto} el ${fecha}</span>
            </a>`;
        });
        out += "</div>";
        return out;
    };

    html += '<h3 style="margin:24px 0 4px;font-size:.95rem;color:#c7d3e8">💰 Para llamar — vieron el precio pero no pidieron la muestra</h3>';
    html += '<p style="margin:0 0 10px;font-size:.76rem;color:#6e7f9e">Llegaron a calcular el precio y no volvieron a tocar nada — nunca abrieron el modal de la muestra gratis. El precio de al lado es el que vieron en pantalla.</p>';
    html += vieronPrecioSinMuestra.length
        ? renderLeakList(vieronPrecioSinMuestra, "precioAt", "vio el precio")
        : '<p class="muted" style="max-width:640px;background:#111d35;border:1px dashed #1e2c49;border-radius:10px;padding:12px 14px;font-size:.84rem">Nadie se quedó solo en "vio el precio" en este rango — o pidieron la muestra, o no llegaron a calcular.</p>';

    html += '<h3 style="margin:24px 0 4px;font-size:.95rem;color:#c7d3e8">📞 Para llamar — vieron el precio, pidieron la muestra, pero no confirmaron</h3>';
    html += '<p style="margin:0 0 10px;font-size:.76rem;color:#6e7f9e">Números que ellos mismos cargaron en el paso 1. Quedaron en el medio: les interesó lo suficiente como para pedir la muestra gratis, pero no llegaron a mandar colores y descripción.</p>';
    html += faltanUnicos.length
        ? renderLeakList(faltanUnicos, "muestraAt", "pidió la muestra")
        : '<p class="muted" style="max-width:640px;background:#111d35;border:1px dashed #1e2c49;border-radius:10px;padding:12px 14px;font-size:.84rem">Nadie quedó en el medio en este rango — o confirmaron, o no llegaron a pedir la muestra.</p>';

    cont.innerHTML = html;
}

// --- Visitas por demo (datos desde /demo/track.php) ---
let demosRange = "7d";
let demosData  = null;   // último payload del server (para filtrar la búsqueda sin re-pedir)
// Estado del desplegable "Horarios de entrada" (persiste al re-renderizar/recargar).
let hourChartOpen = (() => {
    try { return localStorage.getItem("gky_hourchart_open") !== "0"; } catch (_) { return true; }
})();

document.querySelectorAll("#demosRanges button").forEach(b => {
    b.addEventListener("click", () => {
        const f = document.getElementById("demosFrom"), t = document.getElementById("demosTo");
        if (f) f.value = ""; if (t) t.value = "";
        document.getElementById("demosDatesClear").hidden = true;
        document.querySelectorAll("#demosRanges button").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        demosRange = b.dataset.range;
        renderDemos();
    });
});

wireDateRange({
    fromId: "demosFrom", toId: "demosTo", clearId: "demosDatesClear",
    rangesSel: "#demosRanges", getPreset: () => demosRange, onChange: renderDemos,
});

document.getElementById("demosSearch")?.addEventListener("input", () => {
    if (demosData) paintDemos(demosData);
});

function fmtDemoLast(iso) {
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

async function renderDemos() {
    const cont = document.getElementById("demosContent");
    cont.innerHTML = '<p class="muted">Cargando…</p>';
    try {
        const token = currentUser ? await currentUser.getIdToken() : "";
        const res = await fetch(`/demo/track.php?${rangeQuery(demosRange, "demosFrom", "demosTo")}`, {
            cache: "no-store",
            headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        demosData = await res.json();
        paintDemos(demosData);
    } catch (e) {
        cont.innerHTML = '<p class="muted">No se pudieron cargar las visitas (' + escapeHtml(e.message || String(e)) + ').</p>';
    }
}

/* Límites de las franjas horarias [desde, hasta): 2 h en general, pero de 14 a 22
   va hora por hora (pedido de Pablo 24-jul — es la franja de más tráfico). */
const HOUR_BUCKET_BOUNDS = [
    [0, 2], [2, 4], [4, 6], [6, 8], [8, 10], [10, 12], [12, 14],
    [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22],
    [22, 24],
];

/* Franjas horarias de entrada a las demos: total de TODAS las demos sumadas.
   byHour = /demo/track.php: 24 enteros (una por hora, 0-23) en la versión nueva,
   o 12 (franjas de 2 h) en la vieja — soportamos ambas por si el deploy va parcial.
   No lo afecta el buscador (es el total global). Se renderiza como <details>
   plegable; el estado vive en hourChartOpen (persistido en localStorage). */
function hourChartHTML(byHour) {
    if (!Array.isArray(byHour)) return "";

    let buckets;   // [{ label, count }]
    if (byHour.length === 24) {
        const h = byHour.map(v => Number(v) || 0);
        buckets = HOUR_BUCKET_BOUNDS.map(([a, b]) => ({
            label: `${String(a).padStart(2, "0")} a ${String(b).padStart(2, "0")} h`,
            count: h.slice(a, b).reduce((s, x) => s + x, 0),
        }));
    } else if (byHour.length === 12) {   // backend viejo: franjas de 2 h
        buckets = byHour.map((v, i) => ({
            label: `${String(i * 2).padStart(2, "0")} a ${String(i * 2 + 2).padStart(2, "0")} h`,
            count: Number(v) || 0,
        }));
    } else {
        return "";
    }

    const total = buckets.reduce((s, b) => s + b.count, 0);
    if (total === 0) return "";
    const max = Math.max(1, ...buckets.map(b => b.count));
    const rows = buckets.map(b => {
        const width = b.count > 0 ? Math.max(Math.round((b.count / max) * 100), 3) : 0;
        return `<div class="sketch-stats-row">
            <span class="sketch-stats-label">${b.label}</span>
            <div class="sketch-stats-track"><div class="sketch-stats-fill" style="width:${width}%"></div></div>
            <span class="sketch-stats-count">${b.count}</span>
        </div>`;
    }).join("");

    const totalTxt = `${total.toLocaleString("es-AR")} ${total === 1 ? "visita" : "visitas"}`;
    return `<details class="hour-chart"${hourChartOpen ? " open" : ""} style="background:#111d35;border:1px solid #1e2c49;border-radius:12px;padding:14px 18px;margin-bottom:16px">
        <summary>
            <span style="font-size:.95rem;color:#c7d3e8;font-weight:600">🕐 Horarios de entrada a las demos</span>
            <span style="display:flex;align-items:center;gap:10px">
                <span style="font-size:.78rem;color:#8a9bb8;white-space:nowrap">${totalTxt}</span>
                <span class="hc-chevron" aria-hidden="true">▾</span>
            </span>
        </summary>
        <div class="hc-bars">
            <div style="font-size:.76rem;color:#6e7f9e;margin:2px 0 12px">Suma de todas las demos · franjas de 2 h (1 h entre las 14 y las 22)</div>
            ${rows}
        </div>
    </details>`;
}

/* Reengancha el toggle del desplegable tras cada render (innerHTML pisa listeners). */
function wireHourChartToggle() {
    const d = document.querySelector("#demosContent .hour-chart");
    if (!d) return;
    d.addEventListener("toggle", () => {
        hourChartOpen = d.open;
        try { localStorage.setItem("gky_hourchart_open", d.open ? "1" : "0"); } catch (_) {}
    });
}

function paintDemos(data) {
    const cont   = document.getElementById("demosContent");
    const totals = data.totals || {};
    let demos    = Array.isArray(data.demos) ? data.demos : [];
    const q      = (document.getElementById("demosSearch")?.value || "").trim().toLowerCase();
    if (q) demos = demos.filter(d => (d.demo || "").toLowerCase().includes(q));

    const card = (n, l) => `<div style="flex:1 1 140px;background:#111d35;border:1px solid #1e2c49;border-radius:12px;padding:14px 16px">
            <div style="font-size:1.7rem;font-weight:800;color:#fff">${Number(n || 0).toLocaleString("es-AR")}</div>
            <div style="font-size:.78rem;color:#8a9bb8">${l}</div>
        </div>`;
    const cards = `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px">
            ${card(totals.visits, "Visitas totales")}
            ${card(totals.uniques, "Personas distintas")}
            ${card(totals.demos, "Demos con visitas")}
        </div>`;
    const hourChart = hourChartHTML(data.byHour);

    if (!demos.length) {
        cont.innerHTML = cards + hourChart + `<p class="muted">${q ? "Ningún demo coincide con la búsqueda." : "Todavía no hay visitas registradas en este período."}</p>`;
        wireHourChartToggle();
        return;
    }

    const maxVisits = demos.reduce((m, d) => Math.max(m, d.visits || 0), 0) || 1;
    const rows = demos.map(d => {
        const url = "https://gokywebs.com/demo/" + encodeURIComponent(d.demo) + "/";
        const pct = Math.round(((d.visits || 0) / maxVisits) * 100);
        return `<tr>
            <td>
                <a href="${escapeHtml(url)}" target="_blank" rel="noopener" style="color:#e6ecf7;text-decoration:none;font-weight:600">${escapeHtml(d.demo)}</a>
                <a href="${escapeHtml(url)}" target="_blank" rel="noopener" title="Abrir muestra" style="color:#60A5FA;font-size:.8rem;margin-left:6px;text-decoration:none">↗</a>
            </td>
            <td class="num">${(d.visits || 0).toLocaleString("es-AR")}</td>
            <td class="num">${(d.uniques || 0).toLocaleString("es-AR")}</td>
            <td style="color:#8a9bb8;font-size:.86rem;white-space:nowrap">${escapeHtml(fmtDemoLast(d.last))}</td>
            <td style="width:90px"><div style="height:8px;background:#243149;border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#35e08b,#4a9eff);border-radius:4px"></div></div></td>
        </tr>`;
    }).join("");

    cont.innerHTML = cards + hourChart + `<div class="table-wrapper"><table class="clients-table"><thead><tr>
        <th>Demo</th><th class="num">Visitas</th><th class="num">Personas</th><th>Última</th><th>Relativo</th>
        </tr></thead><tbody>${rows}</tbody></table></div>`;
    wireHourChartToggle();
}

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
dayModal.addEventListener("click", (e) => { if (e.target === dayModal && !window.getSelection().toString().length) dayModal.hidden = true; });

// --- Estado ---
let clients = [];
let clientesCargados = false;   // hasta el primer snapshot, Clientes muestra "Cargando..."
let propuestas = [];
let propuestasCargadas = false;   // hasta el primer snapshot, Clientes muestra "Cargando..."
let propuestasListaVisible = [];  // lo que renderPropuestas() dejó filtrado; lo usa "Copiar carpetas"
let presupuestos = [];
let leads = [];
let completados = [];
let tareas = [];
let mantenimiento = [];          // suscriptores (sin los avisos de baja / pausa)
let mantenimientoAvisos = [];    // avisos de baja / pausa que deja el webhook de MP en la misma colección
let presupuestoFunnel = [];
let resenas = [];

// --- Botón nuevo cliente desde seguimientos ---
document.getElementById("openModalBtnSeg")?.addEventListener("click", () => openModal());

// --- Search seguimientos ---
document.getElementById("searchSegInput")?.addEventListener("input", renderSeg);

function getEstado(c) {
    const e = c.estadoCliente || "seguimiento1";
    if (e === "seguimiento" || e === "demo-presentada" || e === "quiere-demo") return "seguimiento2";
    if (e === "interesado") return "seguimiento1";
    return e;
}

/* ¿La web ya se entregó? (Pablo, 19-sep-2026) Clientes son las webs que se
   están armando; al entregarla (completarCliente) pasa a Mantenimiento, al plan
   mensual o al anual. completadoId cubre el momento en que entregadoAt todavía
   es un serverTimestamp sin resolver. */
function webEntregada(c) {
    return !!(c?.entregadoAt || c?.completadoId);
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

/* Catálogo de más de 100 productos en /presupuesto/ (ago-2026): el precio queda
   en 0 A PROPÓSITO — no es un dato faltante, es "a cotizar". `sinPrecio` es la
   fuente de verdad que manda /presupuesto/script.js; sin este chequeo, fmtMoney
   mostraría "$0" como si fuera un presupuesto real de precio cero. */
function fmtPrecioOACotizar(monto, sinPrecio) {
    return sinPrecio ? `<span style="color:#FCD34D">A cotizar</span>` : fmtMoney(monto);
}

/* ═══════════════════════════════════════════════════════════
   PLANES — plan anual o plan mensual desde el 19-sep-2026
   La misma web se contrata con uno de dos planes (Pablo, 19-sep-2026):
   - PLAN ANUAL, sin suscripción: seña para arrancar ($40.000 el sitio
     profesional, $60.000 el resto), el resto al entregar (saldo = unico − sena)
     y después se cobra de nuevo cada año, a mano.
   - PLAN MENSUAL por suscripción de Mercado Pago, sin pago inicial y sin
     permanencia.
   El pago único queda solo para el que pide la web propia, en su hosting: seña
   y saldo como el anual, pero sin renovación (no incluye hosting, dominio ni
   mantenimiento). Mismos montos que el bot (wabot/textos.php).
   En `clientes`, `modalidad` dice cuál eligió. El valor interno del plan anual
   sigue siendo 'unico' (el mismo que el formulario y el bot):
   - 'unico' (plan anual): valorTotal (precio por año), abono (lo cobrado),
     senaAt (la seña), renovacionAt (el próximo cobro anual; si no está, un año
     después de la seña) y renovaciones (los cobros anuales hechos).
   - 'propia' (pago único, web propia): valorTotal, abono y senaAt.
   - 'mensual': montoMensual, estadoSuscripcion, suscripcionDesde, preapprovalId.
   Los docs guardados antes no tienen el campo y se deducen (modalidadDe). Del
   modelo del 10 al 14-sep-2026 (primer pago + plan mensual) quedan primerPago /
   primerPagoAt: el panel los muestra, como "modelo anterior", solo en los docs
   que los traen cargados.
   ═══════════════════════════════════════════════════════════ */
// 19-sep-2026: el plan mensual vuelve a $20.000 / $30.000 (del 16 al 19-sep fue
// $15.000 / $25.000). Los dos planes incluyen un cambio por mes (Pablo,
// 20-sep); el plan con cambios, $25.000 / $35.000, es para varios al mes y se
// carga a mano.
// `unico` es el precio del plan anual; `propia`, el pago único de la web propia.
const PLANES = {
    profesional:  { label: "Sitio profesional",    unico: 120000, sena: 40000, mensual: 20000, propia: 180000 },
    ecommerce:    { label: "Ecommerce",            unico: 190000, sena: 60000, mensual: 30000, propia: 290000 },
    cursos:       { label: "Plataforma de cursos", unico: 190000, sena: 60000, mensual: 30000, propia: 290000 },
    inmobiliaria: { label: "Inmobiliaria",         unico: 170000, sena: 60000, mensual: 30000, propia: 240000 },
    // Desde el 19-sep-2026 el portal de noticias se cotiza como la tienda (Pablo): presupuestos/noticias.
    noticias:     { label: "Portal de noticias",   unico: 190000, sena: 60000, mensual: 30000, propia: 290000 },
};
// Tipo que no se reconoce: se cotiza como el resto (todo lo que no es sitio profesional).
const PLAN_RESTO = { unico: 190000, sena: 60000, mensual: 30000, propia: 290000 };
const PLAN_POR_LABEL = Object.fromEntries(Object.entries(PLANES).map(([key, p]) => [p.label, key]));
const MODALIDAD_LABELS = { unico: "Plan anual", mensual: "Plan mensual", propia: "Pago único (web propia)" };
// Modalidades que se cobran con seña y saldo al entregar: el plan anual y la web propia.
function _conSena(modalidad) {
    return modalidad === "unico" || modalidad === "propia";
}
// Días antes del cobro anual en que el panel empieza a avisar.
const DIAS_AVISO_RENOVACION = 30;
// Modelo del 10-sep-2026: el plan arrancaba a los 7 días del primer pago. Solo
// cuenta para los clientes que tienen el primer pago registrado.
const DIAS_HASTA_EL_PLAN = 7;

function _num(v) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : 0;
}

/* Tipo de web → clave de PLANES. Acepta las claves del bot (landing, turnos,
   institucional, catalogo, lms…), las de la calculadora, las del alta manual
   (landing-reservas, ecommerce-elearning…) y las etiquetas tipeadas en el
   boceto ("Landing Page", "Plataforma LMS"). null si no se reconoce. */
function planKeyDeTipo(tipo) {
    const t = String(tipo || "").toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    if (!t.trim()) return null;
    if (/noticia/.test(t)) return "noticias";
    if (/inmobil|propiedad|bienes raices/.test(t)) return "inmobiliaria";
    if (/e-?commerce|tienda|catalogo|shop|carrito/.test(t)) return "ecommerce";
    if (/e-?learning|\blms\b|curso|academia/.test(t)) return "cursos";
    if (/landing|sitio|profesional|institucional|turno|reserva|web.?completa|portfolio/.test(t)) return "profesional";
    return null;
}

/* Contrato del 15-sep-2026: la calculadora, los bocetos y los clientes nuevos
   traen `precioUnico` o `modalidad`. En esos docs `sena` es la seña del pago
   único; en los anteriores, `sena` y `primerPago` eran el primer pago del
   modelo que corría (compatibilidad). */
function _docConModalidad(d) {
    return !!d && (d.precioUnico != null || typeof d.modalidad === "string");
}

// La modalidad que el doc tiene elegida: 'unico' (plan anual), 'mensual', 'propia' o "" (sin elegir, o sin el campo).
function _modalidadElegida(d) {
    return d?.modalidad === "unico" || d?.modalidad === "mensual" || d?.modalidad === "propia" ? d.modalidad : "";
}

/* Modalidad de un doc de `clientes` o `completados` guardado antes del
   15-sep-2026, que no tiene el campo:
   - Un primer pago cobrado (primerPagoAt) es el modelo del 10 al 14-sep: mensual.
   - Un valorTotal de $100.000 o más solo lo tienen los proyectos de antes del
     10-sep (pago único): el primer pago nunca pasó de $90.000 y desde el 14-sep
     va en 0. El primerPago / montoMensual que pueda traer lo sugirió el modal
     del 10 al 14-sep al guardarlo.
   - Si no, primer pago o mensualidad → mensual; seña, senaAt o algo cobrado →
     pago único. Sin ningún dato, "". */
function _modalidadDeducida(c) {
    if (!c) return "";
    if (c.primerPagoAt) return "mensual";
    if (_num(c.valorTotal) >= 100000) return "unico";
    if (_num(c.primerPago) || _num(c.montoMensual)) return "mensual";
    if (_num(c.sena) || c.senaAt || _num(c.abono)) return "unico";
    return "";
}

// La modalidad elegida o, en los docs sin el campo, la deducida. "" = sin definir.
function modalidadDe(c) {
    return _modalidadElegida(c) || (typeof c?.modalidad === "string" ? "" : _modalidadDeducida(c));
}

// Precio acordado (valorTotal) si el doc se cobra con seña (plan anual o web propia); 0 en los demás.
function _precioUnicoGuardado(c) {
    return _conSena(modalidadDe(c)) ? _num(c.valorTotal) : 0;
}

/* Plan anual o web propia de un cliente: el precio acordado (valorTotal), lo
   cobrado (abono), la fecha de la seña (senaAt) y el saldo pendiente, que se
   cobra al entregar. */
function pagoUnicoDe(c) {
    const precio = _num(c.valorTotal);
    const cobrado = _num(c.abono);
    return { precio, cobrado, saldo: Math.max(0, precio - cobrado), senaAt: mantToDate(c.senaAt) };
}

function _sumarAnios(fecha, anios) {
    return new Date(fecha.getFullYear() + anios, fecha.getMonth(), fecha.getDate(), 12);
}

/* El plan anual arrancó el 19-sep-2026. Un cliente con el valor 'unico' de
   antes (la seña o la entrega son anteriores, o el doc ni siquiera tiene
   `modalidad`) contrató el pago único de entonces: incluía el primer año de
   mantenimiento y no se renueva como el plan anual. */
const INICIO_PLAN_ANUAL = new Date(2026, 8, 19);
function _pagoUnicoAnterior(c) {
    if (modalidadDe(c) !== "unico") return false;
    if (typeof c?.modalidad !== "string") return true;
    const inicio = mantToDate(c.senaAt) || mantToDate(c.entregadoAt);
    return !!inicio && inicio < INICIO_PLAN_ANUAL;
}

/* El cobro anual de un cliente del plan anual (19-sep-2026): se cobra de nuevo
   cada año, sin suscripción. La fecha es la guardada (renovacionAt) o, si no
   está, un año después de la seña (Pablo, 19-sep); sin seña registrada no corre.
   El monto es el precio del plan (valorTotal). estado: 'sin_fecha',
   'al_dia', 'por_vencer' (faltan DIAS_AVISO_RENOVACION días o menos) o
   'vencido'. En el pago único anterior (`legado`), la fecha es el fin del año
   de mantenimiento incluido (un año después de la entrega) y no hay cobro anual. null si el cliente no es
   del plan anual. */
function renovacionAnualDe(c) {
    if (modalidadDe(c) !== "unico") return null;
    const legado = _pagoUnicoAnterior(c);
    const guardada = mantToDate(c.renovacionAt);
    // El plan anual se cuenta desde la seña; el mantenimiento del pago único anterior, desde la entrega.
    const desde = legado ? mantToDate(c.entregadoAt) : mantToDate(c.senaAt);
    const proximo = guardada
        ? new Date(guardada.getFullYear(), guardada.getMonth(), guardada.getDate(), 12)
        : (desde ? _sumarAnios(desde, 1) : null);
    const cobros = Array.isArray(c.renovaciones) ? c.renovaciones : [];
    const ultimo = cobros.length ? cobros[cobros.length - 1] : null;
    const monto = legado ? 0 : _num(c.valorTotal);
    if (!proximo) return { proximo: null, monto, estado: "sin_fecha", dias: null, ultimo, legado };
    const hoy = new Date();
    const dias = Math.ceil((new Date(proximo.getFullYear(), proximo.getMonth(), proximo.getDate()) - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / 86400000);
    const estado = dias < 0 ? "vencido" : dias <= DIAS_AVISO_RENOVACION ? "por_vencer" : "al_dia";
    return { proximo, monto, estado, dias, ultimo, legado };
}

// Precio único que solo estaba cotizado: no se cobró nada y no quedó en un cliente mensual.
function _cotizacionSinCobro(c) {
    return _precioUnicoGuardado(c) > 0 && !_num(c.abono) && !c.senaAt;
}

/* Plan y montos de un doc: cliente (planLabel, valorTotal si es de pago único,
   montoMensual), boceto o presupuesto de la calculadora (precioUnico, sena,
   mensualidad, modalidad) o snapshot de un boceto. `extra` es el boceto o el
   lead del que salió, por si el doc no trae los montos; lo que falte sale del
   tipo de web. Trae las dos modalidades (unico, sena, saldo, mensual) y
   `modalidad`, la elegida en el doc o en `extra` ("" si ninguno eligió).
   `primerPago` es solo del modelo del 10 al 14-sep-2026: el campo o, en los
   docs sin el contrato del 15-sep, `sena`. planLabel "" = plan sin definir, a
   propósito. */
function planDe(src, extra = null) {
    const s = src || {};
    const x = extra || {};
    const guardado = typeof s.planLabel === "string" ? s.planLabel.trim() : null;
    let key = guardado !== null ? (PLAN_POR_LABEL[guardado] || null) : null;
    if (guardado === null) {
        for (const f of [s, s.propuestaSnapshot, extra]) {
            if (!f) continue;
            key = [f.tipoDetectado, f.tipoDetectadoLabel, f.tipo_web, f.siteType].map(planKeyDeTipo).find(Boolean) || null;
            if (key) break;
        }
    }
    const base = key ? PLANES[key] : PLAN_RESTO;
    // Montos que cotizó la calculadora o el boceto con las dos modalidades.
    const cotizado = [s, x].find(f => _num(f.precioUnico)) || {};
    const guardadoEnDoc = _precioUnicoGuardado(s);
    // El precio guardado vale para su modalidad: el de una web propia no es el del plan anual.
    const unico = (modalidadDe(s) === "unico" && guardadoEnDoc) || _num(cotizado.precioUnico) || base.unico;
    const propia = (modalidadDe(s) === "propia" && guardadoEnDoc) || base.propia;
    const sena = _num(cotizado.sena) || base.sena;
    const senaAnterior = f => _docConModalidad(f) ? 0 : _num(f.sena);
    return {
        key,
        label: guardado !== null ? guardado : (key ? PLANES[key].label : ""),
        modalidad:  _modalidadElegida(s) || _modalidadElegida(x),
        unico,
        propia,
        sena,
        saldo:      Math.max(0, unico - sena),
        mensual:    _num(s.montoMensual) || _num(s.mensualidad) || _num(x.montoMensual) || _num(x.mensualidad) || base.mensual,
        primerPago: _num(s.primerPago) || _num(x.primerPago) || senaAnterior(s) || senaAnterior(x),
    };
}

/* Boceto del que salió un cliente: el vivo si todavía existe o la copia que
   se guardó al pasarlo a Seguimiento; si vino de la calculadora sin boceto, su
   presupuesto (trae los montos y la modalidad que eligió). */
function propuestaDeCliente(c) {
    return (c.propuestaId && propuestas.find(p => p.id === c.propuestaId)) || c.propuestaSnapshot
        || (c.presupuestoId && presupuestos.find(p => p.id === c.presupuestoId)) || null;
}

/* Suscriptor de Mantenimiento (lo escribe el webhook de Mercado Pago) que
   corresponde a un cliente: por ID de la suscripción, email o WhatsApp. Las
   colecciones no se fusionan; solo se cruzan al pintar. Por email o WhatsApp
   puede haber más de una suscripción (se dio de baja y se volvió a suscribir):
   manda la que no tiene baja. */
function mantenimientoDeCliente(c) {
    const pre = String(c.preapprovalId || "").trim();
    const email = String(c.email || "").trim().toLowerCase();
    const tel = cleanArgPhone(c.telefono);
    const vigente = lista => lista.find(m => avisoMantDe(m)?.tipoEvento !== "baja") || lista[0] || null;
    return (pre && mantenimiento.find(m => m.id === pre || String(m.preapprovalId || "").trim() === pre))
        || (email && vigente(mantenimiento.filter(m => String(m.email || "").trim().toLowerCase() === email)))
        || (tel.length >= 8 && vigente(mantenimiento.filter(m => cleanArgPhone(m.whatsapp) === tel)))
        || null;
}

function _fechaDeInput(valor) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor || ""));
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12) : null;
}

function _sumarDias(fecha, dias) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias, 12);
}

/* Cómo se ve la suscripción de un cliente en el tab Clientes. Una baja manda:
   la cargada a mano o el aviso de baja que deja el webhook cuando la suscripción
   se cancela en Mercado Pago. Si no, un suscriptor activo en Mantenimiento (sin
   aviso de pausa) la vuelve 'activa'; si no, vale lo guardado ('pendiente' por
   defecto). El inicio es el guardado, o el primer pago + 7 días (modelo
   anterior), o el alta en Mercado Pago. */
function suscripcionDe(c) {
    const plan = planDe(c, propuestaDeCliente(c));
    const mant = mantenimientoDeCliente(c);
    const aviso = avisoMantDe(mant || c);
    const primerPagoAt = mantToDate(c.primerPagoAt);
    const inicio = mantToDate(c.suscripcionDesde)
        || (primerPagoAt ? _sumarDias(primerPagoAt, DIAS_HASTA_EL_PLAN) : null)
        || mantToDate(mant?.createdAt);
    const desde = inicio ? new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate()) : null;
    const mantActivo = !!mant && !aviso && (mant.estado || "activo") === "activo";
    const estado = (c.estadoSuscripcion === "baja" || aviso?.tipoEvento === "baja") ? "baja"
        : (mantActivo || c.estadoSuscripcion === "activa") ? "activa"
        : "pendiente";
    return {
        plan,
        mensual: _num(c.montoMensual) || _num(mant?.monto) || plan.mensual,
        // Sin pago inicial desde el 14-sep-2026: solo el que el doc tiene cargado
        // (modelo anterior), nunca uno sugerido por el boceto.
        primerPago: _num(c.primerPago) || (primerPagoAt ? plan.primerPago : 0),
        primerPagoAt,
        desde,
        estado,
        mant,
        // Aviso de baja / pausa de Mercado Pago que dejó el webhook, o null.
        aviso,
        porActivar: estado === "pendiente" && !!desde && desde <= new Date(),
        preapprovalId: String(c.preapprovalId || mant?.preapprovalId || "").trim(),
        // Lo abonado con el modelo anterior, para no perderlo de vista.
        abonoAnterior: !_num(c.primerPago) && !primerPagoAt ? _num(c.abono) : 0,
    };
}

/* Filas del plan para los detalles (brief, boceto, presupuesto): la modalidad
   elegida o, si el doc todavía no eligió, las dos (15-sep-2026). El primer pago
   solo aparece, como modelo anterior, en los docs que lo traen; nunca se suma a
   la mensualidad. */
function _planRowsHTML(plan) {
    const fila = (label, valor) => `<div class="prop-row"><span class="prop-label">${label}</span><span>${valor}</span></div>`;
    return `<div class="prop-row"><span class="prop-label">Plan</span><span style="font-weight:700;color:#4ade80">${escapeHtml(plan.label || "Sin definir")}</span></div>
        ${plan.modalidad ? fila("Modalidad", MODALIDAD_LABELS[plan.modalidad]) : ""}
        ${!plan.modalidad || plan.modalidad === "unico" ? fila("Plan anual", `${fmtMoney(plan.unico)} por año: seña de ${fmtMoney(plan.sena)} para arrancar, el resto (${fmtMoney(plan.saldo)}) al entregar y después se cobra cada año, sin suscripción`) : ""}
        ${plan.primerPago ? fila("Primer pago (modelo anterior)", fmtMoney(plan.primerPago)) : ""}
        ${!plan.modalidad || plan.modalidad === "mensual" ? fila("Plan mensual", `${fmtMoney(plan.mensual)}/mes${plan.primerPago ? `, arrancaba a los ${DIAS_HASTA_EL_PLAN} días del primer pago` : ", sin pago inicial"}`) : ""}
        ${plan.modalidad === "propia" ? fila("Pago único (web propia)", `${fmtMoney(plan.propia)}: seña de ${fmtMoney(plan.sena)} para arrancar y el resto al entregar, sin hosting, dominio ni mantenimiento`) : ""}`;
}

// Montos del plan en una línea, para las tablas: los de la modalidad elegida o los de los dos planes.
function _planMontosTexto(plan, modalidad = plan.modalidad) {
    if (modalidad === "unico") return `plan anual ${fmtMoney(plan.unico)}`;
    if (modalidad === "mensual") return `${fmtMoney(plan.mensual)}/mes`;
    if (modalidad === "propia") return `pago único ${fmtMoney(plan.propia)} (web propia)`;
    return `plan anual ${fmtMoney(plan.unico)} o ${fmtMoney(plan.mensual)}/mes`;
}

// Los adicionales de /presupuesto/ se guardan como slug (`calendario`, `login`…).
// Sin esto, el modal de un lead mostraba "calendario, login, dominio-com" crudo.
const FUNCIONALIDAD_LABELS = {
    "calendario":  "Agenda de turnos",
    "login":       "Login de usuarios",
    "dominio-com": "Dominio .com",
};

const PRESUPUESTO_CATALOGO_QTY_LABELS = {
    "q0-20":   "hasta 20 productos",
    "q20-50":  "entre 20 y 50 productos",
    "q50-100": "entre 50 y 100 productos",
    "q100+":   "más de 100 productos",
};

function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

const OBJETIVO_LABELS = {
    "vender-online": "Productos y venta online",
    "catalogo-whatsapp": "Productos y venta por WhatsApp",
    "mostrar-servicios": "Mostrar servicios",
    "mostrar-productos-wp": "Mostrar productos (WhatsApp)",
    "cursos-digitales": "Vender cursos / productos digitales",
    "mostrar-negocio": "Mostrar servicios o prestaciones",
    "portfolio": "Mostrar portafolio",
    "inmobiliaria": "Bienes raíces / Inmobiliaria",
    "reservas-turnos": "Sistema de reserva de turnos, citas o alojamientos",
};

const EMPTY_COPY_VALUES = new Set(["", "(no completó)", "(no seleccionó)", "No aplica", "—"]);

function cleanFieldValue(value) {
    const text = Array.isArray(value) ? value.filter(Boolean).join(", ") : String(value ?? "");
    const trimmed = text.trim();
    return EMPTY_COPY_VALUES.has(trimmed) ? "" : trimmed;
}

function formatObjetivosValue(value) {
    if (Array.isArray(value)) {
        return value.map(v => OBJETIVO_LABELS[v] || v).filter(Boolean).join(", ");
    }
    return cleanFieldValue(value);
}

function formatFuncionalidadesValue(value) {
    if (Array.isArray(value)) {
        return value.map(v => FUNCIONALIDAD_LABELS[v] || v).filter(Boolean).join(", ");
    }
    return cleanFieldValue(value);
}

function formatCopyRows(rows) {
    return rows
        .map(({ title, value, optional = true }) => ({ title, value: cleanFieldValue(value), optional }))
        .filter(row => row.value || !row.optional)
        .map(row => `${row.title}\n${row.value}`)
        .join("\n\n");
}

function formatAMPM(hora24) {
    const [hStr, mStr] = (hora24 || "").split(":");
    const h = parseInt(hStr, 10);
    if (isNaN(h)) return hora24;
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${mStr || "00"} ${suffix}`;
}

function cleanArgPhone(raw) {
    let digits = String(raw ?? "").replace(/\D/g, "");
    if (digits.length > 10 && digits.startsWith("54")) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("9")) digits = digits.slice(1);
    return digits;
}

async function fetchProtectedFile(filePath, nombre) {
    const idToken = await currentUser.getIdToken();
    const params = new URLSearchParams({ file: filePath, nombre: nombre || 'logo' });
    const res = await fetch('/admin/download-logo.php?' + params.toString(), {
        headers: { 'Authorization': 'Bearer ' + idToken }
    });
    if (!res.ok) throw new Error('No se pudo descargar el archivo');
    guardarBlobComoArchivo(await res.blob(), nombre);
}

function guardarBlobComoArchivo(blob, nombre) {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = nombre || 'logo';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
}

/* El nombre del archivo lo decide el servidor (lleva el nombre del negocio y
   dice si es un zip o una imagen suelta): sale del Content-Disposition. */
function nombreDeLaRespuesta(res, fallback) {
    const cd = res.headers.get('Content-Disposition') || '';
    const m = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
    return m ? m[1].trim() : fallback;
}

/* Baja TODAS las imágenes que mandó el cliente, juntas. Antes bajaba una sola
   —la que el bot eligió como logo— y el resto había que ir a buscarlas de a una
   al chat. La URL sale de logoUrl, que ya trae la conversación en el query
   string, así que funciona igual con los bocetos viejos. */
async function downloadImagenesCliente(logoUrl, negocio) {
    try {
        const tel = new URL(logoUrl).searchParams.get('tel');
        if (!tel) throw new Error('El boceto no tiene la conversación del cliente');
        await wabotAuthHandshake();
        const res = await fetch('../wabot/admin.php?accion=imagenes&tel=' + encodeURIComponent(tel),
                                { credentials: 'same-origin' });
        if (!res.ok) throw new Error('El panel del bot no devolvió las imágenes');
        const fallback = 'imagenes-' + (negocio || tel).replace(/[^\w.-]+/g, '-').toLowerCase() + '.zip';
        guardarBlobComoArchivo(await res.blob(), nombreDeLaRespuesta(res, fallback));
    } catch (err) {
        console.error(err);
        alert('No se pudieron descargar las imágenes del cliente.');
    }
}
window.downloadImagenesCliente = downloadImagenesCliente;

function initRealtime() {
    const q = query(collection(db, "clientes"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
        clients = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        clientesCargados = true;
        render();
        // Mantenimiento lista las webs entregadas y cruza las suscripciones con los clientes.
        renderMantenimiento();
        if (activeTab === "seguimientos") renderSeg();
        if (activeTab === "calendario") renderCal();
        if (enMetrica("stats")) renderStats();
    }, (err) => {
        console.error(err);
        tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Error cargando clientes: ${escapeHtml(err.message)}</td></tr>`;
    });

    // ── Propuestas realtime (Bocetos) ──
    const qProp = query(collection(db, "propuestas"), orderBy("createdAt", "desc"));
    onSnapshot(qProp, (snap) => {
        propuestas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        propuestasCargadas = true;
        renderFechaChips();
        renderPropuestas();
        renderLeads(); // actualizar badges de bocetos en la tabla de presupuestos
        if (activeTab === "clientes") render();
        if (activeTab === "completados") renderCompletados();
        if (enMetrica("stats")) renderStats();
        if (enMetrica("embudo")) renderEmbudoPresupuesto();
        const el = document.getElementById("countPropuestas");
        if (el) el.textContent = propuestas.length;
    }, (err) => {
        console.error("Propuestas error:", err);
    });

    // ── Completados ──
    const qComp = query(collection(db, "completados"), orderBy("completadoAt", "desc"));
    onSnapshot(qComp, (snap) => {
        completados = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderCompletados();
        if (enMetrica("stats")) renderStats();
        const el = document.getElementById("countCompletados");
        if (el) el.textContent = completados.length;
    }, (err) => {
        console.error("Completados error:", err);
    });

    // ── Presupuestos + Leads en una sola colección ──
    // Los que pagaron desde /presupuesto/ (tab "Pagaron": la seña o la suscripción) no tienen estado:'lead'
    // Los leads (calcularon precio sin pagar) tienen estado:'lead'
    const qPres = query(collection(db, "presupuestos"), orderBy("createdAt", "desc"));
    onSnapshot(qPres, (snap) => {
        presupuestos = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Separar los que pagaron y los leads del mismo array
        // Pagaron: clientes reales que pagaron via Mercado Pago → SIEMPRE tienen paymentStatus
        // Leads: calcularon precio sin pagar → tienen estado:'lead', NUNCA tienen paymentStatus
        leads = presupuestos.filter(p => p.estado === 'lead');
        const senados = presupuestos.filter(p => p.paymentStatus);

        renderPresupuestos();
        renderLeads();
        if (enMetrica("embudo")) renderEmbudoPresupuesto();

        const elSenados = document.getElementById("countPresupuestos");
        if (elSenados) elSenados.textContent = senados.length;
        const elLeads = document.getElementById("countLeads");
        if (elLeads) elLeads.textContent = leads.length;
    }, (err) => {
        console.error("Presupuestos error:", err);
    });

    // ── Tareas personales del calendario ──
    const qTareas = query(collection(db, "tareas"), orderBy("createdAt", "desc"));
    onSnapshot(qTareas, (snap) => {
        tareas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (activeTab === "calendario") renderCal();
    }, (err) => {
        console.error("Tareas error:", err);
    });

    // ── Embudo exhaustivo del presupuesto (un doc por sesión, ver script.js
    //    de /presupuesto/: step1At/step2At/step3At/precioAt/muestraAt/confirmoAt) ──
    const qFunnel = query(collection(db, "presupuesto_funnel"), orderBy("updatedAt", "desc"));
    onSnapshot(qFunnel, (snap) => {
        presupuestoFunnel = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (enMetrica("embudo")) renderEmbudoPresupuesto();
    }, (err) => {
        console.error("Embudo presupuesto error:", err);
    });

    // ── Mantenimiento (suscriptores + avisos de baja / pausa) ──
    const qMant = query(collection(db, "mantenimiento"), orderBy("createdAt", "desc"));
    onSnapshot(qMant, (snap) => {
        const docsMant = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // El webhook de MP deja en la misma colección los avisos de baja / pausa
        // (tipoEvento): no son suscriptores y se cruzan con ellos al pintar. Un
        // tipoEvento desconocido no se muestra ni como suscriptor ni como aviso.
        mantenimientoAvisos = docsMant.filter(d => d.tipoEvento === "baja" || d.tipoEvento === "pausa");
        mantenimiento = docsMant.filter(d => !d.tipoEvento);
        // Pinta la tabla y el contador del tab (suscriptores activos, sin las bajas).
        renderMantenimiento();
        // Clientes cruza la suscripción con Mantenimiento (estado, ID de Mercado Pago, bajas).
        if (clientesCargados) render();
    }, (err) => {
        console.error("Mantenimiento error:", err);
    });

    // ── Reseñas de demos (botón flotante de snippets_canonicos_demos §9) ──
    const qResenas = query(collection(db, "resenas"), orderBy("createdAt", "desc"));
    onSnapshot(qResenas, (snap) => {
        resenas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Si el modal de un cliente está abierto, refrescarle la sección de
        // reseñas por si llegó una nueva mientras Pablo lo tenía a la vista.
        const openId = document.getElementById("clientId")?.value;
        if (openId && modal && !modal.hidden) renderResenasEnModal(openId);
    }, (err) => {
        console.error("Reseñas error:", err);
    });
}

/* El botón de la demo (snippets_canonicos_demos §9) guarda `slug` ya pasado
   por la MISMA slugify que slugNegocio() de acá abajo, calculado desde la
   URL /demo/<slug>/ — así no hace falta configurar nada por proyecto: alcanza
   con recalcular el slug del nombre del negocio del cliente y comparar. */
function resenasParaCliente(c) {
    const slugCliente = slugNegocio(c.proyecto || c.nombre || "");
    if (!slugCliente) return [];
    return resenas.filter(r => slugNegocio(r.slug || "") === slugCliente);
}

/* Pinta la sección "Reseñas de esta demo" dentro del modal de cliente/seguimiento
   y marca como vistas las que todavía no lo estaban — Pablo ya las tiene
   delante, no hace falta un botón "marcar como leído" aparte. */
async function renderResenasEnModal(clientId) {
    const section = document.getElementById("resenasInfoSection");
    const body    = document.getElementById("resenasInfoBody");
    const summary = document.getElementById("resenasInfoSummary");
    const c = clients.find(x => x.id === clientId);
    if (!section || !body || !c) return;

    const lista = resenasParaCliente(c);
    if (!lista.length) {
        section.style.display = "none";
        body.innerHTML = "";
        return;
    }

    const sinVer = lista.filter(r => !r.visto).length;
    section.style.display = "";
    if (summary) summary.textContent = `⭐ Devoluciones de esta demo (${lista.length}${sinVer ? `, ${sinVer} nueva${sinVer > 1 ? "s" : ""}` : ""})`;
    section.querySelector("details")?.toggleAttribute("open", sinVer > 0);

    body.innerHTML = lista.map(r => {
        const estrellas = r.rating ? "★".repeat(r.rating) + "☆".repeat(5 - r.rating) : "";
        const fecha = r.createdAt?.toDate
            ? r.createdAt.toDate().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "";
        const campos = [
            r.colores   ? { label: "Colores",   texto: r.colores } : null,
            r.contenido ? { label: "Contenido", texto: r.contenido } : null,
            r.otros     ? { label: "Otros",     texto: r.otros } : null,
        ].filter(Boolean);
        const camposHTML = campos.length
            ? campos.map(f => `<p class="resena-mensaje"><strong>${f.label}:</strong> ${escapeHtml(f.texto)}</p>`).join("")
            : `<p class="resena-mensaje muted">Solo calificación, sin comentario.</p>`;
        return `
            <div class="resena-card${r.visto ? "" : " resena-card--nueva"}">
                ${estrellas ? `<div class="resena-stars">${estrellas}</div>` : ""}
                ${camposHTML}
                <div class="resena-meta">${escapeHtml(fecha)}${!r.visto ? ' <span class="resena-nueva-tag">Nueva</span>' : ""}</div>
            </div>`;
    }).join("");

    const sinVerIds = lista.filter(r => !r.visto).map(r => r.id);
    if (sinVerIds.length) {
        try {
            const batch = writeBatch(db);
            sinVerIds.forEach(id => batch.update(doc(db, "resenas", id), { visto: true }));
            await batch.commit();
        } catch (err) {
            console.error("No se pudo marcar la reseña como vista:", err);
        }
    }
}

function _updateClientCounters() {
    // El tab Clientes cuenta las webs en desarrollo; las entregadas, Mantenimiento.
    const nClientes = clients.filter(c => getEstado(c) === "cliente" && !webEntregada(c)).length;
    const nSeg = clients.filter(c => getEstado(c) === "seguimiento1").length;
    const nUM = clients.filter(c => getEstado(c) === "ultimo-mensaje").length;
    const nSB = clients.filter(c => getEstado(c) === "standby").length;

    document.getElementById("countClientesTab").textContent = nClientes;
    const seg1El = document.getElementById("countSeg1");
    if (seg1El) seg1El.textContent = nSeg;
    const totalSegEl = document.getElementById("totalSeguimientos");
    if (totalSegEl) totalSegEl.textContent = nSeg + nUM + nSB;
    const v1 = document.getElementById("segCountV1"); if (v1) v1.textContent = nSeg;
    const um = document.getElementById("segCountUM"); if (um) um.textContent = nUM;
    const sb = document.getElementById("segCountSB"); if (sb) sb.textContent = nSB;

    /* Plan anual y web propia: el saldo que falta cobrar de las webs en
       desarrollo (precio menos lo cobrado); los clientes "a cotizar" no suman.
       La mensualidad activa, las suscripciones por activar y los cobros anuales
       están en Mantenimiento (_updateMantCounters, 19-sep-2026). */
    const saldoPendiente = clients
        .filter(c => getEstado(c) === "cliente" && !webEntregada(c) && _conSena(modalidadDe(c)) && !c.sinPrecio)
        .reduce((sum, c) => sum + pagoUnicoDe(c).saldo, 0);
    const saldoEl = document.getElementById("saldoPendiente");
    if (saldoEl) saldoEl.textContent = fmtMoney(saldoPendiente);
}

function _bindTableListeners(tbodyEl) {
    tbodyEl.querySelectorAll(".client-row").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest("button, input, select, label, .date-cell, .actions-col, .notes-col, .phone-copy")) return;
            if (window.getSelection().toString().length > 0) return;
            openModal(row.dataset.rowId);
        });
    });
    tbodyEl.querySelectorAll("[data-agenda-nombre]").forEach(b =>
        b.addEventListener("click", () => openAddTareaModal(null, `${b.dataset.agendaNombre}${b.dataset.agendaProyecto ? ' · ' + b.dataset.agendaProyecto : ''}`)));
    tbodyEl.querySelectorAll(".icon-btn.edit").forEach(b =>
        b.addEventListener("click", () => openModal(b.dataset.id)));
    tbodyEl.querySelectorAll(".icon-btn.delete").forEach(b =>
        b.addEventListener("click", () => removeClient(b.dataset.id)));
    tbodyEl.querySelectorAll("[data-facturar-id]").forEach(b =>
        b.addEventListener("click", () => {
            const c = clients.find(x => x.id === b.dataset.facturarId);
            if (c) abrirFacturaModal(c, { adhoc: true });
        }));
    tbodyEl.querySelectorAll("[data-status-id]").forEach(sel => {
        sel.addEventListener("change", () => setStatus(sel.dataset.statusId, sel.value));
    });
    tbodyEl.querySelectorAll("[data-cli-cambio]").forEach(chk => {
        chk.addEventListener("change", () => toggleCambiosCliente(chk.dataset.cliCambio, chk.checked));
    });
    tbodyEl.querySelectorAll("[data-renovar-id]").forEach(btn => {
        btn.addEventListener("click", () => registrarCobroAnual(btn.dataset.renovarId));
    });
    tbodyEl.querySelectorAll("[data-terminada-id]").forEach(btn => {
        btn.addEventListener("click", () => marcarWebTerminada(btn.dataset.terminadaId));
    });
    tbodyEl.querySelectorAll("[data-iniciar-plan]").forEach(btn => {
        btn.addEventListener("click", () => iniciarPlanAnual(btn.dataset.iniciarPlan));
    });
    tbodyEl.querySelectorAll("[data-suscripto-id]").forEach(btn => {
        btn.addEventListener("click", () => marcarSuscripcionActiva(btn.dataset.suscriptoId));
    });
    tbodyEl.querySelectorAll(".notes-cell").forEach(cell => {
        const label = cell.querySelector(".notes-label");
        const textarea = cell.querySelector(".notes-input");
        label.addEventListener("click", () => { cell.classList.add("editing"); textarea.focus(); });
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { textarea.value = textarea.dataset.original; cell.classList.remove("editing"); }
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
    tbodyEl.querySelectorAll(".date-cell").forEach(cell => {
        const lbl = cell.querySelector(".date-label");
        const inp = cell.querySelector(".inline-date");
        lbl.addEventListener("click", () => inp.showPicker?.() || inp.click());
        inp.addEventListener("change", async () => {
            const val = inp.value;
            lbl.textContent = formatDate(val);
            lbl.className = "date-label" + (val ? " has-date" : "");
            await updateField(cell.dataset.dateId, "hablarleElDia", val);
        });
    });
    const lastPhone = localStorage.getItem("gkyLastPhone") || "";
    tbodyEl.querySelectorAll("[data-phone-copy]").forEach(el => {
        if (lastPhone && cleanArgPhone(el.dataset.phoneCopy) === lastPhone) el.classList.add("last-copied");
        el.addEventListener("click", async () => {
            const phone = cleanArgPhone(el.dataset.phoneCopy);
            try {
                await navigator.clipboard.writeText(phone);
            } catch {
                const tmp = document.createElement("textarea");
                tmp.value = phone;
                document.body.appendChild(tmp);
                tmp.select();
                document.execCommand("copy");
                document.body.removeChild(tmp);
            }
            localStorage.setItem("gkyLastPhone", phone);
            document.querySelectorAll(".phone-copy.last-copied").forEach(x => x.classList.remove("last-copied"));
            el.classList.add("last-copied");
            const original = el.textContent;
            el.textContent = "Copiado ✓";
            setTimeout(() => { el.textContent = original; }, 1200);
        });
    });
    tbodyEl.querySelectorAll("[data-um-id]").forEach(btn => {
        btn.addEventListener("click", () => setStatus(btn.dataset.umId, "ultimo-mensaje"));
    });
    tbodyEl.querySelectorAll("[data-back-id]").forEach(btn => {
        btn.addEventListener("click", () => setStatus(btn.dataset.backId, "seguimiento1"));
    });
    tbodyEl.querySelectorAll("[data-template72-id]").forEach(btn => {
        btn.addEventListener("click", () => enviarTemplate72h(btn.dataset.template72Id, btn));
    });
    tbodyEl.querySelectorAll("[data-chat-tel]").forEach(btn => {
        btn.addEventListener("click", () => abrirChatModal(btn.dataset.chatTel, btn.dataset.chatTitulo));
    });
}

/* Fila de Clientes con la misma forma que Mantenimiento: plan, cobro y el cambio
   del mes. Desde el 19-sep-2026:
   - Plan anual: el precio por año abajo del plan y, en Cobro, la seña cobrada
     (con su fecha), el saldo pendiente y el próximo cobro anual, con el botón
     para registrarlo. No lleva cambio del mes.
   - Pago único de la web propia: lo mismo, sin cobro anual.
   - Plan mensual: cuánto paga por mes y, en Cobro, la suscripción (con las
     bajas y pausas de Mercado Pago). El primer pago solo se ve, abajo del plan,
     en los clientes que lo tienen cargado (modelo anterior).
   Las notas se editan desde el modal; acá solo se ve la primera línea. */
const ESTADO_SUSCRIPCION_HTML = {
    activa:    `<span style="color:#4ade80;font-weight:700">● Activa</span>`,
    pendiente: `<span style="color:#F59E0B;font-weight:700">○ Pendiente</span>`,
    baja:      `<span style="color:var(--danger);font-weight:700">✕ Dio de baja</span>`,
};

/* Fila de un cliente: en Clientes (webs en desarrollo) y en Mantenimiento
   (entregadas). `sinCambios` saca la columna "Cambios del mes", que el plan
   anual de Mantenimiento no lleva. */
function _clientRow(c, { sinCambios = false, marcarDesarrollo = false } = {}) {
    // "" (sin definir) se ve como el plan mensual, igual que antes del 15-sep-2026.
    const modalidad = modalidadDe(c);
    const s = suscripcionDe(c);
    const proyecto = String(c.proyecto || "").trim();
    const mostrarProyecto = proyecto && proyecto.toLowerCase() !== String(c.nombre || "").trim().toLowerCase();
    const entregada = mantToDate(c.entregadoAt);
    const phoneDisplay = c.telefono
        ? `<span class="phone-copy" data-phone-copy="${escapeHtml(c.telefono)}" title="Copiar número" style="cursor:pointer;font-size:12px">${escapeHtml(c.telefono)}</span>`
        : '';

    // Modelo anterior: el primer pago (10 al 14-sep-2026) o lo abonado antes del
    // 10-sep-2026. Los clientes sin pago inicial no muestran nada.
    const modeloAnterior = (s.primerPago || s.primerPagoAt)
        ? `<div class="muted" style="font-size:11px;white-space:nowrap">primer pago${s.primerPago ? ` ${fmtMoney(s.primerPago)}` : ""} ${s.primerPagoAt ? `cobrado el ${mantLongDate(s.primerPagoAt)}` : "sin registrar"} (modelo anterior)</div>`
        : s.abonoAnterior ? `<div class="muted" style="font-size:11px">abonó ${fmtMoney(s.abonoAnterior)} con el modelo anterior</div>` : "";

    // Aviso del webhook cuando la suscripción se cancela o se pausa en Mercado Pago.
    const fechaAviso = s.aviso ? (mantToDate(s.aviso.fechaBaja) || mantToDate(s.aviso.createdAt)) : null;
    const avisoMp = s.aviso
        ? `<div style="font-size:12px;font-weight:600;white-space:nowrap;color:${s.aviso.tipoEvento === "baja" ? "var(--danger)" : "#9CA3AF"}">${s.aviso.tipoEvento === "baja" ? "canceló" : "pausó"} en Mercado Pago${fechaAviso ? ` el ${mantLongDate(fechaAviso)}` : ""}</div>`
        : "";

    const suscripcion = `
        <div>${ESTADO_SUSCRIPCION_HTML[s.estado]}</div>
        ${avisoMp}
        <div class="muted" style="font-size:12px;white-space:nowrap">${s.desde ? `desde ${mantLongDate(s.desde)}` : "sin fecha de inicio"}</div>
        ${s.porActivar ? `<div style="font-size:12px;font-weight:600;color:#F59E0B">por activar en Mercado Pago</div>` : ""}
        ${s.estado === "pendiente" ? `<button type="button" class="btn-ghost" data-suscripto-id="${c.id}" style="font-size:11px;padding:2px 7px;margin-top:4px" title="El cliente ya está pagando la mensualidad: la deja activa y lo suma a Mantenimiento">Ya se suscribió</button>` : ""}
        ${s.mant ? `<div class="muted" style="font-size:11px">vía Mercado Pago</div>` : ""}
        ${s.preapprovalId ? `<div class="muted" style="font-size:11px;max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(s.preapprovalId)}">ID ${escapeHtml(s.preapprovalId)}</div>` : ""}`;

    // Plan anual y web propia: la seña (o todo lo cobrado) con su fecha y el saldo que se cobra al entregar.
    const u = pagoUnicoDe(c);
    const pagoUnico = `
        ${u.cobrado
            ? `<div style="color:#4ade80;font-weight:700">✓ ${u.precio && !u.saldo ? "Pagado" : "Seña cobrada"}</div>
               <div class="muted" style="font-size:12px;white-space:nowrap">${fmtMoney(u.cobrado)}${u.senaAt ? ` · ${mantLongDate(u.senaAt)}` : ""}</div>`
            : `<div style="color:#F59E0B;font-weight:600">Seña sin registrar</div>`}
        ${!u.precio
            ? `<div class="muted" style="font-size:12px">${c.sinPrecio ? "precio a cotizar" : "sin precio cargado"}</div>`
            : u.saldo ? `<div class="saldo-val" style="font-size:12px;white-space:nowrap">saldo pendiente ${fmtMoney(u.saldo)}</div>` : ""}`;

    // Plan anual (19-sep-2026): el próximo cobro anual, con aviso cuando se acerca o ya venció.
    const r = renovacionAnualDe(c);
    const colorRenovacion = { vencido: "var(--danger)", por_vencer: "#F59E0B" }[r?.estado] || "";
    const renovacion = !r ? "" : r.legado
        // Pago único anterior al plan anual: el aviso de cuándo termina el año de mantenimiento incluido.
        ? (r.proximo ? `<div style="font-size:12px;font-weight:600;white-space:nowrap;margin-top:4px;color:${colorRenovacion || "var(--text-muted)"}">${r.estado === "vencido" ? "terminó el mantenimiento incluido el" : "mantenimiento incluido hasta el"} ${mantLongDate(r.proximo)}</div>` : "")
        : !r.proximo
        ? `<div class="muted" style="font-size:11px;white-space:nowrap">el cobro anual se cuenta desde la seña</div>`
        : `<div style="font-size:12px;font-weight:600;white-space:nowrap;margin-top:4px;color:${colorRenovacion || "var(--text-muted)"}">${r.estado === "vencido" ? "cobro anual vencido el" : "próximo cobro anual:"} ${mantLongDate(r.proximo)}${r.monto ? ` · ${fmtMoney(r.monto)}` : ""}</div>
           ${r.ultimo ? `<div class="muted" style="font-size:11px;white-space:nowrap">último cobro: ${fmtMoney(_num(r.ultimo.monto))}${mantToDate(r.ultimo.at) ? ` · ${mantLongDate(mantToDate(r.ultimo.at))}` : ""}</div>` : ""}
           <button type="button" class="btn-ghost" data-renovar-id="${c.id}" style="font-size:11px;padding:2px 7px;margin-top:4px" title="Anota el cobro del año y pasa el próximo al año siguiente">Registrar cobro anual</button>`;

    // Un cambio por mes incluido desde que arranca el plan mensual. El ciclo se reinicia el
    // mismo día del mes en que arrancó (mismo motor que Mantenimiento). El plan anual y la web propia no lo llevan.
    let cambios;
    if (_conSena(modalidad) || s.estado === "baja" || !s.desde) {
        cambios = `<span class="muted">—</span>`;
    } else if (s.desde > new Date()) {
        cambios = `<span class="muted" style="font-size:12px;white-space:nowrap">arranca el ${mantShortDate(s.desde)}</span>`;
    } else {
        const period = mantCurrentPeriod(null, new Date(), s.desde);
        const pidio = mantUsedCurrentPeriod(c, period);
        const diasRestantes = Math.max(0, Math.ceil((period.next - new Date()) / 86400000));
        cambios = `
            <label title="Se habilita nuevamente el ${escapeHtml(mantLongDate(period.next))}" style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;justify-content:center">
                <input type="checkbox" data-cli-cambio="${c.id}" ${pidio ? "checked" : ""} style="width:18px;height:18px;cursor:pointer;accent-color:#2563eb">
            </label>
            <div style="font-size:12px;font-weight:600;color:#93b4e8;margin-top:4px;white-space:nowrap">${mantShortDate(period.start)} al ${mantShortDate(period.next)}</div>
            <div class="muted" style="font-size:11px;white-space:nowrap">se renueva ${diasRestantes === 0 ? "hoy" : `en ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`}</div>`;
    }

    /* Los dos botones que pidió Pablo (20-sep): "terminada" pasa la web del
       plan mensual o anual a Mantenimiento —la web propia sigue saliendo por
       el tacho, que factura y la deja en Completados— y "iniciar plan" fija
       desde cuándo corre el año del plan anual, con su próximo cobro. */
    const terminada = (!entregada && modalidad !== 'propia')
        ? `<button class="icon-btn btn-terminada" data-terminada-id="${c.id}" title="Marcar la web como terminada: pasa a Mantenimiento con su plan">✓</button>`
        : '';
    const iniciarPlan = modalidad === 'unico' && !r?.legado
        ? `<button class="icon-btn btn-iniciar-plan" data-iniciar-plan="${c.id}" title="${r?.proximo ? `Cambiar desde cuándo corre el plan anual (próximo cobro: ${mantLongDate(r.proximo)})` : 'Marcar desde cuándo corre el plan anual: el próximo cobro queda un año después'}">▶</button>`
        : '';

    return `
        <tr class="client-row" data-row-id="${c.id}">
            <td>
                <div class="client-name-cell">
                    <span style="font-weight:600">${escapeHtml(c.nombre)}</span>
                    ${mostrarProyecto ? `<small class="muted" style="font-size:12px">${escapeHtml(proyecto)}</small>` : ""}
                    ${phoneDisplay}
                    ${entregada ? `<small class="muted" style="font-size:11px">Web entregada el ${mantLongDate(entregada)}</small>` : ""}
                    ${!entregada && marcarDesarrollo ? `<small style="font-size:11px;color:#93b4e8">web en desarrollo</small>` : ""}
                    ${c.notas ? `<small class="muted" style="font-size:12px;font-style:italic;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(c.notas)}">${escapeHtml(c.notas)}</small>` : ""}
                </div>
            </td>
            <td>
                <div>${escapeHtml(s.plan.label || "Plan sin definir")}</div>
                ${modalidad === "unico" && r?.legado
                    ? `<div class="muted" style="font-size:12px;white-space:nowrap">pago único${u.precio ? ` ${fmtMoney(u.precio)}` : ""}</div>
                       <div class="muted" style="font-size:11px">anterior al plan anual</div>`
                    : modalidad === "unico"
                    ? `<div class="muted" style="font-size:12px;white-space:nowrap">plan anual${u.precio ? ` ${fmtMoney(u.precio)}/año` : ""}</div>`
                    : modalidad === "propia"
                    ? `<div class="muted" style="font-size:12px;white-space:nowrap">pago único${u.precio ? ` ${fmtMoney(u.precio)}` : ""} · web propia</div>`
                    : `<div class="muted" style="font-size:12px;white-space:nowrap">${fmtMoney(s.mensual)}/mes</div>
                ${modalidad ? "" : `<div class="muted" style="font-size:11px">modalidad sin definir</div>`}
                ${modeloAnterior}`}
            </td>
            <td>${_conSena(modalidad) ? pagoUnico + renovacion : suscripcion}</td>
            ${sinCambios ? "" : `<td class="center">${cambios}</td>`}
            <td class="actions-col">
                ${terminada}${iniciarPlan}
                <button class="icon-btn" data-agenda-nombre="${escapeHtml(c.nombre)}" data-agenda-proyecto="${escapeHtml(c.proyecto)}" title="Agregar al calendario">📅</button>
                <button class="icon-btn" data-facturar-id="${c.id}" title="Facturar un monto puntual, por ejemplo el saldo o una mensualidad (no marca la web como entregada)">🧾</button>
                <button class="icon-btn edit" data-id="${c.id}" title="Editar">✎</button>
                <button class="icon-btn delete" data-id="${c.id}" title="${webEntregada(c)
                    ? "Eliminar el cliente (el registro de la entrega queda en Completados)"
                    : modalidad === 'propia'
                        ? "Facturar y cerrar la web propia: sale de Clientes y queda en Completados"
                        : "Entregar con factura. Si no hace falta factura, usá el ✓ de Terminada"}">🗑</button>
            </td>
        </tr>`;
}

/* ── Template de 72 h desde Seguimientos ──
   El bot le manda al cliente la plantilla de seguimiento de la demo
   (seguimiento_demo_72h en Meta). Es el mismo envío que el botón del chat: una
   sola vez por cliente, solo por WhatsApp y con la demo ya presentada. */

/* El chat del bot con la demo presentada de este cliente, según la última
   sincronización: por el id que viaja al presentar la demo o, si la demo se
   marcó a mano desde el chat, por el teléfono (solo WhatsApp: en Instagram la
   clave del chat no es un número). Con dos chats para el mismo número no elige
   ninguno: el clic manda el teléfono y el bot avisa que es ambiguo. */
function presentadoDeCliente(c) {
    const porId = wabotPresentados.find(it => it.cliente_id === c.id);
    if (porId) return porId;
    const tel = cleanArgPhone(c.telefono);
    if (tel.length < 8) return null;
    const porTel = wabotPresentados.filter(it => it.canal !== "instagram" && cleanArgPhone(it.tel) === tel);
    return porTel.length === 1 ? porTel[0] : null;
}

// Envíos hechos desde esta pestaña: la fila los muestra sin esperar la próxima sincronización.
const template72hEnviados = {};

function fechaTemplate72h(ts) {
    return new Date(ts * 1000).toLocaleString("es-AR", {
        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires"
    });
}

function _botonTemplate72h(c) {
    const it = presentadoDeCliente(c);
    if (!it && cleanArgPhone(c.telefono).length < 8) return "";
    const enviadoTs = template72hEnviados[c.id] || it?.template_72h_ts || 0;
    if (enviadoTs) {
        return `<button class="icon-btn btn-template72 enviado" disabled title="Template de 72 h enviado el ${escapeHtml(fechaTemplate72h(enviadoTs))}">✓ 72h</button>`;
    }
    if (it?.canal === "instagram") {
        return `<button class="icon-btn btn-template72" disabled title="Su chat es de Instagram: el template de 72 h sale solo por WhatsApp">72h</button>`;
    }
    return `<button class="icon-btn btn-template72" data-template72-id="${c.id}" title="Mandarle por el bot el template de seguimiento de 72 h">72h</button>`;
}

/* "Ver chat" como en Bocetos: el chat del bot en el modal, sin salir de la
   pestaña. Va la clave exacta si la sincronización ya encontró el chat; si no,
   el teléfono, y el panel lo busca como al presentar la demo. */
function _botonVerChat(c) {
    const destino = presentadoDeCliente(c)?.clave || (cleanArgPhone(c.telefono).length >= 8 ? c.telefono : "");
    if (!destino) return "";
    const titulo = [c.nombre, c.telefono].filter(Boolean).join(" · ");
    return `<div><button type="button" class="btn-ghost" data-chat-tel="${escapeHtml(destino)}" data-chat-titulo="${escapeHtml(titulo)}" style="font-size:11px;padding:2px 7px;margin-top:4px" title="Abrir la conversación de WhatsApp/Instagram de este cliente sin salir de Seguimientos">Ver chat</button></div>`;
}

const TEMPLATE_72H_MOTIVOS = {
    sin_demo: "Todavía no tiene la demo presentada por el bot, y el template le pregunta si pudo verla.",
    canal:    "Su chat es de Instagram, y el template de 72 h sale solo por WhatsApp.",
    sin_chat: "No hay una conversación del bot con ese teléfono.",
    ambiguo:  "Hay más de una conversación del bot con ese teléfono: mandalo desde el chat que corresponde, en la pestaña WhatsApp.",
    error:    "Meta rechazó el template, o está apagado en Ajustes del bot.",
};

async function enviarTemplate72h(id, btn) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    const nombre = c.nombre || c.proyecto || "este cliente";
    if (!confirm(`¿Mandarle a ${nombre} el template de seguimiento de 72 h por el bot?`)) return;

    // Si la sincronización ya encontró su chat, va la clave exacta; si no, el
    // teléfono y el bot lo busca como al presentar la demo.
    const it = presentadoDeCliente(c);
    btn.disabled = true;
    btn.textContent = "…";
    let data;
    try {
        await wabotAuthHandshake();
        const res = await fetch("../wabot/admin.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ accion: "seguimiento_template_72h", tel: it ? it.clave : c.telefono }),
            credentials: "same-origin"
        });
        data = await res.json();
    } catch (e) {
        console.error(e);
        alert("No se pudo contactar al panel del bot: " + e.message);
        renderSeg();
        return;
    }

    if (data.ok || data.resultado === "ya") {
        template72hEnviados[c.id] = data.enviado_ts || Math.floor(Date.now() / 1000);
    }
    renderSeg();
    if (data.resultado === "ya") {
        alert(`A ${nombre} ya le salió el template de 72 h el ${fechaTemplate72h(template72hEnviados[c.id])}. No se manda dos veces al mismo cliente.`);
    } else if (!data.ok) {
        alert(`No se envió. ${TEMPLATE_72H_MOTIVOS[data.resultado] || TEMPLATE_72H_MOTIVOS.error}`);
    }
}

function _segRow(c) {
    const estado = getEstado(c);
    const plan = planDe(c, propuestaDeCliente(c));
    const phoneDisplay = c.telefono
        ? `<span class="phone-copy" data-phone-copy="${escapeHtml(c.telefono)}" title="Copiar número" style="cursor:pointer">${escapeHtml(c.telefono)}</span>`
        : '';
    return `
        <tr class="client-row" data-row-id="${c.id}">
            <td>${escapeHtml(c.nombre)}</td>
            <td class="col-proyecto" title="${escapeHtml(c.proyecto)}">${escapeHtml(c.proyecto)}</td>
            <td class="col-telefono">${phoneDisplay}${_botonVerChat(c)}</td>
            <td>
                <div>${escapeHtml(plan.label || "Plan sin definir")}</div>
                <div class="muted" style="font-size:12px;white-space:nowrap">${_planMontosTexto(plan)}</div>
            </td>
            <td class="center">
                <select class="inline-status-select ${estado}" data-status-id="${c.id}">
                    <option value="seguimiento1"${estado === 'seguimiento1' ? ' selected' : ''}>Seguimiento</option>
                    <option value="ultimo-mensaje"${estado === 'ultimo-mensaje' ? ' selected' : ''}>Último mensaje</option>
                    <option value="standby"${estado === 'standby' ? ' selected' : ''}>Stand by</option>
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
                ${_botonTemplate72h(c)}
                ${estado === 'ultimo-mensaje'
                    ? `<button class="icon-btn btn-volver-seg" data-back-id="${c.id}" title="Volver a Seguimiento">↩</button>`
                    : `<button class="icon-btn btn-ultimo-msj" data-um-id="${c.id}" title="Pasar a Último mensaje">✉</button>`}
                <button class="icon-btn" data-agenda-nombre="${escapeHtml(c.nombre)}" data-agenda-proyecto="${escapeHtml(c.proyecto)}" title="Agregar al calendario">📅</button>
                <button class="icon-btn edit" data-id="${c.id}" title="Editar">✎</button>
                <button class="icon-btn delete" data-id="${c.id}" title="Eliminar">🗑</button>
            </td>
        </tr>`;
}

function _parseSketchDate(value) {
    if (!value) return null;
    if (typeof value.toDate === "function") {
        const date = value.toDate();
        return Number.isNaN(date.getTime()) ? null : date;
    }
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    if (typeof value === "string") {
        const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
        if (match) {
            const date = new Date(
                Number(match[3]), Number(match[2]) - 1, Number(match[1]),
                Number(match[4] || 12), Number(match[5] || 0), Number(match[6] || 0)
            );
            return Number.isNaN(date.getTime()) ? null : date;
        }
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    return null;
}

function _clientSketchDate(c) {
    const linkedProposal = propuestas.find(p =>
        (c.propuestaId && p.id === c.propuestaId) ||
        (c.presupuestoId && p.presupuestoId === c.presupuestoId)
    );
    return _parseSketchDate(linkedProposal?.createdAt) || _parseSketchDate(c.propuestaFecha);
}

const WEEKDAY_NAMES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const SKETCH_DAY_STATS_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Lunes..Domingo, valores de Date#getDay()
const WEEKDAY_NAMES_MON_FIRST = SKETCH_DAY_STATS_ORDER.map(i => WEEKDAY_NAMES[i]);

function _sketchTimeSlot(hour) {
    if (hour === 0) return "00–01";
    if (hour < 7) return "01–07";
    if (hour === 7) return "07–08";
    const desde = String(hour).padStart(2, "0");
    const hasta = String(hour + 1).padStart(2, "0");
    return `${desde}–${hasta}`;
}

function _clientSketchSlotLabel(c) {
    const date = _clientSketchDate(c);
    if (!date) return "";
    return `${WEEKDAY_NAMES[date.getDay()]} · ${_sketchTimeSlot(date.getHours())}h`;
}

function _weekForDate(date, undatedLabel) {
    if (!date) return { key: "undated", label: undatedLabel, sort: -Infinity };

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const key = [start.getFullYear(), String(start.getMonth() + 1).padStart(2, "0"), String(start.getDate()).padStart(2, "0")].join("-");
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const endLabel = end.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    const label = sameMonth
        ? `Semana del ${start.getDate()} al ${endLabel}`
        : `Semana del ${start.toLocaleDateString("es-AR", { day: "numeric", month: "long" })} al ${endLabel}`;

    return { key, label, sort: start.getTime() };
}

function _clientWeek(c) {
    return _weekForDate(_clientSketchDate(c), "Sin fecha de boceto");
}

// --- Estadísticas de boceto: por día de semana y por horario (Clientes / Completados) ---
const SKETCH_SLOT_STATS_ORDER = [
    "00–01",
    "01–07",
    "07–08",
    ...Array.from({ length: 16 }, (_, i) => {
        const hour = i + 8;
        return `${String(hour).padStart(2, "0")}–${String(hour + 1).padStart(2, "0")}`;
    })
];

function _sketchStatsBarsHTML(labels, counts) {
    const max = Math.max(1, ...counts);
    return labels.map((label, i) => {
        const count = counts[i];
        const width = count > 0 ? Math.max(Math.round((count / max) * 100), 4) : 0;
        return `
            <div class="sketch-stats-row">
                <span class="sketch-stats-label">${escapeHtml(label)}</span>
                <div class="sketch-stats-track"><div class="sketch-stats-fill" style="width:${width}%"></div></div>
                <span class="sketch-stats-count">${count}</span>
            </div>`;
    }).join("");
}

function _sketchHourColumnsHTML(counts) {
    const max = Math.max(1, ...counts);
    return SKETCH_SLOT_STATS_ORDER.map((label, i) => {
        const count = counts[i];
        const height = count > 0 ? Math.max(Math.round((count / max) * 100), 8) : 0;
        return `
            <div class="sketch-hour-column" title="${escapeHtml(label)}h: ${count} boceto${count === 1 ? "" : "s"}">
                <span class="sketch-hour-count">${count}</span>
                <span class="sketch-hour-bar" aria-hidden="true"><i style="height:${height}%"></i></span>
                <span class="sketch-hour-label">${escapeHtml(label)}</span>
            </div>`;
    }).join("");
}

function _renderSketchStats(containerId, list) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const dates = list.map(_clientSketchDate).filter(Boolean);
    if (dates.length === 0) {
        el.innerHTML = `<p class="sketch-stats-empty">Todavía no hay bocetos con fecha para calcular estadísticas.</p>`;
        return;
    }

    const dayCounts = SKETCH_DAY_STATS_ORDER.map(() => 0);
    const slotCounts = Object.fromEntries(SKETCH_SLOT_STATS_ORDER.map(slot => [slot, 0]));
    dates.forEach(date => {
        dayCounts[SKETCH_DAY_STATS_ORDER.indexOf(date.getDay())]++;
        slotCounts[_sketchTimeSlot(date.getHours())]++;
    });

    el.innerHTML = `
        <div class="sketch-stats-col">
            <div class="sketch-stats-title">Boceto por día (${dates.length})</div>
            ${_sketchStatsBarsHTML(WEEKDAY_NAMES_MON_FIRST, dayCounts)}
        </div>
        <div class="sketch-stats-col sketch-stats-col--hours">
            <div class="sketch-stats-title">Boceto por horario</div>
            <div class="sketch-hour-grid">
                ${_sketchHourColumnsHTML(SKETCH_SLOT_STATS_ORDER.map(s => slotCounts[s]))}
            </div>
        </div>`;
}

function _compareClientsInWeek(a, b) {
    const da = _clientSketchDate(a)?.getTime() || 0;
    const db = _clientSketchDate(b)?.getTime() || 0;
    if (da !== db) return db - da;
    return (a.nombre || "").localeCompare(b.nombre || "", "es");
}

function _weekSeparatorRow(group, colspan = 7) {
    const count = group.items.length;
    const weekTotal = group.items.reduce((sum, client) => sum + (Number(client.valorTotal) || 0), 0);
    return `
        <tr class="week-separator-row">
            <td colspan="${colspan}">
                <div class="week-separator-label">
                    <span>${escapeHtml(group.week.label)}</span>
                    <small>${count} ${count === 1 ? "cliente" : "clientes"} | Total semanal: ${fmtMoney(weekTotal)}</small>
                </div>
            </td>
        </tr>`;
}

function render() {
    const term = searchInput.value.trim().toLowerCase();
    const termPhone = cleanArgPhone(term);
    // Solo las webs en desarrollo: las entregadas están en Mantenimiento (19-sep-2026).
    const clientesBase = clients.filter(c => getEstado(c) === "cliente" && !webEntregada(c));
    let list = clientesBase;
    if (term) list = list.filter(c =>
        (c.nombre || "").toLowerCase().includes(term) ||
        (c.proyecto || "").toLowerCase().includes(term) ||
        (c.telefono || "").toLowerCase().includes(term) ||
        (termPhone && cleanArgPhone(c.telefono).includes(termPhone)));

    // Lista plana, el más reciente primero (los que no tienen fecha de boceto quedan al final).
    const ordered = [...list].sort(_compareClientsInWeek);

    tbody.innerHTML = ordered.length
        ? ordered.map(_clientRow).join("")
        : `<tr class="empty-row"><td colspan="5">No hay webs en desarrollo${term ? " para esa búsqueda" : ""}.</td></tr>`;

    _updateClientCounters();
    _bindTableListeners(tbody);
}

// --- Viñetas de Seguimientos (En seguimiento / Último mensaje / Stand by) ---
let segView = "seguimiento1";
document.querySelectorAll("#segViews .seg-chip").forEach(b => {
    b.addEventListener("click", () => {
        document.querySelectorAll("#segViews .seg-chip").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        segView = b.dataset.segview;
        renderSeg();
    });
});

function renderSeg() {
    const segTbody = document.getElementById("segTbody");
    if (!segTbody) return;
    const term = (document.getElementById("searchSegInput")?.value || "").trim().toLowerCase();
    const termPhone = cleanArgPhone(term);
    let list = clients.filter(c => getEstado(c) === segView);
    if (term) list = list.filter(c =>
        (c.nombre || "").toLowerCase().includes(term) ||
        (c.proyecto || "").toLowerCase().includes(term) ||
        (c.telefono || "").toLowerCase().includes(term) ||
        (termPhone && cleanArgPhone(c.telefono).includes(termPhone)));

    list.sort((a, b) => {
        const da = a.hablarleElDia || "", db2 = b.hablarleElDia || "";
        if (da && db2) return da < db2 ? -1 : da > db2 ? 1 : 0;
        return da ? -1 : db2 ? 1 : 0;
    });

    const emptyLabels = { "seguimiento1": "seguimientos", "ultimo-mensaje": "clientes en Último mensaje", "standby": "clientes en Stand by" };
    segTbody.innerHTML = list.length
        ? list.map(_segRow).join("")
        : `<tr class="empty-row"><td colspan="8">No hay ${emptyLabels[segView] || "seguimientos"}${term ? " para esa búsqueda" : ""}.</td></tr>`;

    _updateClientCounters();
    _bindTableListeners(segTbody);
}

async function updateField(id, field, value, col = "clientes") {
    try {
        await updateDoc(doc(db, col, id), {
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

/* "Pidió el cambio del mes" en Clientes: mismo criterio que Mantenimiento
   (`cambiosPeriodo` = inicio del ciclo vigente), con el ciclo anclado al día
   en que arranca el plan mensual. */
async function toggleCambiosCliente(id, checked) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    const { desde } = suscripcionDe(c);
    if (!desde) return;
    try {
        await updateDoc(doc(db, "clientes", id), {
            cambiosPeriodo: checked ? mantCurrentPeriod(null, new Date(), desde).key : "",
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(err);
        alert("Error al guardar el cambio: " + err.message);
        render(); // revertir el checkbox visual
    }
}

/* Cobro anual del plan anual (19-sep-2026): se anota en `renovaciones` (cuándo,
   cuánto y qué vencimiento pagó) y el próximo pasa al año siguiente. No hay
   suscripción: el cobro se hace a mano y se registra acá. */
/* "Terminada" (Pablo, 20-sep): la web del plan mensual o anual se entrega y
   pasa de Clientes a Mantenimiento. Es el mismo completarCliente() del tacho
   pero sin el paso de la factura: el cliente sigue con su plan y en
   Completados queda el registro de la entrega. La web propia no usa este
   botón: esa se factura y queda solo en Completados. */
async function marcarWebTerminada(id) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    const plan = modalidadDe(c) === "unico" ? "el plan anual" : "el plan mensual";
    if (!confirm(`¿Marcar la web de "${c.nombre || c.proyecto || "este cliente"}" como terminada?\n\nPasa a Mantenimiento con ${plan} y queda el registro de la entrega en Completados.`)) return;
    try {
        await completarCliente(id, null);
    } catch (err) {
        console.error(err);
        alert("Error al marcarla como terminada: " + err.message);
    }
}

/* "Iniciar plan" (Pablo, 20-sep): el plan anual no tiene suscripción, así que
   el año corre desde la fecha que diga Pablo (por defecto, la de la seña o
   hoy). Deja el próximo cobro un año después; el botón "Registrar cobro
   anual" sigue moviéndolo cada vez que cobra. */
/* "Ya se suscribió" (Pablo, 21-sep): el cliente pagó la mensualidad y el panel
   todavía lo muestra pendiente, porque la suscripción no llegó por el webhook
   de Mercado Pago. La deja activa —con eso entra a Mantenimiento y empieza a
   contar el cambio del mes— y pregunta desde cuándo corre si no tiene fecha. */
async function marcarSuscripcionActiva(id) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    const s = suscripcionDe(c);
    const cambios = { estadoSuscripcion: "activa", updatedAt: serverTimestamp() };
    if (!s.desde) {
        const hoy = new Date();
        const sugerida = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
        const respuesta = prompt(
            `"${c.nombre || c.proyecto || "Cliente"}": ¿desde cuándo corre la mensualidad?\n\n` +
            `Desde esa fecha se cuenta el cambio por mes incluido.\nFormato: aaaa-mm-dd.`,
            sugerida
        );
        if (respuesta === null) return;
        const inicio = _fechaDeInput(respuesta);
        if (!inicio) { alert("La fecha va en formato aaaa-mm-dd, por ejemplo 2026-09-21."); return; }
        cambios.suscripcionDesde = inicio;
    }
    try {
        await updateDoc(doc(db, "clientes", id), cambios);
    } catch (err) {
        console.error(err);
        alert("Error al marcar la suscripción: " + err.message);
    }
}

async function iniciarPlanAnual(id) {
    const c = clients.find(x => x.id === id);
    if (!c) return;
    const r = renovacionAnualDe(c);
    const desde = mantToDate(c.planDesdeAt) || mantToDate(c.senaAt) || new Date();
    const sugerida = `${desde.getFullYear()}-${String(desde.getMonth() + 1).padStart(2, "0")}-${String(desde.getDate()).padStart(2, "0")}`;
    const respuesta = prompt(
        `"${c.nombre || c.proyecto || "Cliente"}": ¿desde cuándo corre el plan anual?\n\n` +
        `El próximo cobro queda un año después de esa fecha${r?.proximo ? ` (ahora está en ${mantLongDate(r.proximo)})` : ""}.\n` +
        `Formato: aaaa-mm-dd.`,
        sugerida
    );
    if (respuesta === null) return;
    const inicio = _fechaDeInput(respuesta);
    if (!inicio) { alert("La fecha va en formato aaaa-mm-dd, por ejemplo 2026-09-20."); return; }
    try {
        await updateDoc(doc(db, "clientes", id), {
            planDesdeAt: inicio,
            renovacionAt: _sumarAnios(inicio, 1),
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(err);
        alert("Error al iniciar el plan: " + err.message);
    }
}

async function registrarCobroAnual(id) {
    const c = clients.find(x => x.id === id);
    const r = c ? renovacionAnualDe(c) : null;
    if (!r || !r.proximo || r.legado) return;
    const siguiente = _sumarAnios(r.proximo, 1);
    const montoInput = prompt(
        `Cobro anual de "${c.nombre || c.proyecto || "Cliente"}", que vence el ${mantLongDate(r.proximo)}.\n\n` +
        `¿Cuánto cobraste? El próximo cobro queda para el ${mantLongDate(siguiente)}.`,
        r.monto ? String(r.monto) : ""
    );
    if (montoInput === null) return;
    const monto = Number(String(montoInput).replace(/\D/g, "")) || 0;
    if (!monto) {
        alert("Escribí el monto que cobraste.");
        return;
    }
    const renovaciones = [...(Array.isArray(c.renovaciones) ? c.renovaciones : []), { at: new Date(), monto, vencia: r.proximo }];
    try {
        await updateDoc(doc(db, "clientes", id), {
            renovaciones,
            renovacionAt: siguiente,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(err);
        alert("Error al registrar el cobro: " + err.message);
    }
}

// Respuesta al prompt de la modalidad: 1 o "anual" → 'unico'; 2 o "mensual" → 'mensual'; 3, "propia" o "único" → 'propia'; si no, "".
function _modalidadDeRespuesta(texto) {
    const t = String(texto || "").trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    if (t === "1" || t.startsWith("a") || t.includes("anual")) return "unico";
    if (t === "2" || t.startsWith("m") || t.includes("mensual")) return "mensual";
    if (t === "3" || t.includes("propia") || t.includes("unico")) return "propia";
    return "";
}

async function setStatus(id, value) {
    try {
        const c = clients.find(x => x.id === id);
        const prevEstado = c ? getEstado(c) : null;

        const updateData = {
            estadoCliente: value,
            updatedAt: serverTimestamp()
        };

        /* Pasar a Cliente: se pregunta con qué plan contrató y se sugiere el elegido en
           el doc, en el boceto o en la calculadora (o el deducido de un doc anterior).
           Si cancela, sigue en Seguimiento.
           - Plan anual (19-sep-2026) y pago único de la web propia: queda el precio (el
             acordado o el del plan) y se pregunta cuánto cobró de seña; la seña se
             registra una sola vez, con la fecha de hoy. El cobro anual se cuenta desde
             la seña.
           - Plan mensual: se fija la mensualidad (del boceto o del tipo de web) y la
             suscripción queda pendiente hasta que se suscribe en Mercado Pago. Un precio
             que solo estaba cotizado, sin nada cobrado, vuelve a 0.
           Lo que el doc ya tenga del modelo anterior (primerPago, primerPagoAt y lo
           cobrado) no se toca. */
        if (value === "cliente" && prevEstado !== "cliente" && c) {
            const plan = planDe(c, propuestaDeCliente(c));
            const sugerida = modalidadDe(c) || plan.modalidad;
            let modalidad = "";
            while (!modalidad) {
                const respuesta = prompt(
                    `"${c.nombre || c.proyecto || "Cliente"}" pasa a Cliente (plan ${plan.label || "sin definir"}). ¿Con qué plan contrató?\n\n` +
                    `1. Plan anual: ${fmtMoney(plan.unico)} por año, sin suscripción. Seña de ${fmtMoney(plan.sena)} para arrancar, el resto (${fmtMoney(plan.saldo)}) al entregar y después se cobra cada año.\n` +
                    `2. Plan mensual: ${fmtMoney(plan.mensual)} por mes por Mercado Pago, sin pago inicial.\n` +
                    `3. Pago único (web propia, en su hosting): ${fmtMoney(plan.propia)}, con seña de ${fmtMoney(plan.sena)} y el resto al entregar. Sin renovación.\n\n` +
                    `Escribí 1, 2 o 3. Si cancelás, sigue en Seguimiento.`,
                    sugerida === "unico" ? "1" : sugerida === "mensual" ? "2" : sugerida === "propia" ? "3" : ""
                );
                if (respuesta === null) {
                    renderSeg();   // el select de la fila vuelve al estado guardado
                    return;
                }
                modalidad = _modalidadDeRespuesta(respuesta);
                if (!modalidad) alert("Escribí 1 para el plan anual, 2 para el plan mensual o 3 para el pago único de la web propia.");
            }
            updateData.modalidad = modalidad;
            if (typeof c.planLabel !== "string") updateData.planLabel = plan.label;
            if (_conSena(modalidad)) {
                const precio = modalidad === "propia" ? plan.propia : plan.unico;
                updateData.valorTotal = precio;
                // Si vuelve a Seguimiento y regresa, conserva la seña que ya tenía registrada.
                const senaYaCobrada = _conSena(modalidadDe(c)) && (_num(c.abono) || c.senaAt);
                if (!senaYaCobrada) {
                    const montoInput = prompt(
                        `${modalidad === "propia" ? `Pago único de ${fmtMoney(precio)}` : `Plan anual de ${fmtMoney(precio)} por año`}.\n\n` +
                        `¿Cuánto cobraste de seña? El resto se cobra al entregar. Si cancelás, pasa igual a Cliente con la seña sin registrar.`,
                        String(plan.sena)
                    );
                    const monto = montoInput === null ? 0 : Number(String(montoInput).replace(/\D/g, "")) || 0;
                    if (monto) {
                        updateData.abono = monto;
                        updateData.senaAt = serverTimestamp();
                    }
                }
            } else {
                if (!_num(c.montoMensual)) updateData.montoMensual = plan.mensual;
                if (!c.estadoSuscripcion) updateData.estadoSuscripcion = "pendiente";
                if (typeof c.preapprovalId !== "string") updateData.preapprovalId = "";
                if (_cotizacionSinCobro(c)) updateData.valorTotal = 0;
            }
        }

        // (sin auto-avance de fecha entre seguimientos)
        if (false) {
        }

        await updateDoc(doc(db, "clientes", id), updateData);
    } catch (err) {
        console.error(err);
        alert("Error al actualizar: " + err.message);
    }
}

/* Detalle del brief original, en el mismo formato que el boceto.
   `src` son las claves de la propuesta: el snapshot completo guardado al convertir
   (claves crudas: nombre_negocio, color_fondos…) o, para clientes convertidos antes
   del snapshot, el propio doc del cliente (claves camelCase: colorFondos, ciudadZona…).
   La función acepta ambas y devuelve las filas .prop-row, o "" si no hay nada. */
function briefDetailHTML(src) {
    if (!src || typeof src !== "object") return "";

    const { rubro } = getPropuestaNegocioFields(src);
    const objetivos = getPropuestaObjetivosTexto(src);
    const contacto  = cleanFieldValue(src.nombre || src.contacto_nombre || src.contactoNombre || "");
    const tipoWeb   = getPropuestaTipoWeb(src);
    const tipoPagina= cleanFieldValue(src.tipo_pagina || src.tipoPagina || "");
    const prodServ  = cleanFieldValue(src.productos_servicios || src.productosServicios || "");
    const objetivoWeb = cleanFieldValue(src.objetivo_web || src.objetivoWeb || "");
    const adicionales = cleanFieldValue(src.adicionales_texto || src.adicionalesTexto || "");
    const ciudad    = cleanFieldValue(src.ciudad_zona || src.ciudadZona || "");
    const cantCursos= cleanFieldValue(src.cant_cursos || src.cantCursos || "");
    const imagenes  = Number(src.imagenes_recibidas || src.imagenesRecibidas || 0);
    const colores   = cleanFieldValue(src.colores || src.colores_extra || "");
    const fondos    = cleanFieldValue(src.color_fondos || src.colorFondos || "");
    const principal = cleanFieldValue(src.color_principal || src.colorPrincipal || "");
    const secundario= cleanFieldValue(src.color_secundario || src.colorSecundario || "");
    const tipograf  = cleanFieldValue(src.tipografias || "");
    const instagram = cleanFieldValue(src.instagram || "");
    const referencias = cleanFieldValue(src.referencias || "");
    const extra     = cleanFieldValue(src.extra || "");
    // Pasos 2 y 3 del formulario: estilo, "incluir sí o sí" y los 2 modelos elegidos (16-sep).
    const estiloPagina = cleanFieldValue(src.estilo_pagina || "");
    const incluir   = cleanFieldValue(src.incluir_si_o_si || "");
    const modelosElegidos = modelosElegidosTexto(src);
    // Dos modalidades (15-sep-2026): la elegida en el boceto o, si no eligió, las dos.
    const plan = planDe(src);
    const fecha = src.fecha || src.propuestaFecha || "";
    const logoUrl = src.logoUrl || "";
    const logoNombre = src.logoNombre || "";

    const row = (label, value, block) => value
        ? `<div class="prop-row${block ? " prop-row-block" : ""}"><span class="prop-label">${label}</span>${block ? `<p class="prop-text">${escapeHtml(value)}</p>` : `<span>${escapeHtml(value)}</span>`}</div>`
        : "";

    const rows = [
        row("Contacto", contacto),
        row("Rubro / actividad", rubro, true),
        row("Tipo de web", tipoWeb),
        row("Modelos elegidos", modelosElegidos, true),
        row("Estilo de página", estiloPagina),
        row("Incluir sí o sí", incluir, true),
        row("Objetivo elegido", objetivos, true),
        row("Tipo de sitio", tipoPagina),
        row("Productos / servicios", prodServ, true),
        row("Qué quiere lograr", objetivoWeb, true),
        row("Adicionales elegidos", adicionales, true),
        row("Ciudad / zona", ciudad),
        row("Cantidad de cursos", cantCursos),
        row("Colores", colores, true),
        row("Fondos", fondos),
        row("Color principal", principal),
        row("Color secundario", secundario),
        row("Tipografías", tipograf),
        row("Instagram", instagram),
        row("Referencias web", referencias, true),
        row("Algo más", extra, true),
        // La charla entera, plegada: se abre solo si hace falta ir al detalle.
        (() => {
            const chat = cleanFieldValue(src.chat_completo || "");
            if (!chat) return "";
            return `<div class="prop-row" style="display:block">
                <details style="margin-top:4px">
                    <summary style="cursor:pointer;color:var(--accent-green);font-weight:600;font-size:12px">Ver el chat con el cliente</summary>
                    <pre style="white-space:pre-wrap;word-break:break-word;font-size:11.5px;line-height:1.5;margin:8px 0 0;padding:9px 11px;background:rgba(255,255,255,.04);border-radius:8px;max-height:340px;overflow:auto">${escapeHtml(chat)}</pre>
                </details>
            </div>`;
        })(),
    ].join("");

    const logoRow = logoUrl
        ? `<div class="prop-row"><span class="prop-label">Imágenes</span><span><button type="button" onclick="downloadImagenesCliente('${escapeHtml(logoUrl)}','')" style="background:none;border:none;cursor:pointer;color:var(--accent-green);font-weight:600;padding:0">⬇ Descargar ${imagenes > 1 ? `las ${imagenes} imágenes` : "la imagen"}</button> <span class="muted" style="font-size:11px">(${imagenes > 1 ? "en un zip, el logo primero" : escapeHtml(logoNombre || "")})</span></span></div>`
        : "";

    const precioBlock = `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
           ${_planRowsHTML(plan)}
           ${row("Cotizado por el bot", cleanFieldValue(src.presupuesto_cotizado || ""))}
           ${src.catalogQty ? `<div class="prop-row"><span class="prop-label">Catálogo</span><span>${escapeHtml(PRESUPUESTO_CATALOGO_QTY_LABELS[src.catalogQty] || src.catalogQty)}</span></div>` : ""}`;

    if (!rows && !logoRow) return "";

    return rows + precioBlock + logoRow
        + (fecha ? `<div class="prop-row muted" style="font-size:12px"><span class="prop-label">Fecha propuesta</span><span>${escapeHtml(fecha)}</span></div>` : "");
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
        document.getElementById("emailCliente").value = c.email || "";
        document.getElementById("notasCliente").value = c.notas || "";
        document.getElementById("estadoCliente").value = getEstado(c);
        document.getElementById("hablarleElDia").value = c.hablarleElDia || "";
        cargarPlanEnModal(c);

        modalTareas = { ...(c.tareas || {}) };

        // Mostrar datos de propuesta original si existen.
        // Fuente preferida: el snapshot completo del boceto (guardado al convertir).
        // Fallback: el propio doc del cliente, para los convertidos antes del snapshot.
        const propSection = document.getElementById("propuestaInfoSection");
        const propBody    = document.getElementById("propuestaInfoBody");
        const briefHTML   = briefDetailHTML(c.propuestaSnapshot || c);
        if (briefHTML) {
            propBody.innerHTML = briefHTML;
            propSection.style.display = "";
        } else {
            propSection.style.display = "none";
            propBody.innerHTML = "";
        }

        // Mostrar datos del presupuesto vinculado si existen
        const presSection = document.getElementById("presupuestoInfoSection");
        const presBody    = document.getElementById("presupuestoInfoBody");
        const hasPresData = c.siteType || (Array.isArray(c.functionalities) && c.functionalities.length) || c.presupuestoId;
        if (hasPresData) {
            presBody.innerHTML = `
                ${c.siteType ? `<div class="prop-row"><span class="prop-label">Tipo de sitio</span><span>${escapeHtml(TYPE_LABELS[c.siteType] || c.siteType || "—")}</span></div>` : ""}
                ${c.businessType ? `<div class="prop-row"><span class="prop-label">Rubro</span><span>${escapeHtml(c.businessType)}</span></div>` : ""}
                ${_planRowsHTML(planDe({ siteType: c.siteType }, presupuestos.find(l => l.id === c.presupuestoId)))}
                ${c.catalogQty ? `<div class="prop-row"><span class="prop-label">Catálogo</span><span>${escapeHtml(PRESUPUESTO_CATALOGO_QTY_LABELS[c.catalogQty] || c.catalogQty)}</span></div>` : ""}
                ${Array.isArray(c.functionalities) && c.functionalities.length ? `<div class="prop-row prop-row-block"><span class="prop-label">Funcionalidades</span><p class="prop-text">${escapeHtml(formatFuncionalidadesValue(c.functionalities))}</p></div>` : ""}
                ${Array.isArray(c.objectives) && c.objectives.length ? `<div class="prop-row prop-row-block"><span class="prop-label">Objetivos</span><p class="prop-text">${escapeHtml(formatObjetivosValue(c.objectives))}</p></div>` : (c.objectives && typeof c.objectives === "string" ? `<div class="prop-row"><span class="prop-label">Objetivos</span><span>${escapeHtml(c.objectives)}</span></div>` : "")}
                ${c.pages ? `<div class="prop-row"><span class="prop-label">Páginas</span><span>${escapeHtml(c.pages)}</span></div>` : ""}
                ${Array.isArray(c.extras) && c.extras.length ? `<div class="prop-row prop-row-block"><span class="prop-label">Adicionales</span><p class="prop-text">${c.extras.map(e => escapeHtml(e.name + " — $" + Number(e.price).toLocaleString("es-AR"))).join("<br>")}</p></div>` : ""}
            `;
            presSection.style.display = "";
        } else {
            presSection.style.display = "none";
            presBody.innerHTML = "";
        }

        renderResenasEnModal(c.id);
    } else {
        modalTitle.textContent = "Nuevo cliente";
        cargarPlanEnModal(null);
        document.getElementById("estadoCliente").value = "seguimiento1";
        document.getElementById("propuestaInfoSection").style.display = "none";
        document.getElementById("propuestaInfoBody").innerHTML = "";
        document.getElementById("presupuestoInfoSection").style.display = "none";
        document.getElementById("presupuestoInfoBody").innerHTML = "";
        document.getElementById("resenasInfoSection").style.display = "none";
        document.getElementById("resenasInfoBody").innerHTML = "";
        modalTareas = {};
    }
    renderTareasChecklist();
    toggleTareasSection();
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

// --- Checklist de entrega ---
let modalTareas = {};

function toggleTareasSection() {
    const sel = document.getElementById("estadoCliente");
    const isClient = sel.value === "cliente";
    document.getElementById("tareasSection").style.display = isClient ? "" : "none";
    document.getElementById("hablarleElDiaField").style.display = isClient ? "none" : "";
    // La suscripción y la fecha de la seña dependen además de la modalidad.
    sincronizarModalidadModal();
}

function renderTareasChecklist() {
    const container = document.getElementById("tareasChecklist");
    container.innerHTML = TAREAS_CLIENTE.map(t => `
        <label class="checkbox-row${modalTareas[t.key] ? ' done' : ''}" data-tarea-key="${t.key}">
            <input type="checkbox" ${modalTareas[t.key] ? 'checked' : ''}>
            <span>${escapeHtml(t.label)}</span>
        </label>
    `).join("");

    container.querySelectorAll(".checkbox-row").forEach(row => {
        const input = row.querySelector("input");
        input.addEventListener("change", async () => {
            const key = row.dataset.tareaKey;
            modalTareas[key] = input.checked;
            row.classList.toggle("done", input.checked);

            const id = document.getElementById("clientId").value;
            if (id) {
                try {
                    await updateDoc(doc(db, "clientes", id), {
                        tareas: { ...modalTareas },
                        updatedAt: serverTimestamp()
                    });
                    const c = clients.find(x => x.id === id);
                    if (c) c.tareas = { ...modalTareas };
                } catch (err) {
                    console.error(err);
                    alert("Error al actualizar: " + err.message);
                }
            }
        });
    });
}

document.getElementById("estadoCliente").addEventListener("change", () => {
    syncEstadoSelect();
    toggleTareasSection();
});

// ── Plan y modalidad en el modal de cliente (plan anual o mensual desde el 19-sep-2026) ──
// Las opciones salen de PLANES: una sola fuente para los montos.
document.getElementById("planCliente").innerHTML = `<option value="">Sin definir</option>` + Object.values(PLANES)
    .map(p => `<option value="${escapeHtml(p.label)}">${escapeHtml(p.label)} · ${fmtMoney(p.unico)}/año o ${fmtMoney(p.mensual)}/mes</option>`)
    .join("");

// El precio que propone cada modalidad: el del plan anual o el pago único de la web propia.
function _precioSugerido(plan, modalidad) {
    return modalidad === "propia" ? plan.propia : plan.unico;
}

// Cambiar el plan propone el precio y la mensualidad: lo cobrado y un primer pago del modelo anterior no se tocan.
document.getElementById("planCliente").addEventListener("change", (e) => {
    const plan = PLANES[PLAN_POR_LABEL[e.target.value]];
    if (!plan) return;
    document.getElementById("valorTotal").value = _precioSugerido(plan, document.getElementById("modalidadCliente").value);
    document.getElementById("montoMensual").value = plan.mensual;
    sincronizarModalidadModal();
});
/* Pasar del plan anual a la web propia (o al revés) cambia el precio propuesto,
   salvo que ya se haya escrito otro a mano. */
document.getElementById("modalidadCliente").addEventListener("change", (e) => {
    const plan = PLANES[PLAN_POR_LABEL[document.getElementById("planCliente").value]];
    const precioEl = document.getElementById("valorTotal");
    const anterior = e.target.dataset.anterior || "";
    if (plan && _conSena(e.target.value) && (!precioEl.value || (_conSena(anterior) && Number(precioEl.value) === _precioSugerido(plan, anterior)))) {
        precioEl.value = _precioSugerido(plan, e.target.value);
    }
    e.target.dataset.anterior = e.target.value;
    sincronizarModalidadModal();
});
document.getElementById("valorTotal").addEventListener("input", sincronizarModalidadModal);
document.getElementById("abono").addEventListener("input", sincronizarModalidadModal);
document.getElementById("primerPagoAt").addEventListener("change", sincronizarDesdeAuto);

/* Muestra solo los campos de la modalidad elegida: plan anual o web propia
   (precio, cobrado y, en los clientes, la fecha de la seña; el plan anual suma
   el próximo cobro anual) o plan mensual (mensualidad y, en los clientes, la
   suscripción). "Sin definir" no muestra montos. */
function sincronizarModalidadModal() {
    const $ = id => document.getElementById(id);
    const modalidad = $("modalidadCliente").value;
    const esCliente = $("estadoCliente").value === "cliente";
    // El pago único anterior al plan anual (lo marca cargarPlanEnModal): sin cobro anual.
    const legado = modalidad === "unico" && $("renovacionField").dataset.legado === "1";
    $("pagoUnicoCampos").hidden = !_conSena(modalidad);
    $("valorTotalLabel").textContent = modalidad === "propia" || legado ? "Pago único" : "Precio por año";
    $("mensualCampos").hidden = modalidad !== "mensual";
    $("montoMensual").required = modalidad === "mensual";
    $("pagoUnicoSection").style.display = esCliente && _conSena(modalidad) ? "" : "none";
    $("renovacionField").hidden = modalidad !== "unico";
    $("suscripcionSection").style.display = esCliente && modalidad === "mensual" ? "" : "none";
    // Importes del modelo anterior (solo lectura): con seña se editan arriba.
    $("modeloAnteriorNota").hidden = _conSena(modalidad) || !$("modeloAnteriorNota").textContent;
    const precio = Number($("valorTotal").value) || 0;
    const cobrado = Number($("abono").value) || 0;
    const nota = $("pagoUnicoNota");
    const saldo = Math.max(0, precio - cobrado);
    nota.textContent = !precio ? ""
        : (saldo ? `Saldo pendiente: ${fmtMoney(saldo)}, se cobra al entregar.` : "Pagado.")
            + (modalidad === "unico" && !legado ? ` Después se cobran ${fmtMoney(precio)} cada año, sin suscripción.` : "");
    nota.hidden = !_conSena(modalidad) || !precio;
}

/* "El plan arranca el" sigue a la fecha del primer pago (+7 días) mientras no
   se la haya tocado a mano. Solo aplica a los clientes con primer pago del
   modelo anterior. */
function sincronizarDesdeAuto() {
    const pago = _fechaDeInput(document.getElementById("primerPagoAt").value);
    const desdeEl = document.getElementById("suscripcionDesde");
    const auto = pago ? mantDateKey(_sumarDias(pago, DIAS_HASTA_EL_PLAN)) : "";
    if (!desdeEl.value || desdeEl.value === desdeEl.dataset.auto) desdeEl.value = auto;
    desdeEl.dataset.auto = auto;
}

/* Carga el plan, la modalidad y sus campos en el modal. Muestra lo efectivo (lo
   guardado o, en los docs anteriores, lo que sale del boceto y del tipo de web):
   al guardar queda escrito en los campos de la modalidad elegida. En los clientes
   la modalidad es la elegida o la deducida de un doc anterior; en los prospectos,
   solo la elegida (en el doc o en su boceto). El primer pago y su fecha solo se
   muestran si el doc los trae (modelo anterior); si no, quedan ocultos y se
   guardan en 0 / null. */
function cargarPlanEnModal(c) {
    const $ = id => document.getElementById(id);
    const s = c ? suscripcionDe(c) : null;

    $("planCliente").value = s ? s.plan.label : "";
    if ($("planCliente").selectedIndex < 0) $("planCliente").value = "";

    $("modalidadCliente").value = !c ? "" : getEstado(c) === "cliente" ? modalidadDe(c) : (_modalidadElegida(c) || s.plan.modalidad);
    $("modalidadCliente").dataset.anterior = $("modalidadCliente").value;
    // Plan anual o web propia: lo guardado si el doc se cobra con seña; si no, el precio del plan
    // como sugerencia (un cliente "a cotizar" sin precio cargado queda vacío).
    const esUnico = !!c && _conSena(modalidadDe(c));
    $("valorTotal").value = !c || (esUnico && c.sinPrecio && !_num(c.valorTotal)) ? ""
        : (esUnico && _num(c.valorTotal)) || _precioSugerido(s.plan, $("modalidadCliente").value);
    $("abono").value = esUnico ? (_num(c.abono) || "") : "";
    const senaAt = esUnico ? mantToDate(c.senaAt) : null;
    const senaKey = senaAt ? mantDateKey(senaAt) : "";
    $("senaAt").value = senaKey;
    $("senaAt").dataset.original = senaKey;
    // Plan anual: el próximo cobro guardado o, si no, el que sale de la entrega (sugerido, no se guarda si no se toca).
    const r = c ? renovacionAnualDe(c) : null;
    const renovacionKey = r?.proximo ? mantDateKey(r.proximo) : "";
    $("renovacionAt").value = renovacionKey;
    $("renovacionAt").dataset.original = renovacionKey;
    $("renovacionField").dataset.legado = r?.legado ? "1" : "";
    $("renovacionLabel").textContent = r?.legado ? "Fin del mantenimiento incluido" : "Próximo cobro anual";
    const notaRenovacion = $("renovacionNota");
    notaRenovacion.textContent = r?.legado
        ? "Pago único anterior al plan anual (19-sep-2026): el primer año de mantenimiento va incluido y no tiene cobro anual. Si pasa al plan anual, poné la fecha de la seña del plan nuevo."
        : r?.ultimo
        ? `Último cobro anual: ${fmtMoney(_num(r.ultimo.monto))}${mantToDate(r.ultimo.at) ? ` el ${mantLongDate(mantToDate(r.ultimo.at))}` : ""}.`
        : (r && !r.proximo ? "Sin fecha: se cuenta un año desde la seña. Registrá la fecha de la seña." : "");
    notaRenovacion.hidden = !notaRenovacion.textContent;

    const conPrimerPago = !!(s && (s.primerPago || s.primerPagoAt));
    $("primerPagoField").hidden = !conPrimerPago;
    $("primerPagoAtField").hidden = !conPrimerPago;
    $("primerPago").value = conPrimerPago ? (s.primerPago || "") : "";
    $("montoMensual").value = s ? s.mensual : "";

    const pagoAt = s?.primerPagoAt ? mantDateKey(s.primerPagoAt) : "";
    $("primerPagoAt").value = pagoAt;
    $("primerPagoAt").dataset.original = pagoAt;

    const desdeGuardado = c ? mantToDate(c.suscripcionDesde) : null;
    const desdeKey = desdeGuardado ? mantDateKey(desdeGuardado) : "";
    const auto = s?.primerPagoAt ? mantDateKey(_sumarDias(s.primerPagoAt, DIAS_HASTA_EL_PLAN)) : "";
    $("suscripcionDesde").value = desdeKey || auto;
    $("suscripcionDesde").dataset.original = desdeKey;
    $("suscripcionDesde").dataset.auto = auto;

    $("estadoSuscripcion").value = s ? s.estado : "pendiente";
    $("preapprovalId").value = s ? s.preapprovalId : "";

    const notaMp = $("suscripcionNota");
    const notas = [];
    if (s?.mant) {
        const alta = mantToDate(s.mant.createdAt);
        const estadoMant = s.mant.estado || "activo";
        notas.push(`Figura en Mantenimiento (${s.mant.email || s.mant.whatsapp || s.mant.nombre || "Mercado Pago"})`
            + (alta ? `, suscripto desde el ${mantLongDate(alta)}` : "")
            + (estadoMant === "activo" ? "." : `, con estado "${estadoMant}".`));
    }
    // Aviso del webhook: la suscripción se canceló o se pausó en Mercado Pago.
    if (s?.aviso) {
        const fechaAviso = mantToDate(s.aviso.fechaBaja) || mantToDate(s.aviso.createdAt);
        notas.push(`${s.aviso.tipoEvento === "baja" ? "Canceló" : "Pausó"} la suscripción en Mercado Pago${fechaAviso ? ` el ${mantLongDate(fechaAviso)}` : ""}.`);
    }
    notaMp.textContent = notas.join(" ");
    notaMp.hidden = notas.length === 0;

    // Importes de un proyecto del modelo anterior: no se pisan y quedan a la vista como referencia.
    const notaAnterior = $("modeloAnteriorNota");
    const valorAnterior = c ? _num(c.valorTotal) : 0;
    if (valorAnterior && _num(c.abono) && valorAnterior !== _num(c.primerPago)) {
        notaAnterior.textContent = `Modelo anterior (solo lectura): valor total ${fmtMoney(valorAnterior)} · abonado ${fmtMoney(c.abono)}.`;
        notaAnterior.hidden = false;
    } else {
        notaAnterior.textContent = "";
        notaAnterior.hidden = true;
    }
}

document.getElementById("hablarleElDia").addEventListener("click", function () {
    try { this.showPicker(); } catch (e) {}
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("clientId").value;
    const actual = id ? clients.find(x => x.id === id) : null;
    const estadoCliente = document.getElementById("estadoCliente").value;
    const modalidad = document.getElementById("modalidadCliente").value;
    if (estadoCliente === "cliente" && !modalidad) {
        alert("Elegí la modalidad del cliente: plan anual, plan mensual o pago único de la web propia.");
        document.getElementById("modalidadCliente").focus();
        return;
    }
    const data = {
        nombre: document.getElementById("nombre").value.trim(),
        proyecto: document.getElementById("proyecto").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        email: document.getElementById("emailCliente").value.trim(),
        notas: document.getElementById("notasCliente").value.trim(),
        estadoCliente,
        hablarleElDia: document.getElementById("hablarleElDia").value || "",
        // ── Plan y modalidad (15-sep-2026): se escriben solo los campos de la modalidad elegida ──
        planLabel: document.getElementById("planCliente").value,
        modalidad,
        tareas: { ...modalTareas },
        updatedAt: serverTimestamp()
    };
    if (_conSena(modalidad)) {
        /* Plan anual o web propia: el precio, lo cobrado y la fecha de la seña. La
           fecha se escribe solo si cambió; una seña recién cargada y sin fecha queda
           con la de hoy. El próximo cobro anual, solo si se tocó: si no, sigue
           saliendo de la entrega. */
        data.valorTotal = Number(document.getElementById("valorTotal").value) || 0;
        data.abono = Number(document.getElementById("abono").value) || 0;
        const senaEl = document.getElementById("senaAt");
        const senaRegistrada = !!actual && _conSena(modalidadDe(actual)) && !!actual.senaAt;
        if (senaEl.value !== senaEl.dataset.original) data.senaAt = _fechaDeInput(senaEl.value);
        else if (data.abono && !senaEl.value && !senaRegistrada) data.senaAt = serverTimestamp();
        const renovacionEl = document.getElementById("renovacionAt");
        if (modalidad === "unico" && renovacionEl.value !== renovacionEl.dataset.original) data.renovacionAt = _fechaDeInput(renovacionEl.value);
    } else if (modalidad === "mensual") {
        // Servicio mensual. El primer pago solo está visible en los docs del modelo anterior.
        const primerPago = document.getElementById("primerPagoField").hidden
            ? 0
            : Number(document.getElementById("primerPago").value) || 0;
        data.primerPago = primerPago;
        data.montoMensual = Number(document.getElementById("montoMensual").value) || 0;
        data.estadoSuscripcion = document.getElementById("estadoSuscripcion").value || "pendiente";
        data.preapprovalId = document.getElementById("preapprovalId").value.trim();
        // Las fechas se escriben solo si cambiaron: así no se pisa la hora exacta con
        // que se registró el primer pago al pasar a Cliente.
        const pagoEl = document.getElementById("primerPagoAt");
        const desdeEl = document.getElementById("suscripcionDesde");
        const primerPagoAt = _fechaDeInput(pagoEl.value);
        if (!id || pagoEl.value !== pagoEl.dataset.original) data.primerPagoAt = primerPagoAt;
        if (!id || desdeEl.value !== desdeEl.dataset.original) {
            data.suscripcionDesde = _fechaDeInput(desdeEl.value)
                || (primerPagoAt ? _sumarDias(primerPagoAt, DIAS_HASTA_EL_PLAN) : null);
        }
        /* Campos viejos, por compatibilidad: en un cliente mensual `valorTotal` = primer
           pago y `abono` = lo cobrado de ese primer pago. Se siguen escribiendo mientras
           reflejen el primer pago, o cuando el doc pasa a Cliente ahora. Lo de un pago
           único no se pisa, salvo un precio que solo estaba cotizado (nada cobrado). */
        const pasaACliente = estadoCliente === "cliente" && (!actual || getEstado(actual) !== "cliente");
        const eraPagoUnico = !!actual && _conSena(modalidadDe(actual));
        const reflejaPrimerPago = campo => !actual || (eraPagoUnico
            ? _cotizacionSinCobro(actual)
            : pasaACliente || !_num(actual[campo]) || _num(actual[campo]) === _num(actual.primerPago));
        if (reflejaPrimerPago("valorTotal")) data.valorTotal = primerPago;
        if (reflejaPrimerPago("abono")) data.abono = primerPagoAt ? primerPago : 0;
    }

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
const propuestaForm      = document.getElementById("propuestaForm");
const propuestaModalTitle = document.getElementById("propuestaModalTitle");
const searchPropuestasInput = document.getElementById("searchPropuestas");

let propuestaDirty = false;
function tryClosePropuestaModal() {
    if (propuestaDirty && !confirm("Tenés cambios sin guardar. ¿Salir de todos modos?")) return;
    propuestaDirty = false;
    propuestaModal.hidden = true;
}

document.getElementById("closePropuestaModalBtn").addEventListener("click", tryClosePropuestaModal);

// --- Modal de imágenes ---
const imagesModal = document.getElementById("imagesModal");
document.getElementById("closeImagesModalBtn").addEventListener("click", () => { imagesModal.hidden = true; });
imagesModal.addEventListener("click", (e) => { if (e.target === imagesModal) imagesModal.hidden = true; });

function openImagesModal(images) {
    const title = document.getElementById("imagesModalTitle");
    const body  = document.getElementById("imagesModalBody");
    title.textContent = `Imágenes del boceto (${images.length})`;
    body.innerHTML = `
        <p class="muted" style="font-size:12px;margin-bottom:16px">Hacé clic en una imagen para descargarla.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px">
            ${images.map((url, i) => `
                <div style="cursor:pointer;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03)" onclick="downloadImageFromUrl('${escapeHtml(url)}','imagen-${i+1}')">
                    <img src="${escapeHtml(url)}" alt="Imagen ${i+1}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block">
                    <p style="font-size:11px;color:#60A5FA;text-align:center;margin:6px 0;font-weight:600">⬇ Descargar</p>
                </div>
            `).join('')}
        </div>
    `;
    imagesModal.hidden = false;
}
window.openImagesModal = openImagesModal;

async function downloadImageFromUrl(url, nombre) {
    try {
        const u = new URL(url);
        const filePath = u.pathname.replace(/^\//, '');
        const ext = filePath.includes('.') ? filePath.split('.').pop() : '';
        const nombreConExt = ext ? `${nombre}.${ext}` : nombre;
        await fetchProtectedFile(filePath, nombreConExt);
    } catch (err) {
        console.error(err);
        alert('No se pudo descargar la imagen.');
    }
}
window.downloadImageFromUrl = downloadImageFromUrl;
propuestaModal.addEventListener("click", (e) => { if (e.target === propuestaModal && !window.getSelection().toString().length) tryClosePropuestaModal(); });
searchPropuestasInput.addEventListener("input", renderPropuestas);

/* ── "Copiar carpetas": arma el prompt para crear, a mano o con un agente,
   una carpeta de imágenes por cada boceto que está visible en la lista
   (respeta la búsqueda y las fechas marcadas). Los nombres van slugificados
   con slugNegocio(), el mismo criterio que ya usa el link "Ver demo". */
document.getElementById("copyCarpetasBtn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    // Solo el nombre de carpeta: sin el modelo elegido pegado ni aparte, Pablo
    // no lo quiere en este texto (17-sep).
    const nombres = [...new Set(propuestasListaVisible
        .map(p => slugNegocio(getPropuestaNegocioFields(p).nombreNegocio))
        .filter(Boolean))];
    if (!nombres.length) {
        alert("Ningún boceto de la lista actual tiene nombre de negocio cargado.");
        return;
    }
    const texto = `Crea carpetas dentro de 'C:\\Users\\pablo\\OneDrive\\Escritorio\\Gokywebs\\Gokywebsweb\\demo', una por cada nombre de la lista, y agregale a cada una una subcarpeta 'images' adentro:\n\n${nombres.join("\n")}`;
    try {
        await writeTextToClipboard(texto);
        const prev = btn.textContent;
        btn.textContent = "✓ Copiado";
        setTimeout(() => { btn.textContent = prev; }, 1500);
    } catch (err) {
        console.error(err);
        alert("No se pudo copiar el prompt.");
    }
});

function getPropuestaTipoWeb(p) {
    if (!p) return "";
    if (Object.prototype.hasOwnProperty.call(p, "tipo_web")) {
        return cleanFieldValue(p.tipo_web);
    }
    return cleanFieldValue(p.tipoDetectadoLabel || p.tipoDetectado || "");
}

function modelosElegidosDe(src = {}) {
    const crudo = src.modelosElegidos ?? src.modelos_elegidos ?? [];
    let modelos = crudo;
    if (typeof crudo === "string") {
        try { modelos = JSON.parse(crudo || "[]"); } catch (_) { modelos = []; }
    }
    if (!Array.isArray(modelos)) return [];
    return modelos.map((m) => {
        if (typeof m === "string") return { id: m.toLowerCase(), letra: m.toUpperCase(), nombre: "" };
        if (!m || typeof m !== "object") return null;
        const id = cleanFieldValue(m.id || "").toLowerCase();
        const letra = cleanFieldValue(m.letra || id).toUpperCase();
        const nombre = cleanFieldValue(m.nombre || "");
        return letra || nombre ? { id, letra, nombre } : null;
    }).filter(Boolean).slice(0, 2);
}

function modelosElegidosTexto(src = {}) {
    return modelosElegidosDe(src)
        .map(m => `${m.letra ? `Modelo ${m.letra}` : "Modelo"}${m.nombre ? ` · ${m.nombre}` : ""}`)
        .join(" + ");
}

function modeloElegidoUrl(modelo = {}) {
    const id = cleanFieldValue(modelo.id || modelo.letra || "").toLowerCase();
    return id ? `https://gokywebs.com/modelos/ver.html?m=${encodeURIComponent(id)}` : "https://gokywebs.com/modelos/";
}

const MODELOS_CARPETA_LOCAL = String.raw`C:\Users\pablo\OneDrive\Escritorio\Gokywebs\Gokywebsweb\modelos`;

function modelosElegidosParaCopiar(src = {}) {
    return modelosElegidosDe(src).map(m => {
        const etiqueta = `${m.letra ? `Modelo ${m.letra}` : "Modelo"}${m.nombre ? ` · ${m.nombre}` : ""}`;
        const id = cleanFieldValue(m.id || m.letra || "").toLowerCase();
        return `${etiqueta}${id ? ` (id: ${id})` : ""}`;
    }).join("\n");
}

async function savePropuestaTipoWeb(input) {
    const id = input.dataset.propTypeId;
    const p = propuestas.find(x => x.id === id);
    if (!p) return;

    const original = input.dataset.original || "";
    const value = input.value.trim();
    input.value = value;
    if (value === original) return;

    const previousTipoWeb = p.tipo_web;
    const previousLabel = p.tipoDetectadoLabel;
    p.tipo_web = value;
    p.tipoDetectadoLabel = value;
    input.classList.add("saving");

    try {
        await updateDoc(doc(db, "propuestas", id), {
            tipo_web: value,
            tipoDetectadoLabel: value,
            updatedAt: serverTimestamp()
        });
        input.dataset.original = value;
        input.classList.remove("saving");
        input.classList.add("saved");
        setTimeout(() => input.classList.remove("saved"), 1000);
    } catch (err) {
        p.tipo_web = previousTipoWeb;
        p.tipoDetectadoLabel = previousLabel;
        input.value = original;
        input.classList.remove("saving");
        console.error(err);
        alert("No se pudo guardar el tipo de web.");
    }
}

/* Misma fuente de verdad que usa la columna "Fecha" de la tabla: si cambia acá,
   cambia en los dos lugares a la vez. Sin Timestamp (bocetos viejos, de antes
   de que existiera createdAt) se agrupa por el texto crudo de `fecha`, y sin
   ningún dato de fecha van todos juntos bajo "Sin fecha". */
// Los bocetos viejos que llegaron sin createdAt como Timestamp de Firestore
// igual guardan la hora adentro del string `fecha` ("18/8/2026, 09:05:00"),
// que es lo que ya se ve en el modal. Se rescata de ahí en vez de mostrarlos
// sin hora cuando el dato está ahí nomás, escrito distinto.
function horaDeFechaTexto(fecha) {
    const m = /,\s*(\d{1,2}):(\d{2})/.exec(fecha || "");
    return m ? m[1].padStart(2, "0") + ":" + m[2] : "";
}

function getPropuestaFechaInfo(p) {
    if (p.createdAt?.toDate) {
        const d = p.createdAt.toDate();
        // Hora a mano, no toLocaleTimeString con hour12:false: algunos
        // motores devuelven "24:00" en vez de "00:00" a medianoche.
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return {
            key: d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }),
            hora: hh + ":" + mm,
            sortMs: d.getTime(),
        };
    }
    if (p.fecha) return { key: p.fecha, hora: horaDeFechaTexto(p.fecha), sortMs: -Infinity };
    return { key: "Sin fecha", hora: "", sortMs: -Infinity };
}

// Fechas marcadas para filtrar Bocetos. Vive fuera de renderPropuestas() para
// no perderse en cada re-render (búsqueda, llegada de datos nuevos).
const fechasSeleccionadas = new Set();

function renderFechaChips() {
    const cont = document.getElementById("propFechaChips");
    if (!cont) return;

    const porFecha = new Map();
    for (const p of propuestas) {
        const { key, sortMs } = getPropuestaFechaInfo(p);
        const actual = porFecha.get(key);
        if (actual) actual.cuenta++;
        else porFecha.set(key, { cuenta: 1, sortMs });
    }

    // Una fecha marcada que ya no tiene ningún boceto (se borró el último, o
    // llegaron datos nuevos) deja de filtrar sola: no puede quedar un chip
    // fantasma activo escondiendo la lista entera.
    for (const key of [...fechasSeleccionadas]) {
        if (!porFecha.has(key)) fechasSeleccionadas.delete(key);
    }

    const fechas = [...porFecha.entries()].sort((a, b) => b[1].sortMs - a[1].sortMs);

    cont.innerHTML = fechas.map(([key, info]) => `
        <button type="button" class="fecha-chip${fechasSeleccionadas.has(key) ? ' active' : ''}" data-fecha-chip="${escapeHtml(key)}">
            ${escapeHtml(key)} <span class="seg-chip-count">${info.cuenta}</span>
        </button>
    `).join("");

    cont.querySelectorAll("[data-fecha-chip]").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.fechaChip;
            if (fechasSeleccionadas.has(key)) fechasSeleccionadas.delete(key);
            else fechasSeleccionadas.add(key);
            renderFechaChips();
            renderPropuestas();
        });
    });
}

function renderPropuestas() {
    const tbody = document.getElementById("propuestasTbody");
    const term  = searchPropuestasInput.value.trim().toLowerCase();
    const termPhone = cleanArgPhone(term);
    const baseList = fechasSeleccionadas.size
        ? propuestas.filter(p => fechasSeleccionadas.has(getPropuestaFechaInfo(p).key))
        : propuestas;
    const list  = term
        ? baseList.filter(p =>
            (p.nombre_negocio      || "").toLowerCase().includes(term) ||
            (p.negocio_rubro       || "").toLowerCase().includes(term) ||
            (p.rubro               || "").toLowerCase().includes(term) ||
            (p.email               || "").toLowerCase().includes(term) ||
            (p.tipo_web            || "").toLowerCase().includes(term) ||
            (p.tipoDetectado       || "").toLowerCase().includes(term) ||
            (p.tipoDetectadoLabel  || "").toLowerCase().includes(term) ||
            modelosElegidosTexto(p).toLowerCase().includes(term) ||
            (p.objetivo_web        || "").toLowerCase().includes(term) ||
            (p.adicionales_texto   || "").toLowerCase().includes(term) ||
            (p.productos_servicios || "").toLowerCase().includes(term) ||
            (p.secciones_web       || "").toLowerCase().includes(term) ||
            (p.seccion_otra        || "").toLowerCase().includes(term) ||
            (p.referencias         || "").toLowerCase().includes(term) ||
            (p.contacto_nombre     || "").toLowerCase().includes(term) ||
            (p.contacto_cel        || "").toLowerCase().includes(term) ||
            (p.telefono            || "").toLowerCase().includes(term) ||
            (termPhone && cleanArgPhone(p.telefono || p.contacto_cel).includes(termPhone)))
        : baseList;

    // La usa el botón "Copiar carpetas": arma la lista sobre lo que está
    // filtrado ahora mismo (búsqueda + fechas marcadas), no sobre todos los
    // bocetos que existen.
    propuestasListaVisible = list;

    if (list.length === 0) {
        const motivo = fechasSeleccionadas.size && term ? " para esa búsqueda en las fechas marcadas"
            : fechasSeleccionadas.size ? " en las fechas marcadas"
            : term ? " para esa búsqueda"
            : " recibidas aún";
        tbody.innerHTML = `<tr class="empty-row"><td colspan="9">No hay propuestas${motivo}.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(p => {
        const { key: fecha, hora } = getPropuestaFechaInfo(p);
        const coloresTexto = p.colores || p.colores_extra || "";
        const nombreNegocio = getPropuestaNegocioFields(p).nombreNegocio;
        const tipoWeb = getPropuestaTipoWeb(p);
        const modelos = modelosElegidosDe(p);
        const aviso = estadoAvisoBoceto(p);
        return `
            <tr class="client-row" data-row-prop-id="${p.id}" style="cursor:pointer">
                <td>
                    ${aviso?.vencido ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;margin-right:6px" title="No contestó el aviso de la mañana: pasaron más de 24hs"></span>` : ""}
                    ${escapeHtml(fecha)}
                    ${hora ? `<div class="muted" style="font-size:11px;margin-top:2px">${escapeHtml(hora)}</div>` : ""}
                </td>
                <td class="prop-col-marca">
                    ${nombreNegocio
                        ? `<button type="button" class="business-name-copy line-clamp-2" data-business-copy="${escapeHtml(nombreNegocio)}" title="Copiar en minúsculas y sin espacios">${escapeHtml(nombreNegocio)}</button>`
                        : `<strong>—</strong>`}
                    <span class="prop-origen-badge ${p.esProspecto ? 'prop-origen-badge--prospecto' : ''}">${p.esProspecto ? 'Prospecto · eligió avanzar' : 'Demo / boceto'}</span>
                    ${slugNegocio(nombreNegocio)
                        ? `<a href="https://gokywebs.com/demo/${encodeURIComponent(slugNegocio(nombreNegocio))}/" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="font-size:11px;padding:2px 7px;margin-top:4px;display:inline-block;text-decoration:none" title="Abrir gokywebs.com/demo/${escapeHtml(slugNegocio(nombreNegocio))}/ en otra pestaña">Ver demo ↗</a>`
                        : ""}
                    ${p.confirmoMuestra === false
                        ? `<div style="margin-top:5px"><span style="background:rgba(245,158,11,.13);color:#F59E0B;border:1px solid rgba(245,158,11,.4);border-radius:99px;padding:1px 8px;font-size:10px;font-weight:700;white-space:nowrap" title="Vio el precio pero no confirmó — priorizá los verdes">Solo vio precio</span></div>`
                        : ""}
                    ${Number(p.imagenes_recibidas || 0) > 0
                        ? `<div style="margin-top:5px"><span class="muted" style="font-size:11px" title="Cantidad de imágenes que mandó por WhatsApp/Instagram">📷 ${Number(p.imagenes_recibidas)}</span></div>`
                        : ""}
                </td>
                <td class="prop-col-contacto">
                    <div>${escapeHtml(p.nombre || p.contacto_nombre || "—")}</div>
                    ${(p.telefono || p.contacto_cel) ? `<span class="phone-copy" data-phone-copy="${escapeHtml(p.telefono || p.contacto_cel)}" title="Copiar número" style="cursor:pointer;font-size:12px;display:block">${escapeHtml(p.telefono || p.contacto_cel)}</span>` : ""}
                    ${(p.telefono || p.contacto_cel) ? `<button type="button" class="btn-ghost" data-chat-tel="${escapeHtml(p.telefono || p.contacto_cel)}" style="font-size:11px;padding:2px 7px;margin-top:4px" title="Abrir la conversación de WhatsApp/Instagram de este número sin salir de Bocetos">Ver chat</button>` : ""}
                    ${p.email ? `<div class="muted prop-contact-email" title="${escapeHtml(p.email)}">${escapeHtml(p.email)}</div>` : ""}
                </td>
                <td class="prop-col-tipo">
                    <input
                        type="text"
                        class="prop-type-input"
                        data-prop-type-id="${p.id}"
                        data-original="${escapeHtml(tipoWeb)}"
                        value="${escapeHtml(tipoWeb)}"
                        maxlength="100"
                        placeholder="Escribí el tipo"
                        aria-label="Tipo de web de ${escapeHtml(nombreNegocio || "este boceto")}"
                    >
                </td>
                <td class="prop-col-modelos">
                    ${modelos.length
                        ? `<div class="prop-modelos-lista">${modelos.map(m => `<span class="prop-modelo-chip">${escapeHtml(`${m.letra ? `Modelo ${m.letra}` : "Modelo"}${m.nombre ? ` · ${m.nombre}` : ""}`)}</span>`).join("")}</div>`
                        : `<span class="muted">—</span>`}
                </td>
                <td class="prop-col-colores">${escapeHtml(coloresTexto || "—")}</td>
                <td class="center">
                    ${p.logoUrl
                        ? `<button type="button" onclick="downloadImagenesCliente('${escapeHtml(p.logoUrl)}','${escapeHtml(slugNegocio(nombreNegocio) || '')}')" class="btn-ghost" style="font-size:12px;padding:4px 8px" title="Descargar todas las imágenes que mandó el cliente${Number(p.imagenes_recibidas || 0) > 1 ? ` (${Number(p.imagenes_recibidas)})` : ''}">Imágenes${Number(p.imagenes_recibidas || 0) > 1 ? ` (${Number(p.imagenes_recibidas)})` : ''}</button>`
                        : `<span class="muted" style="font-size:12px">—</span>`}
                </td>
                <td class="notes-col">
                    <div class="notes-cell" data-note-id="${p.id}">
                        <span class="notes-label${p.notas ? ' has-note' : ''}">${escapeHtml(p.notas || 'Agregar nota…')}</span>
                        <textarea class="notes-input" maxlength="500" rows="2" data-original="${escapeHtml(p.notas || '')}">${escapeHtml(p.notas || '')}</textarea>
                    </div>
                </td>
                <td class="actions-col">
                    <button class="btn-ghost" data-prop-copy="${p.id}" style="font-size:13px">Copiar</button>
                    <button class="btn-ghost btn-image-prompt${p.imgLanCopiado ? ' active' : ''}" data-prop-img6="${p.id}" style="font-size:13px" title="Copiar el pedido de 6 imágenes (1 en 9:16, 1 en 16:9 y 4 en 1:1) con la info de este boceto">Copiar 6</button>
                    <button class="btn-toggle-prop${p.bocetoHecho ? ' active' : ''}" data-prop-boceto="${p.id}" style="font-size:13px">Boceto hecho</button>
                    <button class="btn-presentada-prop" data-prop-presentada="${p.id}" style="font-size:13px">Presentar</button>
                    <button class="icon-btn" data-agenda-nombre="${escapeHtml(p.nombre || p.contacto_nombre || '')}" data-agenda-proyecto="${escapeHtml(p.nombre_negocio || p.rubro || '')}" title="Agregar al calendario">📅</button>
                    <button class="icon-btn delete" data-prop-del="${p.id}" title="Eliminar">🗑</button>
                </td>
            </tr>
        `;
    }).join("");

    tbody.querySelectorAll("[data-row-prop-id]").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest("button, input, textarea, .actions-col, .notes-col, .phone-copy")) return;
            if (window.getSelection().toString().length > 0) return;
            openPropuestaModal(row.dataset.rowPropId);
        });
    });
    tbody.querySelectorAll("[data-prop-copy]").forEach(btn => {
        btn.addEventListener("click", () => copyPropuesta(btn.dataset.propCopy, btn));
    });
    tbody.querySelectorAll("[data-prop-img6]").forEach(btn => {
        btn.addEventListener("click", () => copyPropuestaImagePrompt(btn.dataset.propImg6, btn));
    });
    tbody.querySelectorAll("[data-prop-type-id]").forEach(input => {
        input.addEventListener("pointerdown", (e) => e.stopPropagation());
        input.addEventListener("click", (e) => e.stopPropagation());
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                input.blur();
            }
            if (e.key === "Escape") {
                input.value = input.dataset.original || "";
                input.blur();
            }
        });
        input.addEventListener("blur", () => savePropuestaTipoWeb(input));
    });
    const lastBocetoPhone = localStorage.getItem("gkyLastBocetoPhone") || "";
    tbody.querySelectorAll("[data-phone-copy]").forEach(el => {
        if (lastBocetoPhone && cleanArgPhone(el.dataset.phoneCopy) === lastBocetoPhone) {
            el.classList.add("last-copied");
        }
        el.addEventListener("click", async () => {
            const phone = cleanArgPhone(el.dataset.phoneCopy);
            try {
                await writeTextToClipboard(phone);
                localStorage.setItem("gkyLastBocetoPhone", phone);
                tbody.querySelectorAll(".phone-copy.last-copied").forEach(item => item.classList.remove("last-copied"));
                el.classList.add("last-copied");
                const prev = el.textContent;
                el.textContent = "✓ Copiado";
                setTimeout(() => { el.textContent = prev; }, 1500);
            } catch (err) {
                console.error(err);
                alert("No se pudo copiar el número.");
            }
        });
    });
    tbody.querySelectorAll("[data-chat-tel]").forEach(btn => {
        btn.addEventListener("click", () => abrirChatModal(btn.dataset.chatTel));
    });
    tbody.querySelectorAll("[data-business-copy]").forEach(el => {
        el.addEventListener("click", async () => {
            const value = (el.dataset.businessCopy || "").toLocaleLowerCase("es-AR").replace(/\s+/g, "");
            if (!value) return;
            try {
                await writeTextToClipboard(value);
                const previous = el.textContent;
                el.textContent = "✓ Copiado";
                setTimeout(() => { el.textContent = previous; }, 1400);
            } catch (err) {
                console.error(err);
                alert("No se pudo copiar el nombre del negocio.");
            }
        });
    });
    tbody.querySelectorAll("[data-prop-boceto]").forEach(btn => {
        btn.addEventListener("click", () => togglePropuestaFlag(btn.dataset.propBoceto, "bocetoHecho", btn));
    });
    tbody.querySelectorAll("[data-prop-presentada]").forEach(btn => {
        btn.addEventListener("click", () => presentarPropuesta(btn.dataset.propPresentada));
    });
    tbody.querySelectorAll("[data-prop-del]").forEach(btn => {
        btn.addEventListener("click", () => removePropuesta(btn.dataset.propDel));
    });
    tbody.querySelectorAll("[data-agenda-nombre]").forEach(b =>
        b.addEventListener("click", () => openAddTareaModal(null, `${b.dataset.agendaNombre}${b.dataset.agendaProyecto ? ' · ' + b.dataset.agendaProyecto : ''}`)));
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
            const p = propuestas.find(x => x.id === cell.dataset.noteId);
            if (p) p.notas = val;
            await updateField(cell.dataset.noteId, "notas", val, "propuestas");
        });
    });
}

function getPropuestaNegocioFields(p = {}) {
    let nombreNegocio = cleanFieldValue(p.nombre_negocio || "");
    let rubro = cleanFieldValue(p.rubro || "");
    const combinado = cleanFieldValue(p.negocio_rubro || "");

    // Los registros viejos podían guardar "Marca — rubro" en los tres campos.
    const fuenteLegacy = combinado || (nombreNegocio === rubro ? nombreNegocio : "");
    const partes = fuenteLegacy.split(/\s+[—–|]\s+/).map(v => v.trim()).filter(Boolean);
    if (partes.length >= 2) {
        if (!nombreNegocio || nombreNegocio === rubro || nombreNegocio === combinado) {
            nombreNegocio = partes.shift();
        }
        if (!rubro || rubro === nombreNegocio || rubro === combinado || rubro === fuenteLegacy) {
            rubro = partes.join(" — ");
        }
    } else {
        if (!nombreNegocio && combinado) nombreNegocio = combinado;
        if (nombreNegocio && rubro === nombreNegocio) rubro = "";
    }

    return { nombreNegocio, rubro };
}

// Desde el 29-jul-2026 el form ya no pregunta "rubro", "productos" y
// "objetivo de la web" por separado: es un único campo de texto libre que se
// sigue guardando en `rubro`. Para bocetos viejos (o creados a mano desde
// "Nuevo boceto", que reutiliza productos_servicios con otro sentido —
// cantidad de productos, no descripción) esta función junta todo lo que haya
// en los tres campos para no perder información al mostrarlo.
function getPropuestaSobreNegocio(p = {}) {
    const { rubro } = getPropuestaNegocioFields(p);
    const partes = [
        rubro,
        cleanFieldValue(p.productos_servicios || p.productosServicios || ""),
        cleanFieldValue(p.objetivo_web || p.objetivoWeb || ""),
    ].filter(Boolean);
    // Evita repetir el mismo texto si algún registro viejo lo duplicó en más de un campo.
    return [...new Set(partes)].join(" · ");
}

function openPropuestaModal(id) {
    const p = propuestas.find(x => x.id === id);
    if (!p) return;
    const negocioFields = getPropuestaNegocioFields(p);
    propuestaModalTitle.textContent = negocioFields.nombreNegocio || "Propuesta";

    const cuantasImgs = Number(p.imagenes_recibidas || 0);
    const logoRow = p.logoUrl
        ? `<div class="prop-row"><span class="prop-label">Imágenes</span><span><button onclick="downloadImagenesCliente('${escapeHtml(p.logoUrl)}','${escapeHtml(slugNegocio(negocioFields.nombreNegocio) || '')}')" style="background:none;border:none;cursor:pointer;color:var(--accent-green);font-weight:600;padding:0">⬇ Descargar ${cuantasImgs > 1 ? `las ${cuantasImgs} imágenes` : 'la imagen'}</button> <span class="muted" style="font-size:11px">(${cuantasImgs > 1 ? 'en un zip, el logo primero' : escapeHtml(p.logoNombre || '')})</span></span></div>`
        : `<div class="prop-row"><span class="prop-label">Imágenes</span><span class="muted">No mandó ninguna</span></div>`;

    const objetivosTexto = getPropuestaObjetivosTexto(p);
    const adicionalesTexto = cleanFieldValue(p.adicionales_texto);

    // Dos modalidades (15-sep-2026): la calculadora, el alta manual y el bot escriben
    // precioUnico / sena / mensualidad / modalidad; los bocetos viejos del bot, solo el tipo.
    const linkedLead = p.presupuestoId ? leads.find(l => l.id === p.presupuestoId) : null;
    const plan = planDe(p, linkedLead);

    /* La calculadora de /presupuesto/ (origen:'presupuesto-modal') nunca pregunta
       ciudad, cantidad de cursos, fondos ni tipografías — a diferencia de /form/
       y del alta manual "+ Nuevo boceto", que sí los usan. Para no mostrar 4
       campos vacíos en cada boceto nuevo del calculador, se ocultan SOLO cuando
       el origen es la calculadora Y encima están vacíos (si alguna vez llegan a
       tener un valor cargado, igual se muestran — nunca se pisa un dato real). */
    const esPresupuestoModal = p.origen === "presupuesto-modal";
    const ciudadZona   = cleanFieldValue(p.ciudad_zona);
    const cantCursos   = cleanFieldValue(p.cant_cursos);
    const colorFondos  = cleanFieldValue(p.color_fondos);
    const tipografias  = cleanFieldValue(p.tipografias);
    const modelosElegidos = modelosElegidosDe(p);
    const showCiudad     = !esPresupuestoModal || ciudadZona;
    const showCantCursos = !esPresupuestoModal || cantCursos;
    const showFondos      = !esPresupuestoModal || colorFondos;
    const showTipografias = !esPresupuestoModal || tipografias;

    propuestaModalBody.innerHTML = `
        <label for="propNombreNegocio">Nombre del negocio / marca</label>
        <input type="text" id="propNombreNegocio" maxlength="160" value="${escapeHtml(negocioFields.nombreNegocio)}">

        <label for="propRubro">Sobre el negocio y qué quiere lograr con la web</label>
        <textarea id="propRubro" rows="4" maxlength="800" style="resize:vertical">${escapeHtml(getPropuestaSobreNegocio(p))}</textarea>

        <label for="propAdicionales">Adicionales elegidos</label>
        <textarea id="propAdicionales" rows="2" maxlength="500">${escapeHtml(adicionalesTexto)}</textarea>

        <label for="propTelefono">Teléfono / WhatsApp</label>
        <input type="text" id="propTelefono" maxlength="40" value="${escapeHtml(p.telefono || p.contacto_cel || "")}">

        ${showCiudad ? `
        <label for="propCiudadZona">Ciudad / zona</label>
        <input type="text" id="propCiudadZona" maxlength="120" value="${escapeHtml(ciudadZona)}">
        ` : ""}

        <label for="propTipoDetectado">Tipo de web detectado</label>
        <input type="text" id="propTipoDetectado" maxlength="100" value="${escapeHtml(getPropuestaTipoWeb(p))}">

        <div class="prop-row"><span class="prop-label">Modelos elegidos</span><span>${modelosElegidos.length
            ? `<span class="prop-modelos-links">${modelosElegidos.map(m => {
                const etiqueta = `${m.letra ? `Modelo ${m.letra}` : "Modelo"}${m.nombre ? ` · ${m.nombre}` : ""}`;
                return `<a class="prop-modelo-link" href="${modeloElegidoUrl(m)}" target="_blank" rel="noopener noreferrer">${escapeHtml(etiqueta)} ↗</a>`;
            }).join("")}</span>`
            : '<span class="muted">No eligió modelos</span>'}</span></div>

        <label for="propObjetivos">Objetivos seleccionados</label>
        <textarea id="propObjetivos" rows="2" maxlength="500">${escapeHtml(objetivosTexto)}</textarea>

        ${showCantCursos ? `
        <label for="propCantCursos">Cantidad de cursos (e-learning)</label>
        <input type="text" id="propCantCursos" maxlength="40" value="${escapeHtml(cantCursos)}">
        ` : ""}

        ${showFondos ? `
        <label for="propColorFondos">Fondos</label>
        <input type="text" id="propColorFondos" maxlength="120" value="${escapeHtml(colorFondos)}">
        ` : ""}

        <label for="propColorPrincipal">Color principal</label>
        <input type="text" id="propColorPrincipal" maxlength="120" value="${escapeHtml(cleanFieldValue(p.color_principal))}">

        <label for="propColorSecundario">Color secundario</label>
        <input type="text" id="propColorSecundario" maxlength="120" value="${escapeHtml(cleanFieldValue(p.color_secundario))}">

        ${showTipografias ? `
        <label for="propTipografias">Tipografías</label>
        <input type="text" id="propTipografias" maxlength="120" value="${escapeHtml(tipografias)}">
        ` : ""}

        <label for="propNotas">Notas internas</label>
        <textarea id="propNotas" rows="3" maxlength="500" placeholder="Notas internas (no visibles para el cliente)">${escapeHtml(p.notas || "")}</textarea>

        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#60A5FA;margin-bottom:8px">💰 Presupuesto</div>
        ${_planRowsHTML(plan)}
        ${cleanFieldValue(p.presupuesto_cotizado) ? `<div class="prop-row"><span class="prop-label">Cotizado por el bot</span><span>${escapeHtml(cleanFieldValue(p.presupuesto_cotizado))}</span></div>` : ""}
        ${p.catalogQty ? `<div class="prop-row"><span class="prop-label">Catálogo</span><span>${escapeHtml(PRESUPUESTO_CATALOGO_QTY_LABELS[p.catalogQty] || p.catalogQty)}</span></div>` : ""}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
        ${logoRow}
        <div class="prop-row muted" style="font-size:12px"><span class="prop-label">Fecha</span><span>${escapeHtml(p.fecha || "—")}</span></div>
    `;
    propuestaForm.dataset.propId = p.id;
    propuestaForm.dataset.copyObjectives = getPropuestaObjetivosTexto(p);
    propuestaDirty = false;
    propuestaModal.hidden = false;
    setTimeout(() => {
        propuestaForm.querySelectorAll("input, select, textarea").forEach(el => {
            el.addEventListener("input", () => { propuestaDirty = true; }, { once: false });
        });
    }, 0);
}

document.getElementById("cancelPropuestaBtn").addEventListener("click", tryClosePropuestaModal);

propuestaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = propuestaForm.dataset.propId;
    if (!id) return;

    const nombreNegocio = getInputValue("propNombreNegocio");
    const rubro = getInputValue("propRubro");
    const colorFondos = getInputValue("propColorFondos");
    const colorPrincipal = getInputValue("propColorPrincipal");
    const colorSecundario = getInputValue("propColorSecundario");
    const tipoWeb = getInputValue("propTipoDetectado");
    const colores = [
        colorFondos ? `Fondos: ${colorFondos}` : "",
        colorPrincipal ? `Color principal: ${colorPrincipal}` : "",
        colorSecundario ? `Color secundario: ${colorSecundario}` : "",
    ].filter(Boolean).join(" · ");

    const data = {
        telefono:            document.getElementById("propTelefono").value.trim(),
        nombre_negocio:      nombreNegocio,
        rubro,
        negocio_rubro:       [nombreNegocio, rubro].filter(Boolean).join(" — "),
        adicionales_texto:   getInputValue("propAdicionales"),
        tipo_web:            tipoWeb,
        tipoDetectadoLabel:  tipoWeb,
        tipoDetectado:       tipoWeb,
        objetivos:           document.getElementById("propObjetivos").value.trim(),
        colores,
        color_fondos:        colorFondos,
        color_principal:     colorPrincipal,
        color_secundario:    colorSecundario,
        notas:               document.getElementById("propNotas").value.trim(),
        updatedAt:           serverTimestamp()
    };
    // Ciudad/zona, cantidad de cursos y tipografías se ocultan en el modal para
    // los bocetos de la calculadora cuando están vacíos (ver openPropuestaModal)
    // — si el input no está en el DOM, no se toca ese campo al guardar (nunca
    // se lo pisa con "").
    if (document.getElementById("propCiudadZona"))  data.ciudad_zona = getInputValue("propCiudadZona");
    if (document.getElementById("propCantCursos"))  data.cant_cursos = getInputValue("propCantCursos");
    if (document.getElementById("propTipografias")) data.tipografias = getInputValue("propTipografias");

    /* El textarea "Sobre el negocio" se llena con getPropuestaSobreNegocio(), que
       FUSIONA rubro + productos_servicios + objetivo_web. Al guardar, ese texto
       combinado vuelve entero a `rubro`; si las otras dos fuentes quedan con su
       copia, la próxima apertura las vuelve a concatenar y el texto se duplica
       en CADA guardado (el Set solo deduplica strings idénticos, no fragmentos).
       Se vacían solo cuando su contenido ya quedó dentro de lo que se guarda,
       así nunca se pierde texto. */
    const original = propuestas.find(x => x.id === id) || {};
    const yaFusionado = (valor) => {
        const v = cleanFieldValue(valor || "");
        return v && rubro.includes(v);
    };
    if (yaFusionado(original.objetivo_web || original.objetivoWeb)) data.objetivo_web = "";
    if (yaFusionado(original.productos_servicios || original.productosServicios)) data.productos_servicios = "";

    const saveBtn = document.getElementById("savePropuestaBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";

    try {
        await updateDoc(doc(db, "propuestas", id), data);
        propuestaDirty = false;
        propuestaModal.hidden = true;
    } catch (err) {
        console.error(err);
        alert("Error al guardar: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Guardar cambios";
    }
});

function getPropuestaObjetivosTexto(p) {
    if (!p) return "";
    if (p.objetivos_texto) return cleanFieldValue(p.objetivos_texto);
    if (Array.isArray(p.objetivos) && p.objetivos.length) return formatObjetivosValue(p.objetivos);
    if (p.objetivos && typeof p.objetivos === "string") return cleanFieldValue(p.objetivos);
    if (Array.isArray(p.objectives) && p.objectives.length) return formatObjetivosValue(p.objectives);
    if (p.objectives && typeof p.objectives === "string") return cleanFieldValue(p.objectives);
    const linkedLead = p.presupuestoId ? leads.find(l => l.id === p.presupuestoId) : null;
    if (Array.isArray(linkedLead?.objectives) && linkedLead.objectives.length) return formatObjetivosValue(linkedLead.objectives);
    if (linkedLead?.objectives && typeof linkedLead.objectives === "string") return cleanFieldValue(linkedLead.objectives);
    return "";
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

const SLUG_ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u" };
function slugNegocio(nombre) {
    return String(nombre || "")
        .toLowerCase()
        .replace(/[áéíóúñü]/g, c => SLUG_ACENTOS[c] || c)
        .replace(/[^a-z0-9]/g, "");
}

/* Limpia solamente el texto que arma "Copiar"; chat_completo en Firestore no se
   toca. Se sacan dos bloques automáticos que no aportan al brief de diseño:
   - la invitación repetida a completar /form/;
   - la bajada comercial con los planes (plan anual y mensual; antes, pago único
     y suscripción).
   Si la cotización venía después de una descripción útil ("Lo mejor para..."), se
   conserva esa primera parte y se elimina desde el comienzo de los planes. */
function limpiarChatBoilerplate(chat) {
    if (!chat) return chat;
    const mensajes = chat.split(/(?=^\d{2}\/\d{2} \d{2}:\d{2} (?:Cliente|Bot|Vos): )/m);
    return mensajes
        .map(m => {
            const botMatch = m.match(/^(\d{2}\/\d{2} \d{2}:\d{2} Bot: )([\s\S]*)$/);
            if (!botMatch) return m;

            const [, encabezado, cuerpoOriginal] = botMatch;
            if (/gokywebs\.com\/form/i.test(cuerpoOriginal)) return "";

            const inicioPlanes = cuerpoOriginal.search(
                /(?:Ten[eé]s dos opciones para contratar el servicio|Lo pod[eé]s contratar de dos formas|Pod[eé]s contratarla de dos maneras|Pod[eé]s elegir entre dos planes)\s*[:,]?/i
            );
            if (inicioPlanes >= 0) {
                const descripcion = cuerpoOriginal.slice(0, inicioPlanes).trim();
                return descripcion ? `${encabezado}${descripcion}\n` : "";
            }

            const esCotizacion = /pago\s+[uú]nico|plan\s+anual/i.test(cuerpoOriginal)
                && /(?:suscripci[oó]n\s+mensual|plan\s+mensual|mensualidad|por\s+mes)/i.test(cuerpoOriginal);
            if (esCotizacion || /gokywebs\.com\/presupuestos\//i.test(cuerpoOriginal)) return "";

            return m;
        })
        .join("")
        .trim();
}

function getPropuestaCopyText(p, { conInstruccionesDemo = false } = {}) {
    const objetivosTexto = getPropuestaObjetivosTexto(p);
    const { nombreNegocio } = getPropuestaNegocioFields(p);
    const fondos = cleanFieldValue(p.color_fondos);
    const principal = cleanFieldValue(p.color_principal);
    const secundario = cleanFieldValue(p.color_secundario);
    const coloresLegacy = !fondos && !principal && !secundario
        ? cleanFieldValue(p.colores || p.colores_extra || "")
        : "";

    let prefijo = "";
    if (conInstruccionesDemo) {
        const tipoWeb = getPropuestaTipoWeb(p);
        const esComercioOCatalogo = /ecommerce|e-commerce|cat[aá]logo/i.test(tipoWeb);
        const slug = slugNegocio(nombreNegocio) || "[definir-nombre-del-negocio]";
        prefijo = [
            "Pedido de demo: armá la web completa para este negocio, siguiendo los prompts base de Gokywebs según el tipo de web.",
            `La carpeta del proyecto está en Gokywebsweb/demo/${slug}/, con su subcarpeta images/.`,
            esComercioOCatalogo
                ? "Buscá en internet un máximo de 10 imágenes coherentes con el negocio; 6 de esas 10 tienen que ser fotos de productos específicos."
                : "Buscá en internet un máximo de 10 imágenes coherentes con el negocio.",
        ].join("\n") + "\n\n";
    }

    // La charla completa va al final, después de los campos: primero lo
    // resumido (que es lo que se usa siempre) y abajo el respaldo textual.
    const chat = limpiarChatBoilerplate(cleanFieldValue(p.chat_completo || ""));
    const bloqueChat = chat
        ? `\n\nAcá está el chat con el cliente, por si algún dato del brief quedó corto:\n\n${chat}\n`
        : "";

    return prefijo + formatCopyRows([
        { title: "Nombre del negocio / marca", value: nombreNegocio },
        { title: "Sobre el negocio y qué quiere lograr con la web", value: getPropuestaSobreNegocio(p) },
        { title: "Adicionales elegidos", value: cleanFieldValue(p.adicionales_texto) },
        { title: "Teléfono / WhatsApp (número real para los wa.me del demo)", value: p.telefono || p.contacto_cel || "" },
        { title: "Tipo de web", value: getPropuestaTipoWeb(p) },
        { title: "Modelos elegidos", value: modelosElegidosParaCopiar(p) },
        { title: "Carpeta local de los modelos", value: modelosElegidosDe(p).length ? MODELOS_CARPETA_LOCAL : "" },
        { title: "Ciudad / zona", value: p.ciudad_zona || "" },
        { title: "Objetivos seleccionados", value: objetivosTexto },
        { title: "Cantidad de cursos", value: p.cant_cursos || "" },
        { title: "Imágenes que mandó por WhatsApp/Instagram", value: Number(p.imagenes_recibidas || 0) > 0 ? String(p.imagenes_recibidas) : "" },
        { title: "Color de fondos", value: fondos },
        { title: "Color principal", value: principal },
        { title: "Color secundario", value: secundario },
        { title: "Colores de marca", value: coloresLegacy },
        { title: "Tipografías", value: p.tipografias || "" },
    ]) + bloqueChat;
}

async function writeTextToClipboard(texto) {
    const value = String(texto ?? "");
    if (!value.trim()) throw new Error("No hay contenido para copiar.");

    if (navigator.clipboard?.writeText && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch (err) {
            console.warn("Clipboard API no disponible; se usa el método alternativo.", err);
        }
    }

    const temp = document.createElement("textarea");
    temp.value = value;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.top = "0";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();
    temp.setSelectionRange(0, temp.value.length);
    try {
        if (!document.execCommand("copy")) throw new Error("El navegador rechazó la copia.");
    } finally {
        temp.remove();
    }
}

// Links de suscripción de la pestaña Mantenimiento: "Copiar" deja el link listo para pegar.
document.getElementById("mantLinks")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-mant-link]");
    if (!btn) return;
    try {
        await writeTextToClipboard(btn.dataset.mantLink);
        btn.textContent = "Copiado";
        setTimeout(() => { btn.textContent = "Copiar"; }, 1400);
    } catch (err) {
        console.error(err);
        alert("No se pudo copiar el link.");
    }
});

async function copyPropuesta(id, btn) {
    const p = propuestas.find(x => x.id === id);
    if (!p) return;

    try {
        await writeTextToClipboard(getPropuestaCopyText(p, { conInstruccionesDemo: true }));
        if (btn) {
            const original = btn.textContent;
            btn.textContent = "Copiado";
            setTimeout(() => { btn.textContent = original; }, 1400);
        }
    } catch (err) {
        console.error(err);
        alert("No se pudo copiar el contenido.");
    }
}

// Un solo pedido de imágenes por boceto (Pablo, 20-sep): 6 imágenes, 1 en 9:16,
// 1 en 16:9 y 4 en 1:1, con la info del boceto al final.
const PROPUESTA_IMAGE_PROMPT = `Crea 6 imágenes, todas juntas y sin textos. 1 tamaño 9:16 y otra tamaño 16:9. 4 imágenes 1:1. Que todas las imágenes sean diferentes entre sí, para secciones diferentes. Si es ecommerce, que sean simplemente imágenes de distintos productos.

Van a ser utilizadas en un prediseño de una página web para:
{{DATOS_PROYECTO}}`;

async function copyPropuestaImagePrompt(id, btn) {
    const p = propuestas.find(x => x.id === id);
    if (!p) return;

    try {
        const texto = PROPUESTA_IMAGE_PROMPT.replace("{{DATOS_PROYECTO}}", getPropuestaCopyText(p));
        await writeTextToClipboard(texto);
        if (btn) {
            const original = btn.textContent;
            btn.textContent = "Copiado";
            setTimeout(() => { btn.textContent = original; }, 1400);
            btn.classList.add("active");
        }
        p.imgLanCopiado = true;
        await updateField(id, "imgLanCopiado", true, "propuestas");
    } catch (err) {
        console.error(err);
        alert("No se pudo copiar el pedido de imágenes.");
    }
}

async function copyPropuestaActual() {
    const texto = formatCopyRows([
        { title: "Nombre del negocio / marca", value: getInputValue("propNombreNegocio") },
        { title: "Sobre el negocio y qué quiere lograr con la web", value: getInputValue("propRubro") },
        { title: "Adicionales elegidos", value: getInputValue("propAdicionales") },
        { title: "Teléfono / WhatsApp (número real para los wa.me del demo)", value: getInputValue("propTelefono") },
        { title: "Tipo de web", value: getInputValue("propTipoDetectado") },
        { title: "Ciudad / zona", value: getInputValue("propCiudadZona") },
        { title: "Objetivos seleccionados", value: getInputValue("propObjetivos") },
        { title: "Cantidad de cursos", value: getInputValue("propCantCursos") },
        { title: "Color de fondos", value: getInputValue("propColorFondos") },
        { title: "Color principal", value: getInputValue("propColorPrincipal") },
        { title: "Color secundario", value: getInputValue("propColorSecundario") },
        { title: "Tipografías", value: getInputValue("propTipografias") },
    ]);

    try {
        await writeTextToClipboard(texto);
    } catch (err) {
        console.error(err);
        alert("No se pudo copiar el contenido.");
    }
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

    // Cliente con la web todavía sin entregar: el tacho abre "factura + entregada", como siempre.
    if (getEstado(c) === "cliente" && !webEntregada(c)) {
        abrirFacturaModal(c);
        return;
    }

    const conRegistro = c.completadoId && completados.some(x => x.id === c.completadoId);
    const mensaje = getEstado(c) === "cliente"
        ? `¿Eliminar a "${c.nombre}"? Sale de Mantenimiento.${conRegistro ? " El registro de la entrega queda en Completados." : ""}${_conSena(modalidadDe(c)) ? "" : `\n\nSi solo se dio de baja del plan, mejor editalo y poné la suscripción en "Baja".`}`
        : `¿Eliminar a "${c.nombre}"? Esta acción no se puede deshacer.`;
    if (!confirm(mensaje)) return;
    try {
        await deleteDoc(doc(db, "clientes", id));
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
}

/* Marcar la web como entregada. Con el plan mensual (10-sep-2026) entregar es
   cuando empieza a correr el plan, no el final de la relación: el cliente ya no
   se borra de `clientes`, se marca `entregadoAt` y sigue con su suscripción.
   Desde el 19-sep-2026 eso lo pasa del tab Clientes (webs en desarrollo) a
   Mantenimiento, al plan mensual o al anual. En `completados` queda una copia
   como registro de la entrega (y de la factura). */
async function completarCliente(id, factura) {
    const c = clients.find(x => x.id === id);
    if (!c) throw new Error("El cliente ya no está en la lista.");

    const { id: _id, ...clientData } = c;
    const completadoRef = doc(collection(db, "completados"));
    const clienteRef = doc(db, "clientes", id);
    const batch = writeBatch(db);

    batch.set(completadoRef, {
        ...clientData,
        clienteId: id,
        completadoAt: serverTimestamp(),
        ...(factura ? { factura } : {})
    });
    batch.update(clienteRef, {
        entregadoAt: serverTimestamp(),
        completadoId: completadoRef.id,
        updatedAt: serverTimestamp()
    });
    await batch.commit();
}

const facturaModal = document.getElementById("facturaModal");
let clienteAFacturar = null;
let facturaEsAdhoc = false;
let facturaRequestId = null;

const SIN_IDENTIFICAR = 99;
// Condicion frente al IVA que se propone segun el documento. Es solo el valor
// inicial del select: el admin siempre puede corregirlo.
const CONDICION_IVA_SUGERIDA = { 96: 5, 80: 1, 86: 5 };

// La mayoria de las facturas salen a consumidor final, asi que ese es el modo
// que abre por defecto; la otra pestaña pide los datos fiscales del receptor.
let facturaModo = "final";

function campoFactura(id) {
    return document.getElementById("factura" + id);
}

function fechaInput(desplazamientoDias = 0) {
    const d = new Date();
    d.setDate(d.getDate() + desplazamientoDias);
    return d.toISOString().slice(0, 10);
}

function llenarSelect(select, opciones, seleccionado) {
    select.replaceChildren(...opciones.map(o => {
        const option = document.createElement("option");
        option.value = String(o.valor);
        option.textContent = o.texto;
        return option;
    }));
    if (seleccionado !== undefined && seleccionado !== null) select.value = String(seleccionado);
}

function elegirModoFactura(modo) {
    facturaModo = modo;
    const identificado = modo === "identificado";
    campoFactura("ModoFinal").classList.toggle("active", !identificado);
    campoFactura("ModoFinal").setAttribute("aria-selected", String(!identificado));
    campoFactura("ModoIdentificado").classList.toggle("active", identificado);
    campoFactura("ModoIdentificado").setAttribute("aria-selected", String(identificado));
    campoFactura("PanelFinal").hidden = identificado;
    campoFactura("PanelIdentificado").hidden = !identificado;
}

function sincronizarCamposReceptor() {
    // El DNI son 8 digitos; CUIT y CUIL, 11 (mas los guiones que se pegan).
    campoFactura("Documento").maxLength = campoFactura("TipoDoc").value === "96" ? 10 : 13;
}

function sincronizarCamposPeriodo() {
    // Concepto 1 (productos) va sin periodo facturado ni vencimiento de pago.
    campoFactura("PeriodoCampos").hidden = campoFactura("Concepto").value === "1";
}

function generarRequestId() {
    return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

function etiquetaCliente(cliente) {
    const partes = [cliente.nombre, cliente.proyecto].filter(Boolean);
    if (partes.length === 2 && partes[0].trim().toLowerCase() === partes[1].trim().toLowerCase()) partes.pop();
    return partes.join(" · ");
}

function numeroComprobante(puntoVenta, numero) {
    return `Factura C ${String(puntoVenta).padStart(4, "0")}-${String(numero).padStart(8, "0")}`;
}

function mostrarErrorFactura(mensaje) {
    const el = document.getElementById("facturaError");
    el.textContent = mensaje;
    el.hidden = !mensaje;
}

function cerrarFacturaModal() {
    facturaModal.hidden = true;
    clienteAFacturar = null;
    facturaEsAdhoc = false;
    facturaRequestId = null;
}

async function llamarFacturacion(accion, cuerpo, extra = {}) {
    const token = currentUser ? await currentUser.getIdToken() : "";
    const opciones = { headers: { "Authorization": "Bearer " + token } };
    if (cuerpo) {
        opciones.method = "POST";
        opciones.headers["Content-Type"] = "application/json";
        opciones.body = JSON.stringify(cuerpo);
    }
    const params = new URLSearchParams({ accion, ...extra });
    const res = await fetch("/admin/api/facturar.php?" + params, opciones);
    const datos = await res.json().catch(() => null);
    if (!datos) throw new Error(`El servidor no respondió JSON (HTTP ${res.status})`);
    if (!datos.ok) throw new Error(datos.error || `HTTP ${res.status}`);
    return datos;
}

async function abrirComprobante(factura) {
    try {
        const token = currentUser ? await currentUser.getIdToken() : "";
        const res = await fetch("/admin/api/comprobante.php", {
            method: "POST",
            headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
            body: JSON.stringify({ factura })
        });
        if (!res.ok) {
            const cuerpo = await res.text();
            let detalle = cuerpo;
            try { detalle = JSON.parse(cuerpo).error || cuerpo; } catch (e) {}
            throw new Error(detalle);
        }

        const nombre = res.headers.get("X-Nombre-Archivo")
            || `Factura C ${numeroComprobante(factura.puntoVenta, factura.numero).replace("Factura C ", "")}.pdf`;
        const url = URL.createObjectURL(await res.blob());
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombre;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
        console.error(err);
        alert("No se pudo generar el comprobante: " + err.message);
    }
}

async function abrirFacturaModal(cliente, opts = {}) {
    clienteAFacturar = cliente;
    facturaEsAdhoc = !!opts.adhoc;
    facturaRequestId = generarRequestId();

    document.getElementById("facturaModalTitulo").textContent =
        facturaEsAdhoc ? "Emitir factura" : "Emitir factura y marcar entregada";
    document.getElementById("facturaCliente").textContent = etiquetaCliente(cliente);
    /* Al entregar se propone lo cobrado al arrancar (15-sep-2026). Plan anual o web
       propia: lo cobrado o, si no se registró, la seña del plan. Plan mensual: vacío
       para cargar el importe, salvo el primer pago de un cliente del modelo del 10 al
       14-sep-2026. */
    const modalidadFactura = modalidadDe(cliente);
    campoFactura("Total").value = facturaEsAdhoc ? ""
        : _conSena(modalidadFactura) ? (_num(cliente.abono) || planDe(cliente, propuestaDeCliente(cliente)).sena)
        : (_num(cliente.primerPago) || "");
    campoFactura("Comprobante").textContent = "Consultando a ARCA…";
    campoFactura("EntornoAviso").hidden = true;
    campoFactura("EmitirBtn").disabled = true;
    campoFactura("SinFacturarBtn").hidden = facturaEsAdhoc;

    campoFactura("Concepto").value = "2";
    campoFactura("Desde").value = fechaInput(-30);
    campoFactura("Hasta").value = fechaInput();
    campoFactura("Vencimiento").value = fechaInput();
    campoFactura("Descripcion").value = "";
    campoFactura("Documento").value = "";
    campoFactura("Nombre").value = "";
    llenarSelect(campoFactura("TipoDoc"), [{ valor: 80, texto: "CUIT" }]);
    llenarSelect(campoFactura("CondicionVenta"), [{ valor: "Contado", texto: "Contado" }]);
    llenarSelect(campoFactura("CondicionIva"), []);
    elegirModoFactura("final");
    sincronizarCamposPeriodo();
    sincronizarCamposReceptor();

    mostrarErrorFactura("");
    facturaModal.hidden = false;
    if (facturaEsAdhoc) campoFactura("Total").focus();

    try {
        const datos = await llamarFacturacion("proximo", null, { clienteId: cliente.id });
        if (!clienteAFacturar || clienteAFacturar.id !== cliente.id) return;

        campoFactura("Comprobante").textContent = numeroComprobante(datos.puntoVenta, datos.proximoNumero);
        campoFactura("EmitirBtn").disabled = false;

        // "Sin identificar" es la otra pestaña, no una opcion del select.
        llenarSelect(
            campoFactura("TipoDoc"),
            Object.entries(datos.tiposDocumento || {})
                .filter(([valor]) => Number(valor) !== SIN_IDENTIFICAR)
                .map(([valor, texto]) => ({ valor, texto })),
            80
        );
        llenarSelect(
            campoFactura("CondicionVenta"),
            (datos.condicionesVenta || ["Contado"]).map(c => ({ valor: c, texto: c })),
            "Contado"
        );
        llenarSelect(
            campoFactura("CondicionIva"),
            (datos.condicionesIva || []).map(c => ({ valor: c.id, texto: c.descripcion }))
        );

        campoFactura("Descripcion").value = datos.descripcionSugerida || "";

        // Si a este cliente ya se le facturo con datos fiscales, se reabre en esa
        // pestaña con todo cargado; si no, queda en consumidor final.
        const previo = datos.ultimoReceptor;
        if (previo && previo.tipoDocumento !== SIN_IDENTIFICAR) {
            campoFactura("TipoDoc").value = String(previo.tipoDocumento);
            campoFactura("Documento").value = previo.numeroDocumento;
            campoFactura("CondicionIva").value = String(previo.condicionIvaId);
            campoFactura("Nombre").value = previo.nombre || "";
            elegirModoFactura("identificado");
        } else {
            campoFactura("Nombre").value = cliente.nombre || "";
        }
        sincronizarCamposReceptor();

        if (datos.entorno !== "produccion") {
            const aviso = campoFactura("EntornoAviso");
            aviso.textContent = "Entorno de prueba (homologación): la factura NO tiene validez fiscal.";
            aviso.hidden = false;
        }
    } catch (err) {
        if (!clienteAFacturar || clienteAFacturar.id !== cliente.id) return;
        campoFactura("Comprobante").textContent = "—";
        mostrarErrorFactura("No se pudo consultar el próximo número: " + err.message);
    }
}

campoFactura("ModoFinal")?.addEventListener("click", () => elegirModoFactura("final"));
campoFactura("ModoIdentificado")?.addEventListener("click", () => elegirModoFactura("identificado"));
campoFactura("Concepto")?.addEventListener("change", sincronizarCamposPeriodo);
campoFactura("TipoDoc")?.addEventListener("change", () => {
    sincronizarCamposReceptor();
    const sugerida = CONDICION_IVA_SUGERIDA[campoFactura("TipoDoc").value];
    const select = campoFactura("CondicionIva");
    if (sugerida && [...select.options].some(o => o.value === String(sugerida))) {
        select.value = String(sugerida);
    }
});

document.getElementById("facturaEmitirBtn")?.addEventListener("click", async () => {
    if (!clienteAFacturar) return;
    const cliente = clienteAFacturar;
    const boton = document.getElementById("facturaEmitirBtn");
    const total = parseFloat(document.getElementById("facturaTotal").value);

    if (!(total > 0)) {
        mostrarErrorFactura("El importe tiene que ser mayor a cero.");
        return;
    }

    mostrarErrorFactura("");
    boton.disabled = true;
    boton.textContent = "Emitiendo…";

    try {
        const datos = await llamarFacturacion("emitir", {
            requestId: facturaRequestId,
            clienteId: cliente.id,
            cliente: etiquetaCliente(cliente),
            total,
            concepto: Number(campoFactura("Concepto").value),
            descripcion: campoFactura("Descripcion").value,
            condicionVenta: campoFactura("CondicionVenta").value,
            servicioDesde: campoFactura("Desde").value,
            servicioHasta: campoFactura("Hasta").value,
            vencimientoPago: campoFactura("Vencimiento").value,
            ...(facturaModo === "identificado"
                ? {
                    tipoDocumento: Number(campoFactura("TipoDoc").value),
                    documento: campoFactura("Documento").value,
                    condicionIva: Number(campoFactura("CondicionIva").value),
                    nombre: campoFactura("Nombre").value
                }
                : { tipoDocumento: SIN_IDENTIFICAR, documento: "" })
        });
        const f = datos.factura;
        if (!facturaEsAdhoc) await completarCliente(cliente.id, f);
        cerrarFacturaModal();
        if (f.observaciones) {
            alert(
                `${numeroComprobante(f.puntoVenta, f.numero)} emitida, pero ARCA devolvió observaciones:\n\n` +
                f.observaciones
            );
        }
        await abrirComprobante(f);
    } catch (err) {
        console.error(err);
        mostrarErrorFactura(err.message);
    } finally {
        boton.disabled = false;
        boton.textContent = "Emitir factura";
    }
});

document.getElementById("facturaSinFacturarBtn")?.addEventListener("click", async () => {
    if (!clienteAFacturar) return;
    const cliente = clienteAFacturar;
    if (!confirm(`Marcar la web de "${cliente.nombre}" como entregada sin emitir factura? Sigue en Clientes (con su plan) y queda el registro en Completados.`)) return;
    try {
        await completarCliente(cliente.id, null);
        cerrarFacturaModal();
    } catch (err) {
        console.error(err);
        mostrarErrorFactura(err.message);
    }
});

document.getElementById("facturaCancelarBtn")?.addEventListener("click", cerrarFacturaModal);
document.getElementById("closeFacturaModalBtn")?.addEventListener("click", cerrarFacturaModal);
facturaModal?.addEventListener("click", (e) => {
    if (e.target === facturaModal && !window.getSelection().toString().length) cerrarFacturaModal();
});

// --- Marcar Boceto hecho (solo visual) ---
async function togglePropuestaFlag(id, field, btn) {
    const p = propuestas.find(x => x.id === id);
    if (!p) return;
    const newVal = !p[field];
    p[field] = newVal;
    btn.classList.toggle("active", newVal);
    await updateField(id, field, newVal, "propuestas");
}

// --- Presentar (propuesta → cliente en Seguimiento 1) ---
// Al presentar, wabot manda por WhatsApp los dos mensajes de la demo (link +
// pedido de feedback) y registra el estado (fase, timestamps, CRM). Si el
// envío falla (p. ej. la ventana de 24h de Meta ya cerró), la respuesta trae
// enviado:false y hay que mandarla vos a mano por tu número personal.
// Ver wabot/admin.php (presentar_muestra). clienteId viaja para que wabot
// pueda avisarle después al admin (chat archivado) sobre este mismo cliente:
// ver sincronizarPresentados().
async function enviarMuestraWhatsapp(p, clienteId) {
    const telefono = p.telefono || p.contacto_cel || "";
    const negocio  = p.nombre_negocio || p.rubro || "";
    if (!telefono || !negocio) return { error: "Falta teléfono o nombre del negocio: avisale la muestra a mano." };

    try {
        await wabotAuthHandshake();
        const cuerpo = { accion: "presentar_muestra", tel: telefono, negocio, cliente_id: clienteId || "" };
        const res = await fetch("../wabot/admin.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(cuerpo),
            credentials: "same-origin"
        });
        return await res.json();
    } catch (e) {
        return { error: "No se pudo contactar al panel del bot: " + e.message };
    }
}

async function presentarPropuesta(propId) {
    const p = propuestas.find(x => x.id === propId);
    if (!p) return;
    if (!confirm(`Pasar "${p.nombre_negocio || "este boceto"}" a Seguimiento?`)) return;

    const linkedLead = p.presupuestoId ? leads.find(l => l.id === p.presupuestoId) : null;
    // Plan cotizado (dos modalidades, 15-sep-2026): el del boceto o, si no lo trae, el del tipo de web.
    const plan = planDe(p, linkedLead);

    const en72Horas = new Date();
    en72Horas.setDate(en72Horas.getDate() + 3);
    const hablarleElDia = en72Horas.toISOString().split("T")[0];

    // Snapshot completo del boceto: como acto seguido borramos la propuesta original,
    // esta es la única copia que queda. Guardar TODO evita perder campos (rubro,
    // instagram, ciudad, cant_cursos…) que antes no se copiaban de a uno.
    const { id: _omitId, ...propuestaSnapshot } = p;

    // El id se genera antes de escribir para poder pasárselo a wabot: así la
    // confirmación a las 48h y el archivo por inactividad saben a qué cliente avisarle.
    const clienteRef = doc(collection(db, "clientes"));

    // No bloquear el pase a Seguimiento por un fallo del bot (sin teléfono,
    // sin nombre de negocio, wabot caído, Meta rechazó el envío...): hasta el
    // 25-ago-2026 había una opción "pasarla igual" y se sacó al simplificar el
    // flujo de presentar — desde entonces CUALQUIER error acá dejaba el boceto
    // trabado para siempre, sin forma de avanzarlo ("no pasa a Seguimiento").
    // Se pregunta en vez de asumir, y si Pablo confirma, el cliente se crea
    // igual: el link se lo manda él a mano.
    const envio = await enviarMuestraWhatsapp(p, clienteRef.id);
    if (envio?.error) {
        const seguirIgual = confirm(
            "No se le pudo avisar al bot / mandar el link por WhatsApp:\n\n" + envio.error +
            "\n\n¿Pasarla a Seguimiento igual? El cliente NO recibe nada automático: mandale vos el link a mano."
        );
        if (!seguirIgual) return;
    } else if (envio) {
        const link = envio.slug ? "gokywebs.com/demo/" + envio.slug : "";
        if (envio.sin_chat) {
            alert("Quedó en Seguimiento. Mandale vos el link por WhatsApp desde tu número"
                + (link ? ":\n" + link : ".")
                + "\n\nEste cliente no tiene conversación con el bot, así que el bot no lo va a seguir: el seguimiento corre por tu cuenta.");
        } else if (envio.enviado) {
            // Los leads de Instagram reciben la demo por DM, no por WhatsApp:
            // decir siempre "por WhatsApp" mandaba a Pablo a mirar el chat
            // equivocado (28-ago).
            const porDonde = envio.canal === "instagram" ? "por Instagram" : "por WhatsApp";
            alert("Quedó en Seguimiento. El bot ya le mandó la demo " + porDonde + ", no hace falta que le escribas vos.");
        } else if (envio.demo_ok) {
            // El mensaje con el link SÍ salió; falló el segundo, que solo pide
            // el feedback. Mandar la demo de nuevo sería duplicarla.
            alert("Quedó en Seguimiento. El link de la demo SÍ le llegó, así que no se la vuelvas a mandar."
                + "\n\nLo que no salió fue el segundo mensaje, el que le pide que te cuente qué le pareció."
                + " Si querés, escribíselo vos por el chat del bot.");
        } else {
            // Ojo: el envío corta a los 20 s, así que un timeout con Meta lenta
            // se ve igual que un fallo real aunque el mensaje haya salido. Por
            // eso primero se mira el chat y recién después se reenvía.
            alert("Quedó en Seguimiento, pero el bot no pudo confirmar el envío de la demo"
                + " (puede ser que la ventana de 24h ya cerró, o que Meta tardó en responder)."
                + "\n\nFijate en el chat del bot si el mensaje llegó. Si no está, mandásela vos desde tu número"
                + (link ? ":\n" + link : ".")
                + "\n\nMientras no conste como enviada por el bot, tampoco se le manda la plantilla de seguimiento de las 48h.");
        }
    }

    try {
        await setDoc(clienteRef, {
            nombre:          p.nombre || p.contacto_nombre || p.nombre_negocio || "",
            proyecto:        p.nombre_negocio || p.rubro || getPropuestaTipoWeb(p) || "",
            telefono:        p.telefono || p.contacto_cel || "",
            estadoCliente:   "seguimiento1",
            hablarleElDia,
            // ── Plan y modalidad (15-sep-2026): la que eligió en el boceto o "" si todavía no eligió ──
            planLabel:         plan.label,
            modalidad:         plan.modalidad,
            // Plan mensual: sin pago inicial, arranca cuando se suscribe en Mercado Pago.
            primerPago:        0,
            primerPagoAt:      null,
            montoMensual:      plan.mensual,
            estadoSuscripcion: "pendiente",
            suscripcionDesde:  null,
            preapprovalId:     "",
            // Plan anual o web propia: el precio se fija y la seña se registra al pasar a Cliente
            // (hasta entonces el precio cotizado sale del boceto guardado en propuestaSnapshot).
            valorTotal:      0,
            abono:           0,
            notas:           "",
            // ── Brief original completo (fuente de verdad para la vista de detalle) ──
            propuestaSnapshot,
            // ── Campos sueltos: los siguen usando las tablas y quedan por compatibilidad ──
            propuestaId:     propId,
            propuestaFecha:  p.fecha || "",
            contactoNombre:  p.nombre || p.contacto_nombre || "",
            email:           p.email || "",
            tipoDetectado:   p.tipoDetectado || "",
            tipoDetectadoLabel: p.tipoDetectadoLabel || "",
            objetivos:       getPropuestaObjetivosTexto(p),
            tipoPagina:      p.tipo_pagina || "",
            rubro:           getPropuestaNegocioFields(p).rubro || "",
            instagram:       p.instagram || "",
            ciudadZona:      p.ciudad_zona || "",
            cantCursos:      p.cant_cursos || "",
            precioTotal:     p.precioTotal || 0,
            sena:            p.sena || 0,
            saldo:           p.saldo || 0,
            sinPrecio:       !!p.sinPrecio,
            catalogQty:      p.catalogQty || "",
            colores:         p.colores || p.colores_extra || "",
            colorFondos:     p.color_fondos || "",
            colorPrincipal:  p.color_principal || "",
            colorSecundario: p.color_secundario || "",
            tipografias:     p.tipografias || "",
            referencias:     p.referencias || "",
            productosServicios: p.productos_servicios || "",
            objetivoWeb:     p.objetivo_web || "",
            logoUrl:         p.logoUrl || "",
            logoNombre:      p.logoNombre || "",
            extra:           p.extra || "",
            // ── Datos del presupuesto vinculado ──
            presupuestoId:   p.presupuestoId || null,
            siteType:        linkedLead?.siteType || "",
            businessType:    linkedLead?.businessType || "",
            functionalities: linkedLead?.functionalities || [],
            objectives:      linkedLead?.objectives || [],
            pages:           linkedLead?.pages || "",
            extras:          linkedLead?.extras || [],
            extrasPrice:     linkedLead?.extrasPrice || 0,
            basePrice:       linkedLead?.basePrice || 0,
            createdAt:      serverTimestamp(),
            createdBy:      currentUser?.uid || null
        });
        await deleteDoc(doc(db, "propuestas", propId));
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
}

// --- Presupuestos ---
const presupuestoModal      = document.getElementById("presupuestoModal");
const presupuestoModalBody  = document.getElementById("presupuestoModalBody");
const presupuestoModalTitle = document.getElementById("presupuestoModalTitle");
const searchPresupuestosInput = document.getElementById("searchPresupuestos");

document.getElementById("closePresupuestoModalBtn").addEventListener("click", () => { presupuestoModal.hidden = true; });
presupuestoModal.addEventListener("click", (e) => { if (e.target === presupuestoModal && !window.getSelection().toString().length) presupuestoModal.hidden = true; });
searchPresupuestosInput.addEventListener("input", renderPresupuestos);

/* Qué pagó un doc de `presupuestos` con paymentStatus (15-sep-2026): la seña del pago
   único, salvo que haya elegido el servicio mensual (la vuelta de la suscripción también
   pasa por /presupuesto/exito.html). Los docs anteriores al contrato con primerPago o
   mensualidad son del servicio mensual: el primer pago del 10 al 14-sep-2026 o la
   suscripción del 14-sep. Los de antes del 10-sep (solo `sena`) pagaron una seña. */
function _pagoDePresupuesto(p, plan = planDe(p)) {
    const mensualAnterior = !_docConModalidad(p) && (_num(p.primerPago) > 0 || _num(p.mensualidad) > 0);
    const modalidad = _modalidadElegida(p) || (mensualAnterior ? "mensual" : "unico");
    const primerPago = modalidad === "mensual" ? _num(p.primerPago) : 0;
    const sena = modalidad === "unico" ? (_num(p.sena) || plan.sena) : 0;
    return { modalidad, primerPago, sena, mensual: plan.mensual };
}

function renderPresupuestos() {
    const tbody = document.getElementById("presupuestosTbody");
    const term  = searchPresupuestosInput.value.trim().toLowerCase();
    // Solo los que pagaron por Mercado Pago (la seña o la suscripción) → SIEMPRE tienen paymentStatus
    // Leads y docs basura nunca tienen paymentStatus → quedan automáticamente excluidos
    const senados = presupuestos.filter(p => p.paymentStatus);
    const list  = term
        ? senados.filter(p =>
            (p.nombre       || "").toLowerCase().includes(term) ||
            (p.negocio      || "").toLowerCase().includes(term) ||
            (p.businessType || "").toLowerCase().includes(term) ||
            (p.siteType     || "").toLowerCase().includes(term) ||
            (p.email        || "").toLowerCase().includes(term))
        : senados;

    if (list.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No hay presupuestos${term ? " para esa búsqueda" : " registrados aún"}.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(p => {
        const fecha = p.createdAt?.toDate
            ? p.createdAt.toDate().toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit", year:"numeric" })
            : "—";
        const typeLabel = TYPE_LABELS[p.siteType] || p.siteType || "—";
        const plan = planDe(p);
        const aprobado = p.paymentStatus === "approved";
        const pago = aprobado ? _pagoDePresupuesto(p, plan) : null;
        const pagoBadge = !aprobado
            ? `<span style="color:#F59E0B;font-weight:600">⏳ Pendiente</span>`
            : `<span style="color:#4ade80;font-weight:700">✓ ${pago.sena ? `seña ${fmtMoney(pago.sena)}` : pago.primerPago ? fmtMoney(pago.primerPago) : `${fmtMoney(pago.mensual)}/mes`}</span>`;
        const briefBadge = p.briefCompleted
            ? `<span style="color:#4ade80;font-weight:700">✓ Recibido</span>`
            : `<span style="color:#9CA3AF">—</span>`;

        return `
            <tr class="client-row" data-row-pres-id="${p.id}" style="cursor:pointer">
                <td>${escapeHtml(fecha)}</td>
                <td>
                    <div style="font-weight:600">${escapeHtml(p.nombre || "—")}</div>
                    <div class="muted" style="font-size:12px">${escapeHtml(p.email || "")}</div>
                </td>
                <td>
                    <div>${escapeHtml(p.negocio || "—")}</div>
                    <div class="muted" style="font-size:12px">${escapeHtml(p.businessType || "")}</div>
                </td>
                <td>${escapeHtml(typeLabel)}</td>
                <td>
                    <div>${escapeHtml(plan.label || "Sin definir")}</div>
                    <div class="muted" style="font-size:12px;white-space:nowrap">${_planMontosTexto(plan, pago?.modalidad || plan.modalidad)}</div>
                </td>
                <td class="center">${pagoBadge}</td>
                <td class="center">${briefBadge}</td>
                <td class="actions-col">
                    <button class="btn-ghost" data-pres-id="${p.id}" style="font-size:13px">Ver →</button>
                    <button class="btn-presentada-prop" data-pres-to-client="${p.id}" style="font-size:13px">→ Cliente</button>
                    <button class="icon-btn delete" data-pres-del="${p.id}" title="Eliminar">🗑</button>
                </td>
            </tr>`;
    }).join("");

    tbody.querySelectorAll("[data-row-pres-id]").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest("button, .actions-col")) return;
            if (window.getSelection().toString().length > 0) return;
            openPresupuestoModal(row.dataset.rowPresId);
        });
    });
    tbody.querySelectorAll("[data-pres-id]").forEach(btn => {
        btn.addEventListener("click", () => openPresupuestoModal(btn.dataset.presId));
    });
    tbody.querySelectorAll("[data-pres-to-client]").forEach(btn => {
        btn.addEventListener("click", () => presupuestoToCliente(btn.dataset.presToClient));
    });
    tbody.querySelectorAll("[data-pres-del]").forEach(btn => {
        btn.addEventListener("click", () => removePresupuesto(btn.dataset.presDel));
    });
}

function openPresupuestoModal(id) {
    const p = presupuestos.find(x => x.id === id);
    if (!p) return;
    presupuestoModalTitle.textContent = (p.negocio || p.nombre || "Presupuesto") + " — " + (TYPE_LABELS[p.siteType] || p.siteType || "");

    const yorn = (v) => v ? escapeHtml(Array.isArray(v) ? v.join(", ") : String(v)) : `<span class="muted">—</span>`;
    // Plan cotizado y, si pagó, qué pagó: la seña del pago único o la suscripción mensual.
    const planPres = planDe(p);
    const pagoPres = p.paymentStatus === "approved" ? _pagoDePresupuesto(p, planPres) : null;

    const socialRows = p.socialMedia
        ? Object.entries(p.socialMedia).filter(([,v]) => v).map(([k,v]) => `<div class="prop-row"><span class="prop-label">${k}</span><span>${escapeHtml(v)}</span></div>`).join("")
        : "";

    presupuestoModalBody.innerHTML = `
        <div class="prop-row"><span class="prop-label">Nombre</span><span>${escapeHtml(p.nombre || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Email</span><span>${escapeHtml(p.email || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Teléfono</span><span>${escapeHtml(p.telefono || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">CUIT / DNI</span><span>${escapeHtml(p.cuit || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Negocio</span><span>${escapeHtml(p.negocio || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Rubro</span><span>${escapeHtml(p.businessType || "—")}</span></div>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
        <div class="prop-row"><span class="prop-label">Tipo de sitio</span><span>${escapeHtml(TYPE_LABELS[p.siteType] || p.siteType || "—")}</span></div>
        ${_planRowsHTML(pagoPres ? { ...planPres, modalidad: pagoPres.modalidad } : planPres)}
        <div class="prop-row"><span class="prop-label">Estado del pago</span><span>${!pagoPres
            ? "⏳ " + escapeHtml(p.paymentStatus || "pendiente")
            : pagoPres.sena ? `✅ Seña de ${fmtMoney(pagoPres.sena)} pagada`
            : pagoPres.primerPago ? `✅ Primer pago de ${fmtMoney(pagoPres.primerPago)} pagado (modelo anterior)`
            : `✅ Suscripto al servicio de ${fmtMoney(pagoPres.mensual)}/mes`}</span></div>
        <div class="prop-row"><span class="prop-label">Payment ID</span><span class="muted" style="font-size:12px">${escapeHtml(p.paymentId || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Objetivos</span><span>${yorn(formatObjetivosValue(p.objectives))}</span></div>
        <div class="prop-row"><span class="prop-label">Funcionalidades</span><span>${yorn(formatFuncionalidadesValue(p.functionalities))}</span></div>
        <div class="prop-row"><span class="prop-label">Páginas</span><span>${escapeHtml(p.pages || "—")}</span></div>
        ${Array.isArray(p.extras) && p.extras.length ? `<div class="prop-row prop-row-block"><span class="prop-label">Adicionales pagos</span><p class="prop-text">${p.extras.map(e => escapeHtml(e.name + " — $" + Number(e.price).toLocaleString("es-AR"))).join("<br>")}</p></div>` : ""}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
        <div class="prop-row"><span class="prop-label">Brief recibido</span><span>${p.briefCompleted ? "✅ Sí" : "❌ No"}</span></div>
        ${p.briefCompleted ? `
        <div class="prop-row"><span class="prop-label">Logo</span><span>${p.logoUrl && p.logoUrl.startsWith('http') ? `<a href="${escapeHtml(p.logoUrl)}" target="_blank" style="color:#60A5FA">Ver logo ↗</a>` : (p.logoNombre || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Colores</span><span>${escapeHtml(p.colores || "—")}</span></div>
        ${p.coloresDesc ? `<div class="prop-row prop-row-block"><span class="prop-label">Estilo de colores</span><p class="prop-text">${escapeHtml(p.coloresDesc)}</p></div>` : ""}
        <div class="prop-row"><span class="prop-label">Tipografía</span><span>${escapeHtml(p.tipografia || "—")}</span></div>
        ${p.paginas ? `<div class="prop-row prop-row-block"><span class="prop-label">Páginas / secciones</span><p class="prop-text">${escapeHtml(p.paginas)}</p></div>` : ""}
        ${p.textos ? `<div class="prop-row prop-row-block"><span class="prop-label">Textos</span><p class="prop-text">${escapeHtml(p.textos)}</p></div>` : ""}
        ${p.referencias ? `<div class="prop-row prop-row-block"><span class="prop-label">Referencias</span><p class="prop-text">${escapeHtml(p.referencias)}</p></div>` : ""}
        ${socialRows}
        ${p.observaciones ? `<div class="prop-row prop-row-block"><span class="prop-label">Observaciones</span><p class="prop-text">${escapeHtml(p.observaciones)}</p></div>` : ""}
        ` : ""}
    `;
    presupuestoModal.hidden = false;
}

async function presupuestoToCliente(id) {
    const p = presupuestos.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`Pasar "${p.nombre || p.negocio || "este presupuesto"}" a Seguimiento?`)) return;
    /* Pagó desde /presupuesto/ por Mercado Pago (dos modalidades, 15-sep-2026): lo que
       pagó lo dice _pagoDePresupuesto. La seña del pago único queda cobrada, con la
       fecha del pago; la suscripción mensual queda pendiente hasta que figure en
       Mantenimiento; el primer pago del 10 al 14-sep-2026 queda como en ese modelo. Sin
       pago, queda la modalidad que eligió en la calculadora ("" si no eligió). */
    const plan = planDe(p);
    const pagadoAt = p.paymentStatus === "approved" ? (mantToDate(p.createdAt) || new Date()) : null;
    const pago = pagadoAt ? _pagoDePresupuesto(p, plan) : null;
    const primerPago = pago ? pago.primerPago : 0;
    const senaCobrada = pago ? pago.sena : 0;
    const precioUnico = senaCobrada && !p.sinPrecio ? (_num(p.precioUnico) || _num(p.totalPrice) || plan.unico) : 0;
    try {
        await addDoc(collection(db, "clientes"), {
            nombre:         p.nombre || p.negocio || "",
            proyecto:       (TYPE_LABELS[p.siteType] || p.siteType || "") + (p.businessType ? " · " + p.businessType : ""),
            telefono:       p.telefono || "",
            email:          /@/.test(p.email || "") ? p.email.trim() : "",
            estadoCliente:  "seguimiento1",
            hablarleElDia:  "",
            planLabel:         plan.label,
            modalidad:         pago ? pago.modalidad : plan.modalidad,
            // ── Servicio mensual (el primer pago solo en un pago del 10 al 14-sep-2026) ──
            primerPago,
            primerPagoAt:      primerPago ? pagadoAt : null,
            montoMensual:      plan.mensual,
            estadoSuscripcion: "pendiente",
            suscripcionDesde:  primerPago ? _sumarDias(pagadoAt, DIAS_HASTA_EL_PLAN) : null,
            preapprovalId:     "",
            // ── Pago único: el precio y la seña cobrada. En un cliente mensual, valorTotal = primer pago (compatibilidad) ──
            valorTotal:     senaCobrada ? precioUnico : primerPago,
            abono:          senaCobrada || primerPago,
            ...(senaCobrada ? { senaAt: pagadoAt } : {}),
            notas:          "",
            presupuestoId:  id,
            siteType:        p.siteType || "",
            businessType:    p.businessType || "",
            functionalities: p.functionalities || [],
            contactoNombre: p.nombre || "",
            colores:        p.colores || "",
            tipografias:    p.tipografia || "",
            referencias:    p.referencias || "",
            logoUrl:        p.logoUrl || "",
            logoNombre:     p.logoNombre || "",
            extra:          p.observaciones || "",
            createdAt:      serverTimestamp(),
            createdBy:      currentUser?.uid || null
        });
        alert(`✅ "${p.nombre || p.negocio}" quedó en Seguimiento con el plan ${plan.label || "sin definir"}` +
            (senaCobrada ? `: plan anual${precioUnico ? ` de ${fmtMoney(precioUnico)}` : ""}, con la seña de ${fmtMoney(senaCobrada)} registrada.`
                : primerPago ? ` y el primer pago de ${fmtMoney(primerPago)} registrado. El plan mensual arranca el ${mantLongDate(_sumarDias(pagadoAt, DIAS_HASTA_EL_PLAN))}.`
                : pago ? `: plan mensual de ${fmtMoney(plan.mensual)}. La suscripción queda pendiente hasta que figure en Mantenimiento.`
                : "."));
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
}

async function removePresupuesto(id) {
    const p = presupuestos.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`¿Eliminar el presupuesto de "${p.nombre || p.negocio || "este cliente"}"?`)) return;
    try {
        await deleteDoc(doc(db, "presupuestos", id));
    } catch (err) {
        console.error(err);
        alert("Error al eliminar: " + err.message);
    }
}

// --- Leads (Presupuestos sin pago) ---
const leadModal      = document.getElementById("leadModal");
const leadModalBody  = document.getElementById("leadModalBody");
const leadModalTitle = document.getElementById("leadModalTitle");
const searchLeadsInput = document.getElementById("searchLeads");

document.getElementById("closeLeadModalBtn").addEventListener("click", () => { leadModal.hidden = true; });
leadModal.addEventListener("click", (e) => { if (e.target === leadModal && !window.getSelection().toString().length) leadModal.hidden = true; });
searchLeadsInput.addEventListener("input", renderLeads);

function renderLeads() {
    const tbody = document.getElementById("leadsTbody");
    const term  = searchLeadsInput.value.trim().toLowerCase();
    const list  = term
        ? leads.filter(l =>
            (l.businessType || "").toLowerCase().includes(term) ||
            (l.siteType     || "").toLowerCase().includes(term) ||
            (l.phone        || "").toLowerCase().includes(term))
        : leads;

    if (list.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No hay presupuestos${term ? " para esa búsqueda" : " calculados aún"}.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(l => {
        const fecha = l.createdAt?.toDate
            ? l.createdAt.toDate().toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit", year:"numeric" })
            : "—";
        const typeLabel  = TYPE_LABELS[l.siteType] || l.siteType || "—";
        const plan       = planDe(l);
        const linkedBoceto = propuestas.find(p => p.presupuestoId === l.id);
        const bocetoBadge  = linkedBoceto
            ? `<span style="color:#4ade80;font-weight:700">✓ Recibido</span>`
            : `<span style="color:#9CA3AF">—</span>`;
        const phoneDisplay = l.phone
            ? `<a href="https://wa.me/${l.phone.replace(/\D/g,'')}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none" title="Abrir WhatsApp">${escapeHtml(l.phone)}</a>`
            : `<span style="color:#9CA3AF">—</span>`;

        return `
            <tr class="client-row" data-row-lead-id="${l.id}" style="cursor:pointer">
                <td>${escapeHtml(fecha)}</td>
                <td>${escapeHtml(l.businessType || "—")}</td>
                <td class="col-telefono">${phoneDisplay}</td>
                <td>${escapeHtml(typeLabel)}</td>
                <td>
                    <div>${escapeHtml(plan.label || "Sin definir")}</div>
                    <div class="muted" style="font-size:12px;white-space:nowrap">${_planMontosTexto(plan)}</div>
                </td>
                <td class="center">${bocetoBadge}</td>
                <td class="actions-col">
                    <button class="btn-ghost" data-lead-id="${l.id}" style="font-size:13px">Ver →</button>
                    <button class="icon-btn delete" data-lead-del="${l.id}" title="Eliminar">🗑</button>
                </td>
            </tr>`;
    }).join("");

    tbody.querySelectorAll("[data-row-lead-id]").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest("button, .actions-col")) return;
            if (window.getSelection().toString().length > 0) return;
            openLeadModal(row.dataset.rowLeadId);
        });
    });
    tbody.querySelectorAll("[data-lead-id]").forEach(btn => {
        btn.addEventListener("click", () => openLeadModal(btn.dataset.leadId));
    });
    tbody.querySelectorAll("[data-lead-del]").forEach(btn => {
        btn.addEventListener("click", () => removeLead(btn.dataset.leadDel));
    });
}

function openLeadModal(id) {
    const l = leads.find(x => x.id === id);
    if (!l) return;
    leadModalTitle.textContent = (l.businessType || "Presupuesto") + " — " + (TYPE_LABELS[l.siteType] || l.siteType || "");

    const yorn = v => v ? escapeHtml(Array.isArray(v) ? v.join(", ") : String(v)) : `<span class="muted">—</span>`;
    const linkedBoceto = propuestas.find(p => p.presupuestoId === id);

    const boCetoSection = linkedBoceto ? `
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--accent-green,#4ade80);margin-bottom:8px">Boceto vinculado</div>
        <div class="prop-row"><span class="prop-label">Negocio</span><span>${escapeHtml(linkedBoceto.nombre_negocio || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Contacto</span><span>${escapeHtml(linkedBoceto.nombre || linkedBoceto.contacto_nombre || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Teléfono</span><span>${escapeHtml(linkedBoceto.telefono || linkedBoceto.contacto_cel || "—")}</span></div>
        <div class="prop-row"><span class="prop-label">Fecha boceto</span><span>${escapeHtml(linkedBoceto.fecha || "—")}</span></div>
    ` : `
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">
        <div class="muted" style="font-size:13px">Sin boceto vinculado aún.</div>
    `;

    leadModalBody.innerHTML = `
        <div class="prop-row"><span class="prop-label">Rubro</span><span>${escapeHtml(l.businessType || "—")}</span></div>
        ${l.phone ? `<div class="prop-row"><span class="prop-label">Teléfono / WhatsApp</span><span><a href="https://wa.me/${l.phone.replace(/\D/g,'')}" target="_blank" rel="noopener" style="color:#4ade80">${escapeHtml(l.phone)}</a></span></div>` : ""}
        <div class="prop-row"><span class="prop-label">Tipo de sitio</span><span>${escapeHtml(TYPE_LABELS[l.siteType] || l.siteType || "—")}</span></div>
        ${_planRowsHTML(planDe(l))}
        ${l.catalogQty ? `<div class="prop-row"><span class="prop-label">Catálogo</span><span>${escapeHtml(PRESUPUESTO_CATALOGO_QTY_LABELS[l.catalogQty] || l.catalogQty)}</span></div>` : ""}
        <div class="prop-row"><span class="prop-label">Objetivos</span><span>${yorn(formatObjetivosValue(l.objectives))}</span></div>
        <div class="prop-row"><span class="prop-label">Funcionalidades</span><span>${yorn(formatFuncionalidadesValue(l.functionalities))}</span></div>
        ${Array.isArray(l.extras) && l.extras.length ? `<div class="prop-row prop-row-block"><span class="prop-label">Adicionales</span><p class="prop-text">${l.extras.map(e => escapeHtml(e.name + " — $" + Number(e.price).toLocaleString("es-AR"))).join("<br>")}</p></div>` : ""}
        ${boCetoSection}
    `;
    leadModal.hidden = false;
}

async function removeLead(id) {
    const l = leads.find(x => x.id === id);
    if (!l) return;
    if (!confirm(`¿Eliminar este presupuesto de "${l.businessType || "rubro desconocido"}"?`)) return;
    try {
        await deleteDoc(doc(db, "presupuestos", id));
    } catch (err) {
        console.error(err);
        alert("Error al eliminar: " + err.message);
    }
}

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
        const tareasDelDia = tareas.filter(t => t.fecha === dateStr);
        const imp1 = tareasDelDia.filter(t => t.importancia == 1);
        const imp2 = tareasDelDia.filter(t => t.importancia == 2);
        const hasAny = tareasDelDia.length > 0;
        const isToday = todayY === calYear && todayM === calMonth && todayD === d;
        const cls = ["cal-cell", isToday ? "today" : "", hasAny ? "has-demos" : ""].filter(Boolean).join(" ");
        let badges = "";
        if (imp2.length > 0) badges += `<span class="cal-badge badge-imp2">${imp2.length}</span>`;
        if (imp1.length > 0) badges += `<span class="cal-badge badge-imp1">${imp1.length}</span>`;
        html += `<div class="${cls}" data-date="${dateStr}">
            <span class="cal-day-num">${d}</span>
            <div class="cal-cell-badges">${badges}</div>
        </div>`;
    }

    html += `</div>`;
    calGrid.innerHTML = html;

    calGrid.querySelectorAll(".cal-cell[data-date]").forEach(cell => {
        cell.addEventListener("click", () => openDayModal(cell.dataset.date));
    });
}

function openDayModal(dateStr) {
    const tareasDelDia = tareas.filter(t => t.fecha === dateStr)
        .sort((a, b) => (a.hora || "99:99").localeCompare(b.hora || "99:99"));
    const [y, m, d] = dateStr.split("-");
    dayModalTitle.textContent = `${parseInt(d)} de ${MONTHS_ES[parseInt(m) - 1]} ${y}`;

    // ── Sección tareas personales ──
    const tareasHtml = `
        <div class="day-section">
            <div class="day-section-header">
                <span class="day-section-title">📋 Tareas</span>
                <button class="btn-add-tarea-day" data-date="${dateStr}">+ Agregar tarea</button>
            </div>
            ${tareasDelDia.length === 0
                ? `<p class="muted day-empty">No hay tareas para este día.</p>`
                : `<div class="tarea-list">${tareasDelDia.map(t => `
                    <div class="tarea-item tarea-imp${t.importancia}" data-tarea-id="${t.id}">
                        <div class="tarea-item-left">
                            <span class="tarea-imp-badge imp${t.importancia}">${t.importancia == 2 ? '🔴' : '🟡'}</span>
                            <div class="tarea-item-info">
                                ${t.hora ? `<span class="tarea-hora">${formatAMPM(t.hora)}</span>` : ''}
                                <span class="tarea-texto">${escapeHtml(t.texto)}</span>
                                ${t.contexto ? `<span class="tarea-contexto">👤 ${escapeHtml(t.contexto)}</span>` : ''}
                            </div>
                        </div>
                        <div class="tarea-item-actions">
                            <button class="icon-btn edit btn-edit-tarea" data-tarea-edit="${t.id}" title="Editar tarea">✎</button>
                            <button class="icon-btn delete btn-del-tarea" data-tarea-del="${t.id}" title="Eliminar tarea">🗑</button>
                        </div>
                    </div>`).join("")}
                </div>`
            }
        </div>`;

    dayModalBody.innerHTML = tareasHtml;

    dayModalBody.querySelector(".btn-add-tarea-day")?.addEventListener("click", () => {
        dayModal.hidden = true;
        openAddTareaModal(dateStr);
    });

    dayModalBody.querySelectorAll(".btn-del-tarea").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (!confirm("¿Eliminar esta tarea?")) return;
            await deleteDoc(doc(db, "tareas", btn.dataset.tareaDel));
            openDayModal(dateStr);
        });
    });

    dayModalBody.querySelectorAll(".btn-edit-tarea").forEach(btn => {
        btn.addEventListener("click", () => {
            const t = tareas.find(x => x.id === btn.dataset.tareaEdit);
            if (!t) return;
            dayModal.hidden = true;
            openAddTareaModal(dateStr, "", t);
        });
    });

    dayModal.hidden = false;
}

// ══════════════════════════════════════════════════════════
//   COMPLETADOS
// ══════════════════════════════════════════════════════════
const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function _ymDeFecha(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function _ymActual() {
    return _ymDeFecha(new Date());
}

function _ymLabel(ym) {
    const [y, m] = ym.split("-");
    return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

function _ymSumarMeses(ym, delta) {
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return _ymDeFecha(d);
}

// El mes de cada completado sale de la fecha en que se creó el boceto, no de cuándo se cerró.
function getCompletadoYM(c) {
    const d = _clientSketchDate(c);
    return d ? _ymDeFecha(d) : null;
}

const completadosFiltro = { modo: "mes", mes: _ymActual(), desde: "", hasta: "" };

function _completadosFiltrados() {
    const f = completadosFiltro;
    if (f.modo === "todo") return completados;
    if (f.modo === "sin-fecha") return completados.filter(c => !getCompletadoYM(c));
    if (f.modo === "rango") {
        let { desde, hasta } = f;
        if (desde && hasta && desde > hasta) [desde, hasta] = [hasta, desde];
        return completados.filter(c => {
            const ym = getCompletadoYM(c);
            if (!ym) return false;
            return (!desde || ym >= desde) && (!hasta || ym <= hasta);
        });
    }
    return completados.filter(c => getCompletadoYM(c) === f.mes);
}

function _completadosLabel() {
    const f = completadosFiltro;
    if (f.modo === "todo") return "Cobrado — histórico completo";
    if (f.modo === "sin-fecha") return "Cobrado sin fecha de boceto";
    if (f.modo === "rango") {
        let { desde, hasta } = f;
        if (desde && hasta && desde > hasta) [desde, hasta] = [hasta, desde];
        if (!desde && !hasta) return "Cobrado — histórico completo";
        if (desde && hasta) return desde === hasta ? `Cobrado en ${_ymLabel(desde)}` : `Cobrado de ${_ymLabel(desde)} a ${_ymLabel(hasta)}`;
        return desde ? `Cobrado desde ${_ymLabel(desde)}` : `Cobrado hasta ${_ymLabel(hasta)}`;
    }
    return `Cobrado en ${_ymLabel(f.mes)}`;
}

function _completadosVacioMsg() {
    const f = completadosFiltro;
    if (f.modo === "todo") return "Todavía no hay clientes completados.";
    if (f.modo === "sin-fecha") return "No hay completados sin fecha de boceto.";
    if (f.modo === "rango") return "No hay completados con boceto en ese rango.";
    return `No hay completados con boceto en ${_ymLabel(f.mes)}.`;
}

function _syncCompletadosControles(sinFechaCount) {
    const f = completadosFiltro;
    document.querySelectorAll(".filtro-modo-btn").forEach(btn => {
        const activo = btn.dataset.modo === "mes"
            ? (f.modo === "mes" || f.modo === "sin-fecha")
            : btn.dataset.modo === f.modo;
        btn.setAttribute("aria-pressed", String(activo));
        btn.classList.toggle("is-active", activo);
    });

    const sel = document.getElementById("completadosMesSelect");
    const rango = document.getElementById("completadosRango");
    if (sel) sel.hidden = !(f.modo === "mes" || f.modo === "sin-fecha");
    if (rango) rango.hidden = f.modo !== "rango";

    if (sel) {
        // El mes actual siempre está disponible, aunque todavía no tenga completados.
        const meses = [...new Set([...completados.map(getCompletadoYM).filter(Boolean), _ymActual(), f.mes])]
            .sort().reverse();
        const valor = f.modo === "sin-fecha" ? "sin-fecha" : f.mes;
        sel.innerHTML =
            meses.map(ym => `<option value="${ym}"${ym === valor ? " selected" : ""}>${_ymLabel(ym)}</option>`).join("") +
            (sinFechaCount > 0
                ? `<option value="sin-fecha"${valor === "sin-fecha" ? " selected" : ""}>Sin fecha de boceto (${sinFechaCount})</option>`
                : "");
    }

    const desdeEl = document.getElementById("completadosDesde");
    const hastaEl = document.getElementById("completadosHasta");
    if (desdeEl) desdeEl.value = f.desde;
    if (hastaEl) hastaEl.value = f.hasta;
}

function renderCompletados() {
    const sinFechaCount = completados.filter(c => !getCompletadoYM(c)).length;
    _syncCompletadosControles(sinFechaCount);

    const list = _completadosFiltrados();

    const total = list.reduce((sum, c) => sum + (Number(c.valorTotal) || 0), 0);
    const totalEl = document.getElementById("completadosTotal");
    if (totalEl) totalEl.textContent = fmtMoney(total);
    const labelEl = document.getElementById("completadosTotalLabel");
    if (labelEl) labelEl.textContent = _completadosLabel();

    const mesActual = _ymActual();
    const mesAnterior = _ymSumarMeses(mesActual, -1);
    const totalMesActual = completados
        .filter(c => getCompletadoYM(c) === mesActual)
        .reduce((sum, c) => sum + (Number(c.valorTotal) || 0), 0);
    const totalMesAnterior = completados
        .filter(c => getCompletadoYM(c) === mesAnterior)
        .reduce((sum, c) => sum + (Number(c.valorTotal) || 0), 0);
    const esteMesEl = document.getElementById("completadosEsteMes");
    if (esteMesEl) esteMesEl.textContent = fmtMoney(totalMesActual);
    const mesAnteriorEl = document.getElementById("completadosMesAnterior");
    if (mesAnteriorEl) mesAnteriorEl.textContent = fmtMoney(totalMesAnterior);

    _renderSketchStats("completadosSketchStats", list);

    const tbody = document.getElementById("completadosTbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">${escapeHtml(_completadosVacioMsg())}</td></tr>`;
        return;
    }

    const groupedCompletados = list
        .map(client => ({
            client,
            week: _clientWeek(client)
        }))
        .sort((a, b) => b.week.sort - a.week.sort || _compareClientsInWeek(a.client, b.client))
        .reduce((groups, entry) => {
            let group = groups[groups.length - 1];
            if (!group || group.week.key !== entry.week.key) {
                group = { week: entry.week, items: [] };
                groups.push(group);
            }
            group.items.push(entry.client);
            return groups;
        }, []);

    const completedRow = c => {
        const d = c.completadoAt?.toDate?.();
        const fechaStr = d
            ? d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
            : "—";
        const sketchSlot = _clientSketchSlotLabel(c);
        return `<tr>
            <td>
                <div class="client-name-cell">
                    <span>${escapeHtml(c.nombre)}</span>
                    ${sketchSlot ? `<small class="sketch-slot">${escapeHtml(sketchSlot)}</small>` : ''}
                </div>
            </td>
            <td class="col-proyecto" title="${escapeHtml(c.proyecto)}">${escapeHtml(c.proyecto)}</td>
            <td class="col-telefono">${escapeHtml(c.telefono)}</td>
            <td class="num">${fmtPrecioOACotizar(c.valorTotal, c.sinPrecio)}</td>
            <td class="num">${fmtMoney(c.abono)}</td>
            <td class="center">${escapeHtml(fechaStr)}</td>
            <td class="actions-col">
                ${c.factura?.cae ? `<button class="icon-btn" data-comp-factura="${c.id}" title="Descargar factura ${numeroComprobante(c.factura.puntoVenta, c.factura.numero)} para imprimir">🧾</button>` : ''}
                <button class="icon-btn delete" data-comp-del="${c.id}" title="Eliminar permanentemente">🗑</button>
            </td>
        </tr>`;
    };

    tbody.innerHTML = groupedCompletados
        .map(group => _weekSeparatorRow(group) + group.items.map(completedRow).join(""))
        .join("");

    tbody.querySelectorAll("[data-comp-factura]").forEach(btn => {
        btn.addEventListener("click", () => {
            const completado = completados.find(x => x.id === btn.dataset.compFactura);
            if (completado?.factura) abrirComprobante(completado.factura);
        });
    });

    tbody.querySelectorAll("[data-comp-del]").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (!confirm("¿Eliminar permanentemente este registro?")) return;
            try {
                await deleteDoc(doc(db, "completados", btn.dataset.compDel));
            } catch (err) {
                alert("Error: " + err.message);
            }
        });
    });
}

document.getElementById("completadosMesSelect")?.addEventListener("change", (e) => {
    if (e.target.value === "sin-fecha") {
        completadosFiltro.modo = "sin-fecha";
    } else {
        completadosFiltro.modo = "mes";
        completadosFiltro.mes = e.target.value;
    }
    renderCompletados();
});

document.querySelectorAll(".filtro-modo-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const modo = btn.dataset.modo;
        if (modo === "mes" && completadosFiltro.modo === "sin-fecha") {
            completadosFiltro.modo = "mes";
        } else {
            completadosFiltro.modo = modo;
        }
        // Primera vez en Rango: arranca con los últimos 6 meses.
        if (modo === "rango" && !completadosFiltro.desde && !completadosFiltro.hasta) {
            completadosFiltro.hasta = _ymActual();
            completadosFiltro.desde = _ymSumarMeses(completadosFiltro.hasta, -5);
        }
        renderCompletados();
    });
});

document.getElementById("completadosDesde")?.addEventListener("change", (e) => {
    completadosFiltro.desde = e.target.value;
    renderCompletados();
});

document.getElementById("completadosHasta")?.addEventListener("change", (e) => {
    completadosFiltro.hasta = e.target.value;
    renderCompletados();
});

// ══════════════════════════════════════════════════════════
//   CALENDARIO — TAREAS PERSONALES
// ══════════════════════════════════════════════════════════

const taskModal      = document.getElementById("taskModal");
const taskForm       = document.getElementById("taskForm");
const taskModalTitle = document.getElementById("taskModalTitle");

// Poblar selector de horas una sola vez
(function initHoraSelect() {
    const sel = document.getElementById("taskHoraH");
    if (!sel || sel.options.length > 1) return;
    for (let h = 0; h <= 23; h++) {
        const opt = document.createElement("option");
        opt.value = String(h).padStart(2, "0");
        const suffix = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        opt.textContent = `${h12}:00 ${suffix}`;
        sel.appendChild(opt);
    }
    sel.addEventListener("change", () => {
        const minSel = document.getElementById("taskHoraM");
        minSel.disabled = !sel.value;
        if (!sel.value) minSel.value = "00";
    });
})();

// Abrir picker de fecha con click en cualquier parte del campo
document.querySelector(".date-click-wrap")?.addEventListener("click", (e) => {
    const inp = document.getElementById("taskFecha");
    if (e.target !== inp) inp.showPicker?.() || inp.click();
});

let editingTareaId = null;

function openAddTareaModal(dateStr, contexto = "", taskToEdit = null) {
    const today = new Date().toISOString().split("T")[0];
    editingTareaId = taskToEdit ? taskToEdit.id : null;

    const fecha    = taskToEdit ? taskToEdit.fecha : (dateStr || today);
    const ctxValue = taskToEdit ? (taskToEdit.contexto || "") : contexto;
    const [horaH, horaM] = taskToEdit && taskToEdit.hora ? taskToEdit.hora.split(":") : ["", "00"];

    document.getElementById("taskFecha").value    = fecha;
    document.getElementById("taskTexto").value    = taskToEdit ? taskToEdit.texto : "";
    document.getElementById("taskHoraH").value    = horaH;
    const minSel = document.getElementById("taskHoraM");
    minSel.value    = horaM || "00";
    minSel.disabled = !horaH;
    document.getElementById("taskContexto").value = ctxValue;
    document.querySelector(`input[name="taskImp"][value="${taskToEdit ? taskToEdit.importancia : 1}"]`).checked = true;
    const ctxRow = document.getElementById("taskContextoRow");
    ctxRow.style.display = ctxValue ? "flex" : "none";
    taskModalTitle.textContent = taskToEdit
        ? "Editar tarea"
        : (dateStr
            ? `Agregar tarea — ${parseInt(dateStr.split("-")[2])} de ${MONTHS_ES[parseInt(dateStr.split("-")[1]) - 1]}`
            : "Agregar tarea");
    taskModal.hidden = false;
    setTimeout(() => document.getElementById("taskTexto").focus(), 50);
}

function closeTaskModal() {
    taskModal.hidden = true;
    editingTareaId = null;
}

document.getElementById("closeTaskModalBtn").addEventListener("click", closeTaskModal);
document.getElementById("cancelTaskBtn").addEventListener("click", closeTaskModal);
taskModal.addEventListener("click", (e) => { if (e.target === taskModal) closeTaskModal(); });

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fecha       = document.getElementById("taskFecha").value;
    const texto       = document.getElementById("taskTexto").value.trim();
    const horaH       = document.getElementById("taskHoraH").value;
    const horaM       = document.getElementById("taskHoraM").value || "00";
    const hora        = horaH ? `${horaH}:${horaM}` : "";
    const importancia = parseInt(document.querySelector('input[name="taskImp"]:checked').value);
    const contexto    = document.getElementById("taskContexto").value.trim();
    if (!fecha || !texto) return;
    try {
        if (editingTareaId) {
            await updateDoc(doc(db, "tareas", editingTareaId), {
                fecha, texto, hora, importancia,
                contexto: contexto || ""
            });
        } else {
            await addDoc(collection(db, "tareas"), {
                fecha, texto, hora, importancia,
                contexto: contexto || "",
                createdAt: serverTimestamp()
            });
        }
        editingTareaId = null;
        closeTaskModal();
        if (activeTab === "calendario") {
            renderCal();
            openDayModal(fecha);
            dayModal.hidden = false;
        }
    } catch (err) {
        alert("Error al guardar tarea: " + err.message);
    }
});

// Botón "Agregar tarea hoy" desde el header del calendario
document.getElementById("addTareaHoyBtn")?.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    openAddTareaModal(today);
});

// Lock scroll del body cuando cualquier modal está abierto
(function initScrollLock() {
    const backdrops = document.querySelectorAll(".modal-backdrop");
    const sync = () => {
        const anyOpen = [...backdrops].some(m => !m.hidden);
        document.body.classList.toggle("modal-open", anyOpen);
    };
    const observer = new MutationObserver(sync);
    backdrops.forEach(m => observer.observe(m, { attributes: true, attributeFilter: ["hidden"] }));
})();

/* ═══════════════════════════════════════════════════════════════════
   NUEVO BOCETO — carga manual desde el chat de WhatsApp
   Reemplaza al formulario público (gokywebs.com/form, dado de baja).
   Pegás lo que te pasó el cliente → autocompleta → elegís tipo → guarda
   el doc en la colección `propuestas` con el MISMO esquema que usaba el
   form, así el boceto se ve y se convierte igual que los de antes.
   Los montos de las dos modalidades (pago único con seña y servicio mensual,
   15-sep-2026) salen de PLANES según el tipo: el tamaño y las reservas no
   cambian el precio.
   ═══════════════════════════════════════════════════════════════════ */

// Etiqueta comercial por tipo (idéntica a PRICING de form/script.js)
const NB_LABEL = {
    landing: '🚀 Landing Page', 'landing-reservas': '🚀 Landing Page + 📅 Reservas',
    catalogo: '🏬 Catálogo administrable', 'catalogo-reservas': '🏬 Catálogo administrable + 📅 Reservas',
    inmobiliaria: '🏠 Web Inmobiliaria', 'inmobiliaria-reservas': '🏠 Web Inmobiliaria + 📅 Reservas',
    ecommerce: '🛒 E-commerce', 'ecommerce-reservas': '🛒 E-commerce + 📅 Reservas',
    elearning: '🎓 Plataforma LMS', 'elearning-reservas': '🎓 Plataforma LMS + 📅 Reservas',
    'ecommerce-elearning': '🛒🎓 E-commerce + Plataforma LMS', 'ecommerce-elearning-reservas': '🛒🎓 E-commerce + Plataforma LMS + 📅 Reservas',
};

// "Qué incluye" por tipo (idéntico a INCLUYE de form/script.js)
const NB_INCLUYE = {
    landing: '✓ Diseño personalizado de landing page\n✓ Secciones: inicio, servicios, contacto\n✓ Formulario de contacto por email\n✓ Optimización SEO básica\n✓ Diseño responsive (celular y PC)',
    'landing-reservas': '✓ Diseño personalizado de landing page\n✓ Secciones: inicio, servicios, contacto\n✓ Sistema de reservas de turnos, citas o alojamientos\n✓ Calendario de disponibilidad\n✓ Diseño responsive',
    catalogo: '✓ Catálogo de productos con categorías y buscador\n✓ Foto, descripción y precio por producto\n✓ Botón "Pedir por WhatsApp" en cada producto\n✓ Panel para cargar y editar tus productos vos mismo\n✓ Diseño responsive',
    'catalogo-reservas': '✓ Catálogo de productos con categorías y buscador\n✓ Botón "Pedir por WhatsApp" en cada producto\n✓ Panel para cargar y editar tus productos\n✓ Sistema de reservas de turnos, citas o alojamientos\n✓ Diseño responsive',
    inmobiliaria: '✓ Listado de propiedades en venta/alquiler\n✓ Filtros por tipo, zona y precio\n✓ Galería de fotos por propiedad\n✓ Formulario de consulta\n✓ Diseño responsive',
    'inmobiliaria-reservas': '✓ Listado de propiedades en venta/alquiler\n✓ Filtros por tipo, zona y precio\n✓ Galería de fotos por propiedad\n✓ Sistema de reservas de turnos, citas o alojamientos\n✓ Diseño responsive',
    ecommerce: '✓ Catálogo de productos con filtros\n✓ Carrito de compras\n✓ Integración con Mercado Pago\n✓ Panel de administración de productos\n✓ Diseño responsive',
    'ecommerce-reservas': '✓ Catálogo de productos con filtros\n✓ Carrito de compras\n✓ Integración con Mercado Pago\n✓ Sistema de reservas de turnos, citas o alojamientos\n✓ Diseño responsive',
    elearning: '✓ Módulos de cursos y lecciones\n✓ Sistema de acceso para alumnos\n✓ Evaluaciones y seguimiento de progreso por alumno\n✓ Acceso docente para cargar contenido y gestionar sus cursos\n✓ Chat entre alumnos y docentes\n✓ Diseño responsive',
    'elearning-reservas': '✓ Módulos de cursos y lecciones\n✓ Sistema de acceso para alumnos\n✓ Evaluaciones y seguimiento de progreso por alumno\n✓ Acceso docente y chat con los alumnos\n✓ Sistema de reservas de turnos, citas o alojamientos\n✓ Diseño responsive',
    'ecommerce-elearning': '✓ Tienda online con catálogo, carrito y cobro por la web\n✓ Plataforma de cursos con módulos y lecciones\n✓ Evaluaciones y seguimiento de progreso por alumno\n✓ Acceso docente para cargar contenido y gestionar sus cursos\n✓ Chat entre alumnos y docentes\n✓ Panel unificado para administrar productos, cursos y alumnos\n✓ Diseño responsive',
    'ecommerce-elearning-reservas': '✓ Tienda online con catálogo, carrito y cobro por la web\n✓ Plataforma de cursos con módulos y lecciones\n✓ Evaluaciones y acceso docente propio\n✓ Sistema de reservas de turnos, citas o alojamientos\n✓ Panel unificado para administrar productos, cursos, alumnos y reservas\n✓ Diseño responsive',
};

// Objetivos (pills del form) por tipo base — para dejar el boceto igual que los del form
const NB_BASE_OBJETIVOS = {
    landing: ['mostrar-negocio'],
    catalogo: ['catalogo-whatsapp'],
    inmobiliaria: ['inmobiliaria'],
    ecommerce: ['vender-online'],
    elearning: ['cursos-digitales'],
    'ecommerce-elearning': ['vender-online', 'cursos-digitales'],
};

function nbTipoKey(base, reservas) {
    return reservas ? base + '-reservas' : base;
}

(function initNuevoBoceto() {
    const modal      = document.getElementById("nuevoBocetoModal");
    const openBtn    = document.getElementById("openNuevoBocetoBtn");
    const closeBtn   = document.getElementById("closeNuevoBocetoBtn");
    const cancelBtn  = document.getElementById("cancelNuevoBocetoBtn");
    const formEl     = document.getElementById("nuevoBocetoForm");
    if (!modal || !openBtn || !formEl) return;

    const $ = id => document.getElementById(id);
    const tipoSel    = $("nbTipo");
    const reservasCb = $("nbReservas");
    const tipoPagRow = $("nbTipoPaginaRow");

    const CAMPOS = ["nbNombreNegocio","nbRubro","nbContacto","nbTelefono","nbInstagram",
                    "nbCiudadZona","nbCantProductos","nbCantCursos","nbColores","nbTipografias","nbNotas"];

    function tipoPaginaValue() {
        return document.querySelector('input[name="nbTipoPagina"]:checked')?.value || 'Una página';
    }

    function recalcPrecio() {
        const base = tipoSel.value;
        const esLanding = base === 'landing';
        tipoPagRow.style.display = esLanding ? '' : 'none';
        const tipoPagina = esLanding ? tipoPaginaValue() : '';
        const tipoKey = nbTipoKey(base, reservasCb.checked);
        const plan = planDe({ tipoDetectado: tipoKey });
        $("nbPriceType").textContent       = `${NB_LABEL[tipoKey] || '—'} · plan ${plan.label}`;
        // Las dos modalidades (15-sep-2026): el cliente elige después cómo la contrata.
        $("nbPriceUnico").textContent      = `${fmtMoney(plan.unico)} · seña ${fmtMoney(plan.sena)}`;
        $("nbPriceMensual").textContent    = `${fmtMoney(plan.mensual)}/mes`;
        return { tipoKey, tipoPagina, plan };
    }

    tipoSel.addEventListener("change", recalcPrecio);
    reservasCb.addEventListener("change", recalcPrecio);
    document.querySelectorAll('input[name="nbTipoPagina"]').forEach(r => r.addEventListener("change", recalcPrecio));

    function abrir() {
        formEl.reset();
        CAMPOS.forEach(id => { const el = $(id); if (el) el.value = ""; });
        $("nbPaste").value = "";
        $("nbAutofillMsg").hidden = true;
        tipoSel.value = "landing";
        reservasCb.checked = false;
        recalcPrecio();
        modal.hidden = false;
        setTimeout(() => $("nbPaste").focus(), 30);
    }
    function cerrar() { modal.hidden = true; }

    openBtn.addEventListener("click", abrir);
    closeBtn.addEventListener("click", cerrar);
    cancelBtn.addEventListener("click", cerrar);
    modal.addEventListener("click", (e) => {
        if (e.target === modal && !window.getSelection().toString().length) cerrar();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.hidden) cerrar();
    });

    // ── Autocompletar desde el texto pegado ──
    $("nbAutofillBtn").addEventListener("click", () => {
        const parsed = parseChatBoceto($("nbPaste").value || "");
        const setIf = (id, val) => { if (val) { const el = $(id); if (el && !el.value.trim()) el.value = val; } };
        setIf("nbNombreNegocio", parsed.nombre_negocio);
        setIf("nbRubro",         parsed.rubro);
        setIf("nbContacto",      parsed.contacto);
        setIf("nbTelefono",      parsed.telefono);
        setIf("nbInstagram",     parsed.instagram);
        setIf("nbCiudadZona",    parsed.ciudad_zona);
        setIf("nbCantProductos", parsed.cant_productos);
        setIf("nbCantCursos",    parsed.cant_cursos);
        setIf("nbColores",       parsed.colores);
        setIf("nbTipografias",   parsed.tipografias);

        let cambioTipo = false;
        if (parsed.tipoBase) { tipoSel.value = parsed.tipoBase; cambioTipo = true; }
        if (parsed.reservas) { reservasCb.checked = true; cambioTipo = true; }
        if (cambioTipo) recalcPrecio();

        const detectados = Object.entries({
            negocio: parsed.nombre_negocio, rubro: parsed.rubro, contacto: parsed.contacto,
            teléfono: parsed.telefono, instagram: parsed.instagram, zona: parsed.ciudad_zona,
            productos: parsed.cant_productos, cursos: parsed.cant_cursos,
            colores: parsed.colores, tipografía: parsed.tipografias,
            tipo: parsed.tipoBase,
        }).filter(([, v]) => v).map(([k]) => k);

        const msg = $("nbAutofillMsg");
        msg.hidden = false;
        if (detectados.length) {
            msg.className = "nb-hint ok";
            msg.textContent = `✓ Detecté: ${detectados.join(", ")}. Revisá y completá lo que falte.`;
        } else {
            msg.className = "nb-hint";
            msg.textContent = "No pude detectar campos automáticamente — cargalos a mano abajo.";
        }
    });

    // ── Guardar el boceto ──
    formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombreNegocio = $("nbNombreNegocio").value.trim();
        if (!nombreNegocio) {
            alert("Poné al menos el nombre del negocio.");
            $("nbNombreNegocio").focus();
            return;
        }

        const { tipoKey, tipoPagina, plan } = recalcPrecio();
        const objetivos = [...(NB_BASE_OBJETIVOS[tipoSel.value] || []), ...(reservasCb.checked ? ['reservas-turnos'] : [])];
        const objetivosTexto = objetivos.map(o => OBJETIVO_LABELS[o] || o).join(", ");

        const rubro = $("nbRubro").value.trim();
        const data = {
            nombre:              $("nbContacto").value.trim(),
            telefono:            $("nbTelefono").value.trim(),
            instagram:           $("nbInstagram").value.trim(),
            nombre_negocio:      nombreNegocio,
            rubro,
            negocio_rubro:       [nombreNegocio, rubro].filter(Boolean).join(" — "),
            ciudad_zona:         $("nbCiudadZona").value.trim(),
            productos_servicios: $("nbCantProductos").value.trim(),
            cant_cursos:         $("nbCantCursos").value.trim(),
            colores:             $("nbColores").value.trim(),
            tipografias:         $("nbTipografias").value.trim(),
            objetivos,
            objetivos_texto:     objetivosTexto,
            tipo_pagina:         tipoPagina,
            tipo_web:            NB_LABEL[tipoKey] || "",
            tipoDetectado:       tipoKey,
            tipoDetectadoLabel:  NB_LABEL[tipoKey] || "",
            que_incluye:         NB_INCLUYE[tipoKey] || NB_INCLUYE.landing,
            // Mismos campos que escribe la calculadora (/presupuesto/script.js): los montos
            // de las dos modalidades, sin modalidad elegida todavía y primerPago siempre en 0.
            precioUnico:         plan.unico,
            sena:                plan.sena,
            saldo:               plan.saldo,
            precioTotal:         plan.unico,
            mensualidad:         plan.mensual,
            modalidad:           "",
            primerPago:          0,
            notas:               $("nbNotas").value.trim(),
            confirmoMuestra:     true,   // vino por WhatsApp y aceptó la muestra → ya calificado
            origen:              "whatsapp-admin",
            fecha:               new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
            createdAt:           serverTimestamp(),
            updatedAt:           serverTimestamp(),
        };

        const saveBtn = $("saveNuevoBocetoBtn");
        saveBtn.disabled = true;
        saveBtn.textContent = "Creando…";
        try {
            await addDoc(collection(db, "propuestas"), data);
            cerrar();
        } catch (err) {
            console.error(err);
            alert("No se pudo crear el boceto: " + err.message);
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = "Crear boceto";
        }
    });
})();

/* Parser tolerante del texto del chat → campos del boceto.
   Soporta formato etiquetado ("Zona: Quilmes", "IG: @x") y texto libre. */
function parseChatBoceto(texto) {
    const out = {
        nombre_negocio: "", rubro: "", contacto: "", telefono: "", instagram: "",
        ciudad_zona: "", cant_productos: "", cant_cursos: "", colores: "", tipografias: "",
        tipoBase: "", reservas: false,
    };
    if (!texto || !texto.trim()) return out;

    const sinTildes = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const norm = s => sinTildes(String(s || "").toLowerCase()).trim();

    // 1) Líneas etiquetadas "clave: valor"
    const ETIQUETAS = [
        [/^(nombre del negocio|nombre negocio|negocio|marca|empresa|comercio|local)$/, "nombre_negocio"],
        [/^(rubro|actividad|giro|a que se dedica|se dedica|dedica|que vende|que vendes)$/, "rubro"],
        [/^(contacto|mi nombre|nombre de contacto|responsable|titular)$/, "contacto"],
        [/^(telefono|tel|celular|cel|whatsapp|wsp|wpp|wapp|numero|nro)$/, "telefono"],
        [/^(instagram|ig|insta|arroba)$/, "instagram"],
        [/^(zona|ciudad|localidad|barrio|ubicacion|donde|provincia|partido)$/, "ciudad_zona"],
        [/^(colores|color|paleta|colores de marca)$/, "colores"],
        [/^(tipografia|tipografias|fuente|fuentes|letra|tipo de letra|tipo de fuente)$/, "tipografias"],
        [/^(productos|cantidad de productos|cant productos|cant de productos|nro de productos|numero de productos)$/, "cant_productos"],
        [/^(cursos|cantidad de cursos|cant cursos|cant de cursos|nro de cursos|numero de cursos)$/, "cant_cursos"],
    ];
    const restante = [];
    String(texto).split(/\r?\n/).forEach(linea => {
        const m = linea.match(/^\s*([^:]{2,40}):\s*(.+?)\s*$/);
        if (m) {
            const clave = norm(m[1]).replace(/\s+/g, " ");
            const valor = m[2].trim();
            const hit = ETIQUETAS.find(([re]) => re.test(clave));
            if (hit && !out[hit[1]]) { out[hit[1]] = valor; return; }
        }
        restante.push(linea);
    });
    const libre = restante.join("\n");
    const libreN = norm(libre);

    // 2) Heurísticas sobre lo no etiquetado
    if (!out.instagram) {
        const ig = libre.match(/(?:instagram\.com\/|@)\s*([A-Za-z0-9._]{2,40})/i);
        if (ig) out.instagram = "@" + ig[1].replace(/^@/, "");
    }
    if (!out.telefono) {
        // Run de 10-15 dígitos admitiendo +, espacios, guiones y paréntesis
        const tel = libre.match(/(\+?\s*(?:\d[\s\-()]*){10,15})/);
        if (tel) {
            const digits = tel[1].replace(/\D/g, "");
            if (digits.length >= 10 && digits.length <= 15) out.telefono = tel[1].trim();
        }
    }
    if (!out.cant_productos) {
        const p = libreN.match(/(\d{1,4})\s*(?:productos|articulos|items|prendas|modelos)/);
        if (p) out.cant_productos = p[1] + " productos";
    }
    if (!out.cant_cursos) {
        const c = libreN.match(/(\d{1,3})\s*cursos?/);
        if (c) out.cant_cursos = c[1] + " cursos";
    }
    if (!out.colores) {
        const NOMBRES = ["negro","blanco","gris","rojo","bordo","bordó","naranja","amarillo","dorado","ocre",
            "verde","celeste","azul","turquesa","cyan","violeta","lila","purpura","fucsia","rosa","rosado",
            "marron","beige","crema","nude","pastel","plateado","plata","cobre"];
        const encontrados = NOMBRES.filter(c => new RegExp("\\b" + sinTildes(c) + "\\b").test(libreN));
        const hex = libre.match(/#[0-9a-fA-F]{3,6}/g) || [];
        const todos = [...new Set([...encontrados, ...hex])];
        if (todos.length) out.colores = todos.join(", ");
    }
    if (!out.tipografias) {
        const t = libreN.match(/(?:tipografia|fuente|letra)\s*(?:preferida|de preferencia|tipo)?\s*[:\-]?\s*([a-z0-9 ]{3,40})/);
        if (t) out.tipografias = t[1].trim();
    }

    // 3) Tipo de web y reservas (best-effort para pre-seleccionar el dropdown)
    const has = re => re.test(libreN) || re.test(norm(texto));
    if (has(/\b(reservas?|turnos?|citas?|alojamiento|agenda|calendario)\b/)) out.reservas = true;
    // "pedidos por whatsapp" / "sin cobro" son señales inequívocas de catálogo (no ecommerce),
    // y ganan aunque el texto mencione "cobro" en una negación ("sin cobro online").
    const catalogoSignal = has(/\b(catalogo|pedidos? por whatsapp|mostrar productos|sin cobro|sin cobrar|sin carrito|sin tienda online|sin pago online)\b/);
    const tieneCursos    = has(/\b(cursos?|e-?learning|clases? online|capacitacion|alumnos?)\b/);
    const quiereCobrar   = !catalogoSignal && has(/\b(cobrar|cobro online|carrito|tienda online|vender online|pago online|mercado ?pago|checkout)\b/);
    if (quiereCobrar && tieneCursos) out.tipoBase = "ecommerce-elearning";
    else if (tieneCursos)            out.tipoBase = "elearning";
    else if (quiereCobrar)           out.tipoBase = "ecommerce";
    else if (has(/\b(propiedad|propiedades|inmobiliaria|alquiler|venta de casas?|departamentos?|inmueble)/)) out.tipoBase = "inmobiliaria";
    else if (catalogoSignal)         out.tipoBase = "catalogo";
    // landing queda como default del dropdown (no forzamos tipoBase)

    return out;
}

/* ═══════════════════════════════════════════════════════════
   MANTENIMIENTO — suscriptores de los planes mensuales
   Se cargan solos por el webhook de MP (colección "mantenimiento")
   o a mano desde el modal. El check "pidió cambios" guarda el inicio
   del ciclo vigente en `cambiosPeriodo`. Cada ciclo empieza el mismo
   número de día en que se dio de alta el suscriptor.
   ═══════════════════════════════════════════════════════════ */
/* Claves del campo `plan` que escribe el webhook (mantenimiento/api/webhook-mp.php):
   se conservaron 'landing' / 'mensual' para los planes del 14-sep-2026 (sin pago
   inicial: $20.000 y $30.000 por mes). Solo son el respaldo de los docs que no
   traen planLabel / monto propios. */
const MANT_PLAN_LABELS = { landing: "Plan mensual sitio profesional", mensual: "Plan mensual tienda online, cursos e inmobiliaria" };
const MANT_PLAN_MONTO  = { landing: 20000, mensual: 30000 };

function mantToDate(value) {
    if (value?.toDate) return value.toDate();
    if (value instanceof Date) return value;
    if (typeof value === "string" || typeof value === "number") {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
}

function mantDateKey(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
}

function mantAnchoredDate(year, month, anchorDay) {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(anchorDay, lastDay));
}

/* `ancla` = día en que arranca el ciclo: el alta del suscriptor en Mantenimiento;
   en Clientes, el día en que arranca el plan mensual. */
function mantCurrentPeriod(m, now = new Date(), ancla = m?.createdAt) {
    const alta = mantToDate(ancla);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!alta) {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return { key: mantDateKey(start), start, next };
    }

    const altaDay = new Date(alta.getFullYear(), alta.getMonth(), alta.getDate());
    const anchorDay = alta.getDate();
    let start = mantAnchoredDate(today.getFullYear(), today.getMonth(), anchorDay);

    if (today < start) {
        start = mantAnchoredDate(today.getFullYear(), today.getMonth() - 1, anchorDay);
    }
    if (start < altaDay) {
        start = altaDay;
    }

    const next = mantAnchoredDate(start.getFullYear(), start.getMonth() + 1, anchorDay);
    return { key: mantDateKey(start), start, next };
}

function mantUsedCurrentPeriod(m, period = mantCurrentPeriod(m)) {
    if (typeof m.cambiosPeriodo === "string") {
        return m.cambiosPeriodo === period.key;
    }
    if (!m.cambiosMes) return false;

    // Compatibilidad temporal con checks guardados antes del cambio de ciclos.
    const lastUpdate = mantToDate(m.updatedAt);
    return Boolean(lastUpdate && mantCurrentPeriod(m, lastUpdate).key === period.key);
}

function mantShortDate(date) {
    return String(date.getDate()).padStart(2, "0") + "/" + String(date.getMonth() + 1).padStart(2, "0");
}

function mantLongDate(date) {
    return mantShortDate(date) + "/" + date.getFullYear();
}

// Días que dura el ciclo vigente (28 a 31 según el mes que toque).
function mantPeriodDays(period) {
    return Math.round((period.next - period.start) / 86400000);
}

function mantWaLink(raw) {
    let digits = String(raw || "").replace(/\D/g, "");
    if (!digits) return "";
    if (!digits.startsWith("54")) digits = "54" + digits;
    return "https://wa.me/" + digits;
}

function mantDomainLink(raw) {
    const clean = String(raw || "").trim();
    if (!clean) return "";
    return /^https?:\/\//i.test(clean) ? clean : "https://" + clean;
}

const searchMantInput = document.getElementById("searchMant");
if (searchMantInput) searchMantInput.addEventListener("input", renderMantenimiento);

// Viñetas de Mantenimiento (Todos / Activos / Pausados / Bajas), mismo patrón que Seguimientos.
let mantVista = "todas";
document.querySelectorAll("#mantViews .seg-chip").forEach(b => {
    b.addEventListener("click", () => {
        document.querySelectorAll("#mantViews .seg-chip").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        mantVista = b.dataset.mantview;
        renderMantenimiento();
    });
});

// Plan mensual / plan anual (Pablo, 19-sep-2026): Mantenimiento divide las webs entregadas por plan.
let mantPlan = "mensual";
document.querySelectorAll("#mantPlanes [data-mantplan]").forEach(b => {
    b.addEventListener("click", () => {
        mantPlan = b.dataset.mantplan;
        renderMantenimiento();
    });
});

/* ── Avisos de baja / pausa de Mercado Pago ──
   Cuando una suscripción se cancela o se pausa en MP, el webhook no puede tocar
   el doc del suscriptor (las reglas públicas de "mantenimiento" solo dejan crear):
   deja un aviso aparte en la misma colección, con tipoEvento "baja" / "pausa" e
   ID "baja_<preapprovalId>" / "pausa_<preapprovalId>". Acá se cruzan. */

/* ¿El aviso `a` es de `ref` (un suscriptor de Mantenimiento o un cliente)? Por
   preapprovalId; si `ref` no tiene ID (alta manual), por email, siempre que el
   aviso no sea de otro suscriptor con ID y no sea anterior al alta de `ref`. */
function _avisoEsDe(a, ref) {
    const preAviso = String(a.preapprovalId || "").trim();
    const pre = String(ref?.preapprovalId || "").trim();
    if (pre) return preAviso === pre;
    const email = String(ref?.email || "").trim().toLowerCase();
    if (!email || String(a.email || "").trim().toLowerCase() !== email) return false;
    if (preAviso && mantenimiento.some(m => String(m.preapprovalId || "").trim() === preAviso)) return false;
    const alta = mantToDate(ref.createdAt);
    const fecha = mantToDate(a.fechaBaja) || mantToDate(a.createdAt);
    return !alta || !fecha || fecha >= alta;
}

// Aviso que le corresponde a un suscriptor o a un cliente: la baja manda sobre la pausa.
function avisoMantDe(ref) {
    if (!ref) return null;
    const avisos = mantenimientoAvisos.filter(a => _avisoEsDe(a, ref));
    return avisos.find(a => a.tipoEvento === "baja") || avisos.find(a => a.tipoEvento === "pausa") || null;
}

/* Filas de la tabla: cada suscriptor con su estado efectivo (un aviso manda sobre
   el estado guardado) y, además, los avisos que no cruzan con ningún suscriptor
   (el alta nunca llegó o se borró), uno por suscripción. `clave`: activo /
   pausado / baja, la misma que usan las viñetas. */
function _mantFilas() {
    const filas = mantenimiento.map(m => {
        const aviso = avisoMantDe(m);
        const clave = aviso?.tipoEvento === "baja" ? "baja"
            : (aviso || (m.estado || "activo") !== "activo") ? "pausado"
            : "activo";
        return { m, aviso, clave, alta: mantToDate(m.createdAt) };
    });
    const sueltos = new Map();
    mantenimientoAvisos
        .filter(a => !mantenimiento.some(m => _avisoEsDe(a, m)))
        .forEach(a => {
            const key = String(a.preapprovalId || a.id);
            const previo = sueltos.get(key);
            if (!previo || (previo.tipoEvento !== "baja" && a.tipoEvento === "baja")) sueltos.set(key, a);
        });
    sueltos.forEach(a => filas.push({
        m: null,
        aviso: a,
        clave: a.tipoEvento === "baja" ? "baja" : "pausado",
        alta: mantToDate(a.fechaAlta),
    }));
    return filas;
}

// Celda Estado: el estado efectivo y, si vino de Mercado Pago, la fecha del aviso.
function _mantEstadoHTML(fila) {
    const { m, aviso, clave } = fila;
    const badge = clave === "baja"
        ? `<span style="color:var(--danger);font-weight:700">✕ Dio de baja</span>`
        : clave === "pausado"
            ? `<span style="color:#9CA3AF;font-weight:600">⏸ Pausado</span>`
            : `<span style="color:#4ade80;font-weight:700">● Activo</span>`;
    if (!aviso) return badge;
    const fecha = mantToDate(aviso.fechaBaja) || mantToDate(aviso.createdAt);
    return `${badge}
                    <div class="muted" style="font-size:12px;white-space:nowrap">${fecha ? `el ${mantLongDate(fecha)} · ` : ""}en Mercado Pago</div>
                    ${m ? `<button class="btn-ghost" data-mant-aviso-del="${escapeHtml(aviso.id)}" style="font-size:11px;padding:2px 8px;margin-top:4px" title="Borra el aviso de ${aviso.tipoEvento === "baja" ? "baja" : "pausa"}, por ejemplo si reactivaste la suscripción. El suscriptor queda como estaba.">Quitar aviso</button>` : ""}`;
}

// Fila de un aviso de baja / pausa que no cruza con ningún suscriptor de la lista.
function _mantFilaAvisoHTML(fila) {
    const a = fila.aviso;
    const alta = fila.alta
        ? fila.alta.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "—";
    const planLabel = a.planLabel || MANT_PLAN_LABELS[a.plan] || a.plan || "—";
    const monto = Number(a.monto ?? MANT_PLAN_MONTO[a.plan] ?? 0);
    return `
            <tr class="client-row">
                <td>${escapeHtml(alta)}</td>
                <td>
                    <div style="font-weight:600">${escapeHtml(a.email || "—")}</div>
                    <div class="muted" style="font-size:12px">sin alta registrada en Mantenimiento</div>
                </td>
                <td>
                    <div>${escapeHtml(planLabel)}</div>
                    <div class="muted" style="font-size:12px">${fmtMoney(monto)}/mes · <span class="muted" style="font-size:11px">vía Mercado Pago</span></div>
                </td>
                <td class="col-telefono"><span class="muted">—</span></td>
                <td><span class="muted">—</span></td>
                <td class="center">${_mantEstadoHTML(fila)}</td>
                <td class="center"><span class="muted">—</span></td>
                <td class="actions-col">
                    <button class="icon-btn delete" data-mant-aviso-del="${escapeHtml(a.id)}" title="Quitar el aviso">🗑</button>
                </td>
            </tr>`;
}

async function removeAvisoMant(id) {
    const a = mantenimientoAvisos.find(x => x.id === id);
    if (!a) return;
    const que = a.tipoEvento === "baja" ? "baja" : "pausa";
    if (!confirm(`¿Quitar el aviso de ${que} de "${a.email || a.preapprovalId || "esta suscripción"}"? Hacelo solo si la suscripción sigue vigente en Mercado Pago (por ejemplo, si la reactivaste).`)) return;
    try {
        await deleteDoc(doc(db, "mantenimiento", id));
    } catch (err) {
        console.error(err);
        alert("Error al quitar el aviso: " + err.message);
    }
}

/* Las webs entregadas, por plan (Pablo, 19-sep-2026). El plan anual lleva
   también los pagos únicos anteriores al 19-sep, con su año de mantenimiento
   incluido; la web propia no lleva mantenimiento (queda en Completados). ""
   (modalidad sin definir) cuenta como mensual, igual que en Clientes. */
function _clientesEnMantenimiento() {
    const activos = clients.filter(c => getEstado(c) === "cliente");
    const entregados = activos.filter(c => webEntregada(c));
    /* El que ya está pagando entra a Mantenimiento aunque la web siga en
       desarrollo (Pablo, 21-sep: "ya se suscribieron pero no figuran en
       mantenimiento"). Las suscripciones de Mercado Pago ya aparecían así en la
       tabla de abajo; esto alcanza a las cargadas a mano en el cliente. */
    const pagando = activos.filter(c => !webEntregada(c) && !_conSena(modalidadDe(c))
        && suscripcionDe(c).estado === "activa");
    return {
        anual: entregados.filter(c => modalidadDe(c) === "unico"),
        mensual: [...entregados.filter(c => !_conSena(modalidadDe(c))), ...pagando],
    };
}

// El cliente de cada suscripción, con el mismo cruce de Clientes (ID, email o WhatsApp).
function _clientePorSuscripcion() {
    const mapa = new Map();
    clients.filter(c => getEstado(c) === "cliente").forEach(c => {
        const m = mantenimientoDeCliente(c);
        if (m && !mapa.has(m.id)) mapa.set(m.id, c);
    });
    return mapa;
}

function _clienteCoincide(c, term) {
    const termPhone = cleanArgPhone(term);
    return [c.nombre, c.proyecto, c.telefono, c.email].some(v => String(v || "").toLowerCase().includes(term))
        || (!!termPhone && cleanArgPhone(c.telefono).includes(termPhone));
}

/* Los números de arriba de Mantenimiento (antes estaban en Clientes): lo que
   entra por mes (las suscripciones activas de Mercado Pago y las cargadas
   activas a mano en un cliente sin suscripción), las webs entregadas del plan
   mensual que todavía no tienen la suscripción y los cobros anuales vencidos o
   que vencen en los próximos DIAS_AVISO_RENOVACION días. */
function _updateMantCounters(filas, sinSusc) {
    const clientesActivos = clients.filter(c => getEstado(c) === "cliente");
    const deMercadoPago = filas
        .filter(f => f.m && f.clave === "activo")
        .reduce((sum, f) => sum + Number(f.m.monto ?? MANT_PLAN_MONTO[f.m.plan] ?? 0), 0);
    const aMano = clientesActivos
        .filter(c => !_conSena(modalidadDe(c)) && !mantenimientoDeCliente(c))
        .map(suscripcionDe)
        .filter(s => s.estado === "activa")
        .reduce((sum, s) => sum + s.mensual, 0);
    const mrrEl = document.getElementById("mrrActivo");
    if (mrrEl) mrrEl.textContent = fmtMoney(deMercadoPago + aMano);

    const porActivar = sinSusc.map(suscripcionDe)
        .filter(s => s.estado === "pendiente" && (!s.desde || s.desde <= new Date())).length;
    const porActivarEl = document.getElementById("porActivar");
    if (porActivarEl) {
        porActivarEl.textContent = porActivar;
        porActivarEl.style.color = porActivar ? "var(--warning)" : "";
    }

    const anualesACobrar = clientesActivos
        .map(renovacionAnualDe)
        .filter(r => r && !r.legado && (r.estado === "vencido" || r.estado === "por_vencer"));
    const anualesEl = document.getElementById("anualesACobrar");
    if (anualesEl) {
        const vencidos = anualesACobrar.filter(r => r.estado === "vencido").length;
        anualesEl.textContent = anualesACobrar.length
            ? `${anualesACobrar.length} · ${fmtMoney(anualesACobrar.reduce((sum, r) => sum + r.monto, 0))}`
            : "0";
        anualesEl.style.color = vencidos ? "var(--danger)" : anualesACobrar.length ? "var(--warning)" : "";
    }
}

// Plan anual: las webs entregadas, el cobro más cercano primero (las que no tienen fecha, al final).
function _renderMantAnual(anual, term) {
    const tb = document.getElementById("mantAnualTbody");
    if (!tb) return;
    const orden = c => renovacionAnualDe(c)?.proximo?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const list = (term ? anual.filter(c => _clienteCoincide(c, term)) : anual)
        .slice().sort((a, b) => orden(a) - orden(b));
    tb.innerHTML = list.length
        ? list.map(c => _clientRow(c, { sinCambios: true })).join("")
        : `<tr class="empty-row"><td colspan="4">${term ? "No hay webs del plan anual para esa búsqueda." : "Todavía no hay webs entregadas con el plan anual."}</td></tr>`;
    _bindTableListeners(tb);
}

// Plan mensual: las webs del plan que no cruzan con ninguna suscripción de
// Mercado Pago (entregadas, o en desarrollo con la suscripción ya cobrándose).
function _renderMantSinSusc(sinSusc, term) {
    const list = term ? sinSusc.filter(c => _clienteCoincide(c, term)) : sinSusc;
    /* Dos listas, porque son dos cosas distintas y juntas confunden (Pablo,
       21-sep: marcó a los dos suscriptores y los leyó bajo "sin suscripción"):
       arriba los que YA se están cobrando y todavía no llegaron por Mercado
       Pago, abajo los que siguen sin suscribirse. */
    const cobrando = list.filter(c => suscripcionDe(c).estado === "activa");
    const pendientes = list.filter(c => suscripcionDe(c).estado !== "activa");
    // En "Todos" cada bloque aparece solo si tiene filas; en "Sin suscripción", siempre.
    const pintar = (idWrap, idTbody, filas, vacio) => {
        const wrap = document.getElementById(idWrap);
        const tb = document.getElementById(idTbody);
        if (!wrap || !tb) return;
        wrap.hidden = mantVista === "sin_susc" ? false : (mantVista !== "todas" || !filas.length);
        tb.innerHTML = filas.length
            ? filas.map(c => _clientRow(c, { marcarDesarrollo: true })).join("")
            : `<tr class="empty-row"><td colspan="5">${term ? "Ninguna para esa búsqueda." : vacio}</td></tr>`;
        _bindTableListeners(tb);
    };
    pintar("mantManualWrap", "mantManualTbody", cobrando, "Ninguna: las que cobran entraron por Mercado Pago.");
    pintar("mantSinSuscWrap", "mantSinSuscTbody", pendientes, "Todas las webs del plan mensual tienen su suscripción.");
}

function renderMantenimiento() {
    const tbody = document.getElementById("mantTbody");
    if (!tbody) return;
    const term = (searchMantInput?.value || "").trim().toLowerCase();

    const { anual, mensual } = _clientesEnMantenimiento();
    const sinSusc = mensual.filter(c => !mantenimientoDeCliente(c));
    const filas = _mantFilas();
    const conteo = { todas: filas.length + sinSusc.length, activo: 0, pausado: 0, baja: 0, sin_susc: sinSusc.length };
    filas.forEach(f => { conteo[f.clave]++; });
    Object.entries({ todas: "mantCountTodas", activo: "mantCountActivo", pausado: "mantCountPausado", baja: "mantCountBaja", sin_susc: "mantCountSinSusc" })
        .forEach(([clave, id]) => { const el = document.getElementById(id); if (el) el.textContent = conteo[clave]; });
    // El número del tab: las suscripciones activas y las webs del plan anual.
    const tabCount = document.getElementById("countMantenimiento");
    if (tabCount) tabCount.textContent = conteo.activo + anual.length;
    const countMensual = document.getElementById("mantCountMensual");
    if (countMensual) countMensual.textContent = conteo.todas;
    const countAnual = document.getElementById("mantCountAnual");
    if (countAnual) countAnual.textContent = anual.length;
    _updateMantCounters(filas, sinSusc);

    // Plan mensual o plan anual. El alta a mano es una suscripción: solo en el mensual.
    document.querySelectorAll("#mantPlanes [data-mantplan]").forEach(b =>
        b.setAttribute("aria-pressed", String(b.dataset.mantplan === mantPlan)));
    const mensualEl = document.getElementById("mantMensual");
    if (mensualEl) mensualEl.hidden = mantPlan !== "mensual";
    const anualEl = document.getElementById("mantAnual");
    if (anualEl) anualEl.hidden = mantPlan !== "anual";
    const altaBtn = document.getElementById("openMantModalBtn");
    if (altaBtn) altaBtn.hidden = mantPlan !== "mensual";

    _renderMantAnual(anual, term);
    _renderMantSinSusc(sinSusc, term);
    _renderMantSuscripciones(tbody, filas, term);
}

/* Las suscripciones de Mercado Pago del plan mensual, con la viñeta elegida
   (Todos / Activos / Pausados / Bajas). Cada una muestra el cliente con el que
   cruza, con la web entregada o todavía en desarrollo. */
function _renderMantSuscripciones(tbody, filas, term) {
    const wrap = document.getElementById("mantSuscWrap");
    if (wrap) wrap.hidden = mantVista === "sin_susc";
    if (mantVista === "sin_susc") return;
    const clientePorMant = _clientePorSuscripcion();

    let list = mantVista === "todas" ? filas : filas.filter(f => f.clave === mantVista);
    if (term) list = list.filter(f => {
        const d = f.m || f.aviso;
        const c = f.m ? clientePorMant.get(f.m.id) : null;
        return [d.nombre, d.email, d.whatsapp, c?.nombre, c?.proyecto].some(v => String(v || "").toLowerCase().includes(term));
    });
    // Más reciente primero: por alta y, en Bajas, por la fecha de la baja.
    const fechaOrden = f => (mantVista === "baja"
        ? (mantToDate(f.aviso?.fechaBaja) || mantToDate(f.aviso?.createdAt))
        : f.alta)?.getTime() || 0;
    list = [...list].sort((a, b) => fechaOrden(b) - fechaOrden(a));

    if (list.length === 0) {
        const vacio = { todas: "suscriptores", activo: "suscriptores activos", pausado: "suscripciones pausadas", baja: "bajas" }[mantVista] || "suscriptores";
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No hay ${vacio}${term ? " para esa búsqueda" : " todavía"}.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(fila => {
        if (!fila.m) return _mantFilaAvisoHTML(fila);
        const m = fila.m;
        const cliente = clientePorMant.get(m.id) || null;
        const proyectoCliente = String(cliente?.proyecto || "").trim();
        const clienteLink = cliente
            ? `<button type="button" class="mant-cliente-link" data-mant-cliente="${escapeHtml(cliente.id)}" title="Abrir el cliente">${escapeHtml(cliente.nombre || "Cliente")}${proyectoCliente && proyectoCliente.toLowerCase() !== String(cliente.nombre || "").trim().toLowerCase() ? ` · ${escapeHtml(proyectoCliente)}` : ""} · ${webEntregada(cliente) ? "web entregada" : "web en desarrollo"}</button>`
            : "";
        const alta = m.createdAt?.toDate
            ? m.createdAt.toDate().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "—";
        const planLabel = m.planLabel || MANT_PLAN_LABELS[m.plan] || m.plan || "—";
        const monto = Number(m.monto ?? MANT_PLAN_MONTO[m.plan] ?? 0);
        const estado = _mantEstadoHTML(fila);
        const origen = m.origen === "mp-webhook"
            ? `<span class="muted" style="font-size:11px">vía Mercado Pago</span>`
            : m.origen === "completados"
                ? `<span class="muted" style="font-size:11px">desde Completados</span>`
                : `<span class="muted" style="font-size:11px">carga manual</span>`;
        const wa = m.whatsapp
            ? `<a href="${escapeHtml(mantWaLink(m.whatsapp))}" target="_blank" style="color:#60A5FA">${escapeHtml(m.whatsapp)}</a>`
            : `<span class="muted">—</span>`;
        const dominio = m.dominio
            ? `<a href="${escapeHtml(mantDomainLink(m.dominio))}" target="_blank" rel="noopener noreferrer" style="color:#60A5FA">${escapeHtml(m.dominio)}</a>`
            : `<span class="muted">—</span>`;
        const period = mantCurrentPeriod(m);
        const pidio = mantUsedCurrentPeriod(m, period);
        const proximoReinicio = mantLongDate(period.next);
        const franja = `${mantShortDate(period.start)} al ${mantShortDate(period.next)}`;
        const diasCiclo = mantPeriodDays(period);
        const diasRestantes = Math.max(0, Math.ceil((period.next - new Date()) / 86400000));

        return `
            <tr class="client-row">
                <td>${escapeHtml(alta)}</td>
                <td>
                    <div style="font-weight:600">${escapeHtml(m.nombre || "—")}</div>
                    <div class="muted" style="font-size:12px">${escapeHtml(m.email || "")}</div>
                    ${clienteLink}
                </td>
                <td>
                    <div>${escapeHtml(planLabel)}</div>
                    <div class="muted" style="font-size:12px">${fmtMoney(monto)}/mes · ${origen}</div>
                </td>
                <td class="col-telefono">${wa}</td>
                <td>${dominio}</td>
                <td class="center">${estado}</td>
                <td class="center">
                    ${fila.clave === "baja" ? `<span class="muted">—</span>` : `
                    <label title="Se habilita nuevamente el ${escapeHtml(proximoReinicio)}" style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;justify-content:center">
                        <input type="checkbox" data-mant-check="${m.id}" ${pidio ? "checked" : ""} style="width:18px;height:18px;cursor:pointer;accent-color:#2563eb">
                    </label>
                    <div style="font-size:12px;font-weight:600;color:#93b4e8;margin-top:4px;white-space:nowrap">${escapeHtml(franja)}</div>
                    <div class="muted" style="font-size:11px;white-space:nowrap">ciclo de ${diasCiclo} días · se renueva ${diasRestantes === 0 ? "hoy" : `en ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`}</div>`}
                </td>
                <td class="actions-col">
                    <button class="btn-ghost" data-mant-edit="${m.id}" style="font-size:13px">✎ Editar</button>
                    <button class="icon-btn delete" data-mant-del="${m.id}" title="Eliminar">🗑</button>
                </td>
            </tr>`;
    }).join("");

    tbody.querySelectorAll("[data-mant-check]").forEach(chk => {
        chk.addEventListener("change", () => toggleCambiosPeriodo(chk.dataset.mantCheck, chk.checked));
    });
    tbody.querySelectorAll("[data-mant-edit]").forEach(btn => {
        btn.addEventListener("click", () => openMantModal(btn.dataset.mantEdit));
    });
    tbody.querySelectorAll("[data-mant-cliente]").forEach(btn => {
        btn.addEventListener("click", () => openModal(btn.dataset.mantCliente));
    });
    tbody.querySelectorAll("[data-mant-del]").forEach(btn => {
        btn.addEventListener("click", () => removeMant(btn.dataset.mantDel));
    });
    // "Quitar aviso" (celda Estado) y el tacho de las filas de avisos sin suscriptor.
    tbody.querySelectorAll("[data-mant-aviso-del]").forEach(btn => {
        btn.addEventListener("click", () => removeAvisoMant(btn.dataset.mantAvisoDel));
    });
}

async function toggleCambiosPeriodo(id, checked) {
    const m = mantenimiento.find(item => item.id === id);
    if (!m) return;
    try {
        await updateDoc(doc(db, "mantenimiento", id), {
            cambiosPeriodo: checked ? mantCurrentPeriod(m).key : "",
            cambiosMes: "",
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(err);
        alert("Error al guardar el cambio: " + err.message);
        renderMantenimiento(); // revertir el checkbox visual
    }
}

async function removeMant(id) {
    const m = mantenimiento.find(x => x.id === id);
    if (!m) return;
    if (!confirm(`¿Eliminar a "${m.nombre || m.email || "este suscriptor"}" de Mantenimiento?`)) return;
    try {
        await deleteDoc(doc(db, "mantenimiento", id));
    } catch (err) {
        console.error(err);
        alert("Error al eliminar: " + err.message);
    }
}

// ── Modal agregar / editar ──
const mantModal      = document.getElementById("mantModal");
const mantModalTitle = document.getElementById("mantModalTitle");
const mantCompletadoSelect = document.getElementById("mantCompletado");
let mantEditId = null;

function mantCompletadoOptionLabel(c) {
    const parts = [c.nombre, c.proyecto, c.telefono].map(v => String(v || "").trim()).filter(Boolean);
    return [...new Set(parts)].join(" · ") || "Cliente sin nombre";
}

function renderMantCompletadoOptions(selectedId = "") {
    if (!mantCompletadoSelect) return;
    const vinculados = new Map(
        mantenimiento
            .filter(m => m.completadoId)
            .map(m => [String(m.completadoId), m.id])
    );
    const options = completados.map(c => {
        const linkedMantId = vinculados.get(String(c.id));
        const ocupado = linkedMantId && linkedMantId !== mantEditId;
        const suffix = ocupado ? " — ya está en Mantenimiento" : "";
        return `<option value="${escapeHtml(c.id)}"${ocupado ? " disabled" : ""}>${escapeHtml(mantCompletadoOptionLabel(c) + suffix)}</option>`;
    }).join("");

    mantCompletadoSelect.innerHTML =
        `<option value="">Cargar datos manualmente</option>` +
        (options || `<option value="" disabled>No hay clientes en Completados</option>`);
    mantCompletadoSelect.value = selectedId || "";
}

function completarMantDesdeCompletado(completadoId) {
    const c = completados.find(item => item.id === completadoId);
    if (!c) return;
    document.getElementById("mantNombre").value = c.nombre || c.proyecto || "";
    document.getElementById("mantEmail").value = c.email || c.correo || "";
    document.getElementById("mantWhatsapp").value = c.whatsapp || c.telefono || "";
    document.getElementById("mantDominio").value = c.dominio || c.web || c.url || "";
}

function openMantModal(id) {
    mantEditId = id || null;
    const m = id ? mantenimiento.find(x => x.id === id) : null;
    mantModalTitle.textContent = m ? "Editar suscriptor" : "Agregar suscriptor";
    renderMantCompletadoOptions(m?.completadoId || "");
    document.getElementById("mantNombre").value   = m?.nombre   || "";
    document.getElementById("mantEmail").value    = m?.email    || "";
    document.getElementById("mantWhatsapp").value = m?.whatsapp || "";
    document.getElementById("mantDominio").value  = m?.dominio  || "";
    document.getElementById("mantPlan").value     = m
        ? (m.planLabel || MANT_PLAN_LABELS[m.plan] || m.plan || "")
        : "";
    document.getElementById("mantMonto").value    = m
        ? Number(m.monto ?? MANT_PLAN_MONTO[m.plan] ?? 0)
        : "";
    document.getElementById("mantEstado").value   = m?.estado   || "activo";
    document.getElementById("mantNotas").value    = m?.notas    || "";
    mantModal.hidden = false;
    document.getElementById("mantForm").scrollTop = 0;
}

function closeMantModal() { mantModal.hidden = true; mantEditId = null; }

document.getElementById("openMantModalBtn")?.addEventListener("click", () => openMantModal());
document.getElementById("closeMantModalBtn")?.addEventListener("click", closeMantModal);
document.getElementById("cancelMantBtn")?.addEventListener("click", closeMantModal);
mantCompletadoSelect?.addEventListener("change", (e) => completarMantDesdeCompletado(e.target.value));
mantModal?.addEventListener("click", (e) => {
    if (e.target === mantModal && !window.getSelection().toString().length) closeMantModal();
});

document.getElementById("mantForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const planLabel = document.getElementById("mantPlan").value.trim();
    const monto = Number(document.getElementById("mantMonto").value);
    const completadoId = mantCompletadoSelect?.value || "";
    if (!Number.isFinite(monto) || monto < 0) {
        alert("Ingresá un precio mensual válido.");
        return;
    }
    const duplicado = completadoId && mantenimiento.some(m => m.completadoId === completadoId && m.id !== mantEditId);
    if (duplicado) {
        alert("Ese cliente ya está agregado en Mantenimiento.");
        return;
    }
    const registroActual = mantEditId ? mantenimiento.find(m => m.id === mantEditId) : null;
    const data = {
        nombre:   document.getElementById("mantNombre").value.trim(),
        email:    document.getElementById("mantEmail").value.trim(),
        whatsapp: document.getElementById("mantWhatsapp").value.trim(),
        dominio:  document.getElementById("mantDominio").value.trim(),
        plan:      planLabel,
        planLabel,
        monto,
        completadoId,
        origen:   completadoId ? "completados" : (registroActual?.origen || "manual"),
        estado:   document.getElementById("mantEstado").value,
        notas:    document.getElementById("mantNotas").value.trim(),
        updatedAt: serverTimestamp()
    };
    if (registroActual && typeof registroActual.cambiosPeriodo !== "string") {
        const period = mantCurrentPeriod(registroActual);
        data.cambiosPeriodo = mantUsedCurrentPeriod(registroActual, period) ? period.key : "";
        data.cambiosMes = "";
    }
    try {
        if (mantEditId) {
            await updateDoc(doc(db, "mantenimiento", mantEditId), data);
        } else {
            await addDoc(collection(db, "mantenimiento"), {
                ...data,
                cambiosMes: "",
                cambiosPeriodo: "",
                createdAt: serverTimestamp(),
                createdBy: currentUser?.uid || null
            });
        }
        closeMantModal();
    } catch (err) {
        console.error(err);
        alert("Error al guardar: " + err.message);
    }
});

// ══════════════════════════════════════════════════════════
//   STATS
// ══════════════════════════════════════════════════════════
/* Cuatro lecturas, todas sobre datos que ya están en memoria:
   - Bocetos por día y por hora: TODAS las propuestas (el formulario llenado), por su createdAt.
   - Señas por día: clientes + completados con `senaAt` (lo registra setStatus al pasar un
     pago único a Cliente; antes del 10-sep-2026 era el mismo sello) o, del 10 al 14-sep-2026,
     `primerPagoAt`. Los clientes del servicio mensual sin pago inicial no entran; los demás
     sin fecha se informan aparte en vez de ensuciar el gráfico.
   - Total por semana: clientes activos + completados; el pago único suma su valor total y el
     servicio mensual, el primer pago del modelo del 10 al 14-sep-2026 o $0. */

const STATS_HOURS = Array.from({ length: 24 }, (_, h) => h);

function _statsDayCounts(dates) {
    const counts = SKETCH_DAY_STATS_ORDER.map(() => 0);
    dates.forEach(d => { counts[SKETCH_DAY_STATS_ORDER.indexOf(d.getDay())]++; });
    return counts;
}

function _statsHourCounts(dates) {
    const counts = STATS_HOURS.map(() => 0);
    dates.forEach(d => { counts[d.getHours()]++; });
    return counts;
}

function _statsHourGridHTML(counts, sustantivo) {
    const max = Math.max(1, ...counts);
    const cols = STATS_HOURS.map(h => {
        const count = counts[h];
        const height = count > 0 ? Math.max(Math.round((count / max) * 100), 8) : 0;
        const label = String(h).padStart(2, "0");
        return `
            <div class="sketch-hour-column" title="${label}:00 a ${label}:59 — ${count} ${sustantivo}${count === 1 ? "" : "s"}">
                <span class="sketch-hour-count">${count}</span>
                <span class="sketch-hour-bar" aria-hidden="true"><i style="height:${height}%"></i></span>
                <span class="sketch-hour-label">${label}</span>
            </div>`;
    }).join("");
    return `<div class="sketch-hour-grid sketch-hour-grid--24">${cols}</div>`;
}

/* Los bocetos que ya se convirtieron en cliente NO están en `propuestas`: al convertirlos se
   borra la propuesta original y su fecha queda guardada en el cliente (`propuestaFecha`).
   Contar solo `propuestas` mostraría únicamente los bocetos pendientes — 6 sobre decenas de
   histórico. Se suman ambas fuentes, salteando los clientes cuya propuesta sigue viva para
   no contar el mismo boceto dos veces. */
function _statsBocetoDates() {
    const vivas = propuestas.map(p => _parseSketchDate(p.createdAt)).filter(Boolean);
    const convertidos = _statsProyectos()
        .filter(c => !(c.propuestaId && propuestas.some(p => p.id === c.propuestaId)))
        .map(_clientSketchDate)
        .filter(Boolean);
    return [...vivas, ...convertidos];
}

function _statsPrimerPagoEntries() {
    // Los clientes sin pago inicial (14-sep-2026) no tienen primer pago que graficar ni que reclamar.
    const todos = _statsProyectos().filter(c => !_statsSinPagoInicial(c));
    const dates = todos.map(c => _parseSketchDate(c.primerPagoAt) || _parseSketchDate(c.senaAt)).filter(Boolean);
    return { dates, total: todos.length, sinFecha: todos.length - dates.length };
}

/* Desde el 10-sep-2026 la web entregada sigue en Clientes (con su plan) y además deja una
   copia en Completados con `clienteId`: se cuenta una sola vez, la del cliente vivo. */
function _statsProyectos() {
    const vivos = clients.filter(c => getEstado(c) === "cliente");
    const idsVivos = new Set(vivos.map(c => c.id));
    return [...vivos, ...completados.filter(x => !(x.clienteId && idsVivos.has(x.clienteId)))];
}

/* La semana sale de la fecha del boceto, pero MÁS DE LA MITAD de los proyectos no vienen de
   un boceto: los que Pablo carga a mano con "+ Nuevo cliente" y los importados no tienen
   `propuestaId` ni `propuestaFecha`. Medido el 30-jul-2026: 20 de 40 proyectos ($4.595.000)
   quedaban fuera del total por eso. Para esos se usa la fecha en que se completó el proyecto
   o en que se cargó el registro, que es su fecha real. */
function _statsFechaSemana(c) {
    return _clientSketchDate(c)
        || _parseSketchDate(c.completadoAt)
        || _parseSketchDate(c.createdAt);
}

/* Lo que suma cada proyecto a su semana (dos modalidades, 15-sep-2026). Pago único: su
   `valorTotal`, el precio completo del proyecto, como antes del 10-sep-2026. Servicio
   mensual: el primer pago si lo tuvo (modelo del 10 al 14-sep-2026) y si no, $0; las
   mensualidades no entran acá, la mensualidad activa está en el tab Clientes. Sin
   modalidad definida, lo que tenga cargado. */
function _statsTotalProyecto(c) {
    const modalidad = modalidadDe(c);
    if (_conSena(modalidad)) return Number(c.valorTotal) || 0;
    if (modalidad === "mensual") return _num(c.primerPago);
    return _num(c.primerPago) || Number(c.valorTotal) || 0;
}

function _statsSinFecha() {
    const fuera = _statsProyectos().filter(c => !_statsFechaSemana(c));
    return { count: fuera.length, total: fuera.reduce((s, c) => s + _statsTotalProyecto(c), 0) };
}

/* Cliente del servicio mensual sin primer pago (14-sep-2026 en adelante): suma $0 a
   propósito, así que no es un "valor total sin cargar" ni tiene cobro que graficar. */
function _statsSinPagoInicial(c) {
    return modalidadDe(c) === "mensual" && !_num(c.primerPago) && !c.primerPagoAt;
}

function _statsSemanas() {
    const porSemana = new Map();
    _statsProyectos().forEach(c => {
        const week = _weekForDate(_statsFechaSemana(c), "");
        if (week.key === "undated") return;   // sin ninguna fecha: no se lista
        if (!porSemana.has(week.key)) porSemana.set(week.key, { week, total: 0, count: 0, sinPagoInicial: 0 });
        const grupo = porSemana.get(week.key);
        grupo.total += _statsTotalProyecto(c);
        grupo.count++;
        if (_statsSinPagoInicial(c)) grupo.sinPagoInicial++;
    });
    if (!porSemana.size) return [];

    // Rellenar las semanas sin movimiento entre la más vieja y hoy, para que la serie
    // no tenga huecos: una semana que falta se lee como "falta el dato", no como "$0".
    const desde = Math.min(...[...porSemana.values()].map(s => s.week.sort));
    const hasta = _weekForDate(new Date(), "").sort;
    const cursor = new Date(desde);
    while (cursor.getTime() <= hasta) {
        const week = _weekForDate(new Date(cursor), "");
        if (!porSemana.has(week.key)) porSemana.set(week.key, { week, total: 0, count: 0, sinPagoInicial: 0 });
        cursor.setDate(cursor.getDate() + 7);
    }

    return [...porSemana.values()].sort((a, b) => b.week.sort - a.week.sort);
}

function _statsSemanasHTML() {
    const semanas = _statsSemanas();
    if (!semanas.length) {
        return `<p class="sketch-stats-empty">Todavía no hay clientes ni completados para sumar por semana.</p>`;
    }
    /* El count se muestra para poder distinguir una semana SIN proyectos (gris, $0) de una
       semana CON proyectos que suman $0 porque tienen el valor total sin cargar — que es lo
       que pasa cuando el boceto no traía precio calculado (ver `valorTotal` al convertir).
       Los clientes del servicio mensual suman $0 a propósito y no disparan el aviso. */
    const filas = semanas.map(s => {
        const sinValor = s.count > s.sinPagoInicial && s.total === 0;
        const clases = ["stats-week-row"];
        if (!s.count) clases.push("stats-week-row--vacia");
        if (sinValor) clases.push("stats-week-row--sin-valor");
        const detalle = s.count
            ? `<small>${s.count} proyecto${s.count === 1 ? "" : "s"}${sinValor ? " sin valor total cargado" : ""}${s.sinPagoInicial ? ` · ${s.sinPagoInicial} con servicio mensual` : ""}</small>`
            : "";
        return `
        <div class="${clases.join(" ")}">
            <span class="stats-week-label">${escapeHtml(s.week.label)}${detalle}</span>
            <span class="stats-week-total">${fmtMoney(s.total)}</span>
        </div>`;
    }).join("");
    const total = semanas.reduce((sum, s) => sum + s.total, 0);
    const fuera = _statsSinFecha();
    const nota = fuera.count > 0
        ? `<p class="stats-note">${fuera.count} proyecto${fuera.count === 1 ? "" : "s"} por ${fmtMoney(fuera.total)} en total no tiene${fuera.count === 1 ? "" : "n"} ninguna fecha, así que no entra${fuera.count === 1 ? "" : "n"} en ninguna semana ni en el total general.</p>`
        : "";
    return `${filas}
        <div class="stats-week-row stats-week-row--total">
            <span class="stats-week-label">Total general</span>
            <span class="stats-week-total">${fmtMoney(total)}</span>
        </div>
        ${nota}`;
}

function renderStats() {
    const el = document.getElementById("statsContent");
    if (!el) return;

    const bocetos = _statsBocetoDates();
    const pagos = _statsPrimerPagoEntries();

    const bocetosDia = bocetos.length
        ? _sketchStatsBarsHTML(WEEKDAY_NAMES_MON_FIRST, _statsDayCounts(bocetos))
        : `<p class="sketch-stats-empty">Todavía no hay bocetos con fecha.</p>`;

    const pagosDia = pagos.dates.length
        ? _sketchStatsBarsHTML(WEEKDAY_NAMES_MON_FIRST, _statsDayCounts(pagos.dates))
        : `<p class="sketch-stats-empty">Todavía no hay señas con fecha registrada.</p>`;

    const pagosNota = pagos.sinFecha > 0
        ? `<p class="stats-note">${pagos.sinFecha} de ${pagos.total} proyectos no tienen registrada la fecha de la seña y no entran en estos gráficos.</p>`
        : "";

    el.innerHTML = `
        <div class="sketch-stats">
            <div class="sketch-stats-col">
                <div class="sketch-stats-title">Bocetos por día (${bocetos.length})</div>
                ${bocetosDia}
            </div>
            <div class="sketch-stats-col">
                <div class="sketch-stats-title">Señas por día (${pagos.dates.length})</div>
                ${pagosDia}
                ${pagosNota}
            </div>
        </div>

        <div class="sketch-stats">
            <div class="sketch-stats-col sketch-stats-col--hours">
                <div class="sketch-stats-title">Bocetos por horario — las 24 horas</div>
                ${bocetos.length
                    ? _statsHourGridHTML(_statsHourCounts(bocetos), "boceto")
                    : `<p class="sketch-stats-empty">Todavía no hay bocetos con fecha.</p>`}
            </div>
        </div>

        <div class="sketch-stats">
            <div class="sketch-stats-col sketch-stats-col--hours">
                <div class="sketch-stats-title">Total por semana — planes anuales y pagos únicos</div>
                <div class="stats-weeks">${_statsSemanasHTML()}</div>
                <p class="stats-note">Los clientes del plan anual y los de pago único suman su valor total (seña y saldo); los cobros anuales de los años siguientes no entran acá. Los del plan mensual suman $0, salvo el pago inicial que cobró el modelo del 10 al 14-sep-2026. Las mensualidades no entran acá: la mensualidad activa está en Clientes.</p>
            </div>
        </div>`;
}
