// Login / registro / recuperación de contraseña — Facturador
import { auth } from '../firebase-config.js';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const $ = id => document.getElementById(id);

// ─── Toggle entre vistas (login / registro / recuperar) ───
document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.view;
        document.querySelectorAll('.auth-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.auth-view').forEach(v => v.classList.remove('active'));
        $('view-' + target).classList.add('active');
    });
});

// ─── Mensajes de error amigables ───
function mensajeError(code) {
    const msgs = {
        'auth/invalid-credential': 'Email o contraseña incorrectos.',
        'auth/invalid-email': 'El email no es válido.',
        'auth/user-not-found': 'No existe una cuenta con ese email.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
        'auth/weak-password': 'La contraseña tiene que tener al menos 6 caracteres.',
        'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos.',
        'auth/network-request-failed': 'Error de red. Verificá tu conexión.',
    };
    return msgs[code] || `Error: ${code}`;
}

function mostrarError(el, code) {
    el.textContent = mensajeError(code);
    el.hidden = false;
}

// ─── Si ya hay sesión iniciada, ir directo al panel ───
onAuthStateChanged(auth, user => {
    if (user) window.location.href = 'panel.html';
});

// ─── LOGIN ───
$('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = $('loginError');
    errEl.hidden = true;
    const btn = $('loginBtn');
    btn.disabled = true; btn.textContent = 'Ingresando…';
    try {
        await signInWithEmailAndPassword(auth, $('loginEmail').value.trim(), $('loginPass').value);
    } catch (err) {
        mostrarError(errEl, err.code);
        btn.disabled = false; btn.textContent = 'Ingresar';
    }
});

// ─── REGISTRO ───
$('formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = $('registerError');
    errEl.hidden = true;
    const pass = $('registerPass').value;
    const pass2 = $('registerPass2').value;
    if (pass !== pass2) {
        errEl.textContent = 'Las contraseñas no coinciden.';
        errEl.hidden = false;
        return;
    }
    const btn = $('registerBtn');
    btn.disabled = true; btn.textContent = 'Creando cuenta…';
    try {
        await createUserWithEmailAndPassword(auth, $('registerEmail').value.trim(), pass);
    } catch (err) {
        mostrarError(errEl, err.code);
        btn.disabled = false; btn.textContent = 'Crear cuenta';
    }
});

// ─── RECUPERAR CONTRASEÑA ───
$('formReset').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = $('resetError');
    const okEl = $('resetSuccess');
    errEl.hidden = true; okEl.hidden = true;
    const btn = $('resetBtn');
    btn.disabled = true; btn.textContent = 'Enviando…';
    try {
        await sendPasswordResetEmail(auth, $('resetEmail').value.trim());
        okEl.textContent = 'Listo, revisá tu email para restablecer la contraseña.';
        okEl.hidden = false;
    } catch (err) {
        mostrarError(errEl, err.code);
    } finally {
        btn.disabled = false; btn.textContent = 'Enviar email';
    }
});
