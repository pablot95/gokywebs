// Configuración de Firebase — proyecto propio del facturador (separado del admin)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBGJYsAnlTPkwXAUdgFwaT8v_iHM5d24YI",
    authDomain: "facturador-3a0a2.firebaseapp.com",
    projectId: "facturador-3a0a2",
    storageBucket: "facturador-3a0a2.firebasestorage.app",
    messagingSenderId: "956785784804",
    appId: "1:956785784804:web:3ab0e2bc493d10cff5b9f1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
