/* Núcleo compartido — helpers, carrito, wishlist, filtros. Idéntico en ambas versiones. */
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const formatPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento/100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const getCategoria = id => (CATEGORIAS.find(c => c.id === id)?.label) || '';
const WSP = '5491164791703';
const ENVIO_GRATIS_DESDE = 25000;

const Cart = {
  KEY: 'compasivamente_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(prod, qty = 1) {
    const items = this.get(); const ex = items.find(i => i.id === prod.id);
    if (ex) ex.qty = Math.min(ex.qty + qty, prod.stock ?? 99);
    else items.push({ id: prod.id, qty: Math.min(qty, prod.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) { const items = this.get(); const it = items.find(i => i.id === Number(id)); if (!it) return; const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items); },
  remove(id) { this.save(this.get().filter(i => i.id !== Number(id))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s,i) => s + i.qty, 0); },
  total() { return this.get().reduce((s,i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

const Wishlist = {
  KEY: 'compasivamente_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(ids) { localStorage.setItem(this.KEY, JSON.stringify(ids)); document.dispatchEvent(new CustomEvent('wish:updated')); },
  has(id) { return this.get().includes(Number(id)); },
  toggle(id) { id = Number(id); const ids = this.get(); const i = ids.indexOf(id); if (i>=0) ids.splice(i,1); else ids.push(id); this.save(ids); return this.has(id); },
  count() { return this.get().length; }
};

function filtrarProductos({ q = '', categoria = '', orden = '' } = {}) {
  const nq = norm(q);
  let res = PRODUCTOS.filter(p => {
    if (categoria && p.categoria !== categoria) return false;
    if (nq) { const hay = norm([p.nombre, getCategoria(p.categoria), p.descripcionCorta].join(' ')); if (!hay.includes(nq)) return false; }
    return true;
  });
  if (orden === 'menor') res = res.slice().sort((a,b) => precioFinal(a) - precioFinal(b));
  else if (orden === 'mayor') res = res.slice().sort((a,b) => precioFinal(b) - precioFinal(a));
  return res;
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live','polite'); document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role','status');
  t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('hiding'); setTimeout(() => t.remove(), 220); }, 3200);
}
