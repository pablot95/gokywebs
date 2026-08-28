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

    /* El índice de búsqueda mezcla todo lo que el visitante podría tipear:
       nombre, profesión, zona, tags, el tipo y el rubro en castellano, y el dominio. */
    trabajos.forEach(function (t) {
        t._buscable = normalizar([
            t.nombre, t.que, t.zona, t.tags,
            LABEL_TIPO[t.tipo] || t.tipo,
            LABEL_RUBRO[t.rubro] || t.rubro,
            t.tipo, t.rubro,
            dominio(t.url).replace(/[.-]/g, ' ')
        ].join(' '));
    });

    /* ── Estado ── */
    var estado = { q: '', tipo: 'all', rubro: 'all' };
    var visibles = LOTE;

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
            if (estado.tipo !== 'all' && t.tipo !== estado.tipo) return false;
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
            if (campo !== 'tipo' && estado.tipo !== 'all' && t.tipo !== estado.tipo) return false;
            if (campo !== 'rubro' && estado.rubro !== 'all' && t.rubro !== estado.rubro) return false;
            if (valor !== 'all' && t[campo] !== valor) return false;
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
        var etiquetas = '<span class="tag">' + esc(LABEL_TIPO[t.tipo] || t.tipo) + '</span>' +
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
        return art;
    }

    function render() {
        var res = filtrar();
        $grid.textContent = '';
        var tanda = res.slice(0, visibles);
        var frag = document.createDocumentFragment();
        tanda.forEach(function (t) { frag.appendChild(tarjeta(t)); });
        $grid.appendChild(frag);

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
