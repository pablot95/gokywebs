const FORM_LEAD_URL = '/wabot/form-lead.php';

const WSP_NUM = '5491140688675';
const wspLink = msg => `https://wa.me/${WSP_NUM}?text=${encodeURIComponent(msg)}`;

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
        pista.textContent = 'Dejanos tu WhatsApp: es por donde te mandamos la demo cuando esté lista.';
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
        telefonoAviso.textContent = '¿No es tu número? ';
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
 * Dos pantallas dentro del mismo <form> (10-sep, pedido de Pablo): el paso 1
 * se valida antes de dejar avanzar y el envío sale del paso 2. Los dos pasos
 * están siempre en el DOM, así el borrador y los reintentos ven todos los
 * campos aunque el paso no esté a la vista. */
const PASOS = [...document.querySelectorAll('.form-step')];

function pasoDe(el) {
    return Number(el?.closest('.form-step')?.dataset.step || 1);
}

function irAPaso(n, { enfocar = true, scroll = true } = {}) {
    PASOS.forEach(p => { p.hidden = Number(p.dataset.step) !== n; });
    document.querySelectorAll('.step-dot').forEach(dot => {
        const s = Number(dot.dataset.s);
        dot.classList.toggle('active', s === n);
        dot.classList.toggle('done', s < n);
    });
    document.querySelectorAll('.step-connector').forEach((c, i) => c.classList.toggle('done', i + 1 < n));

    const paso = PASOS.find(p => Number(p.dataset.step) === n);
    // Un textarea oculto mide 0 de alto: se ajusta recién ahora que se ve.
    paso?.querySelectorAll('textarea.autosize').forEach(autoGrow);
    if (scroll) document.getElementById('formCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (enfocar) paso?.querySelector('.step-header-title')?.focus({ preventScroll: true });
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

document.getElementById('btnVolver').addEventListener('click', () => {
    clearErrors();
    irAPaso(1);
});

const btnEnviar = document.getElementById('btnEnviar');
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
        error2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
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

    // "No lo sé" es una respuesta válida: lo único que no pasa es no elegir.
    const estilo = document.getElementById('estilo');
    if (estilo && !estilo.value) {
        markError(estilo, 'Elegí un estilo. Si todavía no lo tenés claro, elegí "No lo sé".');
        firstError = estilo;
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
    btnEnviar.textContent = 'Enviar →';
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
        showSuccess(payload.nombre, payload.nombre_negocio);
    } catch (err) {
        console.error('Error al enviar el formulario:', err);
        mostrarErrorEnvio('No pudimos enviar el formulario. Revisá tu conexión y probá de nuevo; si sigue fallando, escribinos por WhatsApp.');
        restaurarBoton();
    }
}

/* Sin emojis a propósito.
 *
 * Los dos que había (🙋 y 🏢) son caracteres de 4 bytes, y en 3 de 23 envíos
 * reales del 3-sep llegaron a WhatsApp como "�": la clienta de Secretos
 * Compartidos vio "� Nombre" y "� Negocio" en el mensaje que ella misma
 * mandaba. El texto sale bien de acá (el archivo es UTF-8 y el link se arma con
 * encodeURIComponent): lo rompe el WhatsApp del cliente al levantar el ?text=,
 * y no siempre — a la mayoría le llega intacto, así que no hay nada que
 * corregir de este lado más que no depender de eso. Con texto ASCII el mensaje
 * llega igual en todos los dispositivos. */
function mensajeFormWsp(nombre, nombreNegocio) {
    const lineas = [`Hola! Acabo de completar el formulario de la demo gratis.`, ''];
    lineas.push(`Nombre: ${nombre || 'sin nombre'}`);
    lineas.push(`Negocio: ${nombreNegocio || 'sin nombre'}`);
    lineas.push('', 'Quedo atento/a!');
    return lineas.join('\n');
}

function showSuccess(nombre, nombreNegocio) {
    const card = document.getElementById('formCard');
    const url = wspLink(mensajeFormWsp(nombre, nombreNegocio));
    window.open(url, '_blank', 'noopener');
    card.innerHTML = `
        <div class="success-screen">
            <div class="success-icon">✅</div>
            <h2 class="success-title">Listo, recibimos tus datos!</h2>
            <span class="success-badge">⏱️ Tu demo va a estar lista en menos de 24 horas</span>
            <p class="success-desc">
                Te la mandamos por WhatsApp y queda disponible 5 días, por una cuestión de espacio. Ahora te estamos abriendo WhatsApp para coordinar los próximos pasos: si no se abrió solo, tocá el botón de acá abajo.
            </p>
            <a href="${url}" class="btn-wsp-form" target="_blank" rel="noopener">💬 Abrir WhatsApp</a>
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

const DRAFT_KEY = 'gky_form_draft';
// Los del paso 2 también: el que recarga la página no pierde lo que eligió.
const DRAFT_FIELDS = ['nombre', 'nombre_negocio', 'resumen', 'telefono',
    'color_principal', 'color_secundario', 'color_fondos',
    'estilo', 'referencia', 'incluir'];

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
