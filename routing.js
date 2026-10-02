/* ============================================
   routing.js — Deep-link al portafolio
   Uso:
     gokywebs.net/#profesionales
     gokywebs.net/?cat=profesionales
     gokywebs.net/serviciosprofesionales   (via 404.html redirect)
   ============================================ */
(function () {

    // Mapa slug → filtro del visor del portfolio (portfolio/visor.js).
    // Los slugs son las categorías viejas de la home: siguen andando los
    // links que ya circulan (/#moda, /serviciosprofesionales, ?cat=…).
    const SLUG_MAP = {
        'ecommerce':              { tipo: 'ecommerce' },
        'tiendaonline':           { tipo: 'ecommerce' },
        'comercios':              { rubro: 'comercios' },
        'comerciosytiendas':      { rubro: 'comercios' },
        'tiendas':                { rubro: 'comercios' },
        'profesionales':          { tipo: 'landing' },
        'serviciosprofesionales': { tipo: 'landing' },
        'servicios':              { tipo: 'landing' },
        'moda':                   { rubro: 'moda' },
        'indumentaria':           { rubro: 'moda' },
        'modaeindumentaria':      { rubro: 'moda' },
        'gastronomia':            { rubro: 'gastronomia' },
        'gastronomiaoeventos':    { rubro: 'gastronomia' },
        'tecnologia':             { rubro: 'tecnologia' },
        'electronica':            { rubro: 'tecnologia' },
        'tecnologiaelectronica':  { rubro: 'tecnologia' },
        'inmobiliaria':           { tipo: 'inmobiliaria' },
        'cursos':                 { tipo: 'elearning' }
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
            var slug = normalize(raw);
            if (Object.prototype.hasOwnProperty.call(SLUG_MAP, slug)) return slug;
        }

        // 2. Hash: #profesionales
        var hash = window.location.hash.replace('#', '');
        if (hash) {
            var slugH = normalize(hash);
            if (Object.prototype.hasOwnProperty.call(SLUG_MAP, slugH)) return slugH;
        }

        return null;
    }

    function activate(cat) {
        // El visor, no el título de la sección: así queda entero en la pantalla.
        var portfolioSection = document.querySelector('.gv--seccion') || document.getElementById('portafolio');
        if (window.GWVisor) window.GWVisor.filtrar(SLUG_MAP[cat]);

        if (portfolioSection) {
            /* Con Lenis activo, el scrollIntoView nativo queda a mitad de
               camino (Lenis lo pisa en el frame siguiente): se baja con Lenis. */
            setTimeout(function () {
                if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                    window.lenis.scrollTo(portfolioSection, { duration: 1.4 });
                } else {
                    /* Sin Lenis (celular) el scroll suave nativo se cortaba
                       antes de arrancar: se salta directo a la sección. */
                    var y = portfolioSection.getBoundingClientRect().top + window.pageYOffset - 10;
                    window.scrollTo(0, Math.max(0, y));
                }
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
