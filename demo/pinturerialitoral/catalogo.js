(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const Shop = window.PinturaShop;
    if (!Shop) return;
    const { PRODUCTOS, productCardHTML, initQtyControls, esc } = Shop;

    const grid = document.getElementById('product-grid');
    const buscador = document.getElementById('buscador');
    const chips = document.getElementById('chips');
    const verMasBtn = document.getElementById('ver-mas');
    const filterToggle = document.getElementById('filter-toggle');

    const PAGE_SIZE = 12;
    let visible = PAGE_SIZE;
    let catActual = 'all';
    let query = '';

    let fuse = null;
    if (typeof Fuse !== 'undefined') {
      fuse = new Fuse(PRODUCTOS, { keys: ['nombre', 'categoria'], threshold: 0.35 });
    }

    const params = new URLSearchParams(location.search);
    const catParam = params.get('cat');
    if (catParam && chips.querySelector(`[data-cat="${CSS.escape(catParam)}"]`)) {
      catActual = catParam;
    }

    function filtrar() {
      let base = PRODUCTOS;
      if (query.trim()) {
        base = fuse ? fuse.search(query.trim()).map(r => r.item) : PRODUCTOS.filter(p => p.nombre.toLowerCase().includes(query.trim().toLowerCase()));
      }
      if (catActual !== 'all') base = base.filter(p => p.categoria === catActual);
      return base;
    }

    function render() {
      const items = filtrar();
      const slice = items.slice(0, visible);
      if (!slice.length) {
        grid.innerHTML = `
          <div class="grid-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <p>No encontramos productos con esa búsqueda.<br>Probá con otra palabra o mirá otra categoría.</p>
            <button type="button" class="btn btn-ghost btn-sm" id="reset-busqueda">Ver todo el catálogo</button>
          </div>`;
        const resetBtn = document.getElementById('reset-busqueda');
        if (resetBtn) resetBtn.addEventListener('click', () => {
          buscador.value = ''; query = ''; catActual = 'all'; visible = PAGE_SIZE;
          chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === 'all'));
          render();
        });
      } else {
        grid.innerHTML = slice.map(p => productCardHTML(p)).join('');
        initQtyControls(grid);
      }
      verMasBtn.style.display = items.length > visible ? 'inline-flex' : 'none';
      Shop.reRevealStagger(grid);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }

    buscador.addEventListener('input', () => { query = buscador.value; visible = PAGE_SIZE; render(); });

    chips.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      catActual = chip.dataset.cat;
      visible = PAGE_SIZE;
      render();
      if (window.innerWidth <= 860) { chips.classList.remove('open'); filterToggle.setAttribute('aria-expanded', 'false'); }
    });

    filterToggle.addEventListener('click', () => {
      const open = chips.classList.toggle('open');
      filterToggle.setAttribute('aria-expanded', String(open));
    });

    verMasBtn.addEventListener('click', () => { visible += PAGE_SIZE; render(); });

    render();
  });
})();
