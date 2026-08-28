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

self.addEventListener('notificationclick', function (evento) {
    evento.notification.close();
    const destino = (evento.notification.data && (evento.notification.data.link || evento.notification.data.FCM_MSG))
        || '/wabot/admin.php';
    const url = typeof destino === 'string' ? destino : '/wabot/admin.php';

    /* Si el panel ya está abierto en alguna pestaña, se la trae al frente en
     * vez de abrir otra: tener seis pestañas del panel es peor que ninguna. */
    evento.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ventanas) {
            for (const v of ventanas) {
                if (v.url.includes('/wabot/admin.php') && 'focus' in v) {
                    if ('navigate' in v) v.navigate(url);
                    return v.focus();
                }
            }
            return self.clients.openWindow(url);
        })
    );
});
