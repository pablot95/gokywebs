(function (root) {
  const CABANAS = {
    muelle: 'Del Muelle (2 a 3 personas)',
    timbo: 'Del Timbó (4 a 5 personas)',
    monte: 'Del Monte (hasta 6 personas)',
  };

  function calcNoches(llegada, salida) {
    if (!llegada || !salida) return 0;
    const a = new Date(llegada + 'T12:00:00');
    const b = new Date(salida + 'T12:00:00');
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
    return Math.round((b - a) / 86400000);
  }

  function formatearFecha(iso) {
    if (!iso || iso.split('-').length !== 3) return iso || '';
    const partes = iso.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function armarResumen(datos) {
    const noches = calcNoches(datos.llegada, datos.salida);
    if (!datos.cabana || noches <= 0) return null;
    const nombre = CABANAS[datos.cabana] || datos.cabana;
    const plural = noches === 1 ? 'noche' : 'noches';
    return `Cabaña ${nombre} · ${noches} ${plural} · ${datos.huespedes} ${datos.huespedes === 1 ? 'huésped' : 'huéspedes'}`;
  }

  function armarMensajeReserva(datos) {
    const noches = calcNoches(datos.llegada, datos.salida);
    const nombre = CABANAS[datos.cabana] || datos.cabana;
    const plural = noches === 1 ? 'noche' : 'noches';
    let msg = 'Hola Cabañas Don Juvenal, quiero consultar disponibilidad.';
    msg += `\n- Cabaña: ${nombre}`;
    msg += `\n- Del ${formatearFecha(datos.llegada)} al ${formatearFecha(datos.salida)} (${noches} ${plural})`;
    msg += `\n- Huéspedes: ${datos.huespedes}`;
    if (datos.extras && datos.extras.length) msg += `\n- Extras: ${datos.extras.join(', ')}`;
    return msg;
  }

  const api = { CABANAS, calcNoches, formatearFecha, armarResumen, armarMensajeReserva };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReservaCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
