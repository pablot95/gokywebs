const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WSP = '5493425194242';
const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DIAS_ABBR = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00'];
const MOTIVOS = [
    { id: 'consulta', label: 'Consulta general' },
    { id: 'limpieza', label: 'Limpieza dental' },
    { id: 'urgencia', label: 'Urgencia / dolor' },
    { id: 'ortodoncia', label: 'Ortodoncia' },
    { id: 'estetica', label: 'Estética dental' },
    { id: 'ninos', label: 'Odontopediatría' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function generarDias(base = new Date(), cantidad = 10) {
    const out = [];
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    while (out.length < cantidad) {
        d.setDate(d.getDate() + 1);
        const dow = d.getDay();
        if (dow === 0 || dow === 6) continue;
        out.push({
            dow,
            abbr: DIAS_ABBR[dow],
            nombre: DIAS_SEMANA[dow],
            label: `${d.getDate()}/${d.getMonth() + 1}`,
        });
    }
    return out;
}

function turnoFaltantes(t) {
    const f = [];
    if (!t.dia) f.push('el día');
    if (!t.hora) f.push('el horario');
    if (!t.motivo) f.push('el motivo');
    return f;
}

function buildTurnoMessage(t) {
    let msg = 'Hola Dra. Elosegui! Quiero confirmar este turno:\n\n';
    msg += `📅 ${t.dia.nombre} ${t.dia.label}\n`;
    msg += `🕐 ${t.hora} hs\n`;
    msg += `🦷 Motivo: ${t.motivo.label}\n`;
    if (t.nombre) msg += `🙋 Nombre: ${t.nombre}\n`;
    msg += '\n¿Queda confirmado?';
    return `https://wa.me/${WSP}?text=` + encodeURIComponent(msg);
}

function showToast(msg) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
    wrap.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
        e.preventDefault();
    }
});

function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
    }, { passive: true });
}

function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    const header = document.querySelector('.site-header');
    if (!toggle || !nav) return;
    let bd = document.querySelector('.nav-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
    const close = () => {
        nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    };
    const open = () => {
        nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
        nav.querySelector('a')?.focus();
    };
    toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
    closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
    bd.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
    const mq = window.matchMedia('(min-width: 769px)');
    const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
    mq.addEventListener('change', sync);
    sync();
}

function initReveals() {
    const items = document.querySelectorAll('[data-animate]');
    if (!items.length) return;
    document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
        parent.querySelectorAll('[data-animate]').forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
        });
    });
    if (!('IntersectionObserver' in window) || reduceMotion) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    items.forEach(el => io.observe(el));

    let queued = false;
    const sweep = () => {
        queued = false;
        let pending = 0;
        items.forEach(el => {
            if (el.classList.contains('in')) return;
            const r = el.getBoundingClientRect();
            if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
            else pending++;
        });
        if (!pending) {
            window.removeEventListener('scroll', queueSweep);
            window.removeEventListener('resize', queueSweep);
        }
    };
    const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
    window.addEventListener('load', queueSweep);
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
}

const FDI_INFERIOR = ['47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37'];
const IDX_FRONT = [4, 5, 6, 7, 8, 9];
const IDX_MISSING = 12;
const TILTS_FRONT = [-7, 5, -4, 6, -6, 4];

function buildOdontograma() {
    const svg = document.getElementById('odoSvg');
    if (!svg) return;
    const NS = 'http://www.w3.org/2000/svg';
    const cx = 320, cy = 20, R = 300;
    const total = FDI_INFERIOR.length;

    const encia = document.createElementNS(NS, 'path');
    const arcFrom = anguloDe(0, total, -52, 52), arcTo = anguloDe(total - 1, total, -52, 52);
    const p1 = punto(cx, cy, R - 44, arcFrom), p2 = punto(cx, cy, R - 44, arcTo);
    encia.setAttribute('d', `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${R - 44} ${R - 44} 0 0 0 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
    encia.setAttribute('class', 'encia');
    svg.appendChild(encia);

    FDI_INFERIOR.forEach((num, i) => {
        const phi = anguloDe(i, total, -52, 52);
        const pos = punto(cx, cy, R, phi);
        const esMolar = i <= 1 || i >= 12;
        const esPremolar = (i >= 2 && i <= 3) || (i >= 10 && i <= 11);
        const w = esMolar ? 46 : esPremolar ? 40 : 34;
        const h = esMolar ? 52 : 56;

        const g = document.createElementNS(NS, 'g');
        let cls = 'diente';
        if (IDX_FRONT.includes(i)) cls += ' g-front';
        if (i === IDX_MISSING) cls += ' g-missing';
        g.setAttribute('class', cls);
        g.setAttribute('transform', `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)}) rotate(${(-phi).toFixed(1)})`);

        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('class', 'diente-rect');
        rect.setAttribute('x', -w / 2);
        rect.setAttribute('y', -h / 2);
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
        rect.setAttribute('rx', esMolar ? 15 : 12);
        const fIdx = IDX_FRONT.indexOf(i);
        if (fIdx > -1) rect.style.setProperty('--tilt', `${TILTS_FRONT[fIdx]}deg`);
        rect.style.setProperty('--d', `${i * 0.06}s`);
        g.appendChild(rect);

        const t = document.createElementNS(NS, 'text');
        t.setAttribute('class', 'diente-num');
        t.setAttribute('y', h / 2 + 22);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('transform', `rotate(${phi.toFixed(1)})`);
        t.textContent = num;
        g.appendChild(t);

        if (i === IDX_MISSING) {
            const pin = document.createElementNS(NS, 'line');
            pin.setAttribute('class', 'implante-pin');
            pin.setAttribute('x1', 0); pin.setAttribute('y1', h / 2 + 4);
            pin.setAttribute('x2', 0); pin.setAttribute('y2', h / 2 + 16);
            g.appendChild(pin);
            const pin2 = document.createElementNS(NS, 'line');
            pin2.setAttribute('class', 'implante-pin');
            pin2.setAttribute('x1', -6); pin2.setAttribute('y1', h / 2 + 16);
            pin2.setAttribute('x2', 6); pin2.setAttribute('y2', h / 2 + 16);
            g.appendChild(pin2);
        }
        svg.appendChild(g);
    });

    const brillo = document.createElementNS(NS, 'path');
    brillo.setAttribute('class', 'brillo');
    brillo.setAttribute('d', 'M320 236l5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12z');
    svg.appendChild(brillo);
}

function anguloDe(i, total, desde, hasta) {
    return desde + (hasta - desde) * (i / (total - 1));
}
function punto(cx, cy, r, gradosPhi) {
    const rad = gradosPhi * Math.PI / 180;
    return { x: cx + r * Math.sin(rad), y: cy + r * Math.cos(rad) };
}

const ODO_CAPTIONS = [
    '28 piezas controladas, una por una.',
    'Los frontales se alinean: el mapa se ordena.',
    'La pieza 36 vuelve a la ficha, fija y funcional.',
    'Mapa completo. Ahora, que brille.',
];

function setOdoStep(n) {
    const svg = document.getElementById('odoSvg');
    if (!svg) return;
    for (let k = 0; k <= 3; k++) svg.classList.toggle('s' + k, k <= n);
    document.querySelectorAll('.odo-step').forEach(el => {
        el.classList.toggle('is-on', Number(el.dataset.step) === n);
    });
    const cap = document.getElementById('odoCaption');
    if (cap && ODO_CAPTIONS[n]) cap.textContent = ODO_CAPTIONS[n];
}

function initOdoChapters() {
    const steps = document.querySelectorAll('.odo-step');
    if (!steps.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
        setOdoStep(3);
        document.querySelectorAll('.odo-step').forEach(el => el.classList.add('is-on'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) setOdoStep(Number(en.target.dataset.step));
        });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    steps.forEach(el => io.observe(el));
}

const turno = { dia: null, hora: '', motivo: null, nombre: '' };

function renderTurnero() {
    const dias = generarDias(new Date(), 10);
    const rail = document.getElementById('diasRail');
    rail.innerHTML = dias.map((d, i) =>
        `<button type="button" class="dia-chip" data-dia="${i}" aria-pressed="false"><b>${d.abbr}</b><span>${d.label}</span></button>`
    ).join('');
    rail.querySelectorAll('.dia-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            turno.dia = dias[Number(btn.dataset.dia)];
            rail.querySelectorAll('.dia-chip').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            updateResumen();
        });
    });

    const horas = document.getElementById('horasGrid');
    horas.innerHTML = HORARIOS.map(h =>
        `<button type="button" class="hora-chip" data-hora="${h}" aria-pressed="false">${h}</button>`
    ).join('');
    horas.querySelectorAll('.hora-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            turno.hora = btn.dataset.hora;
            horas.querySelectorAll('.hora-chip').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            updateResumen();
        });
    });

    const motivos = document.getElementById('motivosGrid');
    motivos.innerHTML = MOTIVOS.map(m =>
        `<button type="button" class="motivo-chip" data-motivo="${m.id}" aria-pressed="false">${esc(m.label)}</button>`
    ).join('');
    motivos.querySelectorAll('.motivo-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            turno.motivo = MOTIVOS.find(m => m.id === btn.dataset.motivo) || null;
            motivos.querySelectorAll('.motivo-chip').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            updateResumen();
        });
    });

    document.getElementById('turnoNombre').addEventListener('input', e => {
        turno.nombre = e.target.value.trim();
        updateResumen();
    });

    document.getElementById('turnoBtn').addEventListener('click', e => {
        const faltan = turnoFaltantes(turno);
        if (faltan.length) {
            e.preventDefault();
            showToast(`Te falta elegir ${faltan.join(' y ')}.`);
        }
    });

    updateResumen();
}

function updateResumen() {
    const texto = document.getElementById('resumenTexto');
    const btn = document.getElementById('turnoBtn');
    const faltan = turnoFaltantes(turno);
    if (faltan.length) {
        texto.textContent = faltan.length === 3
            ? 'Elegí día, horario y motivo para armar tu turno.'
            : `Casi listo: te falta elegir ${faltan.join(' y ')}.`;
        btn.setAttribute('href', '#');
        btn.setAttribute('aria-disabled', 'true');
        return;
    }
    texto.textContent = `${turno.dia.nombre} ${turno.dia.label} · ${turno.hora} hs · ${turno.motivo.label}` + (turno.nombre ? ` — a nombre de ${turno.nombre}` : '');
    btn.setAttribute('href', buildTurnoMessage(turno));
    btn.removeAttribute('aria-disabled');
}

function initHeroIntro() {
    const linePath = document.querySelector('.hero-tooth-line path');
    const showAll = () => {
        document.querySelectorAll('.hero-title .line-inner, .hero-sub, .hero-cta, .hero-note, .hero-arc, .hero-cut, .hero-tooth-line, .ficha-turno').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = el.classList.contains('ficha-turno') ? 'rotate(-2deg)' : 'none';
        });
        if (linePath) linePath.style.strokeDashoffset = '0';
    };
    if (typeof gsap === 'undefined' || reduceMotion) { showAll(); return; }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero-title .line-inner', { y: 0, duration: 1.05, stagger: 0.14 }, 0.1)
      .to('.hero-arc', { opacity: 1, scale: 1, duration: 1.2 }, 0.2)
      .to('.hero-cut', { opacity: 1, y: 0, duration: 1.15 }, 0.4)
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.85 }, 0.55)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.85 }, 0.7)
      .to('.hero-tooth-line', { opacity: 1, duration: 0.5 }, 0.85)
      .to('.hero-tooth-line path', { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0.85)
      .to('.ficha-turno', { opacity: 1, y: -8, rotate: -2, duration: 0.8 }, 1)
      .to('.hero-note', { opacity: 1, duration: 0.7 }, 1.1);
}

function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
    [['.doctora-ph img', -7], ['.turnos-ph img', 6]].forEach(([sel, amt]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        gsap.fromTo(el, { yPercent: -Math.abs(amt) / 2 }, {
            yPercent: Math.abs(amt) / 2,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
        el.style.scale = '1.12';
    });
}

function initMapa() {
    const cont = document.getElementById('mapa');
    if (!cont || typeof L === 'undefined') return;
    const map = L.map('mapa', { scrollWheelZoom: false, attributionControl: true });
    map.setView([-40.8135, -62.9967], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    L.circleMarker([-40.8135, -62.9967], {
        radius: 11, color: '#14706A', weight: 3, fillColor: '#7FD6CC', fillOpacity: 0.85,
    }).addTo(map).bindPopup('<b>Consultorio Dra. Elosegui</b><br>Centro de Viedma — dirección exacta al confirmar tu turno.');
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

buildOdontograma();
initOdoChapters();
renderTurnero();
initReveals();
initHeroIntro();
initParallax();
initMapa();
initWspFloat();
initNav();

document.querySelectorAll('.faq details').forEach(det => {
    det.addEventListener('toggle', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
});
