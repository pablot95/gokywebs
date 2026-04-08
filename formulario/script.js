/* ─────────────────────────────────────────────
   GokyWebs – Formulario de leads
   Envío por WhatsApp: +5491125068578
   ───────────────────────────────────────────── */

const WHATSAPP_NUMBER = '5491125068578';
const TOTAL_STEPS = 8;

let currentStep = 1;

/* ── DOM refs ── */
const form        = document.getElementById('leadForm');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const btnBack     = document.getElementById('btnBack');
const btnNext     = document.getElementById('btnNext');
const btnSubmit   = document.getElementById('btnSubmit');

/* ── Init ── */
updateUI();

/* ──────────────────────────────────────────────
   Navigation
   ────────────────────────────────────────────── */
btnNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
        showStep(currentStep + 1);
    }
});

btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
});

btnSubmit.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    sendToWhatsApp();
});

/* ──────────────────────────────────────────────
   Show a step
   ────────────────────────────────────────────── */
function showStep(newStep) {
    const current = document.querySelector('.step.active');
    if (current) {
        current.classList.remove('active');
    }

    currentStep = newStep;

    const next = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (next) next.classList.add('active');

    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ──────────────────────────────────────────────
   Update progress & buttons
   ────────────────────────────────────────────── */
function updateUI() {
    const pct = (currentStep / TOTAL_STEPS) * 100;
    progressFill.style.width = pct + '%';
    progressLabel.textContent = `Paso ${currentStep} de ${TOTAL_STEPS}`;

    btnBack.style.display   = currentStep > 1 ? 'inline-flex' : 'none';
    btnNext.style.display   = currentStep < TOTAL_STEPS ? 'inline-flex' : 'none';
    btnSubmit.style.display = currentStep === TOTAL_STEPS ? 'inline-flex' : 'none';
}

/* ──────────────────────────────────────────────
   Validation
   ────────────────────────────────────────────── */
function validateStep(step) {
    const stepEl = document.querySelector(`.step[data-step="${step}"]`);
    let valid = true;

    // Clear previous errors
    stepEl.querySelectorAll('.error-msg').forEach(e => e.remove());
    stepEl.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

    switch (step) {
        case 1: {
            const nombre  = document.getElementById('nombre');
            const negocio = document.getElementById('negocio');
            if (!nombre.value.trim()) {
                markInputError(nombre, 'Por favor ingresá tu nombre.');
                valid = false;
            }
            if (!negocio.value.trim()) {
                markInputError(negocio, 'Contanos a qué se dedica tu negocio.');
                valid = false;
            }
            break;
        }
        case 2: {
            if (!getRadioValue('antiguedad')) {
                markGroupError(document.getElementById('antiguedad'), 'Seleccioná una opción.');
                valid = false;
            }
            break;
        }
        case 3: {
            const checked = document.querySelectorAll('input[name="objetivo"]:checked');
            if (checked.length === 0) {
                markGroupError(document.getElementById('objetivo'), 'Seleccioná al menos una opción.');
                valid = false;
            }
            break;
        }
        case 4: {
            if (!getRadioValue('web_actual')) {
                markGroupError(document.getElementById('web_actual'), 'Seleccioná una opción.');
                valid = false;
            }
            break;
        }
        case 5: {
            if (!getRadioValue('hosting')) {
                markGroupError(document.getElementById('hosting'), 'Seleccioná una opción.');
                valid = false;
            }
            break;
        }
        case 6: {
            if (!getRadioValue('cuando')) {
                markGroupError(document.getElementById('cuando'), 'Seleccioná una opción.');
                valid = false;
            }
            break;
        }
        case 7:
            // Optional – sin validación obligatoria
            break;
        case 8: {
            if (!getRadioValue('facturacion')) {
                markGroupError(document.getElementById('facturacion'), 'Seleccioná una opción.');
                valid = false;
            }
            break;
        }
    }

    return valid;
}

function markInputError(input, msg) {
    input.classList.add('error');
    const err = document.createElement('span');
    err.className = 'error-msg visible';
    err.textContent = msg;
    input.parentNode.appendChild(err);
    input.focus();
}

function markGroupError(groupEl, msg) {
    groupEl.classList.add('error');
    const err = document.createElement('span');
    err.className = 'error-msg visible';
    err.textContent = msg;
    // Insert after the grid
    groupEl.insertAdjacentElement('afterend', err);
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */
function getRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
}

function getCheckboxValues(name) {
    const els = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(els).map(e => e.value);
}

/* ──────────────────────────────────────────────
   Build & send WhatsApp message
   ────────────────────────────────────────────── */
function sendToWhatsApp() {
    const nombre      = document.getElementById('nombre').value.trim();
    const negocio     = document.getElementById('negocio').value.trim();
    const antiguedad  = getRadioValue('antiguedad');
    const objetivos   = getCheckboxValues('objetivo').join(', ');
    const web_actual  = getRadioValue('web_actual');
    const hosting     = getRadioValue('hosting');
    const cuando      = getRadioValue('cuando');
    const por_que     = document.getElementById('por_que').value.trim();
    const facturacion = getRadioValue('facturacion');

    const lines = [
        '🚀 *Nuevo lead – Formulario GokyWebs*',
        '─────────────────────────',
        `👤 *Nombre:* ${nombre}`,
        `💼 *Negocio:* ${negocio}`,
        `📅 *Operando hace:* ${antiguedad}`,
        `🎯 *Objetivos:* ${objetivos}`,
        `💻 *Web actual:* ${web_actual}`,
        `🖥️ *Hosting/Dominio:* ${hosting}`,
        `⏱️ *Cuándo empezar:* ${cuando}`,
        `💡 *Por qué la necesita:* ${por_que || '(no respondió)'}`,
        `💵 *Facturación mensual:* ${facturacion}`,
        '─────────────────────────',
        '_Enviado desde el formulario de GokyWebs_',
    ];

    const message = lines.join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Show success screen before opening WhatsApp
    showSuccessScreen();

    setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, 600);
}

/* ──────────────────────────────────────────────
   Success screen
   ────────────────────────────────────────────── */
function showSuccessScreen() {
    const card = document.querySelector('.form-card');
    const navButtons = document.querySelector('.nav-buttons');
    const progress = document.querySelector('.progress-container');

    card.innerHTML = `
        <div class="success-screen active">
            <div class="success-icon">🎉</div>
            <h2 class="success-title">¡Listo, ${document.getElementById('nombre')?.value.trim() || ''}!</h2>
            <p class="success-desc">
                Se va a abrir WhatsApp con toda tu información lista para enviar.<br><br>
                Te respondemos en menos de 24 h. 🚀
            </p>
        </div>
    `;

    navButtons.style.display = 'none';
    progress.style.display  = 'none';
}

/* ──────────────────────────────────────────────
   Remove error styling on user interaction
   ────────────────────────────────────────────── */
document.addEventListener('input', e => {
    if (e.target.classList.contains('text-input')) {
        e.target.classList.remove('error');
        const msg = e.target.parentNode.querySelector('.error-msg');
        if (msg) msg.remove();
    }
});

document.addEventListener('change', e => {
    if (e.target.type === 'radio' || e.target.type === 'checkbox') {
        const group = e.target.closest('.options-grid');
        if (group) {
            group.classList.remove('error');
            const msg = group.nextElementSibling;
            if (msg && msg.classList.contains('error-msg')) msg.remove();
        }
    }
});
