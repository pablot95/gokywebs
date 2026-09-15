/* ============ Detalle de producto ============ */
(function(){
  const main=document.getElementById('contenido');
  const id=+new URLSearchParams(location.search).get('id');
  const p=getProducto(id);

  if(!p){
    main.innerHTML=`<div class="prod-notfound">
      <p class="kicker kicker--dark">Ups</p>
      <h1>No encontramos ese producto</h1>
      <p>Puede que ya no esté disponible o que el link esté cortado. Mirá todo lo que tenemos.</p>
      <a class="btn btn-cta" href="../catalogo.html">Ver el catálogo</a>
    </div>`;
    document.getElementById('sticky-buy')?.remove();
    return;
  }

  const fin=precioFinal(p), off=p.descuento>0;
  const catN=getCategoria(p.cat)?.nombre||'';
  document.title=`${p.nombre} — KOKETA`;

  main.innerHTML=`
    <nav class="crumbs" aria-label="Migas de pan">
      <a href="../index.html">Inicio</a> ›
      <a href="../catalogo.html?cat=${p.cat}">${esc(catN)}</a> ›
      <span>${esc(p.nombre)}</span>
    </nav>
    <div class="prod-grid">
      <div class="prod-media" data-animate style="transform:translateY(24px);opacity:0">
        <div class="card-badges">
          ${p.destacado?'<span class="badge">Elegida</span>':''}
          ${off?`<span class="badge badge--off">-${p.descuento}%</span>`:''}
        </div>
        <img src="../images/${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" fetchpriority="high" decoding="async">
      </div>
      <div class="prod-info">
        <span class="prod-cat">${esc(catN)}</span>
        <h1>${esc(p.nombre)}</h1>
        <div class="prod-price">
          <strong>${formatearPrecio(fin)}</strong>
          ${off?`<s>${formatearPrecio(p.precio)}</s>`:''}
        </div>
        <p class="prod-desc">${esc(p.desc)}</p>
        <div class="prod-buy">
          <div class="qty" role="group" aria-label="Cantidad">
            <button id="q-dec" aria-label="Restar">−</button>
            <span id="q-val">1</span>
            <button id="q-inc" aria-label="Sumar">+</button>
          </div>
          <button class="btn btn-dark" id="p-add">Agregar a mi pedido</button>
          <button class="btn btn-lima" id="p-pedir">Pedir por WhatsApp</button>
        </div>
        <ul class="prod-perks">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg> Te separamos la prenda hasta que confirmás</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg> Retirás en el showroom o coordinamos envío</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg> Cambios dentro de los 5 días con etiqueta puesta</li>
        </ul>
      </div>
    </div>
    <section class="relacionados" aria-labelledby="rel-t">
      <h2 id="rel-t">También te puede interesar</h2>
      <div class="grid-prod" id="rel-grid"></div>
    </section>`;

  let rel=PRODUCTOS.filter(x=>x.cat===p.cat && x.id!==p.id);
  if(rel.length<4) rel=rel.concat(PRODUCTOS.filter(x=>x.destacado && x.id!==p.id && !rel.includes(x)));
  document.getElementById('rel-grid').innerHTML=rel.slice(0,4).map(cardHTML).join('');

  let qty=1;
  const qv=document.getElementById('q-val');
  document.getElementById('q-inc').addEventListener('click',()=>{qty=Math.min(qty+1,20);qv.textContent=qty;});
  document.getElementById('q-dec').addEventListener('click',()=>{qty=Math.max(qty-1,1);qv.textContent=qty;});
  document.getElementById('p-add').addEventListener('click',()=>{Pedido.add(p,qty);showToast('Agregado a tu pedido');});
  document.getElementById('p-pedir').addEventListener('click',()=>{
    Pedido.add(p,qty);
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(mensajeWA([{id:p.id,qty}]))}`,'_blank','noopener');
  });

  const sticky=document.getElementById('sticky-buy');
  if(sticky){
    sticky.hidden=false;
    document.getElementById('sb-price').textContent=formatearPrecio(fin);
    document.getElementById('sb-add').addEventListener('click',()=>{Pedido.add(p,qty);showToast('Agregado a tu pedido');});
    const anchor=document.getElementById('p-add');
    const io=new IntersectionObserver(([e])=>{
      sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top<0);
    },{threshold:0});
    io.observe(anchor);
  }

  const ld=document.createElement('script');
  ld.type='application/ld+json';
  ld.textContent=JSON.stringify({
    "@context":"https://schema.org","@type":"Product",
    "name":p.nombre,"image":[location.origin+location.pathname.replace(/producto\/$/,'')+'../images/'+p.img],
    "description":p.desc,"category":catN,"brand":{"@type":"Brand","name":"KOKETA"},
    "offers":{"@type":"Offer","priceCurrency":"ARS","price":fin,"availability":"https://schema.org/InStock"}
  });
  document.head.appendChild(ld);
})();
