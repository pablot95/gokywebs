/*
 * GokyWebs – demo/track.js
 * Contador de visitas por demo. Se incluye en cada demo con UNA sola línea:
 *     <script src="/demo/track.js" defer></script>
 * Detecta solo el nombre de la carpeta desde la URL (/demo/NombreCarpeta/...),
 * así la MISMA línea sirve para todos los demos sin tocar nada.
 *
 * Excluir tu propio dispositivo del conteo: abrí cualquier demo con ?notrack=1
 * una vez (queda guardado en ese navegador). Volver a contar: ?notrack=0
 */
(function () {
  "use strict";
  try {
    // 1) Solo la página principal del demo, nunca dentro de un iframe (el fondo animado).
    if (window.top !== window.self) return;

    // 2) Nombre de la carpeta del demo: /demo/<nombre>/...
    var m = location.pathname.match(/\/demo\/([^\/?#]+)/i);
    if (!m) return;
    var demo = decodeURIComponent(m[1]).toLowerCase();
    if (!demo || demo === "track.js" || demo === "track.php") return;

    // 3) Auto-exclusión del propio dispositivo (para no inflar el conteo con tus visitas).
    try {
      var q = new URLSearchParams(location.search);
      if (q.get("notrack") === "1") localStorage.setItem("gky_notrack", "1");
      if (q.get("notrack") === "0") localStorage.removeItem("gky_notrack");
      if (localStorage.getItem("gky_notrack") === "1") return;
    } catch (_) {}

    // 4) Identificador anónimo y persistente del visitante (mismo navegador = misma persona).
    var sid;
    try {
      sid = localStorage.getItem("gky_vid");
      if (!sid) {
        sid = (crypto.randomUUID ? crypto.randomUUID()
                                 : Date.now() + "-" + Math.random().toString(16).slice(2));
        localStorage.setItem("gky_vid", sid);
      }
    } catch (_) {
      sid = Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    // 5) Origen aproximado (solo para color, sin datos personales).
    var ref = "directo";
    try {
      var r = (document.referrer || "").toLowerCase();
      var p = (new URLSearchParams(location.search).get("origen") || "").toLowerCase();
      if (/whatsapp|^wa$|^wsp$/.test(p) || r.indexOf("wa.me") >= 0 || r.indexOf("whatsapp.com") >= 0) ref = "whatsapp";
      else if (/instagram|^ig$/.test(p) || r.indexOf("instagram.com") >= 0) ref = "instagram";
      else if (r) ref = "otro";
    } catch (_) {}

    // 6) Enviar la visita (una por carga de página).
    var body = JSON.stringify({ demo: demo, sid: sid, ref: ref });
    var URL_TRACK = "/demo/track.php";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(URL_TRACK, new Blob([body], { type: "text/plain" }));
    } else {
      fetch(URL_TRACK, { method: "POST", body: body, keepalive: true });
    }
  } catch (_) {}
})();
