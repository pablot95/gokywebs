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
 * wire.js se cargan como scripts clásicos antes que este módulo). El cliente
 * marca 2 tocando la tarjeta y los puede ver grandes en un modal, sin salir
 * del formulario. */
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

const mfGrid = document.getElementById('modelosGroup');
const mfTipos = document.getElementById('mfTipos');
const mfRubro = document.getElementById('mfRubro');
const mfAviso = document.getElementById('modelosAviso');
const mfContador = document.getElementById('mfContador');
const btnEnviar = document.getElementById('btnEnviar');
const mfFiltro = { tipo: 'all', rubro: 'all' };
const FLECHA = '<svg class="mf-flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

/* El botón de la barra dice cuántos faltan ("Elegí 1 más") y pasa a Enviar
 * con los 2 elegidos (24-sep, como el diseño que mandó Pablo). */
function pintarBotonEnviar() {
    const faltan = MODELOS_A_ELEGIR - modelosSeleccionados.length;
    const texto = faltan <= 0 ? 'Enviar'
        : faltan === MODELOS_A_ELEGIR ? `Elegí ${MODELOS_A_ELEGIR} modelos` : `Elegí ${faltan} más`;
    btnEnviar.innerHTML = `<span>${texto}</span>${FLECHA}`;
}

/* El contador del título lleva la cuenta; mfAviso queda solo para avisos. */
function pintarElegidos(mensaje) {
    const n = modelosSeleccionados.length;
    mfAviso.classList.remove('error');
    mfAviso.textContent = mensaje || '';
    // Solo si cambió: reescribir el mismo texto lo vuelve a leer el lector de pantalla.
    const cuenta = `${n} de ${MODELOS_A_ELEGIR} seleccionados`;
    if (mfContador.textContent !== cuenta) mfContador.textContent = cuenta;
    mfContador.classList.toggle('completo', n === MODELOS_A_ELEGIR);
    // Mientras se envía, el botón dice "Enviando…".
    if (!btnEnviar.disabled) pintarBotonEnviar();
    mfGrid.querySelectorAll('.mf-card').forEach(card => {
        const on = modelosSeleccionados.includes(card.dataset.id);
        card.classList.toggle('elegido', on);
        card.querySelector('.mf-marcar').setAttribute('aria-pressed', on ? 'true' : 'false');
        card.querySelector('.mf-marcar-txt').textContent = on ? 'Seleccionado' : 'Seleccionar';
    });
}

/* Devuelve false si no se pudo marcar (ya había 2). */
function alternarModelo(id) {
    if (modelosSeleccionados.includes(id)) {
        modelosSeleccionados = modelosSeleccionados.filter(x => x !== id);
    } else if (modelosSeleccionados.length >= MODELOS_A_ELEGIR) {
        pintarElegidos(`Ya elegiste ${MODELOS_A_ELEGIR}. Tocá uno de los seleccionados para sacarlo y cambiarlo.`);
        mfAviso.classList.add('error');
        return false;
    } else {
        modelosSeleccionados = [...modelosSeleccionados, id];
    }
    try { sessionStorage.setItem('gw-modelos', JSON.stringify(modelosSeleccionados)); } catch (_) {}
    pintarElegidos();
    return true;
}

// Las vistas se dibujan cuando la tarjeta se acerca a la pantalla: son 45.
const mfObservador = window.IntersectionObserver ? new IntersectionObserver(entradas => {
    entradas.forEach(e => {
        if (!e.isIntersecting) return;
        mfObservador.unobserve(e.target);
        dibujarVista(e.target);
    });
}, { rootMargin: '400px' }) : null;

function dibujarVista(card) {
    if (card.dataset.dibujada) return;
    card.dataset.dibujada = '1';
    const lienzo = card.querySelector('.md-lienzo');
    lienzo.innerHTML = GW_WIRE.render(modeloPorId(card.dataset.id));
    GW_WIRE.encajar(card.querySelector('.mf-vista'), lienzo, 1440);
}

function armarModelos() {
    if (!MODELOS.length || typeof GW_WIRE === 'undefined') {
        mfGrid.innerHTML = '<p class="mf-vacio">No pudimos cargar los modelos. Recargá la página y volvé a intentar.</p>';
        return;
    }
    [{ id: 'all', label: 'Todos' }, ...MODELO_TIPOS].forEach(t => {
        if (t.id !== 'all' && !MODELOS.some(m => m.tipo === t.id)) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mf-chip';
        b.dataset.valor = t.id;
        b.dataset.label = t.label; // reserva el ancho en negrita: el elegido no mueve a los demás
        b.textContent = t.label;
        mfTipos.append(b);
    });
    MODELO_RUBROS.forEach(r => mfRubro.append(new Option(r.label, r.id)));

    const frag = document.createDocumentFragment();
    MODELOS.forEach(m => {
        const card = document.createElement('article');
        card.className = 'mf-card';
        card.dataset.id = m.id;
        card.dataset.tipo = m.tipo;
        card.dataset.rubros = (m.rubros || []).join(' ');
        // Vista a la izquierda y nombre + botón a la derecha (24-sep). La vista
        // ya no scrollea: en el celular atrapaba el dedo y no dejaba bajar.
        card.innerHTML = `
            <div class="mf-foto">
                <div class="mf-vista" aria-hidden="true"><div class="md-alto"><div class="md-lienzo"></div></div></div>
                <span class="mf-letra" aria-hidden="true"></span>
                <button type="button" class="mf-ver"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/></svg><span>Ver grande</span></button>
            </div>
            <div class="mf-info">
                <p class="mf-modelo"></p>
                <p class="mf-nombre"></p>
                <button type="button" class="mf-marcar" aria-pressed="false"><span class="mf-check" aria-hidden="true"></span><span class="mf-marcar-txt">Seleccionar</span></button>
            </div>`;
        card.querySelector('.mf-letra').textContent = m.letra;
        card.querySelector('.mf-modelo').textContent = `Modelo ${m.letra}`;
        card.querySelector('.mf-nombre').textContent = m.nombre;
        card.querySelector('.mf-marcar').setAttribute('aria-label', `Seleccionar el ${nombreModelo(m)}`);
        card.querySelector('.mf-ver').setAttribute('aria-label', `Ver grande el ${nombreModelo(m)}`);
        frag.append(card);
        if (mfObservador) mfObservador.observe(card);
    });
    mfGrid.append(frag);
    if (!mfObservador) mfGrid.querySelectorAll('.mf-card').forEach(dibujarVista);

    mfGrid.addEventListener('click', e => {
        const card = e.target.closest('.mf-card');
        if (!card) return;
        if (e.target.closest('.mf-ver')) { abrirModelo(card.dataset.id, e.target.closest('.mf-ver')); return; }
        // Tocar cualquier parte de la tarjeta marca, igual que el botón.
        alternarModelo(card.dataset.id);
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

    filtrarModelos();
    pintarElegidos();
}

function filtrarModelos() {
    let visibles = 0;
    mfGrid.querySelectorAll('.mf-card').forEach(card => {
        card.hidden = (mfFiltro.tipo !== 'all' && card.dataset.tipo !== mfFiltro.tipo) ||
            (mfFiltro.rubro !== 'all' && !card.dataset.rubros.split(' ').includes(mfFiltro.rubro));
        if (!card.hidden) visibles++;
    });
    mfTipos.querySelectorAll('.mf-chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.valor === mfFiltro.tipo ? 'true' : 'false'));
    mfRubro.value = mfFiltro.rubro;
    document.getElementById('mfVacio').hidden = visibles !== 0;
}

/* ─── Vista grande ─── */
const mfOverlay = document.getElementById('mfOverlay');
const mfEscenario = document.getElementById('mfEscenario');
const mfElegir = document.getElementById('mfElegir');
const mfVer = { id: '', vista: 'pc', volverA: null };

function pintarModal() {
    const m = modeloPorId(mfVer.id);
    document.getElementById('mfTitulo').textContent = nombreModelo(m);
    const wire = GW_WIRE.render(m);
    if (mfVer.vista === 'pc') {
        mfEscenario.innerHTML = `<div class="mf-pc"><div class="md-alto"><div class="md-lienzo">${wire}</div></div></div>`;
        GW_WIRE.encajar(mfEscenario.querySelector('.mf-pc'), mfEscenario.querySelector('.md-lienzo'), 1440);
    } else {
        mfEscenario.innerHTML = `<div class="mf-cel">${wire}</div>`;
    }
    mfEscenario.scrollTop = 0;
    mfOverlay.querySelectorAll('.mf-seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.vista === mfVer.vista ? 'true' : 'false'));
    const elegido = modelosSeleccionados.includes(m.id);
    mfElegir.textContent = elegido ? '✓ Seleccionado · tocá para sacarlo' : 'Seleccionar este modelo';
    mfElegir.classList.toggle('elegido', elegido);
}

function abrirModelo(id, desde) {
    mfVer.id = id;
    mfVer.volverA = desde || null;
    mfVer.vista = window.innerWidth < 700 ? 'celular' : 'pc';
    mfOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    pintarModal();
    document.getElementById('mfCerrar').focus();
}

function cerrarModelo() {
    if (mfOverlay.hidden) return;
    mfOverlay.hidden = true;
    mfEscenario.innerHTML = '';
    document.body.style.overflow = '';
    mfVer.volverA?.focus();
}

mfOverlay.querySelector('.mf-seg').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.dataset.vista === mfVer.vista) return;
    mfVer.vista = b.dataset.vista;
    pintarModal();
});
document.getElementById('mfCerrar').addEventListener('click', cerrarModelo);
mfOverlay.addEventListener('click', e => { if (e.target === mfOverlay) cerrarModelo(); });
document.addEventListener('keydown', e => {
    if (mfOverlay.hidden) return;
    if (e.key === 'Escape') { cerrarModelo(); return; }
    // Foco atrapado adentro del modal mientras está abierto.
    if (e.key === 'Tab') {
        const focos = [...mfOverlay.querySelectorAll('button')];
        const primero = focos[0], ultimo = focos[focos.length - 1];
        if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
});
mfElegir.addEventListener('click', () => {
    const yaEstaba = modelosSeleccionados.includes(mfVer.id);
    if (!alternarModelo(mfVer.id)) {
        mfElegir.textContent = `Ya elegiste ${MODELOS_A_ELEGIR}: sacá uno primero`;
        return;
    }
    if (yaEstaba) { pintarModal(); return; }
    cerrarModelo();
});

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
            ['field_nombre', value('nombre') !== ''],
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
    if (enfocar) paso?.querySelector(n === 3 && !conIntro ? ':scope > .form-section .step-header-title' : '.step-header-title')?.focus({ preventScroll: true });
    // El paso de modelos necesita más ancho que los campos.
    document.body.classList.toggle('paso-modelos', n === 3 && !conIntro);
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
        { id: 'nombre', msg: 'Contanos tu nombre.' },
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
    if (!modalidad.value) { markError(modalidad, 'Elegí el plan anual, el mensual o el pago único.'); firstError = modalidad; }

    // "No lo sé" es una respuesta válida: lo único que no pasa es no elegir.
    const estilo = document.getElementById('estilo');
    if (estilo && !estilo.value) {
        markError(estilo, 'Elegí un estilo. Si todavía no lo tenés claro, elegí "No lo sé".');
        if (!firstError) firstError = estilo;
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

    // Los color pickers (type="color") siempre traen un valor, no hace falta
    // validarlos: se combinan en un solo texto para el mismo campo "colores"
    // que ya espera el bot.
    const colores = [
        `Color principal: ${get('color_principal')}`,
        `Color secundario: ${get('color_secundario')}`,
        `Fondos: ${get('color_fondos')}`,
    ].join(' · ');

    const payload = {
        t: get('telefono'),
        nombre: get('nombre'),
        nombre_negocio: get('nombre_negocio'),
        resumen: get('resumen'),
        colores,
        // Paso 2 (10-sep). Van siempre, aunque estén vacíos: así el servidor
        // sabe que el formulario ya preguntó la referencia y no la pide por chat.
        estilo: get('estilo'),
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

const LIMITES = { nombre: 80, nombre_negocio: 80, resumen: 600, colores: 200, estilo: 40, referencia: 300, incluir: 600 };
const NOMBRES_CAMPO = { nombre: 'tu nombre', nombre_negocio: 'el nombre del negocio', resumen: 'el resumen', colores: 'los colores', telefono: 'el teléfono',
    estilo: 'el estilo de página', referencia: 'la referencia web', incluir: 'lo que querés incluir' };

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

/* Estilo de página: un <option> no puede llevar links, así que el ejemplo de
 * cada estilo va en la línea de abajo y cambia con lo que se elige. La
 * descripción, el link y el nombre del ejemplo viven en cada <option>. */
const estiloSelect = document.getElementById('estilo');
const estiloAyuda = document.getElementById('estiloEjemplo');
const ESTILO_AYUDA_INICIAL = estiloAyuda ? estiloAyuda.textContent : '';

function pintarEstilo() {
    if (!estiloSelect || !estiloAyuda) return;
    const op = estiloSelect.selectedOptions[0];
    if (!op || !op.value) {
        estiloAyuda.textContent = ESTILO_AYUDA_INICIAL;
        return;
    }
    const desc = op.dataset.desc || '';
    if (!op.dataset.ejemplo) {
        estiloAyuda.textContent = desc;
        return;
    }
    const a = document.createElement('a');
    a.href = op.dataset.ejemplo;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'inline-link';
    a.textContent = op.dataset.ejemploNombre || 'ver ejemplo';
    estiloAyuda.textContent = desc.replace(/\.$/, '') + ' (ejemplo: ';
    estiloAyuda.append(a, ').');
}
estiloSelect?.addEventListener('change', pintarEstilo);
pintarEstilo();

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
const DRAFT_FIELDS = ['nombre', 'nombre_negocio', 'resumen', 'telefono',
    'color_principal', 'color_secundario', 'color_fondos',
    'estilo', 'referencia', 'incluir', 'modalidad'];

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
        // Un estilo que ya no está en la lista dejaría el desplegable en blanco.
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
// ejemplo del estilo.
_pintarContadores.forEach(pintar => pintar());
pintarEstilo();
pintarPlan();
