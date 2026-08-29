/* global module */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const wspUrl = (numero, lineas) => `https://wa.me/${numero}?text=${encodeURIComponent(lineas.join('\n'))}`;

function filtrarProductos(productos, categorias, criterios) {
  const { query = '', categoria = '', marca = '', min = null, max = null } = criterios || {};
  const q = normalizar(query.trim());
  return productos.filter(p => {
    if (categoria && p.categoria !== categoria) return false;
    if (marca && p.marca !== marca) return false;
    const final = precioFinal(p);
    if (min !== null && (final < min || final > max)) return false;
    if (q) {
      const catNombre = categorias.find(c => c.id === p.categoria)?.nombre || '';
      const haystack = normalizar([p.nombre, p.marca, catNombre, p.descripcion, ...(p.tags || [])].join(' '));
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function paginar(items, visibleCount) {
  return items.slice(0, Math.max(0, visibleCount));
}

function clampQty(qty, stock) {
  const tope = stock ?? 99;
  return Math.max(1, Math.min(qty, tope));
}

function calcularCount(items) {
  return (items || []).reduce((s, i) => s + i.qty, 0);
}

function calcularTotal(items, productos) {
  return (items || []).reduce((s, i) => {
    const p = productos.find(x => x.id === i.id);
    return p ? s + precioFinal(p) * i.qty : s;
  }, 0);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { esc, formatearPrecio, precioFinal, normalizar, wspUrl, filtrarProductos, paginar, clampQty, calcularCount, calcularTotal };
}
