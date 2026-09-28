/*
 * GokyWebs – err/err.js
 * Avisa al panel admin cuando la web tiene un error. Se pega UNA línea en el <head>:
 *     <script src="https://gokywebs.com/err/err.js" defer></script>
 * No hay que registrar la web en ningún lado: se reconoce sola por su dominio y aparece
 * en la pestaña Errores del admin (con el nombre del cliente si su dominio está cargado).
 * En localhost y en dominios de prueba (vercel.app, etc.) no manda nada.
 *
 * Reporta:  errores de JavaScript, promesas rechazadas, scripts/CSS que no cargan
 *           y pedidos fetch que devuelven 5xx.  Ignora lo que no es de la web
 *           (extensiones del navegador, "Script error." de terceros, etc.).
 * No toca nada de la página y nunca tira un error propio.
 */
(function () {
  "use strict";
  try {
    var ENDPOINT = "https://gokywebs.com/err/log.php";
    var MAX = 8;              // reportes por carga de página
    var enviados = 0;
    var vistos = {};
    var host = location.host;
    var nativeFetch = window.fetch;

    // Solo cuenta la web en su dominio real: nada de localhost, IPs ni previews.
    if (/^(localhost|127\.|\[|\d+\.\d+\.\d+\.\d+)/.test(host) || /\.(test|local|localhost)$/.test(host) ||
        /(^|\.)(vercel\.app|netlify\.app|pages\.dev|github\.io|hostingersite\.com|onrender\.com|web\.app|firebaseapp\.com)$/.test(host)) return;

    function mismoOrigen(u) {
      try { return new URL(u, location.href).host === host; } catch (_) { return false; }
    }
    function esRuido(msg, src) {
      msg = String(msg || "");
      if (!msg || msg === "Script error." || msg === "Script error") return true;
      if (/ResizeObserver loop/i.test(msg)) return true;
      if (/^(chrome|moz|safari)-extension:/i.test(String(src || ""))) return true;
      if (/^(Load failed|Failed to fetch|NetworkError|Network request failed)/i.test(msg)) return true;
      return false;
    }
    function enviar(r) {
      if (enviados >= MAX) return;
      var clave = r.tipo + "|" + r.msg + "|" + r.src + "|" + r.line;
      if (vistos[clave]) return;
      vistos[clave] = 1;
      enviados++;
      r.url = location.pathname;
      var body = JSON.stringify(r);
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }));
        } else if (nativeFetch) {
          nativeFetch.call(window, ENDPOINT, { method: "POST", body: body, keepalive: true });
        }
      } catch (_) {}
    }

    // Señal de vida: una vez por día por navegador, para que la web aparezca en el
    // panel aunque nunca falle nada.
    try {
      var hoy = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem("gw_err_ping") !== hoy) {
        localStorage.setItem("gw_err_ping", hoy);
        var ping = JSON.stringify({ tipo: "ping" });
        if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, new Blob([ping], { type: "text/plain" }));
        else if (nativeFetch) nativeFetch.call(window, ENDPOINT, { method: "POST", body: ping, keepalive: true });
      }
    } catch (_) {}

    // Errores de JS y recursos que no cargan (los de recursos no burbujean: capture=true).
    window.addEventListener("error", function (e) {
      try {
        var t = e.target;
        if (t && t !== window && t.tagName) {
          var tag = t.tagName.toLowerCase();
          var url = t.src || t.href || "";
          if (!url || (tag !== "script" && tag !== "link" && tag !== "img")) return;
          var critico = mismoOrigen(url) && (tag === "script" || (tag === "link" && t.rel === "stylesheet"));
          enviar({ tipo: "recurso", nivel: critico ? "alto" : "bajo", msg: "No cargó " + tag + ": " + url, src: url, line: 0, col: 0, stack: "" });
          return;
        }
        if (esRuido(e.message, e.filename)) return;
        enviar({
          tipo: "error",
          nivel: e.filename && !mismoOrigen(e.filename) ? "bajo" : "alto",
          msg: e.message, src: e.filename || "", line: e.lineno || 0, col: e.colno || 0,
          stack: (e.error && e.error.stack) || ""
        });
      } catch (_) {}
    }, true);

    window.addEventListener("unhandledrejection", function (e) {
      try {
        var r = e.reason;
        var msg = r && r.message ? r.message : String(r);
        if (esRuido(msg, "")) return;
        enviar({ tipo: "promesa", nivel: "alto", msg: msg, src: "", line: 0, col: 0, stack: (r && r.stack) || "" });
      } catch (_) {}
    });

    // fetch que devuelve 5xx: importante si es de la propia web, menor si es de un tercero.
    if (nativeFetch) {
      window.fetch = function (input) {
        var p = nativeFetch.apply(this, arguments);
        try {
          var u = typeof input === "string" ? input : (input && input.url) || "";
          if (u.indexOf(ENDPOINT) !== 0) {
            p.then(function (res) {
              if (res && res.status >= 500) {
                var limpio = u.split("?")[0];
                enviar({ tipo: "fetch", nivel: mismoOrigen(u) ? "alto" : "bajo", msg: "HTTP " + res.status + " en " + limpio, src: limpio, line: 0, col: 0, stack: "" });
              }
            }, function () {});
          }
        } catch (_) {}
        return p;
      };
    }
  } catch (_) {}
})();
