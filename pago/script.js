/* Página de pago de seña — sin wizard, para el cliente que ya vio la muestra
   y quiere avanzar. Con ?monto= en la URL va derecho al checkout de Mercado
   Pago (ver "Auto-redirect" al final del archivo); la página completa con
   los dos medios (transferencia o form manual de MP) queda de fallback.

   Monto dinámico por link: gokywebs.com/pago?monto=60000 cobra exactamente
   ese valor (Pablo arma el link con el monto real de cada cliente: 60.000
   para landing, 90.000 para el resto, o cualquier otro importe puntual —
   saldo, adicional, etc.). Sin el parámetro, cae al default $90.000.
   OJO: es "monto", no "pago" — "?pago=fallido" ya existe en esta misma
   página para el aviso de pago rechazado (ver checkFailedPayment más abajo);
   reusar esa clave para el monto lo pisaría. */

const WHATSAPP_NUMBER = '5491125068578'; // número real de Gokywebs (mismo que el resto del sitio)
const ALIAS = 'pablotravis';
const MONTO_DEFAULT = 90000;

function getMontoFromQuery() {
    const raw = new URLSearchParams(window.location.search).get('monto');
    if (!raw) return null;
    const n = Math.floor(Number(raw));
    // Sanity: entero positivo dentro de un rango razonable — evita basura o valores absurdos en el link.
    if (!Number.isFinite(n) || n < 1000 || n > 5000000) return null;
    return n;
}

const MONTO_PARAM = getMontoFromQuery(); // null si no vino ?monto= o vino inválido
const MONTO = MONTO_PARAM ?? MONTO_DEFAULT;
const MONTO_FMT = '$' + MONTO.toLocaleString('es-AR');

function pintarMonto() {
    ['montoTitle', 'montoTransfer', 'montoTimeline', 'montoRedirect'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = MONTO_FMT;
    });
}
pintarMonto();

function toast(msg, type = 'info') {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

/* ── Copiar alias ── */
document.getElementById('btnCopyAlias')?.addEventListener('click', async () => {
    const btn = document.getElementById('btnCopyAlias');
    try {
        await navigator.clipboard.writeText(ALIAS);
        btn.classList.add('copied');
        btn.innerHTML = '✓ Copiado';
        toast('Alias copiado', 'success');
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copiar`;
        }, 2000);
    } catch (e) {
        toast('No se pudo copiar. Alias: ' + ALIAS, 'error');
    }
});

/* ── Botón "Ya transferí" → WhatsApp con mensaje precargado ──
   Se arma con el nombre si ya lo escribió en el form de Mercado Pago;
   si no, un mensaje genérico igual de válido. */
function updateTransferLink() {
    const nombre = document.getElementById('mp-nombre')?.value.trim();
    const lines = nombre
        ? [`Hola! Soy ${nombre}.`, `Transferí ${MONTO_FMT} para mi proyecto, ya te paso el comprobante.`]
        : [`Hola! Transferí ${MONTO_FMT} para mi proyecto, ya te paso el comprobante.`];
    const link = document.getElementById('btnWspTransfer');
    if (link) link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join(' '))}`;
}
document.getElementById('mp-nombre')?.addEventListener('input', updateTransferLink);
updateTransferLink();

/* ── Banner de reintento (?pago=fallido) ── */
(function checkFailedPayment() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pago') === 'fallido') {
        document.getElementById('retryBanner')?.classList.add('visible');
        toast('El pago no pudo procesarse. Intentá nuevamente.', 'error');
    }
})();

/* ── Validación del form de Mercado Pago ── */
function validateForm() {
    let ok = true;

    const nombre = document.getElementById('mp-nombre').value.trim();
    const errNombre = document.getElementById('err-nombre');
    if (nombre.length < 3) {
        document.getElementById('mp-nombre').classList.add('error');
        errNombre.classList.add('visible'); ok = false;
    } else {
        document.getElementById('mp-nombre').classList.remove('error');
        errNombre.classList.remove('visible');
    }

    const tel = document.getElementById('mp-tel').value.replace(/\D/g, '');
    const errTel = document.getElementById('err-tel');
    if (tel.length < 7 || tel.length > 15) {
        document.getElementById('mp-tel').classList.add('error');
        errTel.classList.add('visible'); ok = false;
    } else {
        document.getElementById('mp-tel').classList.remove('error');
        errTel.classList.remove('visible');
    }

    return ok;
}

async function handlePayment(e) {
    e.preventDefault();
    if (!validateForm()) { toast('Completá tu nombre y WhatsApp', 'error'); return; }

    const nombre   = document.getElementById('mp-nombre').value.trim();
    const pais     = document.getElementById('mp-pais').value;
    const tel      = document.getElementById('mp-tel').value.trim();
    const whatsapp = pais + ' ' + tel;

    const reference = 'GKY-PAGO-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();

    localStorage.setItem('gky_pago', JSON.stringify({ reference, nombre, whatsapp }));

    const btn = document.getElementById('btnPay');
    btn.disabled = true;
    btn.textContent = 'Procesando…';

    try {
        const res = await fetch('api/crear-preferencia.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, whatsapp, reference, monto: MONTO })
        });
        const data = await res.json();
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            throw new Error(data.message || data.error || 'Error al crear preferencia');
        }
    } catch (err) {
        console.error(err);
        toast('Error al conectar con Mercado Pago. Intentá de nuevo o abonás por transferencia.', 'error');
        btn.disabled = false;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Pagar con Mercado Pago`;
    }
}

document.getElementById('mpForm')?.addEventListener('submit', handlePayment);

/* ── Auto-redirect a Mercado Pago ──
   Los links gokywebs.com/pago?monto=X van derecho al checkout de MP, sin pedir nombre/whatsapp
   (crear-preferencia.php ya los trata como opcionales). Si falla la creación de la preferencia,
   o si es un reintento tras un pago fallido (?pago=fallido), se muestra la página completa
   (transferencia + form manual de MP) tal como funcionaba antes. */
const autoRedirectEl = document.getElementById('autoRedirect');
const pagoHeroEl     = document.getElementById('pagoHero');
const pagoMainEl     = document.getElementById('pagoMain');
const isRetry = new URLSearchParams(window.location.search).get('pago') === 'fallido';

function showFullPage() {
    if (autoRedirectEl) autoRedirectEl.hidden = true;
    if (pagoHeroEl) pagoHeroEl.hidden = false;
    if (pagoMainEl) pagoMainEl.hidden = false;
}

async function autoRedirectToMP() {
    const reference = 'GKY-PAGO-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    localStorage.setItem('gky_pago', JSON.stringify({ reference, nombre: '', whatsapp: '' }));
    try {
        const res = await fetch('api/crear-preferencia.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: '', whatsapp: '', reference, monto: MONTO })
        });
        const data = await res.json();
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            throw new Error(data.message || data.error || 'Error al crear preferencia');
        }
    } catch (err) {
        console.error(err);
        showFullPage();
        toast('No pudimos conectar con Mercado Pago. Elegí un medio de pago abajo.', 'error');
    }
}

document.getElementById('btnVerOtrasFormas')?.addEventListener('click', showFullPage);

if (MONTO_PARAM !== null && !isRetry) {
    autoRedirectToMP();
} else {
    showFullPage();
}
