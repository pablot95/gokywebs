(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobilePerformanceMode = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  var compactPreviews = window.matchMedia('(max-width: 700px)').matches;
  var OPTIMIZED_PREVIEWS = 'images/previews/optimized/';

  function previewSrc(project, kind) {
    return OPTIMIZED_PREVIEWS + project.id + '_' + kind + '.webp';
  }

  /* ---------- GSAP fallback: si el CDN cae, el contenido NUNCA queda invisible ---------- */
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  } else if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Lenis (orden exacto: ticker ANTES de lenis.on) ---------- */
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion && !mobilePerformanceMode) {
    var lenis = new Lenis();
    window.lenis = lenis;
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---------- Hero: puente de scroll al fondo animado (type: 'scroll') ---------- */
  (function () {
    var frame = document.getElementById('hero-bg');
    var hero = document.getElementById('hero');
    if (!frame || !hero) return;
    function sendProgress() {
      var total = hero.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-hero.getBoundingClientRect().top, 0), total);
      var progress = total > 0 ? scrolled / total : 0;
      if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'scroll', progress: progress }, '*');
    }
    window.addEventListener('scroll', sendProgress, { passive: true });
    window.addEventListener('resize', sendProgress);
    frame.addEventListener('load', function () { setTimeout(sendProgress, 60); });
    sendProgress();
  })();

  /* ---------- Hero reveal (entrada al cargar) ---------- */
  function playHero() {
    if (typeof gsap === 'undefined' || reduceMotion) return;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    var title = document.querySelector('.hero-title');
    if (title && typeof SplitText !== 'undefined') {
      var split = new SplitText(title, { type: 'lines', linesClass: 'split-line' });
      gsap.set(split.lines, { overflow: 'hidden' });
      tl.from(split.lines, { yPercent: 115, opacity: 0, duration: 1.05, stagger: 0.12 }, 0);
    } else if (title) {
      tl.from(title, { y: 40, opacity: 0, duration: 1 }, 0);
    }
    tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7 }, 0.1)
      .from('.hero-sub', { y: 24, opacity: 0, duration: 0.8 }, 0.5)
      .from('.hero-cta', { y: 24, opacity: 0, duration: 0.8 }, 0.65)
      .from('.hero-cue', { opacity: 0, duration: 0.8 }, 0.9);
  }

  /* ---------- Celular 3D gigante: el eje de la escalera caracol ----------
     Un smartphone construido en CSS 3D real (cara frontal + trasera + lonjas
     apiladas que dibujan el canto) clavado en el medio de la espiral. Gira un
     poco más rápido que las cards, pero sin scroll queda quieto. La pantalla
     muestra la preview mobile (_celu) del trabajo que está pasando por el
     carril frontal en ese momento. */
  function buildPhone(stage) {
    var wrap = document.createElement('a');
    wrap.className = 'hero-phone';
    wrap.target = '_blank';
    wrap.rel = 'noopener';
    wrap.tabIndex = -1;
    wrap.setAttribute('aria-disabled', 'true');
    var slices = '';
    for (var i = 0; i < 8; i++) slices += '<i class="ph-slice" style="transform:translateZ(' + (10.8 - i * 21.6 / 7).toFixed(2) + 'px)"></i>';
    /* Las DOS caras son pantalla y muestran el mismo contenido. El cambio se
       hace cuando el celular está de canto; al llegar de frente, la nueva web
       ya está cargada y se puede abrir haciendo clic sobre el dispositivo. */
    function cara(clase) {
      return '<div class="' + clase + '">' +
        '<img class="ph-screen" alt="" width="430" height="1000" decoding="async" draggable="false">' +
        '<img class="ph-screen" alt="" width="430" height="1000" decoding="async" draggable="false">' +
        '<div class="ph-splash"><img src="logonav.png" alt="" draggable="false"></div>' +
        '<span class="ph-notch"></span><span class="ph-glare"></span>' +
      '</div>';
    }
    wrap.innerHTML = '<div class="ph">' + slices + cara('ph-back') + cara('ph-front') + '</div>' +
      '<span class="ph-link-cue">Abrir web <i aria-hidden="true">↗</i></span>';
    stage.appendChild(wrap);

    /* Cada cara lleva su propio crossfade de doble capa: la preview nueva se
       carga en la capa oculta y recién cuando terminó de cargar se le cede el
       turno. Nunca se ve un salto en seco ni un frame en blanco.
       src vacío = vuelve el logo. */
    function mkCara(root) {
      var layers = root.querySelectorAll('.ph-screen');
      var splash = root.querySelector('.ph-splash');
      var top = 0, pedido = null;
      return function (src) {
        if (src === pedido) return;
        pedido = src;
        if (!src) { splash.classList.remove('is-off'); return; }
        var next = layers[1 - top];
        var hecho = false;
        var revelar = function () {
          /* idempotente a propósito: con la imagen en caché esto se llama dos
             veces (sincrónico + onload) y la 2ª apagaría la capa recién
             encendida, dejando la pantalla en negro */
          if (hecho || pedido !== src) return;   /* o llegó otra mientras cargaba */
          hecho = true;
          next.classList.add('is-on');
          layers[top].classList.remove('is-on');
          top = 1 - top;
          splash.classList.add('is-off');
        };
        var fallbackSrc = src.replace('images/previews/optimized/', 'images/previews/').replace('.webp', '.jpg');
        var usoFallback = false;
        var fallar = function () {
          if (pedido !== src || usoFallback || fallbackSrc === src) return;
          usoFallback = true;
          next.src = fallbackSrc;
        };
        var decodificar = function () {
          if (typeof next.decode === 'function') {
            next.decode().then(revelar, function () { if (next.naturalWidth) revelar(); else fallar(); });
          } else if (next.naturalWidth) revelar();
        };
        next.onload = decodificar;
        next.onerror = fallar;
        next.src = src;
        if (next.complete && next.naturalWidth) decodificar();
      };
    }

    var tibias = {};
    var tibiasOrden = [];
    return {
      root: wrap,
      ph: wrap.querySelector('.ph'),
      /* índice 0 = cara de frente, 1 = cara de atrás */
      caras: [mkCara(wrap.querySelector('.ph-front')), mkCara(wrap.querySelector('.ph-back'))],
      /* deja lista la próxima preview: si tuviera que bajarla recién al llegar,
         el fundido se cortaría y la pantalla quedaría con la anterior */
      warm: function (src) {
        if (!src || tibias[src]) return;
        var im = new Image();
        tibias[src] = im;
        tibiasOrden.push(src);
        if (tibiasOrden.length > 6) delete tibias[tibiasOrden.shift()];
        im.decoding = 'async';
        im.src = src;
        if (typeof im.decode === 'function') im.decode().catch(function () {});
      },
      link: function (project) {
        if (!project || !project.url) {
          wrap.removeAttribute('href');
          wrap.removeAttribute('aria-label');
          wrap.setAttribute('aria-disabled', 'true');
          wrap.tabIndex = -1;
          wrap.classList.remove('has-link', 'is-facing');
          return;
        }
        wrap.href = project.url;
        wrap.setAttribute('aria-label', 'Abrir ' + project.name + ' en una pestaña nueva');
        wrap.removeAttribute('aria-disabled');
        wrap.tabIndex = 0;
        wrap.classList.add('has-link');
      }
    };
  }

  /* ---------- Portal visual: aura, estela e indicador del proyecto activo ---------- */
  function portalAccent(project) {
    var fallbacks = {
      ecommerce: '#35d4df',
      comercios: '#f5279e',
      profesionales: '#35e08b',
      moda: '#d8d2c4',
      gastronomia: '#f2b35d',
      tecnologia: '#5b8cff',
      inmobiliaria: '#d2b63f'
    };
    return (project && project.accent) || fallbacks[project && project.cat] || '#35e08b';
  }

  function hexToRgb(hex) {
    var clean = String(hex || '').replace('#', '');
    if (clean.length === 3) clean = clean.replace(/(.)/g, '$1$1');
    var value = parseInt(clean, 16);
    if (!isFinite(value)) return [53, 224, 139];
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  }

  function buildPortalUI(stage, total) {
    var catLabels = {
      ecommerce: 'Ecommerce',
      comercios: 'Comercios & Tiendas',
      profesionales: 'Servicios Profesionales',
      moda: 'Moda & Indumentaria',
      gastronomia: 'Gastronomía & Eventos',
      tecnologia: 'Tecnología & Electrónica',
      inmobiliaria: 'Inmobiliaria'
    };

    var aura = document.createElement('div');
    aura.className = 'spiral-aura';
    aura.setAttribute('aria-hidden', 'true');
    aura.innerHTML = '<i class="spiral-aura-layer"></i><i class="spiral-aura-layer"></i>';
    stage.insertBefore(aura, stage.firstChild);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'spiral-trail');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = '<path class="spiral-trail-glow"></path><path class="spiral-trail-core"></path>';
    stage.insertBefore(svg, stage.firstChild);

    var core = document.createElement('div');
    core.className = 'spiral-portal-core';
    core.setAttribute('aria-hidden', 'true');
    core.innerHTML = '<i class="spiral-portal-ring ring-a"></i><i class="spiral-portal-ring ring-b"></i><i class="spiral-portal-dot"></i>';
    stage.appendChild(core);

    var status = document.createElement('div');
    status.className = 'spiral-status';
    status.setAttribute('aria-hidden', 'true');
    status.innerHTML = '<span class="spiral-status-kicker">Proyecto en órbita</span>' +
      '<div class="spiral-status-count"><strong>00</strong><span>/' + String(total).padStart(2, '0') + '</span></div>' +
      '<p class="spiral-status-name">GokyWebs</p><span class="spiral-status-cat">Portfolio interactivo</span>';
    stage.appendChild(status);

    var auraLayers = aura.querySelectorAll('.spiral-aura-layer');
    var trailGlow = svg.querySelector('.spiral-trail-glow');
    var trailCore = svg.querySelector('.spiral-trail-core');
    var count = status.querySelector('strong');
    var name = status.querySelector('.spiral-status-name');
    var category = status.querySelector('.spiral-status-cat');
    var backgroundFrame = document.getElementById('hero-bg');
    var activeAura = -1;
    var activeId = null;
    var activeColor = null;

    function syncBackground() {
      if (backgroundFrame && backgroundFrame.contentWindow) {
        backgroundFrame.contentWindow.postMessage({ type: 'project', color: activeColor }, '*');
      }
    }
    if (backgroundFrame) backgroundFrame.addEventListener('load', syncBackground);

    function setProject(project, index) {
      var nextId = project ? project.id : '';
      if (nextId === activeId) return;
      activeId = nextId;

      activeColor = project ? portalAccent(project) : null;
      var rgb = hexToRgb(activeColor || '#35e08b');
      stage.style.setProperty('--portal-rgb', rgb.join(', '));
      stage.setAttribute('data-active-project', nextId || 'gokywebs');
      status.classList.toggle('has-project', !!project);
      syncBackground();

      var nextAura = activeAura === 0 ? 1 : 0;
      auraLayers[nextAura].style.background = 'radial-gradient(circle at 50% 49%, rgba(' + rgb.join(',') + ',.31) 0%, rgba(' + rgb.join(',') + ',.12) 28%, rgba(' + rgb.join(',') + ',0) 69%)';
      auraLayers[nextAura].classList.add('is-active');
      if (activeAura >= 0) auraLayers[activeAura].classList.remove('is-active');
      activeAura = nextAura;

      count.textContent = project ? String(index + 1).padStart(2, '0') : '00';
      name.textContent = project ? project.name : 'GokyWebs';
      category.textContent = project ? (catLabels[project.cat] || project.cat) : 'Portfolio interactivo';
      status.classList.remove('is-changing');
      void status.offsetWidth;
      status.classList.add('is-changing');
    }

    function trailPath(points) {
      if (!points.length) return '';
      if (points.length === 1) return 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
      var d = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
      for (var i = 1; i < points.length - 1; i++) {
        var midX = (points[i].x + points[i + 1].x) / 2;
        var midY = (points[i].y + points[i + 1].y) / 2;
        d += ' Q ' + points[i].x.toFixed(1) + ' ' + points[i].y.toFixed(1) + ' ' + midX.toFixed(1) + ' ' + midY.toFixed(1);
      }
      var last = points[points.length - 1];
      d += ' T ' + last.x.toFixed(1) + ' ' + last.y.toFixed(1);
      return d;
    }

    setProject(null, -1);
    return {
      resize: function (width, height) {
        svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      },
      setProject: setProject,
      draw: function (points, rotation, pulse) {
        var d = trailPath(points);
        trailGlow.setAttribute('d', d);
        trailCore.setAttribute('d', d);
        var dash = (-rotation * 92).toFixed(1);
        trailGlow.style.strokeDashoffset = dash;
        trailCore.style.strokeDashoffset = dash;
        stage.style.setProperty('--portal-pulse', pulse.toFixed(3));
        stage.style.setProperty('--portal-turn', (rotation * 57.2958).toFixed(2) + 'deg');
      }
    };
  }

  /* ---------- Espiral helicoidal de previews (estilo Trionn) ----------
     Los trabajos de GW_PORTFOLIO subiendo una escalera caracol alrededor del
     núcleo 3D: cada card entra por abajo DESDE EL FONDO (chica), cruza a la
     derecha, vuelve por el frente (grande) y muere arriba. Tres decisiones:
     · El giro es 1:1 con el scroll, sin inercia propia: soltás y la escalera
       queda clavada — solo el movimiento la hace girar.
     · El rotateY se proyecta con fuga COMPARTIDA en el centro de pantalla
       (translate(centro) perspective() translate(offset)): la vuelta se lee
       como órbita real alrededor del eje y no como cards flipeando en el lugar.
       Se conserva el z-index por card (las cercanas tapan los textos, z 60).
     · Las cards se maquetan al tamaño FRONTAL (FMAX) y solo se escalan hacia
       abajo: el paso cercano queda nítido, nunca se upscalea el raster. */
  function buildRibbon(heroEl) {
    var stage = heroEl.querySelector('.hero-stage');
    if (!stage || typeof GW_PORTFOLIO === 'undefined' || !GW_PORTFOLIO.length) return;

    var portalUI = buildPortalUI(stage, GW_PORTFOLIO.length);
    var phone = buildPhone(stage);

    var wrap = document.createElement('div');
    wrap.className = 'hero-ribbon';
    wrap.innerHTML = GW_PORTFOLIO.map(function (p) {
      return '<a class="ribbon-card" href="' + p.url + '" target="_blank" rel="noopener">' +
        '<img data-preview-src="' + previewSrc(p, compactPreviews ? 'web_mobile' : 'web') + '" alt="' + p.name + '" width="800" height="500" loading="eager" decoding="async" draggable="false">' +
        '<span class="ribbon-name">' + p.name + '</span></a>';
    }).join('');
    stage.insertBefore(wrap, stage.firstChild);

    var cards = Array.prototype.slice.call(wrap.children);
    var cardImages = cards.map(function (card) { return card.querySelector('img'); });
    var N = cards.length;
    var TAU = Math.PI * 2;
    var CAM = 1.85, FOC = 1.45;   /* pf = FOC/(CAM - cos u) → frente ~1.71, lados ~0.78, fondo ~0.51: todo mucho más cerca */
    var FMAX = FOC / (CAM - 1);   /* escala del paso frontal: las cards se maquetan a este tamaño */
    var PERSP = 1100;
    var U_ENTER = 1.66; /* fase al pie: cuando la card ASOMA abajo (s≈0.7) está en fondo-izquierda */
    var SPAN = 2.75 * Math.PI;    /* recorrido visible: →, ←, → subiendo (1.375 vueltas) */
    var ROT0 = 0.85;              /* offset inicial: la card 0 ya asoma al cargar */
    var W = 0, H = 0, cardW = 0, Rx = 0, stepU = 0, slope = 0, sExit = 0, rotSpeed = 0, mobile = false;
    var shown = new Array(N);
    var loadedCards = new Array(N);
    var lastRot = NaN;

    /* Las capturas de la cinta se solicitan solamente cuando su tarjeta se
       acerca al viewport. Al alejarse se libera el bitmap decodificado; el
       archivo comprimido queda en la cache del navegador para volver atras. */
    function ensureCardImage(index) {
      if (loadedCards[index]) return;
      var img = cardImages[index];
      var src = img && img.getAttribute('data-preview-src');
      if (!img || !src) return;
      loadedCards[index] = true;
      var ready = function () {
        if (img.getAttribute('src') === src && img.naturalWidth) cards[index].classList.add('is-loaded');
      };
      if (typeof img.decode === 'function') {
        img.src = src;
        img.decode().then(ready, ready);
      } else {
        img.onload = ready;
        img.src = src;
        if (img.complete && img.naturalWidth) ready();
      }
    }

    function releaseCardImage(index) {
      /* En mobile las variantes 480x300 ocupan poco; conservarlas evita
         recodificar al volver hacia atras y da un scroll mucho mas estable. */
      if (mobile) return;
      if (!loadedCards[index]) return;
      var img = cardImages[index];
      loadedCards[index] = false;
      img.onload = null;
      img.removeAttribute('src');
      cards[index].classList.remove('is-loaded');
    }

    function resize() {
      /* La geometría toma el viewport sticky real (100svh), no el alto
         fluctuante de las barras del navegador móvil. */
      W = stage.clientWidth || window.innerWidth;
      H = stage.clientHeight || window.innerHeight;
      mobile = W <= 560;
      /* mobile grande pero no invasivo: el paso frontal llega a ~68vw */
      cardW = mobile ? W * 0.396 : Math.min(Math.max(W * 0.172, 190), 312);
      /* espiral MÁS ANCHA que el viewport (100vw desktop / 120vw mobile): las
         cards entran y salen de cuadro por los costados. Ojo: ensanchar Rx NO
         cambia el aire entre cards (Rx·stepU = cardW·factor), pero baja stepU
         → menos recorrido angular total → el giro no se acelera al separarlas */
      Rx = Math.max(((mobile ? 1.2 : 1.0) * W - cardW) / (2 * FOC / CAM), cardW * (mobile ? 1.0 : 1.15));
      /* paso angular compacto: deja apenas 16% de aire en desktop y 8% en
         mobile para que los previews se lean como una secuencia continua */
      stepU = Math.max((cardW * (mobile ? 1.08 : 1.16)) / Rx, 0.3);
      /* la altura de una vuelta sale de repartir el viaje vertical en el SPAN */
      slope = (H * 1.32) / SPAN; /* px de subida por radián */
      sExit = (H * 1.16 + cardW * 0.23) / slope; /* avance al que la card muere arriba */
      /* SIN repeticiones: el scroll total del hero mapea exactamente al viaje
         completo de todas las cards — la última muere arriba al final del hero */
      var totalScroll = Math.max(heroEl.offsetHeight - H, 1);
      rotSpeed = ((N - 1) * stepU + sExit - ROT0) / totalScroll;
      wrap.style.setProperty('--card-w', Math.round(cardW * FMAX) + 'px');
      portalUI.resize(W, H);
      lastRot = NaN;
    }
    resize();
    window.addEventListener('resize', resize);

    function pos(s) {
      var u = U_ENTER + s;             /* fase absoluta en la hélice */
      var Zn = Math.cos(u);            /* +1 = pegado a cámara, -1 = fondo */
      var pf = FOC / (CAM - Zn);
      /* x espejado para que el fondo vaya → y el frente ←; y sube linealmente */
      return { x: W / 2 - Rx * Math.sin(u) * pf, y: H * 1.16 - s * slope, pf: pf, Zn: Zn, u: u };
    }

    var S_FRONT = TAU - U_ENTER; /* avance s al que una card pasa exactamente de frente */
    var frontIdx = -2;           /* qué preview está cargada en el celular (-1 = logo) */

    function frame() {
      var rect = heroEl.getBoundingClientRect();
      if (rect.bottom <= 0) return;
      /* 1:1 con el scroll: sin movimiento no hay giro, la escalera queda quieta */
      var rot = Math.max(-rect.top, 0) * rotSpeed + ROT0;
      if (rot === lastRot) return;
      lastRot = rot;
      if (phone) {
        /* Cada entero de raw es una preview centrada: ahí el teléfono queda de
           frente. El cambio ocurre en raw + .5, exactamente cuando está de
           canto. Así ninguna web cambia mientras el usuario la está mirando. */
        var raw = (rot - S_FRONT) / stepU;
        var fi = (raw < -0.5 || raw > N - 0.5) ? -1 : Math.max(0, Math.min(N - 1, Math.round(raw)));
        /* Fuera del recorrido de proyectos, el telefono termina su media
           vuelta y queda inmovil, de frente y con el logo. */
        var phoneRaw = Math.max(-1, Math.min(N, raw));
        var linearYaw = phoneRaw * Math.PI;
        var yawCurve = mobile ? 0.39 : 0.42;
        var yaw = linearYaw - Math.sin(linearYaw * 2) * yawCurve;
        var facing = Math.abs(Math.cos(yaw));
        phone.ph.style.transform = 'rotateX(-7deg) rotateY(' + (yaw * 57.2958).toFixed(2) + 'deg)';
        phone.root.style.setProperty('--phone-facing', facing.toFixed(3));
        phone.root.classList.toggle('is-facing', fi >= 0 && facing > 0.32);
        /* en pantalla, la MISMA preview que pasa por el carril frontal de la
           espiral, en el instante exacto en que cambia allá. El logo va en las
           dos puntas del viaje: antes de que la primera card llegue al paso
           frontal (raw < 0) y después de que pasó la última (raw > N-1). */
        if (fi !== frontIdx) {
          frontIdx = fi;
          var activeProject = fi < 0 ? null : GW_PORTFOLIO[fi];
          portalUI.setProject(activeProject, fi);
          phone.link(activeProject);
          var src = fi < 0 ? '' : previewSrc(activeProject, 'celu');
          phone.caras[0](src);
          phone.caras[1](src);
          /* precarga la anterior y las 2 que vienen: también queda fluido al
             recorrer el espiral hacia atrás */
          for (var k = -1; k <= 2; k++) {
            if (k === 0) continue;
            var nx = GW_PORTFOLIO[fi + k];
            if (nx) phone.warm(previewSrc(nx, 'celu'));
          }
        }
      }
      var trailPoints = [];
      var portalPulse = 0;
      for (var i = 0; i < N; i++) {
        /* la card 0 arranca asomando al pie de la pantalla y las demás hacen
           fila abajo: cada una entra UNA sola vez, hace su viaje y muere arriba */
        var s = rot - i * stepU;
        /* Varias tarjetas por delante quedan decodificadas antes de entrar;
           evita microcortes al hacer un gesto rapido en el celular. */
        var loadMargin = stepU * (mobile ? 5 : 4);
        if (s >= -loadMargin && s <= sExit + 0.8) ensureCardImage(i);
        else if (s < -loadMargin * 1.7 || s > sExit + 1.35) releaseCardImage(i);
        if (s < 0 || s > sExit + 0.5) {
          if (shown[i] !== false) { cards[i].style.visibility = 'hidden'; cards[i].classList.remove('is-visible'); shown[i] = false; }
          continue;
        }
        var p = pos(s);
        var halfH = cardW * 0.625 * p.pf * 0.72;
        if (p.y < -halfH || p.y > H + halfH) {
          if (shown[i] !== false) { cards[i].style.visibility = 'hidden'; cards[i].classList.remove('is-visible'); shown[i] = false; }
          continue;
        }
        if (shown[i] !== true) { cards[i].style.visibility = 'visible'; cards[i].classList.add('is-visible'); shown[i] = true; }
        var rotZ = 0;
        /* En mobile quedan rectas: mejora lectura y evita dos proyecciones
           trigonometricas adicionales por tarjeta y por frame. */
        if (!mobile) {
          var a = pos(s - 0.02), b = pos(s + 0.02);
          var dx = b.x - a.x, dy = b.y - a.y;
          rotZ = Math.abs(dx) > 0.5 ? Math.atan(dy / dx) * 57.2958 : 0;
          if (rotZ > 16) rotZ = 16; else if (rotZ < -16) rotZ = -16;
        }
        /* yaw CONTINUO: la card gira de verdad los ~180° al pasar de atrás a
           adelante (se ve de canto y de espaldas); de frente justo en el paso
           frontal (u=2π). cos(yaw) = Zn, así que el dorso coincide con "lejos". */
        var rotY = (p.u - TAU) * 57.2958;
        /* el banking se desvanece cerca del canto: sin saltos de ±16° en el giro */
        rotZ *= Math.abs(p.Zn);
        /* en mobile, la card que se está leyendo (frente, Zn→1) queda casi
           recta: se aplana el banking cerca del centro sin tocarlo lejos */
        /* Portal: al cruzar el eje frontal, la card se comprime hacia el
           celular, desaparece detrás del marco y reaparece al otro lado. */
        var portalRange = mobile ? 0.52 : 0.62;
        /* Justo antes de entrar al celular la tarjeta crece suavemente un
           20%. El pico ocurre donde empieza la absorcion del portal. */
        var preEntryCenter = S_FRONT - portalRange;
        var preEntryWidth = mobile ? 0.30 : 0.36;
        var preEntryT = Math.max(0, 1 - Math.abs(s - preEntryCenter) / preEntryWidth);
        preEntryT = preEntryT * preEntryT * (3 - 2 * preEntryT);
        var preEntryScale = 1 + preEntryT * 0.20;
        var portalT = Math.max(0, 1 - Math.abs(s - S_FRONT) / portalRange);
        portalT = portalT * portalT * (3 - 2 * portalT);
        if (portalT > portalPulse) portalPulse = portalT;
        var drawX = p.x + (W / 2 - p.x) * portalT * 0.94;
        var drawY = p.y + (H / 2 - p.y) * portalT * 0.94;
        var portalScale = 1 - portalT * 0.84;
        cards[i].style.setProperty('--portal-opacity', (1 - portalT * 0.94).toFixed(3));
        if (mobile || mobilePerformanceMode) {
          if (cards[i].style.filter !== 'none') cards[i].style.filter = 'none';
        } else {
          cards[i].style.filter = portalT > 0.015 ?
            'blur(' + (portalT * 5.5).toFixed(2) + 'px) saturate(' + (1 + portalT * 0.65).toFixed(2) + ')' : 'none';
        }
        cards[i].style.pointerEvents = portalT > 0.72 ? 'none' : 'auto';
        trailPoints.push({ x: drawX, y: drawY });
        /* corrimiento respecto del centro de pantalla, DENTRO de la cámara
           compartida: la fuga queda clavada al centro para todas las cards */
        var ox = drawX - W / 2, oy = drawY - H / 2;
        /* dorso oscurecido: cuanto más de espaldas (Zn<0), más se apaga */
        cards[i].style.setProperty('--backdim', (Math.max(0, -p.Zn) * 0.55).toFixed(2));
        cards[i].style.zIndex = portalT > 0.42 ? 56 : 10 + Math.round((p.Zn + 1) * 50);
        cards[i].style.transform = 'translate(-50%, -50%) translate(' + (W / 2).toFixed(1) + 'px,' + (H / 2).toFixed(1) + 'px) perspective(' + PERSP + 'px) translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px) rotateY(' + rotY.toFixed(2) + 'deg) rotate(' + rotZ.toFixed(2) + 'deg) scale(' + (p.pf / FMAX * preEntryScale * portalScale).toFixed(4) + ')';
      }
      portalUI.draw(trailPoints, rot, portalPulse);
    }
    gsap.ticker.add(frame);
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
    playHero();

    /* Reveals + staggers de las secciones post-túnel */
    gsap.utils.toArray('[data-stagger]').forEach(function (group) {
      var items = group.querySelectorAll('[data-animate]');
      gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.13, scrollTrigger: { trigger: group, start: 'top 82%' } });
    });
    gsap.utils.toArray('[data-animate]').forEach(function (el) {
      if (el.closest('[data-stagger]')) return;
      gsap.to(el, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
    });

    /* Beats modo túnel: nada se mueve en Y — la ESCALA es la protagonista, el fade
       solo resuelve entrada/salida. power1.in = acelera al acercarse, como dolly real. */
    (function () {
      var heroEl = document.getElementById('hero');
      if (!heroEl) return;
      var beats = gsap.utils.toArray(heroEl.querySelectorAll('.hero-beat'));
      if (beats.length < 2) return;
      heroEl.classList.add('hero--tunnel');
      var main = beats[0];
      if (!mobilePerformanceMode) gsap.set(main, { filter: 'blur(0px)' });
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom bottom', scrub: mobilePerformanceMode ? true : 0.6 }
      });
      var mainOut = { autoAlpha: 0, duration: 0.4 };
      if (!mobilePerformanceMode) mainOut.filter = 'blur(10px)';
      tl.to(main.querySelector('.hero-title'), { scale: 1.5, duration: 0.9, ease: 'power1.in' }, 0.15)
        .to(main.querySelectorAll('.hero-eyebrow, .hero-sub, .hero-cta, .hero-cue'), { scale: 1.28, duration: 0.9, ease: 'power1.in' }, 0.15)
        .to(main, mainOut, 0.65);
      beats.slice(1).forEach(function (beat, i, arr) {
        var at = 0.85 + i * 1.9;
        /* los títulos se alternan entre esquinas: arriba-derecha ↔ abajo-izquierda.
           El cierre (beat-final) queda centrado: ahí van los botones */
        if (!beat.classList.contains('beat-final')) beat.classList.add(i % 2 === 0 ? 'beat-tr' : 'beat-bl');
        var leads = beat.querySelectorAll('.beat-lead, .beat-note, .beat-link, .beat-actions');
        var beatFrom = { autoAlpha: 0 };
        var beatTo = { autoAlpha: 1, duration: 0.3 };
        if (!mobilePerformanceMode) { beatFrom.filter = 'blur(8px)'; beatTo.filter = 'blur(0px)'; }
        tl.fromTo(beat, beatFrom, beatTo, at)
          .fromTo(beat.querySelector('.beat-big'), { scale: 0.42 }, { scale: 1, duration: 0.9, ease: 'power1.in' }, at);
        if (leads.length) tl.fromTo(leads, { scale: 0.58 }, { scale: 1, duration: 0.9, ease: 'power1.in' }, at);
        if (i < arr.length - 1) {
          tl.to(beat.querySelector('.beat-big'), { scale: 1.6, duration: 0.8, ease: 'power1.in' }, at + 1.1);
          if (leads.length) tl.to(leads, { scale: 1.3, duration: 0.8, ease: 'power1.in' }, at + 1.1);
          var beatOut = { autoAlpha: 0, duration: 0.35 };
          if (!mobilePerformanceMode) beatOut.filter = 'blur(10px)';
          tl.to(beat, beatOut, at + 1.55);
        }
      });

      buildRibbon(heroEl);
    })();
  } else {
    document.querySelectorAll('[data-animate]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- Portfolio: render desde GW_PORTFOLIO + filtros (compatibles con routing.js) ---------- */
  var CAT_LABELS = {
    ecommerce: 'Ecommerce',
    comercios: 'Comercios & Tiendas',
    profesionales: 'Servicios Profesionales',
    moda: 'Moda & Indumentaria',
    gastronomia: 'Gastronomía & Eventos',
    tecnologia: 'Tecnología & Electrónica',
    inmobiliaria: 'Inmobiliaria'
  };

  (function () {
    var grid = document.getElementById('pfGrid');
    if (!grid || typeof GW_PORTFOLIO === 'undefined') return;
    grid.innerHTML = GW_PORTFOLIO.map(function (p) {
      return '<a href="' + p.url + '" target="_blank" rel="noopener" class="pf-card" data-cat="' + p.cat + '">' +
        '<div class="pf-visuals">' +
        '<div class="pf-web"><img src="' + previewSrc(p, compactPreviews ? 'web_mobile' : 'web') + '" alt="' + p.name + '" width="800" height="500" loading="lazy" decoding="async"></div>' +
        '</div>' +
        '<div class="pf-info"><div><h4>' + p.name + '</h4><span class="pf-meta">' + (CAT_LABELS[p.cat] || '') + '</span></div>' +
        '<span class="pf-cta">Ver sitio →</span></div></a>';
    }).join('');

    document.querySelectorAll('.pf-cat').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pf-cat').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-cat');
        grid.querySelectorAll('.pf-card').forEach(function (card) {
          var show = cat === 'all' || card.getAttribute('data-cat') === cat;
          card.classList.toggle('pf-hidden', !show);
        });
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    });
  })();

  /* ---------- Menú mobile ---------- */
  (function () {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    function setOpen(open) {
      toggle.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (window.lenis) { open ? window.lenis.stop() : window.lenis.start(); }
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () { setOpen(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); toggle.focus(); } });
  })();

  /* ---------- Scroll progress + WhatsApp float ---------- */
  (function () {
    var bar = document.getElementById('scroll-progress');
    var wsp = document.getElementById('wsp-float');
    function onScroll() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (bar) bar.style.width = p + '%';
      if (wsp) { window.scrollY > 600 ? wsp.classList.add('visible') : wsp.classList.remove('visible'); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
