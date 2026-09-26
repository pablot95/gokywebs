/* ============================================================
   modelos/wire.js — Dibuja las muestras con fotos de ejemplo.

   GW_WIRE.render(modelo) devuelve el HTML de la página entera.
   Las fotos son ejemplos reutilizables, y los textos largos son
   rayas. Lo que se lee (títulos, botones,
   precios) va escrito para que se entienda qué es cada parte.

   Computadora y celular salen del MISMO HTML: .wf es un
   container (container-type: inline-size) y style.css cambia la
   distribución con @container cuando el lienzo es angosto. Así
   un modelo nuevo no necesita una versión aparte para celular.
   ============================================================ */
var GW_WIRE = (function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    function rep(n, fn) {
        var h = '';
        for (var i = 0; i < n; i++) h += fn(i);
        return h;
    }

    var fotosPorRubro = {
        comercios: ['productos', 'hogar', 'moda'],
        gastronomia: ['gastronomia'],
        moda: ['moda'],
        hogar: ['hogar'],
        belleza: ['bienestar', 'productos'],
        salud: ['bienestar', 'oficina'],
        legales: ['oficina'],
        finanzas: ['oficina'],
        inmobiliaria: ['hogar', 'turismo'],
        educacion: ['educacion'],
        tecnologia: ['tecnologia', 'productos'],
        industria: ['industria', 'tecnologia'],
        servicios: ['oficina', 'tecnologia', 'industria'],
        automotor: ['automotor', 'tecnologia'],
        deportes: ['deportes', 'productos'],
        arte: ['arte', 'educacion'],
        turismo: ['turismo', 'hogar']
    };
    var rubroModelosOriginales = {
        a: 'comercios', b: 'comercios', c: 'moda', d: 'comercios',
        e: 'gastronomia', f: 'legales', g: 'salud', h: 'belleza',
        i: 'inmobiliaria', j: 'inmobiliaria', k: 'educacion'
    };
    var fotosPorModelo = {
        'Eventos con reserva': ['eventos'],
        'Portfolio de artista': ['artista'],
        'Agenda de espectáculos': ['arte'],
        'Repuestos por vehículo': ['repuestos']
    };
    var modeloActual, seccionActual, fotoNumero;

    /* ── Piezas ── */
    var IC = {
        buscar: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
        carrito: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
        pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
        check: '<path d="M5 12l5 5L20 7"/>',
        abajo: '<path d="m6 9 6 6 6-6"/>',
        der: '<path d="m9 6 6 6-6 6"/>',
        izq: '<path d="m15 6-6 6 6 6"/>',
        estrella: '<path fill="currentColor" stroke="none" d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
        wsp: '<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 7.8 19.4z"/>',
        camion: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
        tarjeta: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
        cambio: '<path d="M4 7h13l-3-3M20 17H7l3 3"/>',
        escudo: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
        reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        mas: '<path d="M12 5v14M5 12h14"/>',
        corazon: '<path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z"/>'
    };
    function ic(nombre, clase) {
        return '<svg class="wf-ic' + (clase ? ' ' + clase : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[nombre] || '') + '</svg>';
    }
    function img(clase, ratio) {
        var rubro = modeloActual && modeloActual.rubros && modeloActual.rubros[0] ||
            rubroModelosOriginales[modeloActual && modeloActual.id] || 'comercios';
        var fotos = fotosPorModelo[modeloActual && modeloActual.nombre] ||
            fotosPorRubro[rubro] || fotosPorRubro.comercios;
        var foto = fotos[/^hero|^banner/.test(seccionActual || '') ? 0 : fotoNumero % fotos.length];
        var posiciones = ['center', '40% center', '60% center', 'center'];
        var estilo = (ratio ? 'aspect-ratio:' + ratio + ';' : '') +
            '--wf-foto:url(/modelos/assets/' + foto + '.webp);' +
            '--wf-pos:' + posiciones[fotoNumero % posiciones.length];
        fotoNumero++;
        return '<div class="wf-img' + (clase ? ' ' + clase : '') + '" style="' + estilo + '" aria-hidden="true"></div>';
    }
    function lineas(n, clase) {
        return '<div class="wf-lineas' + (clase ? ' ' + clase : '') + '">' +
            rep(n, function (i) { return '<span' + (n > 1 && i === n - 1 ? ' class="corta"' : '') + '></span>'; }) +
            '</div>';
    }
    function btn(texto, variante, icono) {
        return '<span class="wf-btn' + (variante ? ' wf-btn-' + variante : '') + '">' + (icono ? ic(icono) : '') + esc(texto) + '</span>';
    }
    function logo(texto) {
        return '<span class="wf-logo"><i></i>' + esc(texto || 'Tu marca') + '</span>';
    }
    function eyebrow(t) { return '<span class="wf-eyebrow">' + esc(t) + '</span>'; }
    function h2(t, clase) { return '<h3 class="wf-h2' + (clase ? ' ' + clase : '') + '">' + esc(t) + '</h3>'; }
    function input(texto, icono) {
        return '<span class="wf-input">' + (icono ? ic(icono) : '') + '<span>' + esc(texto) + '</span></span>';
    }
    function select(texto) {
        return '<span class="wf-input wf-select"><span>' + esc(texto) + '</span>' + ic('abajo') + '</span>';
    }
    function in_(contenido, clase) {
        return '<div class="wf-in' + (clase ? ' ' + clase : '') + '">' + contenido + '</div>';
    }

    function producto(estilo) {
        if (estilo === 'foto') {
            return '<div class="wf-prod wf-prod-foto">' + img('', '3/4') +
                '<span class="wf-prod-nombre">Nombre del producto</span>' +
                '<span class="wf-precio">$ 00.000</span>' +
                '<span class="wf-colores"><i></i><i></i><i></i></span></div>';
        }
        return '<div class="wf-prod">' + img('', '1/1') +
            '<span class="wf-prod-nombre">Nombre del producto</span>' +
            '<span class="wf-precio">$ 00.000</span>' +
            '<span class="wf-cuotas">3 cuotas sin interés</span>' +
            btn('Agregar al carrito', 'bloque') + '</div>';
    }

    /* ── Secciones ── */
    var S = {};

    S['aviso'] = function (o) {
        return in_(esc(o.texto || 'Aviso para tus clientes'), 'wf-aviso-in');
    };

    S['header-tienda'] = function () {
        return in_(
            '<span class="wf-solo-cel">' + ic('menu') + '</span>' + logo() +
            '<nav class="wf-nav"><span>Inicio</span><span>Productos</span><span>Categorías</span><span>Ofertas</span><span>Contacto</span></nav>' +
            '<span class="wf-iconos">' + ic('buscar', 'wf-solo-pc') + ic('usuario', 'wf-solo-pc') + '<span class="wf-carrito">' + ic('carrito') + '<b>2</b></span></span>',
            'wf-hdr');
    };

    S['header-buscador'] = function () {
        return in_(
            logo() + '<span class="wf-hdr-busca">' + input('Buscá productos, marcas o códigos…', 'buscar') + '</span>' +
            '<span class="wf-iconos">' + ic('usuario') + '<span class="wf-carrito">' + ic('carrito') + '<b>2</b></span></span>',
            'wf-hdr wf-hdr-grande') +
            '<div class="wf-hdr-cats">' + in_(
                '<span class="wf-cat-todas">' + ic('menu') + 'Todas las categorías</span>' +
                '<span>Ofertas</span><span>Novedades</span><span>Categoría</span><span>Categoría</span><span>Categoría</span>') + '</div>';
    };

    S['header-centrado'] = function () {
        return in_(
            '<nav class="wf-nav wf-nav-izq"><span>Mujer</span><span>Hombre</span><span>Accesorios</span></nav>' +
            '<span class="wf-solo-cel">' + ic('menu') + '</span>' +
            logo('TU MARCA') +
            '<span class="wf-iconos">' + ic('buscar') + ic('corazon', 'wf-solo-pc') + '<span class="wf-carrito">' + ic('carrito') + '<b>1</b></span></span>',
            'wf-hdr wf-hdr-centrado');
    };

    S['header-simple'] = function (o) {
        var boton = o.boton || 'Contactanos';
        return in_(
            logo() +
            '<nav class="wf-nav"><span>Inicio</span><span>Servicios</span><span>Nosotros</span><span>Contacto</span></nav>' +
            '<span class="wf-solo-pc">' + btn(boton, /whatsapp/i.test(boton) ? 'wsp' : '', /whatsapp/i.test(boton) ? 'wsp' : '') + '</span>' +
            '<span class="wf-solo-cel">' + ic('menu') + '</span>',
            'wf-hdr');
    };

    S['header-inmo'] = function () {
        return in_(
            logo('Tu inmobiliaria') +
            '<nav class="wf-nav"><span>Comprar</span><span>Alquilar</span><span>Emprendimientos</span><span>Tasaciones</span><span>Contacto</span></nav>' +
            '<span class="wf-solo-pc">' + btn('WhatsApp', 'wsp', 'wsp') + '</span>' +
            '<span class="wf-solo-cel">' + ic('menu') + '</span>',
            'wf-hdr');
    };

    S['header-comida'] = function () {
        return in_(
            logo('Tu local') +
            '<span class="wf-abierto"><i></i>Abierto ahora</span>' +
            '<span class="wf-iconos"><span class="wf-carrito">' + ic('carrito') + '<b>2</b></span></span>',
            'wf-hdr');
    };

    S['header-cursos'] = function () {
        return in_(
            logo('Tu academia') +
            '<nav class="wf-nav"><span>Cursos</span><span>Docentes</span><span>Preguntas</span></nav>' +
            '<span class="wf-solo-pc wf-hdr-btns">' + btn('Ingresar', 'ghost') + btn('Ver cursos') + '</span>' +
            '<span class="wf-solo-cel">' + ic('menu') + '</span>',
            'wf-hdr');
    };

    S['hero-banner'] = function () {
        return in_(
            '<div class="wf-banner">' + img('wf-banner-img') +
                '<div class="wf-banner-txt">' + eyebrow('Nueva temporada') +
                    '<h2 class="wf-h1">Título de tu promoción</h2>' + lineas(2) + btn('Ver productos') +
                '</div>' +
                '<span class="wf-flecha wf-flecha-izq">' + ic('izq') + '</span><span class="wf-flecha wf-flecha-der">' + ic('der') + '</span>' +
            '</div>' +
            '<div class="wf-dots"><i class="on"></i><i></i><i></i></div>');
    };

    S['hero-pantalla'] = function () {
        return '<div class="wf-pantalla">' + img('wf-oscura wf-pantalla-img') +
            '<div class="wf-pantalla-txt">' + eyebrow('Colección otoño') +
                '<h2 class="wf-h1 wf-h1-xl">Colección nueva</h2>' + btn('Ver la colección', 'claro') +
            '</div></div>';
    };

    S['hero-corto'] = function () {
        return in_(
            '<span class="wf-migas">Inicio / Productos</span>' +
            '<h2 class="wf-h1">Productos</h2>' + lineas(1, 'wf-lineas-cortas'));
    };

    S['hero-dividido'] = function () {
        return in_(
            '<div class="wf-hero-txt">' + eyebrow('Tu profesión o rubro') +
                '<h2 class="wf-h1">Título claro de lo que hacés y para quién</h2>' + lineas(3) +
                '<div class="wf-btns">' + btn('Pedir presupuesto') + btn('Ver servicios', 'ghost') + '</div>' +
                '<div class="wf-pruebas">' +
                    rep(3, function () { return '<span>' + ic('check') + '<i></i></span>'; }) +
                '</div>' +
            '</div>' + img('wf-redondo', '5/4'),
            'wf-split');
    };

    S['hero-centrado'] = function () {
        return in_(
            '<div class="wf-centro">' + eyebrow('Tu nombre · tu profesión') +
                '<h2 class="wf-h1 wf-h1-xl">Una frase que diga lo que hacés</h2>' +
                lineas(2, 'wf-lineas-centro') + btn('Escribime por WhatsApp', 'wsp', 'wsp') +
            '</div>' + img('wf-redondo wf-ancha', '1120/460'));
    };

    S['hero-fondo'] = function () {
        return '<div class="wf-pantalla wf-pantalla-izq">' + img('wf-oscura wf-fondo-img') +
            '<div class="wf-pantalla-txt">' + eyebrow('Tu centro · tu barrio') +
                '<h2 class="wf-h1">Tu servicio, con turno en dos clics</h2>' + lineas(2, 'wf-lineas-claras') +
                '<div class="wf-btns">' + btn('Pedir turno') + btn('Ver servicios', 'claro-ghost') + '</div>' +
            '</div></div>';
    };

    S['hero-inmo'] = function () {
        return '<div class="wf-pantalla wf-inmo">' + img('wf-oscura wf-inmo-img') +
            '<div class="wf-pantalla-txt">' +
                '<h2 class="wf-h1">Encontrá tu próxima casa</h2>' +
                '<div class="wf-buscador">' +
                    '<div class="wf-tabs"><span class="on">Comprar</span><span>Alquilar</span></div>' +
                    '<div class="wf-buscador-campos">' + select('Tipo de propiedad') + select('Zona o barrio') + select('Ambientes') + btn('Buscar', '', 'buscar') + '</div>' +
                '</div>' +
            '</div></div>';
    };

    S['hero-video'] = function () {
        return in_(
            '<div class="wf-hero-txt">' + eyebrow('Cursos online') +
                '<h2 class="wf-h1">Aprendé tu oficio desde tu casa</h2>' + lineas(3) +
                '<div class="wf-btns">' + btn('Ver cursos') + btn('Clase gratis', 'ghost') + '</div>' +
                '<div class="wf-stats">' +
                    '<span><b>+000</b>alumnos</span><span><b>00</b>cursos</span><span><b>4,9</b>de valoración</span>' +
                '</div>' +
            '</div>' +
            '<div class="wf-video">' + img('wf-redondo', '16/9') + '<span class="wf-play">' + ic('play') + '</span></div>',
            'wf-split');
    };

    S['hero-comida'] = function () {
        return in_(
            img('wf-redondo wf-portada') +
            '<div class="wf-local">' +
                '<span class="wf-local-logo"></span>' +
                '<div><h2 class="wf-h1 wf-h1-chico">Tu local</h2>' +
                '<div class="wf-chips"><span>' + ic('camion') + 'Delivery 30-45 min</span><span>Retiro en el local</span><span>Pedido mínimo $0.000</span></div></div>' +
            '</div>');
    };

    S['categorias-circulos'] = function () {
        return in_(h2('Categorías', 'wf-centrado') +
            '<div class="wf-circulos">' + rep(6, function () {
                return '<span>' + img('wf-circulo', '1/1') + '<b>Categoría</b></span>';
            }) + '</div>');
    };

    S['categorias-tarjetas'] = function () {
        var nombres = ['Mujer', 'Hombre', 'Accesorios'];
        return in_('<div class="wf-colecciones">' + nombres.map(function (n) {
            return '<div class="wf-coleccion">' + img('wf-oscura', '4/5') + '<span>' + esc(n) + ic('der') + '</span></div>';
        }).join('') + '</div>');
    };

    S['productos-carrusel'] = function (o) {
        return in_(
            '<div class="wf-cabecera">' + h2(o.titulo || 'Destacados') +
                '<span class="wf-flechitas">' + ic('izq') + ic('der') + '</span></div>' +
            '<div class="wf-carrusel">' + rep(5, function () { return producto(o.estilo); }) + '</div>');
    };

    S['productos-grilla'] = function (o) {
        var cols = o.cols || 4, filas = o.filas || 2;
        return in_(
            '<div class="wf-cabecera">' + h2(o.titulo || 'Productos') + '<span class="wf-link">Ver todos →</span></div>' +
            '<div class="wf-grilla" style="--cols:' + cols + '">' + rep(cols * filas, function () { return producto(o.estilo); }) + '</div>', 'wf-ancho');
    };

    S['productos-filtros'] = function () {
        var grupo = function (titulo, contenido) {
            return '<div class="wf-filtro"><b>' + esc(titulo) + ic('abajo') + '</b>' + contenido + '</div>';
        };
        var checks = rep(5, function (i) { return '<span class="wf-check' + (i === 1 ? ' on' : '') + '"><i></i><em></em></span>'; });
        return in_(
            '<div class="wf-catalogo">' +
                '<aside class="wf-filtros">' +
                    '<span class="wf-filtros-tit">Filtrar</span>' +
                    grupo('Categoría', checks) +
                    grupo('Precio', '<span class="wf-rango"><i></i></span><span class="wf-rango-num"><em>$ 0</em><em>$ 00.000</em></span>') +
                    grupo('Talle', '<span class="wf-talles">' + ['35', '36', '37', '38', '39', '40'].map(function (t, i) { return '<em' + (i === 2 ? ' class="on"' : '') + '>' + t + '</em>'; }).join('') + '</span>') +
                    grupo('Marca', rep(3, function () { return '<span class="wf-check"><i></i><em></em></span>'; })) +
                '</aside>' +
                '<div class="wf-catalogo-main">' +
                    '<div class="wf-barra">' +
                        '<span class="wf-solo-cel">' + btn('Filtrar', 'ghost') + '</span>' +
                        '<span class="wf-barra-n wf-solo-pc">24 productos</span>' + select('Ordenar: más vendidos') +
                    '</div>' +
                    '<div class="wf-grilla" style="--cols:3">' + rep(9, function () { return producto(); }) + '</div>' +
                    '<div class="wf-paginas"><span class="on">1</span><span>2</span><span>3</span><span>' + ic('der') + '</span></div>' +
                '</div>' +
            '</div>', 'wf-ancho');
    };

    S['productos-mosaico'] = function () {
        return in_(h2('La colección', 'wf-centrado') +
            '<div class="wf-mosaico">' + rep(5, function (i) {
                return '<div class="wf-mosaico-item' + (i === 0 ? ' grande' : '') + '">' + img('') +
                    '<span class="wf-mosaico-txt"><b>Nombre del producto</b><em>$ 00.000</em></span></div>';
            }) + '</div>');
    };

    S['lista-mayorista'] = function () {
        var fila = function () {
            return '<div class="wf-fila">' + img('', '1/1') +
                '<span class="wf-fila-nombre"><b>Nombre del producto x 12 u.</b><em>Cód. 0000</em></span>' +
                '<span class="wf-precio">$ 00.000</span>' +
                '<span class="wf-stepper"><i>−</i><b>0</b><i>+</i></span>' +
                '<span class="wf-solo-pc">' + btn('Agregar', 'chico') + '</span>' +
            '</div>';
        };
        return in_(
            '<div class="wf-tabs wf-tabs-linea"><span class="on">Todos</span><span>Limpieza</span><span>Papel</span><span>Bazar</span><span>Perfumería</span><span>Ofertas</span></div>' +
            '<div class="wf-mayorista">' +
                '<div class="wf-tabla">' +
                    '<div class="wf-fila wf-fila-cab wf-solo-pc"><span></span><span>Producto</span><span>Precio por bulto</span><span>Cantidad</span><span></span></div>' +
                    rep(7, fila) +
                '</div>' +
                '<aside class="wf-pedido">' +
                    '<b class="wf-pedido-tit">Tu pedido</b>' +
                    rep(3, function () { return '<span class="wf-pedido-item"><em></em><em>$ 00.000</em></span>'; }) +
                    '<span class="wf-pedido-total"><b>Total</b><b>$ 000.000</b></span>' +
                    '<span class="wf-minimo"><em>Compra mínima $00.000</em><span class="wf-rango"><i style="width:70%"></i></span></span>' +
                    btn('Enviar pedido por WhatsApp', 'wsp wf-btn-bloque', 'wsp') +
                '</aside>' +
            '</div>' +
            '<div class="wf-barra-pedido wf-solo-cel"><span>Ver pedido (3)</span><b>$ 000.000</b></div>', 'wf-ancho');
    };

    S['menu-comida'] = function () {
        var plato = function () {
            return '<div class="wf-plato"><span class="wf-plato-txt"><b>Nombre del plato</b>' + lineas(2) +
                '<span class="wf-precio">$ 0.000</span></span>' +
                '<span class="wf-plato-img">' + img('wf-redondo', '1/1') + '<i>' + ic('mas') + '</i></span></div>';
        };
        var bloque = function (titulo) {
            return h2(titulo) + '<div class="wf-platos">' + rep(4, plato) + '</div>';
        };
        return in_(
            '<div class="wf-tabs wf-tabs-pill"><span class="on">Pizzas</span><span>Empanadas</span><span>Minutas</span><span>Bebidas</span><span>Postres</span></div>' +
            bloque('Pizzas') + bloque('Empanadas') +
            '<div class="wf-barra-pedido"><span>Ver pedido · 2 productos</span><b>$ 00.000</b></div>');
    };

    S['beneficios'] = function (o) {
        var items = o.items || [['camion', 'Envíos a todo el país'], ['tarjeta', 'Hasta 6 cuotas'], ['cambio', 'Cambios fáciles'], ['escudo', 'Compra segura']];
        return in_('<div class="wf-beneficios">' + items.map(function (it) {
            return '<span><i>' + ic(it[0]) + '</i><b>' + esc(it[1]) + '</b>' + lineas(1) + '</span>';
        }).join('') + '</div>');
    };

    S['banners-doble'] = function () {
        return in_('<div class="wf-dobles">' + rep(2, function (i) {
            return '<div class="wf-doble">' + img('', '16/9') + '<span class="wf-doble-txt">' + eyebrow(i ? 'Nuevo' : 'Promoción') +
                '<b>' + (i ? 'Lo último que llegó' : 'Hasta 30% off') + '</b>' + btn('Ver más', 'chico') + '</span></div>';
        }) + '</div>');
    };

    S['newsletter'] = function () {
        return in_('<div class="wf-centro">' + h2('Recibí las novedades') + lineas(1, 'wf-lineas-centro') +
            '<span class="wf-form-linea">' + input('Tu email') + btn('Suscribirme') + '</span></div>');
    };

    S['historia'] = function (o) {
        return in_(
            img(o.circulo ? 'wf-circulo wf-docente' : 'wf-redondo', o.circulo ? '1/1' : '4/5') +
            '<div class="wf-hero-txt">' + eyebrow(o.eyebrow || 'Nuestra historia') +
                h2(o.titulo || 'La historia detrás de tu marca') + lineas(4) + btn('Conocé más', 'ghost') +
            '</div>',
            'wf-split' + (o.invertir ? ' wf-invertir' : ''));
    };

    S['instagram'] = function () {
        return in_('<div class="wf-centro">' + h2('Seguinos en Instagram') + '<span class="wf-arroba">@tumarca</span></div>' +
            '<div class="wf-insta">' + rep(6, function () { return img('', '1/1'); }) + '</div>');
    };

    S['servicios-tarjetas'] = function (o) {
        var items = o.items || ['Servicio', 'Servicio', 'Servicio'];
        return in_('<div class="wf-centro">' + eyebrow('Servicios') + h2(o.titulo || 'Qué hacemos') + '</div>' +
            '<div class="wf-tarjetas">' + items.map(function (t) {
                return '<div class="wf-tarjeta"><i class="wf-ic-circ"></i><b>' + esc(t) + '</b>' + lineas(3) + '<span class="wf-link">Consultar →</span></div>';
            }).join('') + '</div>');
    };

    S['testimonios'] = function () {
        return in_(h2('Lo que dicen de nosotros', 'wf-centrado') +
            '<div class="wf-tarjetas">' + rep(3, function () {
                return '<div class="wf-tarjeta"><span class="wf-estrellas">' + rep(5, function () { return ic('estrella'); }) + '</span>' +
                    lineas(3) + '<span class="wf-autor"><i></i><b>Nombre</b></span></div>';
            }) + '</div>');
    };

    S['faq'] = function () {
        return in_(h2('Preguntas frecuentes', 'wf-centrado') +
            '<div class="wf-faq">' + rep(5, function (i) {
                return '<div class="wf-faq-item' + (i === 0 ? ' on' : '') + '"><b>Pregunta frecuente de tus clientes' + ic('abajo') + '</b>' +
                    (i === 0 ? lineas(2) : '') + '</div>';
            }) + '</div>', 'wf-angosto');
    };

    S['contacto'] = function () {
        return in_(
            '<div class="wf-hero-txt">' + h2('Contacto') + lineas(1) +
                '<div class="wf-form">' +
                    '<label>Nombre</label>' + input('') + '<label>WhatsApp</label>' + input('') +
                    '<label>Mensaje</label><span class="wf-input wf-textarea"></span>' + btn('Enviar mensaje', 'bloque') +
                '</div>' +
            '</div>' +
            '<div class="wf-mapa-bloque">' +
                '<div class="wf-mapa">' + '<span class="wf-pin" style="left:48%;top:44%">' + ic('pin') + '</span></div>' +
                '<span class="wf-dato">' + ic('pin') + '<i></i></span><span class="wf-dato">' + ic('reloj') + '<i></i></span><span class="wf-dato">' + ic('wsp') + '<i></i></span>' +
            '</div>',
            'wf-split');
    };

    S['zigzag'] = function () {
        return in_(rep(3, function (i) {
            return '<div class="wf-split wf-zig' + (i % 2 ? ' wf-invertir' : '') + '">' + img('wf-redondo', '4/3') +
                '<div class="wf-hero-txt">' + eyebrow('0' + (i + 1)) + h2(['Cómo trabajo', 'Para quién es', 'Qué te llevás'][i]) + lineas(3) + '</div></div>';
        }));
    };

    S['numeros'] = function () {
        return in_('<div class="wf-numeros">' + ['+000|clientes', '00|años', '+000|trabajos', '4,9|valoración'].map(function (n) {
            var p = n.split('|');
            return '<span><b>' + p[0] + '</b><em>' + p[1] + '</em></span>';
        }).join('') + '</div>');
    };

    S['cta-banda'] = function (o) {
        return in_('<div class="wf-banda">' +
            '<div><b class="wf-h2">' + esc(o.titulo || '¿Hablamos?') + '</b>' + lineas(1, 'wf-lineas-claras') + '</div>' +
            btn(o.boton || 'Escribinos', /whatsapp/i.test(o.boton || '') ? 'wsp' : 'claro', /whatsapp/i.test(o.boton || '') ? 'wsp' : '') +
            '</div>');
    };

    S['servicios-pestanas'] = function () {
        return in_(h2('Servicios', 'wf-centrado') +
            '<div class="wf-tabs wf-tabs-pill wf-tabs-centro"><span class="on">Servicio 1</span><span>Servicio 2</span><span>Servicio 3</span><span>Servicio 4</span></div>' +
            '<div class="wf-split wf-detalle">' + img('wf-redondo', '4/3') +
                '<div class="wf-hero-txt"><b class="wf-h3">Nombre del servicio</b>' + lineas(3) +
                '<div class="wf-chips"><span>' + ic('reloj') + '60 min</span><span>Desde $ 00.000</span></div>' +
                btn('Pedir turno') + '</div>' +
            '</div>');
    };

    S['galeria'] = function () {
        return in_(h2('Trabajos realizados', 'wf-centrado') +
            '<div class="wf-grilla" style="--cols:3">' + rep(6, function () { return img('wf-redondo', '1/1'); }) + '</div>');
    };

    S['equipo'] = function () {
        return in_(h2('Nuestro equipo', 'wf-centrado') +
            '<div class="wf-equipo">' + rep(4, function () {
                return '<span>' + img('wf-circulo', '1/1') + '<b>Nombre</b><em>Especialidad</em></span>';
            }) + '</div>');
    };

    S['turnos'] = function () {
        var dias = rep(35, function (i) {
            var d = i - 2;
            var clase = d < 1 || d > 30 ? 'fuera' : (i % 7 === 0 ? 'no' : (d === 17 ? 'on' : ''));
            return '<em class="' + clase + '">' + (d >= 1 && d <= 30 ? d : '') + '</em>';
        });
        var horas = ['09:00', '10:00', '11:30', '13:00', '15:00', '16:30', '17:30', '18:30', '19:00'];
        return in_(h2('Reservá tu turno', 'wf-centrado') +
            '<div class="wf-agenda">' +
                '<div class="wf-mes"><b>' + ic('izq') + 'Septiembre' + ic('der') + '</b>' +
                    '<div class="wf-dias">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (d) { return '<i>' + d + '</i>'; }).join('') + dias + '</div></div>' +
                '<div class="wf-horas"><b>Horarios disponibles</b>' +
                    '<div class="wf-horas-grilla">' + horas.map(function (h, i) { return '<em' + (i === 3 ? ' class="on"' : '') + '>' + h + '</em>'; }).join('') + '</div>' +
                    select('Elegí el servicio') + btn('Confirmar turno', 'bloque') +
                '</div>' +
            '</div>');
    };

    S['propiedades'] = function () {
        return in_(
            '<div class="wf-cabecera">' + h2('Propiedades destacadas') + '<span class="wf-link">Ver todas →</span></div>' +
            '<div class="wf-grilla wf-grilla-prop" style="--cols:3">' + rep(6, function (i) {
                return '<div class="wf-prop">' + '<div class="wf-prop-img">' + img('', '4/3') + '<span class="wf-badge">' + (i % 3 === 1 ? 'Alquiler' : 'Venta') + '</span></div>' +
                    '<span class="wf-precio">USD 000.000</span><span class="wf-prop-dir">' + ic('pin') + 'Dirección, barrio</span>' +
                    '<span class="wf-prop-datos"><em>3 amb.</em><em>120 m²</em><em>2 baños</em></span></div>';
            }) + '</div>');
    };

    S['mapa-lista'] = function () {
        var pins = [[18, 22], [42, 35], [65, 18], [30, 60], [72, 55], [55, 78]];
        return in_(
            '<div class="wf-barra wf-barra-inmo">' + select('Operación') + select('Tipo') + select('Precio') + select('Ambientes') +
                '<span class="wf-link wf-solo-pc">Más filtros</span></div>' +
            '<div class="wf-tabs wf-tabs-pill wf-solo-cel wf-tabs-vista"><span class="on">Lista</span><span>Mapa</span></div>' +
            '<div class="wf-mapalista">' +
                '<div class="wf-lista-prop"><span class="wf-barra-n">000 propiedades</span>' + rep(4, function () {
                    return '<div class="wf-prop wf-prop-h">' + img('', '4/3') +
                        '<div><span class="wf-precio">USD 000.000</span><span class="wf-prop-dir">' + ic('pin') + 'Dirección, barrio</span>' +
                        '<span class="wf-prop-datos"><em>3 amb.</em><em>120 m²</em><em>2 baños</em></span>' + lineas(1) + '</div></div>';
                }) + '</div>' +
                '<div class="wf-mapa wf-mapa-alto wf-solo-pc">' + pins.map(function (p) {
                    return '<span class="wf-pin-precio" style="left:' + p[0] + '%;top:' + p[1] + '%">USD 000k</span>';
                }).join('') + '</div>' +
            '</div>');
    };

    S['cursos-grilla'] = function () {
        return in_(
            '<div class="wf-cabecera">' + h2('Nuestros cursos') +
                '<div class="wf-tabs wf-tabs-pill"><span class="on">Todos</span><span>Inicial</span><span>Avanzado</span></div></div>' +
            '<div class="wf-grilla" style="--cols:3">' + rep(3, function () {
                return '<div class="wf-curso">' + img('', '16/9') +
                    '<div class="wf-chips"><span>Online</span><span>8 clases</span></div>' +
                    '<b class="wf-h3">Nombre del curso</b>' + lineas(2) +
                    '<span class="wf-curso-pie"><span class="wf-precio">$ 00.000</span>' + btn('Ver curso', 'chico') + '</span></div>';
            }) + '</div>');
    };

    S['temario'] = function () {
        return in_(
            '<div class="wf-temario">' +
                '<div>' + h2('Qué vas a aprender') +
                    rep(4, function (i) {
                        return '<div class="wf-modulo' + (i === 0 ? ' on' : '') + '"><b>Módulo ' + (i + 1) + ' · Nombre del módulo' + ic('abajo') + '</b>' +
                            (i === 0 ? rep(4, function () { return '<span class="wf-clase">' + ic('play') + '<i></i><em>12 min</em></span>'; }) : '') + '</div>';
                    }) +
                '</div>' +
                '<aside class="wf-inscripcion">' + '<div class="wf-video">' + img('wf-redondo', '16/9') + '<span class="wf-play">' + ic('play') + '</span></div>' +
                    '<span class="wf-precio wf-precio-grande">$ 00.000</span>' + btn('Inscribirme', 'bloque') +
                    rep(4, function () { return '<span class="wf-incluye">' + ic('check') + '<i></i></span>'; }) +
                '</aside>' +
            '</div>');
    };

    /* Bloques reutilizables para actividades que antes no tenían una muestra
       propia. Los nombres y las acciones se escriben en cada propuesta. */
    S['hero-rubro'] = function (o) {
        var texto = '<div class="wf-hero-rubro-txt">' + eyebrow(o.eyebrow || 'Tu rubro') +
            '<h2 class="wf-h1">' + esc(o.titulo || 'Una web para tu negocio') + '</h2>' +
            lineas(2) + btn(o.boton || 'Ver más') + '</div>';
        var modo = ['dividido', 'compacto', 'inmersivo', 'centrado'].indexOf(o.modo) >= 0 ? o.modo : 'dividido';
        return in_('<div class="wf-hero-rubro wf-hero-rubro-' + modo + '">' +
            texto + (modo === 'compacto' ? '' : img('wf-redondo', modo === 'inmersivo' ? '16/9' : '5/4')) +
            '</div>');
    };

    S['oferta-rubro'] = function (o) {
        var items = (o.items || ['Opción 1', 'Opción 2', 'Opción 3']).slice(0, 4);
        return in_(eyebrow('Elegí tu opción') + h2(o.titulo || 'Qué ofrecemos') +
            '<div class="wf-ofertas">' + items.map(function (item) {
                return '<div class="wf-oferta">' + (o.fotos ? img('', '4/3') : '<span class="wf-oferta-icono">' + ic('check') + '</span>') +
                    '<b>' + esc(item) + '</b>' + lineas(2) + '<span class="wf-link">Conocer más →</span></div>';
            }).join('') + '</div>');
    };

    S['pasos-rubro'] = function (o) {
        var items = (o.items || ['Primer paso', 'Segundo paso', 'Tercer paso']).slice(0, 4);
        return in_(h2(o.titulo || 'Cómo funciona') + '<div class="wf-pasos">' + items.map(function (item, i) {
            return '<div class="wf-paso"><span>0' + (i + 1) + '</span><b>' + esc(item) + '</b>' + lineas(2) + '</div>';
        }).join('') + '</div>');
    };

    S['reserva-rubro'] = function (o) {
        var campos = (o.campos || ['Fecha', 'Cantidad', 'Contacto']).slice(0, 4);
        return in_('<div class="wf-reserva"><div>' + eyebrow('Empezá acá') + h2(o.titulo || 'Hacé tu consulta') +
            lineas(2) + '</div><div class="wf-reserva-campos">' + campos.map(function (campo) {
                return '<label>' + esc(campo) + input('Elegir') + '</label>';
            }).join('') + btn('Consultar', 'bloque') + '</div></div>');
    };

    S['planes-rubro'] = function (o) {
        var items = (o.items || ['Esencial', 'Plus', 'Premium']).slice(0, 4);
        return in_(h2(o.titulo || 'Elegí un plan', 'wf-centrado') + '<div class="wf-planes">' + items.map(function (item, i) {
            return '<div class="wf-plan' + (i === 1 ? ' wf-plan-destacado' : '') + '">' +
                (i === 1 ? '<span class="wf-plan-etiqueta">Más elegido</span>' : '') +
                '<b>' + esc(item) + '</b><span class="wf-precio">Desde $ 00.000</span>' +
                rep(4, function () { return '<span class="wf-plan-punto">' + ic('check') + '<i></i></span>'; }) +
                btn('Consultar', 'bloque') + '</div>';
        }).join('') + '</div>');
    };

    S['agenda-rubro'] = function (o) {
        var items = (o.items || ['Primera fecha', 'Segunda fecha', 'Tercera fecha']).slice(0, 5);
        return in_(h2(o.titulo || 'Próximas fechas') + '<div class="wf-agenda-rubro">' + items.map(function (item, i) {
            return '<div class="wf-agenda-fila"><span class="wf-agenda-num">0' + (i + 1) + '</span>' +
                '<b>' + esc(item) + '</b><span class="wf-link">Consultar →</span></div>';
        }).join('') + '</div>');
    };

    S['vehiculos-rubro'] = function (o) {
        return in_(h2(o.repuestos ? 'Elegí tu vehículo' : 'Vehículos disponibles') +
            '<div class="wf-vehiculo-filtros">' + select('Marca') + select('Modelo') + select('Año') + btn('Buscar', '', 'buscar') + '</div>' +
            '<div class="wf-vehiculos">' + rep(3, function () {
                return '<div class="wf-vehiculo">' + img('', '16/10') +
                    '<div><span class="wf-badge">' + (o.repuestos ? 'Compatible' : 'Disponible') + '</span>' +
                        '<b>' + (o.repuestos ? 'Repuesto para tu vehículo' : 'Marca · Modelo · Año') + '</b>' +
                        '<span>Detalles · Información</span><strong>$ 00.000</strong>' + btn(o.repuestos ? 'Ver repuesto' : 'Consultar') +
                    '</div></div>';
            }) + '</div>');
    };

    S['footer-completo'] = function () {
        var col = function (t) { return '<div><b>' + esc(t) + '</b>' + lineas(4) + '</div>'; };
        return in_(
            '<div class="wf-footer-cols">' +
                '<div>' + logo() + lineas(2) + '<span class="wf-redes"><i></i><i></i><i></i></span></div>' +
                col('Ayuda') + col('Categorías') + col('Contacto') +
            '</div>' +
            '<div class="wf-footer-pie"><span>© Tu marca</span><span class="wf-pagos"><i></i><i></i><i></i><i></i></span></div>');
    };

    S['footer-simple'] = function () {
        return in_(logo() + lineas(1) + '<span class="wf-redes"><i></i><i></i><i></i></span>', 'wf-footer-simple-in');
    };

    /* ── Página ── */
    function render(modelo) {
        var color = /^#[0-9a-fA-F]{6}$/.test(modelo.acento || '') ? modelo.acento : '#2563eb';
        var oscuro = /^#[0-9a-fA-F]{6}$/.test(modelo.oscuro || '') ? modelo.oscuro : '#1e293b';
        modeloActual = modelo;
        var html = '<div class="wf" data-modelo="' + esc(modelo.id) + '" style="--wf-acento:' + color + ';--wf-oscuro:' + oscuro + '">' +
            modelo.secciones.map(function (s) {
                var fn = S[s[0]];
                if (!fn) return '';
                seccionActual = s[0];
                fotoNumero = 0;
                /* wf-s-<clave> y no wf-<clave>: varias secciones tienen adentro un
                   bloque con el mismo nombre (wf-beneficios, wf-faq…) y los
                   estilos de uno le pegaban al otro. */
                return '<section class="wf-s wf-s-' + esc(s[0]) + '" data-parte="' + esc(s[1] || '') + '">' + fn(s[2] || {}) + '</section>';
            }).join('') +
            '</div>';
        modeloActual = null;
        return html;
    }

    /* Achica un lienzo de `ancho` px para que entre en `caja`. El transform no
       cambia el layout, así que el padre (.md-alto) recibe el alto ya achicado:
       sin eso la caja scrollearía el alto de la página a tamaño real. */
    function encajar(caja, lienzo, ancho) {
        var alto = lienzo.parentNode;
        function medir() {
            var w = caja.clientWidth;
            if (!w) return;
            var s = Math.min(1, w / ancho);
            lienzo.style.transform = s < 1 ? 'scale(' + s + ')' : '';
            alto.style.height = Math.ceil(lienzo.offsetHeight * s) + 'px';
        }
        medir();
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(medir);
            ro.observe(caja);
            ro.observe(lienzo);
        } else {
            window.addEventListener('resize', medir);
        }
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
        return medir;
    }

    return { render: render, encajar: encajar, secciones: Object.keys(S) };
})();
