/* «Ver demo» en el admin sin cambiar de pestaña (Pablo, 11-nov: "que se siga
 * abriendo en otra pestaña, pero yo quedarme donde estoy").
 *
 * Una página no puede abrir una pestaña de fondo (target=_blank siempre la trae
 * al frente); una extensión sí. Este script avisa al admin que está
 * (data-goky-fondo="1") y le pasa al service worker los links que el admin le
 * manda por postMessage. Sin la extensión, el admin abre el link como siempre.
 */
document.documentElement.dataset.gokyFondo = '1';
window.addEventListener('message', e => {
  if (e.source !== window || e.origin !== location.origin) return;
  const url = e.data && e.data.gokyAbrirFondo;
  if (typeof url !== 'string' || !/^https:\/\/(www\.)?gokywebs\.com\//.test(url)) return;
  chrome.runtime.sendMessage({ abrirFondo: url });
});
