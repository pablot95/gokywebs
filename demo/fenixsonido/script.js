const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const MED = 'images/';

const MOMENTOS = [
  {
    hora: '21:30', nombre: 'Recepción', bpm: 108, energia: .34, audio: 'sample-coctel.mp3', set: 'Set de recepción',
    txt: 'Los invitados van llegando y todavía se puede charlar. Música de fondo, volumen bajo y luz cálida para que las fotos salgan bien.',
    gen: ['Lounge', 'Soul suave', 'Bossa'],
  },
  {
    hora: '00:30', nombre: 'Se abre la pista', bpm: 102, energia: .72, audio: 'sample-fiesta.mp3', set: 'Set de apertura',
    txt: 'El momento que define la fiesta. Arrancamos con lo que hace levantar a todo el mundo, de los abuelos a los primos chicos.',
    gen: ['Cumbia', 'Cuarteto', 'Clásicos'],
  },
  {
    hora: '02:00', nombre: 'El peak', bpm: 94, energia: 1, audio: 'sample-urbano.mp3', set: 'Set del peak',
    txt: 'Pista llena, humo y cabezales a full. Acá es donde el sonido tiene que aguantar sin distorsionar: por eso medimos el salón antes.',
    gen: ['Reggaetón', 'Urbano', 'Remixes'],
  },
  {
    hora: '04:00', nombre: 'El cierre', bpm: 124, energia: .84, audio: 'sample-electronica.mp3', set: 'Set de cierre',
    txt: 'Quedan los que se quedan hasta el final. Bajamos las luces, subimos el pulso y cerramos con electrónica hasta la última tanda.',
    gen: ['House', 'Electrónica', 'After'],
  },
];

const REELS = [
  { video: 'fenix-reel-fiesta.mp4', poster: 'poster-fiesta.webp', titulo: 'Pista llena a las 3 AM', sub: 'Casamiento · Neuquén capital' },
  { video: 'fenix-reel-ambiente.mp4', poster: 'poster-ambiente.webp', titulo: 'Salón ambientado', sub: 'Techo decorado + cabina iluminada' },
  { video: 'fenix-reel-pista.mp4', poster: 'poster-pista.webp', titulo: 'Pista iluminada', sub: 'Fiesta de 15 · Plottier' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const ICO_PLAY = '<svg class="ico-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg><svg class="ico-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/></svg>';

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

/* ---------- audio ---------- */
const player = {
  el: null, ctx: null, analyser: null, freq: null, actual: -1, sonando: false, listo: false,
};

function initAudio() {
  player.el = new window.Audio();
  player.el.preload = 'none';
  player.el.loop = true;
  player.el.addEventListener('timeupdate', () => {
    const f = document.getElementById('playerFill');
    if (f && player.el.duration) f.style.width = (player.el.currentTime / player.el.duration * 100) + '%';
  });
  player.el.addEventListener('ended', () => setSonando(false));
  player.el.addEventListener('pause', () => setSonando(false));
  player.el.addEventListener('play', () => setSonando(true));
}

function conectarAnalyser() {
  if (player.listo) return;
  player.listo = true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    player.ctx = new AC();
    const src = player.ctx.createMediaElementSource(player.el);
    player.analyser = player.ctx.createAnalyser();
    player.analyser.fftSize = 128;
    player.analyser.smoothingTimeConstant = .78;
    src.connect(player.analyser);
    player.analyser.connect(player.ctx.destination);
    player.freq = new Uint8Array(player.analyser.frequencyBinCount);
  } catch {
    player.ctx = null;
    player.analyser = null;
    player.freq = null;
  }
}

function setSonando(v) {
  player.sonando = v;
  const bar = document.getElementById('player');
  bar.classList.toggle('playing', v);
  document.querySelectorAll('.play-set').forEach((b, i) => b.classList.toggle('playing', v && i === player.actual));
  if (v) loopCanvas();
}

function mostrarPlayer(i) {
  const bar = document.getElementById('player');
  bar.hidden = false;
  requestAnimationFrame(() => bar.classList.add('up'));
  document.getElementById('wsp-float').classList.add('up');
  document.getElementById('playerName').textContent = MOMENTOS[i].set + ' · ' + MOMENTOS[i].nombre;
}

function ocultarPlayer() {
  const bar = document.getElementById('player');
  bar.classList.remove('up');
  document.getElementById('wsp-float').classList.remove('up');
  setTimeout(() => { bar.hidden = true; }, 460);
}

function tocarSet(i) {
  if (!player.el) initAudio();
  if (player.actual === i && !player.el.paused) { player.el.pause(); return; }
  if (player.actual !== i) {
    player.actual = i;
    player.el.src = MED + MOMENTOS[i].audio;
  }
  conectarAnalyser();
  if (player.ctx && player.ctx.state === 'suspended') player.ctx.resume();
  mostrarPlayer(i);
  const p = player.el.play();
  if (p && p.catch) p.catch(() => showToast('Tocá el botón de nuevo para escuchar el set'));
}

/* ---------- canvas: ondas ---------- */
const BARS = 96;
const semilla = i => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
const barrasBase = [];
for (let i = 0; i < BARS; i++) {
  const seg = Math.min(MOMENTOS.length - 1, Math.floor(i / (BARS / MOMENTOS.length)));
  const local = (i % (BARS / MOMENTOS.length)) / (BARS / MOMENTOS.length);
  const swell = .78 + .22 * Math.sin(local * Math.PI);
  const acento = i % 6 === 0 ? 1.18 : (i % 3 === 0 ? 1 : .84);
  barrasBase.push(Math.min(1, MOMENTOS[seg].energia * swell * (.58 + .42 * semilla(i * 3.7)) * acento));
}

const lienzos = { wave: null, hero: null };
let progresoCurva = 0;
let rafOn = false;
let visibleWave = false;
let visibleHero = true;

function ajustar(canvas) {
  if (!canvas) return null;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth || canvas.parentElement.clientWidth;
  const h = parseInt(window.getComputedStyle(canvas).height, 10) || canvas.height;
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function nivel(i, segActivo) {
  let v = barrasBase[i];
  if (player.sonando && player.analyser && player.freq) {
    const seg = Math.min(MOMENTOS.length - 1, Math.floor(i / (BARS / MOMENTOS.length)));
    if (segActivo === null || seg === segActivo) {
      player.analyser.getByteFrequencyData(player.freq);
      const f = player.freq[Math.floor((i % (BARS / MOMENTOS.length)) / (BARS / MOMENTOS.length) * player.freq.length * .7)] / 255;
      v = clamp(v * .45 + f * .95, .04, 1);
    }
  }
  return v;
}

function dibujarWave(t) {
  const c = lienzos.wave;
  if (!c) return;
  const { ctx, w, h } = c;
  ctx.clearRect(0, 0, w, h);
  const bw = w / BARS;
  const gap = Math.max(1, bw * .34);
  const mid = h / 2;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#f4732b');
  grad.addColorStop(.5, '#d1530f');
  grad.addColorStop(1, '#f4732b');
  const head = progresoCurva * BARS;
  const segActivo = player.sonando ? player.actual : null;
  for (let i = 0; i < BARS; i++) {
    const on = i <= head;
    let v = on ? nivel(i, segActivo) : barrasBase[i] * .9;
    if (!reduceMotion && on) v *= .94 + .06 * Math.sin(t / 320 + i * .4);
    const bh = Math.max(2, v * h * .43);
    ctx.fillStyle = on ? grad : 'rgba(255,255,255,.12)';
    ctx.fillRect(i * bw, mid - bh, Math.max(1, bw - gap), bh * 2);
  }
  const hx = clamp(head * bw, 0, w - 1);
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.fillRect(hx, 6, 1.5, h - 12);
}

function dibujarHero(t) {
  const c = lienzos.hero;
  if (!c) return;
  const { ctx, w, h } = c;
  ctx.clearRect(0, 0, w, h);
  const n = Math.max(28, Math.round(w / 14));
  const bw = w / n;
  const gap = Math.max(1.5, bw * .38);
  for (let i = 0; i < n; i++) {
    let v = .18 + .26 * semilla(i * 7.1);
    if (!reduceMotion) v += .16 * Math.abs(Math.sin(t / 520 + i * .35)) + .1 * Math.abs(Math.sin(t / 190 + i));
    if (player.sonando && player.analyser && player.freq) {
      player.analyser.getByteFrequencyData(player.freq);
      v = clamp(.12 + (player.freq[Math.floor(i / n * player.freq.length * .75)] / 255) * 1.05, .06, 1);
    }
    const bh = Math.max(3, v * h * .92);
    ctx.fillStyle = i % 7 === 0 ? 'rgba(244,115,43,.95)' : 'rgba(209,83,15,.6)';
    ctx.fillRect(i * bw, h - bh, Math.max(1, bw - gap), bh);
  }
}

function loopCanvas() {
  if (rafOn) return;
  rafOn = true;
  const paso = t => {
    dibujarHero(t);
    if (visibleWave) dibujarWave(t);
    if (player.sonando || visibleHero || visibleWave) requestAnimationFrame(paso);
    else rafOn = false;
  };
  requestAnimationFrame(paso);
}

function initCanvas() {
  const wave = document.getElementById('waveCanvas');
  const hero = document.getElementById('heroCanvas');
  const medir = () => {
    lienzos.wave = ajustar(wave);
    lienzos.hero = ajustar(hero);
    dibujarHero(0);
    dibujarWave(0);
  };
  medir();
  let tr;
  window.addEventListener('resize', () => { clearTimeout(tr); tr = setTimeout(medir, 160); });
  window.addEventListener('load', medir);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.target === wave) visibleWave = e.isIntersecting;
        if (e.target === hero) visibleHero = e.isIntersecting;
      });
      if (visibleWave || visibleHero || player.sonando) loopCanvas();
    }, { threshold: 0 });
    io.observe(wave);
    io.observe(hero);
  } else {
    visibleWave = true;
  }
  loopCanvas();
}

/* ---------- momentos ---------- */
function renderMomentos() {
  const cont = document.getElementById('momentos');
  if (!cont) return;
  cont.innerHTML = MOMENTOS.map((m, i) => `<li class="momento ${i === 0 ? 'is-on' : ''}" data-momento="${i}">
    <span class="momento-top">${esc(m.hora)} · Momento 0${i + 1}</span>
    <h3>${esc(m.nombre)}</h3>
    <div class="momento-cuerpo"><div>
      <p>${esc(m.txt)}</p>
      <div class="momento-gen">${m.gen.map(g => `<span>${esc(g)}</span>`).join('')}</div>
      <button type="button" class="play-set" data-set="${i}">
        <span aria-hidden="true">${ICO_PLAY}</span>
        Escuchar ${esc(m.set.toLowerCase())}
      </button>
    </div></div>
  </li>`).join('');
}

function renderReels() {
  const cont = document.getElementById('reels');
  if (!cont) return;
  cont.innerHTML = REELS.map((r, i) => `<button type="button" class="reel" data-reel="${i}" data-animate style="transform:translateY(30px);opacity:0" aria-label="Ver ${esc(r.titulo)} en grande">
    <span class="reel-media">
      <video src="${MED}${r.video}" poster="${MED}${r.poster}" width="478" height="850" muted loop playsinline preload="none"></video>
    </span>
    <span class="reel-lupa" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></span>
    <span class="reel-info"><strong>${esc(r.titulo)}</strong><span>${esc(r.sub)}</span></span>
  </button>`).join('');

  const vids = [...cont.querySelectorAll('video')];
  if (!('IntersectionObserver' in window) || reduceMotion) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => { }); } else { v.pause(); }
    });
  }, { threshold: .35 });
  vids.forEach(v => io.observe(v));
}

/* ---------- modal de reel ---------- */
let ultimoFoco = null;

function abrirReel(i) {
  const r = REELS[i];
  if (!r) return;
  const modal = document.getElementById('modal');
  const card = document.getElementById('modalCard');
  ultimoFoco = document.activeElement;
  card.innerHTML = `<button type="button" class="modal-close" id="modalClose" aria-label="Cerrar el video">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <video src="${MED}${r.video}" poster="${MED}${r.poster}" muted loop playsinline autoplay></video>
    <span class="modal-cap"><strong>${esc(r.titulo)}</strong> · ${esc(r.sub)}</span>`;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
  card.querySelector('video').play().catch(() => { });
  if (!player.sonando) tocarSet(1);
}

function cerrarReel() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; document.getElementById('modalCard').innerHTML = ''; }, 320);
  ultimoFoco?.focus();
}

/* ---------- la curva de la noche ---------- */
function initCurva() {
  const stage = document.getElementById('curvaStage');
  const seccion = document.getElementById('curva');
  if (!stage) return;
  const momentos = [...document.querySelectorAll('#momentos .momento')];
  const hora = document.getElementById('curvaHora');
  const bpm = document.getElementById('curvaBpm');
  const N = MOMENTOS.length;

  const setCurva = prog => {
    progresoCurva = clamp(prog, 0, 1);
    const idx = Math.min(N - 1, Math.floor(clamp(prog, 0, .9999) * N));
    momentos.forEach((m, i) => m.classList.toggle('is-on', i === idx));
    if (hora) hora.textContent = MOMENTOS[idx].hora;
    if (bpm) bpm.textContent = MOMENTOS[idx].bpm + ' BPM';
    seccion.style.setProperty('--heat', (0.15 + 0.85 * MOMENTOS[idx].energia).toFixed(2));
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    progresoCurva = 1;
    momentos.forEach(m => m.classList.add('is-on'));
    seccion.style.setProperty('--heat', '.6');
    return;
  }

  setCurva(0);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=300%', pin: true, scrub: .6,
      invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: self => setCurva(self.progress),
    });
    return () => st.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => setCurva(self.progress),
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
  });
}

/* ---------- hero ---------- */
function initHero() {
  const video = document.getElementById('heroVideo');
  if (video && !reduceMotion) {
    const con = navigator.connection;
    const liviano = con && (con.saveData || /2g/.test(con.effectiveType || ''));
    if (!liviano && window.matchMedia('(min-width: 700px)').matches) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          video.src = MED + 'fenix-hero-pista.mp4';
          video.play().then(() => video.classList.add('on')).catch(() => { });
        }, 900);
      });
    }
  }

  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-panel', { clipPath: 'inset(0 0 0 100%)', duration: 1.25, ease: 'power3.inOut' }, 0)
    .from('.hero-poster', { scale: 1.14, duration: 1.6, ease: 'power2.out' }, 0)
    .from('.hero-copy .eyebrow', { y: 16, opacity: 0, duration: .7 }, .15)
    .from('.hero-copy h1', { y: 30, opacity: 0, duration: .95, clipPath: 'inset(100% -6% -8% -3%)' }, .25)
    .from('.hero-copy p', { y: 18, opacity: 0, duration: .8 }, .5)
    .from('.hero-cta .btn', { y: 16, opacity: 0, duration: .7, stagger: .1 }, .62)
    .from('.hero-cut', { xPercent: -14, opacity: 0, duration: 1.1 }, .55)
    .from('.hero-glow', { scale: .5, opacity: 0, duration: 1.3 }, .3)
    .from('.hero-vu', { y: 40, opacity: 0, duration: .9 }, .8)
    .from('.hero-seal', { y: 20, opacity: 0, duration: .7 }, 1.05);

  if (typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(min-width:900px)').matches) {
    gsap.to('.hero-cut', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
    gsap.to('.hero-poster, .hero-video', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }
  gsap.fromTo('.tipo-gigante', { xPercent: -62 }, { xPercent: -38, ease: 'none', scrollTrigger: { trigger: '.equipo', start: 'top bottom', end: 'bottom top', scrub: .7 } });
}

/* ---------- reveals ---------- */
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.site-header').appendChild(bd); }
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
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function scrollA(el, extra) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - (extra || 80);
  window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initEventos() {
  document.addEventListener('click', e => {
    const set = e.target.closest('[data-set]');
    if (set) {
      const i = parseInt(set.dataset.set, 10) || 0;
      tocarSet(i);
      if (set.id === 'heroPlay') setTimeout(() => scrollA(document.getElementById('curva')), 120);
      return;
    }

    const reel = e.target.closest('[data-reel]');
    if (reel) { abrirReel(parseInt(reel.dataset.reel, 10)); return; }

    if (e.target.closest('#modalClose') || e.target.id === 'modal') { cerrarReel(); return; }

    const ancla = e.target.closest('a[href^="#"]');
    if (ancla) {
      const id = ancla.getAttribute('href').slice(1);
      const dest = id === 'top' ? document.body : document.getElementById(id);
      if (dest) {
        e.preventDefault();
        if (!document.getElementById('modal').hidden) cerrarReel();
        if (id === 'top') window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        else scrollA(dest);
      }
    }
  });

  document.getElementById('playerBtn').addEventListener('click', () => {
    if (!player.el) return;
    if (player.el.paused) { if (player.ctx?.state === 'suspended') player.ctx.resume(); player.el.play().catch(() => { }); }
    else player.el.pause();
  });
  document.getElementById('playerClose').addEventListener('click', () => {
    player.el?.pause();
    ocultarPlayer();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modal').hidden) cerrarReel();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  renderMomentos();
  renderReels();
  initAudio();
  initCanvas();

  initNav();
  initEventos();
  initHero();
  initCurva();
  initReveals();
  initWspFloat();

  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
});
