/* Catálogo: destinos, paquetes con galería y videos, blog y newsletter. */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const h = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const params = new URLSearchParams(location.search);
  const IMG = "images/";

  /* Modelo 1 / 2: la home lo guarda, las páginas internas lo respetan. */
  const body = document.body;
  if (body.dataset.pagina === "home") {
    try {
      sessionStorage.setItem("tte-modelo", body.classList.contains("m2") ? "2" : "1");
    } catch (e) {}
  }
  let modelo = "1";
  try {
    modelo = sessionStorage.getItem("tte-modelo") || "1";
  } catch (e) {}
  if (body.dataset.pagina !== "home") {
    body.classList.remove("m1", "m2");
    body.classList.add(modelo === "2" ? "m2" : "m1");
    document.querySelectorAll(".gw-modelos__btn").forEach((b) => {
      if (b.dataset.modelo === modelo) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  }
  const home = body.classList.contains("m2") ? "modelo-2.html" : "./";
  document.querySelectorAll("a[data-home]").forEach((a) => {
    a.href = home + (a.dataset.home || "");
  });

  const fecha = (iso) =>
    new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const linkDestino = (d) => `destino.html?d=${encodeURIComponent(d.slug)}`;
  const linkPaquete = (d, p) =>
    `paquete.html?d=${encodeURIComponent(d.slug)}&p=${encodeURIComponent(p.slug)}`;
  const contar = (p) => {
    const f = p.fotos.length;
    const v = p.videos.length;
    return [`${f} ${f === 1 ? "foto" : "fotos"}`, v ? `${v} ${v === 1 ? "video" : "videos"}` : ""]
      .filter(Boolean)
      .join(" · ");
  };

  /* ---------- Home: grilla de destinos ---------- */
  const grid = $("#destinos-grid");
  if (grid) {
    grid.innerHTML = DESTINOS.map(
      (d, i) => `
      <a class="dest-card" href="${linkDestino(d)}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
        <span class="dest-card__photo"><img src="${IMG + d.portada}" alt="" width="800" height="1000" loading="lazy"></span>
        <span class="dest-card__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="dest-card__body">
          <span class="dest-card__name">${h(d.nombre)}</span>
          <span class="dest-card__trips">${d.paquetes.map((p) => h(p.nombre)).join(" · ")}</span>
          <span class="dest-card__more">Ver ${d.paquetes.length} ${d.paquetes.length === 1 ? "viaje" : "viajes"}</span>
        </span>
      </a>`,
    ).join("");
  }

  /* ---------- Blog (home y blog.html) ---------- */
  const tarjetaPost = (p) => `
    <article class="post-card" data-animate="subir" style="opacity:0;transform:translateY(32px)">
      <a href="blog.html?post=${encodeURIComponent(p.slug)}">
        <span class="post-card__photo"><img src="${IMG + p.foto}" alt="${h(p.alt)}" width="800" height="560" loading="lazy"></span>
        <time datetime="${p.fecha}">${fecha(p.fecha)}</time>
        <h3>${h(p.titulo)}</h3>
        <p>${h(p.resumen)}</p>
        <span class="post-card__more">Leer nota</span>
      </a>
    </article>`;
  const blogHome = $("#blog-grid");
  if (blogHome) blogHome.innerHTML = POSTS.slice(0, 3).map(tarjetaPost).join("");

  const blogPage = $("#blog-page");
  if (blogPage) {
    const post = POSTS.find((p) => p.slug === params.get("post"));
    if (post) {
      document.title = `${post.titulo} — Blog — The Travel Edit`;
      blogPage.innerHTML = `
        <article class="post">
          <nav class="crumbs" aria-label="Ruta"><a href="${home}">Inicio</a><span>/</span><a href="blog.html">Blog</a></nav>
          <time datetime="${post.fecha}">${fecha(post.fecha)}</time>
          <h1>${h(post.titulo)}</h1>
          <p class="post__lead">${h(post.resumen)}</p>
          <figure class="post__photo"><img src="${IMG + post.foto}" alt="${h(post.alt)}" width="1600" height="1067"></figure>
          <div class="post__body">${post.cuerpo.map((t) => `<p>${h(t)}</p>`).join("")}</div>
          <a class="btn btn-primary" href="${home}#contacto">Consultá por un viaje así</a>
        </article>
        <section class="post-more"><h2>Otras notas</h2><div class="post-grid">${POSTS.filter((p) => p !== post).map(tarjetaPost).join("")}</div></section>`;
    } else {
      blogPage.innerHTML = `
        <header class="page-head">
          <nav class="crumbs" aria-label="Ruta"><a href="${home}">Inicio</a><span>/</span><span>Blog</span></nav>
          <p class="eyebrow">BLOG</p>
          <h1>Ideas para <em>tu próximo viaje.</em></h1>
          <p>Temporadas, consejos y destinos que vale la pena conocer.</p>
        </header>
        <div class="post-grid">${POSTS.map(tarjetaPost).join("")}</div>`;
    }
  }

  /* ---------- Página de destino ---------- */
  const destPage = $("#destino-page");
  if (destPage) {
    const d = DESTINOS.find((x) => x.slug === params.get("d")) || DESTINOS[0];
    document.title = `${d.nombre} — The Travel Edit`;
    destPage.innerHTML = `
      <header class="dest-hero">
        <img src="${IMG + d.portada}" alt="" width="1600" height="1067" fetchpriority="high">
        <div class="dest-hero__copy container">
          <nav class="crumbs" aria-label="Ruta"><a href="${home}">Inicio</a><span>/</span><a href="${home}#destinos">Destinos</a></nav>
          <h1>${h(d.nombre)}</h1>
          <p>${h(d.bajada)}</p>
        </div>
      </header>
      <section class="container dest-trips" aria-label="Viajes en ${h(d.nombre)}">
        <p class="eyebrow">${d.paquetes.length} ${d.paquetes.length === 1 ? "VIAJE" : "VIAJES"} EN ${h(d.nombre.toUpperCase())}</p>
        <div class="trip-list">
          ${d.paquetes
            .map(
              (p) => `
            <a class="trip-card" href="${linkPaquete(d, p)}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
              <span class="trip-card__photo"><img src="${IMG + p.fotos[0].src}" alt="${h(p.fotos[0].alt)}" width="1600" height="1067" loading="lazy"></span>
              <span class="trip-card__body">
                <span class="trip-card__meta">${contar(p)}</span>
                <h2>${h(p.nombre)}</h2>
                <p>${h(p.resumen)}</p>
                <span class="trip-card__more">Ver el viaje</span>
              </span>
            </a>`,
            )
            .join("")}
        </div>
      </section>
      ${otrosDestinos(d)}`;
  }

  function otrosDestinos(actual) {
    return `
      <section class="other-dest container" aria-labelledby="otros-title">
        <h2 id="otros-title">Otros destinos</h2>
        <div class="other-dest__row">
          ${DESTINOS.filter((x) => x !== actual)
            .map(
              (x) => `<a href="${linkDestino(x)}"><img src="${IMG + x.portada}" alt="" width="400" height="300" loading="lazy"><span>${h(x.nombre)}</span></a>`,
            )
            .join("")}
        </div>
      </section>`;
  }

  /* ---------- Página de paquete ---------- */
  const paqPage = $("#paquete-page");
  if (paqPage) {
    const d = DESTINOS.find((x) => x.slug === params.get("d")) || DESTINOS[0];
    const p = d.paquetes.find((x) => x.slug === params.get("p")) || d.paquetes[0];
    document.title = `${p.nombre} — ${d.nombre} — The Travel Edit`;
    const fotos = p.fotos;
    paqPage.innerHTML = `
      <div class="container trip">
        <nav class="crumbs" aria-label="Ruta"><a href="${home}">Inicio</a><span>/</span><a href="${home}#destinos">Destinos</a><span>/</span><a href="${linkDestino(d)}">${h(d.nombre)}</a></nav>
        <header class="trip__head">
          <p class="eyebrow">${h(d.nombre.toUpperCase())}</p>
          <h1>${h(p.nombre)}</h1>
          <p class="trip__lead">${h(p.resumen)}</p>
        </header>
        <div class="gallery ${fotos.length === 1 ? "gallery--single" : ""}">
          <button type="button" class="gallery__main" data-foto="0" aria-label="Ver foto en grande">
            <img src="${IMG + fotos[0].src}" alt="${h(fotos[0].alt)}" width="1600" height="1067" fetchpriority="high">
          </button>
          ${
            fotos.length > 1
              ? `<div class="gallery__thumbs">${fotos
                  .map(
                    (f, i) => `<button type="button" data-foto="${i}" aria-label="Foto ${i + 1} de ${fotos.length}"${i === 0 ? ' aria-current="true"' : ""}><img src="${IMG + f.src}" alt="" width="320" height="213" loading="lazy"></button>`,
                  )
                  .join("")}</div>`
              : ""
          }
        </div>
        <div class="trip__grid">
          <div class="trip__text">
            <p>${h(p.texto)}</p>
            <h2>Lo que puede incluir</h2>
            <ul class="trip__list">${p.destacados.map((x) => `<li>${h(x)}</li>`).join("")}</ul>
            <p class="small">Cada viaje se arma a medida: fechas, alojamientos y servicios se confirman en la propuesta.</p>
          </div>
          <aside class="trip__aside">
            <h2>¿Te imaginás este viaje?</h2>
            <p>Contanos tus fechas y cómo te gusta viajar, y armamos una propuesta.</p>
            <a class="btn btn-primary" href="${home}#contacto">Pedí tu propuesta</a>
          </aside>
        </div>
        ${
          p.videos.length
            ? `<section class="trip__videos" aria-labelledby="videos-title">
                <h2 id="videos-title">${p.videos.length === 1 ? "Video" : "Videos"}</h2>
                <div class="video-grid">${p.videos
                  .map(
                    (v) => `<div class="video"><button type="button" class="video__play" data-yt="${h(v.id)}" aria-label="Reproducir video: ${h(v.titulo)}"><img src="https://i.ytimg.com/vi/${h(v.id)}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy"><span class="video__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></button><p>${h(v.titulo)}</p></div>`,
                  )
                  .join("")}</div>
              </section>`
            : ""
        }
        ${
          d.paquetes.length > 1
            ? `<section class="trip__more" aria-labelledby="mas-title"><h2 id="mas-title">Más viajes en ${h(d.nombre)}</h2><div class="trip-list trip-list--small">${d.paquetes
                .filter((x) => x !== p)
                .map(
                  (x) => `<a class="trip-card" href="${linkPaquete(d, x)}"><span class="trip-card__photo"><img src="${IMG + x.fotos[0].src}" alt="" width="1600" height="1067" loading="lazy"></span><span class="trip-card__body"><span class="trip-card__meta">${contar(x)}</span><h3>${h(x.nombre)}</h3><span class="trip-card__more">Ver el viaje</span></span></a>`,
                )
                .join("")}</div></section>`
            : ""
        }
      </div>
      ${otrosDestinos(d)}`;

    /* Galería: miniaturas + visor a pantalla completa */
    const main = $(".gallery__main", paqPage);
    const mainImg = $("img", main);
    paqPage.querySelectorAll(".gallery__thumbs button").forEach((b) =>
      b.addEventListener("click", () => {
        const i = +b.dataset.foto;
        mainImg.src = IMG + fotos[i].src;
        mainImg.alt = fotos[i].alt;
        main.dataset.foto = i;
        paqPage
          .querySelectorAll(".gallery__thumbs button")
          .forEach((x) => x.toggleAttribute("aria-current", x === b));
      }),
    );
    main.addEventListener("click", () => abrirVisor(fotos, +main.dataset.foto));

    /* Videos: se cargan recién al tocar */
    paqPage.querySelectorAll(".video__play").forEach((b) =>
      b.addEventListener("click", () => {
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.yt)}?autoplay=1&rel=0`;
        f.title = b.getAttribute("aria-label").replace("Reproducir video: ", "");
        f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        f.allowFullscreen = true;
        b.replaceWith(f);
      }),
    );
  }

  function abrirVisor(fotos, inicio) {
    let i = inicio;
    const prev = document.activeElement;
    const v = document.createElement("div");
    v.className = "viewer";
    v.setAttribute("role", "dialog");
    v.setAttribute("aria-modal", "true");
    v.setAttribute("aria-label", "Fotos del viaje");
    v.innerHTML = `
      <img alt="">
      <p class="viewer__count" aria-live="polite"></p>
      <button type="button" class="viewer__close" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      ${
        fotos.length > 1
          ? `<button type="button" class="viewer__nav viewer__prev" aria-label="Foto anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg></button>
             <button type="button" class="viewer__nav viewer__next" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button>`
          : ""
      }`;
    const img = $("img", v);
    const show = () => {
      img.src = IMG + fotos[i].src;
      img.alt = fotos[i].alt;
      $(".viewer__count", v).textContent = `${i + 1} / ${fotos.length}`;
    };
    const mover = (n) => {
      i = (i + n + fotos.length) % fotos.length;
      show();
    };
    const cerrar = () => {
      v.remove();
      body.classList.remove("no-scroll");
      document.removeEventListener("keydown", teclas);
      prev?.focus();
    };
    const teclas = (e) => {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowRight") mover(1);
      else if (e.key === "ArrowLeft") mover(-1);
      else if (e.key === "Tab") {
        const bs = [...v.querySelectorAll("button")];
        const idx = bs.indexOf(document.activeElement);
        e.preventDefault();
        bs[(idx + (e.shiftKey ? -1 : 1) + bs.length) % bs.length].focus();
      }
    };
    $(".viewer__close", v).addEventListener("click", cerrar);
    $(".viewer__prev", v)?.addEventListener("click", () => mover(-1));
    $(".viewer__next", v)?.addEventListener("click", () => mover(1));
    v.addEventListener("click", (e) => {
      if (e.target === v) cerrar();
    });
    let x0 = null;
    v.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    v.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1);
      x0 = null;
    });
    document.addEventListener("keydown", teclas);
    body.appendChild(v);
    body.classList.add("no-scroll");
    show();
    $(".viewer__close", v).focus();
  }

  /* ---------- Newsletter ---------- */
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const err = form.querySelector(".field-error");
      const ok = input.value.trim() && input.validity.valid;
      input.setAttribute("aria-invalid", String(!ok));
      if (err) err.textContent = ok ? "" : "Revisá que el email esté completo.";
      if (!ok) {
        input.focus();
        return;
      }
      const msg = "¡Listo! La suscripción se activa al pasar la web a producción.";
      if (typeof showToast === "function") showToast(msg);
      form.reset();
      input.removeAttribute("aria-invalid");
    });
  });
})();
