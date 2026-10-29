/* Gokywebs - zips de ChatGPT (Pablo, 29-oct: «que los zips se descarguen solos
 * en la carpeta Descargas»).
 *
 * La tarea de ChatGPT «Gokywebs Copiar 10» corre en la nube y deja cada zip como
 * un link «Descargar ZIP» (sandbox:/...zip) en un chat con ese título. Cada 10
 * minutos esto busca esos links en los chats de los últimos días y baja los
 * nuevos a Descargas con la sesión de Pablo, con las mismas llamadas que hace la
 * página al tocar el link. Solo lee: no toca nada en ChatGPT.
 *
 * Corre en el Chrome de siempre porque ChatGPT frena a los Chrome manejados por
 * un programa. Primero prueba desde acá; si ChatGPT no responde, lo hace dentro
 * de una pestaña de chatgpt.com (abre una en segundo plano y la cierra).
 *
 * Después, tools/chatgpt-zips/subir.py (tarea de Windows) sube cada zip a la
 * ficha del prospecto en el admin: el nombre trae el id (Negocio_<id>.zip).
 */

const TITULO = 'Copiar 10';
const DIAS = 3;

chrome.runtime.onInstalled.addListener(() => chrome.alarms.create('revisar', { periodInMinutes: 10, delayInMinutes: 0.2 }));
chrome.runtime.onStartup.addListener(() => chrome.alarms.create('revisar', { periodInMinutes: 10, delayInMinutes: 1 }));
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'revisar') revisar(); });
chrome.action.onClicked.addListener(() => revisar());

/* Corre igual desde el service worker (base = https://chatgpt.com) o dentro de
 * la página (base = ''): por eso no usa nada de afuera. Devuelve el token y,
 * para cada zip que no está en `hechos`, su link temporal y su nombre. */
async function buscar(base, titulo, desde, hechos) {
  const s = await fetch(base + '/api/auth/session', { credentials: 'include' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  if (!s.accessToken) return { sinSesion: true };
  const h = { Authorization: 'Bearer ' + s.accessToken };
  const chats = [];
  for (let offset = 0; offset < 300; offset += 100) {
    const r = await fetch(`${base}/backend-api/conversations?offset=${offset}&limit=100&order=updated`, { headers: h, credentials: 'include' });
    if (!r.ok) return { error: 'conversations HTTP ' + r.status };
    const items = (await r.json()).items || [];
    let viejo = false;
    for (const c of items) {
      const t = Date.parse(c.update_time) / 1000 || Number(c.update_time) || 0;
      if (t < desde) { viejo = true; continue; }
      if ((c.title || '').includes(titulo)) chats.push(c.id);
    }
    if (viejo || items.length < 100) break;
  }
  const zips = [];
  for (const cid of chats) {
    const r = await fetch(`${base}/backend-api/conversation/${cid}`, { headers: h, credentials: 'include' });
    if (!r.ok) continue;
    const c = await r.json();
    for (const n of Object.values(c.mapping || {})) {
      const m = n.message;
      if (!m || m.author?.role !== 'assistant' || m.content?.content_type !== 'text' || (m.create_time || 0) < desde) continue;
      const texto = (m.content.parts || []).filter(x => typeof x === 'string').join('\n');
      for (const k of texto.matchAll(/sandbox:([^\s)\]]+?\.zip)/g)) {
        const ruta = k[1];
        // Los «Descargar todas» repiten los zips de cada negocio.
        if (/Descargar_todas/i.test(ruta) || hechos.includes(ruta)) continue;
        const d = await fetch(`${base}/backend-api/conversation/${cid}/interpreter/download?message_id=${m.id}&sandbox_path=${encodeURIComponent(ruta)}`,
                              { headers: h, credentials: 'include' }).then(x => x.ok ? x.json() : {}).catch(() => ({}));
        if (d.download_url) zips.push({ ruta, url: d.download_url, nombre: d.file_name || ruta.split('/').pop() });
      }
    }
  }
  return { token: s.accessToken, zips };
}

async function buscarEnPestana(args) {
  let tab = (await chrome.tabs.query({ url: 'https://chatgpt.com/*' }))[0];
  const propia = !tab;
  if (propia) {
    tab = await chrome.tabs.create({ url: 'https://chatgpt.com/', active: false });
    await new Promise(listo => {
      const fin = setTimeout(listo, 30000);
      chrome.tabs.onUpdated.addListener(function oir(id, info) {
        if (id === tab.id && info.status === 'complete') { chrome.tabs.onUpdated.removeListener(oir); clearTimeout(fin); listo(); }
      });
    });
    await new Promise(r => setTimeout(r, 3000));
  }
  try {
    const [r] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, world: 'MAIN', func: buscar, args: ['', ...args] });
    return r?.result || { error: 'sin resultado de la pestaña' };
  } finally {
    if (propia) chrome.tabs.remove(tab.id).catch(() => {});
  }
}

let corriendo = false;
async function revisar() {
  if (corriendo) return;
  corriendo = true;
  try {
    const st = await chrome.storage.local.get(['hechos', 'desde']);
    const hechos = st.hechos || {};
    // La primera vez solo cuentan las últimas 12 horas: lo anterior ya lo bajó Pablo a mano.
    let desde = st.desde;
    if (!desde) { desde = Date.now() / 1000 - 12 * 3600; await chrome.storage.local.set({ desde }); }
    const args = [TITULO, Math.max(desde, Date.now() / 1000 - DIAS * 86400), Object.keys(hechos)];

    let res = await buscar('https://chatgpt.com', ...args).catch(e => ({ error: String(e) }));
    if (res.sinSesion || res.error) res = await buscarEnPestana(args).catch(e => ({ error: String(e) }));
    if (res.sinSesion) return estado('Sin sesión de ChatGPT en este Chrome', '!');
    if (res.error) return estado('Error: ' + res.error, '!');

    let bajados = 0;
    for (const z of res.zips) {
      const url = z.url.startsWith('http') ? z.url : 'https://chatgpt.com' + z.url;
      const nombre = z.nombre.replace(/[<>:"/\\|?*\x00-\x1f]+/g, '_');
      try {
        await chrome.downloads.download({ url, filename: nombre, conflictAction: 'uniquify', saveAs: false,
                                          headers: [{ name: 'Authorization', value: 'Bearer ' + res.token }] });
        hechos[z.ruta] = Date.now();
        bajados++;
      } catch (e) {
        console.warn('No se pudo bajar', nombre, e);
      }
    }
    // Lo de más de 30 días ya no aparece en la búsqueda: se olvida.
    for (const [k, t] of Object.entries(hechos)) if (Date.now() - t > 30 * 86400000) delete hechos[k];
    await chrome.storage.local.set({ hechos });
    estado(bajados ? `Bajé ${bajados} zip${bajados > 1 ? 's' : ''} a Descargas` : 'Sin zips nuevos', bajados ? String(bajados) : '');
  } finally {
    corriendo = false;
  }
}

function estado(texto, insignia) {
  const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  chrome.action.setTitle({ title: `Zips de ChatGPT (${hora}): ${texto}. Tocá para revisar ahora.` });
  chrome.action.setBadgeText({ text: insignia });
  chrome.action.setBadgeBackgroundColor({ color: insignia === '!' ? '#DC2626' : '#16A34A' });
  chrome.storage.local.set({ ultimo: { hora, texto } });
}
