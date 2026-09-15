import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let _leadDb = null;
try {
    const _fbApp = initializeApp({
        apiKey:            "AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ",
        authDomain:        "gokywebs-967cd.firebaseapp.com",
        projectId:         "gokywebs-967cd",
        storageBucket:     "gokywebs-967cd.firebasestorage.app",
        messagingSenderId: "50030976147",
        appId:             "1:50030976147:web:9f07245b536a75833a4166"
    }, 'gky-presupuesto-leads');
    _leadDb = getFirestore(_fbApp);
} catch(e) {
    console.warn('[GKY] Firebase no disponible, leads no se guardarán:', e.message);
}

/* Embudo exhaustivo del presupuesto (31-jul-2026): antes solo quedaban 2 hitos en
   Firestore (calculó precio / confirmó boceto). Ahora cada sesión escribe UN solo
   doc en `presupuesto_funnel` (id = sessionId de esta pestaña) que se va
   completando con merge a medida que avanza: paso 1 (entró) → paso 2 → paso 3 →
   precio calculado → tocó "quiero mi muestra" → confirmó el boceto. Al ser un
   único doc por sesión, el embudo en el admin queda garantizado monótono
   (ningún paso posterior puede tener más gente que uno anterior) sin tener que
   cruzar `presupuestos`/`propuestas` a mano. No distingue origen (WhatsApp/
   Instagram/web) a propósito — no se pidió ese desglose acá. */
function _pfSessionId() {
    try {
        let id = sessionStorage.getItem('gky_pf_sid');
        if (!id) {
            id = (window.crypto?.randomUUID) ? crypto.randomUUID() : ('pf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10));
            sessionStorage.setItem('gky_pf_sid', id);
        }
        return id;
    } catch (_) {
        return 'pf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    }
}

// Cada hito se manda una sola vez por sesión (evita re-escribir si el usuario
// va y vuelve entre pasos, o si _restorePresState reconstruye la pantalla).
function _pfOnce(flag, fn) {
    try {
        if (sessionStorage.getItem(flag)) return;
        sessionStorage.setItem(flag, '1');
    } catch (_) {}
    fn();
}

/* `permitidos` (opcional): la misma escritura, recortada a los campos que ya
   acepta el allowlist de `presupuesto_funnel` en firestore.rules. Si la regla
   todavía no suma los campos nuevos (15-sep-2026: precioUnico, sena, saldo y
   modalidad), Firestore rechaza el update entero con permission-denied: se
   reintenta con esos campos para no perder el hito del embudo. */
async function _trackFunnel(fields, permitidos = null) {
    if (!_leadDb) return; // Firebase no disponible — falla silencioso
    try {
        const ref = doc(_leadDb, 'presupuesto_funnel', _pfSessionId());
        try {
            await setDoc(ref, { ...fields, updatedAt: serverTimestamp() }, { merge: true });
        } catch (err) {
            if (!permitidos || err.code !== 'permission-denied') throw err;
            await setDoc(ref, { ...permitidos, updatedAt: serverTimestamp() }, { merge: true });
        }
    } catch (err) {
        console.warn('[GKY] No se pudo trackear el embudo:', err.code || err.message);
    }
}

async function _guardarLead(st) {
    if (!_leadDb) return; // Firebase no disponible — falla silencioso

    const ref = doc(collection(_leadDb, 'presupuestos'));
    try { localStorage.setItem('gky_lead_id', ref.id); } catch(_) {}

    try {
        await setDoc(ref, {
            estado:          'lead',
            siteType:        st.siteType        || '',
            businessType:    st.businessInput   || '',
            phone:           st.phonePais && st.phone ? (st.phonePais + ' ' + st.phone) : (st.phone || ''),
            objectives:      st.objectives      || [],
            functionalities: st.functionalities || [],
            pages:           st.pages           || '',
            /* Dos formas de contratar la misma web (15-sep-2026), con los
               nombres que lee el admin: precioUnico, sena (la seña del pago
               único), saldo (precioUnico - sena), mensualidad y modalidad (''
               acá, porque todavía no eligió; 'unico' o 'mensual' lo escribe
               exito.html). totalPrice y basePrice valen el precio único: el
               admin toma totalPrice 0 como "a cotizar". primerPago es del modelo
               del 10 al 14-sep y va siempre en 0. */
            basePrice:       st.precioUnico     || 0,
            extrasPrice:     st.extrasPrice     || 0,
            totalPrice:      st.precioUnico     || 0,
            precioUnico:     st.precioUnico     || 0,
            sena:            st.sena            || 0,
            saldo:           st.saldo           || 0,
            mensualidad:     st.mensualidad     || 0,
            modalidad:       st.modalidad       || '',
            primerPago:      0,
            sinPrecio:       !!st.sinPrecio,
            extras:          st.extras          || [],
            createdAt:       serverTimestamp(),
        });
        console.log('[GKY] Lead guardado OK, id:', ref.id);
    } catch(err) {
        console.warn('[GKY] No se pudo guardar lead en Firestore:', err.code || err.message);
        // Fallo silencioso — el presupuesto sigue funcionando sin Firebase
    }
}

/* El modal "Quiero una muestra gratis" reemplaza al viejo /form/: con nombre
   del negocio, colores y una descripción libre ya alcanza para armar el
   boceto. Escribe en la MISMA colección y con los MISMOS nombres de campo
   que lee la pantalla de bocetos de admin/dashboard.js:
   · nombre del negocio → nombre_negocio (mismo campo que usa /form/, así
     "Negocio" no queda vacío en la tabla de Bocetos).
   · descripción del cliente → objetivo_web (entra en "Sobre el negocio y qué
     quiere lograr", que se ve en el modal del boceto y sale en Copiar/Design);
     NO en "notas" (apuntes internos de Pablo) ni solo en "extra" (esa fila
     recién se ve al convertir a cliente).
   · precio → precioTotal/sena/saldo son los nombres canónicos de `propuestas`
     (el admin los copia al pasar el boceto a Seguimiento). Desde el 15-sep-2026
     (dos formas de contratar la misma web) precioTotal, totalPrice y basePrice
     valen el precio único; sena es la seña del pago único y saldo el resto al
     entregar, y van también precioUnico, mensualidad y modalidad ('' hasta que
     elige, en exito.html). primerPago es del modelo del 10 al 14-sep: siempre 0.
   · adicionales elegidos → campo propio `adicionales_texto` (31-jul-2026:
     antes se mezclaban dentro de productos_servicios, que en /form/ significa
     otra cosa — quedaban pegados en medio del párrafo de "Sobre el negocio"). */
async function _guardarBoceto(nombreNegocio, colorPrincipal, colorSecundario, colorFondos, descripcion) {
    if (!_leadDb) return false; // Firebase no disponible — falla silencioso

    let presupuestoId = null;
    try { presupuestoId = localStorage.getItem('gky_lead_id') || null; } catch(_) {}

    const colores = [
        `Color principal: ${colorPrincipal}`,
        `Color secundario: ${colorSecundario}`,
        `Color de fondos: ${colorFondos}`,
    ].join(' · ');

    const adicionalesTexto = [
        (state.extras || []).length ? state.extras.map(e => `${e.name} (+${fmt(e.price)})`).join(', ') : ''
    ].filter(Boolean).join(' · ');

    try {
        const ref = doc(collection(_leadDb, 'propuestas'));
        await setDoc(ref, {
            ...(presupuestoId ? { presupuestoId } : {}),
            nombre_negocio:      nombreNegocio,
            negocio_rubro:       [nombreNegocio, state.businessInput].filter(Boolean).join(' — '),
            rubro:               state.businessInput || '',
            telefono:            state.phonePais && state.phone ? (state.phonePais + ' ' + state.phone) : (state.phone || ''),
            tipo_web:            TYPE_NAMES[state.siteType] || '',
            tipoDetectado:       state.siteType || '',
            tipoDetectadoLabel:  TYPE_NAMES[state.siteType] || '',
            objetivo_web:        descripcion,
            adicionales_texto:   adicionalesTexto,
            objectives:          state.objectives || [],
            functionalities:     state.functionalities || [],
            basePrice:           state.precioUnico || 0,
            extrasPrice:         state.extrasPrice || 0,
            totalPrice:          state.precioUnico || 0,
            precioTotal:         state.precioUnico || 0,
            precioUnico:         state.precioUnico || 0,
            sena:                state.sena || 0,
            saldo:               state.saldo || 0,
            mensualidad:         state.mensualidad || 0,
            modalidad:           state.modalidad || '',
            primerPago:          0,
            sinPrecio:           !!state.sinPrecio,
            extras:              state.extras || [],
            color_principal:     colorPrincipal,
            color_secundario:    colorSecundario,
            color_fondos:        colorFondos,
            colores,
            confirmoMuestra:     true,
            /* Marca de origen (mismo criterio que usan mantenimiento/completados
               en admin/dashboard.js): distingue estos bocetos, creados desde el
               modal de la calculadora, de los que llegan por /form/ — así el
               admin puede armar el embudo propio de este flujo. */
            origen:              'presupuesto-modal',
            /* `fecha` (string legible) es lo ÚNICO que sobrevive al pasar el
               boceto a cliente: el admin copia `propuestaFecha: p.fecha` y acto
               seguido borra la propuesta, así que sin esto el cliente queda "sin
               fecha de boceto" y se cae del pendiente del mes y de las stats.
               Mismo formato que /form/ y que el alta manual del admin. */
            fecha:               new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
            confirmadoAt:        serverTimestamp(),
            createdAt:           serverTimestamp(),
        });
        console.log('[GKY] Boceto guardado OK, id:', ref.id);
        return true;
    } catch(err) {
        console.warn('[GKY] No se pudo guardar el boceto en Firestore:', err.code || err.message);
        return false;
    }
}

const BUSINESS_TYPES = [
    { label: 'Inmobiliaria / Bienes Raíces', isInmo: true },
    { label: 'Agente Inmobiliario', isInmo: true },
    { label: 'Administración de Propiedades', isInmo: true },
    { label: 'Alquiler / Venta de Propiedades', isInmo: true },
    { label: 'Psicología / Salud Mental' },
    { label: 'Médico / Consultorio' },
    { label: 'Odontología' },
    { label: 'Nutrición / Dietista' },
    { label: 'Kinesiología / Fisioterapia' },
    { label: 'Veterinaria' },
    { label: 'Centro de Salud / Clínica' },
    { label: 'Prepaga / Seguro de Salud' },
    { label: 'Ambulancia / Emergencias' },
    { label: 'Estética / Centro de Belleza' },
    { label: 'Peluquería / Barbería' },
    { label: 'Spa / Masajes / Bienestar' },
    { label: 'Fitness / Gimnasio' },
    { label: 'Yoga / Pilates / Meditación' },
    { label: 'Abogado / Estudio Jurídico' },
    { label: 'Contador / Asesoría Contable' },
    { label: 'Asesor de Seguros' },
    { label: 'Gestoría / Despachante' },
    { label: 'Trading / Finanzas / Inversiones' },
    { label: 'Consultoría Empresarial' },
    { label: 'Recursos Humanos' },
    { label: 'Marketing / Publicidad / Agencia' },
    { label: 'Diseño Gráfico / Fotografía' },
    { label: 'Arquitectura / Diseño de Interiores' },
    { label: 'Construcción / Materiales' },
    { label: 'Mueblería / Hogar' },
    { label: 'Plomería / Electricidad / Gas' },
    { label: 'Refrigeración / Climatización' },
    { label: 'Limpieza / Mantenimiento' },
    { label: 'Fumigación / Control de Plagas' },
    { label: 'Seguridad Privada' },
    { label: 'Logística / Transporte' },
    { label: 'Automotriz / Autopartes' },
    { label: 'Indumentaria / Ropa' },
    { label: 'Calzado / Accesorios' },
    { label: 'Electrónica / Tecnología' },
    { label: 'Papelería / Librería' },
    { label: 'Farmacia / Salud y Bienestar' },
    { label: 'Distribuidora / Mayorista' },
    { label: 'Supermercado / Almacén' },
    { label: 'Gastronomía / Restaurant / Bar' },
    { label: 'Catering / Barra de Tragos / Eventos' },
    { label: 'Panadería / Confitería' },
    { label: 'Rotisería / Delivery' },
    { label: 'Academia / Instituto Educativo' },
    { label: 'Profesor Particular / Tutorías' },
    { label: 'Idiomas / Traductora' },
    { label: 'Coaching / Desarrollo Personal' },
    { label: 'Artesanías / Arte / Manualidades' },
    { label: 'Música / Entretenimiento' },
    { label: 'Turismo / Viajes / Hospedaje' },
    { label: 'Fotografía / Video / Producción' },
    { label: 'Informática / Sistemas / Software' },
    { label: 'E-commerce / Tienda Online' },
    { label: 'ONG / Fundación / Asociación' },
    { label: 'Iglesia / Comunidad Religiosa' },
    { label: 'Deporte / Club / Actividades' },
    { label: 'Otro' },
];

/* Qué incluye cada tipo de web (10-sep-2026). Es UNA sola lista por tipo y
   la usan tanto el panel del paso 3 como la tarjeta de resultado (antes había
   dos listas, INCLUDES y ALREADY_INCLUDED, que se desincronizaban). Desde el
   15-sep-2026 la lista vale para las dos formas de contratar: arriba va el
   hosting y el dominio de cada una (el primer año con el pago único, mientras
   dure el servicio mensual) y al final la carga de hasta 10 productos, el
   panel para editar textos e imágenes (13-sep) y el cambio por mes, que es
   del servicio mensual. */
const INCLUDES = {
    landing: [
        '<strong>Desarrollo a medida, con hosting y dominio: el primer año con el pago único y mientras tengas el servicio mensual</strong>',
        'Diseño personalizado y responsive',
        'Hasta 5 secciones optimizadas para conversión',
        'SEO básico y meta etiquetas',
        'Formulario de contacto',
        'Integración con redes sociales',
        'Botón flotante de WhatsApp',
        'Certificado SSL incluido',
        'Carga de hasta 10 productos',
        'Panel de administración para editar vos mismo textos e imágenes',
        'Un cambio por mes con el servicio mensual'
    ],
    ecommerce: [
        '<strong>Desarrollo a medida, con hosting y dominio: el primer año con el pago único y mientras tengas el servicio mensual</strong>',
        'Tienda online completa y responsive',
        'Catálogo de productos con filtros',
        'Carrito de compras y proceso de pago',
        'Integración con Mercado Pago',
        'Panel de gestión de pedidos',
        'Carga de hasta 10 productos',
        'SEO optimizado para e-commerce',
        'Botón flotante de WhatsApp',
        'Certificado SSL incluido',
        'Panel de administración para editar vos mismo textos e imágenes',
        'Un cambio por mes con el servicio mensual'
    ],
    inmobiliaria: [
        '<strong>Desarrollo a medida, con hosting y dominio: el primer año con el pago único y mientras tengas el servicio mensual</strong>',
        'Sitio inmobiliaria profesional y responsive',
        'Listado de propiedades con filtros avanzados',
        'Ficha de propiedad con galería de fotos',
        'Formulario de contacto por propiedad',
        'Mapa interactivo de ubicaciones',
        'SEO local optimizado',
        'Botón flotante de WhatsApp',
        'Certificado SSL incluido',
        'Carga de hasta 10 productos',
        'Panel de administración para editar vos mismo textos e imágenes',
        'Un cambio por mes con el servicio mensual'
    ],
    elearning: [
        '<strong>Desarrollo a medida, con hosting y dominio: el primer año con el pago único y mientras tengas el servicio mensual</strong>',
        'Plataforma LMS completa y responsive',
        'Login y panel propio para tus alumnos',
        'Cursos organizados en módulos con videos',
        'Evaluaciones y seguimiento de progreso por alumno',
        'Acceso docente para cargar contenido y gestionar sus cursos',
        'Chat entre alumnos y docentes',
        'Cobro de los cursos online',
        'SEO básico y meta etiquetas',
        'Botón flotante de WhatsApp',
        'Certificado SSL incluido',
        'Carga de hasta 10 productos',
        'Panel de administración para editar vos mismo textos e imágenes',
        'Un cambio por mes con el servicio mensual'
    ]
};

const PP = '/images/previewspropuesta/';

const SIMILAR_PROJECTS = {
    landing: [
        { name: 'Psicóloga Luana',  url: 'https://licenciadaluena.com.ar',  webSrc: PP + 'licenciada.png' },
        { name: 'Barra Tragos',     url: 'https://masmomentosunicos.com',    webSrc: PP + 'momentos.png' },
        { name: 'Encanto Estética', url: 'https://encantoestetica.com.ar',  webSrc: PP + 'estetica.png' },
        { name: 'Estudio A. Silva', url: 'https://estudioasilva.com.ar',    webSrc: PP + 'abogada.png' },
        { name: 'Infinity Trading', url: 'https://infinitytrader.com.ar',   webSrc: PP + 'infinity.png' },
        { name: 'AMP Solutions',    url: 'https://ampsolutionsar.com',      webSrc: PP + 'amp.png' },
    ],
    ecommerce: [
        { name: 'Distrito Río Grande', url: 'https://distririogrande.com.ar',          webSrc: PP + 'disitrito.png',    celuSrc: PP + 'disitrito.png' },
        { name: 'Nifty Bar',           url: 'https://niftybar.com.ar',                webSrc: PP + 'niftycelu.png',    celuSrc: PP + 'niftycelu.png' },
        { name: 'Coco Catering',       url: 'https://cococatering.com.ar',            webSrc: PP + 'coco.png',         celuSrc: PP + 'coco.png' },
        { name: "Daniel's Aire",       url: 'https://danielsaire.com.ar',             webSrc: PP + 'danielsaire.png',  celuSrc: PP + 'danielsaire.png' },
        { name: 'Tus Encantos',        url: 'https://tusencantosindumentaria.com.ar', imgId: 'tusencantos' },
        { name: 'Botines FV',          url: 'https://botinesfv.com',                  imgId: 'botines' },
    ],
    inmobiliaria: [
        { name: 'Bastons Paulete',    url: 'https://bastonspaulete.com',              webSrc: PP + 'baston.png' },
        { name: 'Gómez & Asociados', url: 'https://inmobiliariagomezyasociados.com',  webSrc: PP + 'gomez.png' },
        { name: 'Vento Inmobiliaria', url: 'https://ventoinmobiliaria.com.ar',        webSrc: PP + 'vento.png' },
    ]
};

// La clave interna sigue siendo 'landing' (la lee el admin y el backend de MP);
// solo cambia el nombre visible: "Sitio profesional" (10-sep-2026).
const TYPE_NAMES = {
    landing: 'Sitio profesional',
    ecommerce: 'E-commerce',
    inmobiliaria: 'Web Inmobiliaria',
    elearning: 'Plataforma LMS'
};
const TYPE_BADGE_CLASSES = {
    landing: 'badge-landing',
    ecommerce: 'badge-ecommerce',
    inmobiliaria: 'badge-inmobiliaria',
    elearning: 'badge-elearning'
};

const QUE_ES_DATA = {
    landing: {
        icon: '🚀',
        title: '¿Qué es un Sitio profesional?',
        body: 'Es la web de tu negocio o tu actividad: presenta lo que hacés, genera confianza y convierte visitas en consultas. Simple, rápida y efectiva.',
        bullets: [
            'Cargás más rápido y generás mejor primera impresión',
            'Ideal para servicios, profesionales y emprendimientos',
            'Posicionamiento en Google desde el primer día',
            'Más económica y lista en menos tiempo'
        ]
    },
    ecommerce: {
        icon: '🛍️',
        title: '¿Qué es un E-commerce?',
        body: 'Una tienda online completa para vender tus productos 24/7. Con catálogo, carrito y pagos integrados con Mercado Pago.',
        bullets: [
            'Vendés sin depender de redes sociales',
            'Tus clientes compran en cualquier horario',
            'Gestión de productos, stock y pedidos desde un panel',
            'Integración nativa con Mercado Pago'
        ]
    },
    inmobiliaria: {
        icon: '🏠',
        title: '¿Qué es una Web Inmobiliaria?',
        body: 'Una plataforma especializada para mostrar y gestionar propiedades. Diseñada para captar más clientes y cerrar más operaciones.',
        bullets: [
            'Listado de propiedades con filtros avanzados',
            'Fichas con galería de fotos y mapa de ubicación',
            'Formulario de contacto por cada propiedad',
            'Posicionamiento local para búsquedas en tu zona'
        ]
    },
    elearning: {
        icon: '🎓',
        title: '¿Qué es una Plataforma LMS?',
        body: 'Una academia online completa para vender y dictar tus cursos: alumnos con su propio acceso, docentes con su propio panel y todo el seguimiento en un solo lugar.',
        bullets: [
            'Vendés y dictás tus cursos sin depender de otra plataforma',
            'Tus alumnos avanzan a su ritmo con seguimiento de progreso',
            'Docentes con acceso propio para cargar contenido y evaluar',
            'Chat directo entre alumnos y docentes'
        ]
    }
};

const WSP_NUM = '5491125068578';
const wspLink = msg => `https://wa.me/${WSP_NUM}?text=${encodeURIComponent(msg)}`;

const state = {
    businessInput: '',
    isInmo: false,
    phone: '',
    phonePais: '+54',
    objectives: [],
    functionalities: [],
    pages: '',
    siteType: '',
    basePrice: 0,
    extrasPrice: 0,
    totalPrice: 0,     // = precioUnico (el admin toma 0 como "a cotizar")
    precioUnico: 0,
    sena: 0,           // seña del pago único
    saldo: 0,          // precioUnico - sena, se abona al entregar la web
    mensualidad: 0,
    modalidad: '',     // 'unico' | 'mensual' recién al tocar un botón del checkout
    primerPago: 0,     // campo del modelo del 10 al 14-sep: siempre 0
    sinPrecio: false, // precio a cotizar en vez de $0 real — el admin lo necesita para no mostrarlo como plata
    extras: [],
    clientData: {}
};

function fmt(n) { return '$' + Number(n).toLocaleString('es-AR'); }
function toast(msg, type = 'info') {
    const wrap = document.getElementById('toastWrap');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function goToStep(from, to) {
    document.getElementById('step-' + from).classList.remove('active');
    document.getElementById('step-' + to).classList.add('active');
    updateStepDots(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (to === 3) renderStep3Context();
    updateLiveBudget();
    _savePresState(to);
}

// ── Persistencia de estado entre pestañas ────────────────
// Cuando el usuario abre un ejemplo en nueva pestaña, el browser
// puede descartar la pestaña original por memoria. sessionStorage
// sobrevive ese descarte — al volver, restauramos el estado y el paso.
const _PRES_KEY = 'gky_pres_draft';

function _savePresState(step) {
    try {
        sessionStorage.setItem(_PRES_KEY, JSON.stringify({ _step: step, ...state }));
    } catch (_) {}
}

function _clearPresState() {
    sessionStorage.removeItem(_PRES_KEY);
}

function _restorePresState() {
    try {
        const raw = sessionStorage.getItem(_PRES_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        let step = saved._step || 1;
        if (step === 4) step = 3; // compat: borrador viejo con el paso 4 (páginas), ya no existe
        if (step <= 1) return; // step 1 es el default, nada que restaurar

        // Restaurar state en memoria
        const { _step, ...rest } = saved;
        Object.assign(state, rest);

        // Restaurar campo de negocio
        if (state.businessInput) {
            document.getElementById('businessInput').value = state.businessInput;
        }

        // Restaurar teléfono del paso 1
        if (state.phone) {
            const telEl  = document.getElementById('step1Tel');
            const paisEl = document.getElementById('step1Pais');
            if (telEl)  telEl.value  = state.phone;
            if (paisEl && state.phonePais) paisEl.value = state.phonePais;
        }

        // Restaurar pills de objetivos
        if (step >= 2) {
            _restorePills('obj-pills', state.objectives);
            if (state.objectives.includes('otro')) {
                document.getElementById('customObjWrap')?.classList.add('visible');
                const next2Btn = document.getElementById('next2');
                if (next2Btn) next2Btn.style.display = 'none';
            }
        }

        if (step === 5) {
            // El resultado ya estaba visible — volver a renderizarlo
            renderResult();
        } else {
            // Mostrar el paso correcto directamente (sin animación innecesaria)
            for (let i = 1; i <= 3; i++) {
                const el = document.getElementById('step-' + i);
                if (el) el.classList.toggle('active', i === step);
            }
            updateStepDots(step);
            if (step === 3) renderStep3Context();
        }
    } catch (_) {}
}

function _restorePills(containerId, values) {
    if (!values || !values.length) return;
    document.getElementById(containerId)?.querySelectorAll('.pill').forEach(pill => {
        if (values.includes(pill.dataset.value)) pill.classList.add('selected');
    });
}

/* Paso 3 (10-sep-2026): ya no hay pills de adicionales — el modelo es "todo
   incluido" y los dos únicos adicionales (productos arriba de 10, más de un
   cambio por mes) se coordinan por WhatsApp. El paso queda como el panel de
   qué incluye la web + las dos formas de contratarla (15-sep-2026). */
function renderStep3Context() {
    const type     = getSiteType();
    const items    = INCLUDES[type] || INCLUDES.landing;
    const included = document.getElementById('func-included');
    const { precioUnico, sena, mensualidad, sinPrecio } = getPlanInfo(type);
    const precioTexto = sinPrecio
        ? 'Armamos un precio a medida — lo coordinamos directo con vos.'
        : `Pago único de <strong style="color:black">${fmt(precioUnico)}</strong>, con una seña de ${fmt(sena)} para arrancar y el saldo al entregar la web, o servicio mensual de <strong style="color:black">${fmt(mensualidad)} por mes</strong>, sin pago inicial: con la primera mensualidad armamos la web y la dejamos funcionando. Es la misma web con las dos formas, y con cualquiera queda lista en unos 7 días.`;
    if (included) {
        included.innerHTML = `
            <p style="font-size:0.82rem;font-weight:700;color:black;margin-bottom:0.6rem">Tu web ya incluye:</p>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:0.35rem;margin-bottom:0.9rem">
                ${items.map(i => `
                    <li style="display:flex;align-items:baseline;gap:0.5rem;font-size:0.85rem;color:var(--text-muted)">
                        <span style="color:var(--green);flex-shrink:0;font-size:0.8rem">✓</span>
                        <span>${i}</span>
                    </li>`).join('')}
            </ul>
            <p style="font-size:0.9rem;color:black">${precioTexto}</p>`;
    }

    updateLiveBudget();
}

function updateStepDots(current) {
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('dot-' + i);
        dot.classList.remove('active', 'done');
        if (i < current) dot.classList.add('done'), dot.textContent = '✓';
        else if (i === current) dot.classList.add('active'), dot.textContent = i;
        else dot.textContent = i;
    }
    for (let i = 1; i <= 2; i++) {
        document.getElementById('line-' + i).classList.toggle('done', i < current);
    }
}

function initAutocomplete() {
    const input = document.getElementById('businessInput');
    const list = document.getElementById('autocompleteList');
    let focusedIndex = -1;

    function renderList(items) {
        if (!items.length) { list.classList.remove('open'); return; }
        list.innerHTML = items.map((item, i) =>
            `<div class="autocomplete-item" data-value="${item.label}" data-inmo="${item.isInmo || false}">
                ${item.label}${item.isInmo ? '' : ''}
            </div>`
        ).join('');
        list.classList.add('open');
        focusedIndex = -1;

        list.querySelectorAll('.autocomplete-item').forEach((el, i) => {
            el.addEventListener('click', () => {
                input.value = el.dataset.value;
                state.businessInput = el.dataset.value;
                state.isInmo = el.dataset.inmo === 'true';
                list.classList.remove('open');
            });
            el.addEventListener('mouseenter', () => {
                list.querySelectorAll('.autocomplete-item').forEach(e => e.classList.remove('focused'));
                el.classList.add('focused');
                focusedIndex = i;
            });
        });
    }

    input.addEventListener('input', () => {
        const val = input.value.toLowerCase().trim();
        state.businessInput = input.value;
        state.isInmo = false;
        if (!val) { renderList(BUSINESS_TYPES); return; }
        const filtered = BUSINESS_TYPES.filter(t => t.label.toLowerCase().includes(val));
        renderList(filtered);
    });

    input.addEventListener('focus', () => {
        setTimeout(() => {
            const val = input.value.toLowerCase().trim();
            if (!val) { renderList(BUSINESS_TYPES); return; }
            const filtered = BUSINESS_TYPES.filter(t => t.label.toLowerCase().includes(val));
            renderList(filtered);
        }, 60);
    });

    input.addEventListener('touchstart', () => {
        setTimeout(() => {
            const val = input.value.toLowerCase().trim();
            if (!val) { renderList(BUSINESS_TYPES); return; }
            const filtered = BUSINESS_TYPES.filter(t => t.label.toLowerCase().includes(val));
            renderList(filtered);
        }, 60);
    }, { passive: true });

    input.addEventListener('keydown', (e) => {
        const items = list.querySelectorAll('.autocomplete-item');
        if (!items.length) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); focusedIndex = Math.min(focusedIndex + 1, items.length - 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); focusedIndex = Math.max(focusedIndex - 1, 0); }
        else if (e.key === 'Enter' && focusedIndex >= 0) { e.preventDefault(); items[focusedIndex].click(); return; }
        else if (e.key === 'Escape') { list.classList.remove('open'); return; }
        items.forEach((el, i) => el.classList.toggle('focused', i === focusedIndex));
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !list.contains(e.target)) list.classList.remove('open');
    });

    document.addEventListener('touchstart', (e) => {
        if (!input.contains(e.target) && !list.contains(e.target)) list.classList.remove('open');
    }, { passive: true });
}

function initPills(containerId, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            pill.classList.toggle('selected');
            const val = pill.dataset.value;
            if (pill.classList.contains('selected')) {
                if (!state[stateKey].includes(val)) state[stateKey].push(val);
            } else {
                state[stateKey] = state[stateKey].filter(v => v !== val);
            }
            updateLiveBudget();
        });
    });
}

// Selección híbrida del paso 2 (02-ago-2026, ampliada 03-ago-2026): "Mostrar servicios"
// es independiente y se combina con cualquiera de las otras opciones — un ecommerce
// o una plataforma de cursos también puede ofrecer servicios. "Productos y venta
// online" y "Cursos o institución educativa (LMS)" son excluyentes ENTRE SÍ (son
// construcciones distintas con precio propio, no tiene sentido combinarlas en una
// sola cotización). "Quiero algo diferente" es exclusivo de todo lo demás: al
// elegirlo se apaga cualquier otra pill, y elegir cualquier otra pill lo apaga a él.
const EXCLUSIVE_CORE_PILLS = ['vender-online', 'cursos-lms'];

function initObjetivoPills() {
    const container = document.getElementById('obj-pills');
    if (!container) return;
    const getPill = v => container.querySelector(`.pill[data-value="${v}"]`);
    const customObjWrap   = document.getElementById('customObjWrap');
    const next2Btn        = document.getElementById('next2');

    container.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const val = pill.dataset.value;
            const wasSelected = pill.classList.contains('selected');

            if (val === 'otro') {
                container.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
                if (!wasSelected) pill.classList.add('selected');
            } else {
                getPill('otro')?.classList.remove('selected');
                if (EXCLUSIVE_CORE_PILLS.includes(val)) {
                    EXCLUSIVE_CORE_PILLS.filter(v => v !== val).forEach(v => getPill(v)?.classList.remove('selected'));
                }
                pill.classList.toggle('selected', !wasSelected);
            }

            // Única fuente de verdad: el DOM. state.objectives se recalcula
            // entero a partir de qué pills quedaron .selected — evita bugs de
            // ir empujando/filtrando el array a mano en cada rama de arriba.
            state.objectives = [...container.querySelectorAll('.pill.selected')].map(p => p.dataset.value);

            const isOtro = state.objectives.includes('otro');
            if (customObjWrap) customObjWrap.classList.toggle('visible', isOtro);
            if (next2Btn) next2Btn.style.display = isOtro ? 'none' : '';
            if (isOtro) updateCustomObjWsp();
            updateLiveBudget();
        });
    });
}

// "Quiero algo diferente": no tiene precio ni paso 3 — el texto que escribe
// se arma en un mensaje de WhatsApp, actualizado en cada tecla.
function updateCustomObjWsp() {
    const link = document.getElementById('customObjWspLink');
    if (!link) return;
    const texto = document.getElementById('customObjTexto')?.value.trim() || '';
    const rubro = state.businessInput ? ` para ${state.businessInput}` : '';
    const msg = `Hola! Quiero algo diferente a las opciones estándar${rubro}.` + (texto ? ` ${texto}` : ' ¿Podemos hablar?');
    link.href = wspLink(msg);
}

/* Mensaje que se abre al confirmar la muestra gratis: le llega a Pablo con todo
   lo que el cliente ya eligió, así no tiene que ir a buscarlo al admin para
   arrancar la conversación. */
function mensajeMuestraWsp(nombreNegocio) {
    const lineas = [`Hola! Acabo de pedir mi muestra gratis 🎨`, ''];
    lineas.push(`🏢 Negocio: ${nombreNegocio}`);
    if (state.businessInput) lineas.push(`📌 Rubro: ${state.businessInput}`);
    if (TYPE_NAMES[state.siteType]) lineas.push(`🌐 Tipo de web: ${TYPE_NAMES[state.siteType]}`);
    // Dos líneas y nunca un total (15-sep-2026): el pago único y el servicio
    // mensual son dos formas de contratar la misma web.
    if (state.sinPrecio) {
        lineas.push(`💰 Precio: a coordinar`);
    } else {
        lineas.push(`💰 Pago único: ${fmt(state.precioUnico)} (seña de ${fmt(state.sena)})`);
        lineas.push(`💰 Servicio mensual: ${fmt(state.mensualidad)}/mes`);
    }
    lineas.push('', 'Gracias!');
    return lineas.join('\n');
}

// Compartido entre getSiteType(), renderStep3Context() y el salto de paso 1→3:
// antes cada uno tenía su propia copia de inmoKeywords y podían desincronizarse.
const INMO_KEYWORDS = ['inmobiliaria', 'inmobili', 'propiedad', 'bienes ra', 'agente inmo', 'alquiler'];
function checkIsInmo() {
    return state.isInmo || INMO_KEYWORDS.some(k => state.businessInput.toLowerCase().includes(k));
}

function getSiteType() {
    if (checkIsInmo()) return 'inmobiliaria';
    if (state.objectives.includes('cursos-lms')) return 'elearning';
    const ecomObj = ['vender-online'];
    if (state.objectives.some(o => ecomObj.includes(o))) return 'ecommerce';
    return 'landing';
}

/* Modelo comercial (15-sep-2026): la misma web se contrata de dos formas, y
   ninguna es "mejor" que la otra.
   · Pago único: una seña para arrancar y el saldo al entregar la web. La seña
     se cobra con Checkout Pro y el monto lo recalcula server-side
     api/crear-preferencia.php a partir del siteType: SENA tiene que coincidir
     con lo que hay ahí y con SENA de exito.html.
   · Servicio mensual: suscripción de Mercado Pago, sin pago inicial; con la
     primera mensualidad armamos la web. MENSUALIDAD tiene que coincidir con el
     monto de los dos planes de Mercado Pago y con MENSUALIDAD de exito.html.
   Son montos que nunca se suman entre sí. Clave 'landing' = sitio profesional. */
const PRECIO_UNICO = { landing: 180000, ecommerce: 290000, inmobiliaria: 240000, elearning: 290000 };
const SENA         = { landing: 40000,  ecommerce: 60000,  inmobiliaria: 60000,  elearning: 60000 };
const MENSUALIDAD  = { landing: 20000,  ecommerce: 30000,  inmobiliaria: 30000,  elearning: 30000 };
const SUSCRIPCION_20K = 'https://mpago.la/1pfejMG';
const SUSCRIPCION_30K = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=36a67a7e42e7404989beb99703a0569b';
const SUSCRIPCION_LINK = { landing: SUSCRIPCION_20K, ecommerce: SUSCRIPCION_30K, inmobiliaria: SUSCRIPCION_30K, elearning: SUSCRIPCION_30K };

// Centralizado acá porque renderStep3Context(), updateLiveBudget(),
// renderResult() y handlePayment() necesitan los mismos montos y el mismo link.
// `sinPrecio` queda por compatibilidad con el admin (siempre false: todos los
// tipos tienen precio fijo).
function getPlanInfo(type) {
    const precioUnico = PRECIO_UNICO[type] || 0;
    const sena        = SENA[type] || 0;
    return {
        precioUnico,
        sena,
        saldo: Math.max(precioUnico - sena, 0),
        mensualidad: MENSUALIDAD[type] || 0,
        linkSuscripcion: SUSCRIPCION_LINK[type],
        sinPrecio: false
    };
}

function updateLiveBudget() {
    const bubble = document.getElementById('liveBudget');
    if (!bubble) return;

    const visibleStep = document.querySelector('.step-card.active');
    const stepId = visibleStep ? visibleStep.id : '';
    const shouldShow = stepId === 'step-3' && (state.objectives.length || checkIsInmo());

    if (!shouldShow) {
        bubble.classList.remove('visible', 'bump');
        return;
    }

    const type = getSiteType();
    const { precioUnico, mensualidad } = getPlanInfo(type);

    // Los dos montos con el mismo peso y nunca sumados: pago único o por mes.
    const unicoEl = document.getElementById('liveBudgetUnico');
    const mensualEl = document.getElementById('liveBudgetMensual');
    if (unicoEl) unicoEl.textContent = fmt(precioUnico);
    if (mensualEl) mensualEl.textContent = fmt(mensualidad);

    bubble.classList.add('visible');
    bubble.classList.remove('bump');
    void bubble.offsetWidth;
    bubble.classList.add('bump');
}

function renderResult() {
    const type = getSiteType();
    state.siteType = type;

    const { precioUnico, sena, saldo, mensualidad, sinPrecio } = getPlanInfo(type);
    /* Dos formas de contratar la misma web (15-sep-2026). Campos que lee el
       admin: precioUnico, sena, saldo, mensualidad y modalidad; totalPrice y
       basePrice valen el precio único y nunca pueden quedar en 0 con precio
       real, porque el admin toma totalPrice 0 como "a cotizar". La modalidad
       queda en '' hasta que toca un botón del checkout. primerPago es del
       modelo del 10 al 14-sep: siempre 0. */
    state.precioUnico = sinPrecio ? 0 : precioUnico;
    state.sena        = sinPrecio ? 0 : sena;
    state.saldo       = sinPrecio ? 0 : saldo;
    state.mensualidad = sinPrecio ? 0 : mensualidad;
    state.modalidad   = '';
    state.primerPago  = 0;
    state.basePrice   = state.precioUnico;
    state.extrasPrice = 0;
    state.totalPrice  = state.precioUnico;
    state.extras      = [];
    state.sinPrecio   = sinPrecio;

    const badge = document.getElementById('typeBadge');
    badge.className = 'result-type-badge ' + TYPE_BADGE_CLASSES[type];
    badge.textContent = TYPE_NAMES[type];

    // Dos filas del mismo peso: pago único y servicio mensual. Nunca un total.
    const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setT('pricePagoUnico',        sinPrecio ? 'A coordinar' : fmt(precioUnico));
    setT('pricePagoUnicoDetalle', sinPrecio ? 'seña y saldo al entregar la web' : `seña de ${fmt(sena)} y saldo de ${fmt(saldo)} al entregar la web`);
    setT('priceMensual',          sinPrecio ? 'A coordinar' : `${fmt(mensualidad)}/mes`);

    const includesList = document.getElementById('includesList');
    const items = INCLUDES[type] || INCLUDES.landing;
    includesList.innerHTML = items.map(i => `<li class="include-item"><span class="check">✓</span><span><span class="inc-label">${i}</span></span></li>`).join('');

    const qData = QUE_ES_DATA[type] || QUE_ES_DATA.landing;
    const btnLabel = document.getElementById('btnQueEsLabel');
    if (btnLabel) btnLabel.textContent = qData.title;
    document.getElementById('queEsIcon').textContent  = qData.icon;
    document.getElementById('queEsTitle').textContent = qData.title;
    document.getElementById('queEsBody').textContent  = qData.body;
    document.getElementById('queEsBullets').innerHTML = qData.bullets.map(b =>
        `<div class="que-es-bullet"><span class="que-es-bullet-icon">✓</span><span>${b}</span></div>`
    ).join('');

    setT('summTypeName',       TYPE_NAMES[type]);
    setT('summPagoUnico',      sinPrecio ? 'A coordinar' : fmt(precioUnico));
    setT('summMensualidad',    sinPrecio ? 'A coordinar' : `${fmt(mensualidad)}/mes`);
    setT('btnPaySenaLabel',    etiquetaPagarSena());
    setT('btnPayMensualLabel', etiquetaSuscribirme());

    document.getElementById('resultSection').classList.add('visible');
    document.getElementById('liveBudget')?.classList.remove('visible', 'bump');
    document.documentElement.classList.add('has-result');
    document.getElementById('stepsBar').style.display = 'none';
    document.querySelectorAll('.step-card').forEach(el => el.classList.remove('active'));
    const presHero = document.querySelector('.pres-hero');
    if (presHero) {
        presHero.querySelector('p')?.style.setProperty('display', 'none');
        presHero.style.padding = '5rem 1rem 0';
    }

    // Proyectos similares: renderSimilar() decide sola si hay ejemplos reales
    // para este tipo y muestra/oculta la sección en consecuencia.
    renderSimilar(type);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    _savePresState(5); // guardar estado "resultado visible"
}

function renderSimilar(type) {
    const section = document.getElementById('similarSection');
    // Sin proyectos reales todavía para este tipo (ej. elearning, recién agregado):
    // ocultar la sección en vez de mostrar ejemplos de otro tipo con la etiqueta
    // equivocada — mostraría landing pages como si fueran plataformas LMS reales.
    const projects = SIMILAR_PROJECTS[type];
    if (!projects) { section?.classList.remove('visible'); return; }
    const grid = document.getElementById('similarGrid');
    const sub = document.getElementById('similarSub');
    const names = { landing: 'sitios profesionales', ecommerce: 'e-commerces', inmobiliaria: 'webs inmobiliarias', elearning: 'plataformas LMS' };
    sub.textContent = `Ejemplos de ${names[type] || 'sitios'} que ya desarrollamos.`;
    grid.innerHTML = projects.map(p => `
        <a href="${p.url}" target="_blank" rel="noopener" class="pf-card-mini">
            <div class="pf-mini-visuals">
                <div class="pf-mini-web"><img src="${p.webSrc || `/images/previews/${p.imgId}_web.jpg`}" alt="${p.name}" loading="lazy"></div>
                <div class="pf-mini-phone"><img src="${p.celuSrc || p.webSrc || `/images/previews/${p.imgId}_celu.jpg`}" alt="${p.name} mobile" loading="lazy"></div>
            </div>
            <div class="pf-mini-info">
                <span class="pf-mini-name">${p.name}</span>
                <span class="pf-mini-cta">Ver sitio →</span>
            </div>
        </a>`).join('');
    section?.classList.add('visible');
}

function resetCalculator() {
    // 1. Limpiar estado persistido
    _clearPresState();
    try { localStorage.removeItem('gky_lead_id'); } catch(_) {}

    // 2. Resetear objeto state en memoria
    state.businessInput  = '';
    state.isInmo         = false;
    state.phone          = '';
    state.phonePais      = '+54';
    state.objectives     = [];
    state.functionalities = [];
    state.pages          = '';
    state.siteType       = '';
    state.basePrice      = 0;
    state.extrasPrice    = 0;
    state.totalPrice     = 0;
    state.precioUnico    = 0;
    state.sena           = 0;
    state.saldo          = 0;
    state.mensualidad    = 0;
    state.modalidad      = '';
    state.primerPago     = 0;
    state.sinPrecio      = false;
    state.extras         = [];
    state.clientData     = {};

    // 3. Resetear campos del DOM
    const bi = document.getElementById('businessInput');
    if (bi) bi.value = '';
    document.getElementById('autocompleteList')?.classList.remove('open');
    const tel1 = document.getElementById('step1Tel');
    if (tel1) { tel1.value = ''; tel1.classList.remove('error'); }
    const pais1 = document.getElementById('step1Pais');
    if (pais1) pais1.value = '+54';
    const errTel1 = document.getElementById('err-step1Tel');
    if (errTel1) errTel1.style.display = 'none';

    // 4. Deseleccionar todas las pills
    document.querySelectorAll('.pill.selected').forEach(p => p.classList.remove('selected'));
    document.getElementById('customObjWrap')?.classList.remove('visible');
    const customObjTexto = document.getElementById('customObjTexto');
    if (customObjTexto) customObjTexto.value = '';
    const next2Btn = document.getElementById('next2');
    if (next2Btn) next2Btn.style.display = '';

    // 5. Ocultar secciones del resultado
    document.getElementById('resultSection').classList.remove('visible');
    document.getElementById('similarSection')?.classList.remove('visible');
    document.getElementById('checkoutSection')?.classList.remove('visible');
    document.getElementById('liveBudget')?.classList.remove('visible', 'bump');

    // 6. Restaurar hero y barra de pasos
    document.documentElement.classList.remove('has-result');
    document.getElementById('stepsBar').style.display = '';
    const presHero = document.querySelector('.pres-hero');
    if (presHero) {
        const p = presHero.querySelector('p');
        if (p) p.style.removeProperty('display');
        presHero.style.padding = '';
    }

    // 7. Volver al paso 1
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('step-' + i);
        if (el) el.classList.toggle('active', i === 1);
    }
    updateStepDots(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCheckout() {
    let ok = true;

    const nombre = document.getElementById('cf-nombre').value.trim();
    const errNombre = document.getElementById('err-nombre');
    if (nombre.length < 3) {
        document.getElementById('cf-nombre').classList.add('error');
        errNombre.classList.add('visible'); ok = false;
    } else {
        document.getElementById('cf-nombre').classList.remove('error');
        errNombre.classList.remove('visible');
    }

    const email = document.getElementById('cf-email').value.trim();
    const errEmail = document.getElementById('err-email');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!emailOk) {
        document.getElementById('cf-email').classList.add('error');
        errEmail.classList.add('visible'); ok = false;
    } else {
        document.getElementById('cf-email').classList.remove('error');
        errEmail.classList.remove('visible');
    }

    const tel = document.getElementById('cf-tel').value.replace(/\D/g, '');
    const errTel = document.getElementById('err-tel');
    if (tel.length < 7 || tel.length > 15) {
        document.getElementById('cf-tel').classList.add('error');
        errTel.classList.add('visible'); ok = false;
    } else {
        document.getElementById('cf-tel').classList.remove('error');
        errTel.classList.remove('visible');
    }

    const cuit = document.getElementById('cf-cuit').value.trim();
    const errCuit = document.getElementById('err-cuit');
    if (cuit.length < 7) {
        document.getElementById('cf-cuit').classList.add('error');
        errCuit.classList.add('visible'); ok = false;
    } else {
        document.getElementById('cf-cuit').classList.remove('error');
        errCuit.classList.remove('visible');
    }

    return ok;
}

/* Paso de pago (15-sep-2026): la misma web se contrata de dos formas y el
   checkout tiene un botón para cada una.
   · 'unico'   → la seña del pago único por Checkout Pro: api/crear-preferencia.php
     recalcula la seña a partir del siteType y Mercado Pago vuelve a exito.html
     con payment_id. El saldo se abona al entregar la web, fuera de esta página.
   · 'mensual' → el link de suscripción del plan del tipo de web: $20.000/mes el
     sitio profesional y $30.000/mes el resto. Mercado Pago vuelve a exito.html
     con preapproval_id solo si el plan tiene esa URL de retorno configurada
     (eso se define en el plan, en la cuenta de Mercado Pago, no acá).
   Los datos quedan en `gky_presupuesto` para exito.html, con la modalidad. */
async function handlePayment(modalidad) {
    if (modalidad !== 'unico' && modalidad !== 'mensual') return;
    if (!validateCheckout()) { toast('Completá todos los campos requeridos', 'error'); return; }

    const type = state.siteType || getSiteType();
    const { linkSuscripcion } = getPlanInfo(type);
    if (modalidad === 'mensual' && !linkSuscripcion) {
        toast('No pudimos abrir la suscripción. Escribinos por WhatsApp.', 'error');
        return;
    }

    const nombre  = document.getElementById('cf-nombre').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const pais    = document.getElementById('cf-pais').value;
    const tel     = document.getElementById('cf-tel').value.trim();
    const cuit    = document.getElementById('cf-cuit').value.trim();
    const negocio = document.getElementById('cf-negocio').value.trim();

    const reference = 'GKY-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();

    state.modalidad = modalidad;
    const presupuestoData = {
        reference,
        businessType: state.businessInput,
        isInmo: state.isInmo,
        objectives: state.objectives,
        functionalities: state.functionalities,
        pages: state.pages,
        siteType: type,
        basePrice: state.basePrice,
        extrasPrice: state.extrasPrice,
        totalPrice: state.totalPrice,
        // Los lee exito.html con estos mismos nombres (modalidad, precioUnico,
        // sena, saldo, mensualidad) para pintar la confirmación, guardar en el
        // admin y armar los mails: si se renombran acá, hay que renombrarlos
        // allá en el mismo commit. primerPago va en 0 (modelo del 10 al 14-sep).
        modalidad,
        precioUnico: state.precioUnico,
        sena: state.sena,
        saldo: state.saldo,
        mensualidad: state.mensualidad,
        primerPago: 0,
        extras: state.extras,
        clientData: { nombre, email, telefono: pais + ' ' + tel, cuit, negocio }
    };
    localStorage.setItem('gky_presupuesto', JSON.stringify(presupuestoData));

    if (modalidad === 'mensual') {
        // La navegación es inmediata (no hay fetch de por medio), así que los
        // botones no se deshabilitan: si el cliente vuelve atrás, siguen andando.
        _clearPresState(); // suscripción en curso — borrar borrador
        window.location.href = linkSuscripcion;
        return;
    }

    setPayButtonsBusy(true);
    try {
        const res = await fetch('api/crear-preferencia.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, reference, siteType: type })
        });
        const data = await res.json();
        if (data.init_point) {
            _clearPresState(); // pago en curso — borrar borrador
            window.location.href = data.init_point;
        } else {
            throw new Error(data.message || data.error || 'Error al crear preferencia');
        }
    } catch (err) {
        console.error(err);
        toast('Error al conectar con Mercado Pago. Intentá de nuevo.', 'error');
        setPayButtonsBusy(false);
    }
}

function etiquetaPagarSena() {
    return state.sena ? `Pagar la seña de ${fmt(state.sena)}` : 'Pagar la seña';
}

function etiquetaSuscribirme() {
    return state.mensualidad ? `Suscribirme al servicio de ${fmt(state.mensualidad)} por mes` : 'Suscribirme al servicio mensual';
}

// Mientras se crea la preferencia de la seña los dos botones quedan trabados,
// para que no se abran dos pagos ni se mezcle con la suscripción.
function setPayButtonsBusy(busy) {
    ['btnPaySena', 'btnPayMensual'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = busy;
    });
    const label = document.getElementById('btnPaySenaLabel');
    if (label) label.textContent = busy ? 'Procesando…' : etiquetaPagarSena();
}

function checkFailedPayment() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pago') === 'fallido') {
        toast('El pago no pudo procesarse. Intentá nuevamente.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkFailedPayment();
    _pfOnce('gky_pf_s1', () => _trackFunnel({ step1At: serverTimestamp() })); // "entraron"
    initAutocomplete();
    initObjetivoPills();
    _restorePresState(); // restaurar estado si la pestaña fue descartada por el browser
    updateLiveBudget();

    document.getElementById('customObjTexto')?.addEventListener('input', updateCustomObjWsp);
    document.getElementById('customObjWspLink')?.addEventListener('click', () => {
        _pfOnce('gky_pf_custom', () => _trackFunnel({ customObjAt: serverTimestamp() }));
    });

    document.getElementById('customRequestBtn').addEventListener('click', () => {
        const btn = document.getElementById('customRequestBtn');
        const wsp = document.getElementById('customRequestWsp');
        const link = document.getElementById('customRequestWspLink');
        btn.classList.toggle('selected');
        wsp.classList.toggle('visible');
        if (wsp.classList.contains('visible')) {
            const rubro = state.businessInput ? ` (rubro: ${state.businessInput})` : '';
            const msg = `Hola! Estoy armando mi presupuesto web${rubro} y quiero algo diferente a las opciones estándar, ¿podemos hablar?`;
            link.href = wspLink(msg);
        }
    });

    document.getElementById('next1').addEventListener('click', () => {
        if (!document.getElementById('businessInput').value.trim()) {
            toast('Contanos a qué se dedica tu negocio', 'error'); return;
        }
        // El teléfono es obligatorio y debe contener entre 7 y 15 dígitos.
        const telRaw = document.getElementById('step1Tel').value.replace(/\D/g, '');
        const errTel = document.getElementById('err-step1Tel');
        if (telRaw.length < 7 || telRaw.length > 15) {
            errTel.style.display = 'block';
            document.getElementById('step1Tel').classList.add('error');
            toast('El número ingresado no es válido', 'error');
            return;
        }
        errTel.style.display = 'none';
        document.getElementById('step1Tel').classList.remove('error');
        state.businessInput = document.getElementById('businessInput').value.trim();
        state.phone     = document.getElementById('step1Tel').value.trim();
        state.phonePais = document.getElementById('step1Pais').value;
        _pfOnce('gky_pf_s2', () => _trackFunnel({
            step2At: serverTimestamp(),
            phone: state.phonePais && state.phone ? (state.phonePais + ' ' + state.phone) : (state.phone || ''),
        }));

        // Inmobiliaria ya define el tipo de web por el rubro — el paso 2
        // (objetivo de venta) no aporta nada acá, se saltea directo al paso 3.
        if (checkIsInmo()) {
            state.objectives = [];
            document.querySelectorAll('#obj-pills .pill.selected').forEach(p => p.classList.remove('selected'));
            document.getElementById('customObjWrap')?.classList.remove('visible');
            const next2Btn = document.getElementById('next2');
            if (next2Btn) next2Btn.style.display = '';
            _pfOnce('gky_pf_s3', () => _trackFunnel({ step3At: serverTimestamp() }));
            goToStep(1, 3);
            return;
        }

        goToStep(1, 2);
    });

    document.getElementById('prev2').addEventListener('click', () => goToStep(2, 1));
    document.getElementById('next2').addEventListener('click', () => {
        if (!state.objectives.length) { toast('Elegí al menos un objetivo', 'error'); return; }
        _pfOnce('gky_pf_s3', () => _trackFunnel({ step3At: serverTimestamp() }));
        goToStep(2, 3);
    });

    // Si el paso 2 se salteó (rubro inmobiliario), "Anterior" vuelve directo
    // al paso 1 — el paso 2 nunca se llegó a mostrar para este usuario.
    document.getElementById('prev3').addEventListener('click', () => goToStep(3, checkIsInmo() ? 1 : 2));
    document.getElementById('calcBtn').addEventListener('click', () => {
        renderResult();
        _guardarLead(state); // solo cuando el usuario aprieta "Calcular precio"
        /* ⚠️ `presupuesto_funnel` tiene un allowlist (hasOnly) en firestore.rules:
           un solo campo de más hace que Firestore rechace el update ENTERO. Los
           campos de las dos formas de contratar (precioUnico, sena, saldo y
           modalidad, 15-sep-2026) van en la escritura completa y, si la regla
           todavía no los acepta, _trackFunnel reintenta solo con `permitidos`,
           que ya están en la regla, para no perder el hito. Cualquier otro campo
           nuevo tiene que sumarse ANTES al allowlist.
           El caso "a cotizar" no manda un flag propio: se deduce en el admin de
           totalPrice === 0, que es imposible en un presupuesto real. */
        const permitidos = {
            precioAt:    serverTimestamp(),
            siteType:    state.siteType || '',
            totalPrice:  state.totalPrice || 0, // = precioUnico
            mensualidad: state.mensualidad || 0,
            primerPago:  0,
        };
        _pfOnce('gky_pf_precio', () => _trackFunnel({
            ...permitidos,
            precioUnico: state.precioUnico || 0,
            sena:        state.sena || 0,
            saldo:       state.saldo || 0,
            modalidad:   '',
        }, permitidos));
    });

    document.getElementById('btnResetCalc').addEventListener('click', resetCalculator);

    // Dos botones, uno por forma de contratar: son type="button", así que el
    // form no se envía solo (un Enter en un campo no inicia ningún pago).
    document.getElementById('checkoutForm').addEventListener('submit', (e) => e.preventDefault());
    document.getElementById('btnPaySena')?.addEventListener('click', () => handlePayment('unico'));
    document.getElementById('btnPayMensual')?.addEventListener('click', () => handlePayment('mensual'));
    // Si el cliente vuelve atrás desde Mercado Pago y el navegador restaura la
    // página de la caché, los botones no pueden quedar trabados en "Procesando…".
    window.addEventListener('pageshow', (e) => { if (e.persisted) setPayButtonsBusy(false); });

    // El overlay "¿Cómo trabajamos?" y su modal siguen en el HTML sin tocar,
    // pero ya no tienen botón que los abra (se sacó "¿Cómo trabajamos?" del
    // resultado, 31-jul-2026) — closeCtm queda solo por si ctmCtaBtn se usa.
    const ctmOverlay = document.getElementById('ctmOverlay');
    const closeCtm = () => { ctmOverlay.classList.remove('open'); document.body.style.overflow = ''; };

    document.getElementById('ctmClose').addEventListener('click', closeCtm);
    ctmOverlay.addEventListener('click', (e) => { if (e.target === ctmOverlay) closeCtm(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ctmOverlay.classList.contains('open')) closeCtm(); });


    const queEsOverlay = document.getElementById('queEsOverlay');
    const openQueEs  = () => { queEsOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeQueEs = () => { queEsOverlay.classList.remove('open'); document.body.style.overflow = ''; };

    document.getElementById('btnQueEs').addEventListener('click', openQueEs);
    document.getElementById('queEsClose').addEventListener('click', closeQueEs);
    queEsOverlay.addEventListener('click', (e) => { if (e.target === queEsOverlay) closeQueEs(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && queEsOverlay.classList.contains('open')) closeQueEs(); });

    const muestraOverlay = document.getElementById('muestraOverlay');
    const openMuestra  = () => { muestraOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeMuestra = () => { muestraOverlay.classList.remove('open'); document.body.style.overflow = ''; };

    document.getElementById('btnMuestraGratis')?.addEventListener('click', () => {
        openMuestra();
        _pfOnce('gky_pf_muestra', () => _trackFunnel({ muestraAt: serverTimestamp() }));
    });
    document.getElementById('muestraClose')?.addEventListener('click', closeMuestra);
    muestraOverlay.addEventListener('click', (e) => { if (e.target === muestraOverlay) closeMuestra(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && muestraOverlay.classList.contains('open')) closeMuestra(); });

    document.getElementById('muestraForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombreEl = document.getElementById('muestraNombreNegocio');
        const nombreNegocio = nombreEl.value.trim();
        const errNombre = document.getElementById('err-muestraNombreNegocio');
        if (nombreNegocio.length < 2) {
            nombreEl.classList.add('error');
            errNombre.classList.add('visible');
            nombreEl.focus();
            return;
        }
        nombreEl.classList.remove('error');
        errNombre.classList.remove('visible');

        const notasEl = document.getElementById('muestraNotas');
        const notas = notasEl.value.trim();
        const errNotas = document.getElementById('err-muestraNotas');
        if (notas.length < 4) {
            notasEl.classList.add('error');
            errNotas.classList.add('visible');
            return;
        }
        notasEl.classList.remove('error');
        errNotas.classList.remove('visible');

        const colorPrincipal  = document.getElementById('muestraColorPrincipal').value;
        const colorSecundario = document.getElementById('muestraColorSecundario').value;
        const colorFondos     = document.getElementById('muestraColorFondos').value;

        const btn = document.getElementById('btnMuestraConfirm');
        btn.disabled = true;
        btn.textContent = 'Enviando…';

        const ok = await _guardarBoceto(nombreNegocio, colorPrincipal, colorSecundario, colorFondos, notas);

        if (ok) {
            _pfOnce('gky_pf_confirmo', () => _trackFunnel({ confirmoAt: serverTimestamp() }));

            /* El boceto ya quedó guardado en Firestore: WhatsApp es un extra para
               abrir la conversación, nunca el único canal. Por eso el link SIEMPRE
               se muestra como botón — el window.open() automático es best-effort y
               el navegador lo bloquea seguido, porque el await de arriba ya rompió
               la cadena directa con el click del usuario. */
            const url = wspLink(mensajeMuestraWsp(nombreNegocio));
            window.open(url, '_blank', 'noopener');

            const modal = document.getElementById('muestraModal');
            modal.innerHTML = `
                <div class="muestra-success">
                    <div class="muestra-success-icon">✅</div>
                    <h3>¡Listo! Ya arrancamos con tu boceto</h3>
                    <p>La demo te llega en menos de 24 horas y queda disponible 5 días, por una cuestión de espacio. Te estamos abriendo WhatsApp con todos los datos cargados: si no se abrió solo, tocá el botón de acá abajo.</p>
                    <a class="btn-wsp" id="muestraSuccessWsp" href="${url}" target="_blank" rel="noopener" style="display:inline-flex;margin-bottom:0.9rem">💬 Abrir WhatsApp</a>
                    <button type="button" class="btn-muestra-confirm" id="muestraSuccessClose" style="margin-top:0">Volver al presupuesto</button>
                </div>`;
            document.getElementById('muestraSuccessClose').addEventListener('click', closeMuestra);
        } else {
            toast('No pudimos enviar tu info. Escribinos por WhatsApp.', 'error');
            btn.disabled = false;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M20 6L9 17l-5-5"/></svg>
                Confirmar y crear mi boceto`;
        }
    });

    document.getElementById('ctmCtaBtn').addEventListener('click', () => {
        closeCtm();
        document.getElementById('checkoutSection').classList.add('visible');
        setTimeout(() => {
            document.getElementById('checkoutSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 320);
    });
});
