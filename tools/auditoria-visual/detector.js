(async () => {
  try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 3000))]); } catch (e) {}
  const W = innerWidth, SY = scrollY;
  const out = { pisados: [], cortados: [], fuera: [], rotas: [], desborde: 0, desbordeEl: [], alto: document.documentElement.scrollHeight };
  const csCache = new Map();
  const cs = e => { let c = csCache.get(e); if (!c) { c = getComputedStyle(e); csCache.set(e, c); } return c; };
  const sel = e => { if (!e) return ''; let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 2); if (c.length) s += '.' + c.join('.'); return s; };
  const ruta = e => { const p = []; for (let x = e; x && x !== document.body && p.length < 3; x = x.parentElement) p.unshift(sel(x)); return p.join(' > '); };
  const info = new Map();
  // Por elemento: visible?, fijo?, aria-hidden?, rect de recorte, ancestro que recorta, si está en un carril/marquesina
  function datos(el) {
    if (info.has(el)) return info.get(el);
    const par = el.parentElement && el.parentElement !== document.documentElement ? datos(el.parentElement) : { vis: true, fijo: false, oculto: false, clip: { l: -1e9, t: -1e9, r: 1e9, b: 1e9 }, carril: false, clamp: false };
    const c = cs(el);
    const d = { ...par, clip: { ...par.clip } };
    if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < 0.15 || c.contentVisibility === 'hidden') d.vis = false;
    if (c.position === 'fixed') d.fijo = true;
    if (el.parentElement && el.parentElement.tagName === 'DETAILS' && !el.parentElement.open && el.tagName !== 'SUMMARY') d.vis = false;
    if (el.tagName === 'DIALOG' && !el.open) d.vis = false;
    if (el.getAttribute('aria-hidden') === 'true' || el.hasAttribute('inert')) d.oculto = true;
    if ((c.webkitLineClamp && c.webkitLineClamp !== 'none') || c.textOverflow === 'ellipsis') d.clamp = true;
    if (el !== document.body && (c.overflowX !== 'visible' || c.overflowY !== 'visible' || (c.clipPath && c.clipPath !== 'none'))) {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) d.vis = false;   // sr-only y similares
      if (c.overflowX !== 'visible' && (el.scrollWidth > el.clientWidth * 1.15 || c.overflowX === 'auto' || c.overflowX === 'scroll')) d.carril = true;
      if (c.overflowX !== 'visible') { d.clip.l = Math.max(d.clip.l, r.left); d.clip.r = Math.min(d.clip.r, r.right); }
      if (c.overflowY !== 'visible') { d.clip.t = Math.max(d.clip.t, r.top); d.clip.b = Math.min(d.clip.b, r.bottom); }
      d.recorta = el;
    }
    if (c.animationName && c.animationName !== 'none' && /marq|scroll|ticker|cinta|loop|desliz|slide/i.test(c.animationName)) d.carril = true;
    info.set(el, d);
    return d;
  }
  const textos = [];
  const svgTxt = n => n.parentElement && n.parentElement.closest('svg');
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.trim().length >= 2 ? 1 : 3 });
  const rango = document.createRange();
  let n;
  while ((n = tw.nextNode())) {
    const el = n.parentElement;
    if (!el || svgTxt(n) || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|OPTION|TEXTAREA|SVG|TITLE)$/i.test(el.tagName)) continue;
    const d = datos(el);
    if (!d.vis || d.fijo) continue;
    rango.selectNodeContents(n);
    const fs = parseFloat(cs(el).fontSize) || 16;
    for (const r of rango.getClientRects()) {
      if (r.width < 2 || r.height < 2) continue;
      const v = { l: Math.max(r.left, d.clip.l), t: Math.max(r.top, d.clip.t), r: Math.min(r.right, d.clip.r), b: Math.min(r.bottom, d.clip.b) };
      if (v.r - v.l < 1 || v.b - v.t < 1) continue; // totalmente recortado: slide oculto, menú cerrado
      const area = r.width * r.height, va = (v.r - v.l) * (v.b - v.t);
      const txt = n.nodeValue.trim().replace(/\s+/g, ' ').slice(0, 50);
      // cortado verticalmente por un contenedor (no line-clamp, no carril)
      if (va < area * 0.8 && !d.clamp && !d.carril && out.cortados.length < 12) {
        const vert = (r.top < d.clip.t - 2) || (r.bottom > d.clip.b + 2);
        const horiz = (r.left < d.clip.l - 2) || (r.right > d.clip.r + 2);
        if (vert || horiz) out.cortados.push({ y: Math.round(r.top + SY), txt, el: ruta(el), por: sel(d.recorta), como: vert ? 'vertical' : 'horizontal', visible: Math.round(va / area * 100) });
      }
      // fuera de la pantalla a los costados (sin carril)
      if (!d.carril && (v.r > W + 1 || v.l < -1) && v.r > 0 && v.l < W && out.fuera.length < 12)
        out.fuera.push({ y: Math.round(r.top + SY), txt, el: ruta(el), der: Math.round(v.r - W), izq: Math.round(-v.l) });
      if (!d.oculto && va > 20) { const k = (v.b - v.t) * 0.22; textos.push({ el, v: { l: v.l, r: v.r, t: v.t + k, b: v.b - k }, fs, txt, y: v.t + SY }); }
    }
  }
  // textos de elementos distintos que se pisan
  textos.sort((a, b) => a.v.t - b.v.t);
  const vistos = new Set();
  for (let i = 0; i < textos.length && out.pisados.length < 12; i++) {
    const A = textos[i];
    for (let j = i + 1; j < textos.length; j++) {
      const B = textos[j];
      if (B.v.t >= A.v.b) break;
      if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const ix = Math.min(A.v.r, B.v.r) - Math.max(A.v.l, B.v.l), iy = Math.min(A.v.b, B.v.b) - Math.max(A.v.t, B.v.t);
      if (ix <= 2 || iy <= 2) continue;
      const aA = (A.v.r - A.v.l) * (A.v.b - A.v.t), aB = (B.v.r - B.v.l) * (B.v.b - B.v.t);
      const inter = ix * iy;
      if (inter < 30 || inter < Math.min(aA, aB) * 0.2) continue;
      if (Math.max(A.fs, B.fs) / Math.min(A.fs, B.fs) > 2.6) continue; // palabra decorativa gigante detrás
      const k = A.txt + '|' + B.txt; if (vistos.has(k)) continue; vistos.add(k);
      out.pisados.push({ y: Math.round(Math.min(A.y, B.y)), txt: A.txt, txt2: B.txt, el: ruta(A.el), el2: ruta(B.el), pct: Math.round(inter / Math.min(aA, aB) * 100) });
      if (out.pisados.length >= 12) break;
    }
  }
  // desborde horizontal de la página
  const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (sw > W + 2) {
    out.desborde = sw - W;
    for (const e of document.body.querySelectorAll('*')) {
      const r = e.getBoundingClientRect();
      if (r.right > W + 2 && r.width > 0 && r.width < W * 3) { const d = datos(e); if (d.vis && !d.fijo && d.clip.r > W + 2) { out.desbordeEl.push(ruta(e) + ' (' + Math.round(r.right - W) + 'px)'); if (out.desbordeEl.length > 5) break; } }
    }
  }
  // fotos rotas
  for (const img of document.images) {
    const r = img.getBoundingClientRect();
    if (r.width * r.height < 400) continue;
    const d = datos(img); if (!d.vis) continue;
    if (img.complete && img.naturalWidth === 0 && (img.currentSrc || img.src)) out.rotas.push({ y: Math.round(r.top + SY), src: (img.currentSrc || img.src).slice(0, 140) });
    if (out.rotas.length > 8) break;
  }
  return out;
})()
