/* ============================================================
   modelos/ver.js — un modelo a pantalla completa.

   ver.html?m=c                  modelo C
   ver.html?m=c&vista=celular    arranca en la vista de celular
   ver.html?m=c&partes=0         sin los nombres de las partes

   Computadora: el lienzo de 1200px, achicado si la pantalla es
   más chica. Celular: el mismo HTML en 366px, y el @container
   de style.css lo reacomoda solo.
   ============================================================ */
(function () {
    'use strict';

    var modelos = (typeof GW_MODELOS !== 'undefined') ? GW_MODELOS : [];
    var tipos = (typeof GW_MODELO_TIPOS !== 'undefined') ? GW_MODELO_TIPOS : [];
    if (!modelos.length) return;
    var LABEL_TIPO = {};
    tipos.forEach(function (t) { LABEL_TIPO[t.id] = t.label; });
    var rubros = (typeof GW_MODELO_RUBROS !== 'undefined') ? GW_MODELO_RUBROS : [];
    var LABEL_RUBRO = {};
    rubros.forEach(function (r) { LABEL_RUBRO[r.id] = r.label; });

    var p = new URLSearchParams(window.location.search);
    var id = String(p.get('m') || window.location.hash.replace('#', '')).toLowerCase();
    var idx = 0;
    modelos.forEach(function (m, i) { if (m.id === id) idx = i; });

    var vista = p.get('vista') === 'celular' || p.get('vista') === 'pc'
        ? p.get('vista')
        : (window.innerWidth < 700 ? 'celular' : 'pc');
    var partes = p.get('partes') !== '0';

    var $letra = document.getElementById('verLetra');
    var $nombre = document.getElementById('verNombre');
    var $rubro = document.getElementById('verRubro');
    var $claves = document.getElementById('verClaves');
    var $escenario = document.getElementById('verEscenario');
    var $partes = document.getElementById('verPartes');
    var $ant = document.getElementById('verAnt');
    var $sig = document.getElementById('verSig');
    var $volver = document.getElementById('verVolver');
    var $pregunta = document.getElementById('verPregunta');
    var $wsp = document.getElementById('verWsp');

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function url(m, extra) {
        return 'ver.html?m=' + encodeURIComponent(m.id) + (vista === 'celular' ? '&vista=celular' : '') + (extra || '');
    }

    function pintar() {
        var m = modelos[idx];
        document.title = 'Modelo ' + m.letra + ' · ' + m.nombre + ' — GokyWebs';
        $letra.textContent = m.letra;
        $nombre.textContent = 'Modelo ' + m.letra + ' · ' + m.nombre;
        $rubro.textContent = LABEL_RUBRO[(m.rubros || [])[0]] || LABEL_TIPO[m.tipo] || m.tipo;
        $claves.innerHTML = m.claves.map(function (c) {
            return '<div><dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + '</dd></div>';
        }).join('');

        var wire = GW_WIRE.render(m);
        if (vista === 'pc') {
            $escenario.innerHTML =
                '<div class="ver-pc">' +
                    '<div class="ver-navegador" aria-hidden="true"><i></i><i></i><i></i><span>tumarca.com.ar</span></div>' +
                    '<div class="ver-pc-pantalla"><div class="md-alto"><div class="md-lienzo">' + wire + '</div></div></div>' +
                '</div>';
            GW_WIRE.encajar($escenario.querySelector('.ver-pc-pantalla'), $escenario.querySelector('.md-lienzo'), 1200);
        } else {
            $escenario.innerHTML = '<div class="ver-cel"><div class="ver-cel-pantalla">' + wire + '</div></div>';
        }
        $escenario.querySelector('.wf').classList.toggle('con-partes', partes);

        [].forEach.call(document.querySelectorAll('.ver-seg button'), function (b) {
            b.setAttribute('aria-pressed', b.dataset.vista === vista ? 'true' : 'false');
        });
        $partes.checked = partes;

        var principal = (m.rubros || [])[0];
        var relacionados = principal ? modelos.filter(function (x) { return (x.rubros || []).indexOf(principal) >= 0; }) : modelos;
        var posicion = relacionados.indexOf(m);
        var ant = relacionados[(posicion - 1 + relacionados.length) % relacionados.length];
        var sig = relacionados[(posicion + 1) % relacionados.length];
        $ant.href = url(ant);
        $ant.querySelector('b').textContent = 'Modelo ' + ant.letra + ' · ' + ant.nombre;
        $sig.href = url(sig);
        $sig.querySelector('b').textContent = 'Modelo ' + sig.letra + ' · ' + sig.nombre;
        $volver.href = principal ? './?rubro=' + encodeURIComponent(principal) : './?tipo=' + m.tipo;

        $pregunta.textContent = '¿Te gusta el modelo ' + m.letra + '?';
        $wsp.href = 'https://wa.me/5491140688675?text=' +
            encodeURIComponent('Hola! Me gustó el modelo ' + m.letra + ' (' + m.nombre + ') para mi web de ' + ($rubro.textContent || 'mi negocio'));

        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', url(m, partes ? '' : '&partes=0'));
        }
    }

    document.querySelector('.ver-seg').addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || b.dataset.vista === vista) return;
        vista = b.dataset.vista;
        pintar();
    });
    $partes.addEventListener('change', function () {
        partes = $partes.checked;
        var wf = $escenario.querySelector('.wf');
        if (wf) wf.classList.toggle('con-partes', partes);
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', url(modelos[idx], partes ? '' : '&partes=0'));
        }
    });

    pintar();

    var $anio = document.getElementById('anio');
    if ($anio) $anio.textContent = new Date().getFullYear();
})();
