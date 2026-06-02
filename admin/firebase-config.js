// Configuración compartida de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ",
    authDomain: "gokywebs-967cd.firebaseapp.com",
    projectId: "gokywebs-967cd",
    storageBucket: "gokywebs-967cd.firebasestorage.app",
    messagingSenderId: "50030976147",
    appId: "1:50030976147:web:9f07245b536a75833a4166"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
