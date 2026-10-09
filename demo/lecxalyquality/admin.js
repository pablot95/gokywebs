'use strict';
const PAGE_LIMIT = 25;
const BUFFER_LIMIT = 100;
const SEARCH_TARGET = 1;
const state = { items: [], cursor: null, loading: false, dropped: false, searching: false, generation: 0, error: '' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').toLocaleLowerCase('es-AR').normalize('NFD').replace(/[̀-ͯ]/g, '');
const matches = (p, q) => norm([p.nombre, p.categoria, p.subcategoria, p.descripcion, p.etiquetas, p.color, p.condicion].join(' ')).includes(norm(q));
const money = v => '$' + Math.round(Number(v) || 0).toLocaleString('es-AR');
function estiloFoto(p) {
  const f = p.foco || { x: 50, y: 50, z: 1 };
  const z = Math.max(1, Number(f.z) || 1);
  const minimo = 100 - z * 100;
  const l = Math.max(minimo, Math.min(0, 50 - (Number(f.x) || 50) * z));
  const t = Math.max(minimo, Math.min(0, 50 - (Number(f.y) || 50) * z));
  return `--z:${z};--l:${l.toFixed(1)}%;--t:${t.toFixed(1)}%`;
}
async function page(cursor) {
  const url = new URL('api/productos.php', location.href);
  url.searchParams.set('scope', 'admin');
  url.searchParams.set('limit', String(PAGE_LIMIT));
  if (cursor) url.searchParams.set('cursor', cursor);
  const response = await window.fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw Error('No se pudo cargar la página');
  const data = await response.json();
  if (!Array.isArray(data.items) || data.items.length > 100) throw Error('El servidor superó el límite de 100');
  return data;
}
function fila(p) {
  const estado = !p.visible ? '<span class="pill hidden-item">Oculto</span>' : p.stock <= 0 ? '<span class="pill sin-stock">Sin stock</span>' : '<span class="pill">Visible</span>';
  const vars = (p.variantes?.opciones || []).map(o => `<span>${esc(o)}</span>`).join('');
  const precio = p.descuento > 0 ? `${money(p.precio * (1 - p.descuento / 100))} <small>(-${p.descuento}%)</small>` : money(p.precio);
  return `<tr><td><div class="product-cell"><span class="foto" style="${estiloFoto(p)}"><img src="images/${encodeURIComponent(p.imagen)}" alt=""></span><div>${esc(p.nombre)}<small>${esc(p.id)}${p.color ? ' · ' + esc(p.color) : ''}</small></div></div></td><td>${esc(p.categoria)}<small style="display:block;color:#6a6272">${esc(p.categoria === 'iPhone' ? (p.condicion || '') : p.subcategoria)}</small></td><td><div class="vars">${vars}</div></td><td class="num">${precio}</td><td class="num">${p.stock}</td><td>${estado}</td></tr>`;
}
function render() {
  const q = document.getElementById('admin-search').value.trim();
  const found = q ? state.items.filter(p => matches(p, q)) : state.items;
  document.getElementById('admin-rows').innerHTML = found.length ? found.map(fila).join('') : `<tr><td colspan="6">${q ? 'No encontramos coincidencias en las páginas consultadas.' : 'Todavía no hay productos.'}</td></tr>`;
  document.getElementById('admin-count').textContent = `${found.length} ${found.length === 1 ? 'resultado' : 'resultados'} · ${state.items.length} cargados`;
  const more = document.getElementById('admin-more');
  more.hidden = !state.cursor;
  more.disabled = state.loading;
  document.getElementById('admin-note').textContent = state.error || (state.searching ? 'Pidiendo otra página solo porque todavía no aparecen coincidencias.' : state.dropped ? 'Se muestran hasta 100 productos recientes; la colección completa no se guarda en el navegador.' : `Cada consulta al servidor trae hasta ${PAGE_LIMIT} productos (máximo 100).`);
}
async function loadMore(generation = state.generation) {
  if (state.loading || !state.cursor) return false;
  state.loading = true; state.error = ''; render();
  try {
    const data = await page(state.cursor);
    if (generation !== state.generation) return false;
    state.items.push(...data.items);
    state.cursor = data.nextCursor;
    if (state.items.length > BUFFER_LIMIT) { state.items.splice(0, state.items.length - BUFFER_LIMIT); state.dropped = true; }
    return true;
  } catch {
    if (generation === state.generation) state.error = 'No se pudo cargar la página siguiente. Intentá otra vez.';
    return false;
  } finally {
    if (generation === state.generation) { state.loading = false; render(); }
  }
}
async function resetFirst(generation) {
  state.items = []; state.cursor = null; state.dropped = false; state.error = ''; state.loading = true; render();
  try {
    const first = await page(null);
    if (generation !== state.generation) return false;
    state.items = first.items;
    state.cursor = first.nextCursor;
    return true;
  } catch {
    if (generation === state.generation) state.error = 'No pudimos cargar los productos.';
    return false;
  } finally {
    if (generation === state.generation) { state.loading = false; render(); }
  }
}
async function searchMore() {
  const generation = ++state.generation;
  state.loading = false;
  const q = document.getElementById('admin-search').value.trim();
  if (state.dropped || (!q && state.items.length === 0)) {
    if (!await resetFirst(generation)) return;
  }
  if (!q) { state.searching = false; render(); return; }
  state.searching = true; render();
  while (generation === state.generation && state.cursor && state.items.filter(p => matches(p, q)).length < SEARCH_TARGET) {
    if (state.loading) { await new Promise(resolve => setTimeout(resolve, 25)); continue; }
    if (!await loadMore(generation)) break;
  }
  if (generation === state.generation) { state.searching = false; render(); }
}
async function init() {
  await resetFirst(state.generation);
  let timer = 0;
  document.getElementById('admin-search').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(searchMore, 230); });
  document.getElementById('admin-more').addEventListener('click', () => loadMore());
}
init();
