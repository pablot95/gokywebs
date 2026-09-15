/* ============================================================
   modelos/app.js — galería de modelos.

   Deep-links (para el bot de WhatsApp):
     /modelos/?tipo=ecommerce     solo los modelos de tienda
     /modelos/?m=c  o  /modelos/#c   resalta y lleva al modelo C
   Los alias de tipo son los mismos del portfolio, así un link
   armado para uno sirve para el otro.
   ============================================================ */
(function () {
    'use strict';

    var modelos = (typeof GW_MODELOS !== 'undefined') ? GW_MODELOS : [];
    var tipos = (typeof GW_MODELO_TIPOS !== 'undefined') ? GW_MODELO_TIPOS : [];
    var rubros = (typeof GW_MODELO_RUBROS !== 'undefined') ? GW_MODELO_RUBROS : [];
    var LABEL_TIPO = {};
    tipos.forEach(function (t) { LABEL_TIPO[t.id] = t.label; });
    var LABEL_RUBRO = {};
    rubros.forEach(function (r) { LABEL_RUBRO[r.id] = r.label; });

    var ALIAS_TIPO = {
        ecommerce: 'ecommerce', tienda: 'ecommerce', tiendas: 'ecommerce', tiendaonline: 'ecommerce',
        catalogo: 'ecommerce', catalogos: 'ecommerce', webconcatalogo: 'ecommerce',
        landing: 'landing', landings: 'landing', sitioprofesional: 'landing', sitio: 'landing',
        profesional: 'landing', institucional: 'landing', turnos: 'landing', reservas: 'landing',
        inmobiliaria: 'inmobiliaria', inmobiliarias: 'inmobiliaria', propiedades: 'inmobiliaria',
        elearning: 'elearning', curso: 'elearning', cursos: 'elearning', academia: 'elearning',
        plataformadecursos: 'elearning'
    };

    var estado = { tipo: 'all', rubro: 'all', q: '' };
    var quietito = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var autoPan = !quietito && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var $grid = document.getElementById('mdGrid');
    var $filtros = document.getElementById('filtrosTipo');
    var $rubro = document.getElementById('filtroRubro');
    var $buscar = document.getElementById('buscarModelo');
    var $resultado = document.getElementById('mdResultado');
    var $vacio = document.getElementById('mdVacio');
    var pendientes = [];
    var observador = window.IntersectionObserver ? new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                observador.unobserve(entrada.target);
                cargarVista(entrada.target);
            }
        });
    }, { rootMargin: '500px' }) : null;

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function normalizar(s) {
        return String(s || '').toLowerCase().normalize('NFD')
            .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
    }
    function alias(tabla, clave) {
        return Object.prototype.hasOwnProperty.call(tabla, clave) ? tabla[clave] : null;
    }

    /* ── Tarjetas ── */
    function tarjeta(m) {
        var art = document.createElement('article');
        art.className = 'md-card';
        art.id = 'modelo-' + m.id;
        art.dataset.tipo = m.tipo;
        art.dataset.rubros = (m.rubros || []).join(' ');
        art.dataset.buscar = normalizar([m.nombre, m.tipo].concat(m.rubros || [], m.claves.slice(0, 2).map(function (c) { return c[1]; })).join(' '));
        var ver = 'ver.html?m=' + encodeURIComponent(m.id);
        art.innerHTML =
            '<div class="md-vista-wrap">' +
                '<a class="md-vista" href="' + ver + '" aria-label="Ver el modelo ' + esc(m.letra) + ' completo">' +
                    '<div class="md-alto"><div class="md-lienzo"></div></div>' +
                '</a>' +
                '<span class="md-letra" aria-hidden="true">' + esc(m.letra) + '</span>' +
            '</div>' +
            '<div class="md-info">' +
                '<span class="tag">' + esc(LABEL_TIPO[m.tipo] || m.tipo) + '</span>' +
                '<h2 class="md-nombre">Modelo ' + esc(m.letra) + ' · ' + esc(m.nombre) + '</h2>' +
                '<p class="md-rubros">' + esc((m.rubros || []).map(function (r) { return LABEL_RUBRO[r] || r; }).join(' · ')) + '</p>' +
                '<dl class="md-claves">' + m.claves.map(function (c) {
                    return '<div><dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + '</dd></div>';
                }).join('') + '</dl>' +
                '<div class="md-acciones">' +
                    '<a href="' + ver + '">Ver completo →</a>' +
                    '<a href="' + ver + '&amp;vista=celular">Ver en celular</a>' +
                '</div>' +
            '</div>';

        art._modelo = m;
        var vista = art.querySelector('.md-vista');
        pendientes.push(art);
        if (observador) observador.observe(art);

        /* Como en el portfolio: con el mouse encima el modelo se recorre solo. */
        if (autoPan) {
            art.addEventListener('mouseenter', function () { panear(vista, vista.scrollHeight - vista.clientHeight, 260); });
            art.addEventListener('mouseleave', function () { panear(vista, 0, 900); });
            ['wheel', 'pointerdown', 'touchstart'].forEach(function (ev) {
                vista.addEventListener(ev, function () { frenarPan(vista); }, { passive: true });
            });
        }
        return art;
    }

    function cargarVista(art) {
        if (!art._modelo) return;
        var vista = art.querySelector('.md-vista');
        var lienzo = art.querySelector('.md-lienzo');
        lienzo.innerHTML = GW_WIRE.render(art._modelo);
        GW_WIRE.encajar(vista, lienzo, 1200);
        art._modelo = null;
    }

    function frenarPan(vista) {
        if (vista._raf) cancelAnimationFrame(vista._raf);
        vista._raf = 0;
    }
    function panear(vista, hasta, pxPorSegundo) {
        frenarPan(vista);
        var desde = vista.scrollTop, dist = hasta - desde;
        if (Math.abs(dist) < 4) return;
        var dur = Math.min(Math.max(Math.abs(dist) / pxPorSegundo * 1000, 240), 9000);
        var t0 = performance.now();
        vista._raf = requestAnimationFrame(function paso(ahora) {
            var p = Math.min((ahora - t0) / dur, 1);
            var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            vista.scrollTop = desde + dist * e;
            vista._raf = p < 1 ? requestAnimationFrame(paso) : 0;
        });
    }

    /* ── Filtros ── */
    function armarChips() {
        [{ id: 'all', label: 'Todos' }].concat(tipos).forEach(function (t) {
            var n = t.id === 'all' ? modelos.length : modelos.filter(function (m) { return m.tipo === t.id; }).length;
            if (!n) return;
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip';
            b.dataset.valor = t.id;
            b.innerHTML = esc(t.label) + (t.id === 'all' ? '' : '<span class="chip-n">' + n + '</span>');
            $filtros.appendChild(b);
        });
    }

    function armarRubros() {
        rubros.forEach(function (r) {
            var o = document.createElement('option');
            o.value = r.id;
            o.textContent = r.label;
            $rubro.appendChild(o);
        });
    }

    function render() {
        var total = 0;
        var q = normalizar(estado.q);
        [].forEach.call($grid.children, function (el) {
            el.hidden = (estado.tipo !== 'all' && el.dataset.tipo !== estado.tipo) ||
                (estado.rubro !== 'all' && el.dataset.rubros.split(' ').indexOf(estado.rubro) < 0) ||
                (q && el.dataset.buscar.indexOf(q) < 0);
            el.style.order = estado.rubro !== 'all' && el.dataset.rubros !== estado.rubro ? '1' : '0';
            if (!el.hidden) total++;
        });
        [].forEach.call($filtros.querySelectorAll('.chip'), function (b) {
            b.setAttribute('aria-pressed', b.dataset.valor === estado.tipo ? 'true' : 'false');
        });
        $resultado.textContent = total + (total === 1 ? ' modelo' : ' modelos') + ' para explorar';
        $vacio.hidden = total !== 0;
        $rubro.value = estado.rubro;
        if (window.history && window.history.replaceState) {
            var p = new URLSearchParams();
            if (estado.tipo !== 'all') p.set('tipo', estado.tipo);
            if (estado.rubro !== 'all') p.set('rubro', estado.rubro);
            if (estado.q.trim()) p.set('q', estado.q.trim());
            var m = new URLSearchParams(window.location.search).get('m');
            if (m) p.set('m', m);
            window.history.replaceState(null, '', window.location.pathname + (p.toString() ? '?' + p.toString() : '') + window.location.hash);
        }
    }

    function leerURL() {
        var p = new URLSearchParams(window.location.search);
        var tipo = normalizar(p.get('tipo') || p.get('t'));
        if (alias(ALIAS_TIPO, tipo)) estado.tipo = ALIAS_TIPO[tipo];
        var rubro = normalizar(p.get('rubro'));
        if (rubros.some(function (r) { return r.id === rubro; })) estado.rubro = rubro;
        estado.q = p.get('q') || '';
        $buscar.value = estado.q;
        var m = normalizar(p.get('m') || window.location.hash.replace('#', '').replace('modelo-', ''));
        return modelos.some(function (x) { return x.id === m; }) ? m : '';
    }

    $filtros.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        estado.tipo = chip.dataset.valor;
        render();
    });
    $rubro.addEventListener('change', function () {
        estado.rubro = $rubro.value;
        render();
    });
    $buscar.addEventListener('input', function () {
        estado.q = $buscar.value;
        render();
    });

    /* ── Arranque ── */
    var destacado = leerURL();
    var frag = document.createDocumentFragment();
    modelos.forEach(function (m) { frag.appendChild(tarjeta(m)); });
    $grid.appendChild(frag);
    armarChips();
    armarRubros();
    render();

    if (!observador) pendientes.forEach(cargarVista);

    if (destacado) {
        var card = document.getElementById('modelo-' + destacado);
        if (card) {
            card.hidden = false;
            card.classList.add('resaltada');
            cargarVista(card);
            requestAnimationFrame(function () { card.scrollIntoView({ block: 'start' }); });
        }
    }

    var $anio = document.getElementById('anio');
    if ($anio) $anio.textContent = new Date().getFullYear();
})();
