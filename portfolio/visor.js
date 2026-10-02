/* ============================================================
   portfolio/visor.js — visor del portfolio.

   Lo usan la página /portfolio/ y la sección Portfolio del inicio: la
   web elegida ocupa toda la pantalla (se recorre con scroll), sin nada
   encima; los filtros flotan arriba y la tira de miniaturas abajo.

   Se monta en el primer [data-visor] de la página:
     data-base="/portfolio/"   carpeta donde están previews/ y previews/mini/
     data-url                  lee y escribe los filtros en la URL (solo /portfolio/)
     data-toolbar="#selector"  dónde van los filtros (si no, arriba del visor)

   Deep-links (los usa el bot de WhatsApp y las campañas):
     /portfolio/?tipo=ecommerce
     /portfolio/?tipo=landing&rubro=salud
     /portfolio/?q=abogado
     /portfolio/?w=sparrow        (abre ese trabajo)
     /portfolio/#inmobiliaria
   Los alias de abajo aceptan las variantes en plural y en criollo
   ("tiendas", "cursos", "propiedades") para que ningún link caiga mal.

   Datos: GW_TRABAJOS / GW_TIPOS / GW_RUBROS de portfolio/data.js.
   Capturas: previews/hd/<id>.webp (1920 px, compu; capturar-hd.py),
   previews/<id>.webp (960 px, celular y respaldo) y previews/mini/<id>.webp
   (560×350, la tira; hacer-minis.py). Si falta una, se usa la siguiente.
   ============================================================ */
(function () {
    'use strict';

    var root = document.querySelector('[data-visor]');
    if (!root || typeof GW_TRABAJOS === 'undefined') return;

    var BASE = root.getAttribute('data-base') || '/portfolio/';
    var SYNC = root.hasAttribute('data-url');
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var tipos = typeof GW_TIPOS !== 'undefined' ? GW_TIPOS : [];
    var rubros = typeof GW_RUBROS !== 'undefined' ? GW_RUBROS : [];
    var LABEL_TIPO = {}, LABEL_RUBRO = {};
    tipos.forEach(function (t) { LABEL_TIPO[t.id] = t.label; });
    rubros.forEach(function (r) { LABEL_RUBRO[r.id] = r.label; });

    /* En los chips "Plataforma de cursos" ocupa el doble que el resto. */
    var CHIP_TIPO = { elearning: 'Cursos online' };

    /* ── Alias de deep-link ── */
    var ALIAS_TIPO = {
        ecommerce: 'ecommerce', ecommerces: 'ecommerce', tienda: 'ecommerce', tiendas: 'ecommerce',
        tiendaonline: 'ecommerce', tiendasonline: 'ecommerce', shop: 'ecommerce', venderonline: 'ecommerce',
        landing: 'landing', landings: 'landing', landingpage: 'landing', landingpages: 'landing',
        sitioprofesional: 'landing', sitiosprofesionales: 'landing', sitio: 'landing', profesional: 'landing',
        institucional: 'landing', institucionales: 'landing', empresa: 'landing', empresas: 'landing',
        inmobiliaria: 'inmobiliaria', inmobiliarias: 'inmobiliaria', propiedades: 'inmobiliaria',
        elearning: 'elearning', elearnings: 'elearning', curso: 'elearning', cursos: 'elearning',
        academia: 'elearning', plataformadecursos: 'elearning',
        noticias: 'noticias', noticia: 'noticias', prensa: 'noticias', medio: 'noticias',
        /* Catálogo, turnos e institucional dejaron de ser tipos propios: la venta
           converge en sitio profesional y ecommerce (Pablo, 2-sep). Los links
           viejos —los que ya se mandaron por WhatsApp— tienen que seguir
           cayendo en el tipo que los absorbió, nunca en una página vacía. */
        catalogo: 'ecommerce', catalogos: 'ecommerce', webconcatalogo: 'ecommerce',
        turnos: 'landing', turno: 'landing', reservas: 'landing', agenda: 'landing'
    };
    var ALIAS_RUBRO = {
        salud: 'salud', bienestar: 'salud', psicologia: 'salud', medicina: 'salud',
        legales: 'legales', abogados: 'legales', abogado: 'legales', contable: 'legales', contador: 'legales',
        moda: 'moda', indumentaria: 'moda', ropa: 'moda',
        gastronomia: 'gastronomia', comida: 'gastronomia', eventos: 'gastronomia',
        belleza: 'belleza', estetica: 'belleza',
        hogar: 'hogar', muebles: 'hogar', deco: 'hogar',
        tecnologia: 'tecnologia', electronica: 'tecnologia',
        industria: 'industria', construccion: 'industria',
        servicios: 'servicios', oficios: 'servicios',
        educacion: 'educacion', cursos: 'educacion',
        comercios: 'comercios', tiendas: 'comercios',
        inmobiliaria: 'inmobiliaria', automotor: 'automotor', autos: 'automotor',
        deportes: 'deportes', fitness: 'deportes',
        arte: 'arte', cultura: 'arte',
        turismo: 'turismo', hoteleria: 'turismo',
        finanzas: 'finanzas', seguros: 'finanzas'
    };

    /* ── Utilidades ── */
    function normalizar(s) {
        return String(s || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9ñ ]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    function dominio(url) {
        return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
    }
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function tieneClave(tabla, clave) {
        /* hasOwnProperty: si no, un ?tipo=constructor devuelve algo truthy del
           prototipo y el filtro queda comparando contra una función. */
        return Object.prototype.hasOwnProperty.call(tabla, clave);
    }
    /* En la compu la captura va a pantalla completa: se usa la de 1920 px
       (previews/hd/). En el celular alcanza la de 960 y pesa mucho menos. */
    var grande = window.matchMedia('(min-width: 961px)');
    function srcCaptura(t) { return BASE + 'previews/' + t.id + '.webp'; }
    function srcPantalla(t) { return grande.matches ? BASE + 'previews/hd/' + t.id + '.webp' : srcCaptura(t); }
    function srcMini(t) { return BASE + 'previews/mini/' + t.id + '.webp'; }

    /* Una web puede ser de dos tipos a la vez (Kare vende productos y además
       cursos): el tipo se normaliza a array una sola vez. */
    var trabajos = GW_TRABAJOS.slice();
    var porId = {};
    trabajos.forEach(function (t) {
        t._tipos = Array.isArray(t.tipo) ? t.tipo : [t.tipo];
        t._buscable = normalizar([
            t.nombre, t.que, t.zona, t.tags,
            t._tipos.map(function (id) { return LABEL_TIPO[id] || id; }).join(' '),
            LABEL_RUBRO[t.rubro] || t.rubro,
            t._tipos.join(' '), t.rubro,
            dominio(t.url).replace(/[.-]/g, ' ')
        ].join(' '));
        porId[t.id] = t;
    });

    /* ── Íconos (trazo de 1.6, como el resto del sitio) ── */
    function ico(path) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
    }
    var ICO = {
        afuera: ico('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
        izq: ico('<path d="M15 6l-6 6 6 6"/>'),
        der: ico('<path d="M9 6l6 6-6 6"/>'),
        lupa: ico('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')
    };

    /* ── Estado ── */
    var estado = { q: '', tipo: 'all', rubro: 'all' };
    var lista = [];
    var actual = null;

    /* ── Esqueleto ── */
    var toolbarHTML =
        '<div class="gv-toolbar">' +
            '<div class="gv-chips" role="group" aria-label="Filtrar por tipo de web"></div>' +
            '<div class="gv-tools">' +
                '<label class="gv-select">' +
                    '<span class="gv-oculto">Filtrar por rubro</span>' +
                    '<select class="gv-rubro"></select>' +
                '</label>' +
                '<span class="gv-search-wrap">' +
                    '<label class="gv-search">' + ICO.lupa +
                        '<span class="gv-oculto">Buscar trabajos</span>' +
                        '<input class="gv-q" type="search" autocomplete="off" placeholder="Buscá: abogado, panadería…">' +
                    '</label>' +
                '</span>' +
            '</div>' +
        '</div>';

    /* La web elegida ocupa toda la pantalla y no lleva nada encima: los
       filtros flotan arriba y las miniaturas abajo, chicas y sin textos. */
    root.innerHTML =
        '<div class="gv-stage">' +
            '<div class="gv-view" tabindex="0" data-lenis-prevent>' +
                '<img class="gv-shot" alt="" decoding="async">' +
            '</div>' +
            '<span class="gv-progreso" aria-hidden="true"><i></i></span>' +
            '<p class="gv-oculto" aria-live="polite"></p>' +
        '</div>' +
        '<div class="gv-vacio" hidden>' +
            '<p class="gv-vacio-t">No encontramos trabajos con eso.</p>' +
            '<p>Probá con el rubro (“estética”, “abogado”, “muebles”) o mirá todos los trabajos.</p>' +
            '<button class="gv-btn" type="button" data-gv-reset>Ver todos los trabajos</button>' +
        '</div>' +
        '<div class="gv-strip">' +
            '<button class="gv-nav gv-prev" type="button" aria-label="Trabajo anterior">' + ICO.izq + '</button>' +
            '<div class="gv-rail" role="list" aria-label="Trabajos"></div>' +
            '<button class="gv-nav gv-next" type="button" aria-label="Trabajo siguiente">' + ICO.der + '</button>' +
            '<a class="gv-visitar" target="_blank" rel="noopener noreferrer">Visitar sitio ' + ICO.afuera + '</a>' +
        '</div>';

    var slot = root.getAttribute('data-toolbar') && document.querySelector(root.getAttribute('data-toolbar'));
    if (slot) slot.innerHTML = toolbarHTML;
    else root.insertAdjacentHTML('afterbegin', toolbarHTML);
    if (!slot) root.classList.add('gv--con-filtros');
    var $tb = slot || root;

    var $chips = $tb.querySelector('.gv-chips');
    var $rubro = $tb.querySelector('.gv-rubro');
    var $q = $tb.querySelector('.gv-q');
    var $stage = root.querySelector('.gv-stage');
    var $info = root.querySelector('.gv-stage [aria-live]');
    var $view = root.querySelector('.gv-view');
    var $shot = root.querySelector('.gv-shot');
    var $prog = root.querySelector('.gv-progreso i');
    var $vacio = root.querySelector('.gv-vacio');
    var $visitar = root.querySelector('.gv-visitar');
    var $strip = root.querySelector('.gv-strip');
    var $rail = root.querySelector('.gv-rail');

    /* Chips de tipo */
    [{ id: 'all', label: 'Todos' }].concat(tipos).forEach(function (op) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'gv-chip';
        b.dataset.valor = op.id;
        b.setAttribute('aria-pressed', 'false');
        b.innerHTML = esc(CHIP_TIPO[op.id] || op.label) + '<span class="gv-chip-n"></span>';
        $chips.appendChild(b);
    });

    /* Select de rubro */
    [{ id: 'all', label: 'Rubro' }].concat(rubros).forEach(function (op) {
        var o = document.createElement('option');
        o.value = op.id;
        o.dataset.label = op.label;
        o.textContent = op.label;
        $rubro.appendChild(o);
    });

    /* ── Filtrado ── */
    function terminos() {
        return estado.q ? normalizar(estado.q).split(' ').filter(Boolean) : [];
    }
    function pasa(t, tipo, rubro, ts) {
        if (tipo !== 'all' && t._tipos.indexOf(tipo) === -1) return false;
        if (rubro !== 'all' && t.rubro !== rubro) return false;
        for (var i = 0; i < ts.length; i++) {
            if (t._buscable.indexOf(ts[i]) === -1) return false;
        }
        return true;
    }
    function contar(tipo, rubro) {
        var ts = terminos(), n = 0;
        trabajos.forEach(function (t) { if (pasa(t, tipo, rubro, ts)) n++; });
        return n;
    }

    /* Los chips y rubros que dejarían el visor vacío no se ofrecen. */
    function pintarFiltros() {
        [].forEach.call($chips.children, function (b) {
            var v = b.dataset.valor, activo = estado.tipo === v;
            var n = contar(v, estado.rubro);
            b.setAttribute('aria-pressed', activo ? 'true' : 'false');
            b.querySelector('.gv-chip-n').textContent = v === 'all' ? '' : n;
            b.hidden = v !== 'all' && n === 0 && !activo;
        });
        [].forEach.call($rubro.options, function (o) {
            var n = contar(estado.tipo, o.value);
            o.disabled = o.value !== 'all' && n === 0 && o.value !== estado.rubro;
            o.textContent = o.dataset.label + (o.value === 'all' ? '' : ' (' + n + ')');
        });
        $rubro.value = estado.rubro;
        $rubro.parentNode.classList.toggle('activo', estado.rubro !== 'all');
        $q.parentNode.classList.toggle('lleno', !!estado.q);
    }

    /* ── Tira de miniaturas ── */
    var miniaturas = {};
    function miniatura(t) {
        if (miniaturas[t.id]) return miniaturas[t.id];
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'gv-thumb';
        b.dataset.id = t.id;
        b.setAttribute('role', 'listitem');
        b.innerHTML =
            '<img src="' + esc(srcMini(t)) + '" alt="" loading="lazy" decoding="async" width="560" height="350">';
        b.title = t.nombre;
        b.setAttribute('aria-label', t.nombre + ' — ' + (LABEL_RUBRO[t.rubro] || t.rubro));
        var img = b.querySelector('img');
        img.addEventListener('error', function fallo() {
            img.removeEventListener('error', fallo);
            img.src = srcCaptura(t);
        });
        miniaturas[t.id] = b;
        return b;
    }

    function armarTira() {
        var deseadas = lista.map(miniatura);
        [].slice.call($rail.children).forEach(function (el) {
            if (deseadas.indexOf(el) === -1) $rail.removeChild(el);
        });
        deseadas.forEach(function (el, i) {
            if ($rail.children[i] !== el) $rail.insertBefore(el, $rail.children[i] || null);
        });
        $rail.scrollLeft = 0;
    }

    /* scrollIntoView movería también la página (y en el inicio pelea con
       Lenis): se centra la miniatura moviendo solo la tira. */
    function centrarMiniatura(suave) {
        var el = actual && miniaturas[actual.id];
        if (!el || !el.parentNode) return;
        var x = el.offsetLeft - ($rail.clientWidth - el.offsetWidth) / 2;
        $rail.scrollTo({ left: Math.max(0, x), behavior: suave && !quieto ? 'smooth' : 'auto' });
    }

    /* ── Escenario ── */
    var turno = 0;

    function mostrar(t, opciones) {
        opciones = opciones || {};
        if (!t) return;
        var mismo = actual === t;
        actual = t;
        var mio = ++turno;

        [].forEach.call($rail.children, function (el) {
            var on = el.dataset.id === t.id;
            el.classList.toggle('activo', on);
            if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
        });
        centrarMiniatura(!opciones.instantaneo);
        if (mismo && !opciones.forzar) return;

        $view.setAttribute('aria-label', 'Web de ' + t.nombre + ' (' + dominio(t.url) + '). Se recorre con scroll.');
        $shot.alt = 'Web de ' + t.nombre + ' (' + dominio(t.url) + '), página completa';
        $info.textContent = t.nombre + ': ' + t.que + (t.zona ? ', ' + t.zona : '') + '.';
        $visitar.href = t.url;
        $visitar.setAttribute('aria-label', 'Visitar la web de ' + t.nombre + ' (se abre en otra pestaña)');

        /* La captura nueva se carga aparte y entra cuando está lista: nunca se
           ve el marco vacío ni la captura vieja a mitad de scroll. */
        $stage.classList.add('cargando');
        var pre = new Image();
        pre.decoding = 'async';
        pre.onerror = function () {
            /* Sin la versión en alta todavía: la de 960 sirve igual. */
            if (mio !== turno) return;
            if (pre.src.indexOf('/hd/') !== -1) { pre.src = srcCaptura(t); return; }
            pre.onload();
        };
        pre.onload = function () {
            if (mio !== turno) return;
            $shot.src = pre.src;
            $view.scrollTop = 0;
            $prog.style.transform = 'scaleX(0)';
            $stage.classList.remove('cargando');
        };
        pre.src = srcPantalla(t);

        /* Precarga la siguiente para que el "siguiente" sea instantáneo. */
        var sig = lista[(lista.indexOf(t) + 1) % lista.length];
        if (sig && sig !== t) { var p2 = new Image(); p2.src = srcPantalla(sig); }

        if (!opciones.sinURL) sincronizarURL();
    }

    function mover(paso) {
        if (!lista.length) return;
        var i = lista.indexOf(actual);
        mostrar(lista[(i + paso + lista.length) % lista.length]);
    }

    function render(opciones) {
        opciones = opciones || {};
        var ts = terminos();
        lista = trabajos.filter(function (t) { return pasa(t, estado.tipo, estado.rubro, ts); });
        pintarFiltros();
        armarTira();

        var vacio = !lista.length;
        $vacio.hidden = !vacio;
        $stage.hidden = vacio;
        $strip.hidden = vacio;
        if (vacio) { actual = null; sincronizarURL(); return; }

        var elegido = opciones.elegir && lista.indexOf(opciones.elegir) !== -1 ? opciones.elegir
            : (lista.indexOf(actual) !== -1 ? actual : lista[0]);
        mostrar(elegido, { forzar: elegido !== actual || !$shot.getAttribute('src'), instantaneo: opciones.instantaneo });
        sincronizarURL();
    }

    /* ── URL ── */
    function sincronizarURL() {
        if (!SYNC || !window.history || !window.history.replaceState) return;
        var p = new URLSearchParams();
        if (estado.tipo !== 'all') p.set('tipo', estado.tipo);
        if (estado.rubro !== 'all') p.set('rubro', estado.rubro);
        if (estado.q) p.set('q', estado.q);
        if (actual && actual !== lista[0]) p.set('w', actual.id);
        var qs = p.toString();
        window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    }

    function leerURL() {
        var p = new URLSearchParams(window.location.search);
        var hash = normalizar(window.location.hash.replace('#', '')).replace(/ /g, '');
        var tipo = normalizar(p.get('tipo') || p.get('t') || '').replace(/ /g, '');
        var rubro = normalizar(p.get('rubro') || p.get('r') || '').replace(/ /g, '');

        if (!tipo && hash && tieneClave(ALIAS_TIPO, hash)) tipo = hash;
        if (!rubro && hash && tieneClave(ALIAS_RUBRO, hash)) rubro = hash;
        if (tieneClave(ALIAS_TIPO, tipo)) estado.tipo = ALIAS_TIPO[tipo];
        if (tieneClave(ALIAS_RUBRO, rubro)) estado.rubro = ALIAS_RUBRO[rubro];

        var q = p.get('q') || p.get('buscar') || '';
        if (q) { estado.q = q; $q.value = q; }

        var w = p.get('w') || '';
        return tieneClave(porId, w) ? porId[w] : null;
    }

    /* ── Eventos ── */
    $chips.addEventListener('click', function (e) {
        var b = e.target.closest('.gv-chip');
        if (!b) return;
        estado.tipo = b.dataset.valor;
        render();
    });
    $rubro.addEventListener('change', function () {
        estado.rubro = $rubro.value;
        render();
    });
    var temporizador;
    $q.addEventListener('input', function () {
        clearTimeout(temporizador);
        temporizador = setTimeout(function () {
            estado.q = $q.value.trim();
            render();
        }, 180);
    });
    root.addEventListener('click', function (e) {
        var th = e.target.closest('.gv-thumb');
        if (th) { mostrar(porId[th.dataset.id]); return; }
        if (e.target.closest('.gv-prev')) { mover(-1); return; }
        if (e.target.closest('.gv-next')) { mover(1); return; }
        if (e.target.closest('[data-gv-reset]')) {
            estado = { q: '', tipo: 'all', rubro: 'all' };
            $q.value = '';
            render();
        }
    });

    /* Flechas ← → cambian de trabajo cuando el foco está en el visor (no
       mientras se escribe en el buscador ni se elige rubro). */
    root.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
        e.preventDefault();
        mover(e.key === 'ArrowLeft' ? -1 : 1);
        var activo = actual && miniaturas[actual.id];
        if (activo && e.target.classList.contains('gv-thumb')) activo.focus({ preventScroll: true });
    });

    $view.addEventListener('scroll', function () {
        var max = $view.scrollHeight - $view.clientHeight;
        $prog.style.transform = 'scaleX(' + (max > 0 ? $view.scrollTop / max : 0) + ')';
    }, { passive: true });

    /* ── API para routing.js (deep-links viejos del inicio: /#moda, /?p=…) ── */
    window.GWVisor = {
        filtrar: function (f) {
            f = f || {};
            estado.tipo = f.tipo && tieneClave(LABEL_TIPO, f.tipo) ? f.tipo : 'all';
            estado.rubro = f.rubro && tieneClave(LABEL_RUBRO, f.rubro) ? f.rubro : 'all';
            estado.q = '';
            $q.value = '';
            render({ instantaneo: true });
        }
    };

    /* ── Arranque ── */
    var pedido = SYNC ? leerURL() : null;
    render({ elegir: pedido, instantaneo: true });
})();
