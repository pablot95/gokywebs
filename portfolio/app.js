/* ============================================================
   portfolio/app.js — buscador + filtros del portfolio.

   Deep-links (los usa el bot de WhatsApp y las campañas):
     /portfolio/?tipo=ecommerce
     /portfolio/?tipo=landing&rubro=salud
     /portfolio/?q=abogado
     /portfolio/#inmobiliaria
   Los alias de abajo aceptan las variantes en plural y en criollo
   ("tiendas", "cursos", "propiedades") para que ningún link caiga mal.
   ============================================================ */
(function () {
    'use strict';

    var LOTE = 12;              // tarjetas por tanda
    var trabajos = (typeof GW_TRABAJOS !== 'undefined') ? GW_TRABAJOS.slice() : [];
    var tipos = (typeof GW_TIPOS !== 'undefined') ? GW_TIPOS : [];
    var rubros = (typeof GW_RUBROS !== 'undefined') ? GW_RUBROS : [];

    var LABEL_TIPO = {}, LABEL_RUBRO = {};
    tipos.forEach(function (t) { LABEL_TIPO[t.id] = t.label; });
    rubros.forEach(function (r) { LABEL_RUBRO[r.id] = r.label; });

    /* ── Alias de deep-link ── */
    var ALIAS_TIPO = {
        ecommerce: 'ecommerce', ecommerces: 'ecommerce', tienda: 'ecommerce', tiendas: 'ecommerce',
        tiendaonline: 'ecommerce', tiendasonline: 'ecommerce', shop: 'ecommerce', venderonline: 'ecommerce',
        landing: 'landing', landings: 'landing', landingpage: 'landing', landingpages: 'landing',
        institucional: 'institucional', institucionales: 'institucional', empresa: 'institucional', empresas: 'institucional',
        inmobiliaria: 'inmobiliaria', inmobiliarias: 'inmobiliaria', propiedades: 'inmobiliaria',
        elearning: 'elearning', elearnings: 'elearning', curso: 'elearning', cursos: 'elearning',
        academia: 'elearning', plataformadecursos: 'elearning',
        noticias: 'noticias', noticia: 'noticias', prensa: 'noticias', medio: 'noticias',
        /* Catálogo y turnos ya no son un filtro propio (los trabajos pasaron a
           ecommerce y landing), pero el bot los sigue cotizando: sus links
           tienen que caer en el tipo que los absorbió, no en una página vacía. */
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

    /* Una web puede ser de dos tipos a la vez (Kare vende productos y además
       cursos): el tipo se normaliza a array una sola vez y de acá en adelante
       se filtra y se etiqueta siempre contra _tipos, nunca contra t.tipo. */
    function etiquetaTipo(id) {
        return LABEL_TIPO[id] || id;
    }

    /* El índice de búsqueda mezcla todo lo que el visitante podría tipear:
       nombre, profesión, zona, tags, el tipo y el rubro en castellano, y el dominio. */
    trabajos.forEach(function (t) {
        t._tipos = Array.isArray(t.tipo) ? t.tipo : [t.tipo];
        t._buscable = normalizar([
            t.nombre, t.que, t.zona, t.tags,
            t._tipos.map(etiquetaTipo).join(' '),
            LABEL_RUBRO[t.rubro] || t.rubro,
            t._tipos.join(' '), t.rubro,
            dominio(t.url).replace(/[.-]/g, ' ')
        ].join(' '));
    });

    /* ── Estado ── */
    var estado = { q: '', tipo: 'all', rubro: 'all' };
    var visibles = LOTE;

    /* Un solo interruptor para todo el movimiento: si el visitante pidió menos
       animaciones, la grilla se reordena de golpe y el preview no se mueve. */
    var quietito = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coreografiaOk = !quietito;
    var autoPan = !quietito && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var $grid = document.getElementById('pfGrid');
    var $input = document.getElementById('buscador');
    var $limpiar = document.getElementById('limpiarBusqueda');
    var $conteo = document.getElementById('pfConteo');
    var $reset = document.getElementById('pfReset');
    var $vacio = document.getElementById('pfVacio');
    var $mas = document.getElementById('pfMas');
    var $filtrosTipo = document.getElementById('filtrosTipo');
    var $filtrosRubro = document.getElementById('filtrosRubro');
    var $verRubros = document.getElementById('verRubros');

    /* ── Filtrado ── */
    function filtrar() {
        var terminos = estado.q ? normalizar(estado.q).split(' ').filter(Boolean) : [];
        return trabajos.filter(function (t) {
            if (estado.tipo !== 'all' && t._tipos.indexOf(estado.tipo) === -1) return false;
            if (estado.rubro !== 'all' && t.rubro !== estado.rubro) return false;
            for (var i = 0; i < terminos.length; i++) {
                if (t._buscable.indexOf(terminos[i]) === -1) return false;
            }
            return true;
        });
    }

    /* Cuántos quedarían si además se tocara este chip: sirve para ocultar
       los filtros que dejarían la grilla vacía. */
    function contar(campo, valor) {
        var terminos = estado.q ? normalizar(estado.q).split(' ').filter(Boolean) : [];
        return trabajos.filter(function (t) {
            if (campo !== 'tipo' && estado.tipo !== 'all' && t._tipos.indexOf(estado.tipo) === -1) return false;
            if (campo !== 'rubro' && estado.rubro !== 'all' && t.rubro !== estado.rubro) return false;
            if (valor !== 'all') {
                if (campo === 'tipo' ? t._tipos.indexOf(valor) === -1 : t[campo] !== valor) return false;
            }
            for (var i = 0; i < terminos.length; i++) {
                if (t._buscable.indexOf(terminos[i]) === -1) return false;
            }
            return true;
        }).length;
    }

    /* ── Chips ── */
    function armarChips($cont, campo, lista) {
        var frag = document.createDocumentFragment();
        [{ id: 'all', label: 'Todos' }].concat(lista).forEach(function (op) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip';
            b.dataset.campo = campo;
            b.dataset.valor = op.id;
            b.setAttribute('aria-pressed', 'false');
            b.innerHTML = esc(op.label) + '<span class="chip-n"></span>';
            frag.appendChild(b);
        });
        $cont.appendChild(frag);
    }

    function pintarChips() {
        var chips = document.querySelectorAll('.chip');
        Array.prototype.forEach.call(chips, function (b) {
            var campo = b.dataset.campo, valor = b.dataset.valor;
            var activo = estado[campo] === valor;
            b.setAttribute('aria-pressed', activo ? 'true' : 'false');
            var n = contar(campo, valor);
            b.querySelector('.chip-n').textContent = valor === 'all' ? '' : n;
            b.hidden = (valor !== 'all' && n === 0 && !activo);
        });
    }

    /* ── Render ── */
    function tarjeta(t) {
        var art = document.createElement('article');
        art.className = 'work-card';
        art.dataset.id = t.id;
        var etiquetas = t._tipos.map(function (id) {
                return '<span class="tag">' + esc(etiquetaTipo(id)) + '</span>';
            }).join('') +
            '<span class="tag tag-rubro">' + esc(LABEL_RUBRO[t.rubro] || t.rubro) + '</span>' +
            (t.estado === 'demo' ? '<span class="tag tag-demo">Muestra propia</span>' : '');
        art.innerHTML =
            /* Si todavía no hay captura de esa web, la tarjeta no se ve rota:
               el contenedor queda con el dominio y el link sigue funcionando. */
            '<div class="work-view">' +
                '<img src="previews/' + esc(t.id) + '.webp" alt="Web de ' + esc(t.nombre) + '"' +
                    ' loading="lazy" decoding="async"' +
                    ' onerror="this.closest(\'.work-view\').classList.add(\'sin-preview\');this.remove()">' +
                '<span class="work-scroll-hint">Deslizá ↓</span>' +
                '<span class="work-dominio">' + esc(dominio(t.url)) + '</span>' +
            '</div>' +
            '<div class="work-meta">' + etiquetas + '</div>' +
            '<a class="work-info" href="' + esc(t.url) + '" target="_blank" rel="noopener noreferrer">' +
                esc(t.nombre) + ' <span class="work-cta">Ver web →</span>' +
            '</a>' +
            '<p class="work-que">' + esc(t.que) +
                (t.zona ? ' <span class="work-zona">· ' + esc(t.zona) + '</span>' : '') +
            '</p>';

        /* La tarjeta guarda la captura entera del sitio (hasta 3900px de alto).
           En desktop se recorre sola al pasar el mouse, así el visitante ve el
           sitio sin tener que arrastrar. Si la mueve a mano, manda él. */
        if (autoPan) {
            var vista = art.querySelector('.work-view');
            art.addEventListener('mouseenter', function () {
                panear(vista, vista.scrollHeight - vista.clientHeight, 300);
            });
            art.addEventListener('mouseleave', function () {
                panear(vista, 0, 900);
            });
            ['wheel', 'pointerdown', 'touchstart'].forEach(function (ev) {
                vista.addEventListener(ev, function () { frenarPan(vista); }, { passive: true });
            });
        }
        return art;
    }

    /* ── Auto-pan del preview ── */
    function frenarPan(vista) {
        if (vista._raf) cancelAnimationFrame(vista._raf);
        vista._raf = 0;
    }

    function panear(vista, hasta, pxPorSegundo) {
        frenarPan(vista);
        var desde = vista.scrollTop;
        var dist = hasta - desde;
        if (Math.abs(dist) < 4) return;
        var dur = Math.min(Math.max(Math.abs(dist) / pxPorSegundo * 1000, 240), 9000);
        var t0 = performance.now();
        vista._raf = requestAnimationFrame(function paso(ahora) {
            var p = Math.min((ahora - t0) / dur, 1);
            /* Arranca y frena suave, pero el tramo del medio es casi parejo:
               es un recorrido, no un rebote. */
            var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            vista.scrollTop = desde + dist * e;
            if (p < 1) vista._raf = requestAnimationFrame(paso);
            else vista._raf = 0;
        });
    }

    /* Las tarjetas se reusan entre renders: la que ya estaba en pantalla no se
       vuelve a crear, se mueve. Eso es lo que permite el FLIP y, sobre todo, lo
       que evita que la grilla entera re-animara con CADA tecla del buscador
       (antes render() la borraba y la volvía a construir de cero). */
    var nodos = {};

    function nodoDe(t) {
        if (!nodos[t.id]) nodos[t.id] = tarjeta(t);
        return nodos[t.id];
    }

    function medir() {
        var m = {};
        [].forEach.call($grid.children, function (el) {
            m[el.dataset.id] = el.getBoundingClientRect();
        });
        return m;
    }

    /* FLIP: lo que ya estaba se desliza desde donde estaba hasta su lugar
       nuevo; lo que recién aparece entra escalonado. */
    function coreografiar(elementos, antes) {
        var despues = medir();
        var nuevas = 0;
        elementos.forEach(function (el) {
            var a = antes[el.dataset.id], d = despues[el.dataset.id];
            if (a && d) {
                var dx = a.left - d.left, dy = a.top - d.top;
                if (!dx && !dy) return;
                el.style.transition = 'none';
                el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
                el.getBoundingClientRect();               // fuerza el reflow
                requestAnimationFrame(function () {
                    el.style.transition = 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.transform = '';
                });
                el.addEventListener('transitionend', function limpiar(e) {
                    if (e.propertyName !== 'transform') return;
                    el.style.transition = '';
                    el.style.transform = '';
                    el.removeEventListener('transitionend', limpiar);
                });
            } else {
                el.classList.remove('entra');
                el.getBoundingClientRect();
                el.style.animationDelay = Math.min(nuevas++, 8) * 45 + 'ms';
                el.classList.add('entra');
                el.addEventListener('animationend', function fin() {
                    el.classList.remove('entra');
                    el.style.animationDelay = '';
                    el.removeEventListener('animationend', fin);
                });
            }
        });
    }

    function render() {
        var res = filtrar();
        var tanda = res.slice(0, visibles);
        var antes = coreografiaOk ? medir() : {};

        var deseados = tanda.map(nodoDe);
        [].slice.call($grid.children).forEach(function (el) {
            if (deseados.indexOf(el) === -1) $grid.removeChild(el);
        });
        deseados.forEach(function (el, i) {
            if ($grid.children[i] !== el) $grid.insertBefore(el, $grid.children[i] || null);
        });
        if (coreografiaOk) coreografiar(deseados, antes);

        $vacio.hidden = res.length > 0;
        $mas.hidden = res.length <= visibles;
        $mas.textContent = 'Ver más trabajos (' + Math.max(res.length - visibles, 0) + ')';

        var hayFiltro = estado.q || estado.tipo !== 'all' || estado.rubro !== 'all';
        $reset.hidden = !hayFiltro;
        /* Las muestras propias no son clientes: el conteo las separa en vez de
           contarlas como trabajos entregados. */
        var online = res.filter(function (t) { return t.estado !== 'demo'; }).length;
        var demos = res.length - online;
        var partes = [];
        if (online) partes.push('<strong>' + online + '</strong> ' + (online === 1 ? 'web de cliente' : 'webs de clientes'));
        if (demos) partes.push('<strong>' + demos + '</strong> ' + (demos === 1 ? 'muestra propia' : 'muestras propias'));
        $conteo.innerHTML = partes.length ? partes.join(' · ') : 'Sin resultados';

        pintarChips();
        sincronizarURL();
    }

    /* ── URL ── */
    function sincronizarURL() {
        if (!window.history || !window.history.replaceState) return;
        var p = new URLSearchParams();
        if (estado.tipo !== 'all') p.set('tipo', estado.tipo);
        if (estado.rubro !== 'all') p.set('rubro', estado.rubro);
        if (estado.q) p.set('q', estado.q);
        var qs = p.toString();
        window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    }

    function leerURL() {
        var p = new URLSearchParams(window.location.search);
        var hash = normalizar(window.location.hash.replace('#', '')).replace(/ /g, '');

        var tipo = normalizar(p.get('tipo') || p.get('t') || '').replace(/ /g, '');
        var rubro = normalizar(p.get('rubro') || p.get('r') || '').replace(/ /g, '');

        /* hasOwnProperty: si no, un ?tipo=constructor devuelve algo truthy del
           prototipo y el filtro queda comparando contra una función. */
        var alias = function (tabla, clave) {
            return Object.prototype.hasOwnProperty.call(tabla, clave) ? tabla[clave] : null;
        };

        if (!tipo && hash && alias(ALIAS_TIPO, hash)) tipo = hash;
        if (!rubro && hash && alias(ALIAS_RUBRO, hash)) rubro = hash;

        if (alias(ALIAS_TIPO, tipo)) estado.tipo = ALIAS_TIPO[tipo];
        if (alias(ALIAS_RUBRO, rubro)) estado.rubro = ALIAS_RUBRO[rubro];

        var q = p.get('q') || p.get('buscar') || '';
        if (q) { estado.q = q; $input.value = q; $limpiar.classList.add('visible'); }

        if (estado.rubro !== 'all') abrirRubros(true);
    }

    function abrirRubros(abrir) {
        $filtrosRubro.hidden = !abrir;
        $verRubros.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        $verRubros.textContent = abrir ? 'Ocultar rubros −' : 'Filtrar por rubro +';
    }

    /* ── Eventos ── */
    var temporizador;
    $input.addEventListener('input', function () {
        $limpiar.classList.toggle('visible', $input.value !== '');
        clearTimeout(temporizador);
        temporizador = setTimeout(function () {
            estado.q = $input.value.trim();
            visibles = LOTE;
            render();
        }, 160);
    });

    $limpiar.addEventListener('click', function () {
        $input.value = '';
        $limpiar.classList.remove('visible');
        estado.q = '';
        visibles = LOTE;
        render();
        $input.focus();
    });

    document.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (chip) {
            estado[chip.dataset.campo] = chip.dataset.valor;
            visibles = LOTE;
            render();
            return;
        }
        if (e.target.closest('#pfReset') || e.target.closest('[data-reset]')) {
            estado = { q: '', tipo: 'all', rubro: 'all' };
            $input.value = '';
            $limpiar.classList.remove('visible');
            visibles = LOTE;
            render();
        }
    });

    $verRubros.addEventListener('click', function () {
        abrirRubros($filtrosRubro.hidden);
    });

    $mas.addEventListener('click', function () {
        visibles += LOTE * 2;
        render();
    });

    /* ── Arranque ── */
    armarChips($filtrosTipo, 'tipo', tipos);
    armarChips($filtrosRubro, 'rubro', rubros);
    leerURL();
    render();

    var $anio = document.getElementById('anio');
    if ($anio) $anio.textContent = new Date().getFullYear();
})();
