// Calendario mensual + modal con el detalle de cada día — Hola Mor
import { db } from '../firebase-config.js';
import {
    collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, deleteField,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { formatTime, escHtml, getDateKey, toast, roundSecondsToQuarterHour } from './utils.js';

function fmtFrac(secs) {
    const hours = Math.round((secs / 3600) * 100) / 100;
    return String(hours).replace('.', ',');
}
function fmtTime(secs) {
    return `${formatTime(secs)}<span class="time-frac">${fmtFrac(secs)}</span>`;
}

// Tiempo "contado" de una task: redondeado a cuarto de hora si está completada,
// crudo si no. Se usa para TODO lo que es solo-lectura (totales, orden, CSV) —
// el input editable con el lápiz sigue leyendo/escribiendo p.seconds crudo
// directo, para no perder el valor real al guardar una edición manual.
function taskDisplaySeconds(p) {
    return p.completed ? roundSecondsToQuarterHour(p.seconds || 0) : (p.seconds || 0);
}

const $ = id => document.getElementById(id);

const MESES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

let uid = null;
let viewYear, viewMonth; // viewMonth: 0-indexed
let currentModalDateKey = null;
let currentModalData = null;
let editingTaskId = null; // task del resumen "por task" que se está editando con el lápiz
let taskTypeNames = ['CP', 'PT', 'O'];
let doneDays = {}; // dateKey -> true. Independiente de "finalized" (que se resetea con cualquier edición).

// Interpreta "HH:MM:SS", "MM:SS" o minutos sueltos → segundos (null si es inválido)
function parseTimeToSeconds(value) {
    const raw = (value || '').trim();
    if (!raw) return null;
    if (/^\d+$/.test(raw)) return Number(raw) * 60;
    const parts = raw.split(':').map(p => p.trim());
    if (parts.length < 2 || parts.length > 3 || parts.some(p => !/^\d+$/.test(p))) return null;
    const nums = parts.map(Number);
    if (nums.some(n => n < 0)) return null;
    if (parts.length === 2) {
        const [m, s] = nums;
        if (s >= 60) return null;
        return m * 60 + s;
    }
    const [h, m, s] = nums;
    if (m >= 60 || s >= 60) return null;
    return h * 3600 + m * 60 + s;
}

// ── Checklist del resumen "por proyecto": qué combinaciones quedaron tachadas ──
// Se guarda en localStorage por día, sin costo de servidor y sobrevive a reabrir el día.
function comboChecksKey(dateKey) { return `cromorComboChecks:${dateKey}`; }
function getComboChecks(dateKey) {
    try { return new Set(JSON.parse(localStorage.getItem(comboChecksKey(dateKey)) || '[]')); }
    catch (_) { return new Set(); }
}
function isComboChecked(dateKey, id) { return getComboChecks(dateKey).has(id); }
function setComboChecked(dateKey, id, checked) {
    const set = getComboChecks(dateKey);
    if (checked) set.add(id); else set.delete(id);
    try { localStorage.setItem(comboChecksKey(dateKey), JSON.stringify([...set])); } catch (_) {}
}

// ── "Marcar día como hecho": check chico en cada celda del calendario ──
// A propósito separado de "finalized" (que vive en users/{uid}/days/{dateKey} y se
// resetea con casi cualquier edición del día) — esto es un marcador simple, manual,
// disponible en TODOS los días (tengan o no tiempo cargado), guardado en un solo doc.
function doneDaysRef() {
    return doc(db, 'users', uid, 'meta', 'calendarDone');
}
async function loadDoneDays() {
    try {
        const snap = await getDoc(doneDaysRef());
        doneDays = snap.exists() ? (snap.data().days || {}) : {};
    } catch (e) {
        console.error(e);
        doneDays = {};
    }
}
async function toggleDayDone(dateKey, checked) {
    if (checked) {
        await setDoc(doneDaysRef(), { days: { [dateKey]: true } }, { merge: true });
    } else {
        await updateDoc(doneDaysRef(), { [`days.${dateKey}`]: deleteField() });
    }
}

export function setCalendarTaskTypes(names = []) {
    taskTypeNames = [...new Set(names.map(name => String(name).trim()).filter(Boolean))];
    if (!taskTypeNames.length) taskTypeNames = ['CP', 'PT', 'O'];
    if (currentModalData) renderDayModal();
}

function getDayTaskTypeNames(data) {
    return [
        ...taskTypeNames,
        ...Object.values(data?.projects || {}).map(p => p.tipo).filter(Boolean),
    ].filter((name, index, arr) => arr.indexOf(name) === index);
}

export async function initCalendar(userId) {
    uid = userId;
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();

    $('prevMonthBtn').addEventListener('click', () => { changeMonth(-1); });
    $('nextMonthBtn').addEventListener('click', () => { changeMonth(1); });
    $('dayModalClose').addEventListener('click', closeModal);
    $('dayModal').addEventListener('click', e => { if (e.target.id === 'dayModal') closeModal(); });
    $('dayModalExportBtn').addEventListener('click', exportDayToExcel);

    await loadDoneDays();
    renderCalendar();
}

export function refreshCalendar() {
    if (uid) renderCalendar();
}

function changeMonth(delta) {
    viewMonth += delta;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
}

function pad(n) { return String(n).padStart(2, '0'); }

function escAttr(s) {
    return escHtml(s).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

async function renderCalendar() {
    $('calendarTitle').textContent = `${MESES[viewMonth]} ${viewYear}`;

    const grid = $('calendarGrid');
    grid.innerHTML = '';

    DOW.forEach(d => {
        const el = document.createElement('div');
        el.className = 'calendar-dow';
        el.textContent = d;
        grid.appendChild(el);
    });

    const firstDay = new Date(viewYear, viewMonth, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const todayKey = getDateKey();

    const totalCells = startOffset + daysInMonth;
    grid.style.setProperty('--cal-rows', String(Math.ceil(totalCells / 7)));

    for (let i = 0; i < startOffset; i++) {
        const el = document.createElement('div');
        el.className = 'calendar-day empty';
        grid.appendChild(el);
    }

    const monthData = await fetchMonthData();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
        const data = monthData[dateKey];

        const el = document.createElement('div');
        el.className = 'calendar-day';
        if (dateKey === todayKey) el.classList.add('is-today');

        const num = document.createElement('span');
        num.className = 'cal-day-num';
        num.textContent = String(day);
        el.appendChild(num);

        if (data) {
            el.classList.add('has-data');
            const time = document.createElement('span');
            time.className = 'cal-day-time';
            time.innerHTML = fmtTime(data.generalSeconds || 0);
            el.appendChild(time);
            el.addEventListener('click', () => openDayModal(dateKey, data));
        }

        el.appendChild(buildDoneCheckbox(dateKey));

        grid.appendChild(el);
    }
}

// Check chico en la esquina de la celda para marcar el día como "hecho" a mano.
// stopPropagation: la celda misma tiene su propio listener de click (abre el modal).
function buildDoneCheckbox(dateKey) {
    const wrap = document.createElement('label');
    wrap.className = 'cal-day-done';
    wrap.title = 'Marcar día como hecho';
    wrap.addEventListener('click', e => e.stopPropagation());

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = !!doneDays[dateKey];
    chk.setAttribute('aria-label', `Marcar ${dateKey} como hecho`);
    chk.addEventListener('change', () => {
        const checked = chk.checked;
        if (checked) doneDays[dateKey] = true; else delete doneDays[dateKey];
        toggleDayDone(dateKey, checked).catch(e => {
            console.error(e);
            if (checked) delete doneDays[dateKey]; else doneDays[dateKey] = true;
            chk.checked = !checked;
            toast('No se pudo guardar', 'error');
        });
    });

    wrap.appendChild(chk);
    return wrap;
}

async function fetchMonthData() {
    const startKey = `${viewYear}-${pad(viewMonth + 1)}-01`;
    const endKey = `${viewYear}-${pad(viewMonth + 1)}-31`;
    const q = query(
        collection(db, 'users', uid, 'days'),
        where('date', '>=', startKey),
        where('date', '<=', endKey),
    );
    const snap = await getDocs(q);
    const map = {};
    snap.forEach(d => {
        const data = d.data();
        if (data.finalized) map[d.id] = data;
    });
    return map;
}

function openDayModal(dateKey, data) {
    currentModalDateKey = dateKey;
    currentModalData = data;
    editingTaskId = null;
    const [y, m, d] = dateKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    $('dayModalTitle').textContent = dateObj.toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    renderDayModal();
    $('dayModal').classList.add('open');
}

function renderDayModal() {
    const data = currentModalData;
    if (!data) return;

    const allProjEntries = Object.entries(data.projects || {}).filter(([, p]) => (p.seconds || 0) > 0);
    const taskSeconds = allProjEntries.reduce((sum, [, p]) => sum + taskDisplaySeconds(p), 0);
    const generalSeconds = Math.max(data.generalSeconds || 0, taskSeconds);
    $('dayModalTotal').innerHTML = fmtTime(generalSeconds);

    const unassignedSeconds = Math.max(0, generalSeconds - taskSeconds);
    $('dayModalUnassigned').innerHTML = fmtTime(unassignedSeconds);

    // Totales por tipo
    const dayTaskTypes = getDayTaskTypeNames(data);
    const tipoTotals = {};
    allProjEntries.forEach(([, p]) => {
        if (p.tipo) {
            if (!Object.hasOwn(tipoTotals, p.tipo)) tipoTotals[p.tipo] = 0;
            tipoTotals[p.tipo] += taskDisplaySeconds(p);
        }
    });
    const usedTaskTypes = dayTaskTypes.filter(t => (tipoTotals[t] || 0) > 0);
    $('dayModalTipoTotals').innerHTML = usedTaskTypes.length ? usedTaskTypes.map(t => `
        <div class="tipo-total-item has-time">
            <span class="tipo-label">${escHtml(t)}</span>
            <span class="tipo-time">${fmtTime(tipoTotals[t])}</span>
        </div>
    `).join('') : '<p class="empty-hint">Sin categorías con tiempo.</p>';

    // Lista de tasks (incluye completadas) — editable con el lápiz de cada fila
    const projectsEl = $('dayModalProjects');
    if (!allProjEntries.length) {
        projectsEl.innerHTML = '<p class="empty-hint">Sin tasks registradas.</p>';
    } else {
        projectsEl.innerHTML = allProjEntries
            .sort((a, b) => taskDisplaySeconds(b[1]) - taskDisplaySeconds(a[1]))
            .map(([id, p]) => {
                const editing = editingTaskId === id;
                const tipoOptions = `
                    <option value="">Sin categoría</option>
                    ${dayTaskTypes.map(tipo => `
                        <option value="${escAttr(tipo)}" ${p.tipo === tipo ? 'selected' : ''}>${escHtml(tipo)}</option>
                    `).join('')}
                `;
                return `
                <div class="modal-list-item${editing ? ' is-editing' : ''}" data-task-row="${escAttr(id)}">
                    <div class="item-info">
                        ${editing
                            ? `<input class="modal-task-name-input" data-edit-task-name="${escAttr(id)}" maxlength="80" value="${escAttr(p.name || 'Task')}" aria-label="Editar nombre de la task">`
                            : `<span class="name">${escHtml(p.name || 'Task')}</span>`}
                        <span class="cat-label">${escHtml(p.categoryName || 'Sin proyecto')}</span>
                        ${p.completed ? '<span class="completed-label">completada</span>' : ''}
                    </div>
                    <div class="modal-task-tipo">
                        <select class="modal-task-tipo-select" data-edit-task-tipo="${escAttr(id)}" aria-label="Categoría de la task" ${editing ? '' : 'disabled'}>
                            ${tipoOptions}
                        </select>
                    </div>
                    ${editing
                        ? `<input class="modal-task-time-input" data-edit-task-time="${escAttr(id)}" value="${formatTime(p.seconds || 0)}" inputmode="numeric" aria-label="Editar tiempo de la task">`
                        : `<span class="time">${fmtTime(taskDisplaySeconds(p))}</span>`}
                    <button class="modal-task-edit${editing ? ' is-done' : ''}" data-${editing ? 'done' : 'edit'}-task="${escAttr(id)}" type="button" aria-label="${editing ? 'Guardar cambios' : 'Editar task'}" title="${editing ? 'Guardar' : 'Editar task'}">${editing ? '✓' : '✎'}</button>
                    ${p.comment ? `<p class="task-comment">${escHtml(p.comment)}</p>` : ''}
                </div>
            `;
            }).join('');

        // Lápiz → entra en modo edición de esa task
        projectsEl.querySelectorAll('[data-edit-task]').forEach(btn => {
            btn.addEventListener('click', () => {
                editingTaskId = btn.dataset.editTask;
                renderDayModal();
                const inp = $('dayModalProjects').querySelector('[data-edit-task-name]');
                if (inp) { inp.focus(); inp.select(); }
            });
        });

        // Tilde → guarda los cambios de la task
        projectsEl.querySelectorAll('[data-done-task]').forEach(btn => {
            btn.addEventListener('click', () => saveDayTaskEdits(btn.dataset.doneTask));
        });

        // Enter guarda, Escape cancela la edición
        projectsEl.querySelectorAll('[data-edit-task-name], [data-edit-task-time]').forEach(inp => {
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); saveDayTaskEdits(editingTaskId); }
                if (e.key === 'Escape') { e.preventDefault(); editingTaskId = null; renderDayModal(); }
            });
        });
    }

    // Por proyecto → un proyecto tiene muchas categorías: se agrupa por proyecto y,
    // dentro de cada uno, se suma el tiempo de todas las tasks por categoría (no task por task).
    // El checkbox tacha la combinación proyecto+categoría.
    const groups = {}; // proyecto -> { total, tipos: { tipoName -> secs } }
    allProjEntries.forEach(([, p]) => {
        const proyecto = p.categoryName || 'Sin proyecto';
        const tipo = p.tipo || 'Sin categoría';
        if (!groups[proyecto]) groups[proyecto] = { total: 0, tipos: {} };
        groups[proyecto].total += taskDisplaySeconds(p);
        groups[proyecto].tipos[tipo] = (groups[proyecto].tipos[tipo] || 0) + taskDisplaySeconds(p);
    });

    const proyectoNames = Object.keys(groups)
        .sort((a, b) => (groups[b].total - groups[a].total) || a.localeCompare(b, 'es'));

    const categoriesEl = $('dayModalCategories');
    if (!proyectoNames.length) {
        categoriesEl.innerHTML = '<p class="empty-hint">Sin proyectos registrados.</p>';
    } else {
        categoriesEl.innerHTML = proyectoNames.map(proyecto => {
            const g = groups[proyecto];
            const tipoNames = Object.keys(g.tipos).sort((a, b) => {
                if (a === 'INI' && b === 'FU') return -1;
                if (a === 'FU' && b === 'INI') return 1;
                return g.tipos[b] - g.tipos[a];
            });
            const rows = tipoNames.map(tipo => {
                const comboId = `${proyecto}::${tipo}`;
                const checked = isComboChecked(currentModalDateKey, comboId);
                return `
                    <label class="modal-combo-item${checked ? ' is-checked' : ''}">
                        <input type="checkbox" class="modal-combo-check" data-combo-id="${escAttr(comboId)}" ${checked ? 'checked' : ''}>
                        <span class="combo-name">${escHtml(tipo)}</span>
                        <span class="time">${fmtTime(g.tipos[tipo])}</span>
                    </label>
                `;
            }).join('');

            return `
                <div class="modal-combo-group">
                    <div class="modal-combo-group-header">
                        <span class="combo-group-name">${escHtml(proyecto)}</span>
                        <span class="combo-group-time">${fmtTime(g.total)}</span>
                    </div>
                    ${rows}
                </div>
            `;
        }).join('');

        categoriesEl.querySelectorAll('.modal-combo-check').forEach(chk => {
            chk.addEventListener('change', () => {
                chk.closest('.modal-combo-item').classList.toggle('is-checked', chk.checked);
                setComboChecked(currentModalDateKey, chk.dataset.comboId, chk.checked);
            });
        });
    }
}

// Guarda los cambios hechos con el lápiz en una task del resumen "por task":
// nombre, tiempo y categoría, todo en una sola escritura.
async function saveDayTaskEdits(projId) {
    if (!currentModalDateKey || !currentModalData || !projId) {
        editingTaskId = null; renderDayModal(); return;
    }
    const proj = currentModalData.projects?.[projId];
    if (!proj) { editingTaskId = null; renderDayModal(); return; }

    const row = $('dayModalProjects').querySelector(`[data-task-row="${CSS.escape(projId)}"]`);
    const nameInput = row?.querySelector('[data-edit-task-name]');
    const timeInput = row?.querySelector('[data-edit-task-time]');
    const tipoSelect = row?.querySelector('[data-edit-task-tipo]');

    const patch = {};
    let secondsChanged = false;

    if (nameInput) {
        const newName = nameInput.value.trim();
        if (newName && newName !== proj.name) {
            patch[`projects.${projId}.name`] = newName;
            proj.name = newName;
        }
    }

    if (timeInput) {
        const secs = parseTimeToSeconds(timeInput.value);
        if (secs === null) {
            toast('Usá formato HH:MM:SS, MM:SS o minutos', 'error');
            return; // sigue en modo edición para corregir
        }
        if (secs !== (proj.seconds || 0)) {
            patch[`projects.${projId}.seconds`] = secs;
            proj.seconds = secs;
            secondsChanged = true;
        }
    }

    if (tipoSelect) {
        const newTipo = tipoSelect.value || null;
        const curTipo = proj.tipo || null;
        if (newTipo !== curTipo) {
            patch[`projects.${projId}.tipo`] = newTipo === null ? deleteField() : newTipo;
            if (newTipo === null) delete proj.tipo; else proj.tipo = newTipo;
        }
    }

    // El total del día no puede quedar por debajo de la suma de las tasks.
    if (secondsChanged) {
        const taskSeconds = Object.values(currentModalData.projects || {})
            .reduce((sum, p) => sum + taskDisplaySeconds(p), 0);
        if ((currentModalData.generalSeconds || 0) < taskSeconds) {
            patch.generalSeconds = taskSeconds;
            currentModalData.generalSeconds = taskSeconds;
        }
    }

    editingTaskId = null;

    if (Object.keys(patch).length) {
        try {
            await updateDoc(doc(db, 'users', uid, 'days', currentModalDateKey), patch);
            toast('Task actualizada', 'success');
            renderCalendar(); // refresca el total del día en la grilla del mes
        } catch (e) {
            console.error(e);
            toast('No se pudo guardar la task', 'error');
        }
    }

    renderDayModal();
}

function closeModal() {
    $('dayModal').classList.remove('open');
    currentModalDateKey = null;
    currentModalData = null;
    editingTaskId = null;
}

// ── Exportar el día a un archivo que abre en Excel ──
// Columnas: Proyecto (categoría/proyecto de la task) · Task (nombre) · Categoría (tipo) · Time
function exportDayToExcel() {
    if (!currentModalData) { toast('Abrí un día para exportarlo.', 'error'); return; }

    const rows = Object.values(currentModalData.projects || {})
        .filter(p => (p.seconds || 0) > 0)
        .sort((a, b) => taskDisplaySeconds(b) - taskDisplaySeconds(a))
        .map(p => [
            p.categoryName || '',               // Proyecto
            p.name || '',                       // Task
            p.tipo || '',                        // Categoría
            formatTime(taskDisplaySeconds(p)),   // Time
            p.comment || '',                     // Comentario
        ]);

    if (!rows.length) { toast('No hay tasks con tiempo para exportar.', 'error'); return; }

    const csvCell = v => {
        const s = String(v ?? '');
        return /[";\n]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
    };
    const header = ['Proyecto', 'Task', 'Categoría', 'Time', 'Comentario'];
    // 'sep=;' + BOM: fuerza a Excel a separar por ';' y leer bien los acentos, sin importar el idioma del Excel
    const lines = ['sep=;', header.join(';'), ...rows.map(r => r.map(csvCell).join(';'))];
    const csv = '﻿' + lines.join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cromor_${currentModalDateKey || getDateKey()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('Día exportado.', 'success');
}
