/* pago/planes.js — pestañas Mensual / Anual / Pago único de las páginas de /pago/.
 *
 * Cada modalidad es una página completa, con su propia dirección: se manda por
 * WhatsApp y funciona sola, también sin JavaScript. Acá solo se mejora el cambio
 * de pestaña: se trae la otra página, se cambia el contenido y la dirección, y
 * no se recarga. Si algo falla, el link se abre como siempre.
 */
(function () {
    'use strict';

    var zona = document.getElementById('plan');
    if (!zona) return;

    var estado = document.getElementById('plan-estado');
    var reducido = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* ── Copiar alias y CVU ──
     * Delegado en el documento: el contenido se reemplaza al cambiar de pestaña.
     * Clipboard API y, si no está (http o navegador viejo), el textarea de siempre. */
    function copiarViejo(valor) {
        var area = document.createElement('textarea');
        area.value = valor;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(area);
    }

    document.addEventListener('click', function (e) {
        var boton = e.target && e.target.closest ? e.target.closest('.copy-btn') : null;
        if (!boton) return;
        var valor = boton.dataset.copiar;
        var listo = function () {
            boton.textContent = 'Copiado';
            boton.classList.add('ok');
            setTimeout(function () { boton.textContent = 'Copiar'; boton.classList.remove('ok'); }, 1800);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(valor).then(listo, function () { copiarViejo(valor); listo(); });
        } else {
            copiarViejo(valor);
            listo();
        }
    });

    /* ── Cambio de pestaña sin recargar ── */
    if (!(window.fetch && window.Promise && window.DOMParser && window.history && history.pushState)) return;

    var cache = {};   // dirección → Promise({ html, titulo, descripcion })
    var pedido = 0;   // el último clic gana

    function sinHash(url) { return String(url).split('#')[0]; }

    function descripcionDe(doc) {
        var meta = doc.querySelector('meta[name="description"]');
        return meta ? (meta.getAttribute('content') || '') : '';
    }

    function cargar(url) {
        url = sinHash(url);
        if (!cache[url]) {
            var promesa = fetch(url, { credentials: 'same-origin' }).then(function (r) {
                if (!r.ok) throw new Error('http ' + r.status);
                return r.text();
            }).then(function (texto) {
                var doc = new DOMParser().parseFromString(texto, 'text/html');
                var otra = doc.getElementById('plan');
                if (!otra) throw new Error('la página no tiene #plan');
                return { html: otra.innerHTML, titulo: doc.title, descripcion: descripcionDe(doc) };
            });
            cache[url] = promesa;
            // Un error no queda guardado: el próximo intento vuelve a pedir.
            promesa.catch(function () { if (cache[url] === promesa) delete cache[url]; });
        }
        return cache[url];
    }

    // La página que se está viendo ya está cargada: volver a ella es instantáneo.
    cache[sinHash(location.href)] = Promise.resolve({
        html: zona.innerHTML,
        titulo: document.title,
        descripcion: descripcionDe(document)
    });

    function mostrar(datos, hrefEnfocado) {
        zona.innerHTML = datos.html;
        document.title = datos.titulo;
        var meta = document.querySelector('meta[name="description"]');
        if (meta && datos.descripcion) meta.setAttribute('content', datos.descripcion);

        var tarjeta = zona.querySelector('.plan-card');
        if (tarjeta && !reducido) tarjeta.classList.add('is-entering');

        // Quien navega con teclado sigue parado en la pestaña que eligió.
        if (hrefEnfocado) {
            var tabs = zona.querySelectorAll('.plan-tabs a');
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].getAttribute('href') === hrefEnfocado) { tabs[i].focus({ preventScroll: true }); break; }
            }
        }
        if (estado) estado.textContent = 'Mostrando ' + datos.titulo.split('|')[0].trim();
        if (zona.getBoundingClientRect().top < 0) zona.scrollIntoView();
    }

    function ir(url, hrefRelativo) {
        var mio = ++pedido;
        // Si tarda, la tarjeta se atenúa para que se note que hubo clic.
        var espera = setTimeout(function () { zona.classList.add('is-loading'); }, 150);
        cargar(url).then(function (datos) {
            if (mio !== pedido) return;
            clearTimeout(espera);
            zona.classList.remove('is-loading');
            history.pushState({ plan: true }, '', url);
            mostrar(datos, hrefRelativo);
        }).catch(function () {
            if (mio !== pedido) return;
            clearTimeout(espera);
            location.href = url;
        });
    }

    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var link = e.target && e.target.closest ? e.target.closest('.plan-tabs a') : null;
        if (!link || !zona.contains(link)) return;
        e.preventDefault();
        if (sinHash(link.href) === sinHash(location.href)) return;   // ya está en esa pestaña
        ir(link.href, link.getAttribute('href'));
    });

    // Atrás y adelante entre pestañas.
    window.addEventListener('popstate', function () {
        var mio = ++pedido;
        cargar(location.href).then(function (datos) {
            if (mio === pedido) { zona.classList.remove('is-loading'); mostrar(datos, null); }
        }).catch(function () {
            if (mio === pedido) location.reload();
        });
    });

    // Las otras dos pestañas se traen en segundo plano, así el clic es instantáneo.
    function precargar() {
        if (navigator.connection && navigator.connection.saveData) return;
        var tabs = zona.querySelectorAll('.plan-tabs a');
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].getAttribute('aria-current') !== 'page') cargar(tabs[i].href).catch(function () {});
        }
    }
    if (window.requestIdleCallback) requestIdleCallback(precargar, { timeout: 2500 });
    else setTimeout(precargar, 1200);
    zona.addEventListener('pointerenter', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('.plan-tabs a') : null;
        if (link) cargar(link.href).catch(function () {});
    }, true);
})();
