/*
 * GokyWebs – err/err.js
 * Avisa al panel admin cuando la web tiene un error. Se pega UNA línea en el <head>:
 *     <script src="https://gokywebs.com/err/err.js" defer></script>
 * No hay que registrar la web en ningún lado: se reconoce sola por su dominio y aparece
 * en la pestaña Errores del admin (con el nombre del cliente si su dominio está cargado).
 * En localhost y en dominios de prueba (vercel.app, etc.) no manda nada.
 *
 * Reporta:  errores de JavaScript, promesas rechazadas, scripts/CSS que no cargan
 *           y pedidos fetch o XMLHttpRequest que devuelven 5xx (si son de la propia web
 *           y responden JSON, con el motivo: el campo "error").  Ignora lo que no es de
 *           la web (extensiones, navegadores internos de apps, "Script error." de terceros,
 *           bots, etc.).  Qué es crítico lo decide el panel (erroresCritico en dashboard.js).
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
      src = String(src || "");
      if (!msg || msg === "Script error." || msg === "Script error") return true;
      if (/ResizeObserver loop/i.test(msg)) return true;
      // Un script que no vino por http(s) no es de la web: extensiones (chrome-extension:),
      // lo que inyecta el navegador interno de Instagram/Facebook en Android (iabjs://), etc.
      if (src && !/^https?:/i.test(src)) return true;
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

    // Bots y navegadores automatizados (buscadores, vistas previas de links, pruebas): lo que
    // les falla no le pasa a ninguna persona. Mandan la señal de vida y nada más.
    // (Cubot es una marca de celulares: "CUBOT P30" no es un bot.)
    var ua = String(navigator.userAgent || "");
    if (navigator.webdriver === true ||
        (/bot\b|crawl|spider|slurp|facebookexternalhit|meta-externalagent|meta-webindexer|headless|lighthouse|pagespeed|inspectiontool|curl\/|wget/i.test(ua) && !/cubot/i.test(ua))) return;

    // Un script o CSS propio que no cargó casi siempre es la conexión del visitante o un
    // bloqueador de anuncios (stats.js, visitas.js). Se le pregunta al servidor si el archivo
    // está: solo un 4xx/5xx es un problema de la web (falta el archivo o el servidor falla),
    // y viaja como "alto" con el código en detalle. Si está, va como aviso menor.
    function chequearArchivo(url, r) {
      if (!nativeFetch) { enviar(r); return; }
      var listo = false;
      var mandar = function (status) {
        if (listo) return;
        listo = true;
        if (status >= 400) { r.nivel = "alto"; r.detalle = "HTTP " + status; }
        enviar(r);
      };
      setTimeout(function () { mandar(0); }, 5000);
      try {
        nativeFetch.call(window, url, { method: "HEAD", cache: "no-store", credentials: "same-origin" })
          .then(function (res) { mandar(res ? res.status : 0); }, function () { mandar(0); });
      } catch (_) { mandar(0); }
    }

    // Errores de JS y recursos que no cargan (los de recursos no burbujean: capture=true).
    window.addEventListener("error", function (e) {
      try {
        var t = e.target;
        if (t && t !== window && t.tagName) {
          var tag = t.tagName.toLowerCase();
          var url = t.src || t.href || "";
          if (!url || (tag !== "script" && tag !== "link" && tag !== "img")) return;
          // <img src=""> (o con la dirección de la página): todavía no tiene foto, no es un archivo.
          if (tag === "img" && url.split("#")[0] === location.href.split("#")[0]) return;
          var r = { tipo: "recurso", nivel: "bajo", msg: "No cargó " + tag + ": " + url, src: url, line: 0, col: 0, stack: "" };
          if (mismoOrigen(url) && (tag === "script" || (tag === "link" && t.rel === "stylesheet"))) chequearArchivo(url, r);
          else enviar(r);
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

    // El motivo de un 5xx de la propia web: los api/*.php responden {"error": "<motivo>"}.
    // Solo el campo error, y solo si el cuerpo es JSON y chico.
    function motivoDe(texto) {
      try {
        texto = String(texto || "");
        if (texto.length > 20000) return "";
        var j = JSON.parse(texto);
        var m = j && typeof j.error === "string" ? j.error : "";
        return m.replace(/\s+/g, " ").trim().slice(0, 200);
      } catch (_) { return ""; }
    }

    // fetch que devuelve 5xx: importante si es de la propia web, menor si es de un tercero.
    if (nativeFetch) {
      window.fetch = function (input) {
        var p = nativeFetch.apply(this, arguments);
        try {
          var u = typeof input === "string" ? input : (input && input.url) || "";
          if (u.indexOf(ENDPOINT) !== 0) {
            p.then(function (res) {
              try {
                if (!res || res.status < 500) return;
                var limpio = u.split("?")[0];
                var propio = mismoOrigen(u) && (!res.url || mismoOrigen(res.url));
                var r = { tipo: "fetch", nivel: mismoOrigen(u) ? "alto" : "bajo", msg: "HTTP " + res.status + " en " + limpio, src: limpio, line: 0, col: 0, stack: "" };
                var tipoCuerpo = (res.headers && res.headers.get("content-type")) || "";
                if (!propio || !/json/i.test(tipoCuerpo) || typeof res.clone !== "function") { enviar(r); return; }
                // Se lee una copia en segundo plano: la respuesta original queda intacta para la web.
                // Si el cuerpo no llega en 3 s, se avisa igual sin el motivo.
                var listo = false;
                var mandar = function (motivo) {
                  if (listo) return;
                  listo = true;
                  if (motivo) r.detalle = motivo;
                  enviar(r);
                };
                setTimeout(function () { mandar(""); }, 3000);
                res.clone().text().then(function (t) { mandar(motivoDe(t)); }, function () { mandar(""); });
              } catch (_) {
                try { if (r && !listo) { listo = true; enviar(r); } } catch (_) {}
              }
            }, function () {});
          }
        } catch (_) {}
        return p;
      };
    }

    // Lo mismo con XMLHttpRequest: las subidas con barra de progreso de los paneles
    // (admin-upload.php) no pasan por fetch, y un 500 ahí también es la web que falla.
    var XHR = window.XMLHttpRequest;
    if (XHR && XHR.prototype && XHR.prototype.open && XHR.prototype.send) {
      var xhrAbrir = XHR.prototype.open;
      var xhrMandar = XHR.prototype.send;
      XHR.prototype.open = function (metodo, u) {
        try { this.__gwErrUrl = String(u || ""); } catch (_) {}
        return xhrAbrir.apply(this, arguments);
      };
      XHR.prototype.send = function () {
        try {
          var xhr = this;
          var u = xhr.__gwErrUrl || "";
          if (u && u.indexOf(ENDPOINT) !== 0) {
            xhr.addEventListener("loadend", function () {
              try {
                if (xhr.status < 500) return;
                var limpio = u.split("?")[0];
                var r = { tipo: "fetch", nivel: mismoOrigen(u) ? "alto" : "bajo", msg: "HTTP " + xhr.status + " en " + limpio, src: limpio, line: 0, col: 0, stack: "" };
                if (mismoOrigen(u) && /json/i.test(xhr.getResponseHeader("content-type") || "")) {
                  var motivo = "";
                  if (xhr.responseType === "" || xhr.responseType === "text") motivo = motivoDe(xhr.responseText);
                  else if (xhr.responseType === "json" && xhr.response && typeof xhr.response.error === "string") motivo = xhr.response.error.replace(/\s+/g, " ").trim().slice(0, 200);
                  if (motivo) r.detalle = motivo;
                }
                enviar(r);
              } catch (_) {}
            });
          }
        } catch (_) {}
        return xhrMandar.apply(this, arguments);
      };
    }
  } catch (_) {}
})();
