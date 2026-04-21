/* ─────────────────────────────────────────────
   GokyWebs – Formulario de leads (página única)
   Envío por Email (EmailJS)
   ───────────────────────────────────────────── */

const EMAILJS_SERVICE  = 'service_wg4bw4e';
const EMAILJS_TEMPLATE = 'template_o8ju6cu';
const EMAILJS_KEY      = '5lJCf2hCkPyXNXwas';
const SHEETS_URL       = 'https://script.google.com/macros/s/AKfycbwkCSm6DFckoRWhlGuoEW3BqOovtUySN_jLA_I7j26WGWu22S418wycNdHdN-_1UzAW/exec';

/* ── Init EmailJS ── */
emailjs.init(EMAILJS_KEY);

/* ── DOM refs ── */
const btnSubmit = document.getElementById('btnSubmit');

/* ──────────────────────────────────────────────
   Submit
   ────────────────────────────────────────────── */
btnSubmit.addEventListener('click', () => {
    if (!validateAll()) return;
    sendToEmail();
});

/* ──────────────────────────────────────────────
   Validación completa del formulario
   ────────────────────────────────────────────── */
function validateAll() {
    // Limpiar errores previos
    document.querySelectorAll('.error-msg').forEach(e => e.remove());
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

    let valid = true;
    let firstError = null;

    // Campos de texto requeridos
    const nombre  = document.getElementById('nombre');
    const celular = document.getElementById('celular');
    const negocio = document.getElementById('negocio');

    if (!nombre.value.trim())  { markInputError(nombre,  'Por favor ingresá tu nombre.');          valid = false; firstError = firstError || nombre; }
    if (!celular.value.trim()) { markInputError(celular, 'Por favor ingresá tu celular.');         valid = false; firstError = firstError || celular; }
    if (!negocio.value.trim()) { markInputError(negocio, 'Contanos a qué se dedica tu negocio.'); valid = false; firstError = firstError || negocio; }

    // Grupos de radio requeridos
    const radioGroups = [
        { id: 'hosting', name: 'hosting' },
    ];

    radioGroups.forEach(({ id, name }) => {
        if (!getRadioValue(name)) {
            const el = document.getElementById(id);
            markGroupError(el, 'Seleccioná una opción.');
            valid = false;
            firstError = firstError || el;
        }
    });

    // Checkboxes: al menos uno
    if (!document.querySelectorAll('input[name="objetivo"]:checked').length) {
        const el = document.getElementById('objetivo');
        markGroupError(el, 'Seleccioná al menos una opción.');
        valid = false;
        firstError = firstError || el;
    }

    if (!valid && firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
}

function markInputError(input, msg) {
    input.classList.add('error');
    const err = document.createElement('span');
    err.className   = 'error-msg visible';
    err.textContent = msg;
    input.parentNode.appendChild(err);
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
    const objetivos   = getCheckboxValues('objetivo').join(', ');
    const hosting     = getRadioValue('hosting');
    const referencia  = document.getElementById('referencia').value.trim() || '(no respondió)';
    const por_que     = document.getElementById('por_que').value.trim() || '(no respondió)';
    const fecha       = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    btnSubmit.classList.add('loading');
    btnSubmit.textContent = 'Enviando';

    const templateParams = {
        nombre, celular, negocio, objetivos,
        hosting, referencia, por_que, fecha,
    };

    try {
        await Promise.allSettled([
            emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams),
            fetch(SHEETS_URL, {
                method: 'POST',
                body: JSON.stringify(templateParams),
            }),
        ]);
        showSuccessScreen(nombre);
    } catch (err) {
        console.error('Error al enviar:', err);
        btnSubmit.classList.remove('loading');
        btnSubmit.textContent = 'Enviar consulta ✉️';
        alert('Ocurrió un error al enviar. Por favor intentá de nuevo.');
    }
}

/* ──────────────────────────────────────────────
   Success screen con animación
   ────────────────────────────────────────────── */
function showSuccessScreen(nombre) {
    const card = document.querySelector('.form-card');

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
