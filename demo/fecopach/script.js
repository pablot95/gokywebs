(() => {
  "use strict";

  const VALORES = [
    ["Fe cristiana", "Fundamentamos nuestras acciones en los principios bíblicos."],
    ["Unidad", "Construimos vínculos de cooperación entre los Consejos Pastorales."],
    ["Representatividad", "Promovemos la participación de las distintas regiones y localidades de la provincia."],
    ["Autonomía institucional", "Respetamos la independencia de las entidades federadas."],
    ["Integridad", "Actuamos con responsabilidad, ética y coherencia."],
    ["Transparencia", "Promovemos una administración ordenada y responsable."],
    ["Servicio", "Ponemos nuestras capacidades al servicio de las instituciones y la comunidad."],
    ["Libertad religiosa", "Promovemos el respeto por la libertad de culto y de conciencia."],
    ["Solidaridad", "Impulsamos acciones de acompañamiento y asistencia comunitaria."],
    ["Pluralidad y respeto", "Valoramos las diferentes expresiones de la comunidad cristiana evangélica."],
    ["Independencia político-partidaria", "Promovemos el diálogo institucional sin subordinación a intereses partidarios."],
  ];

  const AREAS = [
    "Representación institucional de los Consejos Pastorales",
    "Integración y articulación territorial",
    "Fortalecimiento jurídico y administrativo",
    "Acompañamiento y asesoramiento institucional",
    "Capacitación y formación del liderazgo pastoral",
    "Promoción de la libertad religiosa",
    "Convenios con organismos públicos y privados",
    "Desarrollo de programas sociales y comunitarios",
    "Contención y acompañamiento pastoral",
    "Prevención y abordaje de problemáticas sociales",
    "Promoción de actividades evangelísticas",
    "Registro provincial de Consejos Pastorales",
    "Cooperación interinstitucional",
  ];

  const COMISION = [
    ["Jorge Omar Pejcich", "Presidente"],
    ["Pablo Esteban Galarza", "Vicepresidente primero"],
    ["Bruno Agustín Solorza", "Vicepresidente segundo"],
    ["Saúl Esteban Aillapan Torres", "Secretario"],
    ["Eduardo Andrés Illesca", "Tesorero"],
    ["Juan Elsezar", "Vocal titular"],
  ];
  const FISCALIZACION = [
    ["Julio Hernán Barría Saldívia", "Revisor de Cuentas titular"],
    ["Carlos David Haro", "Revisor de Cuentas suplente"],
  ];

  // Localidades: las "consejos" son integrantes (fundadores); el resto, por sumar.
  const LOCALIDADES = [
    { id: "madryn", n: "Puerto Madryn", lon: -65.04, lat: -42.77, lx: 12, ly: -8, consejos: ["Consejo Pastoral de Puerto Madryn", "Cofraternidad de Pastores de Puerto Madryn"] },
    { id: "esquel", n: "Esquel", lon: -71.31, lat: -42.91, lx: 12, ly: 4, consejos: ["Consejo Pastoral de Esquel"] },
    { id: "trelew", n: "Trelew", lon: -65.31, lat: -43.25, lx: -12, ly: 12, anchor: "end" },
    { id: "rawson", n: "Rawson", lon: -65.1, lat: -43.3, lx: 12, ly: 10 },
    { id: "comodoro", n: "Comodoro Rivadavia", lon: -67.5, lat: -45.86, lx: 12, ly: 4 },
    { id: "sarmiento", n: "Sarmiento", lon: -69.07, lat: -45.59, lx: -12, ly: 4, anchor: "end" },
    { id: "trevelin", n: "Trevelin", lon: -71.46, lat: -43.09, lx: 12, ly: 14 },
    { id: "maiten", n: "El Maitén", lon: -71.17, lat: -42.05, lx: 12, ly: 16 },
    { id: "costa", n: "Gobernador Costa", lon: -70.45, lat: -44.05, lx: 12, ly: 4 },
  ];

  // Contorno simplificado de la provincia (lon, lat).
  const CONTORNO = [
    [-71.75, -42.0], [-65.07, -42.0], [-64.6, -42.2], [-64.35, -42.3], [-63.8, -42.08], [-63.6, -42.5],
    [-63.65, -42.78], [-64.3, -42.65], [-64.5, -42.55], [-65.03, -42.77], [-64.35, -42.98], [-65.05, -43.3],
    [-65.27, -44.04], [-65.7, -44.8], [-65.55, -44.92], [-66.5, -45.1], [-67.5, -45.87], [-67.6, -46.0],
    [-71.6, -46.0], [-71.9, -45.5], [-71.5, -45.0], [-71.6, -44.5], [-71.8, -44.0], [-71.5, -43.5],
    [-71.75, -43.0], [-71.7, -42.5],
  ];

  const BIBLIOTECA = [
    { c: "Institucional", t: "Estatuto de la Federación", d: "PDF · sujeto a aprobación definitiva", libre: true },
    { c: "Institucional", t: "Acta constitutiva", d: "PDF · 1 de abril de 2026", libre: true },
    { c: "Institucional", t: "Circulares y resoluciones", d: "Archivo de la Comisión Directiva", libre: false },
    { c: "Capacitación", t: "Formación del liderazgo pastoral", d: "Módulos y material de apoyo", libre: false },
    { c: "Libertad religiosa", t: "Guía sobre libertad de culto y de conciencia", d: "PDF · ejemplo", libre: true },
    { c: "Programas sociales", t: "Cómo presentar un proyecto comunitario", d: "Guía y plantilla", libre: false },
  ];

  const ICON = {
    scale: '<path d="M12 3v18M5 21h14M6 7h12"/><path d="M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    hand: '<path d="M7 11V6a2 2 0 0 1 4 0v5M11 10V4a2 2 0 0 1 4 0v6M15 10V6a2 2 0 0 1 4 0v8a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.5L3 14a2 2 0 0 1 3.4-2L7 13"/>',
    heart: '<path d="M12 20s-8-4.6-8-10.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8C20 15.4 12 20 12 20z"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.8-1.5 5.2-1.5 6 0M14 10h4M14 13h3"/>',
  };
  const BENEFICIOS = [
    ["scale", "Asesoramiento jurídico", "Orientación para personería, estatutos y trámites ante organismos."],
    ["cap", "Capacitación", "Formación del liderazgo pastoral con acceso preferencial para Consejos federados."],
    ["hand", "Convenios con municipios", "Articulación para programas sociales y comunitarios en cada localidad."],
    ["shield", "Seguros institucionales", "Cobertura para actividades y voluntarios con condiciones especiales."],
    ["heart", "Contención pastoral", "Red de acompañamiento para pastores y sus familias."],
    ["id", "Credencial institucional", "Credencial digital con número de registro y QR de validación."],
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const svgIcon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
  const iniciales = (n) => { const w = n.split(" "); return (w[0][0] + (w.length >= 3 ? w[2][0] : w[w.length - 1][0])).toUpperCase(); };

  // Menú
  const nav = $("#mainNav");
  const toggle = $("#menuToggle");
  const closeMenu = () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Abrir menú"); };
  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Contenido
  $("#values").innerHTML = VALORES.map(([t, d]) => `<li class="reveal"><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join("");
  $("#areasList").innerHTML = AREAS.map((a) => `<li class="reveal">${esc(a)}</li>`).join("");
  const person = ([n, r]) => `<article class="person reveal"><div class="avatar" aria-hidden="true">${esc(iniciales(n))}</div><h3>${esc(n)}</h3><p class="role">${esc(r)}</p></article>`;
  $("#board").innerHTML = COMISION.map(person).join("");
  $("#audit").innerHTML = FISCALIZACION.map(person).join("");
  $("#benefits").innerHTML = BENEFICIOS.map(([i, t, d]) => `<article class="benefit reveal"><span class="benefit-ico">${svgIcon(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><span class="tag-sample">Ejemplo</span></article>`).join("");

  // Biblioteca
  const cats = ["Todos", ...new Set(BIBLIOTECA.map((b) => b.c))];
  const tabs = $("#libTabs");
  tabs.innerHTML = cats.map((c, i) => `<button type="button" class="lib-tab" role="tab" aria-selected="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  const renderLib = (cat) => {
    $("#libGrid").innerHTML = BIBLIOTECA.filter((b) => cat === "Todos" || b.c === cat).map((b) => `
      <article class="doc">
        <span class="doc-icon">PDF</span>
        <div>
          <h3>${esc(b.t)}</h3>
          <p>${esc(b.c)} · ${esc(b.d)}</p>
          ${b.libre ? `<button type="button" class="doc-act" data-free>Descargar</button>` : `<button type="button" class="doc-act doc-lock" data-lock>Solo Consejos federados 🔒</button>`}
        </div>
      </article>`).join("");
  };
  renderLib("Todos");
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".lib-tab");
    if (!b) return;
    tabs.querySelectorAll(".lib-tab").forEach((t) => t.setAttribute("aria-selected", String(t === b)));
    renderLib(b.dataset.cat);
  });

  const memberDlg = $("#memberDialog");
  const openMember = (e) => { e.preventDefault(); memberDlg.showModal(); };
  $("#memberLink").addEventListener("click", openMember);
  $("#libGrid").addEventListener("click", (e) => {
    if (e.target.closest("[data-lock]")) openMember(e);
    else if (e.target.closest("[data-free]")) { const btn = e.target.closest("[data-free]"); btn.textContent = "En la web real se abre el PDF"; btn.disabled = true; }
  });
  memberDlg.querySelector(".dialog-close").addEventListener("click", () => memberDlg.close());
  memberDlg.addEventListener("click", (e) => { if (e.target === memberDlg) memberDlg.close(); });

  // Mapa del Chubut
  const map = $("#chubutMap");
  const NS = "http://www.w3.org/2000/svg";
  const px = (lon, lat) => [20 + (lon + 72.3) * 62, 12 + (-41.8 - lat) * 85.5];
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); parent.appendChild(n); return n; };
  el("path", { class: "prov", d: "M" + CONTORNO.map(([lo, la]) => px(lo, la).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z" }, map);
  el("text", { class: "sea-label", x: 520, y: 300, "text-anchor": "middle" }, map).textContent = "MAR ARGENTINO";

  const panel = $("#councilPanel");
  const pins = {};
  const showLoc = (loc) => {
    Object.values(pins).forEach((p) => p.classList.toggle("is-active", p === pins[loc.id]));
    panel.innerHTML = loc.consejos
      ? loc.consejos.map((c) => `<article class="council is-active"><span class="loc">${esc(loc.n)} · Integrante fundador</span><h3>${esc(c)}</h3><p>Presidente, comisión, domicilio, personería y número de registro federativo: se completan con la planilla.</p></article>`).join("")
      : `<div class="empty-loc"><strong>${esc(loc.n)}</strong><br>Todavía no hay un Consejo federado en esta localidad. Si representás a un Consejo Pastoral de ${esc(loc.n)}, <a href="#afiliacion">solicitá la afiliación</a>.</div>`;
  };
  LOCALIDADES.forEach((loc) => {
    const [x, y] = px(loc.lon, loc.lat);
    const g = el("g", { class: "pin" + (loc.consejos ? " is-member" : ""), tabindex: "0", role: "button", "aria-label": loc.n + (loc.consejos ? ", Consejo integrante" : ", localidad por sumar") }, map);
    if (loc.consejos) el("circle", { class: "halo", cx: x, cy: y, r: 16 }, g);
    el("circle", { class: "dot", cx: x, cy: y, r: 7 }, g);
    el("text", { x: x + loc.lx, y: y + loc.ly, "text-anchor": loc.anchor || "start" }, g).textContent = loc.n;
    g.addEventListener("click", () => showLoc(loc));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showLoc(loc); } });
    pins[loc.id] = g;
  });
  // Estado inicial: todos los integrantes.
  panel.innerHTML = LOCALIDADES.filter((l) => l.consejos).flatMap((l) => l.consejos.map((c) => `<article class="council"><span class="loc">${esc(l.n)} · Integrante fundador</span><h3>${esc(c)}</h3><p>Ficha con autoridades, domicilio, personería, registro federativo y redes.</p></article>`)).join("")
    + `<article class="council"><span class="loc">Entidad fundadora</span><h3>Asociación Civil de Pastores Unidos (ACPU)</h3><p>Asociación civil de alcance nacional, integrante fundadora de la Federación.</p></article>`;

  // Afiliación
  $("#joinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.reportValidity()) return;
    const ok = $("#joinOk");
    ok.hidden = false;
    ok.textContent = `Solicitud de ${f.iglesia.value} recibida. Queda pendiente de aprobación institucional. (Demo: no se envió ningún dato.)`;
    f.querySelector("button[type=submit]").disabled = true;
  });

  // Reveal
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) els.forEach((n) => n.classList.add("is-in"));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((n) => io.observe(n));
  }
})();
