// Guard de autenticación, header y estado de configuración de ARCA del panel.
import { auth } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { $ } from './utils.js?v=20261004';
import { estado } from './state.js?v=20261004';
import { initClientes } from './clientes.js?v=20261004';

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    estado.user = user;
    $('userEmail').textContent = user.email;

    await cargarEstadoArca();
    initClientes();
});

$('logoutBtn').addEventListener('click', () => signOut(auth));

export async function cargarEstadoArca() {
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/config.php', { headers: { Authorization: 'Bearer ' + token } });
        const datos = await res.json();
        estado.arca = datos.ok ? datos : { configurado: false };
    } catch (err) {
        estado.arca = { configurado: false };
    }
    const listo = estado.arca.configurado && estado.arca.certListo;
    $('arcaBanner').hidden = !!listo;
    return estado.arca;
}
