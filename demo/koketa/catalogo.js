/* ============ Catálogo: filtros + búsqueda + Flip + paginación ============ */
(function(){
  const grid=document.getElementById('grid');
  const chipsBox=document.getElementById('chips');
  const search=document.getElementById('search');
  const verMas=document.getElementById('ver-mas');
  const empty=document.getElementById('empty');
  const count=document.getElementById('cat-count');
  if(!grid) return;

  const PER=12;
  let cat='all', q='', shown=PER;

  const params=new URLSearchParams(location.search);
  if(params.get('cat') && getCategoria(params.get('cat'))) cat=params.get('cat');

  chipsBox.innerHTML=[{id:'all',nombre:'Todo'},...CATEGORIAS]
    .map(c=>`<button class="chip${c.id===cat?' active':''}" data-cat="${c.id}">${c.nombre}</button>`).join('');

  function filtrados(){
    const term=q.trim().toLowerCase();
    return PRODUCTOS.filter(p=>{
      if(cat!=='all' && p.cat!==cat) return false;
      if(!term) return true;
      const catN=getCategoria(p.cat)?.nombre.toLowerCase()||'';
      return p.nombre.toLowerCase().includes(term)||catN.includes(term)||p.desc.toLowerCase().includes(term);
    });
  }

  function render(useFlip){
    const list=filtrados();
    const state=(typeof Flip!=='undefined'&&useFlip&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      ? Flip.getState(grid.querySelectorAll('.card')) : null;

    const vis=list.slice(0,shown);
    grid.innerHTML=vis.map(cardHTML).join('');
    empty.hidden=list.length>0;
    grid.hidden=list.length===0;
    count.textContent=list.length?`${list.length} producto${list.length>1?'s':''}`:'';
    verMas.hidden=list.length<=shown;

    if(state) Flip.from(state,{duration:.5,ease:'power2.out',stagger:.03,
      absolute:true,onEnter:els=>gsap.fromTo(els,{opacity:0,scale:.85},{opacity:1,scale:1,duration:.4}),
      onLeave:els=>gsap.to(els,{opacity:0,scale:.85,duration:.3})});

    if(typeof ScrollTrigger!=='undefined') ScrollTrigger.refresh();
    syncTitle();
  }

  function syncTitle(){
    const t=document.getElementById('cat-title'), s=document.getElementById('cat-sub');
    const c=getCategoria(cat);
    if(c){ t.textContent=c.nombre; s.textContent=c.desc; }
    else { t.textContent='Todo el catálogo'; s.textContent='Elegí, agregá a tu pedido y lo mandás por WhatsApp. Así de simple.'; }
  }

  chipsBox.addEventListener('click',e=>{
    const b=e.target.closest('[data-cat]'); if(!b) return;
    cat=b.dataset.cat; shown=PER;
    chipsBox.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.cat===cat));
    const u=new URL(location); cat==='all'?u.searchParams.delete('cat'):u.searchParams.set('cat',cat);
    history.replaceState(null,'',u);
    render(true);
  });

  let deb;
  search.addEventListener('input',e=>{
    clearTimeout(deb);
    deb=setTimeout(()=>{ q=e.target.value; shown=PER; render(true); },180);
  });

  verMas.addEventListener('click',()=>{ shown+=PER; render(false); });
  document.getElementById('empty-reset').addEventListener('click',()=>{
    cat='all'; q=''; search.value=''; shown=PER;
    chipsBox.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.cat==='all'));
    history.replaceState(null,'',location.pathname);
    render(true);
  });

  render(false);
})();
