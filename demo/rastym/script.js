const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WSP = '5491122428090';
const MAYORISTA_DESDE = 6;

const CATEGORIAS = [
    { id: 'all', nombre: 'Todo' },
    { id: 'remeras', nombre: 'Remeras' },
    { id: 'camisas', nombre: 'Camisas' },
    { id: 'abrigos', nombre: 'Abrigos' },
    { id: 'jeans', nombre: 'Jeans' },
];

const PRODUCTOS = [
    { id: 'polo-negra', nombre: 'Chomba Piqué Negra', cat: 'remeras', precio: 28900, precioMayor: 20200, talles: ['S', 'M', 'L', 'XL', 'XXL'], talleDefault: 'M', img: 'images/prod-polo.webp', desc: 'Piqué peinado con cuello y puños de terminación firme. El básico que aguanta lavadas y no suelta el negro.', tags: 'chomba polo remera basico negra', badge: '' },
    { id: 'camisa-blanca', nombre: 'Camisa Oxford Blanca', cat: 'camisas', precio: 42500, precioMayor: 29700, talles: ['S', 'M', 'L', 'XL', 'XXL'], talleDefault: 'M', img: 'images/prod-camisa-blanca.webp', desc: 'Oxford blanco de cuello prolijo y corte regular. La única prenda clara del perchero, y por algo se queda.', tags: 'camisa oxford blanca vestir formal', badge: '' },
    { id: 'camisa-cuadros', nombre: 'Leñadora Cuadros Rojo y Negro', cat: 'camisas', precio: 45900, precioMayor: 32100, talles: ['S', 'M', 'L', 'XL', 'XXL'], talleDefault: 'M', img: 'images/prod-camisa-cuadros.webp', desc: 'Franela pesada a cuadros rojo y negro. Abierta sobre una remera o cerrada como camisa: gana igual.', tags: 'camisa lenadora cuadros escocesa franela roja', badge: 'NUEVO' },
    { id: 'hoodie-negro', nombre: 'Hoodie Oversize Negro', cat: 'abrigos', precio: 54900, precioMayor: 38400, talles: ['S', 'M', 'L', 'XL', 'XXL'], talleDefault: 'L', img: 'images/prod-hoodie.webp', desc: 'Frisa de 340 gramos, capucha con cordón grueso y bolsillo canguro. Oversize real, no un talle flojo.', tags: 'buzo hoodie canguro frisa oversize negro', badge: '' },
    { id: 'jean-black', nombre: 'Jean Slim Black', cat: 'jeans', precio: 62400, precioMayor: 43600, talles: ['38', '40', '42', '44', '46'], talleDefault: '42', img: 'images/prod-jeans.webp', desc: 'Denim rígido con lavado black parejo y calce slim sin apretar. Cierra con zapatilla blanca o borcego.', tags: 'jean pantalon denim negro slim', badge: '' },
    { id: 'bomber-negra', nombre: 'Bomber MA-1 Negra', cat: 'abrigos', precio: 89900, precioMayor: 62900, talles: ['S', 'M', 'L', 'XL', 'XXL'], talleDefault: 'M', img: 'images/prod-bomber.webp', desc: 'Nylon mate con puños elastizados y bolsillo en la manga. La campera que termina cualquier fit sin esfuerzo.', tags: 'campera bomber ma1 aviador negra abrigo', badge: 'DROP 08' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const precioUnitario = (p, mayorista) => mayorista ? p.precioMayor : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const Cart = {
    KEY: 'rastym_cart',
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
    add(producto, talle, qty = 1) {
        if (!producto || !producto.talles.includes(talle)) return;
        const items = this.get();
        const existing = items.find(i => i.id === producto.id && i.talle === talle);
        if (existing) existing.qty = Math.min(existing.qty + qty, 99);
        else items.push({ id: producto.id, talle, qty: Math.min(qty, 99) });
        this.save(items);
    },
    setQty(id, talle, qty) {
        const items = this.get();
        const it = items.find(i => i.id === id && i.talle === talle);
        if (!it) return;
        it.qty = Math.max(1, Math.min(qty, 99));
        this.save(items);
    },
    setTalle(id, talleViejo, talleNuevo) {
        const p = getProducto(id);
        if (!p || !p.talles.includes(talleNuevo)) return;
        const items = this.get();
        const it = items.find(i => i.id === id && i.talle === talleViejo);
        if (!it) return;
        const destino = items.find(i => i.id === id && i.talle === talleNuevo);
        if (destino) {
            destino.qty = Math.min(destino.qty + it.qty, 99);
            this.save(items.filter(i => i !== it));
        } else {
            it.talle = talleNuevo;
            this.save(items);
        }
    },
    remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
    clear() { this.save([]); },
    count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    esMayorista() { return this.count() >= MAYORISTA_DESDE; },
    subtotalMinorista() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); },
    total() {
        const mayor = this.esMayorista();
        return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioUnitario(p, mayor) * i.qty : s; }, 0);
    },
    ahorro() { return this.esMayorista() ? this.subtotalMinorista() - this.total() : 0; },
};

function buildWaMessage() {
    const items = Cart.get();
    if (!items.length) return '';
    const mayor = Cart.esMayorista();
    let msg = 'Hola RASTYM! Te paso mi pedido:\n\n';
    items.forEach(i => {
        const p = getProducto(i.id);
        if (!p) return;
        msg += `• ${p.nombre} (talle ${i.talle}) x${i.qty} — ${formatearPrecio(precioUnitario(p, mayor) * i.qty)}\n`;
    });
    msg += `\nTotal ${mayor ? `mayorista (${Cart.count()} prendas)` : 'minorista'}: ${formatearPrecio(Cart.total())}`;
    if (mayor) msg += `\n(Ahorro mayorista: ${formatearPrecio(Cart.ahorro())})`;
    msg += '\n\n¿Cómo seguimos?';
    return `https://wa.me/${WSP}?text=` + encodeURIComponent(msg);
}

function showToast(msg) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
    wrap.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
        e.preventDefault();
    }
});

const filtro = { cat: 'all', q: '' };

function productosFiltrados() {
    const q = normalizar(filtro.q.trim());
    return PRODUCTOS.filter(p => {
        if (filtro.cat !== 'all' && p.cat !== filtro.cat) return false;
        if (!q) return true;
        const catNombre = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
        return normalizar(`${p.nombre} ${catNombre} ${p.tags} ${p.desc}`).includes(q);
    });
}

function renderChips() {
    const wrap = document.getElementById('catChips');
    wrap.innerHTML = CATEGORIAS.map(c =>
        `<button type="button" class="chip${filtro.cat === c.id ? ' active' : ''}" data-cat="${c.id}" aria-pressed="${filtro.cat === c.id}">${esc(c.nombre)}</button>`
    ).join('');
    wrap.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => { filtro.cat = btn.dataset.cat; renderChips(); renderCatalogo(); });
    });
}

function renderCatalogo() {
    const grid = document.getElementById('prodGrid');
    const empty = document.getElementById('catEmpty');
    const results = document.getElementById('catResults');
    const list = productosFiltrados();

    results.textContent = list.length === PRODUCTOS.length
        ? `${list.length} prendas en percha`
        : `${list.length} de ${PRODUCTOS.length} prendas`;

    grid.innerHTML = list.map(p => `
        <article class="prod-card" data-id="${p.id}">
            <button type="button" class="prod-media" data-quick="${p.id}" aria-label="Vista rápida de ${esc(p.nombre)}">
                ${p.badge ? `<span class="prod-badge">${esc(p.badge)}</span>` : ''}
                <img src="${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" ${p.id === 'polo-negra' || p.id === 'camisa-blanca' || p.id === 'camisa-cuadros' ? '' : 'loading="lazy"'}>
                <span class="prod-quick">Vista rápida</span>
            </button>
            <div class="prod-info">
                <span class="prod-cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
                <h3 class="prod-name">${esc(p.nombre)}</h3>
                <div class="prod-prices">
                    <span class="prod-price">${formatearPrecio(p.precio)}</span>
                    <span class="prod-mayor">x6+: <b>${formatearPrecio(p.precioMayor)}</b> c/u</span>
                </div>
                <div class="prod-actions">
                    <button type="button" class="btn btn-primary" data-add="${p.id}">Agregar</button>
                    <button type="button" class="btn btn-ghost" data-buy="${p.id}">Comprar ahora</button>
                </div>
            </div>
        </article>
    `).join('');

    empty.hidden = list.length > 0;

    const cards = grid.querySelectorAll('.prod-card');
    cards.forEach((card, i) => { card.style.transitionDelay = `${Math.min(i * 0.09, 0.55)}s`; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
        cards.forEach(card => card.classList.add('in'));
    }));

    grid.querySelectorAll('[data-quick]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.quick)));
    grid.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => {
        const p = getProducto(btn.dataset.add);
        if (!p) return;
        Cart.add(p, p.talleDefault, 1);
        showToast(`Colgada: ${p.nombre} (${p.talleDefault}). El talle lo cambiás en tu pedido.`);
    }));
    grid.querySelectorAll('[data-buy]').forEach(btn => btn.addEventListener('click', () => {
        const p = getProducto(btn.dataset.buy);
        if (!p) return;
        Cart.add(p, p.talleDefault, 1);
        openDrawer();
    }));

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

let modalProd = null;
let modalTalle = '';
let modalQty = 1;
let modalOpener = null;

function renderModalTalles() {
    const wrap = document.getElementById('modalTalles');
    wrap.innerHTML = modalProd.talles.map(t =>
        `<button type="button" class="talle-chip${t === modalTalle ? ' active' : ''}" data-talle="${t}" aria-pressed="${t === modalTalle}">${t}</button>`
    ).join('');
    wrap.querySelectorAll('.talle-chip').forEach(btn => {
        btn.addEventListener('click', () => { modalTalle = btn.dataset.talle; renderModalTalles(); });
    });
}

function openModal(id) {
    const p = getProducto(id);
    if (!p) return;
    modalProd = p;
    modalTalle = p.talleDefault;
    modalQty = 1;
    modalOpener = document.activeElement;

    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalImg').alt = p.nombre;
    document.getElementById('modalCat').textContent = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
    document.getElementById('modalName').textContent = p.nombre;
    document.getElementById('modalDesc').textContent = p.desc;
    document.getElementById('modalPrice').textContent = formatearPrecio(p.precio);
    document.getElementById('modalMayor').innerHTML = `Llevando 6 prendas o más: <b>${formatearPrecio(p.precioMayor)}</b> c/u`;
    document.getElementById('qtyVal').textContent = '1';
    renderModalTalles();

    const related = PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat);
    const fill = related.length >= 2 ? related : related.concat(PRODUCTOS.filter(x => x.id !== p.id && x.cat !== p.cat));
    document.getElementById('relatedGrid').innerHTML = fill.slice(0, 2).map(r => `
        <button type="button" class="related-card" data-rel="${r.id}">
            <img src="${r.img}" alt="${esc(r.nombre)}" width="120" height="120" loading="lazy">
            <span><span class="rc-name">${esc(r.nombre)}</span><span class="rc-price">${formatearPrecio(r.precio)}</span></span>
        </button>
    `).join('');
    document.querySelectorAll('[data-rel]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.rel)));

    document.getElementById('modalBackdrop').classList.add('open');
    const modal = document.getElementById('prodModal');
    modal.classList.add('open');
    modal.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    document.getElementById('modalClose').focus();
}

function closeModal() {
    const modal = document.getElementById('prodModal');
    modal.classList.remove('open');
    modal.setAttribute('inert', '');
    document.getElementById('modalBackdrop').classList.remove('open');
    document.body.classList.remove('no-scroll');
    modalOpener?.focus?.();
}

function trapFocus(container, e) {
    const focusables = container.querySelectorAll('button, a[href], select, input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let drawerOpener = null;

function renderDrawer() {
    const items = Cart.get();
    const wrap = document.getElementById('drawerItems');
    const emptyEl = document.getElementById('drawerEmpty');
    const foot = document.getElementById('drawerFoot');
    const bar = document.getElementById('mayorBar');
    const mayor = Cart.esMayorista();

    emptyEl.classList.toggle('show', items.length === 0);
    wrap.style.display = items.length ? '' : 'none';
    foot.style.display = items.length ? '' : 'none';
    bar.style.display = items.length ? '' : 'none';

    wrap.innerHTML = items.map((i, idx) => {
        const p = getProducto(i.id);
        if (!p) return '';
        const unit = precioUnitario(p, mayor);
        return `
        <div class="drawer-item" style="animation-delay:${Math.min(idx * 0.06, 0.3)}s">
            <div class="drawer-item-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="148" height="148"></div>
            <div>
                <p class="drawer-item-name">${esc(p.nombre)}</p>
                <div class="drawer-item-meta">
                    <select class="talle-select" data-talle-for="${p.id}::${i.talle}" aria-label="Talle de ${esc(p.nombre)}">
                        ${p.talles.map(t => `<option value="${t}"${t === i.talle ? ' selected' : ''}>Talle ${t}</option>`).join('')}
                    </select>
                    <span class="drawer-qty">
                        <button type="button" data-minus="${p.id}::${i.talle}" aria-label="Restar uno">−</button>
                        <span>${i.qty}</span>
                        <button type="button" data-plus="${p.id}::${i.talle}" aria-label="Sumar uno">+</button>
                    </span>
                </div>
                <button type="button" class="drawer-item-remove" data-remove="${p.id}::${i.talle}">Quitar</button>
            </div>
            <div class="drawer-item-price">${formatearPrecio(unit * i.qty)}<span class="drawer-item-unit">${formatearPrecio(unit)} c/u</span></div>
        </div>`;
    }).join('');

    const count = Cart.count();
    const faltan = MAYORISTA_DESDE - count;
    document.getElementById('mayorBarText').innerHTML = mayor
        ? '<b>Precio mayorista aplicado.</b> Todo el pedido pasó a valor de reventa.'
        : `Sumá <b>${faltan} ${faltan === 1 ? 'prenda' : 'prendas'} más</b> y todo el pedido pasa a precio mayorista.`;
    document.getElementById('mayorBarFill').style.width = `${Math.min(100, (count / MAYORISTA_DESDE) * 100)}%`;

    document.getElementById('drawerSubtotal').textContent = formatearPrecio(Cart.subtotalMinorista());
    document.getElementById('drawerMayorRow').hidden = !mayor;
    if (mayor) document.getElementById('drawerAhorro').textContent = '−' + formatearPrecio(Cart.ahorro());
    document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
    document.getElementById('waOrderBtn').href = buildWaMessage() || '#';

    wrap.querySelectorAll('[data-minus]').forEach(b => b.addEventListener('click', () => {
        const [id, talle] = b.dataset.minus.split('::');
        const it = Cart.get().find(i => i.id === id && i.talle === talle);
        if (it && it.qty <= 1) Cart.remove(id, talle);
        else if (it) Cart.setQty(id, talle, it.qty - 1);
    }));
    wrap.querySelectorAll('[data-plus]').forEach(b => b.addEventListener('click', () => {
        const [id, talle] = b.dataset.plus.split('::');
        const it = Cart.get().find(i => i.id === id && i.talle === talle);
        if (it) Cart.setQty(id, talle, it.qty + 1);
    }));
    wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
        const [id, talle] = b.dataset.remove.split('::');
        Cart.remove(id, talle);
    }));
    wrap.querySelectorAll('.talle-select').forEach(sel => sel.addEventListener('change', () => {
        const [id, talle] = sel.dataset.talleFor.split('::');
        Cart.setTalle(id, talle, sel.value);
    }));
}

function openDrawer() {
    drawerOpener = document.activeElement;
    renderDrawer();
    document.getElementById('drawerBackdrop').classList.add('open');
    const drawer = document.getElementById('cartDrawer');
    drawer.classList.add('open');
    drawer.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    document.getElementById('drawerClose').focus();
}

function closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    drawer.classList.remove('open');
    drawer.setAttribute('inert', '');
    document.getElementById('drawerBackdrop').classList.remove('open');
    document.body.classList.remove('no-scroll');
    drawerOpener?.focus?.();
}

function updateCartBadge() {
    const el = document.getElementById('cartCount');
    const n = Cart.count();
    el.hidden = n === 0;
    el.textContent = n;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
}

function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
    }, { passive: true });
}

function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    const header = document.querySelector('.site-header');
    if (!toggle || !nav) return;
    let bd = document.querySelector('.nav-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
    const close = () => {
        nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    };
    const open = () => {
        nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
        nav.querySelector('a')?.focus();
    };
    toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
    closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
    bd.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
    const mq = window.matchMedia('(min-width: 769px)');
    const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
    mq.addEventListener('change', sync);
    sync();
}

function initReveals() {
    const items = document.querySelectorAll('[data-animate]');
    if (!items.length) return;
    document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
        parent.querySelectorAll('[data-animate]').forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
        });
    });
    if (!('IntersectionObserver' in window) || reduceMotion) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    items.forEach(el => io.observe(el));

    let queued = false;
    const sweep = () => {
        queued = false;
        let pending = 0;
        items.forEach(el => {
            if (el.classList.contains('in')) return;
            const r = el.getBoundingClientRect();
            if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
            else pending++;
        });
        if (!pending) {
            window.removeEventListener('scroll', queueSweep);
            window.removeEventListener('resize', queueSweep);
        }
    };
    const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
    window.addEventListener('load', queueSweep);
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
}

function setFitStep(progress) {
    const step = progress < 0.22 ? 0 : progress < 0.5 ? 1 : progress < 0.78 ? 2 : 3;
    const c1 = document.getElementById('capa1');
    const c2 = document.getElementById('capa2');
    const c3 = document.getElementById('capa3');
    const price = document.getElementById('fitPrice');

    c1.classList.toggle('on', step === 0);
    c1.classList.toggle('back', step >= 1);
    c2.classList.toggle('on', step === 1);
    c2.classList.toggle('back', step >= 2);
    c3.classList.toggle('on', step >= 2);
    price.classList.toggle('on', step >= 3);

    document.querySelectorAll('.fit-step').forEach(el => {
        el.classList.toggle('is-on', Number(el.dataset.step) === step);
    });
}

function initFitChapter() {
    const stage = document.getElementById('fitStage');
    if (!stage) return;

    const staticFallback = () => {
        ['capa1', 'capa2', 'capa3'].forEach((id, i) => {
            const el = document.getElementById(id);
            el.classList.add(i < 2 ? 'back' : 'on');
        });
        document.getElementById('fitPrice').classList.add('on');
        document.querySelectorAll('.fit-step').forEach(el => el.classList.add('is-on'));
    };

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { staticFallback(); return; }

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => { staticFallback(); });

    mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
        const st = ScrollTrigger.create({
            trigger: stage,
            start: 'top top',
            end: '+=260%',
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: self => setFitStep(self.progress),
        });
        setFitStep(0);
        return () => st.kill();
    });

    mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
        stage.classList.add('is-sticky-mobile');
        const st = ScrollTrigger.create({
            trigger: stage,
            start: 'top top',
            end: 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: self => setFitStep(self.progress),
        });
        setFitStep(0);
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
    });
}

function initHeroIntro() {
    const showAll = () => {
        document.querySelectorAll('.hero-title .line-inner, .hero-sub, .hero-cta, .hero-note, .hero-block, .hero-barcode, .hero-polo, .hero-bomber, .hero-tag').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    };
    if (typeof gsap === 'undefined' || reduceMotion) { showAll(); return; }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero-title .line-inner', { y: 0, duration: 1.05, stagger: 0.14 }, 0.1)
      .to('.hero-block', { opacity: 1, scale: 1, rotate: 0, duration: 1.1 }, 0.2)
      .to('.hero-bomber', { opacity: 1, y: 0, rotate: 7, duration: 1.15 }, 0.42)
      .to('.hero-polo', { opacity: 1, y: 0, rotate: -8, duration: 1 }, 0.56)
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.85 }, 0.6)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.85 }, 0.74)
      .to('.hero-tag', { opacity: 1, y: 0, rotate: -3, duration: 0.7 }, 0.9)
      .to('.hero-barcode', { opacity: 0.85, duration: 0.7 }, 1)
      .to('.hero-note', { opacity: 1, duration: 0.7 }, 1.05);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

renderChips();
renderCatalogo();
initReveals();
initHeroIntro();
initFitChapter();
initWspFloat();
initNav();
updateCartBadge();

document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (document.getElementById('cartDrawer').classList.contains('open')) renderDrawer();
});

document.getElementById('cartBtn').addEventListener('click', openDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
document.getElementById('drawerEmptyBtn').addEventListener('click', () => {
    closeDrawer();
    document.getElementById('perchero').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});
document.getElementById('drawerClear').addEventListener('click', () => {
    Cart.clear();
    showToast('Pedido vaciado. El perchero sigue ahí.');
});
document.getElementById('waOrderBtn').addEventListener('click', e => {
    if (!Cart.get().length) { e.preventDefault(); showToast('Tu pedido está vacío. Colgá algo primero.'); }
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);
document.getElementById('qtyMinus').addEventListener('click', () => {
    modalQty = Math.max(1, modalQty - 1);
    document.getElementById('qtyVal').textContent = modalQty;
});
document.getElementById('qtyPlus').addEventListener('click', () => {
    modalQty = Math.min(99, modalQty + 1);
    document.getElementById('qtyVal').textContent = modalQty;
});
document.getElementById('modalAdd').addEventListener('click', () => {
    if (!modalProd) return;
    Cart.add(modalProd, modalTalle, modalQty);
    showToast(`Colgada: ${modalProd.nombre} (${modalTalle}) x${modalQty}.`);
});
document.getElementById('modalBuy').addEventListener('click', () => {
    if (!modalProd) return;
    Cart.add(modalProd, modalTalle, modalQty);
    closeModal();
    openDrawer();
});

document.getElementById('addFitBtn').addEventListener('click', () => {
    Cart.add(getProducto('polo-negra'), 'M', 1);
    Cart.add(getProducto('camisa-cuadros'), 'M', 1);
    Cart.add(getProducto('bomber-negra'), 'M', 1);
    showToast('El fit completo colgado en tu pedido (talle M).');
});

document.getElementById('searchInput').addEventListener('input', e => {
    filtro.q = e.target.value;
    renderCatalogo();
});
document.getElementById('clearFilters').addEventListener('click', () => {
    filtro.q = '';
    filtro.cat = 'all';
    document.getElementById('searchInput').value = '';
    renderChips();
    renderCatalogo();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (document.getElementById('prodModal').classList.contains('open')) closeModal();
        else if (document.getElementById('cartDrawer').classList.contains('open')) closeDrawer();
    }
    if (e.key === 'Tab') {
        const modal = document.getElementById('prodModal');
        const drawer = document.getElementById('cartDrawer');
        if (modal.classList.contains('open')) trapFocus(modal, e);
        else if (drawer.classList.contains('open')) trapFocus(drawer, e);
    }
});
