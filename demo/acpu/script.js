(() => {
  "use strict";

  const SITE = {
    nombre: "ACPU",
    wa: "5492974377705",
  };

  const VALORES = [
    ["Fe", "Jesucristo y los principios de la Palabra de Dios como fundamento de nuestras acciones."],
    ["Unidad", "Promovemos la cooperación y la comunión entre las iglesias."],
    ["Servicio", "Entendemos el liderazgo como una responsabilidad al servicio de los demás."],
    ["Integridad", "Actuamos con honestidad, coherencia y responsabilidad."],
    ["Solidaridad", "Acompañamos a quienes atraviesan situaciones de necesidad y vulnerabilidad."],
    ["Excelencia", "Buscamos mejorar continuamente la calidad de nuestras acciones."],
    ["Respeto", "Reconocemos la identidad y autonomía de cada iglesia."],
    ["Transparencia", "Administramos los recursos y las responsabilidades institucionales con claridad."],
    ["Compromiso", "Trabajamos activamente para generar un impacto espiritual y social positivo."],
  ];

  const AREAS = [
    "Fortalecimiento y acompañamiento pastoral",
    "Asesoramiento jurídico e institucional",
    "Asesoramiento administrativo y financiero",
    "Orientación para la obtención de personerías jurídicas",
    "Asesoramiento para la inscripción en el Registro Nacional de Cultos",
    "Capacitación pastoral y ministerial",
    "Evangelismo y misiones",
    "Desarrollo de proyectos sociales y solidarios",
    "Cobertura y acompañamiento espiritual",
    "Convenios y beneficios institucionales",
    "Formación y desarrollo de líderes",
  ];

  // Fichas de muestra: se reemplazan con la planilla de iglesias integrantes.
  const IGLESIAS = [
    { n: "Iglesia de ejemplo · Centro", p: "Chubut", l: "Comodoro Rivadavia", d: "Pentecostal", h: "Domingos 10 y 19 h · Miércoles 20 h" },
    { n: "Iglesia de ejemplo · Barrio Norte", p: "Chubut", l: "Trelew", d: "Bautista", h: "Domingos 10.30 h · Jueves 20 h" },
    { n: "Iglesia de ejemplo · Costanera", p: "Chubut", l: "Puerto Madryn", d: "Evangélica libre", h: "Domingos 18 h" },
    { n: "Iglesia de ejemplo · Cordillera", p: "Chubut", l: "Esquel", d: "Hermanos libres", h: "Domingos 11 h · Viernes 20 h" },
    { n: "Iglesia de ejemplo · Puerto", p: "Santa Cruz", l: "Caleta Olivia", d: "Pentecostal", h: "Domingos 19 h" },
    { n: "Iglesia de ejemplo · Centro", p: "Río Negro", l: "Viedma", d: "Bautista", h: "Domingos 10 h" },
  ];

  const BIBLIOTECA = [
    { c: "Estudios bíblicos", t: "Guía de estudio para grupos pequeños", d: "PDF · 24 páginas", libre: true },
    { c: "Estudios bíblicos", t: "Plan de lectura anual", d: "PDF · 12 páginas", libre: true },
    { c: "Capacitación", t: "Formación de líderes: módulo 1", d: "PDF + video", libre: false },
    { c: "Capacitación", t: "Consejería pastoral: primeros pasos", d: "PDF · 40 páginas", libre: false },
    { c: "Guías institucionales", t: "Cómo tramitar la personería jurídica", d: "Guía paso a paso", libre: true },
    { c: "Guías institucionales", t: "Inscripción en el Registro Nacional de Cultos", d: "Guía y requisitos", libre: true },
    { c: "Administración", t: "Modelo de libro de actas", d: "Plantilla editable", libre: false },
    { c: "Administración", t: "Rendición de cuentas de una iglesia", d: "Planilla de ejemplo", libre: false },
  ];

  const ICON = {
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    heart: '<path d="M12 20s-8-4.6-8-10.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8C20 15.4 12 20 12 20z"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    bus: '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M8 20v-3M16 20v-3"/>',
  };

  const BENEFICIOS = [
    ["calc", "Asesoramiento contable", "Atención preferencial para balances, libros y presentaciones de la iglesia."],
    ["shield", "Seguros para templos", "Cobertura de edificios, actividades y voluntarios con condiciones especiales."],
    ["cap", "Capacitación con descuento", "Cursos y seminarios ministeriales con precio diferencial para miembros."],
    ["heart", "Salud y bienestar", "Convenios para pastores y sus familias."],
    ["print", "Imprenta y comunicación", "Folletería, cartelería y diseño para campañas y eventos."],
    ["bus", "Traslados y encuentros", "Tarifas especiales para viajes a congresos y retiros."],
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const peso = (n) => "$" + Number(n).toLocaleString("es-AR");
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

  // Header y menú
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const nav = $("#mainNav");
  const toggle = $("#menuToggle");
  const closeMenu = () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Abrir menú"); };
  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    header.classList.add("is-solid");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (!open) onScroll();
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Contenido
  $("#values").innerHTML = VALORES.map(([t, d]) => `<li class="reveal"><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join("");
  $("#areasList").innerHTML = AREAS.map((a) => `<li class="reveal">${esc(a)}</li>`).join("");
  $("#benefits").innerHTML = BENEFICIOS.map(([i, t, d]) => `<article class="benefit reveal"><span class="benefit-ico">${svg(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><span class="tag-sample">Ejemplo</span></article>`).join("");

  // Biblioteca
  const cats = ["Todos", ...new Set(BIBLIOTECA.map((b) => b.c))];
  const tabs = $("#libTabs");
  tabs.innerHTML = cats.map((c, i) => `<button type="button" class="lib-tab" role="tab" aria-selected="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  const renderLib = (cat) => {
    const list = BIBLIOTECA.filter((b) => cat === "Todos" || b.c === cat);
    $("#libGrid").innerHTML = list.map((b) => `
      <article class="doc">
        <span class="doc-icon">PDF</span>
        <div>
          <h3>${esc(b.t)}</h3>
          <p>${esc(b.c)} · ${esc(b.d)}</p>
          ${b.libre ? `<button type="button" class="doc-act" data-free>Descargar</button>` : `<button type="button" class="doc-act doc-lock" data-lock>Solo miembros 🔒</button>`}
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

  // Diálogos
  const memberDlg = $("#memberDialog");
  const openMember = (e) => { e.preventDefault(); memberDlg.showModal(); };
  $("#memberLink").addEventListener("click", openMember);
  $("#libGrid").addEventListener("click", (e) => {
    if (e.target.closest("[data-lock]")) openMember(e);
    else if (e.target.closest("[data-free]")) { const btn = e.target.closest("[data-free]"); btn.textContent = "En la web real se abre el PDF"; btn.disabled = true; }
  });
  document.querySelectorAll("dialog").forEach((d) => {
    d.querySelector(".dialog-close").addEventListener("click", () => d.close());
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  });

  // Donación
  let monto = 10000;
  const amounts = $("#amounts");
  const otherWrap = $("#otherWrap");
  const otherInput = $("#otherAmount");
  amounts.addEventListener("click", (e) => {
    const b = e.target.closest(".amount");
    if (!b) return;
    amounts.querySelectorAll(".amount").forEach((x) => x.classList.toggle("is-on", x === b));
    const v = b.dataset.amount;
    otherWrap.hidden = v !== "otro";
    if (v === "otro") { monto = 0; otherInput.focus(); } else monto = Number(v);
  });
  otherInput.addEventListener("input", () => {
    const n = Number(otherInput.value.replace(/\D/g, ""));
    monto = n;
    otherInput.value = n ? peso(n) : "";
  });
  document.querySelectorAll("[data-target-project]").forEach((a) => a.addEventListener("click", () => { $("#donateTarget").selectedIndex = 1; }));

  $("#donateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!monto) { otherInput.focus(); otherInput.setAttribute("aria-invalid", "true"); return; }
    otherInput.removeAttribute("aria-invalid");
    const freq = document.querySelector('input[name="freq"]:checked').value;
    const destino = $("#donateTarget").value;
    const anon = $("#anon").checked;
    $("#dlgSummary").innerHTML = `Elegiste donar <strong>${peso(monto)}</strong>${freq === "mensual" ? " <strong>todos los meses</strong>" : ""} a <strong>${esc(destino)}</strong>${anon ? ", de forma anónima" : ""}.`;
    const txt = `Hola ${SITE.nombre}, quiero donar ${peso(monto)}${freq === "mensual" ? " por mes" : ""} a ${destino}.`;
    $("#dlgWa").href = `https://wa.me/${SITE.wa}?text=${encodeURIComponent(txt)}`;
    $("#donateDialog").showModal();
  });

  // Directorio
  const prov = $("#dirProv"), loc = $("#dirLoc"), q = $("#dirSearch");
  const uniq = (arr) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, "es"));
  prov.insertAdjacentHTML("beforeend", uniq(IGLESIAS.map((i) => i.p)).map((p) => `<option>${esc(p)}</option>`).join(""));
  const fillLoc = () => {
    const ls = uniq(IGLESIAS.filter((i) => !prov.value || i.p === prov.value).map((i) => i.l));
    loc.innerHTML = `<option value="">Todas</option>` + ls.map((l) => `<option>${esc(l)}</option>`).join("");
  };
  const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const renderDir = () => {
    const term = norm(q.value.trim());
    const list = IGLESIAS.filter((i) => (!prov.value || i.p === prov.value) && (!loc.value || i.l === loc.value) && (!term || norm(`${i.n} ${i.d} ${i.l}`).includes(term)));
    $("#dirCount").textContent = `${list.length} ${list.length === 1 ? "iglesia" : "iglesias"}`;
    $("#dirGrid").innerHTML = list.length ? list.map((i) => `
      <article class="church">
        <span class="loc">${esc(i.l)} · ${esc(i.p)}</span>
        <h3>${esc(i.n)}</h3>
        <p>${esc(i.d)} · Pastor a confirmar</p>
        <p>${esc(i.h)}</p>
        <span class="tag-sample">Ficha de ejemplo</span>
      </article>`).join("") : `<p class="dir-empty">No hay iglesias con esos filtros.</p>`;
  };
  fillLoc(); renderDir();
  prov.addEventListener("change", () => { fillLoc(); renderDir(); });
  loc.addEventListener("change", renderDir);
  q.addEventListener("input", renderDir);

  // Adhesión
  $("#joinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.reportValidity()) return;
    const ok = $("#joinOk");
    ok.hidden = false;
    ok.textContent = `Solicitud de ${f.iglesia.value} recibida. Queda pendiente de aprobación: la administración la evalúa y te contacta. (Demo: no se envió ningún dato.)`;
    f.querySelector("button[type=submit]").disabled = true;
  });

  // Reveal
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) els.forEach((el) => el.classList.add("is-in"));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }
})();
