/* ─────────────────────────────────────────────
   GokyWebs – Propuesta
   Envío por EmailJS + guardado en Firestore
   ───────────────────────────────────────────── */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    updateDoc,
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

// Mismo número y formato de link que usa /presupuesto/ para derivar al chat de Gokywebs.
const WSP_NUM = '5491125068578';
const wspLink = msg => `https://wa.me/${WSP_NUM}?text=${encodeURIComponent(msg)}`;

const EMAILJS_SERVICE  = 'service_jeo1y89';
const EMAILJS_TEMPLATE = 'template_4r7jfpf';
const EMAILJS_KEY      = 'GM-0KaBeSqUFyILXV';

emailjs.init(EMAILJS_KEY);

/* ─────────────────────────────────────────────
   Tracking interno del embudo (entradas → paso 2 → envío)
   Registra sesiones únicas en /form/track.php. Sin terceros.
   ───────────────────────────────────────────── */
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

/* ── Origen de la visita: whatsapp / instagram / nativo ──
   1) Query param explícito (recomendado, tagear los links del bot de WhatsApp
      y el link de la bio de Instagram con ?origen=whatsapp / ?origen=instagram).
   2) Fallback por document.referrer (best-effort: WhatsApp casi nunca manda
      referrer entre apps, pero el navegador in-app de Instagram a veces sí).
   3) Default 'nativo' (visita directa a gokywebs.com, Google, etc). */
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

/* Captura los parámetros del link ANTES de limpiarlos de la URL:
   el bot de WhatsApp manda datos para pre-llenar (?t= &neg= &r=). */
const _paramsInicial = new URLSearchParams(window.location.search);

/* Limpia el ?origen / ?utm_source de la barra de direcciones una vez capturado,
   para que quede /form/ prolijo (el origen ya está guardado para el tracking). */
try {
    if (window.location.search && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
    }
} catch (_) {}

const _tracked = {};
function track(event) {
    if (_tracked[event]) return;            // una vez por sesión y evento
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

/* Entrada a la página */
track('enter');

/* Llegada al paso 2: se dispara cuando el bloque deja de estar oculto */
(function _observeStep2() {
    const step2 = document.querySelector('.form-step[data-step="2"]');
    if (!step2) return;
    const obs = new MutationObserver(() => {
        if (!step2.hidden) { track('step2'); obs.disconnect(); }
    });
    obs.observe(step2, { attributes: true, attributeFilter: ['hidden'] });
})();

/* ── Microembudo acumulativo del paso 1.
      Cada evento exige que los anteriores también estén completos, incluso
      si la persona llena los campos en otro orden. ── */
(function _trackCamposPaso1() {
    const form = document.getElementById('propuestaForm');
    if (!form) return;

    const value = id => document.getElementById(id)?.value.trim() || '';

    function trackMilestones() {
        const phoneDigits = value('telefono').replace(/\D/g, '');
        // El orden refleja el orden visual del paso 1 (contacto al final).
        const milestones = [
            ['field_negocio', value('nombre_negocio') !== ''],
            ['field_rubro', value('rubro') !== ''],
            ['field_telefono', phoneDigits.length >= 10 && phoneDigits.length <= 15],
        ];

        for (const [event, complete] of milestones) {
            if (!complete) break;
            track(event);
        }
    }

    // Solo una interacción humana cuenta como inicio; el prellenado automático no.
    ['pointerdown', 'focusin'].forEach(event => {
        form.addEventListener(event, () => {
            track('form_start');
            queueMicrotask(trackMilestones);
        }, { once: true });
    });

    form.addEventListener('input', trackMilestones);
    form.addEventListener('change', trackMilestones);
})();

/* ── Pre-llenado desde el bot de WhatsApp ──
   El bot arma el link con parámetros, por ej.:
   /form?origen=whatsapp&t=5491123456789&neg=La%20Espiga&r=panader%C3%ADa
   Acá se vuelcan en los campos (solo si están vacíos; el usuario siempre puede corregir).
   Corre después de inicializar el microembudo. */
(function _prellenarDesdeBot() {
    const mapa = { t: 'telefono', neg: 'nombre_negocio', r: 'rubro' };
    let precargados = 0;

    Object.keys(mapa).forEach((p) => {
        const v = (_paramsInicial.get(p) || '').trim().slice(0, 200);
        if (!v) return;
        const el = document.getElementById(mapa[p]);
        if (!el || el.value.trim() !== '') return;
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true })); // autosize / estados visuales
        precargados++;
    });

    if (!precargados) return;
    track('prefill');

    // Avisito para que el usuario sepa que ya hay datos cargados y los revise.
    const aviso = document.createElement('p');
    aviso.className = 'form-tip';
    aviso.style.cssText = 'background:rgba(37,180,90,.10);border:1px solid rgba(37,180,90,.35)';
    aviso.textContent = '✓ Ya cargamos algunos datos con lo que nos contaste por WhatsApp — revisá que estén bien.';
    document.getElementById('stepsIndicator')?.insertAdjacentElement('beforebegin', aviso);
})();

/* ── Puente chat → form ──
   Quien llega desde el bot de WhatsApp cambia de app para caer acá: este aviso
   retoma la conversación para que el form se sienta continuación del chat y no
   un trámite nuevo (la fuga principal del funnel WhatsApp-first). */
(function _avisoOrigenWhatsapp() {
    if (_origen !== 'whatsapp') return;
    if (document.querySelector('.form-tip')) return; // el aviso de prefill ya hace de puente
    const aviso = document.createElement('p');
    aviso.className = 'form-tip';
    aviso.textContent = '';
    document.getElementById('stepsIndicator')?.insertAdjacentElement('beforebegin', aviso);
})();

/* ── Clasificación: la hace el bot de WhatsApp / Pablo, NO el form ──
   El form ya no pregunta el tipo de web ni muestra precios: solo junta info.
   Si el link trae ?tipo=… (lo arma el chat de WhatsApp), lo capturamos en silencio
   para guardarlo en el lead y adaptar un campo del paso 2 — nunca se muestra como pregunta. */
const TIPO_LABELS = {
    landing:               '🚀 Landing Page',
    ecommerce:             '🛒 E-commerce',
    catalogo:              '🏬 Catálogo administrable',
    inmobiliaria:          '🏠 Web Inmobiliaria',
    elearning:             '🎓 E-learning',
    reservas:              '📅 Sistema de reservas',
    'ecommerce-elearning': '🛒🎓 E-commerce + E-learning',
};

let tipoWeb = '';  // clasificación recibida del bot vía ?tipo= (vacía si entró directo)

/* Campos del paso 2 que dependen del tipo: la cantidad de cursos solo tiene sentido en
   e-learning. Ciudad/zona y una/multipágina quedan siempre visibles (sirven a cualquiera). */
function _aplicarTipo(tipo) {
    const esElearning = tipo === 'elearning' || tipo === 'ecommerce-elearning';
    const cursos = document.getElementById('elearningField');
    if (cursos) {
        cursos.style.display = esElearning ? '' : 'none';
        if (!esElearning) cursos.querySelectorAll('select').forEach(s => { s.value = ''; });
    }
}

/* ── Pre-llenar desde presupuesto ── */
(function() {
    const params = new URLSearchParams(window.location.search);
    const rubro = params.get('rubro');
    const tel   = params.get('tel');
    if (rubro) {
        const el = document.getElementById('rubro');
        if (el) { el.value = rubro; el.dispatchEvent(new Event('input')); }
    }
    if (tel) {
        const el = document.getElementById('telefono');
        if (el) el.value = tel;
    }
})();

const telefonoInput = document.getElementById('telefono');
telefonoInput.addEventListener('input', () => {
    telefonoInput.value = telefonoInput.value.replace(/[^\d+\s()-]/g, '').slice(0, 18);
});

/* ── Logo drag & drop ── */
let selectedLogoFile = null;

const logoDropzone    = document.getElementById('logoDropzone');
const logoInput       = document.getElementById('logoInput');
const logoPreview     = document.getElementById('logoPreview');
const logoPreviewImg  = document.getElementById('logoPreviewImg');
const logoPreviewName = document.getElementById('logoPreviewName');
const logoRemoveBtn   = document.getElementById('logoRemoveBtn');

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

/* ── Navegación de pasos (única fuente — antes duplicada en index.html) ── */
let currentStep = 1;

function goToStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.hidden = true);
    document.querySelector('.form-step[data-step="' + n + '"]').hidden = false;

    document.querySelectorAll('.step-dot').forEach(dot => {
        const s = parseInt(dot.dataset.s);
        dot.classList.remove('active', 'done');
        if (s === n) dot.classList.add('active');
        if (s < n)  dot.classList.add('done');
    });

    document.querySelectorAll('.step-connector').forEach((conn, i) => {
        conn.classList.toggle('done', i < n - 1);
    });

    // El paso 3 (presupuesto) no es carga de datos: ocultamos el indicador para dar foco al precio.
    const indicator = document.getElementById('stepsIndicator');
    if (indicator) indicator.style.display = n >= 3 ? 'none' : '';

    currentStep = n;
    document.getElementById('formCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('.btn-step-next').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep === 1 && !validateStep1()) return;
        goToStep(parseInt(btn.dataset.next));
    });
});

document.querySelectorAll('.btn-step-prev').forEach(btn => {
    btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.prev)));
});

/* El form nunca se envía por submit nativo (Enter no recarga la página) */
document.getElementById('propuestaForm').addEventListener('submit', (e) => e.preventDefault());

/* ── Botón "Enviar mis datos" → guarda el lead y muestra la confirmación ── */
const btnEnviar = document.getElementById('btnEnviar');
btnEnviar.addEventListener('click', () => {
    if (btnEnviar.disabled) return;
    if (!validateStep1()) { if (currentStep !== 1) goToStep(1); return; }
    enviarFormulario();
});

/* ── Validación (única fuente — el paso 1 tiene todos los campos obligatorios) ── */
function validateStep1() {
    clearErrors();

    let valid = true;
    let firstError = null;

    // Mismo orden visual del paso 1: rubro → teléfono
    // (así el scroll al primer error siempre va al campo más alto).
    [
        { id: 'rubro',    msg: 'Contanos sobre tu negocio y qué querés lograr con la web.' },
        { id: 'telefono', msg: 'Por favor ingresá un número de teléfono o WhatsApp.' },
    ].forEach(({ id, msg }) => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            markError(el, msg);
            valid = false;
            if (!firstError) firstError = el;
        }
    });

    const telefono = document.getElementById('telefono');
    const telefonoDigits = telefono.value.replace(/\D/g, '');
    if (telefono.value.trim() && (telefonoDigits.length < 10 || telefonoDigits.length > 15)) {
        if (!telefono.classList.contains('error')) {
            markError(telefono, 'Ingresá un teléfono válido: entre 10 y 15 números.');
        }
        valid = false;
        if (!firstError) firstError = telefono;
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

/* ─────────────────────────────────────────────
   Envío en un solo paso: "Enviar mis datos" (enviarFormulario) sube el logo,
   GUARDA el lead en Firestore (confirmoMuestra:true) y muestra la confirmación.
   Ya no hay paso de precio ni segundo botón: el form solo junta información.
   ───────────────────────────────────────────── */
let savedLeadId    = null;   // id del doc ya guardado (para actualizar si vuelve y reenvía)
let uploadedLogo   = null;   // { url, nombre } — se sube una sola vez

function buildLead() {
    const get = id => (document.getElementById(id)?.value ?? '').trim();

    const telefono      = get('telefono');
    const nombreNegocio = get('nombre_negocio');
    const rubroDesc     = get('rubro');
    const negocioRubro  = [nombreNegocio, rubroDesc].filter(Boolean).join(' — ');
    const ciudadZona    = get('ciudad_zona');
    const cantCursos    = get('cant_cursos');

    // Color pickers (type="color"): siempre traen un valor, no hace falta filtrar vacíos.
    const colorFondos     = get('color_fondos');
    const colorPrincipal  = get('color_principal');
    const colorSecundario = get('color_secundario');
    const coloresTotal = [
        `Color principal: ${colorPrincipal}`,
        `Color secundario: ${colorSecundario}`,
        `Fondos: ${colorFondos}`,
    ].join(' · ');

    // El tipo lo clasifica el bot/Pablo, no el form: se toma del ?tipo= si vino, si no queda vacío.
    const tipoLabel = tipoWeb ? (TIPO_LABELS[tipoWeb] || '') : '';
    const tipoPagina = document.querySelector('input[name="tipo_pagina"]:checked')?.value || 'Una página';

    const params = {
        telefono,
        negocio_rubro:      negocioRubro,
        nombre_negocio:     nombreNegocio,
        rubro:              rubroDesc,
        ciudad_zona:        ciudadZona,
        cant_cursos:        cantCursos,
        tipo_pagina:        tipoPagina,
        tipo_web:           tipoLabel,
        color_fondos:       colorFondos,
        color_principal:    colorPrincipal,
        color_secundario:   colorSecundario,
        colores:            coloresTotal,
        tipografias:        get('tipografias'),
        fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
    };

    return {
        params,
        firestoreExtra: {
            tipoDetectado:       tipoWeb,        // vacío si el form no recibió ?tipo= (Pablo clasifica después)
            tipoDetectadoLabel:  tipoLabel,
        },
    };
}

async function enviarFormulario() {
    btnEnviar.disabled = true;
    btnEnviar.classList.add('loading');
    btnEnviar.textContent = 'Enviando…';

    const lead = buildLead();

    /* ── Subir logo a Hostinger (una sola vez, aunque vuelva y reenvíe) ── */
    if (selectedLogoFile && !uploadedLogo) {
        try {
            const formData = new FormData();
            formData.append('logo', selectedLogoFile);
            const res  = await fetch(LOGO_UPLOAD_URL, { method: 'POST', body: formData });
            const json = await res.json();
            if (json.url) {
                uploadedLogo = { url: json.url, nombre: selectedLogoFile.name };
            } else {
                throw new Error(json.error || 'respuesta inválida');
            }
        } catch (err) {
            console.warn('No se pudo subir el logo:', err);
            uploadedLogo = { url: '', nombre: selectedLogoFile.name + ' (no subido)' };
        }
    }
    if (uploadedLogo) {
        lead.params.logoUrl    = uploadedLogo.url;
        lead.params.logoNombre = uploadedLogo.nombre;
    }

    let presupuestoId = null;
    try { presupuestoId = localStorage.getItem('gky_lead_id') || null; } catch(_) {}

    const firestoreData = {
        ...lead.params,
        ...lead.firestoreExtra,
        ...(presupuestoId ? { presupuestoId } : {}),
        // El form ahora es un solo envío: mandar = quiere la muestra (ya no hay paso de precio).
        confirmoMuestra: true,
        confirmadoAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    try {
        if (savedLeadId) {
            // Volvió atrás y reenvió: actualiza el mismo lead, no crea otro.
            await updateDoc(doc(db, 'propuestas', savedLeadId), firestoreData);
        } else {
            const ref = await addDoc(collection(db, 'propuestas'), {
                ...firestoreData,
                createdAt: serverTimestamp(),
            });
            savedLeadId = ref.id;
        }
        track('success');
        clearDraft();
        showSuccess(lead.params.nombre_negocio, lead.params.rubro);
    } catch (err) {
        console.error('Error al guardar el lead:', err);
        alert('Ocurrió un error. Por favor intentá de nuevo o escribinos por WhatsApp.');
        btnEnviar.disabled = false;
        btnEnviar.classList.remove('loading');
        btnEnviar.textContent = 'Enviar mis datos →';
    }
}

/* Mensaje que se abre al terminar el form: le llega a Pablo con el nombre del
   negocio ya cargado, así no tiene que ir a buscarlo al admin para arrancar
   la conversación — mismo criterio que mensajeMuestraWsp() en /presupuesto/. */
function mensajeFormWsp(nombreNegocio, rubro) {
    const lineas = [`Hola! Acabo de completar el formulario de la muestra gratis.`, ''];
    lineas.push(`🏢 Negocio: ${nombreNegocio || 'sin nombre'}`);
    if (rubro) lineas.push(`📌 Rubro: ${rubro}`);
    lineas.push('', 'Quedo atento/a!');
    return lineas.join('\n');
}

/* ── Pantalla de éxito: confirmación simple, sin precios ──
   El form es solo un brief: Pablo clasifica y arma la muestra, después contacta.
   Al terminar, deriva a WhatsApp con el nombre del negocio ya cargado en el
   mensaje. El link SIEMPRE se muestra como botón — el window.open() automático
   es best-effort y el navegador lo bloquea seguido, porque el await de
   enviarFormulario() ya rompió la cadena directa con el click del usuario. */
function showSuccess(nombreNegocio, rubro) {
    const card = document.getElementById('formCard');
    const url = wspLink(mensajeFormWsp(nombreNegocio, rubro));
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

/* ── Auto-resize textareas ── */
function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

document.querySelectorAll('textarea.autosize').forEach(ta => {
    autoGrow(ta);
    ta.addEventListener('input', () => autoGrow(ta));
});

/* ─────────────────────────────────────────────
   Borrador persistente — si el usuario recarga,
   no pierde lo que ya cargó (el logo no se puede
   persistir: es un File).
   ───────────────────────────────────────────── */
const DRAFT_KEY = 'gky_form_draft';
const DRAFT_FIELDS = [
    'telefono', 'nombre_negocio', 'rubro',
    'ciudad_zona', 'cant_cursos', 'color_fondos', 'color_principal', 'color_secundario',
    'tipografias'
];

function saveDraft() {
    try {
        const d = {
            fields: {},
            tipo_pagina: document.querySelector('input[name="tipo_pagina"]:checked')?.value || ''
        };
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
        if (!el) return;
        // Un input type="color" nunca está "vacío" (siempre trae el swatch por
        // default), así que la protección de abajo nunca se cumpliría para
        // ellos — nada más los pre-llena antes de esto, es seguro pisarlos.
        const isColor = el.type === 'color';
        if (isColor || !el.value.trim()) {
            el.value = v;
            if (el.classList.contains('autosize')) autoGrow(el);
        }
    });

    if (d.tipo_pagina) {
        const r = document.querySelector(`input[name="tipo_pagina"][value="${d.tipo_pagina}"]`);
        if (r) r.checked = true;
    }
}

function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
}

const _formEl = document.getElementById('propuestaForm');
_formEl.addEventListener('input', saveDraft);
_formEl.addEventListener('change', saveDraft);

/* ── Tipo recibido del bot de WhatsApp (?tipo=…) ──
   El chat ya clasificó al cliente y arma el link (gokywebs.com/wa?tipo=landing →
   /form/?origen=whatsapp&tipo=landing). El form NO pregunta el tipo ni lo muestra:
   solo lo capturamos en silencio para guardarlo en el lead (así Pablo lo ve en el
   admin) y adaptar el campo de cantidad de cursos del paso 2. Si el form no recibe
   ?tipo=, queda vacío y Pablo clasifica después. */
(function _capturarTipo() {
    // El origen limpia el ?tipo de la URL al cargar; lo guardamos en sessionStorage
    // por si la persona recarga la página.
    let raw = (_paramsInicial.get('tipo') || '').toLowerCase().trim();
    try {
        if (raw && TIPO_LABELS[raw]) sessionStorage.setItem('gky_tipo', raw);
        else if (!raw) raw = (sessionStorage.getItem('gky_tipo') || '').trim();
    } catch (_) {}
    if (TIPO_LABELS[raw]) tipoWeb = raw;
    _aplicarTipo(tipoWeb);
})();

restoreDraft();
