const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492614685816';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const RUBROS = { peluqueria: 'Peluquería', unas: 'Uñas', masajes: 'Masajes', depilacion: 'Depilación' };

const SERVICIOS = [
  { id: 'corte', rubro: 'peluqueria', nombre: 'Corte y peinado', min: 45, precio: 22000 },
  { id: 'brushing', rubro: 'peluqueria', nombre: 'Brushing', min: 40, precio: 14000 },
  { id: 'color', rubro: 'peluqueria', nombre: 'Color completo', min: 120, precio: 48000 },
  { id: 'mechas', rubro: 'peluqueria', nombre: 'Mechas o balayage', min: 180, precio: 78000 },
  { id: 'semi', rubro: 'unas', nombre: 'Manicura semipermanente', min: 60, precio: 17000 },
  { id: 'kapping', rubro: 'unas', nombre: 'Kapping en gel', min: 75, precio: 22000 },
  { id: 'esculpidas', rubro: 'unas', nombre: 'Uñas esculpidas', min: 120, precio: 30000 },
  { id: 'pedicura', rubro: 'unas', nombre: 'Pedicura semipermanente', min: 60, precio: 19000 },
  { id: 'descontracturante', rubro: 'masajes', nombre: 'Descontracturante', min: 50, precio: 28000 },
  { id: 'relajante', rubro: 'masajes', nombre: 'Relajante con aceites', min: 60, precio: 30000 },
  { id: 'piedras', rubro: 'masajes', nombre: 'Piedras calientes', min: 75, precio: 36000 },
  { id: 'drenaje', rubro: 'masajes', nombre: 'Drenaje linfático', min: 60, precio: 32000 },
  { id: 'rostro', rubro: 'depilacion', nombre: 'Rostro: cejas y bozo', min: 20, precio: 9000 },
  { id: 'axilas', rubro: 'depilacion', nombre: 'Axilas', min: 15, precio: 7000 },
  { id: 'cavado', rubro: 'depilacion', nombre: 'Cavado', min: 30, precio: 12000 },
  { id: 'piernas', rubro: 'depilacion', nombre: 'Piernas completas', min: 45, precio: 19000 }
];

const AGENDA = { dias: [1, 2, 3, 4, 5, 6], abre: 9 * 60, cierra: 20 * 60, paso: 30, anticipacion: 120 };
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const ICO_MAS = '<svg class="ico ico-mas" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const ICO_OK = '<svg class="ico ico-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICO_X = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

const precio = n => '$' + Math.round(n).toLocaleString('es-AR');
const dosDigitos = n => String(n).padStart(2, '0');
const hhmm = m => `${dosDigitos(Math.floor(m / 60))}:${dosDigitos(m % 60)}`;
const capitalizar = s => s.charAt(0).toUpperCase() + s.slice(1);
const duracion = min => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};
const getServicio = id => SERVICIOS.find(s => s.id === id);
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const Visita = {
  ids: ['corte'],
  bar: '',
  tiene(id) { return this.ids.includes(id); },
  sumar(id) {
    if (!getServicio(id) || this.tiene(id)) return;
    this.ids.push(id);
    this.avisar();
  },
  quitar(id) {
    if (!this.tiene(id)) return;
    this.ids = this.ids.filter(x => x !== id);
    this.avisar();
  },
  alternar(id) { if (this.tiene(id)) this.quitar(id); else this.sumar(id); },
  servicios() { return this.ids.map(getServicio).filter(Boolean); },
  minutos() { return this.servicios().reduce((s, x) => s + x.min, 0); },
  total() { return this.servicios().reduce((s, x) => s + x.precio, 0); },
  avisar() { document.dispatchEvent(new CustomEvent('visita:cambio')); }
};

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

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 1101px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

function initEstado() {
  const cajas = document.querySelectorAll('[data-estado]');
  if (!cajas.length) return;
  const ahora = new Date();
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const abreHoy = AGENDA.dias.includes(ahora.getDay());
  const abierto = abreHoy && min >= AGENDA.abre && min < AGENDA.cierra;
  let texto = `Abierto ahora · hasta las ${AGENDA.cierra / 60} h`;
  if (!abierto) {
    if (abreHoy && min < AGENDA.abre) {
      texto = `Cerrado · abrimos hoy a las ${AGENDA.abre / 60} h`;
    } else {
      let d = 1;
      while (!AGENDA.dias.includes(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + d).getDay())) d++;
      const dia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + d);
      const cuando = d === 1 ? 'mañana' : `el ${DIAS_LARGOS[dia.getDay()]}`;
      texto = `Cerrado · abrimos ${cuando} a las ${AGENDA.abre / 60} h`;
    }
  }
  cajas.forEach(caja => {
    caja.classList.toggle('estado--cerrado', !abierto);
    const span = caja.querySelector('[data-estado-texto]');
    if (span) span.textContent = texto;
  });
}

function initCarta() {
  document.querySelectorAll('[data-lineas]').forEach(ul => {
    ul.innerHTML = SERVICIOS.filter(s => s.rubro === ul.dataset.lineas).map(s => `
      <li><button type="button" class="linea" data-servicio="${s.id}" aria-pressed="false">
        <span class="linea__fila"><span class="linea__nombre">${esc(s.nombre)}</span><span class="linea__puntos" aria-hidden="true"></span><span class="linea__precio">${precio(s.precio)}</span></span>
        <span class="linea__min">${duracion(s.min)}</span>
        <span class="linea__check" aria-hidden="true">${ICO_MAS}${ICO_OK}</span>
      </button></li>`).join('');
  });
  document.querySelectorAll('[data-desde]').forEach(el => {
    const precios = SERVICIOS.filter(s => s.rubro === el.dataset.desde).map(s => s.precio);
    if (precios.length) el.textContent = `Desde ${precio(Math.min(...precios))}`;
  });
  const sincronizar = () => {
    document.querySelectorAll('.linea').forEach(b => b.setAttribute('aria-pressed', String(Visita.tiene(b.dataset.servicio))));
  };
  document.addEventListener('click', e => {
    const boton = e.target.closest('.linea');
    if (!boton) return;
    const s = getServicio(boton.dataset.servicio);
    if (!s) return;
    const estaba = Visita.tiene(s.id);
    Visita.alternar(s.id);
    if (estaba) showToast(`Sacaste ${s.nombre} de tu turno`);
    else showToast(`Sumaste ${s.nombre}: tu turno dura ${duracion(Visita.minutos())}`);
  });
  document.addEventListener('visita:cambio', sincronizar);
  sincronizar();
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab[data-tab]')];
  if (!tabs.length) return null;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
  return rubro => {
    const t = tabs.find(x => x.dataset.tab === rubro);
    if (t) activar(t);
  };
}

function initIrRubro(activarTab) {
  let timer = 0;
  document.querySelectorAll('[data-ir-rubro]').forEach(link => {
    link.addEventListener('click', () => {
      const rubros = link.dataset.irRubro.split(' ');
      if (activarTab) { activarTab(rubros[0]); return; }
      const piezas = rubros.map(r => document.querySelector(`.carta__pieza[data-rubro="${r}"]`)).filter(Boolean);
      document.querySelectorAll('.carta__pieza.is-foco').forEach(p => p.classList.remove('is-foco'));
      piezas.forEach(p => p.classList.add('is-foco'));
      clearTimeout(timer);
      timer = setTimeout(() => piezas.forEach(p => p.classList.remove('is-foco')), 2600);
    });
  });
}

const inicioDia = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const claveDia = d => `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;

function horariosDelDia(fecha, min) {
  if (!min || !AGENDA.dias.includes(fecha.getDay())) return [];
  const limite = Date.now() + AGENDA.anticipacion * 60000;
  const salida = [];
  for (let m = AGENDA.abre; m + min <= AGENDA.cierra; m += AGENDA.paso) {
    const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), Math.floor(m / 60), m % 60);
    if (inicio.getTime() >= limite) salida.push(m);
  }
  return salida;
}

function proximosDias(cantidad, min) {
  const hoy = inicioDia(new Date());
  const salida = [];
  for (let d = 0; salida.length < cantidad && d < 21; d++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + d);
    if (!AGENDA.dias.includes(fecha.getDay())) continue;
    salida.push({ fecha, clave: claveDia(fecha), dif: d, horarios: horariosDelDia(fecha, min) });
  }
  return salida;
}

const nombreCorto = dia => (dia.dif === 0 ? 'Hoy' : dia.dif === 1 ? 'Mañana' : `${DIAS_CORTOS[dia.fecha.getDay()]} ${dia.fecha.getDate()}`);
const nombreVisible = dia => (dia.dif === 0 ? 'Hoy' : dia.dif === 1 ? 'Mañana' : `${capitalizar(DIAS_LARGOS[dia.fecha.getDay()])} ${dia.fecha.getDate()}`);
const nombreMensaje = dia => (dia.dif === 0 ? 'hoy' : dia.dif === 1 ? 'mañana' : `el ${DIAS_LARGOS[dia.fecha.getDay()]} ${dia.fecha.getDate()}/${dia.fecha.getMonth() + 1}`);

function initTurnero() {
  const caja = document.getElementById('turnero');
  if (!caja) return;
  const lista = document.getElementById('visitaLista');
  const vacia = document.getElementById('visitaVacia');
  const select = document.getElementById('sumarServicio');
  const minEl = document.getElementById('visitaMin');
  const totalEl = document.getElementById('visitaTotal');
  const barEl = document.getElementById('turnoBar');
  const etiEl = document.getElementById('turnoEti');
  const cuandoEl = document.getElementById('turnoCuando');
  const salidaEl = document.getElementById('turnoSalida');
  const diasEl = document.getElementById('turnoDias');
  const horasEl = document.getElementById('turnoHoras');
  const cta = document.getElementById('turnoCta');
  if (!lista || !select || !diasEl || !horasEl || !cta) return;

  const estado = { dia: null, hora: null, manual: false };
  let dias = [];
  let primero = null;

  select.innerHTML = '<option value="">Elegí un servicio…</option>' + Object.entries(RUBROS).map(([clave, nombre]) =>
    `<optgroup label="${esc(nombre)}">${SERVICIOS.filter(s => s.rubro === clave).map(s => `<option value="${s.id}">${esc(s.nombre)} · ${duracion(s.min)}</option>`).join('')}</optgroup>`
  ).join('');

  const diaElegido = () => dias.find(d => d.clave === estado.dia) || null;

  const mensaje = () => {
    const servicios = Visita.servicios();
    if (!servicios.length) return 'Hola, quiero pedir un turno en Innova.';
    const lineas = ['Hola, quiero pedir un turno en Innova:'];
    servicios.forEach(s => lineas.push(`· ${s.nombre} (${duracion(s.min)})`));
    lineas.push(`Duración total: ${duracion(Visita.minutos())} · Total estimado: ${precio(Visita.total())}`);
    const dia = diaElegido();
    if (dia && estado.hora !== null) lineas.push(`¿Tienen lugar ${nombreMensaje(dia)} a las ${hhmm(estado.hora)}?`);
    if (Visita.bar) lineas.push(`Del mini bar: ${Visita.bar}.`);
    return lineas.join('\n');
  };

  const pintarCta = () => {
    const msg = mensaje();
    cta.dataset.wspMsg = msg;
    cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  };

  const pintarElegido = () => {
    const min = Visita.minutos();
    const dia = diaElegido();
    if (!min) {
      etiEl.textContent = 'Tu turno';
      cuandoEl.textContent = 'Elegí un servicio';
      salidaEl.textContent = 'Y te mostramos el primer horario libre.';
    } else if (!dia || estado.hora === null) {
      etiEl.textContent = 'Tu turno';
      cuandoEl.textContent = 'Lo armamos por mensaje';
      salidaEl.textContent = 'Tu visita dura más que un día de trabajo: escribinos y la dividimos en dos turnos.';
    } else {
      const esPrimero = primero && primero.clave === dia.clave && primero.hora === estado.hora;
      etiEl.textContent = esPrimero ? 'Primer horario libre' : 'Tu horario';
      cuandoEl.innerHTML = `${esc(nombreVisible(dia))} · <b>${hhmm(estado.hora)}</b>`;
      salidaEl.textContent = `Terminás a las ${hhmm(estado.hora + min)} · ${duracion(min)} en total`;
    }
    pintarCta();
  };

  const pintarHoras = () => {
    const min = Visita.minutos();
    const dia = diaElegido();
    if (!min || !dia) {
      horasEl.innerHTML = `<p class="horas__vacio">${min ? 'No hay un día con lugar para todo junto.' : 'Sumá un servicio para ver los horarios.'}</p>`;
      return;
    }
    horasEl.innerHTML = dia.horarios.map(m => `<label class="pildora"><input type="radio" name="turno-hora" value="${m}"${m === estado.hora ? ' checked' : ''}><span>${hhmm(m)}</span></label>`).join('');
  };

  const pintarDias = () => {
    diasEl.innerHTML = dias.map(d => {
      const libre = d.horarios.length > 0;
      const hora = libre ? hhmm(d.horarios[0]) : '—<span class="sr-only"> sin lugar</span>';
      return `<label class="dia"><input type="radio" name="turno-dia" value="${d.clave}"${d.clave === estado.dia ? ' checked' : ''}${libre ? '' : ' disabled'}><span class="dia__txt"><span class="dia__nombre">${esc(nombreCorto(d))}</span><span class="dia__hora">${hora}</span></span></label>`;
    }).join('');
  };

  const pintar = () => {
    const servicios = Visita.servicios();
    const min = Visita.minutos();
    lista.innerHTML = servicios.map(s => `
      <li><span><span class="visita__nombre">${esc(s.nombre)}</span><span class="visita__meta">${duracion(s.min)} · ${precio(s.precio)}</span></span><button type="button" class="visita__quitar" data-quitar="${s.id}" aria-label="Sacar ${esc(s.nombre)} del turno">${ICO_X}</button></li>`).join('');
    lista.hidden = servicios.length === 0;
    vacia.hidden = servicios.length > 0;
    minEl.textContent = min ? duracion(min) : '—';
    totalEl.textContent = min ? precio(Visita.total()) : '—';
    select.querySelectorAll('option').forEach(o => { if (o.value) o.disabled = Visita.tiene(o.value); });

    dias = proximosDias(6, min);
    const conLugar = dias.filter(d => d.horarios.length);
    primero = conLugar[0] ? { clave: conLugar[0].clave, hora: conLugar[0].horarios[0] } : null;
    const actual = diaElegido();
    if (!estado.manual || !actual || !actual.horarios.length) {
      estado.dia = primero ? primero.clave : null;
      estado.hora = primero ? primero.hora : null;
    } else if (!actual.horarios.includes(estado.hora)) {
      estado.hora = actual.horarios[0];
    }
    pintarDias();
    pintarHoras();
    pintarElegido();
    refrescar();
  };

  lista.addEventListener('click', e => {
    const boton = e.target.closest('[data-quitar]');
    if (!boton) return;
    const s = getServicio(boton.dataset.quitar);
    Visita.quitar(boton.dataset.quitar);
    if (s) showToast(`Sacaste ${s.nombre} de tu turno`);
  });

  select.addEventListener('change', () => {
    const s = getServicio(select.value);
    select.value = '';
    if (!s) return;
    Visita.sumar(s.id);
    showToast(`Sumaste ${s.nombre}: tu turno dura ${duracion(Visita.minutos())}`);
  });

  diasEl.addEventListener('change', e => {
    if (e.target.name !== 'turno-dia') return;
    estado.dia = e.target.value;
    estado.hora = diaElegido()?.horarios[0] ?? null;
    estado.manual = true;
    pintarHoras();
    pintarElegido();
  });

  horasEl.addEventListener('change', e => {
    if (e.target.name !== 'turno-hora') return;
    estado.hora = Number(e.target.value);
    estado.manual = true;
    pintarElegido();
  });

  barEl?.addEventListener('change', e => {
    if (e.target.name !== 'turno-bar') return;
    Visita.bar = e.target.value;
    pintarCta();
  });

  document.addEventListener('visita:cambio', pintar);
  pintar();
}

function initEscena() {
  const escena = document.getElementById('escena');
  if (!escena) return;
  const sticky = escena.querySelector('.escena__sticky');
  const kelvin = document.getElementById('escenaK');
  if (!sticky || !kelvin) return;
  const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const K_SALON = 5500;
  const K_CABINA = 2700;

  const aplicar = p => {
    const barrido = Math.min(1, Math.max(0, (p - 0.08) / 0.8));
    const w = 100 - barrido * 100;
    escena.style.setProperty('--p', `${w.toFixed(2)}%`);
    escena.style.setProperty('--lo', w > 99.5 || w < 0.5 ? '0' : '1');
    const k = Math.round((K_CABINA + (K_SALON - K_CABINA) * (w / 100)) / 100) * 100;
    kelvin.textContent = `${k.toLocaleString('es-AR')} K`;
  };

  if (reduceMotion) { aplicar(1); return; }

  let pedido = false;
  const pintar = () => {
    pedido = false;
    const recorrido = escena.offsetHeight - sticky.offsetHeight;
    const avance = OFF - escena.getBoundingClientRect().top;
    aplicar(Math.min(1, Math.max(0, avance / (recorrido || 1))));
  };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pintar);
  pintar();
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescar));
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const boton = document.getElementById('formEnviar');
  const campos = [
    { input: form.querySelector('#f-nombre'), error: form.querySelector('#e-nombre'), test: v => v.trim().length >= 2, msg: 'Poné tu nombre así sabemos cómo llamarte.' },
    { input: form.querySelector('#f-tel'), error: form.querySelector('#e-tel'), test: v => v.replace(/\D/g, '').length >= 8, msg: 'Dejanos un WhatsApp con característica.' },
    { input: form.querySelector('#f-msg'), error: form.querySelector('#e-msg'), test: v => v.trim().length >= 6, msg: 'Contanos qué te querés hacer, aunque sea en una línea.' }
  ];
  campos.forEach(campo => {
    campo.input?.addEventListener('input', () => {
      if (campo.test(campo.input.value)) {
        campo.input.removeAttribute('aria-invalid');
        campo.error.textContent = '';
      }
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    campos.forEach(campo => {
      if (!campo.input) return;
      if (campo.test(campo.input.value)) {
        campo.input.removeAttribute('aria-invalid');
        campo.error.textContent = '';
      } else {
        campo.input.setAttribute('aria-invalid', 'true');
        campo.error.textContent = campo.msg;
        ok = false;
      }
    });
    if (!ok) { campos.find(c => c.input?.getAttribute('aria-invalid'))?.input.focus(); return; }
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = textoOriginal;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const heroImg = document.querySelector('.hero__foto img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power2.out' });

  if (typeof ScrollTrigger === 'undefined') return;
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: heroImg.closest('.hero'), start: 'top top', end: 'bottom top', scrub: true }
    });
  }
  document.querySelectorAll('.js-paral').forEach(el => {
    gsap.fromTo(el, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
  initModelBarScroll();
  initNav();
  initWspFloat();
  initWspLinks();
  initEstado();
  initCarta();
  initIrRubro(initTabs());
  initTurnero();
  initEscena();
  initFaq();
  initForm();
  initMovimiento();
  initReveals();
});
