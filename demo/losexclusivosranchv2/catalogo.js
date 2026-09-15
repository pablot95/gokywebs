(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const store = window.LERstore;
    if (!store) return;
    const { esc, productCard, wireProductGrid } = store;
    const PRODUCTOS = window.PRODUCTOS || [];
    const CATEGORIAS = window.CATEGORIAS || [];

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const grid = $('#catalog-grid');
    const emptyState = $('#cat-empty');
    const resultsCount = $('#results-count');
    const loadMoreWrap = $('#load-more-wrap');
    const loadMoreBtn = $('#load-more');
    const searchInput = $('#search-input');
    const filterCat = $('#filter-cat');
    const filterSort = $('#filter-sort');
    const filterOferta = $('#filter-oferta');
    const chipsWrap = $('#cat-chips');
    const clearBtn = $('#filter-clear');
    const emptyClearBtn = $('#cat-empty-clear');

    const PAGE_SIZE = 12;
    let visibleCount = PAGE_SIZE;

    const normalize = s => String(s ?? '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');

    // ── poblar selects/chips ──
    filterCat.innerHTML = '<option value="">Todas las categorías</option>' +
      CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('');

    chipsWrap.innerHTML = [
      `<button class="cat-chip active" type="button" data-chip="">Todas</button>`,
      ...CATEGORIAS.map(c => `<button class="cat-chip" type="button" data-chip="${c.id}">${c.emoji} ${esc(c.nombre)}</button>`),
    ].join('');

    // ── leer ?cat= inicial ──
    const params = new URLSearchParams(location.search);
    const initialCat = params.get('cat') || '';
    if (initialCat && CATEGORIAS.some(c => c.id === initialCat)) {
      filterCat.value = initialCat;
    }

    function syncChips() {
      $$('.cat-chip', chipsWrap).forEach(chip => {
        chip.classList.toggle('active', chip.dataset.chip === filterCat.value);
      });
    }
    syncChips();

    chipsWrap.addEventListener('click', e => {
      const chip = e.target.closest('.cat-chip'); if (!chip) return;
      filterCat.value = chip.dataset.chip;
      syncChips();
      visibleCount = PAGE_SIZE;
      render();
    });

    function matches(p, q) {
      if (!q) return true;
      const hay = normalize([p.nombre, p.marca, p.categoria, store.catName(p.categoria), p.unidad, ...(p.tags || [])].join(' '));
      return hay.includes(q);
    }

    function getFiltered() {
      const q = normalize(searchInput.value.trim());
      const cat = filterCat.value;
      const onlyOferta = filterOferta.checked;

      let list = PRODUCTOS.filter(p => matches(p, q));
      if (cat) list = list.filter(p => p.categoria === cat);
      if (onlyOferta) list = list.filter(p => p.descuento > 0);

      const sort = filterSort.value;
      if (sort === 'precio-asc') list = [...list].sort((a, b) => store.precioFinal(a) - store.precioFinal(b));
      else if (sort === 'precio-desc') list = [...list].sort((a, b) => store.precioFinal(b) - store.precioFinal(a));
      else if (sort === 'nombre') list = [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      else list = [...list].sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));

      return list;
    }

    function render() {
      const filtered = getFiltered();
      const total = filtered.length;
      const slice = filtered.slice(0, visibleCount);

      if (!total) {
        grid.innerHTML = '';
        grid.hidden = true;
        emptyState.hidden = false;
        loadMoreWrap.hidden = true;
        resultsCount.textContent = 'Sin resultados';
        return;
      }

      grid.hidden = false;
      emptyState.hidden = true;
      grid.innerHTML = slice.map(productCard).join('');
      wireProductGrid(grid);

      resultsCount.innerHTML = total === PRODUCTOS.length
        ? `Mostrando <b>${total}</b> producto${total === 1 ? '' : 's'}`
        : `<b>${total}</b> resultado${total === 1 ? '' : 's'} encontrado${total === 1 ? '' : 's'}`;

      loadMoreWrap.hidden = visibleCount >= total;

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const cards = $$('.card', grid);
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.from(cards, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', stagger: 0.06, overwrite: true });
        ScrollTrigger.refresh();
      } else {
        $$('[data-animate]', grid).forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      }
    }

    function resetAndRender() { visibleCount = PAGE_SIZE; render(); }

    searchInput.addEventListener('input', resetAndRender);
    filterCat.addEventListener('change', () => { syncChips(); resetAndRender(); });
    filterSort.addEventListener('change', resetAndRender);
    filterOferta.addEventListener('change', resetAndRender);
    loadMoreBtn.addEventListener('click', () => { visibleCount += PAGE_SIZE; render(); });

    function clearFilters() {
      searchInput.value = '';
      filterCat.value = '';
      filterSort.value = 'relevancia';
      filterOferta.checked = false;
      syncChips();
      resetAndRender();
    }
    clearBtn.addEventListener('click', clearFilters);
    emptyClearBtn.addEventListener('click', clearFilters);

    // ── buscador toggle mobile (icono lupa del header hace foco en el input) ──
    $('#search-toggle')?.addEventListener('click', () => {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    });

    render();
  });
})();
