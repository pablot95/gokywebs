/* gokywebs.com/webcompleta (antes /webpro) y /sitioweb (11-nov-2026): el plan se elige con dos
 * radios (elegir-plan.css, anda sin JavaScript). Acá: /webcompleta#mensual o
 * #anual abre ese plan ya elegido, y al tocar uno en el celular la vista baja
 * al detalle, que queda debajo de las dos tarjetas. */
(function () {
    'use strict';
    var radios = { anual: document.getElementById('elegir-anual'), mensual: document.getElementById('elegir-mensual') };
    if (!radios.anual || !radios.mensual) return;
    var reducido = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function desdeLaDireccion() {
        var plan = (location.hash || '').replace('#', '').toLowerCase();
        if (radios[plan]) radios[plan].checked = true;
    }
    desdeLaDireccion();
    window.addEventListener('hashchange', desdeLaDireccion);

    Object.keys(radios).forEach(function (plan) {
        radios[plan].addEventListener('change', function () {
            if (!radios[plan].checked) return;
            if (history.replaceState) history.replaceState(null, '', '#' + plan);
            var panel = document.getElementById('plan-' + plan);
            if (!panel) return;
            var arriba = panel.getBoundingClientRect().top;
            if (arriba > window.innerHeight * 0.75) panel.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
        });
    });
})();
