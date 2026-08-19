export function formatTime(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds || 0));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

// Redondea a fracciones de 15 min para tasks completadas: si sobran menos de
// 2 min desde el último cuarto de hora se descartan (redondea abajo); 2 min o
// más redondea al próximo cuarto. Ej: 92min->105min (1h45), 62min->75min (1h15).
// Es puramente un cálculo de display — nunca se guarda, así una task que
// vuelve a "en curso" recupera su tiempo real sin ninguna conversión inversa.
export function roundSecondsToQuarterHour(totalSeconds) {
    const totalMinutes = Math.max(0, totalSeconds || 0) / 60;
    const quarterBase = Math.floor(totalMinutes / 15) * 15;
    const remainder = totalMinutes - quarterBase;
    const roundedMinutes = remainder < 2 ? quarterBase : quarterBase + 15;
    return roundedMinutes * 60;
}

export function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s ?? '';
    return d.innerHTML;
}

const APP_TZ = 'America/Los_Angeles';

export function getDateKey(d = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: APP_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(d);
}

export function getDisplayDateLabel(d = new Date()) {
    const label = new Intl.DateTimeFormat('es-AR', {
        timeZone: APP_TZ,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(d);
    return label.charAt(0).toUpperCase() + label.slice(1);
}

export function toast(msg, type = 'info') {
    const tc = document.getElementById('toastContainer');
    if (!tc) return;
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const icons = { success: 'OK', error: 'Error', info: 'Info' };
    t.innerHTML = `<span>${icons[type] || 'Info'}</span><span>${escHtml(msg)}</span>`;
    tc.appendChild(t);
    setTimeout(() => {
        t.style.animation = 'toastOut .3s ease forwards';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}
