/* global PRODUCTOS, CATEGORIAS, TALLES, TALLER, FAQ, WSP, ENVIO_GRATIS_DESDE, MAYORISTA_OFF, MAYORISTA_MIN, performance, setInterval */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  const hasST = hasGsap && typeof ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (!hasGsap) document.querySelectorAll("[data-animate]").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });

  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const money = n => "$" + Math.round(n).toLocaleString("es-AR");
  const r100 = n => Math.round(n / 100) * 100;
  const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
  const getTalle = id => TALLES.find(t => t.id === id);
  const catLabel = id => CATEGORIAS.find(c => c.id === id)?.label || "";
  const talleLabel = id => getTalle(id)?.label || "";

  /* ---------- modo de precio ---------- */
  const Modo = {
    KEY: "magicoamor_modo",
    mayo: false,
    load() { try { this.mayo = localStorage.getItem(this.KEY) === "mayo"; } catch { this.mayo = false; } },
    set(v) { this.mayo = v; try { localStorage.setItem(this.KEY, v ? "mayo" : "uni"); } catch { /* sin storage */ } },
  };
  Modo.load();

  const minQty = () => (Modo.mayo ? MAYORISTA_MIN : 1);
  const precioLista = (p, talle) => r100(p.precio * (getTalle(talle)?.factor || 1));
  const precioVenta = (p, talle) => {
    const lista = precioLista(p, talle);
    if (Modo.mayo) return r100(lista * (1 - MAYORISTA_OFF));
    return p.descuento > 0 ? r100(lista * (1 - p.descuento / 100)) : lista;
  };
  const precioTachado = (p, talle) => (Modo.mayo || p.descuento > 0 ? precioLista(p, talle) : 0);
  const offPct = p => (Modo.mayo ? Math.round(MAYORISTA_OFF * 100) : p.descuento);
  const talleMasChico = p => p.talles[0];

  /* ---------- carrito ---------- */
  const Cart = {
    KEY: "magicoamor_cart",
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin storage */ } document.dispatchEvent(new CustomEvent("cart:updated")); },
    find(id, talle) { return this.get().find(i => i.id === Number(id) && i.talle === talle); },
    add(producto, talle, qty) {
      const items = this.get();
      const q = Math.max(qty || minQty(), minQty());
      const ex = items.find(i => i.id === producto.id && i.talle === talle);
      if (ex) ex.qty = Math.min(ex.qty + q, 999);
      else items.push({ id: producto.id, talle: talle, qty: Math.min(q, 999) });
      this.save(items);
    },
    setQty(id, talle, qty) {
      const items = this.get();
      const it = items.find(i => i.id === Number(id) && i.talle === talle);
      if (!it) return;
      it.qty = Math.max(minQty(), Math.min(qty, 999));
      this.save(items);
    },
    qtyOf(id, talle) { const it = this.find(id, talle); return it ? it.qty : 0; },
    remove(id, talle) { this.save(this.get().filter(i => !(i.id === Number(id) && i.talle === talle))); },
    count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioVenta(p, i.talle) * i.qty : s; }, 0); },
    ajustarMinimo() {
      const m = minQty();
      const items = this.get();
      let changed = false;
      items.forEach(i => { if (i.qty < m) { i.qty = m; changed = true; } });
      if (changed) this.save(items);
    },
  };

  /* ---------- toast ---------- */
  function showToast(msg) {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; wrap.setAttribute("aria-live", "polite"); document.body.appendChild(wrap); }
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + "</span>";
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add("hiding"); setTimeout(() => t.remove(), 220); }, 3000);
  }

  function countTo(el, from, to, ms) {
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = money(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- categorías ---------- */
  const catGrid = document.getElementById("catGrid");
  if (catGrid) {
    catGrid.innerHTML = CATEGORIAS.map(c => `<button type="button" class="cat-card" data-cat-go="${c.id}" data-animate style="opacity:0;transform:translateY(26px)">
      <img src="${esc(c.img)}" alt="${esc(c.label)}" width="1200" height="1200" loading="lazy" decoding="async">
      <span class="cat-body"><h3>${esc(c.label)}</h3><p>${esc(c.desc)}</p>
        <span class="cat-go">Ver ${esc(c.corto.toLowerCase())} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span>
      </span></button>`).join("");
  }

  /* ---------- pasos del taller y FAQ ---------- */
  const stepsEl = document.getElementById("tallerSteps");
  if (stepsEl) stepsEl.innerHTML = TALLER.map((s, i) => `<li class="${i === 0 ? "on" : ""}"><span class="n">${s.n}</span><div><h3>${esc(s.titulo)}</h3><p>${esc(s.texto)}</p></div></li>`).join("");

  const faqList = document.getElementById("faqList");
  if (faqList) {
    faqList.innerHTML = FAQ.map(f => `<details class="faq-item" data-animate style="opacity:0;transform:translateY(18px)"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");
    faqList.querySelectorAll("details").forEach(d => d.addEventListener("toggle", () => { if (hasST) ScrollTrigger.refresh(); }));
  }

  /* ---------- medidor de talle ---------- */
  const picker = document.getElementById("tallePicker");
  const talleInfo = document.getElementById("talleInfo");
  const tapeNum = document.getElementById("tapeNum");
  const tapeFill = document.querySelector(".tape-fill");
  const dogShape = document.querySelector(".dog-shape");
  const moldeTalle = document.getElementById("moldeTalle");
  const talleGo = document.getElementById("talleGo");
  let talleElegido = "m";

  if (picker) picker.innerHTML = TALLES.map(t => `<button type="button" class="talle-pick${t.id === talleElegido ? " on" : ""}" data-talle="${t.id}" aria-pressed="${t.id === talleElegido}">${t.label}</button>`).join("");

  function pintarTalle(id, animar) {
    const t = getTalle(id);
    if (!t) return;
    const prev = getTalle(talleElegido);
    talleElegido = id;
    picker && picker.querySelectorAll(".talle-pick").forEach(b => {
      const on = b.dataset.talle === id;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    if (dogShape) dogShape.style.transform = `scale(${t.escala})`;
    if (tapeFill) tapeFill.style.width = Math.round(((t.lomoNum - 14) / 70) * 100) + "%";
    if (moldeTalle) moldeTalle.textContent = t.label;
    if (tapeNum) {
      if (animar && !reduced && prev) {
        const from = prev.lomoNum, to = t.lomoNum, t0 = performance.now();
        const step = now => {
          const k = Math.min(1, (now - t0) / 420);
          tapeNum.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      } else tapeNum.textContent = t.lomoNum;
    }
    if (talleInfo) talleInfo.innerHTML = `<div><dt>Peso</dt><dd>${esc(t.peso)}</dd></div><div><dt>Lomo</dt><dd>${esc(t.lomo)}</dd></div><div><dt>Talle</dt><dd>${esc(t.label)}</dd></div><div class="razas"><dt>Suelen ser</dt><dd>${esc(t.razas)} y parecidos.</dd></div>`;
    if (talleGo) talleGo.textContent = `Ver lo que le queda al talle ${t.label}`;
  }
  if (picker) picker.addEventListener("click", e => { const b = e.target.closest(".talle-pick"); if (b) pintarTalle(b.dataset.talle, true); });
  pintarTalle("m", false);

  /* ---------- tienda ---------- */
  const grid = document.getElementById("prodGrid");
  const chips = document.getElementById("chipsCat");
  const buscar = document.getElementById("buscar");
  const filtroTalle = document.getElementById("filtroTalle");
  const resultCount = document.getElementById("resultCount");
  const verMas = document.getElementById("verMas");
  const mayoAlert = document.getElementById("mayoAlert");
  const PAGE = 12, STEP = 6;
  const st = { q: "", cat: "", talle: "", visibles: PAGE };
  let gridTween = null;
  const selTalle = {};
  PRODUCTOS.forEach(p => { selTalle[p.id] = talleMasChico(p); });

  if (chips) chips.innerHTML = '<button class="chip on" type="button" data-cat="">Todo</button>' + CATEGORIAS.map(c => `<button class="chip" type="button" data-cat="${c.id}">${esc(c.corto)}</button>`).join("");
  if (filtroTalle) filtroTalle.innerHTML = '<option value="">Todos los talles</option>' + TALLES.map(t => `<option value="${t.id}">Talle ${t.label} · ${esc(t.peso)}</option>`).join("");

  function filtrar() {
    const nq = norm(st.q);
    return PRODUCTOS.filter(p => {
      if (st.cat && p.categoria !== st.cat) return false;
      if (st.talle && !p.talles.includes(st.talle)) return false;
      if (nq && !norm([p.nombre, p.tela, p.desc, catLabel(p.categoria)].join(" ")).includes(nq)) return false;
      return true;
    });
  }

  function cardHTML(p) {
    const talle = selTalle[p.id];
    const precio = precioVenta(p, talle);
    const viejo = precioTachado(p, talle);
    const off = offPct(p);
    const badges = [];
    if (p.nuevo) badges.push('<span class="prod-badge prod-badge--new">Nuevo</span>');
    if (p.destacado) badges.push('<span class="prod-badge">Más vendido</span>');
    if (off > 0) badges.push(`<span class="prod-badge prod-badge--off">-${off}%</span>`);
    return `<article class="prod" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(30px)">
      <div class="prod-media">
        <div class="prod-badges">${badges.join("")}</div>
        <img src="${esc(p.img)}" alt="${esc(p.nombre)} de Mágico amor" width="1200" height="1200" loading="lazy" decoding="async">
        <button type="button" class="prod-open" data-qv="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}"><span>Ver detalle</span></button>
      </div>
      <div class="prod-body">
        <p class="prod-tela">${esc(p.tela)}</p>
        <h3 class="prod-nombre">${esc(p.nombre)}</h3>
        <div class="prod-precio-row">
          <span class="prod-precio${off > 0 ? " off" : ""}" data-pid="${p.id}" data-precio="${precio}">${money(precio)}</span>
          ${viejo ? `<s class="prod-precio-old">${money(viejo)}</s>` : ""}
          ${Modo.mayo ? '<span class="prod-unidad">precio por unidad, desde 6 u.</span>' : ""}
        </div>
        <div class="prod-talles" role="group" aria-label="Talle de ${esc(p.nombre)}">
          ${p.talles.map(t => `<button type="button" class="talle-chip${t === talle ? " on" : ""}" data-pick="${p.id}" data-talle="${t}" aria-pressed="${t === talle}">${talleLabel(t)}</button>`).join("")}
        </div>
        <div class="prod-actions">
          <div class="prod-add" data-add="${p.id}"></div>
          <button type="button" class="btn btn-line" data-buy="${p.id}">Comprar ahora</button>
        </div>
      </div>
    </article>`;
  }

  function pintarAdd(el) {
    const p = getProducto(el.dataset.add);
    if (!p) return;
    const talle = selTalle[p.id];
    const q = Cart.qtyOf(p.id, talle);
    if (q <= 0) {
      el.innerHTML = '<button class="add-btn" type="button">Agregar al carrito</button>';
      el.querySelector("button").addEventListener("click", () => {
        Cart.add(p, talle, minQty());
        showToast(`${p.nombre} talle ${talleLabel(talle)} — ¡al carrito!`);
      });
    } else {
      el.innerHTML = `<div class="stepper"><button type="button" aria-label="Quitar uno">−</button><b>${q}</b><button type="button" aria-label="Sumar uno">+</button></div>`;
      const b = el.querySelectorAll("button");
      b[0].addEventListener("click", () => (q - 1 < minQty() ? Cart.remove(p.id, talle) : Cart.setQty(p.id, talle, q - 1)));
      b[1].addEventListener("click", () => Cart.setQty(p.id, talle, q + 1));
    }
  }

  function renderTienda(reveal) {
    if (!grid) return;
    const res = filtrar();
    const vis = res.slice(0, st.visibles);
    if (resultCount) resultCount.textContent = res.length === 0 ? "" : `${res.length} ${res.length === 1 ? "producto" : "productos"}${st.talle ? " para talle " + talleLabel(st.talle) : ""}${st.cat ? " en " + catLabel(st.cat).toLowerCase() : ""}`;
    if (!res.length) {
      grid.innerHTML = `<div class="empty"><h3>No encontramos nada con eso</h3><p>Probá con otra palabra o mirá todo lo que sale del taller.</p><button class="btn btn-cta" type="button" id="limpiar">Limpiar filtros</button></div>`;
      grid.querySelector("#limpiar").addEventListener("click", limpiarFiltros);
      if (verMas) verMas.hidden = true;
      if (hasST) ScrollTrigger.refresh();
      return;
    }
    grid.innerHTML = vis.map(cardHTML).join("");
    grid.querySelectorAll(".prod-add").forEach(pintarAdd);
    if (verMas) verMas.hidden = res.length <= st.visibles;
    const cards = grid.querySelectorAll(".prod");
    if (gridTween) { if (gridTween.scrollTrigger) gridTween.scrollTrigger.kill(); gridTween.kill(); gridTween = null; }
    if (hasGsap && !reduced && reveal !== false) {
      gridTween = gsap.to(cards, {
        opacity: 1, y: 0, duration: .72, ease: "power3.out", stagger: .055, overwrite: true,
        scrollTrigger: hasST ? { trigger: grid, start: "top 88%" } : undefined,
      });
    } else {
      cards.forEach(c => { c.style.opacity = 1; c.style.transform = "none"; });
    }
    if (hasST) ScrollTrigger.refresh();
  }

  function limpiarFiltros() {
    st.q = ""; st.cat = ""; st.talle = ""; st.visibles = PAGE;
    if (buscar) buscar.value = "";
    if (filtroTalle) filtroTalle.value = "";
    syncChips();
    renderTienda(true);
  }
  function syncChips() { chips && chips.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", (c.dataset.cat || "") === st.cat)); }

  if (chips) chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; st.cat = b.dataset.cat || ""; st.visibles = PAGE; syncChips(); renderTienda(true); });
  if (buscar) buscar.addEventListener("input", () => { st.q = buscar.value; st.visibles = PAGE; renderTienda(true); });
  if (filtroTalle) filtroTalle.addEventListener("change", () => {
    st.talle = filtroTalle.value; st.visibles = PAGE;
    if (st.talle) PRODUCTOS.forEach(p => { if (p.talles.includes(st.talle)) selTalle[p.id] = st.talle; });
    renderTienda(true);
  });
  if (verMas) verMas.addEventListener("click", () => { st.visibles += STEP; renderTienda(true); });

  if (grid) grid.addEventListener("click", e => {
    const pick = e.target.closest("[data-pick]");
    if (pick) {
      const id = Number(pick.dataset.pick);
      selTalle[id] = pick.dataset.talle;
      const card = pick.closest(".prod");
      card.querySelectorAll("[data-pick]").forEach(b => { const on = b === pick; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
      const p = getProducto(id);
      const precioEl = card.querySelector(".prod-precio");
      const viejoEl = card.querySelector(".prod-precio-old");
      const nuevo = precioVenta(p, selTalle[id]);
      if (precioEl) {
        const desde = Number(precioEl.dataset.precio) || nuevo;
        precioEl.dataset.precio = nuevo;
        if (reduced) precioEl.textContent = money(nuevo); else countTo(precioEl, desde, nuevo, 380);
      }
      if (viejoEl) viejoEl.textContent = money(precioTachado(p, selTalle[id]));
      pintarAdd(card.querySelector(".prod-add"));
      return;
    }
    const buy = e.target.closest("[data-buy]");
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      Cart.add(p, selTalle[p.id], minQty());
      openCart();
      return;
    }
    const qv = e.target.closest("[data-qv]");
    if (qv) abrirQV(Number(qv.dataset.qv), qv);
  });

  document.addEventListener("click", e => {
    const go = e.target.closest("[data-cat-go]");
    if (!go) return;
    st.cat = go.dataset.catGo; st.visibles = PAGE;
    syncChips();
    renderTienda(true);
    irA("#tienda");
  });

  if (talleGo) talleGo.addEventListener("click", () => {
    st.talle = talleElegido; st.visibles = PAGE;
    if (filtroTalle) filtroTalle.value = talleElegido;
    PRODUCTOS.forEach(p => { if (p.talles.includes(talleElegido)) selTalle[p.id] = talleElegido; });
    renderTienda(true);
    irA("#tienda");
  });

  /* ---------- modo mayorista ---------- */
  const modoBtn = document.getElementById("modoBtn");
  const modoLabel = document.getElementById("modoLabel");
  const modoSwitch = document.getElementById("modoSwitch");
  const verPreciosMayo = document.getElementById("verPreciosMayo");

  function pintarModo(animar, render) {
    const on = Modo.mayo;
    if (modoBtn) modoBtn.setAttribute("aria-pressed", String(on));
    if (modoSwitch) modoSwitch.setAttribute("aria-pressed", String(on));
    if (modoLabel) modoLabel.textContent = on ? "Pet shop" : "Por unidad";
    if (mayoAlert) mayoAlert.hidden = !on;
    if (render === false) return;
    const previos = {};
    document.querySelectorAll(".prod-precio").forEach(el => { previos[el.dataset.pid] = Number(el.dataset.precio); });
    renderTienda(false);
    if (animar && !reduced) {
      document.querySelectorAll(".prod-precio").forEach(el => {
        const from = previos[el.dataset.pid];
        const to = Number(el.dataset.precio);
        if (from && from !== to) { el.textContent = money(from); countTo(el, from, to, 620); }
      });
    }
    if (qvActual) pintarQV(qvActual, qvTalle, qvQty);
    renderCart();
  }
  function toggleModo() {
    Modo.set(!Modo.mayo);
    Cart.ajustarMinimo();
    pintarModo(true);
    showToast(Modo.mayo ? "Precio pet shop activado — mínimo 6 u. por modelo" : "Volviste al precio por unidad");
  }
  if (modoBtn) modoBtn.addEventListener("click", toggleModo);
  if (modoSwitch) modoSwitch.addEventListener("click", toggleModo);
  if (verPreciosMayo) verPreciosMayo.addEventListener("click", () => {
    if (!Modo.mayo) toggleModo();
    irA("#tienda");
  });

  /* ---------- quick view ---------- */
  const qv = document.getElementById("qv");
  const qvInner = document.getElementById("qvInner");
  const qvBackdrop = document.getElementById("qvBackdrop");
  let qvActual = null, qvTalle = "", qvQty = 1, qvTrigger = null;

  function pintarQV(p, talle, qty) {
    if (!qvInner || !p) return;
    const precio = precioVenta(p, talle);
    const viejo = precioTachado(p, talle);
    const off = offPct(p);
    const rel = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
    qvInner.innerHTML = `
      <div class="qv-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)} de Mágico amor" width="1200" height="1200" decoding="async"></div>
      <div class="qv-body">
        <p class="qv-tela">${esc(catLabel(p.categoria))} · ${esc(p.tela)}</p>
        <h2 id="qvNombre">${esc(p.nombre)}</h2>
        <div class="qv-precio"><b class="${off > 0 ? "off" : ""}" id="qvPrecio">${money(precio)}</b>${viejo ? `<s>${money(viejo)}</s>` : ""}${off > 0 ? `<span class="prod-badge prod-badge--off">-${off}%</span>` : ""}</div>
        ${Modo.mayo ? '<p class="qv-unidad">Precio por unidad comprando 6 o más de este modelo.</p>' : ""}
        <p class="qv-desc">${esc(p.desc)}</p>
        <span class="qv-label">Talle — se calcula con el largo del lomo</span>
        <div class="qv-talles" role="group" aria-label="Elegí el talle">
          ${p.talles.map(t => `<button type="button" class="talle-chip${t === talle ? " on" : ""}" data-qvtalle="${t}" aria-pressed="${t === talle}">${talleLabel(t)}</button>`).join("")}
        </div>
        <div class="qv-buy">
          <div class="stepper"><button type="button" id="qvMenos" aria-label="Quitar uno">−</button><b id="qvQty">${qty}</b><button type="button" id="qvMas" aria-label="Sumar uno">+</button></div>
          <button type="button" class="btn btn-cta" id="qvAdd">Agregar al carrito</button>
        </div>
        <button type="button" class="btn btn-line btn-block" id="qvBuy">Comprar ahora</button>
      </div>
      ${rel.length ? `<div class="qv-rel"><h3>También te puede interesar</h3><div class="qv-rel-grid">${rel.map(r => `<button type="button" class="qv-rel-card" data-qv-rel="${r.id}"><img src="${esc(r.img)}" alt="" width="1200" height="1200" loading="lazy"><span><b>${esc(r.nombre)}</b><span>${money(precioVenta(r, talleMasChico(r)))}</span></span></button>`).join("")}</div></div>` : ""}`;
  }

  function abrirQV(id, trigger) {
    const p = getProducto(id);
    if (!p) return;
    qvActual = p;
    qvTalle = selTalle[p.id] || talleMasChico(p);
    qvQty = minQty();
    qvTrigger = trigger || null;
    pintarQV(p, qvTalle, qvQty);
    qvBackdrop.hidden = false;
    requestAnimationFrame(() => qvBackdrop.classList.add("open"));
    qv.classList.add("open");
    qv.removeAttribute("inert");
    document.body.classList.add("no-scroll");
    const f = qv.querySelector(".qv-close");
    f && f.focus();
  }
  function cerrarQV() {
    if (!qv.classList.contains("open")) return;
    qv.classList.remove("open");
    qv.setAttribute("inert", "");
    qvBackdrop.classList.remove("open");
    setTimeout(() => { qvBackdrop.hidden = true; }, 300);
    document.body.classList.remove("no-scroll");
    qvActual = null;
    if (qvTrigger) { qvTrigger.focus({ preventScroll: true }); qvTrigger = null; }
  }
  if (qv) qv.addEventListener("click", e => {
    if (e.target.closest("[data-close-qv]")) { cerrarQV(); return; }
    const t = e.target.closest("[data-qvtalle]");
    if (t) {
      qvTalle = t.dataset.qvtalle;
      selTalle[qvActual.id] = qvTalle;
      pintarQV(qvActual, qvTalle, qvQty);
      return;
    }
    const rel = e.target.closest("[data-qv-rel]");
    if (rel) { abrirQV(Number(rel.dataset.qvRel), qvTrigger); return; }
    if (e.target.closest("#qvMas")) { qvQty += 1; document.getElementById("qvQty").textContent = qvQty; return; }
    if (e.target.closest("#qvMenos")) { qvQty = Math.max(minQty(), qvQty - 1); document.getElementById("qvQty").textContent = qvQty; return; }
    if (e.target.closest("#qvAdd")) {
      Cart.add(qvActual, qvTalle, qvQty);
      showToast(`${qvActual.nombre} talle ${talleLabel(qvTalle)} — ¡al carrito!`);
      return;
    }
    if (e.target.closest("#qvBuy")) {
      const p = qvActual;
      Cart.add(p, qvTalle, qvQty);
      cerrarQV();
      openCart();
    }
  });
  if (qvBackdrop) qvBackdrop.addEventListener("click", cerrarQV);

  /* ---------- carrito: drawer ---------- */
  const drawer = document.getElementById("cartDrawer");
  const cartBackdrop = document.getElementById("cartBackdrop");
  let cartTrigger = null;

  function openCart(trigger) {
    cartTrigger = trigger || document.querySelector("[data-open-cart]");
    renderCart();
    cartBackdrop.hidden = false;
    requestAnimationFrame(() => cartBackdrop.classList.add("open"));
    drawer.classList.add("open");
    drawer.removeAttribute("inert");
    document.body.classList.add("no-scroll");
    const f = drawer.querySelector("[data-close-cart]");
    f && f.focus();
  }
  function closeCart() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    drawer.setAttribute("inert", "");
    cartBackdrop.classList.remove("open");
    setTimeout(() => { cartBackdrop.hidden = true; }, 300);
    document.body.classList.remove("no-scroll");
    if (cartTrigger) { cartTrigger.focus({ preventScroll: true }); cartTrigger = null; }
  }

  function renderCart() {
    const box = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    const shipEl = document.getElementById("cartShip");
    const chk = document.getElementById("cartCheckout");
    if (!box) return;
    const items = Cart.get();
    if (!items.length) {
      box.innerHTML = `<div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="20" r="1.6" fill="currentColor" stroke="none"/><circle cx="18" cy="20" r="1.6" fill="currentColor" stroke="none"/><path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L22 7H6"/></svg>
        <p>Todavía no elegiste nada.<br>Empezá por la cama y seguí por el buzo.</p>
        <button class="btn btn-cta" type="button" data-close-cart>Ver la tienda</button></div>`;
      totalEl.textContent = money(0);
      shipEl.innerHTML = "";
      chk.disabled = true;
      return;
    }
    box.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return "";
      const pu = precioVenta(p, i.talle);
      return `<div class="cart-item" data-line="${p.id}|${i.talle}">
        <img src="${esc(p.img)}" alt="" width="66" height="66" loading="lazy">
        <div>
          <h4>${esc(p.nombre)}</h4>
          <p class="ci-meta">Talle ${talleLabel(i.talle)} · ${money(pu)} c/u</p>
          <div class="stepper" data-step="${p.id}|${i.talle}"><button type="button" aria-label="Quitar uno">−</button><b>${i.qty}</b><button type="button" aria-label="Sumar uno">+</button></div>
        </div>
        <div class="ci-right"><span class="ci-sub">${money(pu * i.qty)}</span><button class="cart-remove" type="button" data-remove="${p.id}|${i.talle}">Quitar</button></div>
      </div>`;
    }).join("");
    requestAnimationFrame(() => box.querySelectorAll(".cart-item").forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 45)));
    const total = Cart.total();
    totalEl.textContent = money(total);
    if (Modo.mayo) {
      shipEl.innerHTML = '<span class="cart-note">Pedido mayorista: mínimo 6 unidades por modelo. El envío al local se coordina por WhatsApp.</span>';
    } else {
      const falta = ENVIO_GRATIS_DESDE - total;
      shipEl.innerHTML = falta > 0
        ? `<span class="ship-msg">Te faltan <b>${money(falta)}</b> para el envío gratis</span><div class="ship-bar"><span style="width:${Math.min(100, Math.round(total / ENVIO_GRATIS_DESDE * 100))}%"></span></div>`
        : '<span class="ship-msg"><span class="ok">¡Tenés envío gratis! 🎉</span></span><div class="ship-bar"><span style="width:100%"></span></div>';
    }
    chk.disabled = false;
  }

  if (drawer) drawer.addEventListener("click", e => {
    if (e.target.closest("[data-close-cart]")) { closeCart(); return; }
    const step = e.target.closest("[data-step]");
    if (step) {
      const [id, talle] = step.dataset.step.split("|");
      const q = Cart.qtyOf(id, talle);
      const btns = step.querySelectorAll("button");
      if (e.target === btns[0]) { if (q - 1 < minQty()) Cart.remove(id, talle); else Cart.setQty(id, talle, q - 1); }
      if (e.target === btns[1]) Cart.setQty(id, talle, q + 1);
      return;
    }
    const rm = e.target.closest("[data-remove]");
    if (rm) {
      const [id, talle] = rm.dataset.remove.split("|");
      Cart.remove(id, talle);
      showToast("Lo sacamos del pedido");
    }
  });
  document.querySelectorAll("[data-open-cart]").forEach(b => b.addEventListener("click", () => openCart(b)));
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  function checkoutWhatsApp() {
    const items = Cart.get();
    if (!items.length) return;
    let msg = Modo.mayo ? "Hola Mágico amor! Soy de un pet shop y quiero este pedido mayorista:\n" : "Hola Mágico amor! Quiero hacer este pedido:\n";
    items.forEach(i => {
      const p = getProducto(i.id);
      if (p) msg += `\n• ${i.qty} x ${p.nombre} — talle ${talleLabel(i.talle)} — ${money(precioVenta(p, i.talle) * i.qty)}`;
    });
    const total = Cart.total();
    msg += `\n\nTotal: ${money(total)}`;
    if (!Modo.mayo && total >= ENVIO_GRATIS_DESDE) msg += "\n(con envío gratis)";
    msg += "\n\nMi nombre y la localidad para el envío: ";
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }
  const chkBtn = document.getElementById("cartCheckout");
  if (chkBtn) chkBtn.addEventListener("click", checkoutWhatsApp);

  function updateBadge() {
    document.querySelectorAll("[data-cart-count]").forEach(b => {
      const n = Cart.count();
      b.textContent = n;
      b.classList.toggle("has", n > 0);
      b.classList.remove("bump");
      void b.offsetWidth;
      if (n > 0) b.classList.add("bump");
    });
  }
  document.addEventListener("cart:updated", () => {
    updateBadge();
    if (grid) grid.querySelectorAll(".prod-add").forEach(pintarAdd);
    if (drawer.classList.contains("open")) renderCart();
  });

  /* ---------- foco atrapado y Escape ---------- */
  const FOCO = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function atrapar(cont, e) {
    const f = [...cont.querySelectorAll(FOCO)].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener("keydown", e => {
    const mnav = document.getElementById("mobileNav");
    if (e.key === "Escape") {
      if (qv && qv.classList.contains("open")) return cerrarQV();
      if (drawer && drawer.classList.contains("open")) return closeCart();
      if (mnav && mnav.classList.contains("open")) return cerrarNav();
    }
    if (e.key !== "Tab") return;
    if (qv && qv.classList.contains("open")) atrapar(qv, e);
    else if (drawer && drawer.classList.contains("open")) atrapar(drawer, e);
    else if (mnav && mnav.classList.contains("open")) atrapar(mnav, e);
  });

  /* ---------- nav mobile ---------- */
  const toggle = document.getElementById("navToggle");
  const mnav = document.getElementById("mobileNav");
  let navBackdrop = null;
  function cerrarNav() {
    if (!mnav) return;
    mnav.classList.remove("open");
    mnav.setAttribute("inert", "");
    navBackdrop && navBackdrop.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    toggle.focus({ preventScroll: true });
  }
  if (toggle && mnav) {
    navBackdrop = document.createElement("div");
    navBackdrop.className = "nav-backdrop";
    document.body.appendChild(navBackdrop);
    toggle.addEventListener("click", () => {
      if (mnav.classList.contains("open")) return cerrarNav();
      mnav.classList.add("open");
      mnav.removeAttribute("inert");
      navBackdrop.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
      const f = mnav.querySelector("a");
      f && f.focus();
    });
    navBackdrop.addEventListener("click", cerrarNav);
    mnav.querySelectorAll("a").forEach(a => a.addEventListener("click", cerrarNav));
  }

  /* ---------- anclas suaves ---------- */
  function irA(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute("href");
    if (hash.length < 2) return;
    const el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    irA(hash);
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  });

  /* ---------- movimiento ---------- */
  function heroTimeline() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: .12 });
    tl.to(".hero .eyebrow", { opacity: 1, y: 0, duration: .6 }, 0)
      .to(".hero-title .line", { opacity: 1, y: 0, duration: .95, stagger: .11 }, .08)
      .to(".hero-sub", { opacity: 1, y: 0, duration: .8 }, .45)
      .to(".hero-cta", { opacity: 1, y: 0, duration: .8 }, .6)
      .to(".hero-mini", { opacity: 1, y: 0, duration: .8 }, .72)
      .from(".scene-field", { scale: .82, opacity: 0, duration: 1.1, transformOrigin: "60% 60%" }, .1)
      .from(".scene-ring", { scale: .9, opacity: 0, duration: 1.1, rotate: -8 }, .2)
      .from(".scene-frame", { yPercent: 14, opacity: 0, duration: .9 }, .38)
      .from(".scene-star", { yPercent: 12, rotate: 3, opacity: 0, duration: 1.05, transformOrigin: "bottom center" }, .28)
      .from(".scene-sec", { yPercent: -16, opacity: 0, duration: .85 }, .55)
      .from(".scene-tag, .scene-note", { scale: .88, opacity: 0, duration: .6, stagger: .1 }, .7)
      .from(".scene-tape", { scaleX: .2, opacity: 0, duration: .9, transformOrigin: "left center" }, .5);
  }

  function revealBasicos() {
    gsap.utils.toArray("[data-animate]").forEach(el => {
      if (el.closest(".hero") || el.closest("#prodGrid") || el.closest(".cat-card") || el.classList.contains("cat-card") || el.closest(".trust")) return;
      gsap.to(el, { opacity: 1, y: 0, duration: .85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  }

  function revealTrust() {
    gsap.to(".trust-list li", {
      opacity: 1, y: 0, duration: .7, ease: "power3.out", stagger: .09,
      scrollTrigger: { trigger: ".trust", start: "top 92%" },
    });
    gsap.from(".trust-list svg", {
      scale: .6, rotate: -12, duration: .65, ease: "back.out(2)", stagger: .09, delay: .15,
      scrollTrigger: { trigger: ".trust", start: "top 92%" },
    });
  }

  function revealCats() {
    const cards = gsap.utils.toArray(".cat-card");
    if (!cards.length) return;
    gsap.set(cards, { opacity: 1, y: 0, clipPath: "inset(100% 0% 0% 0% round 20px)" });
    gsap.to(cards, {
      clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1.05, ease: "power3.inOut", stagger: .1,
      scrollTrigger: { trigger: "#catGrid", start: "top 85%" },
    });
  }

  function revealCierre() {
    gsap.from(".cierre-dog", {
      xPercent: -22, rotate: -7, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".cierre", start: "top 82%" },
    });
  }

  function parallaxHero() {
    gsap.to(".scene-frame", { yPercent: -9, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .5 } });
    gsap.to(".scene-sec", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .5 } });
    gsap.to(".scene-tape", { xPercent: 4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .5 } });
  }

  function buildFinal() {
    gsap.set(".build-fabric", { scaleX: 1 });
    gsap.set(".build-fill", { opacity: 1, scale: 1 });
    gsap.set(".build-stitch", { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(".build-edge", { opacity: 1, scale: 1 });
    gsap.set(".build-dog", { opacity: 1, y: 0, rotate: 0 });
    gsap.set(".build-tag", { opacity: 1, y: 0 });
  }

  function setupTaller() {
    const steps = [...document.querySelectorAll("#tallerSteps li")];
    const activar = i => steps.forEach((s, idx) => s.classList.toggle("on", idx === i));
    const stitch = document.querySelector(".build-stitch rect");
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#tallerTrack", start: "top top", end: "+=200%", scrub: .65,
          pin: "#tallerStage", anticipatePin: 1,
          onUpdate: self => activar(Math.min(4, Math.floor(self.progress * 5.02))),
        },
        defaults: { ease: "power2.out" },
      });
      tl.to(".build-fabric", { scaleX: 1, duration: 1 })
        .to(".build-tag--1", { opacity: 1, y: 0, duration: .4 }, "-=.35")
        .to(".build-fill", { opacity: 1, scale: 1, duration: .9 }, "+=.15")
        .to(".build-tag--2", { opacity: 1, y: 0, duration: .4 }, "-=.4")
        .set(".build-stitch", { opacity: 1 }, "+=.1")
        .fromTo(".build-stitch", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "none" }, "<")
        .fromTo(stitch, { strokeDashoffset: 190 }, { strokeDashoffset: 0, duration: 1.1, ease: "none" }, "<")
        .to(".build-edge", { opacity: 1, scale: 1, duration: .8 }, "+=.1")
        .to(".build-tag--3", { opacity: 1, y: 0, duration: .4 }, "-=.4")
        .to(".build-dog", { opacity: 1, y: 0, rotate: 0, duration: .9, ease: "back.out(1.4)" }, "+=.15");
      return () => { activar(0); };
    });

    mm.add("(max-width: 900px)", () => {
      buildFinal();
      steps.forEach(s => s.classList.add("on"));
    });
  }

  function initMovimiento() {
    if (!hasGsap || reduced) {
      document.querySelectorAll("[data-animate]").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
      if (hasGsap) buildFinal();
      else {
        document.querySelectorAll(".build-fabric, .build-fill, .build-stitch, .build-edge, .build-dog, .build-tag").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
        document.querySelectorAll("#tallerSteps li").forEach(s => s.classList.add("on"));
      }
      renderTienda(false);
      return;
    }
    heroTimeline();
    renderTienda(true);
    if (!hasST) {
      document.querySelectorAll("[data-animate]").forEach(el => { if (!el.closest(".hero")) { el.style.opacity = 1; el.style.transform = "none"; } });
      buildFinal();
      return;
    }
    revealBasicos();
    revealTrust();
    revealCats();
    revealCierre();
    parallaxHero();
    setupTaller();
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ---------- arranque ---------- */
  pintarModo(false, false);
  initMovimiento();
  updateBadge();
  const wsp = document.getElementById("wsp-float");
  if (wsp) window.addEventListener("scroll", () => { wsp.classList.toggle("visible", window.scrollY > 600); }, { passive: true });
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- anti-copia ---------- */
  document.addEventListener("contextmenu", e => e.preventDefault());
  document.addEventListener("dragstart", e => e.preventDefault());
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k === "f12" || (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) || (e.ctrlKey && k === "u")) e.preventDefault();
  });
  function initDevToolsGuard() {
    let overlay = null, open = false;
    setInterval(() => {
      const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
      if (isOpen === open) return;
      open = isOpen;
      if (open) {
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.className = "devtools-overlay";
          overlay.innerHTML = "<p>Contenido protegido.</p>";
          document.body.appendChild(overlay);
        }
        overlay.classList.add("visible");
      } else if (overlay) overlay.classList.remove("visible");
    }, 800);
  }
  initDevToolsGuard();

  globalThis.MAGICO = { Cart, Modo, st, filtrar, norm, money, minQty, precioLista, precioVenta, precioTachado, PAGE, STEP };
})();
