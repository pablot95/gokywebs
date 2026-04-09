/* ─────────────────────────────────────────────
   GokyWebs – Formulario de leads
   Envío por Email (EmailJS)
   ───────────────────────────────────────────── */

const EMAILJS_SERVICE  = 'service_wg4bw4e';
const EMAILJS_TEMPLATE = 'template_o8ju6cu';
const EMAILJS_KEY      = '5lJCf2hCkPyXNXwas';
const TOTAL_STEPS      = 7;

let currentStep = 1;

/* ── Init EmailJS ── */
emailjs.init(EMAILJS_KEY);

/* ── DOM refs ── */
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const btnBack       = document.getElementById('btnBack');
const btnNext       = document.getElementById('btnNext');
const btnSubmit     = document.getElementById('btnSubmit');

updateUI();

/* ──────────────────────────────────────────────
   Navigation
   ────────────────────────────────────────────── */
btnNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
});

btnBack.addEventListener('click', () => {
    if (currentStep > 1) showStep(currentStep - 1);
});

btnSubmit.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    sendToEmail();
});

/* ──────────────────────────────────────────────
   Show a step
   ────────────────────────────────────────────── */
function showStep(newStep) {
    document.querySelector('.step.active')?.classList.remove('active');
    currentStep = newStep;
    document.querySelector(`.step[data-step="${currentStep}"]`)?.classList.add('active');
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ──────────────────────────────────────────────
   Update progress & buttons
   ────────────────────────────────────────────── */
function updateUI() {
    progressFill.style.width  = (currentStep / TOTAL_STEPS * 100) + '%';
    progressLabel.textContent = `Paso ${currentStep} de ${TOTAL_STEPS}`;
    btnBack.style.display     = currentStep > 1             ? 'inline-flex' : 'none';
    btnNext.style.display     = currentStep < TOTAL_STEPS   ? 'inline-flex' : 'none';
    btnSubmit.style.display   = currentStep === TOTAL_STEPS ? 'inline-flex' : 'none';
}

/* ──────────────────────────────────────────────
   Validation
   ────────────────────────────────────────────── */
function validateStep(step) {
    const stepEl = document.querySelector(`.step[data-step="${step}"]`);
    let valid = true;

    stepEl.querySelectorAll('.error-msg').forEach(e => e.remove());
    stepEl.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

    switch (step) {
        case 1: {
            const nombre  = document.getElementById('nombre');
            const celular = document.getElementById('celular');
            const negocio = document.getElementById('negocio');
            if (!nombre.value.trim())  { markInputError(nombre,  'Por favor ingresá tu nombre.');   valid = false; }
            if (!celular.value.trim()) { markInputError(celular, 'Por favor ingresá tu celular.');  valid = false; }
            if (!negocio.value.trim()) { markInputError(negocio, 'Contanos a qué se dedica tu negocio.'); valid = false; }
            break;
        }
        case 2:
            if (!getRadioValue('antiguedad'))
                { markGroupError(document.getElementById('antiguedad'), 'Seleccioná una opción.'); valid = false; }
            break;
        case 3:
            if (!document.querySelectorAll('input[name="objetivo"]:checked').length)
                { markGroupError(document.getElementById('objetivo'), 'Seleccioná al menos una opción.'); valid = false; }
            break;
        case 4:
            if (!getRadioValue('web_actual'))
                { markGroupError(document.getElementById('web_actual'), 'Seleccioná una opción.'); valid = false; }
            break;
        case 5:
            if (!getRadioValue('hosting'))
                { markGroupError(document.getElementById('hosting'), 'Seleccioná una opción.'); valid = false; }
            break;
        case 6:
            if (!getRadioValue('cuando'))
                { markGroupError(document.getElementById('cuando'), 'Seleccioná una opción.'); valid = false; }
            break;
        case 7:
            break; // opcional
    }
    return valid;
}

function markInputError(input, msg) {
    input.classList.add('error');
    const err = document.createElement('span');
    err.className   = 'error-msg visible';
    err.textContent = msg;
    input.parentNode.appendChild(err);
    input.focus();
}

function markGroupError(groupEl, msg) {
    groupEl.classList.add('error');
    const err = document.createElement('span');
    err.className   = 'error-msg visible';
    err.textContent = msg;
    groupEl.insertAdjacentElement('afterend', err);
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */
function getRadioValue(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value ?? null;
}
function getCheckboxValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(e => e.value);
}

/* ──────────────────────────────────────────────
   Send via EmailJS
   ────────────────────────────────────────────── */
async function sendToEmail() {
    const nombre      = document.getElementById('nombre').value.trim();
    const celular     = document.getElementById('celular').value.trim();
    const negocio     = document.getElementById('negocio').value.trim();
    const antiguedad  = getRadioValue('antiguedad');
    const objetivos   = getCheckboxValues('objetivo').join(', ');
    const web_actual  = getRadioValue('web_actual');
    const hosting     = getRadioValue('hosting');
    const cuando      = getRadioValue('cuando');
    const por_que     = document.getElementById('por_que').value.trim() || '(no respondió)';
    const fecha       = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    // Loading state
    btnSubmit.classList.add('loading');
    btnSubmit.textContent = 'Enviando';

    const templateParams = {
        nombre, celular, negocio, antiguedad, objetivos,
        web_actual, hosting, cuando, por_que, fecha,
    };

    try {
        await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams);
        showSuccessScreen(nombre);
    } catch (err) {
        console.error('EmailJS error:', err);
        btnSubmit.classList.remove('loading');
        btnSubmit.textContent = 'Enviar consulta ✉️';
        alert('Ocurrió un error al enviar. Por favor intentá de nuevo.');
    }
}

/* ──────────────────────────────────────────────
   Success screen con animación
   ────────────────────────────────────────────── */
function showSuccessScreen(nombre) {
    const card       = document.querySelector('.form-card');
    const navButtons = document.querySelector('.nav-buttons');
    const progress   = document.querySelector('.progress-container');

    navButtons.style.display = 'none';
    progress.style.display   = 'none';

    card.innerHTML = `
        <div class="success-screen active" id="successScreen">
            <div class="success-icon">✅</div>
            <h2 class="success-title">¡Listo${nombre ? ', ' + nombre : ''}!</h2>
            <span class="success-badge">⏱️ Te contactaremos en menos de 24 hs</span>
            <p class="success-desc">
                Recibimos tu consulta con éxito.<br>
                Un integrante de nuestro equipo<br>
                se va a poner en contacto con vos pronto.
            </p>
        </div>
    `;

    launchConfetti();
}

/* ──────────────────────────────────────────────
   Confetti
   ────────────────────────────────────────────── */
function launchConfetti() {
    const screen = document.getElementById('successScreen');
    if (!screen) return;
    const colors = ['#2563EB', '#22C55E', '#3B82F6', '#60A5FA', '#FCD34D', '#F472B6', '#16A34A'];

    for (let i = 0; i < 28; i++) {
        const dot = document.createElement('div');
        dot.className = 'confetti-dot';
        dot.style.left              = Math.random() * 100 + '%';
        dot.style.top               = '-12px';
        dot.style.background        = colors[Math.floor(Math.random() * colors.length)];
        dot.style.animationDelay    = (Math.random() * 0.5) + 's';
        dot.style.animationDuration = (0.7 + Math.random() * 0.8) + 's';
        dot.style.width             = (6 + Math.random() * 6) + 'px';
        dot.style.height            = dot.style.width;
        screen.appendChild(dot);
    }
}

/* ──────────────────────────────────────────────
   Clear errors on interaction
   ────────────────────────────────────────────── */
document.addEventListener('input', e => {
    if (e.target.classList.contains('text-input')) {
        e.target.classList.remove('error');
        e.target.parentNode.querySelector('.error-msg')?.remove();
    }
});

document.addEventListener('change', e => {
    if (e.target.type === 'radio' || e.target.type === 'checkbox') {
        const group = e.target.closest('.options-grid');
        if (group) {
            group.classList.remove('error');
            const msg = group.nextElementSibling;
            if (msg?.classList.contains('error-msg')) msg.remove();
        }
    }
});
