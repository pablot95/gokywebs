/* firebase-messaging-sw.js — el service worker que recibe las notificaciones
 * del bot cuando el panel está cerrado.
 *
 * Tiene que vivir en la RAÍZ del dominio: el alcance de un service worker no
 * puede subir de su propia carpeta, y desde /wabot/ no podría atender los
 * clics que abren el panel. Firebase lo busca acá por defecto.
 *
 * Las notificaciones con `notification` las muestra el navegador solo; este
 * archivo existe para dos cosas: que existan cuando la pestaña está cerrada, y
 * que al tocarlas se abra el chat que las disparó en vez de una pestaña nueva.
 */

/* El clic se engancha ANTES de cargar Firebase, a propósito: el SDK registra
 * su propio notificationclick y corta la propagación, así que uno agregado
 * después no corría nunca y cada toque abría una pestaña más del panel. */
self.addEventListener('notificationclick', function (evento) {
    evento.stopImmediatePropagation();
    evento.notification.close();

    const datos = evento.notification.data || {};
    const fcm = datos.FCM_MSG || {};
    const link = (fcm.data && fcm.data.link) || (fcm.fcmOptions && fcm.fcmOptions.link) || datos.link;
    /* Solo se toma el camino del link y se lo cuelga de ESTE dominio: el server
     * manda www.gokywebs.com, y si el panel está abierto sin www, navegar a
     * otro origen desde el service worker falla. */
    let url = self.location.origin + '/wabot/admin.php';
    try {
        const u = new URL(String(link || ''), self.location.origin);
        if (u.pathname.startsWith('/wabot/')) url = self.location.origin + u.pathname + u.search;
    } catch (e) { /* link roto: queda el panel a secas */ }

    /* Si el panel ya está abierto en alguna pestaña, se la trae al frente en
     * vez de abrir otra: tener seis pestañas del panel es peor que ninguna. */
    evento.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ventanas) {
            for (const v of ventanas) {
                if (v.frameType === 'top-level' && v.url.includes('/wabot/admin.php') && 'focus' in v) {
                    return v.focus().then(function (c) { return (c || v).navigate(url); });
                }
            }
            return self.clients.openWindow(url);
        })
    );
});

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ',
    authDomain: 'gokywebs-967cd.firebaseapp.com',
    projectId: 'gokywebs-967cd',
    messagingSenderId: '50030976147',
    appId: '1:50030976147:web:9f07245b536a75833a4166'
});

firebase.messaging();
