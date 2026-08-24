const FORM_LEAD_URL = '/wabot/form-lead.php';

const WSP_NUM = '5491125068578';
const wspLink = msg => `https://wa.me/${WSP_NUM}?text=${encodeURIComponent(msg)}`;

const TRACK_URL = '/form/track.php';

const _sid = (() => {
    try {
        let s = sessionStorage.getItem('gky_sid');
        if (!s) {
            s = (crypto.randomUUID ? crypto.randomUUID()
                                   : Date.now() + '-' + Math.random().toString(16).slice(2));
            sessionStorage.setItem('gky_sid', s);
        }
        return s;
    } catch (_) {
        return Date.now() + '-' + Math.random().toString(16).slice(2);
    }
})();

function _detectarOrigen() {
    try {
        const params = new URLSearchParams(window.location.search);
        const p = (params.get('origen') || params.get('utm_source') || '').toLowerCase();
        if (/whatsapp|^wsp$|^wa$/.test(p)) return 'whatsapp';
        if (/instagram|^ig$/.test(p)) return 'instagram';

        const ref = (document.referrer || '').toLowerCase();
        if (ref.includes('instagram.com')) return 'instagram';
        if (ref.includes('wa.me') || ref.includes('whatsapp.com')) return 'whatsapp';

        return 'nativo';
    } catch (_) {
        return 'nativo';
    }
}

const _origen = (() => {
    try {
        const saved = sessionStorage.getItem('gky_origen');
        if (saved) return saved;
        const detectado = _detectarOrigen();
        sessionStorage.setItem('gky_origen', detectado);
        return detectado;
    } catch (_) {
        return _detectarOrigen();
    }
})();

// Se captura antes de limpiar la URL con replaceState, si no se pierden ?t=/?neg=.
const _paramsInicial = new URLSearchParams(window.location.search);

try {
    if (window.location.search && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
    }
} catch (_) {}

const _tracked = {};
function track(event) {
    if (_tracked[event]) return;
    _tracked[event] = true;
    try {
        const body = JSON.stringify({ sid: _sid, event, origen: _origen });
        if (navigator.sendBeacon) {
            navigator.sendBeacon(TRACK_URL, new Blob([body], { type: 'text/plain' }));
        } else {
            fetch(TRACK_URL, { method: 'POST', body, keepalive: true });
        }
    } catch (_) {}
}

track('enter');

(function _trackCampos() {
    const form = document.getElementById('propuestaForm');
    if (!form) return;

    const value = id => document.getElementById(id)?.value.trim() || '';

    function trackMilestones() {
        const phoneDigits = value('telefono').replace(/\D/g, '');
        const milestones = [
            ['field_nombre', value('nombre') !== ''],
            ['field_negocio', value('nombre_negocio') !== ''],
            ['field_rubro', value('resumen') !== ''],
            ['field_telefono', phoneDigits.length >= 10 && phoneDigits.length <= 15],
        ];
        for (const [event, complete] of milestones) {
            if (!complete) break;
            track(event);
        }
    }

    ['pointerdown', 'focusin'].forEach(event => {
        form.addEventListener(event, () => {
            track('form_start');
            queueMicrotask(trackMilestones);
        }, { once: true });
    });

    form.addEventListener('input', trackMilestones);
    form.addEventListener('change', trackMilestones);
})();

const telefonoInput   = document.getElementById('telefono');
const telefonoAviso   = document.getElementById('telefonoConfirmado');
const telefonoCorregir = document.getElementById('telefonoCorregir');

function ocultarTelefono() {
    telefonoInput.hidden = true;
    telefonoAviso.hidden = false;
}
function mostrarTelefono() {
    telefonoInput.hidden = false;
    telefonoAviso.hidden = true;
    telefonoInput.focus();
}
telefonoCorregir?.addEventListener('click', mostrarTelefono);

telefonoInput.addEventListener('input', () => {
    telefonoInput.value = telefonoInput.value.replace(/[^\d+\s()-]/g, '').slice(0, 18);
});

(function _prellenarDesdeBot() {
    const mapa = { t: 'telefono', neg: 'nombre_negocio' };
    let precargados = 0;

    Object.keys(mapa).forEach((p) => {
        const v = (_paramsInicial.get(p) || '').trim().slice(0, 200);
        if (!v) return;
        const el = document.getElementById(mapa[p]);
        if (!el || el.value.trim() !== '') return;
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        precargados++;
    });

    const tel = (_paramsInicial.get('t') || '').trim();
    if (tel) {
        const digits = tel.replace(/\D/g, '');
        const num = document.createElement('strong');
        num.textContent = digits;
        telefonoAviso.textContent = 'Te vamos a escribir a este número: ';
        telefonoAviso.appendChild(num);
        telefonoAviso.append('. ¿No es el tuyo? ');
        telefonoAviso.appendChild(telefonoCorregir);
        ocultarTelefono();
    }

    if (!precargados) return;
    track('prefill');

    const aviso = document.createElement('p');
    aviso.className = 'form-tip';
    aviso.style.cssText = 'background:rgba(37,180,90,.10);border:1px solid rgba(37,180,90,.35)';
    aviso.textContent = '✓ Ya cargamos algunos datos con lo que nos contaste por WhatsApp — revisá que estén bien.';
    document.querySelector('.form-section')?.insertAdjacentElement('beforebegin', aviso);
})();

// Evita que Enter recargue la página vía submit nativo.
document.getElementById('propuestaForm').addEventListener('submit', (e) => e.preventDefault());

const btnEnviar = document.getElementById('btnEnviar');
btnEnviar.addEventListener('click', () => {
    if (btnEnviar.disabled) return;
    if (!validateForm()) return;
    enviarFormulario();
});

function validateForm() {
    clearErrors();

    let valid = true;
    let firstError = null;

    [
        { id: 'nombre', msg: 'Contanos tu nombre.' },
        { id: 'nombre_negocio', msg: 'Contanos el nombre de tu negocio o marca.' },
        { id: 'resumen', msg: 'Contanos brevemente qué ofrecés.' },
        { id: 'colores', msg: 'Contanos los colores de tu identidad.' },
    ].forEach(({ id, msg }) => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            markError(el, msg);
            valid = false;
            if (!firstError) firstError = el;
        }
    });

    if (!telefonoInput.hidden) {
        const telefonoDigits = telefonoInput.value.replace(/\D/g, '');
        if (!telefonoInput.value.trim()) {
            markError(telefonoInput, 'Por favor ingresá un número de teléfono o WhatsApp.');
            valid = false;
            if (!firstError) firstError = telefonoInput;
        } else if (telefonoDigits.length < 10 || telefonoDigits.length > 15) {
            markError(telefonoInput, 'Ingresá un teléfono válido: entre 10 y 15 números.');
            valid = false;
            if (!firstError) firstError = telefonoInput;
        }
    }

    if (!valid && firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
}

function markError(input, msg) {
    input.classList.add('error');
    const span = document.createElement('span');
    span.className   = 'error-msg visible';
    span.textContent = msg;
    input.parentNode.appendChild(span);
}

function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(e => e.remove());
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
}

function buildPayload() {
    const get = id => (document.getElementById(id)?.value ?? '').trim();
    return {
        t: get('telefono'),
        nombre: get('nombre'),
        nombre_negocio: get('nombre_negocio'),
        resumen: get('resumen'),
        colores: get('colores'),
    };
}

async function enviarFormulario() {
    btnEnviar.disabled = true;
    btnEnviar.classList.add('loading');
    btnEnviar.textContent = 'Enviando…';

    const payload = buildPayload();

    try {
        const res = await fetch(FORM_LEAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || 'respuesta inválida');

        track('success');
        clearDraft();
        showSuccess(payload.nombre, payload.nombre_negocio);
    } catch (err) {
        console.error('Error al enviar el formulario:', err);
        alert('Ocurrió un error. Por favor intentá de nuevo o escribinos por WhatsApp.');
        btnEnviar.disabled = false;
        btnEnviar.classList.remove('loading');
        btnEnviar.textContent = 'Enviar →';
    }
}

function mensajeFormWsp(nombre, nombreNegocio) {
    const lineas = [`Hola! Acabo de completar el formulario de la muestra gratis.`, ''];
    lineas.push(`🙋 Nombre: ${nombre || 'sin nombre'}`);
    lineas.push(`🏢 Negocio: ${nombreNegocio || 'sin nombre'}`);
    lineas.push('', 'Quedo atento/a!');
    return lineas.join('\n');
}

function showSuccess(nombre, nombreNegocio) {
    const card = document.getElementById('formCard');
    const url = wspLink(mensajeFormWsp(nombre, nombreNegocio));
    window.open(url, '_blank', 'noopener');
    card.innerHTML = `
        <div class="success-screen">
            <div class="success-icon">✅</div>
            <h2 class="success-title">¡Listo, recibimos tus datos!</h2>
            <span class="success-badge">⏱️ De 24 a 48hs tendremos tu muestra</span>
            <p class="success-desc">
                Te estamos abriendo WhatsApp para coordinar los próximos pasos. Si no se abrió solo, tocá el botón de acá abajo.
            </p>
            <a href="${url}" class="btn-wsp-form" target="_blank" rel="noopener">💬 Abrir WhatsApp</a>
            <a href="https://www.gokywebs.com" class="success-link">Mientras tanto, explorá nuestros trabajos →</a>
        </div>
    `;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

document.querySelectorAll('textarea.autosize').forEach(ta => {
    autoGrow(ta);
    ta.addEventListener('input', () => autoGrow(ta));
});

const DRAFT_KEY = 'gky_form_draft';
const DRAFT_FIELDS = ['nombre', 'nombre_negocio', 'resumen', 'colores', 'telefono'];

function saveDraft() {
    try {
        const d = { fields: {} };
        DRAFT_FIELDS.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value.trim()) d.fields[id] = el.value;
        });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch (_) {}
}

function restoreDraft() {
    let d;
    try { d = JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch (_) { return; }
    if (!d) return;

    Object.entries(d.fields || {}).forEach(([id, v]) => {
        const el = document.getElementById(id);
        if (!el || el.value.trim()) return;
        el.value = v;
        if (el.classList.contains('autosize')) autoGrow(el);
    });
}

function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
}

const _formEl = document.getElementById('propuestaForm');
_formEl.addEventListener('input', saveDraft);
_formEl.addEventListener('change', saveDraft);

restoreDraft();
