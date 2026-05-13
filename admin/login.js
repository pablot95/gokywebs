import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("loginError");
const btn = document.getElementById("loginBtn");

// Si ya está logueado, ir al dashboard
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.replace("dashboard.html");
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    errorBox.textContent = "";
    btn.disabled = true;
    btn.querySelector(".btn-label").textContent = "Verificando...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace("dashboard.html");
    } catch (err) {
        let msg = "No se pudo iniciar sesión.";
        switch (err.code) {
            case "auth/invalid-email":
                msg = "Correo inválido."; break;
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
                msg = "Correo o contraseña incorrectos."; break;
            case "auth/too-many-requests":
                msg = "Demasiados intentos. Intentá más tarde."; break;
            case "auth/network-request-failed":
                msg = "Error de conexión."; break;
        }
        errorBox.textContent = msg;
        errorBox.hidden = false;
    } finally {
        btn.disabled = false;
        btn.querySelector(".btn-label").textContent = "Entrar";
    }
});
