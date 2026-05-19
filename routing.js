/* ============================================
   routing.js — Deep-link al portafolio
   Uso:
     gokywebs.net/#profesionales
     gokywebs.net/?cat=profesionales
     gokywebs.net/serviciosprofesionales   (via 404.html redirect)
   ============================================ */
(function () {

    // Mapa slug → data-cat del botón
    const SLUG_MAP = {
        'comercios':              'comercios',
        'comerciosytiendas':      'comercios',
        'tiendas':                'comercios',
        'profesionales':          'profesionales',
        'serviciosprofesionales': 'profesionales',
        'servicios':              'profesionales',
        'moda':                   'moda',
        'indumentaria':           'moda',
        'modaeindumentaria':      'moda',
        'gastronomia':            'gastronomia',
        'gastronomiaoeventos':    'gastronomia',
        'tecnologia':             'tecnologia',
        'electronica':            'tecnologia',
        'tecnologiaelectronica':  'tecnologia',
        'inmobiliaria':           'inmobiliaria'
    };

    function normalize(str) {
        return str
            .toLowerCase()
            .replace(/\s+/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // quita tildes
    }

    function getTargetCat() {
        // 1. Query param ?cat= o ?p= (viene del redirect de 404.html)
        var params = new URLSearchParams(window.location.search);
        var raw = params.get('cat') || params.get('p') || '';
        if (raw) {
            var cat = SLUG_MAP[normalize(raw)];
            if (cat) return cat;
        }

        // 2. Hash: #profesionales
        var hash = window.location.hash.replace('#', '');
        if (hash) {
            var catH = SLUG_MAP[normalize(hash)];
            if (catH) return catH;
        }

        return null;
    }

    function activate(cat) {
        var portfolioSection = document.getElementById('portafolio');
        var btn = document.querySelector('.pf-cat[data-cat="' + cat + '"]');

        if (btn) btn.click();

        if (portfolioSection) {
            setTimeout(function () {
                portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
        }

        // Limpiar la URL para que quede limpia (sin ?p=...)
        if (window.history && window.history.replaceState) {
            var clean = window.location.pathname + '#' + cat;
            window.history.replaceState(null, '', clean);
        }
    }

    function init() {
        var cat = getTargetCat();
        if (!cat) return;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                // Esperar a que el portfolio termine de inicializarse
                setTimeout(function () { activate(cat); }, 400);
            });
        } else {
            setTimeout(function () { activate(cat); }, 400);
        }
    }

    init();

})();
