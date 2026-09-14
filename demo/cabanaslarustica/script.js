"use strict";

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return dateKey(date) === value ? date : null;
}
function nightsBetween(start, end) {
  const a = parseDate(start),
    b = parseDate(end);
  if (!a || !b) return 0;
  return Math.round(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      86400000,
  );
}
function validStay(start, end, today = dateKey(new Date())) {
  return Boolean(
    parseDate(start) &&
    parseDate(end) &&
    start >= today &&
    nightsBetween(start, end) > 0,
  );
}
function normalizeGuests(value) {
  const count = Number(value);
  return Number.isInteger(count) && count >= 1 && count <= 99 ? count : null;
}
function selectDate(range, key, today = dateKey(new Date()), mode = "auto") {
  if (!parseDate(key) || key < today) return { ...range };
  if (
    mode === "arrival" ||
    !range.start ||
    (range.end && mode !== "departure") ||
    key <= range.start
  )
    return { start: key, end: null };
  return { start: range.start, end: key };
}
function bookingUrl(start, end, guests, today = dateKey(new Date())) {
  if (!validStay(start, end, today) || !normalizeGuests(guests)) return null;
  const format = (value) =>
    parseDate(value).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  const nights = nightsBetween(start, end);
  const message = `Hola, Cabañas La Rústica. Quiero consultar una estadía.\nEntrada: ${format(start)}\nSalida: ${format(end)}\n${nights} ${nights === 1 ? "noche" : "noches"} · ${guests} ${guests === 1 ? "huésped" : "huéspedes"}.\n¿Tienen disponibilidad y capacidad para estas fechas? ¿Me pasan la tarifa, los servicios y las condiciones para reservar?`;
  return `https://wa.me/5493541239349?text=${encodeURIComponent(message)}`;
}
if (typeof module !== "undefined")
  module.exports = {
    dateKey,
    parseDate,
    nightsBetween,
    validStay,
    normalizeGuests,
    selectDate,
    bookingUrl,
  };

if (typeof document !== "undefined") {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 768px)");
  let modalTrigger = null;
  let lockedScroll = 0;
  function lockScroll() {
    if (document.body.classList.contains("no-scroll")) return;
    lockedScroll = window.scrollY;
    document.body.style.top = `-${lockedScroll}px`;
    document.body.classList.add("no-scroll");
  }
  function unlockScroll() {
    if (!document.body.classList.contains("no-scroll")) return;
    document.body.classList.remove("no-scroll");
    document.body.style.removeProperty("top");
    window.scrollTo({ top: lockedScroll, behavior: "instant" });
  }
  function openDialog(dialog, trigger) {
    modalTrigger = trigger || document.activeElement;
    dialog.showModal();
    lockScroll();
  }
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("close", () => {
      unlockScroll();
      modalTrigger?.focus();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    });
  });
  $$("[data-close]").forEach((button) =>
    button.addEventListener("click", () =>
      document.getElementById(button.dataset.close).close(),
    ),
  );

  function initNav() {
    const nav = $("#mainNav"),
      toggle = $("#menuToggle");
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    $(".site-header").append(backdrop);
    function close(returnFocus = false) {
      nav.classList.remove("open");
      backdrop.classList.remove("open");
      unlockScroll();
      toggle.setAttribute("aria-expanded", "false");
      nav.inert = mobile.matches;
      if (returnFocus) toggle.focus();
    }
    toggle.addEventListener("click", () => {
      if (nav.classList.contains("open")) return close(true);
      nav.inert = false;
      nav.classList.add("open");
      backdrop.classList.add("open");
      lockScroll();
      toggle.setAttribute("aria-expanded", "true");
      requestAnimationFrame(() => $("#navClose").focus());
    });
    $("#navClose").addEventListener("click", () => close(true));
    backdrop.addEventListener("click", () => close(true));
    nav
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", () => close()));
    nav.addEventListener("keydown", (event) => {
      if (!mobile.matches || !nav.classList.contains("open")) return;
      if (event.key === "Escape") close(true);
      if (event.key !== "Tab") return;
      const targets = [...nav.querySelectorAll("a,button")];
      const first = targets[0],
        last = targets.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    mobile.addEventListener("change", () => close());
    nav.inert = mobile.matches;
  }

  function initBooking() {
    let range = { start: null, end: null },
      draft = { ...range },
      selectionMode = "auto";
    let month = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
      12,
    );
    const dialog = $("#calendarDialog"),
      months = $("#calendarMonths"),
      guests = $("#guests");
    const pretty = (value) =>
      parseDate(value).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    function renderSummary() {
      $("#arrivalLabel").textContent = range.start
        ? pretty(range.start)
        : "Elegí una fecha";
      $("#departureLabel").textContent = range.end
        ? pretty(range.end)
        : "Elegí una fecha";
      const count = normalizeGuests(guests.value);
      const nights = nightsBetween(range.start, range.end);
      $("#bookingSummary").textContent = !count
        ? "Ingresá una cantidad de huéspedes entre 1 y 99."
        : validStay(range.start, range.end)
          ? `${nights} ${nights === 1 ? "noche" : "noches"} · ${count} ${count === 1 ? "huésped" : "huéspedes"} · Tarifa a confirmar`
          : "Elegí tu llegada y tu salida.";
      guests.setAttribute("aria-invalid", String(!count));
      $("#guestMinus").disabled = count !== null && count <= 1;
      $("#guestPlus").disabled = count !== null && count >= 99;
      $("#bookingSend").href =
        bookingUrl(range.start, range.end, count) ||
        "https://wa.me/5493541239349";
    }
    function renderCalendar() {
      const today = dateKey(new Date());
      months.replaceChildren();
      for (let offset = 0; offset < 2; offset++) {
        const first = new Date(
          month.getFullYear(),
          month.getMonth() + offset,
          1,
          12,
        );
        const total = new Date(
          first.getFullYear(),
          first.getMonth() + 1,
          0,
        ).getDate();
        const section = document.createElement("div");
        section.className = "calendar-month";
        const title = document.createElement("h3");
        title.textContent = first.toLocaleDateString("es-AR", {
          month: "long",
          year: "numeric",
        });
        section.append(title);
        const grid = document.createElement("div");
        grid.className = "calendar-grid";
        ["L", "M", "M", "J", "V", "S", "D"].forEach((day) => {
          const label = document.createElement("span");
          label.className = "weekday";
          label.textContent = day;
          label.setAttribute("aria-hidden", "true");
          grid.append(label);
        });
        const blank = (first.getDay() + 6) % 7;
        for (let i = 0; i < blank; i++) {
          const space = document.createElement("span");
          space.setAttribute("aria-hidden", "true");
          grid.append(space);
        }
        for (let day = 1; day <= total; day++) {
          const date = new Date(first.getFullYear(), first.getMonth(), day, 12),
            key = dateKey(date);
          const button = document.createElement("button");
          button.type = "button";
          button.className = "calendar-day";
          button.dataset.date = key;
          button.textContent = day;
          button.disabled = key < today;
          const selected = key === draft.start || key === draft.end;
          button.classList.toggle("selected", selected);
          button.classList.toggle("today", key === today);
          button.classList.toggle(
            "in-range",
            Boolean(
              draft.start && draft.end && key > draft.start && key < draft.end,
            ),
          );
          button.setAttribute("aria-pressed", String(selected));
          button.setAttribute(
            "aria-label",
            `${date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}${key === draft.start ? ", entrada" : key === draft.end ? ", salida" : ""}`,
          );
          button.addEventListener("click", () => {
            draft = selectDate(draft, key, dateKey(new Date()), selectionMode);
            selectionMode = "auto";
            renderCalendar();
            months.querySelector(`[data-date="${key}"]`)?.focus();
          });
          grid.append(button);
        }
        section.append(grid);
        months.append(section);
      }
      const current = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
        12,
      );
      $("#previousMonth").disabled = month <= current;
      const valid = validStay(draft.start, draft.end);
      $("#applyDates").disabled = !valid;
      $("#calendarHelp").textContent = valid
        ? `${pretty(draft.start)} → ${pretty(draft.end)} · ${nightsBetween(draft.start, draft.end)} ${nightsBetween(draft.start, draft.end) === 1 ? "noche" : "noches"}`
        : draft.start
          ? `Entrada: ${pretty(draft.start)}. Ahora elegí una salida posterior.`
          : "Primero, elegí tu llegada.";
    }
    function openCalendar(trigger, mode = "auto") {
      if (range.start && range.start < dateKey(new Date()))
        range = { start: null, end: null };
      draft = { ...range };
      selectionMode = mode;
      const base =
        mode === "departure"
          ? parseDate(range.end || range.start)
          : parseDate(range.start);
      const date = base || new Date();
      month = new Date(date.getFullYear(), date.getMonth(), 1, 12);
      renderCalendar();
      openDialog(dialog, trigger);
    }
    $("#arrivalButton").addEventListener("click", (event) =>
      openCalendar(event.currentTarget, "arrival"),
    );
    $("#departureButton").addEventListener("click", (event) =>
      openCalendar(event.currentTarget, "departure"),
    );
    $("#previousMonth").addEventListener("click", () => {
      month.setMonth(month.getMonth() - 1);
      renderCalendar();
    });
    $("#nextMonth").addEventListener("click", () => {
      month.setMonth(month.getMonth() + 1);
      renderCalendar();
    });
    $("#clearDates").addEventListener("click", () => {
      draft = { start: null, end: null };
      range = { ...draft };
      selectionMode = "auto";
      renderCalendar();
      renderSummary();
    });
    $("#applyDates").addEventListener("click", () => {
      if (!validStay(draft.start, draft.end)) return renderCalendar();
      range = { ...draft };
      renderSummary();
      dialog.close();
    });
    guests.addEventListener("input", renderSummary);
    $("#guestMinus").addEventListener("click", () => {
      guests.value = Math.max(1, (normalizeGuests(guests.value) || 2) - 1);
      renderSummary();
    });
    $("#guestPlus").addEventListener("click", () => {
      guests.value = Math.min(99, (normalizeGuests(guests.value) || 1) + 1);
      renderSummary();
    });
    $("#bookingSend").addEventListener("click", (event) => {
      if (!normalizeGuests(guests.value)) {
        event.preventDefault();
        renderSummary();
        guests.focus();
        return;
      }
      const url = bookingUrl(range.start, range.end, Number(guests.value));
      if (!url) {
        event.preventDefault();
        openCalendar(event.currentTarget);
        return;
      }
      event.currentTarget.href = url;
    });
    renderSummary();
  }

  function initChapters() {
    const section = $("#ritmo"),
      texts = $$(".chapter-text"),
      photos = $$(".chapter-photo"),
      buttons = $$("[data-moment]");
    section.classList.add("chapters-ready");
    let index = -1,
      pending = false;
    function activate(next, zoom = 1) {
      if (next !== index) {
        index = next;
        texts.forEach((text, i) => {
          const active = i === index;
          text.classList.toggle("active", active);
          text.setAttribute("aria-hidden", String(!active));
          text.inert = !active;
        });
        photos.forEach((photo, i) => {
          photo.classList.toggle("active", i === index);
          photo.setAttribute("aria-hidden", String(i !== index));
        });
        buttons.forEach((button, i) => {
          button.classList.toggle("active", i === index);
          button.setAttribute("aria-pressed", String(i === index));
        });
      }
      photos[index].style.transform = `scale(${zoom})`;
    }
    function update() {
      pending = false;
      if (motion.matches || document.body.classList.contains("no-scroll"))
        return;
      const distance = section.offsetHeight - window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / distance),
      );
      const segment = Math.min(2, Math.floor(progress * 3 * 0.9999));
      activate(segment, 1.07 - Math.min(1, progress * 3 - segment) * 0.07);
    }
    function queue() {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    }
    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        const next = Number(button.dataset.moment);
        if (motion.matches) {
          activate(next);
          return;
        }
        const top = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top:
            top +
            (section.offsetHeight - window.innerHeight) * ((next + 0.5) / 3),
          behavior: "smooth",
        });
      }),
    );
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    motion.addEventListener("change", () => {
      activate(0);
      queue();
    });
    activate(0);
    update();
  }

  function initReveals() {
    if (motion.matches || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-reveals");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );
    $$("[data-animate]").forEach((element) => observer.observe(element));
    if (window.gsap) {
      if (window.ScrollTrigger)
        window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.from(".hero-image img", {
        scale: 1.07,
        duration: 1.6,
        ease: "power2.out",
      });
      window.gsap.from(".hero-content > .eyebrow, .hero h1, .hero-bottom", {
        opacity: 0,
        y: 22,
        stagger: 0.15,
        duration: 0.85,
        clearProps: "all",
      });
      if (window.ScrollTrigger)
        window.gsap.from(".qualities > div", {
          y: 20,
          opacity: 0,
          stagger: 0.14,
          duration: 0.6,
          scrollTrigger: {
            trigger: ".qualities",
            start: "top 92%",
            once: true,
          },
          clearProps: "all",
        });
    }
  }

  function initPalette() {
    const keys = [
      "--color-bg",
      "--color-bg-alt",
      "--color-text",
      "--color-text-muted",
      "--color-primary",
      "--color-secondary",
      "--color-cta",
      "--color-cta-text",
    ];
    const definitions = [
      [
        "Original",
        [
          "#f9fafb",
          "#edf0ea",
          "#000000",
          "#555b53",
          "#000000",
          "#00ff00",
          "#000000",
          "#ffffff",
        ],
      ],
      [
        "Oliva & lino",
        [
          "#f8f6ef",
          "#e9eadf",
          "#273329",
          "#56604f",
          "#273329",
          "#d5e6b6",
          "#273329",
          "#ffffff",
        ],
      ],
      [
        "Lago & arena",
        [
          "#f7f8f8",
          "#e8efef",
          "#17383d",
          "#506366",
          "#17383d",
          "#c9e9ec",
          "#17383d",
          "#ffffff",
        ],
      ],
      [
        "Tierra cálida",
        [
          "#faf6f1",
          "#efe4d9",
          "#422e26",
          "#6e5c50",
          "#422e26",
          "#edc7a4",
          "#422e26",
          "#ffffff",
        ],
      ],
      [
        "Piedra & sal",
        [
          "#faf9f7",
          "#eae7e2",
          "#302f2d",
          "#65615b",
          "#302f2d",
          "#ded8c6",
          "#302f2d",
          "#ffffff",
        ],
      ],
    ];
    const palettes = definitions.map(([nombre, colors]) => ({
      nombre,
      vars: Object.fromEntries(keys.map((key, i) => [key, colors[i]])),
    }));
    let active = palettes[0];
    try {
      const saved = JSON.parse(localStorage.getItem("cabanaslarustica_paleta"));
      active =
        palettes.find((palette) => palette.nombre === saved?.nombre) || active;
    } catch {}
    function apply(palette) {
      active = palette;
      Object.entries(palette.vars).forEach(([key, value]) =>
        document.documentElement.style.setProperty(key, value),
      );
      $$(".palette-option").forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.name === palette.nombre,
        );
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.name === palette.nombre),
        );
      });
      try {
        localStorage.setItem(
          "cabanaslarustica_paleta",
          JSON.stringify(palette),
        );
      } catch {}
      $("#palette-status").textContent =
        `Paleta ${palette.nombre} seleccionada. Podés enviarnos tu elección.`;
    }
    palettes.forEach((palette) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "palette-option";
      button.dataset.name = palette.nombre;
      const name = document.createElement("span");
      name.textContent = palette.nombre;
      const preview = document.createElement("span");
      preview.className = "palette-preview";
      preview.setAttribute("aria-hidden", "true");
      ["--color-bg", "--color-primary", "--color-secondary"].forEach((key) => {
        const dot = document.createElement("i");
        dot.style.setProperty("--swatch", palette.vars[key]);
        preview.append(dot);
      });
      button.append(name, preview);
      button.addEventListener("click", () => apply(palette));
      $("#palette-grid").append(button);
    });
    apply(active);
    $("#color-switch").addEventListener("click", (event) =>
      openDialog($("#paletteDialog"), event.currentTarget),
    );
    $("#palette-send").addEventListener("click", async (event) => {
      const button = event.currentTarget,
        submitted = active;
      button.disabled = true;
      button.textContent = "Enviando…";
      try {
        const [
          { initializeApp, getApps },
          { getFirestore, collection, addDoc, serverTimestamp },
        ] = await Promise.all([
          import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
          import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
        ]);
        const app =
          getApps().find((item) => item.name === "paletas") ||
          initializeApp(
            {
              apiKey: "AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ",
              authDomain: "gokywebs-967cd.firebaseapp.com",
              projectId: "gokywebs-967cd",
              storageBucket: "gokywebs-967cd.firebasestorage.app",
              messagingSenderId: "50030976147",
              appId: "1:50030976147:web:9f07245b536a75833a4166",
            },
            "paletas",
          );
        await addDoc(collection(getFirestore(app), "paletas"), {
          slug: "cabanaslarustica",
          negocio: "Cabañas La Rústica",
          paletaNombre: submitted.nombre,
          paletaVars: submitted.vars,
          url: window.location.href,
          createdAt: serverTimestamp(),
          visto: false,
        });
        $("#palette-status").textContent =
          `¡Listo! Recibimos tu elección: ${submitted.nombre}.`;
      } catch {
        $("#palette-status").textContent =
          "No pudimos enviar tu elección. Sigue guardada en este navegador; podés intentar de nuevo.";
      } finally {
        button.disabled = false;
        button.textContent = "Enviar mi elección";
      }
    });
  }

  initNav();
  initBooking();
  initChapters();
  initPalette();
  initReveals();
  $("#year").textContent = new Date().getFullYear();
  const showWhatsApp = () => {
    if (window.scrollY > 600) $("#wsp-float").classList.add("visible");
  };
  window.addEventListener("scroll", showWhatsApp, { passive: true });
  showWhatsApp();
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (
      key === "f12" ||
      (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
      (event.ctrlKey && key === "u")
    )
      event.preventDefault();
  });
  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Cabañas La Rústica",
    description:
      "Cabañas temporarias en las montañas con vista a las sierras y al lago San Roque.",
    telephone: "+5493541239349",
    url: "https://gokywebs.com/demo/cabanaslarustica/",
    areaServed: "Sierras de Córdoba, Argentina",
  });
  document.head.append(schema);
}
