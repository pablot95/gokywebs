// Configuración e inicialización de Firebase para HolaMor
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBPyTPVST7-oIYthkyFF3CuTseVd9-wCyk",
    authDomain: "holamor-db986.firebaseapp.com",
    projectId: "holamor-db986",
    storageBucket: "holamor-db986.firebasestorage.app",
    messagingSenderId: "1001949608615",
    appId: "1:1001949608615:web:efa4c284e31336e8e0f982"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
