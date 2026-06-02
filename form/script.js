/* ─────────────────────────────────────────────
   GokyWebs – Propuesta
   Envío por EmailJS + guardado en Firestore
   ───────────────────────────────────────────── */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ",
    authDomain: "gokywebs-967cd.firebaseapp.com",
    projectId: "gokywebs-967cd",
    storageBucket: "gokywebs-967cd.firebasestorage.app",
    messagingSenderId: "50030976147",
    appId: "1:50030976147:web:9f07245b536a75833a4166"
};

const _app = initializeApp(firebaseConfig);
const db   = getFirestore(_app);

const LOGO_UPLOAD_URL = '/form/upload-logo.php';

const EMAILJS_SERVICE  = 'service_wg4bw4e';
const EMAILJS_TEMPLATE = 'template_propuesta';
const EMAILJS_KEY      = '5lJCf2hCkPyXNXwas';

emailjs.init(EMAILJS_KEY);

/* ── Logo drag & drop ── */
let selectedLogoFile = null;

const logoDropzone   = document.getElementById('logoDropzone');
const logoInput      = document.getElementById('logoInput');
const logoPreview    = document.getElementById('logoPreview');
const logoPreviewImg = document.getElementById('logoPreviewImg');
const logoPreviewName= document.getElementById('logoPreviewName');
const logoRemoveBtn  = document.getElementById('logoRemoveBtn');

logoDropzone.addEventListener('click', () => logoInput.click());

logoInput.addEventListener('change', () => {
    if (logoInput.files[0]) setLogoFile(logoInput.files[0]);
});

logoDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    logoDropzone.classList.add('drag-over');
});
logoDropzone.addEventListener('dragleave', () => logoDropzone.classList.remove('drag-over'));
logoDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    logoDropzone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) setLogoFile(file);
});

function setLogoFile(file) {
    if (file.size > 10 * 1024 * 1024) {
        alert('El archivo supera el límite de 10 MB.');
        return;
    }
    selectedLogoFile = file;
    logoPreviewName.textContent = file.name;
    logoDropzone.style.display = 'none';
    logoPreview.style.display  = 'flex';
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => { logoPreviewImg.src = e.target.result; };
        reader.readAsDataURL(file);
    } else {
        logoPreviewImg.src = '';
        logoPreviewImg.style.display = 'none';
    }
}

logoRemoveBtn.addEventListener('click', () => {
    selectedLogoFile = null;
    logoInput.value  = '';
    logoPreviewImg.src = '';
    logoPreviewImg.style.display = 'block';
    logoPreview.style.display  = 'none';
    logoDropzone.style.display = '';
});

/* ── Yes/No toggles ── */
document.querySelectorAll('.yn-group').forEach(group => {
    group.querySelectorAll('.yn-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            group.querySelectorAll('.yn-btn').forEach(b => b.className = 'yn-btn');
            btn.classList.add('yn-active-' + btn.dataset.val);
        });
    });
});

/* ── DOM refs ── */
const btnEnviar = document.getElementById('btnEnviar');
btnEnviar.addEventListener('click', () => {
    if (validateAll()) sendForm();
});

/* ── Validación ── */
function validateAll() {
    clearErrors();

    let valid = true;
    let firstError = null;

    const fields = [
        { id: 'nombre',          msg: 'Por favor ingresá tu nombre.' },
        { id: 'telefono',        msg: 'Por favor ingresá un número de teléfono o WhatsApp.' },
        { id: 'nombre_negocio',  msg: 'Por favor ingresá el nombre del negocio o marca.' },
        { id: 'rubro',           msg: 'Contanos a qué se dedica tu negocio.' },
    ];

    fields.forEach(({ id, msg }) => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            markError(el, msg);
            valid = false;
            if (!firstError) firstError = el;
        }
    });

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

/* ── Envío ── */
async function sendForm() {
    const get = id => (document.getElementById(id)?.value ?? '').trim();

    const params = {
        nombre:          get('nombre'),
        nombre_negocio:  get('nombre_negocio'),
        telefono:        get('telefono'),
        rubro:           get('rubro'),
        colores:         get('colores_extra') || '(no completó)',
        tipografias:     get('tipografias')   || '(no completó)',
        referencias:     get('referencias')   || '(no completó)',
        fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
    };

    btnEnviar.classList.add('loading');
    btnEnviar.textContent = 'Enviando…';

    /* ── Subir logo a Hostinger si existe ── */
    if (selectedLogoFile) {
        try {
            const formData = new FormData();
            formData.append('logo', selectedLogoFile);
            const res  = await fetch(LOGO_UPLOAD_URL, { method: 'POST', body: formData });
            const json = await res.json();
            if (json.url) {
                params.logoUrl    = json.url;
                params.logoNombre = selectedLogoFile.name;
            } else {
                throw new Error(json.error || 'respuesta inválida');
            }
        } catch (err) {
            console.warn('No se pudo subir el logo:', err);
            params.logoUrl    = '';
            params.logoNombre = selectedLogoFile.name + ' (no subido)';
        }
    }

    try {
        await Promise.allSettled([
            emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params),
            addDoc(collection(db, 'propuestas'), {
                ...params,
                createdAt: serverTimestamp(),
            }),
        ]);
        showSuccess(params.nombre);
    } catch (err) {
        console.error('Error al enviar:', err);
        btnEnviar.classList.remove('loading');
        btnEnviar.textContent = 'Enviar brief ✉️';
        alert('Ocurrió un error al enviar. Por favor intentá de nuevo o escribinos por WhatsApp.');
    }
}

/* ── Pantalla de éxito ── */
function showSuccess(nombre) {
    const card = document.getElementById('formCard');
    card.innerHTML = `
        <div class="success-screen">
            <div class="success-icon">✅</div>
            <h2 class="success-title">¡Listo${nombre ? ', ' + nombre : ''}!</h2>
            <span class="success-badge">⏱️ Te respondemos en menos de 24 hs</span>
            <p class="success-desc">
                Recibimos tu brief con éxito.<br>
                Vamos a revisar todo y prepararte una propuesta personalizada.
            </p>
            <a href="https://www.gokywebs.com" class="success-link">Mientras tanto, explorá nuestros trabajos →</a>
        </div>
    `;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Auto-resize textareas ── */
function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

document.querySelectorAll('textarea.autosize').forEach(ta => {
    autoGrow(ta); // altura inicial
    ta.addEventListener('input', () => autoGrow(ta));
});
