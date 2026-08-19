// Lógica principal de la app — cronómetro general, categorías, proyectos, finalizar día
import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
    doc, setDoc, updateDoc, deleteDoc, deleteField, addDoc, collection,
    onSnapshot, query, orderBy, serverTimestamp, writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { formatTime, escHtml, getDateKey, getDisplayDateLabel, toast, roundSecondsToQuarterHour } from './utils.js';
import { initCalendar, refreshCalendar, setCalendarTaskTypes } from './calendar.js';

const $ = id => document.getElementById(id);

let categories = [];
let taskTypeCategories = [];
let projects = [];
let dayData = null;
let unsubscribeToday = null;
let currentDateKey = getDateKey();
const syncedCompletedProjects = new Set();
const DEFAULT_TASK_TYPES = ['CP', 'PT', 'O'];
let seededDefaultTaskTypes = false;

const defaultDay = () => ({
    date: getDateKey(),
    generalSeconds: 0,
    generalRunning: false,
    generalStartedAt: null,
    projects: {},
    finalized: false,
    finalizedAt: null,
});

function buildDaySnapshot(now = Date.now()) {
    const projectsSnapshot = {};
    let projectTotalSeconds = 0;

    Object.entries(dayData?.projects || {}).forEach(([id, p]) => {
        if (!p.completed) return;
        projectsSnapshot[id] = {
            ...p,
            running: false,
            startedAt: null,
        };
        // El snapshot guarda p.seconds crudo (arriba, sin tocar); el total del
        // día sí suma la versión redondeada, para que quede consistente con
        // lo que ya se vio en vivo mientras la task estaba completada.
        projectTotalSeconds += roundSecondsToQuarterHour(p.seconds || 0);
    });

    projects.forEach(p => {
        if (p.completed || p.active === false) return;
        const pState = dayData?.projects?.[p.id];
        if (pState?.completed) return;
        let seconds = pState?.seconds || 0;
        if (pState?.running && pState.startedAt) seconds += (now - pState.startedAt) / 1000;
        if (!pState && seconds <= 0) return;
        projectTotalSeconds += seconds;
const hasDayCategory = pState && Object.prototype.hasOwnProperty.call(pState, 'categoryId');
const currentCategoryId = hasDayCategory ? (pState.categoryId || null) : (p.categoryId || null);
const cat = categories.find(c => c.id === currentCategoryId);
const currentTipo = pState?.tipo || p.tipo || null;
const currentComment = pState?.comment || p.comment || null;

projectsSnapshot[p.id] = {
    seconds,
    running: false,
    startedAt: null,
    name: pState?.name || p.name,
    categoryId: currentCategoryId,
    categoryName: cat ? cat.name : null,
    completed: false,
    completedAt: null,
    ...(currentTipo ? { tipo: currentTipo } : {}),
    ...(currentComment ? { comment: currentComment } : {}),
};
    });

    return { projectsSnapshot, projectTotalSeconds };
}

// ══════════════════════════════
//   AUTH GUARD
// ══════════════════════════════
onAuthStateChanged(auth, user => {
    if (!user) { window.location.href = '../index.html'; return; }
    $('userEmail').textContent = user.email;
    $('appShell').hidden = false;
    initApp(user.uid);
});

$('logoutBtn').addEventListener('click', () => signOut(auth));

// ══════════════════════════════
//   TABS
// ══════════════════════════════
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        $('tab-' + btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'calendario') refreshCalendar();
    });
});

// ══════════════════════════════
//   INIT
// ══════════════════════════════
function initApp(uid) {
    listenCategories(uid);
    listenTaskTypeCategories(uid);
    listenProjects(uid);
    listenToday(uid);
    setupAddCategory(uid);
    setupAddTaskTypeCategory(uid);
    setupAddProject(uid);
    setupTaskComment();
    setupGeneralTimer(uid);
    setupFinishDay(uid);
    setupTasksDragScroll();
    setupProjectsPanelToggle();
    initCalendar(uid);
    setInterval(renderTimers, 1000);
    setInterval(() => checkDayRollover(uid), 30000);
    setupPauseReminder();
    setupNotificationPermission();
}

// ══════════════════════════════
//   RECORDATORIO DE PAUSA
//   Avisa (sonido + notificación) si el reloj general queda en pausa
//   mientras seguís usando la PC — para que no te olvides de darle play.
// ══════════════════════════════
const PAUSE_REMINDER = {
    thresholdMs: 2 * 60 * 1000,   // cuánto tiempo pausado+activo antes de avisar
    reAlertMs:   2 * 60 * 1000,   // cada cuánto vuelve a maullar si seguís sin play
    pausedActiveSince: null,
    lastAlert: 0,
    active: true,                 // ¿el usuario está activo? (idle API o actividad in-tab)
    screenUnlocked: true,         // ¿la pantalla está desbloqueada?
    idleAvailable: false,         // ¿está andando la Idle Detection API?
};
let _lastInTabActivity = Date.now();
let _idleDetector = null;
let _audioCtx = null;
let _meowAudio = null;   // ping real (mp3); si falla, cae al maullido sintetizado
const PING_VOLUME = 0.3; // más bajo que el default
const MEOW_SRC = new URL('../ping.mp3', import.meta.url).href;

function setupPauseReminder() {
    // Desbloquear audio y pedir permisos en el primer gesto del usuario
    const onFirstGesture = async () => {
        _unlockAudio();
        _prepareMeow();
        if ('Notification' in window && Notification.permission === 'default') {
            try { await Notification.requestPermission(); } catch (_) {}
            refreshNotifBtn();
        }
        _setupIdleDetector();
        window.removeEventListener('pointerdown', onFirstGesture);
        window.removeEventListener('keydown', onFirstGesture);
    };
    window.addEventListener('pointerdown', onFirstGesture);
    window.addEventListener('keydown', onFirstGesture);

    // Fallback: actividad dentro de la pestaña de Cromor
    ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel'].forEach(ev =>
        window.addEventListener(ev, () => { _lastInTabActivity = Date.now(); }, { passive: true }));

    setInterval(_updateActivityAndCheck, 15000);
    document.addEventListener('visibilitychange', _updateActivityAndCheck);

    // Botones del popup de recordatorio
    $('pausePopupDismiss')?.addEventListener('click', _hidePausePopup);
    $('pausePopupPlay')?.addEventListener('click', () => {
        _hidePausePopup();
        if (dayData && !dayData.generalRunning) $('generalToggleBtn')?.click();
    });
}

// ══════════════════════════════
//   PERMISO DE NOTIFICACIONES
//   Botón explícito (en vez de depender solo del gesto invisible) para que el
//   aviso de pausa se muestre como notificación real del sistema operativo,
//   visible aunque no estés mirando esta pestaña.
// ══════════════════════════════
function refreshNotifBtn() {
    const btn = $('notifPermBtn');
    if (!btn || !('Notification' in window)) { if (btn) btn.hidden = true; return; }

    const perm = Notification.permission;

    if (perm === 'granted') {
        btn.hidden = true;
        return;
    }

    btn.hidden = false;

    if (perm === 'denied') {
        btn.textContent = '🔕 Notificaciones bloqueadas';
        btn.title = 'Las bloqueaste antes — activalas desde la configuración del navegador';
    } else {
        btn.textContent = '🔔 Activar notificaciones';
        btn.title = 'Para que el aviso de pausa aparezca aunque no estés mirando esta pestaña';
    }
}

function setupNotificationPermission() {
    const btn = $('notifPermBtn');
    if (!btn || !('Notification' in window)) { if (btn) btn.hidden = true; return; }

    btn.addEventListener('click', async () => {
        if (Notification.permission === 'denied') {
            toast('Ya bloqueaste las notificaciones. Para activarlas: hacé clic en el candado/ícono de sitio en la barra de direcciones → Notificaciones → Permitir, y recargá la página.', 'info');
            return;
        }
        try {
            const result = await Notification.requestPermission();
            refreshNotifBtn();
            if (result === 'granted') toast('Notificaciones activadas — el aviso de pausa va a aparecer como ventana del sistema', 'success');
            else if (result === 'denied') toast('No se activaron las notificaciones', 'error');
        } catch (_) {}
    });

    refreshNotifBtn();
}

function _unlockAudio() {
    try {
        if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (_audioCtx.state === 'suspended') _audioCtx.resume();
    } catch (_) {}
}

// Arma el grafo del maullido (~1s) en el contexto dado (sirve online y offline)
function _buildMeow(ctx, t0, dur) {
    // Voz: onda rica en armónicos con el contorno de un "miau" (sube y baja de tono)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, t0);
    osc.frequency.linearRampToValueAtTime(900, t0 + 0.18);
    osc.frequency.setValueAtTime(870, t0 + 0.38);
    osc.frequency.linearRampToValueAtTime(430, t0 + dur);

    // Vibrato (le da naturalidad al maullido)
    const vib = ctx.createOscillator();
    vib.frequency.value = 12;
    const vibGain = ctx.createGain();
    vibGain.gain.value = 22;
    vib.connect(vibGain).connect(osc.frequency);

    // Filtro tipo formante: imita la boca que se abre y se cierra
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(700, t0);
    filter.frequency.linearRampToValueAtTime(1600, t0 + 0.25);
    filter.frequency.linearRampToValueAtTime(600, t0 + dur);

    // Envolvente de volumen (bajo, como el ping)
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.2, t0 + 0.06);
    gain.gain.setValueAtTime(0.2, t0 + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
    vib.start(t0);
    vib.stop(t0 + dur + 0.02);
}

// Prepara el maullido: primero el mp3 real; si no carga, respaldo sintetizado
async function _prepareMeow() {
    if (_meowAudio) return;
    try {
        const real = new Audio(MEOW_SRC);
        real.preload = 'auto';
        real.volume = PING_VOLUME;
        real.addEventListener('error', () => { _meowAudio = null; _prepareSynthMeow(); }, { once: true });
        real.load();
        _meowAudio = real;
        return;
    } catch (_) {}
    _prepareSynthMeow();
}

// Respaldo: pre-renderiza el maullido sintetizado a un archivo en memoria
async function _prepareSynthMeow() {
    if (_meowAudio) return;
    try {
        const Off = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!Off) return;
        const sr = 44100, dur = 1.0;
        const off = new Off(1, Math.ceil(sr * (dur + 0.06)), sr);
        _buildMeow(off, 0, dur);
        const buffer = await off.startRendering();
        _meowAudio = new Audio();
        _meowAudio.src = URL.createObjectURL(_wavBlob(buffer));
        _meowAudio.preload = 'auto';
        _meowAudio.volume = PING_VOLUME;
    } catch (_) {}
}

// Codifica un AudioBuffer mono a un Blob WAV (PCM 16-bit)
function _wavBlob(buffer) {
    const sr = buffer.sampleRate;
    const samples = buffer.getChannelData(0);
    const dataLen = samples.length * 2;
    const view = new DataView(new ArrayBuffer(44 + dataLen));
    const wStr = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
    wStr(0, 'RIFF');
    view.setUint32(4, 36 + dataLen, true);
    wStr(8, 'WAVE');
    wStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    wStr(36, 'data');
    view.setUint32(40, dataLen, true);
    let o = 44;
    for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        o += 2;
    }
    return new Blob([view.buffer], { type: 'audio/wav' });
}

function _playMeow() {
    // Preferido: reproducir el archivo (suena en segundo plano como un reproductor de música)
    if (_meowAudio) {
        try { _meowAudio.volume = PING_VOLUME; _meowAudio.currentTime = 0; _meowAudio.play(); return; } catch (_) {}
    }
    // Respaldo: síntesis en vivo (solo suena bien con la pestaña activa)
    if (!_audioCtx) return;
    try {
        if (_audioCtx.state === 'suspended') _audioCtx.resume();
        _buildMeow(_audioCtx, _audioCtx.currentTime, 1.0);
    } catch (_) {}
}

async function _setupIdleDetector() {
    if (_idleDetector || !('IdleDetector' in window)) return;
    try {
        const perm = await IdleDetector.requestPermission();
        if (perm !== 'granted') return;
        const detector = new IdleDetector();
        detector.addEventListener('change', () => {
            PAUSE_REMINDER.active = detector.userState === 'active';
            PAUSE_REMINDER.screenUnlocked = detector.screenState === 'unlocked';
            _checkPauseReminder();
        });
        await detector.start({ threshold: 60000 });
        _idleDetector = detector;
        PAUSE_REMINDER.idleAvailable = true;
        PAUSE_REMINDER.active = detector.userState === 'active';
        PAUSE_REMINDER.screenUnlocked = detector.screenState === 'unlocked';
    } catch (_) {
        // No disponible o permiso denegado → queda el fallback in-tab
    }
}

function _updateActivityAndCheck() {
    if (!PAUSE_REMINDER.idleAvailable) {
        const visible = document.visibilityState === 'visible';
        PAUSE_REMINDER.active = visible && (Date.now() - _lastInTabActivity < 60000);
        PAUSE_REMINDER.screenUnlocked = true;
    }
    _checkPauseReminder();
}

function _checkPauseReminder() {
    const now = Date.now();
    const paused = dayData && !dayData.generalRunning && !dayData.finalized;
    const userActive = PAUSE_REMINDER.active && PAUSE_REMINDER.screenUnlocked;

    // Play puesto (o día finalizado) → se apaga todo hasta la próxima pausa
    if (!paused) {
        PAUSE_REMINDER.pausedActiveSince = null;
        PAUSE_REMINDER.lastAlert = 0;
        _hidePausePopup();
        return;
    }

    // Pausado pero sin actividad: no maullar (no hay nadie en la PC), pero si ya
    // maulló NO se resetea — al volver a la compu el recordatorio sigue donde estaba.
    if (!userActive) {
        if (!PAUSE_REMINDER.lastAlert) PAUSE_REMINDER.pausedActiveSince = null;
        return;
    }

    // Ya maulló al menos una vez: vuelve a maullar cada reAlertMs mientras siga sin play
    if (PAUSE_REMINDER.lastAlert) {
        if (now - PAUSE_REMINDER.lastAlert >= PAUSE_REMINDER.reAlertMs) {
            _firePauseReminder();
            PAUSE_REMINDER.lastAlert = now;
        }
        return;
    }

    // Todavía no maulló: espera thresholdMs de pausa + actividad continua
    if (!PAUSE_REMINDER.pausedActiveSince) PAUSE_REMINDER.pausedActiveSince = now;
    if (now - PAUSE_REMINDER.pausedActiveSince >= PAUSE_REMINDER.thresholdMs) {
        _firePauseReminder();
        PAUSE_REMINDER.lastAlert = now;
    }
}

function _firePauseReminder() {
    _playMeow();
    _showPausePopup();
    try { toast('⏸ El reloj general está en pausa — ¿te olvidaste de darle play?'); } catch (_) {}
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            const n = new Notification('Cromor — reloj en pausa ⏸', {
                body: 'Seguís usando la compu y el reloj general está parado. Dale play para no perder el tiempo.',
                tag: 'cromor-pause-reminder',
                renotify: true,
                silent: true,   // el sonido lo pone el ping, no el sistema
            });
            n.onclick = () => { window.focus(); n.close(); };
        } catch (_) {}
    }
}

// Popup dentro de la página: una ventanita visible aunque no haya permiso de notificaciones.
function _showPausePopup() {
    const el = $('pausePopup');
    if (el) el.hidden = false;
}

function _hidePausePopup() {
    const el = $('pausePopup');
    if (el) el.hidden = true;
}

function getTaskTypeNames() {
    const names = [
        ...(taskTypeCategories.length ? [] : DEFAULT_TASK_TYPES),
        ...taskTypeCategories.map(c => c.name),
        ...projects.map(p => p.tipo).filter(Boolean),
        ...Object.values(dayData?.projects || {}).map(p => p.tipo).filter(Boolean),
    ];

    return [...new Set(names.map(name => String(name).trim()).filter(Boolean))];
}

function renderTaskTypeSelect(selected = '') {
    const options = [
        '<option value="">Sin categoría</option>',
        ...getTaskTypeNames().map(name => `<option value="${escAttr(name)}" ${name === selected ? 'selected' : ''}>${escHtml(name)}</option>`),
    ].join('');

    return options;
}

function syncTaskTypesForCalendar() {
    setCalendarTaskTypes(getTaskTypeNames());
}

// ══════════════════════════════
//   CAMBIO DE DIA
// ══════════════════════════════
async function checkDayRollover(uid) {
    const newKey = getDateKey();
    if (newKey !== currentDateKey) {
        await finalizeDaySnapshot(uid, currentDateKey);
        if (unsubscribeToday) unsubscribeToday();
        listenToday(uid);
        refreshCalendar();
    }
}

async function finalizeDaySnapshot(uid, dateKey) {
    if (!dayData) return;
    const now = Date.now();
    const updates = { finalized: true, finalizedAt: serverTimestamp() };

    if (dayData.generalRunning && dayData.generalStartedAt) {
        updates.generalSeconds = (dayData.generalSeconds || 0) + (now - dayData.generalStartedAt) / 1000;
        updates.generalRunning = false;
        updates.generalStartedAt = null;
    }

    const { projectsSnapshot, projectTotalSeconds } = buildDaySnapshot(now);
    updates.projects = projectsSnapshot;
    updates.generalSeconds = Math.max(updates.generalSeconds ?? (dayData.generalSeconds || 0), projectTotalSeconds);

    await updateDoc(doc(db, 'users', uid, 'days', dateKey), updates);
}

function syncCompletedProjectsToGlobal(uid) {
    if (!dayData?.projects) return;

    Object.entries(dayData.projects).forEach(([projId, p]) => {
        if (!p.completed) return;

        const syncKey = `${currentDateKey}:${projId}`;
        if (syncedCompletedProjects.has(syncKey)) return;

        syncedCompletedProjects.add(syncKey);

        updateDoc(doc(db, 'users', uid, 'projects', projId), {
            completed: true,
            completedAt: serverTimestamp(),
            completedDate: currentDateKey,
            active: false,
        }).catch(err => {
            syncedCompletedProjects.delete(syncKey);
            console.error(err);
        });
    });
}

// ══════════════════════════════
//   SCROLL HORIZONTAL CON DRAG
// ══════════════════════════════
function setupTasksDragScroll() {
    const el = document.querySelector('.hoy-col--tasks');
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    el.addEventListener('mousedown', e => {
        isDown = true;
        moved = false;
        startX = e.pageX;
        startScroll = el.scrollLeft;
    });

    window.addEventListener('mousemove', e => {
        if (!isDown) return;
        const delta = e.pageX - startX;
        if (Math.abs(delta) > 3) moved = true;
        el.scrollLeft = startScroll - delta;
        el.classList.add('is-dragging');
    });

    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        el.classList.remove('is-dragging');
    });

    el.addEventListener('click', e => {
        if (moved) e.stopPropagation();
    }, true);
}

// ══════════════════════════════
//   CATEGORÍAS
// ══════════════════════════════
function setupProjectsPanelToggle() {
    const panel = $('projectsPanel');
    const btn = $('projectsPanelToggle');
    if (!panel || !btn) return;

    const applyState = collapsed => {
        panel.classList.toggle('is-collapsed', collapsed);
        btn.textContent = collapsed ? '+' : '−';
        btn.setAttribute('aria-expanded', String(!collapsed));
        btn.setAttribute('aria-label', collapsed ? 'Mostrar proyectos' : 'Minimizar proyectos');
        btn.title = collapsed ? 'Mostrar proyectos' : 'Minimizar proyectos';
    };

    const saved = localStorage.getItem('cromorProjectsPanelCollapsed') === 'true';
    applyState(saved);

    btn.addEventListener('click', () => {
        const collapsed = !panel.classList.contains('is-collapsed');
        applyState(collapsed);
        localStorage.setItem('cromorProjectsPanelCollapsed', String(collapsed));
    });
}

function listenCategories(uid) {
    const q = query(collection(db, 'users', uid, 'categories'), orderBy('createdAt'));

    onSnapshot(q, snap => {
        categories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderCategories(uid);
        renderCategorySelect();
        renderProjects(uid);
    });
}

function listenTaskTypeCategories(uid) {
    const q = query(collection(db, 'users', uid, 'taskTypeCategories'), orderBy('createdAt'));

    onSnapshot(q, snap => {
        if (snap.empty && !seededDefaultTaskTypes) {
            seededDefaultTaskTypes = true;
            seedDefaultTaskTypeCategories(uid).catch(console.error);
        }

        taskTypeCategories = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(c => c.active !== false && c.name);
        renderTaskTypeCategorySelect();
        renderTaskTypeCategoryManager(uid);
        syncTaskTypesForCalendar();
        renderProjects(uid);
    });
}

async function seedDefaultTaskTypeCategories(uid) {
    const batch = writeBatch(db);

    DEFAULT_TASK_TYPES.forEach((name, index) => {
        batch.set(doc(db, 'users', uid, 'taskTypeCategories', name), {
            name,
            createdAt: serverTimestamp(),
            order: index,
            active: true,
        });
    });

    await batch.commit();
}

function renderTaskTypeCategorySelect() {
    const sel = $('newProjectTipo');
    if (!sel) return;

    const current = sel.value;
    sel.innerHTML = renderTaskTypeSelect(current);
    if (getTaskTypeNames().includes(current)) sel.value = current;
}

function renderTaskTypeCategoryManager(uid) {
    const list = $('taskTypeCategoryList');
    if (!list) return;

    if (!taskTypeCategories.length) {
        list.innerHTML = '<p class="empty-hint">Todavía no hay categorías.</p>';
        return;
    }

    list.innerHTML = taskTypeCategories.map(c => `
        <span class="task-category-manager-item">
            <strong>${escHtml(c.name)}</strong>
            <button type="button" data-del-task-type="${c.id}" data-task-type-name="${escAttr(c.name)}" aria-label="Eliminar categoría ${escAttr(c.name)}" title="Eliminar categoría">x</button>
        </span>
    `).join('');

    list.querySelectorAll('[data-del-task-type]').forEach(btn => {
        btn.addEventListener('click', () => deleteTaskTypeCategory(uid, btn.dataset.delTaskType, btn.dataset.taskTypeName));
    });
}

function renderCategories(uid) {
    const list = $('categoryList');

    if (!categories.length) {
        list.innerHTML = '<p class="empty-hint">Todavía no agregaste proyectos.</p>';
        return;
    }

    list.innerHTML = categories.map(c => `
        <span class="proyecto-item">
            <input class="project-category-input" data-edit-cat="${c.id}" maxlength="40" value="${escAttr(c.name)}" aria-label="Editar nombre de proyecto">
            <button data-del-cat="${c.id}" aria-label="Eliminar proyecto" title="Eliminar proyecto">✕</button>
        </span>
    `).join('');

    list.querySelectorAll('[data-edit-cat]').forEach(input => {
        const original = input.value;

        input.addEventListener('blur', () => saveCategoryName(uid, input.dataset.editCat, input.value, original));

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') input.blur();

            if (e.key === 'Escape') {
                input.value = original;
                input.blur();
            }
        });
    });

    list.querySelectorAll('[data-del-cat]').forEach(btn => {
        btn.addEventListener('click', () => deleteCategory(uid, btn.dataset.delCat));
    });
}

function renderCategorySelect() {
    const sel = $('newProjectCategory');
    const current = sel.value;

    sel.innerHTML = '<option value="">Sin proyecto</option>'
        + categories.map(c => `<option value="${c.id}">${escHtml(c.name)}</option>`).join('');

    if (categories.some(c => c.id === current)) sel.value = current;
}

function setupAddCategory(uid) {
    const submit = async () => {
        const input = $('newCategoryName');
        const name = input.value.trim();

        if (!name) return;

        await addDoc(collection(db, 'users', uid, 'categories'), {
            name,
            createdAt: serverTimestamp(),
        });

        input.value = '';
        input.focus();
    };

    $('addCategoryBtn').addEventListener('click', submit);
    $('newCategoryName').addEventListener('keydown', e => {
        if (e.key === 'Enter') submit();
    });
}

function setupAddTaskTypeCategory(uid) {
    const openBtn = $('openAddTaskCategoryBtn');
    const modal = $('addTaskCategoryModal');
    const closeBtn = $('addTaskCategoryModalClose');
    const createBtn = $('addTaskCategoryBtn');
    const input = $('newTaskCategoryName');

    const open = () => {
        modal.classList.add('open');
        input.value = '';
        setTimeout(() => input.focus(), 0);
    };

    const close = () => {
        modal.classList.remove('open');
        input.value = '';
    };

    const submit = async () => {
        const name = input.value.trim();
        if (!name) return;

        const exists = getTaskTypeNames().some(item => item.toLowerCase() === name.toLowerCase());
        if (exists) {
            toast('Esa categoría ya existe', 'info');
            return;
        }

        await addDoc(collection(db, 'users', uid, 'taskTypeCategories'), {
            name,
            createdAt: serverTimestamp(),
            active: true,
        });

        close();
        toast('Categoría agregada', 'success');
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    createBtn.addEventListener('click', submit);
    modal.addEventListener('click', e => {
        if (e.target === modal) close();
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') submit();
        if (e.key === 'Escape') close();
    });
}

async function deleteTaskTypeCategory(uid, categoryId, categoryName) {
    if (!categoryId) return;

    const batch = writeBatch(db);

    batch.update(doc(db, 'users', uid, 'taskTypeCategories', categoryId), {
        active: false,
        deletedAt: serverTimestamp(),
    });

    projects.filter(p => p.tipo === categoryName).forEach(p => {
        batch.update(doc(db, 'users', uid, 'projects', p.id), {
            tipo: deleteField(),
        });
    });

    Object.entries(dayData?.projects || {}).forEach(([projId, p]) => {
        if (p.tipo === categoryName) {
            batch.update(doc(db, 'users', uid, 'days', currentDateKey), {
                [`projects.${projId}.tipo`]: deleteField(),
                finalized: false,
            });
        }
    });

    await batch.commit();
    toast('Categoría eliminada', 'success');
}

async function saveCategoryName(uid, catId, value, fallback) {
    const name = value.trim();

    if (!name || name === fallback) return;

    await updateDoc(doc(db, 'users', uid, 'categories', catId), { name });
    toast('Nombre de proyecto actualizado', 'success');
}

async function deleteCategory(uid, catId) {
    const batch = writeBatch(db);

    projects.filter(p => p.categoryId === catId).forEach(p => {
        batch.update(doc(db, 'users', uid, 'projects', p.id), {
            categoryId: null,
        });
    });

    batch.delete(doc(db, 'users', uid, 'categories', catId));

    await batch.commit();
    toast('Proyecto eliminado', 'success');
}

// ══════════════════════════════
//   PROYECTOS
// ══════════════════════════════
function listenProjects(uid) {
    const q = query(collection(db, 'users', uid, 'projects'), orderBy('createdAt'));

    onSnapshot(q, snap => {
        projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderTaskTypeCategorySelect();
        syncTaskTypesForCalendar();
        renderProjects(uid);
        renderCompletedTasks(uid);
    });
}

function setupAddProject(uid) {
    const submit = async () => {
        const nameInput = $('newProjectName');
        const name = nameInput.value.trim();

        if (!name) return;

        const categoryId = $('newProjectCategory').value || null;
        const tipo = $('newProjectTipo').value || null;

        await addDoc(collection(db, 'users', uid, 'projects'), {
            name,
            categoryId,
            ...(tipo ? { tipo } : {}),
            createdAt: serverTimestamp(),
            completed: false,
            completedAt: null,
            completedDate: null,
            active: true,
        });

        nameInput.value = '';
        closeAddTaskModal();
    };

    $('addProjectBtn').addEventListener('click', submit);

    $('newProjectName').addEventListener('keydown', e => {
        if (e.key === 'Enter') submit();
    });

    $('openAddTaskNavBtn').addEventListener('click', openAddTaskModal);

    $('addTaskModal').addEventListener('click', e => {
        if (e.target.id === 'addTaskModal') closeAddTaskModal();
    });

    $('addTaskModalClose').addEventListener('click', closeAddTaskModal);
}

function openAddTaskModal() {
    $('addTaskModal').classList.add('open');
    $('newProjectName').value = '';
    renderTaskTypeCategorySelect();
    $('newProjectTipo').value = '';
    $('newProjectName').focus();
}

function closeAddTaskModal() {
    $('addTaskModal').classList.remove('open');
}

// ══════════════════════════════
//   COMENTARIO DE TASK
//   Se guarda en la task y en el día; se ve en el calendario, no en la card.
// ══════════════════════════════
let _commentUID = null;
let _commentProjId = null;

function setupTaskComment() {
    const modal = $('taskCommentModal');
    const closeBtn = $('taskCommentModalClose');
    const saveBtn = $('saveTaskCommentBtn');
    const textarea = $('taskCommentText');

    const save = async () => {
        if (!_commentUID || !_commentProjId) return;
        await saveProjectComment(_commentUID, _commentProjId, textarea.value);
        closeCommentModal();
    };

    closeBtn.addEventListener('click', closeCommentModal);
    saveBtn.addEventListener('click', save);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeCommentModal();
    });
    textarea.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCommentModal();
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); save(); }
    });
}

function openCommentModal(uid, projId) {
    _commentUID = uid;
    _commentProjId = projId;

    const project = projects.find(p => p.id === projId);
    const pState = dayData?.projects?.[projId];
    const hasDayComment = pState && Object.prototype.hasOwnProperty.call(pState, 'comment');
    const comment = (hasDayComment ? pState.comment : project?.comment) || '';

    const textarea = $('taskCommentText');
    $('taskCommentSubtitle').textContent = project?.name
        ? `${project.name} — solo se ve en el calendario`
        : 'Solo se ve en el calendario, no en la card';
    textarea.value = comment;
    $('taskCommentModal').classList.add('open');
    setTimeout(() => textarea.focus(), 0);
}

function closeCommentModal() {
    $('taskCommentModal').classList.remove('open');
    _commentUID = null;
    _commentProjId = null;
}

async function saveProjectComment(uid, projId, rawComment) {
    const value = (rawComment || '').trim();
    const batch = writeBatch(db);

    batch.update(doc(db, 'users', uid, 'projects', projId), {
        comment: value ? value : deleteField(),
    });

    if (dayData?.projects?.[projId]) {
        batch.update(doc(db, 'users', uid, 'days', currentDateKey), {
            [`projects.${projId}.comment`]: value ? value : deleteField(),
            finalized: false,
        });
    }

    await batch.commit();
    toast(value ? 'Comentario guardado' : 'Comentario eliminado', 'success');
}

function escAttr(s) {
    return escHtml(s).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function renderProjects(uid) {
    const list = $('projectList');
    const activeProjects = projects.filter(p => p.active !== false && !p.completed && !dayData?.projects?.[p.id]?.completed);

    const cards = activeProjects.map(p => {
const pState = dayData?.projects?.[p.id];

const hasDayCategory = pState && Object.prototype.hasOwnProperty.call(pState, 'categoryId');
const currentCategoryId = hasDayCategory ? (pState.categoryId || '') : (p.categoryId || '');

const categoryOptions = [
    `<option value="">Sin proyecto</option>`,
    ...categories.map(c => `
        <option value="${c.id}" ${c.id === currentCategoryId ? 'selected' : ''}>
            ${escHtml(c.name)}
        </option>
    `)
].join('');

const running = !!pState?.running;
const tipo = pState?.tipo || p.tipo || null;
const tipoOptions = renderTaskTypeSelect(tipo);

const hasDayComment = pState && Object.prototype.hasOwnProperty.call(pState, 'comment');
const taskComment = (hasDayComment ? pState.comment : p.comment) || '';
const hasComment = !!taskComment.trim();

        return `
    <div class="task-card ${running ? 'is-running' : ''}">
        <textarea class="task-name-input" data-edit-project="${p.id}" maxlength="80" rows="2" aria-label="Editar nombre de task">${escHtml(p.name)}</textarea>

        <select class="task-category-select" data-edit-project-category="${p.id}" aria-label="Editar proyecto de la task">
    ${categoryOptions}
</select>

        <div class="task-clock">
            <div class="clock-hand" data-task-hand="${p.id}"></div>
            <div class="clock-center"></div>
        </div>

        <div class="task-time-wrap" id="time-wrap-${p.id}">
          <input class="task-time-input ${running ? 'is-running' : ''}" data-edit-project-time="${p.id}" value="${formatTime(getProjectDisplaySeconds(p.id))}" aria-label="Editar tiempo de task" inputmode="numeric" ${running ? 'readonly title="Pausá la task para editar el tiempo"' : ''}>
        </div>

        <div class="task-tipo">
            <select class="task-tipo-select" data-tipo-project="${p.id}" aria-label="Categoría de la task">
                ${tipoOptions}
            </select>
        </div>

        <div class="task-actions">
            <button class="btn-complete-task" data-complete-project="${p.id}" type="button">Tarea completada</button>
            <button class="btn-icon ${running ? 'btn-icon--pause' : 'btn-icon--play'}" data-toggle-project="${p.id}" aria-label="${running ? 'Pausar' : 'Iniciar'}">${running ? '⏸' : '▶'}</button>
            <button class="btn-icon btn-icon--comment${hasComment ? ' has-comment' : ''}" data-comment-project="${p.id}" aria-label="${hasComment ? 'Editar comentario' : 'Agregar comentario'}" title="${hasComment ? 'Editar comentario' : 'Agregar comentario'}">+</button>
            <button class="btn-icon btn-icon--delete" data-del-project="${p.id}" aria-label="Eliminar task" title="Eliminar task">🗑</button>
        </div>
    </div>
`;
    }).join('');

    list.innerHTML = cards;

    list.querySelectorAll('[data-edit-project]').forEach(input => {
        const original = input.value;

        fitTaskName(input);

        input.addEventListener('input', () => fitTaskName(input));

        input.addEventListener('blur', () => {
            saveProjectName(uid, input.dataset.editProject, input.value, original);
        });

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                input.blur();
            }

            if (e.key === 'Escape') {
                input.value = original;
                fitTaskName(input);
                input.blur();
            }
        });
    });

    list.querySelectorAll('[data-edit-project-category]').forEach(select => {
    select.addEventListener('change', () => {
        saveProjectCategory(uid, select.dataset.editProjectCategory, select.value || null);
    });
});

    list.querySelectorAll('[data-edit-project-time]').forEach(input => {
        const projId = input.dataset.editProjectTime;
        let enterPressed = false;

        input.addEventListener('focus', () => {
            if (input.readOnly) {
                input.blur();
                toast('Pausá la task para editar el tiempo', 'info');
                return;
            }
            input.select();
        });

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                enterPressed = true;
                const entered = parseManualTime(input.value);
                if (entered === null) {
                    input.value = formatTime(getProjectDisplaySeconds(projId));
                    toast('Usá formato HH:MM:SS, MM:SS o minutos', 'error');
                    enterPressed = false;
                    return;
                }
                const delta = entered - getProjectDisplaySeconds(projId);
                if (Math.abs(delta) < 1) { enterPressed = false; return; }
                showTimePicker(input, projId, entered, delta, uid);
                enterPressed = false;
            }
            if (e.key === 'Escape') {
                input.value = formatTime(getProjectDisplaySeconds(projId));
                hidePicker(false);
                input.blur();
            }
        });

        input.addEventListener('blur', () => {
            if (!enterPressed) {
                input.value = formatTime(getProjectDisplaySeconds(projId));
            }
        });
    });

    list.querySelectorAll('[data-toggle-project]').forEach(btn => {
        btn.addEventListener('click', () => toggleProject(uid, btn.dataset.toggleProject));
    });

    list.querySelectorAll('[data-complete-project]').forEach(btn => {
        btn.addEventListener('click', () => completeProject(uid, btn.dataset.completeProject));
    });

    list.querySelectorAll('[data-del-project]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('¿Eliminar esta task?')) deleteProject(uid, btn.dataset.delProject);
        });
    });

    list.querySelectorAll('[data-comment-project]').forEach(btn => {
        btn.addEventListener('click', () => openCommentModal(uid, btn.dataset.commentProject));
    });

    list.querySelectorAll('[data-tipo-project]').forEach(select => {
        select.addEventListener('change', () => {
            setProjectTipo(uid, select.dataset.tipoProject, select.value || null);
        });
    });

    renderCompletedTasks(uid);
    renderTimers();
}

async function saveProjectName(uid, projId, value, fallback) {
    const name = value.trim();

    if (!name || name === fallback) return;

    await updateDoc(doc(db, 'users', uid, 'projects', projId), { name });
    toast('Nombre de task actualizado', 'success');
}
async function saveProjectCategory(uid, projId, categoryId) {
    const category = categories.find(c => c.id === categoryId);
    const categoryName = category ? category.name : null;

    const batch = writeBatch(db);

    batch.update(doc(db, 'users', uid, 'projects', projId), {
        categoryId: categoryId || null,
    });

    if (dayData?.projects?.[projId]) {
        batch.update(doc(db, 'users', uid, 'days', currentDateKey), {
            [`projects.${projId}.categoryId`]: categoryId || null,
            [`projects.${projId}.categoryName`]: categoryName,
            finalized: false,
        });
    }

    await batch.commit();

    toast('Proyecto de la task actualizado', 'success');
}

function fitTaskName(input) {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
}

function parseManualTime(value) {
    const raw = value.trim();

    if (!raw) return null;
    if (/^\d+$/.test(raw)) return Number(raw) * 60;

    const parts = raw.split(':').map(part => part.trim());

    if (parts.length < 2 || parts.length > 3 || parts.some(part => !/^\d+$/.test(part))) return null;

    const nums = parts.map(Number);

    if (nums.some(n => n < 0)) return null;

    if (parts.length === 2) {
        const [minutes, seconds] = nums;
        if (seconds >= 60) return null;
        return (minutes * 60) + seconds;
    }

    const [hours, minutes, seconds] = nums;

    if (minutes >= 60 || seconds >= 60) return null;

    return (hours * 3600) + (minutes * 60) + seconds;
}

// ── Picker de destino de tiempo ──
let _pickerUID = null, _pickerProjId = null;

function showTimePicker(input, projId, entered, delta, uid) {
    _pickerUID    = uid;
    _pickerProjId = projId;

    const positive = delta > 0;
    const picker   = document.getElementById('time-apply-picker');
    const label    = document.getElementById('tapLabel');
    const btnA     = document.getElementById('tapBtnA');
    const btnB     = document.getElementById('tapBtnB');

    label.textContent = '';
    btnA.textContent  = positive ? '+Total'   : '−Total';
    btnA.title        = positive ? 'El total del día sube' : 'El total del día baja';
    btnA.dataset.mode = 'total';
    btnB.textContent  = positive ? '−SA'      : '+SA';
    btnB.title        = positive ? 'El total queda igual, el SA baja' : 'El total queda igual, el SA sube';
    btnB.dataset.mode = 'sa';

    // Posicionar junto al input
    const rect = input.closest('.task-time-wrap')?.getBoundingClientRect() || input.getBoundingClientRect();
    picker.style.top  = `${rect.bottom + window.scrollY + 6}px`;
    picker.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    picker.hidden = false;

    // Listeners (limpiar primeros para evitar duplicados)
    [btnA, btnB].forEach(btn => {
        const clone = btn.cloneNode(true);
        btn.replaceWith(clone);
    });
    document.getElementById('tapBtnA').addEventListener('click', () => {
        saveProjectTime(_pickerUID, _pickerProjId, formatTime(entered), document.getElementById('tapBtnA').dataset.mode);
        hidePicker(false);
    });
    document.getElementById('tapBtnB').addEventListener('click', () => {
        saveProjectTime(_pickerUID, _pickerProjId, formatTime(entered), document.getElementById('tapBtnB').dataset.mode);
        hidePicker(false);
    });
}

function hidePicker(restoreInput) {
    document.getElementById('time-apply-picker').hidden = true;
    _pickerUID = null; _pickerProjId = null;
}

document.getElementById('tapCancel')?.addEventListener('click', () => hidePicker(false));

document.addEventListener('click', e => {
    const picker = document.getElementById('time-apply-picker');
    if (!picker.hidden && !picker.contains(e.target)) hidePicker(false);
});

async function saveProjectTime(uid, projId, value, mode = 'add-total') {
    if (!dayData) return;

    if (dayData.projects?.[projId]?.running) {
        toast('Pausá la task para editar el tiempo', 'info');
        return;
    }

    const entered = parseManualTime(value);
    const input = document.querySelector(`[data-edit-project-time="${projId}"]`);

    if (entered === null) {
        if (input) input.value = formatTime(getProjectDisplaySeconds(projId));
        toast('Usá formato HH:MM:SS, MM:SS o minutos', 'error');
        return;
    }

    const ref = doc(db, 'users', uid, 'days', currentDateKey);
    const pState = dayData.projects?.[projId] || { running: false, startedAt: null };
    const prevTaskSeconds = pState.seconds || 0;

    // La task siempre se setea al valor escrito
    const delta = entered - prevTaskSeconds;
    const newTaskSeconds = entered;

    // 'total': el general sube/baja con la task → SA queda igual
    // 'sa':    el general no cambia → el SA absorbe el delta
    const deltaGeneral = mode === 'total' ? delta : 0;

    const now = Date.now();
    const generalElapsed = dayData.generalRunning && dayData.generalStartedAt
        ? (now - dayData.generalStartedAt) / 1000 : 0;
    const currentGeneralDisplay = (dayData.generalSeconds || 0) + generalElapsed;
    const taskTotalSeconds = getProjectsDisplaySeconds({ [projId]: newTaskSeconds });
    const nextGeneralDisplay = Math.max(0, currentGeneralDisplay + deltaGeneral, taskTotalSeconds);
    const generalSeconds = Math.max(0, nextGeneralDisplay - generalElapsed);

    const updated = {
        ...pState,
        seconds: newTaskSeconds,
        startedAt: pState.running ? now : null,
    };

    await updateDoc(ref, {
        [`projects.${projId}`]: updated,
        generalSeconds,
        finalized: false,
    });

    if (input) input.value = formatTime(newTaskSeconds);

    const isAdd = delta >= 0;
    const labels = {
        'total': isAdd ? 'Task y total actualizados' : 'Task y total actualizados',
        'sa':    isAdd ? 'Task actualizada, SA ajustado' : 'Task actualizada, SA ajustado',
    };
    toast(labels[mode] || 'Tiempo actualizado', 'success');
}

async function setProjectTipo(uid, projId, tipo) {
    if (!dayData) return;

    const dayRef = doc(db, 'users', uid, 'days', currentDateKey);
    const projectRef = doc(db, 'users', uid, 'projects', projId);
    const nextTipo = tipo || null;
    const batch = writeBatch(db);

    batch.update(projectRef, {
        tipo: nextTipo === null ? deleteField() : nextTipo,
    });

    if (dayData.projects?.[projId]) {
        batch.update(dayRef, {
            [`projects.${projId}.tipo`]: nextTipo === null ? deleteField() : nextTipo,
            finalized: false,
        });
    }

    await batch.commit();
}

async function deleteProject(uid, projId) {
    await deleteDoc(doc(db, 'users', uid, 'projects', projId));

    if (dayData?.projects?.[projId]) {
        const ref = doc(db, 'users', uid, 'days', currentDateKey);
        await updateDoc(ref, {
            [`projects.${projId}`]: deleteField(),
        });
    }

    toast('Task eliminada', 'success');
}

// ══════════════════════════════
//   DÍA ACTUAL
// ══════════════════════════════
function listenToday(uid) {
    currentDateKey = getDateKey();
    renderTodayLabel();

    const ref = doc(db, 'users', uid, 'days', currentDateKey);

    unsubscribeToday = onSnapshot(ref, snap => {
        if (snap.exists()) {
            dayData = snap.data();
        } else {
            dayData = defaultDay();
            setDoc(ref, dayData).catch(console.error);
        }

        syncCompletedProjectsToGlobal(uid);
        renderTaskTypeCategorySelect();
        syncTaskTypesForCalendar();
        renderTimers();
        renderProjects(uid);
    });
}

function renderTodayLabel() {
    $('todayLabel').textContent = getDisplayDateLabel();
}

function getGeneralDisplaySeconds() {
    if (!dayData) return 0;

    let secs = dayData.generalSeconds || 0;

    if (dayData.generalRunning && dayData.generalStartedAt) {
        secs += (Date.now() - dayData.generalStartedAt) / 1000;
    }

    return Math.max(secs, getProjectsDisplaySeconds());
}

function getProjectDisplaySeconds(projId) {
    const p = dayData?.projects?.[projId];

    if (!p) return 0;

    let secs = p.seconds || 0;

    if (p.running && p.startedAt) {
        secs += (Date.now() - p.startedAt) / 1000;
    }

    // El redondeo a cuarto de hora es solo de display y solo para completadas:
    // p.seconds (el valor guardado) nunca se toca, así que si la task vuelve a
    // "en curso" (restoreCompletedProject no modifica seconds) esta misma
    // función deja de redondear y muestra el tiempo real automáticamente.
    return p.completed ? roundSecondsToQuarterHour(secs) : secs;
}

function getProjectsDisplaySeconds(overrides = {}) {
    return Object.entries(dayData?.projects || {}).reduce((sum, [id, p]) => {
        if (Object.hasOwn(overrides, id)) return sum + (overrides[id] || 0);
        return sum + getProjectDisplaySeconds(id);
    }, 0);
}
function getGeneralSADisplaySeconds() {
    const generalSecs = getGeneralDisplaySeconds();
    const projectsSecs = getProjectsDisplaySeconds();

    return Math.max(0, generalSecs - projectsSecs);
}

function handAngle(seconds) {
    return (seconds % 60) * 6;
}

function renderTimers() {
    if (!dayData) return;

const generalSecs = getGeneralDisplaySeconds();
const generalSaSecs = getGeneralSADisplaySeconds();
const disp = $('generalDisplay');
const saDisp = $('generalSaDisplay');

if (document.activeElement !== disp) {
    disp.value = formatTime(generalSecs);
}

if (saDisp) {
    saDisp.textContent = formatTime(generalSaSecs);
}

    disp.classList.toggle('is-running', !!dayData.generalRunning);
    disp.readOnly = !!dayData.generalRunning;
    disp.title = dayData.generalRunning ? 'Pausá el reloj para editar el tiempo' : 'Hacé clic para editar el tiempo';

    $('generalClockCard').classList.toggle('is-running', !!dayData.generalRunning);
    $('clockHand').style.transform = `translateX(-50%) rotate(${handAngle(generalSecs)}deg)`;

    const toggleBtn = $('generalToggleBtn');

    toggleBtn.textContent = dayData.generalRunning ? '⏸ Pausar' : '▶ Iniciar';
    toggleBtn.classList.toggle('btn-danger', !!dayData.generalRunning);
    toggleBtn.classList.toggle('btn-primary', !dayData.generalRunning);

    document.querySelectorAll('[data-edit-project-time]').forEach(el => {
        const id = el.dataset.editProjectTime;

        if (document.activeElement === el) return;

        const running = !!dayData.projects?.[id]?.running;

        el.value = formatTime(getProjectDisplaySeconds(id));
        el.classList.toggle('is-running', running);
        el.readOnly = running;
        el.title = running ? 'Pausá la task para editar el tiempo' : '';
    });

    document.querySelectorAll('[data-task-hand]').forEach(el => {
        const id = el.dataset.taskHand;
        el.style.transform = `translateX(-50%) rotate(${handAngle(getProjectDisplaySeconds(id))}deg)`;
    });
}

// ══════════════════════════════
//   TASKS COMPLETADAS EN TOP BAR
// ══════════════════════════════
function renderCompletedTasks(uid) {
    const bar = $('completedTasksBar');

    if (!bar || !dayData) return;

    const completed = Object.entries(dayData.projects || {})
        .filter(([, p]) => {
            if (!p.completed) return false;
            if (!p.completedAt) return true;
            return getDateKey(new Date(p.completedAt)) === currentDateKey;
        })
        .sort((a, b) => (a[1].completedAt || 0) - (b[1].completedAt || 0));

    if (!completed.length) {
        bar.innerHTML = '';
        return;
    }

    bar.innerHTML = completed.map(([id, p]) => {
        const project = projects.find(item => item.id === id);
        const name = p.name || project?.name || 'Task';

        return `
            <span 
                class="completed-pill" 
                data-restore-project="${id}"
                role="button"
                tabindex="0"
                title="Volver a poner en progreso"
            >
                <span>${escHtml(name)}</span>
                <strong>${formatTime(getProjectDisplaySeconds(id))}</strong>
            </span>
        `;
    }).join('');

    bar.querySelectorAll('[data-restore-project]').forEach(item => {
        item.addEventListener('click', () => {
            restoreCompletedProject(uid, item.dataset.restoreProject);
        });

        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                restoreCompletedProject(uid, item.dataset.restoreProject);
            }
        });
    });
}

async function restoreCompletedProject(uid, projId) {
    if (!dayData?.projects?.[projId]) return;

    const ref = doc(db, 'users', uid, 'days', currentDateKey);
    const pState = dayData.projects[projId];
    const ajusteRedondeo = pState.ajusteRedondeo || 0;

    const batch = writeBatch(db);

    batch.update(ref, {
        [`projects.${projId}`]: {
            ...pState,
            completed: false,
            completedAt: null,
            running: false,
            startedAt: null,
            ajusteRedondeo: 0,
        },
        // Revierte exactamente el ajuste que se acreditó al completar, para que
        // no quede duplicado si esta task se vuelve a completar más adelante.
        generalSeconds: Math.max(0, (dayData.generalSeconds || 0) - ajusteRedondeo),
        finalized: false,
    });

    batch.update(doc(db, 'users', uid, 'projects', projId), {
        completed: false,
        completedAt: null,
        completedDate: null,
        active: true,
    });

    await batch.commit();

    toast('Task vuelta a progreso', 'success');
}

function getPausedRunningProjects(now) {
    const paused = {};

    Object.entries(dayData?.projects || {}).forEach(([id, p]) => {
        if (!p.running || !p.startedAt) return;

        paused[`projects.${id}`] = {
            ...p,
            seconds: (p.seconds || 0) + (now - p.startedAt) / 1000,
            running: false,
            startedAt: null,
        };
    });

    return paused;
}

function setupGeneralTimer(uid) {
    $('generalToggleBtn').addEventListener('click', async () => {
        if (!dayData) return;

        const ref = doc(db, 'users', uid, 'days', currentDateKey);
        const now = Date.now();

        if (dayData.generalRunning) {
            const elapsed = (now - dayData.generalStartedAt) / 1000;

            await updateDoc(ref, {
                generalSeconds: (dayData.generalSeconds || 0) + elapsed,
                generalRunning: false,
                generalStartedAt: null,
                finalized: false,
                ...getPausedRunningProjects(now),
            });
        } else {
            await updateDoc(ref, {
                generalRunning: true,
                generalStartedAt: now,
                finalized: false,
            });
        }
    });

    const disp = $('generalDisplay');

    disp.addEventListener('focus', () => {
        if (disp.readOnly) {
            disp.blur();
            toast('Pausá el reloj para editar el tiempo', 'info');
            return;
        }

        disp.select();
    });

    disp.addEventListener('blur', () => {
        if (!disp.readOnly) saveGeneralTime(uid, disp.value);
    });

    disp.addEventListener('keydown', e => {
        if (e.key === 'Enter') disp.blur();

        if (e.key === 'Escape') {
            disp.value = formatTime(dayData?.generalSeconds || 0);
            disp.blur();
        }
    });
}

async function saveGeneralTime(uid, value) {
    if (!dayData || dayData.generalRunning) return;

    const seconds = parseManualTime(value);
    const disp = $('generalDisplay');

    if (seconds === null) {
        if (disp) disp.value = formatTime(dayData.generalSeconds || 0);
        toast('Usá formato HH:MM:SS, MM:SS o minutos', 'error');
        return;
    }

    const taskTotal = getProjectsDisplaySeconds();
    const finalSeconds = Math.max(seconds, taskTotal);

    await updateDoc(doc(db, 'users', uid, 'days', currentDateKey), {
        generalSeconds: finalSeconds,
        finalized: false,
    });

    if (disp) disp.value = formatTime(finalSeconds);

    toast('Tiempo general actualizado', 'success');
}

async function toggleProject(uid, projId) {
    if (!dayData) return;

    const ref = doc(db, 'users', uid, 'days', currentDateKey);
    const pState = dayData.projects?.[projId] || {
        seconds: 0,
        running: false,
        startedAt: null,
    };
    const project = projects.find(p => p.id === projId);

    if (pState.completed) return;

    let updated;
    const now = Date.now();

    if (pState.running) {
        const elapsed = (now - pState.startedAt) / 1000;

        updated = {
            ...pState,
            seconds: (pState.seconds || 0) + elapsed,
            running: false,
            startedAt: null,
        };
    } else {
        updated = {
            ...pState,
            running: true,
            startedAt: now,
            ...(project?.tipo && !pState.tipo ? { tipo: project.tipo } : {}),
            ...(project?.comment && !pState.comment ? { comment: project.comment } : {}),
        };
    }

    const updates = {
        [`projects.${projId}`]: updated,
        finalized: false,
    };

    if (!pState.running && !dayData.generalRunning) {
        updates.generalRunning = true;
        updates.generalStartedAt = now;
    }

    await updateDoc(ref, updates);
}

// ══════════════════════════════
//   FINALIZAR DÍA
// ══════════════════════════════
async function completeProject(uid, projId) {
    if (!dayData) return;

    const project = projects.find(p => p.id === projId);

    if (!project) return;

    const ref = doc(db, 'users', uid, 'days', currentDateKey);
    const now = Date.now();
    const pState = dayData.projects?.[projId] || {
        seconds: 0,
        running: false,
        startedAt: null,
    };

    let seconds = pState.seconds || 0;

    if (pState.running && pState.startedAt) {
        seconds += (now - pState.startedAt) / 1000;
    }
const hasDayCategory = pState && Object.prototype.hasOwnProperty.call(pState, 'categoryId');
const currentCategoryId = hasDayCategory ? (pState.categoryId || null) : (project.categoryId || null);
const cat = categories.find(c => c.id === currentCategoryId);
const currentTipo = pState?.tipo || project.tipo || null;
const currentComment = pState?.comment || project.comment || null;

// El redondeo a cuarto de hora se acredita al reloj general apenas se completa
// (no solo al mostrar la task) — así el total del día ya refleja el tiempo
// "contado" en vivo, sin esperar a Finalizar día. Se guarda el ajuste aplicado
// en la propia task para poder revertirlo si vuelve a "en curso".
const ajusteRedondeo = roundSecondsToQuarterHour(seconds) - seconds;

const batch = writeBatch(db);

    batch.update(ref, {
        [`projects.${projId}`]: {
            ...pState,
            seconds,
            running: false,
            startedAt: null,
            completed: true,
            completedAt: now,
            ajusteRedondeo,
            name: project.name,
categoryId: currentCategoryId,
categoryName: cat ? cat.name : null,
...(currentTipo ? { tipo: currentTipo } : {}),
...(currentComment ? { comment: currentComment } : {}),
        },
        generalSeconds: (dayData.generalSeconds || 0) + ajusteRedondeo,
        finalized: false,
    });

    batch.update(doc(db, 'users', uid, 'projects', projId), {
        completed: true,
        completedAt: serverTimestamp(),
        completedDate: currentDateKey,
        active: false,
    });

    await batch.commit();

    toast('Tarea completada', 'success');
}

function setupFinishDay(uid) {
    $('finishDayBtn').addEventListener('click', () => finishDay(uid));
}

async function finishDay(uid) {
    if (!dayData) return;

    const ref = doc(db, 'users', uid, 'days', currentDateKey);
    const now = Date.now();

    const updates = {
        finalized: true,
        finalizedAt: serverTimestamp(),
    };

    if (dayData.generalRunning) {
        updates.generalSeconds = (dayData.generalSeconds || 0) + (now - dayData.generalStartedAt) / 1000;
        updates.generalRunning = false;
        updates.generalStartedAt = null;
    }

    const { projectsSnapshot, projectTotalSeconds } = buildDaySnapshot(now);

    updates.projects = projectsSnapshot;
    updates.generalSeconds = Math.max(
        updates.generalSeconds ?? (dayData.generalSeconds || 0),
        projectTotalSeconds
    );

    try {
        await updateDoc(ref, updates);
        toast('Día finalizado y guardado en el calendario 💛', 'success');
        refreshCalendar();
    } catch (e) {
        console.error(e);
        toast('No se pudo finalizar el día', 'error');
    }
}
