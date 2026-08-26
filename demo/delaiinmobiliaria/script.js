(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ================= DATA ================= */
  const PROPIEDADES = [
    {
      id: 1, slug: 'ph-echesortu-2-dormitorios', titulo: 'PH en Echesortu',
      operacion: 'alquiler', tipo: 'PH', estado: 'usado',
      precio: 420000, moneda: 'ARS', expensas: 0,
      ciudad: 'Rosario', barrio: 'Echesortu', direccionAproximada: 'Zona Echesortu, a metros de Av. San Martín',
      dormitorios: 2, ambientes: 4, banos: 1, cocheras: 0,
      superficieTotal: 110, superficieCubierta: 95,
      descripcion: [
        'PH de 4 ambientes en Echesortu, a pocas cuadras de Av. San Martín y con fácil acceso a Bulevar Oroño. Living comedor amplio, dos dormitorios, cocina independiente y patio interno.',
        'Ideal para pareja o familia chica que busca ubicación céntrica sin resignar metros. Zona con comercios, transporte público y a distancia caminable del Parque Independencia.',
        'Se entrega en las condiciones que se muestran en las fotos. Consultas y visitas se coordinan por WhatsApp.',
      ],
      caracteristicas: ['Living comedor amplio', 'Cocina independiente', 'Patio interno', 'A metros de Av. San Martín'],
      etiquetas: ['ph', 'echesortu', 'alquiler', 'rosario'],
      coordenadasAproximadas: { lat: -32.9448, lng: -60.6652 },
      portada: 'images/living.webp',
      galeria: ['images/living.webp', 'images/otroliving.webp', 'images/cocina.webp', 'images/habitacion.webp'],
      destacada: true, nueva: false,
    },
    {
      id: 2, slug: 'departamento-puerto-norte-3-ambientes', titulo: 'Departamento en Puerto Norte',
      operacion: 'venta', tipo: 'Departamento', estado: 'muy buen estado',
      precio: 145000, moneda: 'USD', expensas: 95000,
      ciudad: 'Rosario', barrio: 'Puerto Norte', direccionAproximada: 'Puerto Norte, cerca de la costanera',
      dormitorios: 2, ambientes: 3, banos: 2, cocheras: 1,
      superficieTotal: 78, superficieCubierta: 72,
      descripcion: [
        'Departamento de 3 ambientes en uno de los edificios de Puerto Norte, con balcón y vista despejada. Living comedor integrado a la cocina, dos dormitorios y baño en suite.',
        'Cochera cubierta incluida, a metros de la costanera y con acceso rápido al centro. Zona en desarrollo constante y con buena conectividad hacia los accesos a Buenos Aires.',
        'Consultá disponibilidad, expensas y coordiná una visita por WhatsApp.',
      ],
      caracteristicas: ['Balcón', 'Baño en suite', 'Cochera cubierta', 'Amenities del edificio', 'Vista despejada'],
      etiquetas: ['departamento', 'puerto norte', 'venta', 'rosario'],
      coordenadasAproximadas: { lat: -32.9262, lng: -60.6353 },
      portada: 'images/depto-fachada-1600x1200.webp',
      galeria: ['images/depto-fachada-1600x1200.webp', 'images/depto-living-1600x1200.webp', 'images/depto-cocina-1600x1200.webp', 'images/depto-dormitorio-1600x1200.webp'],
      destacada: true, nueva: false,
    },
    {
      id: 3, slug: 'casa-fisherton-3-dormitorios', titulo: 'Casa en Fisherton',
      operacion: 'venta', tipo: 'Casa', estado: 'muy buen estado',
      precio: 210000, moneda: 'USD', expensas: 0,
      ciudad: 'Rosario', barrio: 'Fisherton', direccionAproximada: 'Fisherton, cerca de Av. Eva Perón',
      dormitorios: 3, ambientes: 5, banos: 2, cocheras: 2,
      superficieTotal: 280, superficieCubierta: 190,
      descripcion: [
        'Casa de 5 ambientes en Fisherton, con living principal, cocina independiente y tres dormitorios. Doble espacio de cochera y buena orientación.',
        'Zona residencial y arbolada, tradicionalmente elegida por su tranquilidad y cercanía a colegios. A pocos minutos de Av. Eva Perón y de la Circunvalación.',
        'Consultá la ficha completa y coordiná una visita por WhatsApp.',
      ],
      caracteristicas: ['Doble cochera', 'Living principal', 'Cocina independiente', 'Zona arbolada', 'Patio'],
      etiquetas: ['casa', 'fisherton', 'venta', 'rosario'],
      coordenadasAproximadas: { lat: -32.9557, lng: -60.7104 },
      portada: 'images/casa-fachada-1600x1200.webp',
      galeria: ['images/casa-fachada-1600x1200.webp', 'images/casa-living-1600x1200.webp', 'images/casa-cocina-1600x1200.webp', 'images/casa-dormitorio-1600x1200.webp'],
      destacada: true, nueva: false,
    },
  ];

  const WHATSAPP_NUMBER = '5493415964318';

  /* ================= HELPERS ================= */
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const formatearPrecio = p => {
    if (!p.precio) return 'Consultar precio';
    const n = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(p.precio);
    return p.moneda === 'USD' ? `USD ${n}` : `$ ${n}`;
  };
  const getPropiedad = id => PROPIEDADES.find(p => p.id === id);
  const opLabel = op => (op === 'venta' ? 'Venta' : 'Alquiler');

  /* ================= FAVORITOS ================= */
  const Favoritos = {
    KEY: 'delai_favoritos',
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    save(ids) { localStorage.setItem(this.KEY, JSON.stringify(ids)); document.dispatchEvent(new CustomEvent('fav:updated')); },
    has(id) { return this.get().includes(id); },
    toggle(id) {
      const ids = this.get();
      const idx = ids.indexOf(id);
      if (idx === -1) ids.push(id); else ids.splice(idx, 1);
      this.save(ids);
      return ids.includes(id);
    },
  };
  function updateFavBadge() {
    const n = Favoritos.get().filter(id => getPropiedad(id)).length;
    const b = document.querySelector('[data-fav-count]');
    if (b) { b.textContent = n; b.hidden = n === 0; }
  }
  document.addEventListener('fav:updated', updateFavBadge);

  /* ================= TOAST ================= */
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

  /* ================= REVEALS (canonico) ================= */
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

  /* ================= PROPERTY CARD ================= */
  function specIcon(name) {
    const icons = {
      dormitorios: '<path d="M3 10V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4M3 10h18v8H3zM3 18v2M21 18v2M12 10V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4"/>',
      banos: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM7 12V6a2 2 0 0 1 3-1.7M4 19v2M18 19v2"/>',
      superficie: '<path d="M4 4h7v7H4zM13 13h7v7h-7zM11 4h9v9M4 11v9h9"/>',
      cocheras: '<path d="M5 11 7 5h10l2 6M4 11h16v6H4zM4 17v2M18 17v2"/><circle cx="7.5" cy="14" r="1"/><circle cx="16.5" cy="14" r="1"/>',
    };
    return icons[name] || '';
  }

  function crearPropCard(p) {
    const card = document.createElement('article');
    card.className = 'prop-card';
    card.dataset.id = p.id;
    card.setAttribute('data-animate', '');
    card.style.opacity = '0';
    card.style.transform = 'translateY(36px)';
    card.innerHTML = `
      <div class="prop-media">
        <img src="${esc(p.portada)}" alt="${esc(p.titulo)}" width="1600" height="1200" loading="lazy">
        <span class="prop-badge">${esc(opLabel(p.operacion))}</span>
        <button type="button" class="fav-toggle${Favoritos.has(p.id) ? ' is-active' : ''}" data-fav aria-label="Guardar en favoritas">
          <svg viewBox="0 0 24 24" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2 4.8 5.4 4.1c2-.4 3.9.5 5 2.1 1.1-1.6 3-2.5 5-2.1 3.4.7 5 4.1 3.4 7.6C19.5 16.4 12 21 12 21Z"/></svg>
        </button>
      </div>
      <div class="prop-info">
        <span class="prop-price">${esc(formatearPrecio(p))}</span>
        <span class="prop-tipo">${esc(p.tipo)}</span>
        <h3 class="prop-titulo">${esc(p.titulo)}</h3>
        <span class="prop-ubicacion">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.1 7-11.6A7 7 0 0 0 5 9.4C5 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/></svg>
          ${esc(p.barrio)}, ${esc(p.ciudad)}
        </span>
        <div class="prop-specs">
          <span class="prop-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${specIcon('dormitorios')}</svg>${p.dormitorios}</span>
          <span class="prop-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${specIcon('banos')}</svg>${p.banos}</span>
          <span class="prop-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${specIcon('superficie')}</svg>${p.superficieTotal}m²</span>
          <span class="prop-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${specIcon('cocheras')}</svg>${p.cocheras}</span>
        </div>
      </div>`;

    card.addEventListener('click', () => abrirModal(p));
    const heart = card.querySelector('[data-fav]');
    heart.addEventListener('click', e => {
      e.stopPropagation();
      const active = Favoritos.toggle(p.id);
      heart.classList.toggle('is-active', active);
      showToast(active ? 'Guardada en favoritas' : 'Quitada de favoritas');
    });
    return card;
  }

  /* ================= LISTADO / FILTROS ================= */
  let filtroState = { operacion: '', q: '' };
  let soloFavoritas = false;

  function filtrarPropiedades() {
    const qNorm = normalizar(filtroState.q.trim());
    let lista = soloFavoritas ? PROPIEDADES.filter(p => Favoritos.has(p.id)) : PROPIEDADES.slice();
    return lista.filter(p => {
      if (filtroState.operacion && p.operacion !== filtroState.operacion) return false;
      if (qNorm) {
        const haystack = normalizar(`${p.titulo} ${p.tipo} ${p.barrio} ${p.ciudad} ${p.etiquetas.join(' ')} ${p.caracteristicas.join(' ')}`);
        if (!haystack.includes(qNorm)) return false;
      }
      return true;
    });
  }

  function renderPropiedades() {
    const grid = document.getElementById('propGrid');
    const sinResultados = document.getElementById('sinResultados');
    const countEl = document.getElementById('resultadosCount');
    const favBtn = document.getElementById('verFavoritasBtn');
    if (!grid) return;

    favBtn.textContent = soloFavoritas ? 'Ver todas' : 'Ver favoritas';
    const resultados = filtrarPropiedades();

    if (soloFavoritas && !resultados.length) {
      countEl.textContent = '';
      grid.innerHTML = '';
      sinResultados.hidden = false;
      sinResultados.querySelector('span')?.remove();
      sinResultados.innerHTML = 'Todavía no guardaste propiedades favoritas. <button type="button" id="sinResultadosReset" class="link-reset">Ver todas</button>';
      document.getElementById('sinResultadosReset').addEventListener('click', () => { soloFavoritas = false; renderPropiedades(); });
      return;
    }

    countEl.textContent = resultados.length === 1 ? '1 propiedad encontrada' : `${resultados.length} propiedades encontradas`;

    if (!resultados.length) {
      grid.innerHTML = '';
      sinResultados.hidden = false;
      sinResultados.innerHTML = 'No encontramos propiedades con esa búsqueda. <button type="button" id="sinResultadosReset" class="link-reset">Ver todas</button>';
      document.getElementById('sinResultadosReset').addEventListener('click', resetFiltros);
      return;
    }
    sinResultados.hidden = true;
    grid.innerHTML = '';
    resultados.forEach(p => grid.appendChild(crearPropCard(p)));
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  let revealsListos = false;
  function armarReveals() { revealsListos = true; }
  function revelarNuevos(container) {
    if (!revealsListos) return;
    const els = container.querySelectorAll('[data-animate]:not(.in)');
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    });
  }

  function resetFiltros() {
    filtroState = { operacion: '', q: '' };
    soloFavoritas = false;
    document.getElementById('heroBuscador').value = '';
    document.querySelectorAll('.op-btn').forEach(b => b.classList.toggle('is-active', b.dataset.op === ''));
    renderPropiedades();
  }

  function initBuscador() {
    document.querySelectorAll('.op-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.op-btn').forEach(b => b.classList.toggle('is-active', b === btn));
        filtroState.operacion = btn.dataset.op;
        soloFavoritas = false;
        renderPropiedades();
        if (btn.dataset.op) document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    const input = document.getElementById('heroBuscador');
    let debounceTimer;
    const applySearch = () => {
      filtroState.q = input.value;
      soloFavoritas = false;
      renderPropiedades();
    };
    input.addEventListener('input', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(applySearch, 180); });
    document.getElementById('heroBuscarBtn').addEventListener('click', () => {
      applySearch();
      document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('verFavoritasBtn').addEventListener('click', () => {
      soloFavoritas = !soloFavoritas;
      renderPropiedades();
    });
  }

  /* ================= MAPA (Leaflet, instancia reutilizada) ================= */
  let mapaInstancia = null;
  let mapaMarker = null;
  function mostrarMapa(prop) {
    const el = document.getElementById('modalMapa');
    if (!el || typeof L === 'undefined' || !prop.coordenadasAproximadas) return;
    const { lat, lng } = prop.coordenadasAproximadas;
    if (!mapaInstancia) {
      const pinIcon = L.divIcon({
        className: 'delai-pin', html: '<span></span>', iconSize: [26, 26], iconAnchor: [13, 26],
      });
      mapaInstancia = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 14);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19,
      }).addTo(mapaInstancia);
      mapaMarker = L.marker([lat, lng], { icon: pinIcon }).addTo(mapaInstancia);
    } else {
      mapaInstancia.setView([lat, lng], 14);
      mapaMarker.setLatLng([lat, lng]);
    }
    setTimeout(() => mapaInstancia.invalidateSize(), 80);
  }

  /* ================= MODAL VISTA RAPIDA ================= */
  let lastFocused = null;
  let galeriaActual = [];
  let galeriaIndex = 0;

  function setGaleriaImg(i) {
    galeriaIndex = i;
    const img = document.getElementById('modalGaleriaImg');
    if (img) img.src = galeriaActual[i];
    document.querySelectorAll('.modal-thumbs button').forEach((b, idx) => b.classList.toggle('is-active', idx === i));
  }

  function abrirModal(p) {
    galeriaActual = p.galeria;
    galeriaIndex = 0;
    const body = document.getElementById('modalBody');
    const similares = PROPIEDADES.filter(x => x.id !== p.id).slice(0, 2);

    body.innerHTML = `
      <div class="modal-gallery">
        <img id="modalGaleriaImg" src="${esc(p.galeria[0])}" alt="${esc(p.titulo)}" width="1600" height="1000">
        <button type="button" class="gal-arrow gal-prev" id="galPrev" aria-label="Foto anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18 9 12l6-6"/></svg>
        </button>
        <button type="button" class="gal-arrow gal-next" id="galNext" aria-label="Foto siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div class="modal-thumbs">
        ${p.galeria.map((src, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}" data-thumb="${i}"><img src="${esc(src)}" alt="Foto ${i + 1} de ${esc(p.titulo)}" width="200" height="150" loading="lazy"></button>`).join('')}
      </div>
      <div class="modal-info">
        <div class="modal-head-row">
          <div>
            <span class="prop-tipo">${esc(opLabel(p.operacion))} · ${esc(p.tipo)}</span>
            <h3 id="modalPropTitle">${esc(p.titulo)}</h3>
          </div>
          <span class="modal-price-big">${esc(formatearPrecio(p))}</span>
        </div>
        <p class="modal-ubicacion">${esc(p.barrio)}, ${esc(p.ciudad)} — ${esc(p.direccionAproximada)}</p>

        <div class="modal-ficha">
          <div class="ficha-item"><strong>${p.ambientes}</strong><span>Ambientes</span></div>
          <div class="ficha-item"><strong>${p.dormitorios}</strong><span>Dormitorios</span></div>
          <div class="ficha-item"><strong>${p.banos}</strong><span>Baños</span></div>
          <div class="ficha-item"><strong>${p.superficieTotal}m²</strong><span>Superficie</span></div>
        </div>

        <div class="modal-desc">${p.descripcion.map(par => `<p>${esc(par)}</p>`).join('')}</div>

        <div class="modal-caract">${p.caracteristicas.map(c => `<span class="caract-chip">${esc(c)}</span>`).join('')}</div>

        <div class="modal-mapa" id="modalMapa"></div>
        <p class="modal-mapa-note">Ubicación aproximada — la dirección exacta se comparte al coordinar la visita.</p>

        <div class="modal-asesor">
          <span class="brand-plate"><img src="images/logo-50radius.webp" alt="DELAI" width="36" height="36"></span>
          <div>
            <strong>Roberto Raúl Delgado</strong>
            <span>Corredor Inmobiliario · DELAI Administración Inmobiliaria</span>
          </div>
        </div>

        <div class="modal-actions">
          <a class="btn btn-primary" data-wsp-consulta target="_blank" rel="noopener noreferrer">Consultar por esta propiedad</a>
          <button type="button" class="btn btn-ghost" data-fav-modal>${Favoritos.has(p.id) ? 'Quitar de favoritas' : 'Guardar en favoritas'}</button>
        </div>

        ${similares.length ? `
        <div class="modal-relacionados">
          <h4>También te puede interesar</h4>
          <div class="relacionados-grid">
            ${similares.map(s => `<div class="relacionado-card" data-rel="${s.id}" role="button" tabindex="0">
              <img src="${esc(s.portada)}" alt="${esc(s.titulo)}" width="300" height="225" loading="lazy">
              <strong>${esc(s.titulo)}</strong>
              <span>${esc(formatearPrecio(s))}</span>
            </div>`).join('')}
          </div>
        </div>` : ''}
      </div>`;

    body.querySelectorAll('[data-thumb]').forEach(btn => btn.addEventListener('click', () => setGaleriaImg(Number(btn.dataset.thumb))));
    body.querySelector('#galPrev').addEventListener('click', () => setGaleriaImg((galeriaIndex - 1 + galeriaActual.length) % galeriaActual.length));
    body.querySelector('#galNext').addEventListener('click', () => setGaleriaImg((galeriaIndex + 1) % galeriaActual.length));

    const mensaje = `Hola DELAI, quiero consultar por ${p.titulo} (${p.slug}). ¿Podemos coordinar una visita?`;
    body.querySelector('[data-wsp-consulta]').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

    const favModalBtn = body.querySelector('[data-fav-modal]');
    favModalBtn.addEventListener('click', () => {
      const active = Favoritos.toggle(p.id);
      favModalBtn.textContent = active ? 'Quitar de favoritas' : 'Guardar en favoritas';
      showToast(active ? 'Guardada en favoritas' : 'Quitada de favoritas');
    });

    body.querySelectorAll('[data-rel]').forEach(el => {
      const open = () => { const rp = getPropiedad(Number(el.dataset.rel)); if (rp) abrirModal(rp); };
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    const backdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modalProp');
    backdrop.hidden = false;
    modal.hidden = false;
    modal.setAttribute('aria-labelledby', 'modalPropTitle');
    requestAnimationFrame(() => { backdrop.classList.add('open'); modal.classList.add('open'); });
    document.body.classList.add('no-scroll');
    window.history.replaceState(null, '', `?propiedad=${encodeURIComponent(p.slug)}`);
    lastFocused = document.activeElement;
    document.getElementById('modalCloseBtn').focus();

    mostrarMapa(p);
  }

  function cerrarModal() {
    const backdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modalProp');
    if (modal.hidden) return;
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    window.history.replaceState(null, '', location.pathname);
    setTimeout(() => { modal.hidden = true; backdrop.hidden = true; }, 320);
    lastFocused?.focus();
  }

  function initModal() {
    document.getElementById('modalCloseBtn').addEventListener('click', cerrarModal);
    document.getElementById('modalBackdrop').addEventListener('click', cerrarModal);
  }

  function trapFocus(container, e) {
    const focusables = container.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('modalProp');
    const modalOpen = modal && modal.classList.contains('open');
    if (!modalOpen) return;
    if (e.key === 'Escape') cerrarModal();
    else if (e.key === 'Tab') trapFocus(modal, e);
    else if (e.key === 'ArrowLeft' && galeriaActual.length > 1) setGaleriaImg((galeriaIndex - 1 + galeriaActual.length) % galeriaActual.length);
    else if (e.key === 'ArrowRight' && galeriaActual.length > 1) setGaleriaImg((galeriaIndex + 1) % galeriaActual.length);
  });

  function checkDeepLink() {
    const params = new URLSearchParams(location.search);
    const slug = params.get('propiedad');
    if (!slug) return;
    const p = PROPIEDADES.find(x => x.slug === slug);
    if (p) abrirModal(p);
  }

  /* ================= NAV MOBILE (canonico) ================= */
  function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    if (!toggle || !nav) return;
    let bd = document.querySelector('.nav-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
    const desktopMq = window.matchMedia('(min-width: 861px)');
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

  /* ================= WHATSAPP FLOTANTE ================= */
  function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
    }, { passive: true });
  }

  /* ================= ANTI-COPIA ================= */
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });

  /* ================= ASI TRABAJAMOS (sticky chapters) ================= */
  function initProceso() {
    const pasos = document.querySelectorAll('[data-proceso-paso]');
    const numEl = document.getElementById('procesoNum');
    const dots = document.querySelectorAll('.proceso-dots span');
    const icons = document.querySelectorAll('#procesoIcon svg');
    if (!pasos.length) return;
    const activate = i => {
      pasos.forEach((el, idx) => el.classList.toggle('is-on', idx === i));
      dots.forEach((el, idx) => el.classList.toggle('is-on', idx === i));
      icons.forEach((el, idx) => { el.hidden = idx !== i; });
      if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
    };
    if (!('IntersectionObserver' in window)) { activate(0); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activate(Number(entry.target.dataset.procesoPaso));
      });
    }, { threshold: 0.6 });
    pasos.forEach(el => io.observe(el));
  }

  /* ================= INIT ================= */
  document.addEventListener('DOMContentLoaded', () => {
    renderPropiedades();
    initBuscador();
    initModal();
    initReveals();
    armarReveals();
    initNav();
    initWspFloat();
    initProceso();
    updateFavBadge();
    checkDeepLink();
    const anioEl = document.getElementById('anioActual');
    if (anioEl) anioEl.textContent = new Date().getFullYear();
    document.getElementById('favBtn')?.addEventListener('click', () => {
      soloFavoritas = true;
      renderPropiedades();
      document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
