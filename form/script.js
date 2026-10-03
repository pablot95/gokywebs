const FORM_LEAD_URL = '/wabot/form-lead.php';

const TRACK_URL = '/form/track.php';

const _sid = (() => {
    try {
        let s = sessionStorage.getItem('gky_sid');
        if (!s) {
            s = (crypto.randomUUID ? crypto.randomUUID()
                                   : Date.now() + '-' + Math.random().toString(16).slice(2));
            sessionStorage.setItem('gky_sid', s);
        }
        return s;
    } catch (_) {
        return Date.now() + '-' + Math.random().toString(16).slice(2);
    }
})();

function _detectarOrigen() {
    try {
        const params = new URLSearchParams(window.location.search);
        const p = (params.get('origen') || params.get('utm_source') || '').toLowerCase();
        if (/whatsapp|^wsp$|^wa$/.test(p)) return 'whatsapp';
        if (/instagram|^ig$/.test(p)) return 'instagram';

        // El link del bot trae solo ?c= (y &ig=1 desde Instagram): sin esto
        // esas entradas se contaban como "nativo" y el embudo por canal mentía.
        if (params.get('ig') === '1') return 'instagram';
        if ((params.get('c') || '').trim() !== '') return 'whatsapp';

        const ref = (document.referrer || '').toLowerCase();
        if (ref.includes('instagram.com')) return 'instagram';
        if (ref.includes('wa.me') || ref.includes('whatsapp.com')) return 'whatsapp';

        return 'nativo';
    } catch (_) {
        return 'nativo';
    }
}

const _origen = (() => {
    try {
        const saved = sessionStorage.getItem('gky_origen');
        if (saved) return saved;
        const detectado = _detectarOrigen();
        sessionStorage.setItem('gky_origen', detectado);
        return detectado;
    } catch (_) {
        return _detectarOrigen();
    }
})();

// Se captura antes de limpiar la URL con replaceState, si no se pierden ?t=/?neg=.
const _paramsInicial = new URLSearchParams(window.location.search);
/* ─── Paso 3: modelos ───
 * Los mismos modelos de /modelos/, dibujados acá (modelos.js, nuevos.js y
 * wire.js se cargan como scripts clásicos antes que este módulo).
 *
 * Visor (2-oct, el mismo formato que el portfolio): el modelo que se está
 * mirando va grande y se recorre con scroll; abajo, la tira de miniaturas
 * (se arrastra como un carrusel) cambia el modelo a la vista, y el botón
 * "Seleccionar este modelo" lo marca. Se eligen 2.
 *
 * /formb comparte este archivo con el HTML viejo del paso 3 y ya no se usa:
 * si falta #mfVisor, el paso de modelos no se arma pero el resto anda. */
const MODELOS = (typeof GW_MODELOS !== 'undefined') ? GW_MODELOS : [];
const MODELO_TIPOS = (typeof GW_MODELO_TIPOS !== 'undefined') ? GW_MODELO_TIPOS : [];
const MODELO_RUBROS = (typeof GW_MODELO_RUBROS !== 'undefined') ? GW_MODELO_RUBROS : [];
const MODELOS_A_ELEGIR = 2;
const modeloPorId = id => MODELOS.find(m => m.id === id);
const nombreModelo = m => `Modelo ${m.letra} · ${m.nombre}`;

let modelosSeleccionados = [];
const modelosParametro = (_paramsInicial.get('modelos') || '').split(',').filter(Boolean);
try { modelosSeleccionados = modelosParametro.length ? modelosParametro : JSON.parse(sessionStorage.getItem('gw-modelos') || '[]'); } catch (_) {}
modelosSeleccionados = [...new Set(modelosSeleccionados)].filter(modeloPorId).slice(0, MODELOS_A_ELEGIR);

const mfVisor = document.getElementById('mfVisor');
const mfRail = document.getElementById('modelosGroup');
const mfTipos = document.getElementById('mfTipos');
const mfRubro = document.getElementById('mfRubro');
const mfAviso = document.getElementById('modelosAviso');
const mfContador = document.getElementById('mfContador');
const mfPantalla = document.getElementById('mfPantalla');
const mfActual = document.getElementById('mfActual');
const mfMarcar = document.getElementById('mfMarcar');
const btnEnviar = document.getElementById('btnEnviar');
const mfFiltro = { tipo: 'all', rubro: 'all' };
const FLECHA = '<svg class="mf-flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const mfQuieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// En el celular se ve siempre la versión celular del modelo (el botón
// Computadora/Celular se oculta); si se agranda la ventana, vuelve a elegirse.
const mfCelular = window.matchMedia('(max-width: 640px)');
const mfVer = { id: '', vista: window.matchMedia('(max-width: 700px)').matches ? 'celular' : 'pc' };
mfCelular.addEventListener?.('change', () => {
    if (mfCelular.matches && mfVer.vista !== 'celular') { mfVer.vista = 'celular'; pintarEscena(); }
});

/* El botón de la barra dice cuántos faltan ("Elegí 1 más") y pasa a Enviar
 * con los 2 elegidos (24-sep, como el diseño que mandó Pablo). */
function pintarBotonEnviar() {
    const faltan = MODELOS_A_ELEGIR - modelosSeleccionados.length;
    const texto = faltan <= 0 ? 'Enviar'
        : faltan === MODELOS_A_ELEGIR ? `Elegí ${MODELOS_A_ELEGIR} modelos` : `Elegí ${faltan} más`;
    btnEnviar.innerHTML = `<span>${texto}</span>${FLECHA}`;
    btnEnviar.classList.toggle('listo', faltan <= 0);
}

/* El contador lleva la cuenta; mfAviso queda solo para avisos. Las
 * miniaturas elegidas llevan una tilde con su número (1 y 2). */
function pintarElegidos(mensaje) {
    if (!mfVisor) return;
    const n = modelosSeleccionados.length;
    mfAviso.classList.remove('error');
    mfAviso.textContent = mensaje || '';
    // Solo si cambió: reescribir el mismo texto lo vuelve a leer el lector de pantalla.
    // En el celular se ve solo "0 de 2": la palabra se oculta por CSS.
    const cuenta = `${n} de ${MODELOS_A_ELEGIR} seleccionados`;
    if (mfContador.textContent !== cuenta) mfContador.innerHTML = `${n} de ${MODELOS_A_ELEGIR}<span class="mf-cont-txt"> seleccionados</span>`;
    mfContador.classList.toggle('completo', n === MODELOS_A_ELEGIR);
    // Mientras se envía, el botón dice "Enviando…".
    if (!btnEnviar.disabled) pintarBotonEnviar();
    mfRail.querySelectorAll('.mf-mini').forEach(b => {
        const i = modelosSeleccionados.indexOf(b.dataset.id);
        b.classList.toggle('elegido', i !== -1);
        b.querySelector('.mf-num').textContent = i === -1 ? '' : String(i + 1);
    });
    pintarMarcar();
}

function pintarMarcar() {
    const m = modeloPorId(mfVer.id);
    if (!m) return;
    const on = modelosSeleccionados.includes(m.id);
    mfMarcar.classList.toggle('elegido', on);
    mfMarcar.setAttribute('aria-pressed', on ? 'true' : 'false');
    mfMarcar.querySelector('.mf-marcar-txt').textContent = on ? 'Seleccionado' : 'Seleccionar este modelo';
    mfMarcar.setAttribute('aria-label', on ? `${nombreModelo(m)}: seleccionado. Tocá para sacarlo.` : `Seleccionar el ${nombreModelo(m)}`);
}

/* Devuelve false si no se pudo marcar (ya había 2). */
function alternarModelo(id) {
    if (modelosSeleccionados.includes(id)) {
        modelosSeleccionados = modelosSeleccionados.filter(x => x !== id);
    } else if (modelosSeleccionados.length >= MODELOS_A_ELEGIR) {
        pintarElegidos(`Ya elegiste ${MODELOS_A_ELEGIR}. Abrí uno de los que tienen tilde y sacalo para cambiarlo.`);
        mfAviso.classList.add('error');
        return false;
    } else {
        modelosSeleccionados = [...modelosSeleccionados, id];
    }
    try { sessionStorage.setItem('gw-modelos', JSON.stringify(modelosSeleccionados)); } catch (_) {}
    pintarElegidos();
    return true;
}

/* ── El modelo grande ── */
function pintarEscena() {
    const m = modeloPorId(mfVer.id);
    if (!m) return;
    const wire = GW_WIRE.render(m);
    // Cada vez una caja nueva: encajar() deja un ResizeObserver sobre la que recibe.
    if (mfVer.vista === 'pc') {
        mfPantalla.innerHTML = `<div class="mf-caja"><div class="md-alto"><div class="md-lienzo">${wire}</div></div></div>`;
        GW_WIRE.encajar(mfPantalla.querySelector('.mf-caja'), mfPantalla.querySelector('.md-lienzo'), 1440);
    } else {
        mfPantalla.innerHTML = `<div class="mf-cel">${wire}</div>`;
    }
    mfPantalla.classList.toggle('es-cel', mfVer.vista === 'celular');
    mfPantalla.scrollTop = 0;
    mfActual.innerHTML = `<b>Modelo ${m.letra}</b> <span></span>`;
    mfActual.querySelector('span').textContent = m.nombre;
    mfPantalla.setAttribute('aria-label', `${nombreModelo(m)}. Se recorre con scroll.`);
    document.querySelectorAll('#mfSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.vista === mfVer.vista ? 'true' : 'false'));
    pintarMarcar();
}

function mostrarModelo(id, { suave = true } = {}) {
    if (!modeloPorId(id)) return;
    const cambia = mfVer.id !== id;
    mfVer.id = id;
    mfRail.querySelectorAll('.mf-mini').forEach(b => {
        const on = b.dataset.id === id;
        b.classList.toggle('activo', on);
        if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    centrarMini(suave);
    if (cambia || !mfPantalla.firstChild) pintarEscena();
}

/* ── Miniaturas ── */
// Se dibujan cuando entran en la tira (son 45 y cada una es un modelo entero).
const mfObservador = window.IntersectionObserver && mfRail ? new IntersectionObserver(entradas => {
    entradas.forEach(e => {
        if (!e.isIntersecting) return;
        mfObservador.unobserve(e.target);
        dibujarMini(e.target);
    });
}, { root: mfRail, rootMargin: '0px 600px' }) : null;

function dibujarMini(b) {
    if (b.dataset.dibujada) return;
    b.dataset.dibujada = '1';
    const caja = b.querySelector('.mf-mini-vista');
    caja.innerHTML = `<div class="md-alto"><div class="md-lienzo">${GW_WIRE.render(modeloPorId(b.dataset.id))}</div></div>`;
    GW_WIRE.encajar(caja, caja.querySelector('.md-lienzo'), 1440);
}

function minisVisibles() {
    return [...mfRail.querySelectorAll('.mf-mini:not([hidden])')];
}

/* scrollIntoView movería también la página: se centra moviendo solo la tira. */
function centrarMini(suave) {
    frenarInercia();
    const el = mfRail.querySelector('.mf-mini.activo');
    if (!el || el.hidden) return;
    const x = el.offsetLeft - (mfRail.clientWidth - el.offsetWidth) / 2;
    mfRail.scrollTo({ left: Math.max(0, x), behavior: suave && !mfQuieto ? 'smooth' : 'auto' });
}

function moverModelo(paso) {
    const vis = minisVisibles();
    if (!vis.length) return;
    const i = vis.findIndex(b => b.dataset.id === mfVer.id);
    mostrarModelo(vis[(i + paso + vis.length) % vis.length].dataset.id);
}

/* La tira se arrastra con el mouse como un carrusel (en el celular ya se
 * desliza con el dedo). Si hubo arrastre, el clic que viene después no
 * cambia de modelo; al soltar sigue un poco por inercia. */
let mfArrastre = null, mfArrastro = false, mfInercia = 0;
function frenarInercia() { if (mfInercia) cancelAnimationFrame(mfInercia); mfInercia = 0; }
function activarArrastre() {
    mfRail.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        frenarInercia();
        mfArrastre = { x: e.clientX, left: mfRail.scrollLeft, ultX: e.clientX, ultT: performance.now(), v: 0 };
        mfArrastro = false;
    });
    window.addEventListener('pointermove', e => {
        if (!mfArrastre) return;
        const dx = e.clientX - mfArrastre.x;
        if (!mfArrastro && Math.abs(dx) > 5) { mfArrastro = true; mfRail.classList.add('arrastrando'); }
        if (!mfArrastro) return;
        mfRail.scrollLeft = mfArrastre.left - dx;
        const ahora = performance.now();
        mfArrastre.v = (e.clientX - mfArrastre.ultX) / Math.max(1, ahora - mfArrastre.ultT);
        mfArrastre.ultX = e.clientX;
        mfArrastre.ultT = ahora;
    });
    window.addEventListener('pointerup', () => {
        if (!mfArrastre) return;
        let v = -mfArrastre.v * 16;
        mfArrastre = null;
        mfRail.classList.remove('arrastrando');
        if (!mfArrastro || mfQuieto || Math.abs(v) < 1) return;
        mfInercia = requestAnimationFrame(function paso() {
            mfRail.scrollLeft += v;
            v *= 0.94;
            mfInercia = Math.abs(v) > 0.5 ? requestAnimationFrame(paso) : 0;
        });
    });
    mfRail.addEventListener('click', e => {
        if (!mfArrastro) return;
        mfArrastro = false;
        e.preventDefault();
        e.stopPropagation();
    }, true);
    mfRail.addEventListener('wheel', frenarInercia, { passive: true });
}

function armarModelos() {
    if (!mfVisor) return;
    if (!MODELOS.length || typeof GW_WIRE === 'undefined') {
        mfPantalla.innerHTML = '<p class="mf-vacio">No pudimos cargar los modelos. Recargá la página y volvé a intentar.</p>';
        return;
    }
    [{ id: 'all', label: 'Todos' }, ...MODELO_TIPOS].forEach(t => {
        if (t.id !== 'all' && !MODELOS.some(m => m.tipo === t.id)) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mf-chip';
        b.dataset.valor = t.id;
        b.textContent = t.label;
        mfTipos.append(b);
    });
    MODELO_RUBROS.forEach(r => mfRubro.append(new Option(r.label, r.id)));

    const frag = document.createDocumentFragment();
    MODELOS.forEach(m => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mf-mini';
        b.setAttribute('role', 'listitem');
        b.dataset.id = m.id;
        b.dataset.tipo = m.tipo;
        b.dataset.rubros = (m.rubros || []).join(' ');
        b.title = nombreModelo(m);
        b.setAttribute('aria-label', `Ver el ${nombreModelo(m)}`);
        b.innerHTML = '<span class="mf-mini-vista" aria-hidden="true"></span><span class="mf-letra" aria-hidden="true"></span><span class="mf-num" aria-hidden="true"></span>';
        b.querySelector('.mf-letra').textContent = m.letra;
        frag.append(b);
        if (mfObservador) mfObservador.observe(b);
    });
    mfRail.append(frag);
    if (!mfObservador) mfRail.querySelectorAll('.mf-mini').forEach(dibujarMini);

    mfRail.addEventListener('click', e => {
        const b = e.target.closest('.mf-mini');
        if (b) mostrarModelo(b.dataset.id);
    });
    mfVisor.querySelector('.mf-prev').addEventListener('click', () => moverModelo(-1));
    mfVisor.querySelector('.mf-next').addEventListener('click', () => moverModelo(1));
    mfMarcar.addEventListener('click', () => alternarModelo(mfVer.id));
    document.getElementById('mfSeg').addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b || b.dataset.vista === mfVer.vista) return;
        mfVer.vista = b.dataset.vista;
        pintarEscena();
    });
    mfTipos.addEventListener('click', e => {
        const chip = e.target.closest('.mf-chip');
        if (!chip) return;
        mfFiltro.tipo = chip.dataset.valor;
        filtrarModelos();
    });
    // Un rubro tiene modelos de varios tipos: elegirlo vuelve el tipo a "Todos".
    mfRubro.addEventListener('change', () => {
        mfFiltro.rubro = mfRubro.value;
        mfFiltro.tipo = 'all';
        filtrarModelos();
    });
    // Flechas ← → cambian de modelo (no mientras se elige rubro).
    mfVisor.addEventListener('keydown', e => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
        e.preventDefault();
        moverModelo(e.key === 'ArrowLeft' ? -1 : 1);
    });
    activarArrastre();

    filtrarModelos();
    pintarElegidos();
}

function filtrarModelos() {
    let primero = null;
    mfRail.querySelectorAll('.mf-mini').forEach(b => {
        b.hidden = (mfFiltro.tipo !== 'all' && b.dataset.tipo !== mfFiltro.tipo) ||
            (mfFiltro.rubro !== 'all' && !b.dataset.rubros.split(' ').includes(mfFiltro.rubro));
        if (!b.hidden && !primero) primero = b;
    });
    mfTipos.querySelectorAll('.mf-chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.valor === mfFiltro.tipo ? 'true' : 'false'));
    mfRubro.value = mfFiltro.rubro;
    mfRubro.parentNode.classList.toggle('activo', mfFiltro.rubro !== 'all');
    mfVisor.classList.toggle('sin-modelos', !primero);
    document.getElementById('mfVacio').hidden = !!primero;
    mfRail.scrollLeft = 0;
    if (!primero) return;
    // Si el que se estaba mirando quedó afuera del filtro, se muestra el primero.
    const actual = mfRail.querySelector(`.mf-mini[data-id="${mfVer.id}"]`);
    mostrarModelo(actual && !actual.hidden ? mfVer.id : primero.dataset.id, { suave: false });
}

armarModelos();

try {
    if (window.location.search && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
    }
} catch (_) {}

const _tracked = {};
function track(event) {
    if (_tracked[event]) return;
    _tracked[event] = true;
    try {
        // El código del chat viaja con cada evento: es lo que permite unir el
        // recorrido del formulario con la conversación del bot.
        const c = (_paramsInicial.get('c') || '').trim().slice(0, 8);
        const body = JSON.stringify(c ? { sid: _sid, event, origen: _origen, c } : { sid: _sid, event, origen: _origen });
        if (navigator.sendBeacon) {
            navigator.sendBeacon(TRACK_URL, new Blob([body], { type: 'text/plain' }));
        } else {
            fetch(TRACK_URL, { method: 'POST', body, keepalive: true });
        }
    } catch (_) {}
}

track('enter');

(function _trackCampos() {
    const form = document.getElementById('propuestaForm');
    if (!form) return;

    const value = id => document.getElementById(id)?.value.trim() || '';

    function trackMilestones() {
        const phoneDigits = value('telefono').replace(/\D/g, '');
        const milestones = [
            ['field_negocio', value('nombre_negocio') !== ''],
            ['field_rubro', value('resumen') !== ''],
            ['field_telefono', phoneDigits.length >= 10 && phoneDigits.length <= 15],
        ];
        for (const [event, complete] of milestones) {
            if (!complete) break;
            track(event);
        }
    }

    ['pointerdown', 'focusin'].forEach(event => {
        form.addEventListener(event, () => {
            track('form_start');
            queueMicrotask(trackMilestones);
        }, { once: true });
    });

    form.addEventListener('input', trackMilestones);
    form.addEventListener('change', trackMilestones);
})();

const telefonoInput   = document.getElementById('telefono');
const telefonoAviso   = document.getElementById('telefonoConfirmado');
const telefonoCorregir = document.getElementById('telefonoCorregir');

function ocultarTelefono() {
    telefonoInput.hidden = true;
    telefonoAviso.hidden = false;
}
function mostrarTelefono() {
    telefonoInput.hidden = false;
    telefonoAviso.hidden = true;
    telefonoInput.focus();
}
telefonoCorregir?.addEventListener('click', mostrarTelefono);

telefonoInput.addEventListener('input', () => {
    telefonoInput.value = telefonoInput.value.replace(/[^\d+\s()-]/g, '').slice(0, 18);
});

// El bot manda un código corto (?c=) en vez del teléfono: el link queda corto
// y el número no viaja a la vista. El backend lo resuelve contra su índice.
const _codigoBot = (_paramsInicial.get('c') || '').trim().slice(0, 8);
// Vino por Instagram: de ahí no sale ningún teléfono, así que el número hay
// que pedirlo acá. En WhatsApp ya lo tenemos y el campo se oculta.
const _desdeInstagram = (_paramsInicial.get('ig') || '') === '1';

(function _prellenarDesdeBot() {
    const mapa = { t: 'telefono', neg: 'nombre_negocio' };
    let precargados = 0;

    Object.keys(mapa).forEach((p) => {
        const v = (_paramsInicial.get(p) || '').trim().slice(0, 200);
        if (!v) return;
        const el = document.getElementById(mapa[p]);
        if (!el || el.value.trim() !== '') return;
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        precargados++;
    });

    const tel = (_paramsInicial.get('t') || '').trim();
    if (_desdeInstagram) {
        // El campo queda a la vista y con su propia explicación: por Instagram
        // no tenemos cómo mandarle la demo.
        const pista = document.createElement('p');
        pista.className = 'form-tip';
        pista.textContent = 'Dejanos tu WhatsApp: es por donde coordinamos los próximos pasos.';
        telefonoInput.insertAdjacentElement('afterend', pista);
    } else if (tel) {
        const digits = tel.replace(/\D/g, '');
        const num = document.createElement('strong');
        num.textContent = digits;
        telefonoAviso.textContent = 'Te vamos a escribir a este número: ';
        telefonoAviso.appendChild(num);
        telefonoAviso.append('. ¿No es el tuyo? ');
        telefonoAviso.appendChild(telefonoCorregir);
        ocultarTelefono();
    } else if (_codigoBot) {
        // El link con código no lleva el número (el servidor lo resuelve al
        // enviar), así que no se puede mostrar: se dice a cuál WhatsApp se
        // escribe y se ofrece cambiarlo.
        telefonoAviso.textContent = 'Te escribimos al mismo WhatsApp desde el que nos contactaste. ¿Preferís otro número? ';
        telefonoCorregir.textContent = 'Cambiar';
        telefonoAviso.appendChild(telefonoCorregir);
        ocultarTelefono();
    }

    if (!precargados) return;
    track('prefill');

    const aviso = document.createElement('p');
    aviso.className = 'form-tip';
    aviso.style.cssText = 'background:rgba(37,180,90,.10);border:1px solid rgba(37,180,90,.35)';
    aviso.textContent = _desdeInstagram
        ? '✓ Ya cargamos algunos datos con lo que nos contaste por Instagram — revisá que estén bien.'
        : '✓ Ya cargamos algunos datos con lo que nos contaste por WhatsApp — revisá que estén bien.';
    document.querySelector('.form-section')?.insertAdjacentElement('beforebegin', aviso);
})();

// Evita que Enter recargue la página vía submit nativo.
document.getElementById('propuestaForm').addEventListener('submit', (e) => e.preventDefault());

/* ─── Pasos ───
 * Tres pantallas dentro del mismo <form> (10-sep; el 3 con los modelos desde
 * el 16-sep): cada paso se valida antes de dejar avanzar y el envío sale del
 * paso 3. Todos están siempre en el DOM, así el borrador y los reintentos ven
 * todos los campos aunque el paso no esté a la vista. */
const PASOS = [...document.querySelectorAll('.form-step')];

function pasoDe(el) {
    return Number(el?.closest('.form-step')?.dataset.step || 1);
}

const PASO3 = document.querySelector('.form-step[data-step="3"]');
let introModelosVista = false;

function irAPaso(n,{ enfocar = true, scroll = true } = {}) {
    PASOS.forEach(p => { p.hidden = Number(p.dataset.step) !== n; });
    document.querySelectorAll('.step-dot').forEach(dot => {
        const s = Number(dot.dataset.s);
        dot.classList.toggle('active', s === n);
        dot.classList.toggle('done', s < n);
    });
    document.querySelectorAll('.step-connector').forEach((c, i) => c.classList.toggle('done', i + 1 < n));

    const paso = PASOS.find(p => Number(p.dataset.step) === n);
    // Antes de los modelos, una pantalla que explica qué viene (16-sep). Solo
    // la primera vez: el que vuelve al paso 2 y avanza no la ve de nuevo.
    const conIntro = n === 3 && !introModelosVista;
    PASO3.classList.toggle('con-intro', conIntro);
    // Un textarea oculto mide 0 de alto: se ajusta recién ahora que se ve.
    paso?.querySelectorAll('textarea.autosize').forEach(autoGrow);
    if (scroll) document.getElementById('formCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    // En el paso 3 hay dos títulos: el de la intro y el de los modelos (hijo directo).
    // Los modelos se eligen en un visor a pantalla completa (2-oct). Va antes
    // del foco: con el visor oculto, el título no puede recibirlo.
    document.body.classList.toggle('paso-modelos', n === 3 && !conIntro);
    if (enfocar) paso?.querySelector(n === 3 && !conIntro ? '.mf-visor .step-header-title' : '.step-header-title')?.focus({ preventScroll: true });
    // Mientras estuvo oculto, el visor no pudo medir el modelo ni centrar la tira.
    if (n === 3 && !conIntro && mfVisor) { pintarEscena(); centrarMini(false); }
    if (n === 2) track('step2');
}

document.getElementById('btnSiguiente').addEventListener('click', () => {
    clearErrors();
    const error = validarPaso1();
    if (error) {
        error.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    irAPaso(2);
});

document.getElementById('btnSiguiente2').addEventListener('click', () => {
    clearErrors();
    const error = validarPaso2();
    if (error) {
        error.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    irAPaso(3);
});

document.getElementById('btnVolver').addEventListener('click', () => {
    clearErrors();
    irAPaso(1);
});

document.getElementById('btnVolver3').addEventListener('click', () => {
    clearErrors();
    irAPaso(2);
});

document.getElementById('btnVolverIntro').addEventListener('click', () => irAPaso(2));

document.getElementById('btnVerModelos').addEventListener('click', () => {
    introModelosVista = true;
    irAPaso(3);
});

btnEnviar.addEventListener('click', () => {
    if (btnEnviar.disabled) return;
    clearErrors();
    // El paso 1 ya se validó para llegar acá; se repasa igual por si algo
    // cambió por atrás (un borrador, "Corregir" el teléfono).
    const error1 = validarPaso1();
    if (error1) {
        irAPaso(1, { enfocar: false, scroll: false });
        error1.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    const error2 = validarPaso2();
    if (error2) {
        irAPaso(2, { enfocar: false, scroll: false });
        error2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!validarPaso3()) return;
    enviarFormulario();
});

/* Cada validación marca sus errores y devuelve el primer campo con error (o
 * null): quien la llama decide si hay que cambiar de paso antes de mostrarlo. */
function validarPaso1() {
    let firstError = null;

    [
        { id: 'nombre_negocio', msg: 'Contanos el nombre de tu negocio o marca.' },
        { id: 'resumen', msg: 'Contanos brevemente qué ofrecés.' },
    ].forEach(({ id, msg }) => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            markError(el, msg);
            if (!firstError) firstError = el;
        } else if (LIMITES[id] && el.value.trim().length > LIMITES[id]) {
            // Mismo tope que el servidor: antes el servidor rechazaba y acá
            // salía un "ocurrió un error" sin decir por qué.
            markError(el, `Demasiado largo: máximo ${LIMITES[id]} caracteres.`);
            if (!firstError) firstError = el;
        }
    });

    const instagram = document.getElementById('instagram');
    if (instagram && instagram.value.trim().length > LIMITES.instagram) {
        markError(instagram, `Demasiado largo: máximo ${LIMITES.instagram} caracteres.`);
        if (!firstError) firstError = instagram;
    }

    if (!telefonoInput.hidden) {
        const telefonoDigits = telefonoInput.value.replace(/\D/g, '');
        if (!telefonoInput.value.trim()) {
            markError(telefonoInput, 'Por favor ingresá un número de teléfono o WhatsApp.');
            if (!firstError) firstError = telefonoInput;
        } else if (telefonoDigits.length < 10 || telefonoDigits.length > 15) {
            markError(telefonoInput, 'Ingresá un teléfono válido: entre 10 y 15 números.');
            if (!firstError) firstError = telefonoInput;
        }
    }

    return firstError;
}

function validarPaso2() {
    let firstError = null;

    const modalidad = document.getElementById('modalidad');
    if (!modalidad.value) {
        markError(modalidad, 'Elegí el plan mensual, el plan anual o el pago único.');
        if (!firstError) firstError = modalidad;
    }

    ['referencia', 'incluir'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value.trim().length > LIMITES[id]) {
            markError(el, `Demasiado largo: máximo ${LIMITES[id]} caracteres.`);
            if (!firstError) firstError = el;
        }
    });

    return firstError;
}

function validarPaso3() {
    if (modelosSeleccionados.length === MODELOS_A_ELEGIR) return true;
    const faltan = MODELOS_A_ELEGIR - modelosSeleccionados.length;
    // El botón ya dice "Elegí 2 modelos": el aviso explica cómo se eligen.
    pintarElegidos(faltan === MODELOS_A_ELEGIR
        ? `Tocá Seleccionar en los ${MODELOS_A_ELEGIR} modelos que más te gusten.`
        : `Te falta elegir ${faltan} modelo más para poder enviar.`);
    mfAviso.classList.add('error');
    return false;
}

function markError(input, msg) {
    input.classList.add('error');
    const span = document.createElement('span');
    span.className   = 'error-msg visible';
    span.textContent = msg;
    input.parentNode.appendChild(span);
}

function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(e => e.remove());
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
}

function buildPayload() {
    const get = id => (document.getElementById(id)?.value ?? '').trim();

    // Los color pickers (type="color") siempre traen un valor: el que sigue en
    // el que viene puesto no es un color de marca y no viaja (2-oct). Los que
    // cambiaron van en un solo texto, el campo "colores" que ya espera el bot;
    // sin ninguno va vacío y el servidor anota "A elección del diseñador".
    const colores = [['color_principal', 'Color principal'], ['color_secundario', 'Color secundario']]
        .filter(([id]) => colorElegido(id))
        .map(([id, nombre]) => `${nombre}: ${get(id)}`)
        .join(' · ');

    const payload = {
        t: get('telefono'),
        nombre_negocio: get('nombre_negocio'),
        resumen: get('resumen'),
        // Opcional (28-sep): el servidor lo deja como usuario, sin @ ni link.
        instagram: get('instagram'),
        colores,
        // Paso 2 (10-sep). Van siempre, aunque estén vacíos: así el servidor
        // sabe que el formulario ya preguntó la referencia y no la pide por chat.
        referencia: get('referencia'),
        incluir: get('incluir'),
        modalidad: get('modalidad'),
        // Id y nombre: el servidor valida el id y guarda el nombre tal como
        // lo vio el cliente (nuevos.js arma las letras en el navegador).
        modelos: modelosSeleccionados.map(id => ({ id, nombre: modeloPorId(id).nombre })),
    };
    if (_codigoBot) payload.c = _codigoBot;
    return payload;
}

/* Aviso de error del envío, en la propia tarjeta y no en un alert: dice qué
 * pasó y qué hacer. Se reemplaza en cada intento. */
function mostrarErrorEnvio(msg) {
    // En el visor de modelos (pantalla completa) el aviso va arriba de la tira.
    if (mfVisor && document.body.classList.contains('paso-modelos')) {
        mfAviso.textContent = msg;
        mfAviso.classList.add('error');
        return;
    }
    let box = document.getElementById('formEnvioError');
    if (!box) {
        box = document.createElement('p');
        box.id = 'formEnvioError';
        box.className = 'form-tip';
        box.setAttribute('role', 'alert');
        box.style.cssText = 'background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.35)';
        // Arriba de la fila Volver / Enviar: adentro quedaría entre los dos botones.
        (btnEnviar.closest('.step-nav') || btnEnviar).insertAdjacentElement('beforebegin', box);
    }
    box.textContent = msg;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function limpiarErrorEnvio() {
    document.getElementById('formEnvioError')?.remove();
}

const LIMITES = { nombre_negocio: 80, instagram: 100, resumen: 600, colores: 200, referencia: 300, incluir: 600 };
const NOMBRES_CAMPO = { nombre_negocio: 'el nombre del negocio', instagram: 'el Instagram', resumen: 'el resumen', colores: 'los colores', telefono: 'el teléfono',
    referencia: 'la referencia web', incluir: 'lo que querés incluir' };

/* El servidor dice qué campo falló y por qué (motivo/campo/max): se marca ese
 * campo, no se tira un "ocurrió un error" genérico. Si el campo está en el otro
 * paso, primero se muestra ese paso. */
function mostrarErrorServidor(json) {
    const campo = json.campo || '';
    const el = document.getElementById(campo);
    const verPasoDe = input => irAPaso(pasoDe(input), { enfocar: false, scroll: false });
    if (json.motivo === 'largo' && el) {
        verPasoDe(el);
        markError(el, `Demasiado largo: máximo ${json.max || LIMITES[campo] || ''} caracteres.`);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
    }
    if (json.motivo === 'vacio' && el) {
        verPasoDe(el);
        markError(el, `Completá ${NOMBRES_CAMPO[campo] || 'este campo'}.`);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
    }
    if (json.motivo === 'modelos') {
        introModelosVista = true;
        irAPaso(3, { enfocar: false });
        pintarElegidos('Volvé a elegir tus 2 modelos: no pudimos leer los que marcaste.');
        mfAviso.classList.add('error');
        return true;
    }
    if (json.motivo === 'telefono') {
        verPasoDe(telefonoInput);
        if (telefonoInput.hidden) mostrarTelefono();
        markError(telefonoInput, 'Ingresá un WhatsApp válido: entre 10 y 15 números.');
        telefonoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
    }
    return false;
}

function restaurarBoton() {
    btnEnviar.disabled = false;
    btnEnviar.classList.remove('loading');
    pintarBotonEnviar();
}

async function enviarFormulario() {
    btnEnviar.disabled = true;
    btnEnviar.classList.add('loading');
    btnEnviar.textContent = 'Enviando…';
    limpiarErrorEnvio();

    const payload = buildPayload();

    try {
        let json = null;
        // "ocupado": la charla estaba tomada un instante (el bot escribiendo).
        // El servidor pide reintentar; se hace solo, sin molestar a la persona.
        // Seis intentos, con esperas crecientes: el bot puede retener la
        // charla 20 a 40 segundos (espera, Gemini y tipeo) y con tres intentos
        // de menos de un segundo el formulario se rendía antes (9-sep).
        for (let intento = 0; intento < 6; intento++) {
            const res = await fetch(FORM_LEAD_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            json = await res.json();
            if (json.ok || !json.reintentar) break;
            btnEnviar.textContent = 'Un segundo…';
            await new Promise(r => setTimeout(r, 1500 * (intento + 1)));
        }
        if (!json || !json.ok) {
            if (json && json.error === 'datos_invalidos' && mostrarErrorServidor(json)) {
                restaurarBoton();
                return;
            }
            if (json && json.error === 'demasiados_intentos') {
                mostrarErrorEnvio('Recibimos muchos envíos seguidos desde esta conexión. Esperá unos minutos y volvé a probar, o escribinos por WhatsApp.');
                restaurarBoton();
                return;
            }
            if (json && json.reintentar) {
                mostrarErrorEnvio('El sistema estaba ocupado un instante. Tus datos siguen acá: tocá Enviar de nuevo.');
                restaurarBoton();
                return;
            }
            throw new Error((json && json.error) || 'respuesta inválida');
        }

        track('success');
        clearDraft();
        showSuccess();
    } catch (err) {
        console.error('Error al enviar el formulario:', err);
        mostrarErrorEnvio('No pudimos enviar el formulario. Revisá tu conexión y probá de nuevo; si sigue fallando, escribinos por WhatsApp.');
        restaurarBoton();
    }
}

/* Al terminar no se abre WhatsApp (16-sep, pedido de Pablo): los datos ya
 * llegaron al prospecto y lo contactamos nosotros. */
function showSuccess() {
    const card = document.getElementById('formCard');
    document.body.classList.remove('paso-modelos');
    try { sessionStorage.removeItem('gw-modelos'); } catch (_) {}
    card.innerHTML = `
        <div class="success-screen">
            <div class="success-icon">✅</div>
            <h2 class="success-title">Listo, recibimos tus datos!</h2>
            <span class="success-badge">Recibimos tus preferencias</span>
            <p class="success-desc">
                Vamos a revisar tus datos y los modelos que elegiste. Te escribimos por WhatsApp para coordinar los próximos pasos.
            </p>
            <a href="https://www.gokywebs.com" class="success-link">Mientras tanto, explorá nuestros trabajos →</a>
        </div>
    `;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

document.querySelectorAll('textarea.autosize').forEach(ta => {
    autoGrow(ta);
    ta.addEventListener('input', () => autoGrow(ta));
});

// Contadores de los textos largos: el tope de 600 existía en el servidor y el
// campo no lo mostraba; el que se pasaba recién se enteraba con un error
// genérico. Cada uno devuelve su "pintar" para refrescarlo después del borrador.
function _contador(idCampo, idContador) {
    const ta = document.getElementById(idCampo);
    const contador = document.getElementById(idContador);
    if (!ta || !contador) return () => {};
    const max = LIMITES[idCampo];
    const pintar = () => {
        const n = ta.value.length;
        contador.textContent = `${n}/${max}`;
        contador.style.color = n >= max ? '#dc2626' : (n > max * 0.85 ? '#b45309' : '');
    };
    ta.addEventListener('input', pintar);
    pintar();
    return pintar;
}
const _pintarContadores = [_contador('resumen', 'resumenContador'), _contador('incluir', 'incluirContador')];

/* ¿Eligió este color o sigue el que viene puesto en el HTML? (2-oct). Compara
 * contra el value del HTML, así un borrador guardado con el color de fábrica
 * tampoco cuenta como elegido. */
function colorElegido(id) {
    const el = document.getElementById(id);
    return !!el && el.value.toLowerCase() !== el.defaultValue.toLowerCase();
}

// Instagram (28-sep): abajo del campo, el link que queda con lo que escriben.
// Si pegan el link entero o ponen un @, se muestra ya limpio (igual que el servidor).
const instagramInput = document.getElementById('instagram');
const instagramAyuda = document.getElementById('instagramLink');
function pintarInstagram() {
    if (!instagramInput || !instagramAyuda) return;
    let t = instagramInput.value.trim();
    const enLink = t.match(/instagram\.com\/([A-Za-z0-9._]{1,30})/i);
    if (enLink) t = enLink[1];
    t = t.replace(/^@+/, '').replace(/\s+/g, '');
    instagramAyuda.textContent = 'Queda así: instagram.com/' + (t || 'tunegocio');
}
instagramInput?.addEventListener('input', pintarInstagram);

// Lo mismo con la forma de pago: qué implica cada una de las tres opciones.
const planSelect = document.getElementById('modalidad');
const planAyuda = document.getElementById('modalidadDetalle');
const PLAN_AYUDA_INICIAL = planAyuda ? planAyuda.textContent : '';

function pintarPlan() {
    if (!planSelect || !planAyuda) return;
    const op = planSelect.selectedOptions[0];
    planAyuda.textContent = op && op.value ? (op.dataset.desc || '') : PLAN_AYUDA_INICIAL;
}
planSelect?.addEventListener('change', pintarPlan);
pintarPlan();

const DRAFT_KEY = 'gky_form_draft';
// Los del paso 2 también: el que recarga la página no pierde lo que eligió.
const DRAFT_FIELDS = ['nombre_negocio', 'instagram', 'resumen', 'telefono',
    'color_principal', 'color_secundario', 'referencia', 'incluir', 'modalidad'];

function saveDraft() {
    try {
        const d = { fields: {} };
        DRAFT_FIELDS.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value.trim()) d.fields[id] = el.value;
        });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch (_) {}
}

function restoreDraft() {
    let d;
    try { d = JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch (_) { return; }
    if (!d) return;

    Object.entries(d.fields || {}).forEach(([id, v]) => {
        const el = document.getElementById(id);
        if (!el || el.value.trim()) return;
        // Una opción que ya no está en la lista dejaría el desplegable en blanco.
        if (el.tagName === 'SELECT' && ![...el.options].some(o => o.value === v)) return;
        el.value = v;
        if (el.classList.contains('autosize')) autoGrow(el);
    });
}

function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
}

const _formEl = document.getElementById('propuestaForm');
_formEl.addEventListener('input', saveDraft);
_formEl.addEventListener('change', saveDraft);

restoreDraft();
// Lo restaurado no dispara 'input': se repintan a mano los contadores y el
// link de Instagram.
_pintarContadores.forEach(pintar => pintar());
pintarInstagram();
pintarPlan();
