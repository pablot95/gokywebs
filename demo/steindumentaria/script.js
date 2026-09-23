const phone = '3751462790';
const products = [
  {id:'jeans',name:'Jeans brasileros',tag:'DENIM IMPORTADO',description:'Consultá por modelos, talles y opciones mayoristas disponibles.',image:'images/jeans-brasileros.webp'},
  {id:'ropa',name:'Indumentaria importada',tag:'ROPA POR MAYOR',description:'Prendas para sumar variedad a tu propuesta comercial.',image:'images/ropa-importada.webp'},
  {id:'yerba',name:'Yerba por mayor',tag:'ALMACÉN IMPORTADO',description:'Consultá presentaciones y condiciones para tu negocio.',image:'images/yerba-mayorista.webp'},
  {id:'importados',name:'Mercadería de Brasil',tag:'OTROS IMPORTADOS',description:'Preguntanos por las líneas de importados disponibles.',image:'images/mercaderia-importada.webp'}
];
const grid = document.querySelector('#product-grid');
if(grid){products.forEach(product=>{const card=document.createElement('article');card.className='product-card';card.dataset.category=product.id;card.innerHTML=`<img src="${product.image}" alt="Imagen ilustrativa de ${product.name}" loading="lazy"><div class="product-body"><span>${product.tag}</span><h3>${product.name}</h3><p>${product.description}</p><button type="button" data-add="${product.id}" aria-label="Sumar ${product.name} al pedido">Sumar al pedido +</button></div>`;grid.append(card)})}

const filters=[...document.querySelectorAll('.filter')];
function setFilter(category){filters.forEach(button=>button.classList.toggle('active',button.dataset.filter===category));document.querySelectorAll('.product-card').forEach(card=>{card.hidden=category!=='todos'&&card.dataset.category!==category})}
filters.forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.filter)));
document.querySelectorAll('[data-category]').forEach(link=>{if(link.matches('.product-card'))return;link.addEventListener('click',()=>setFilter(link.dataset.category))});

const storeKey='ste-indumentaria-demo-order';
let order={};
try{order=JSON.parse(localStorage.getItem(storeKey)||'{}')||{}}catch{order={}}
const panel=document.querySelector('.cart-panel');
const backdrop=document.querySelector('.cart-backdrop');
const items=document.querySelector('.cart-items');
const empty=document.querySelector('.cart-empty');
const send=document.querySelector('.send-order');
function save(){try{localStorage.setItem(storeKey,JSON.stringify(order))}catch{}}
function renderOrder(){
  const entries=products.filter(product=>order[product.id]>0);
  document.querySelectorAll('.cart-count').forEach(node=>node.textContent=String(entries.reduce((sum,product)=>sum+order[product.id],0)));
  items.replaceChildren();
  entries.forEach(product=>{const row=document.createElement('div');row.className='cart-line';row.innerHTML=`<img src="${product.image}" alt=""><div class="cart-line-details"><strong>${product.name}</strong><small>Cantidad estimada a consultar</small><div class="quantity"><button type="button" data-change="${product.id}" data-delta="-1" aria-label="Restar una unidad de ${product.name}">−</button><span>${order[product.id]}</span><button type="button" data-change="${product.id}" data-delta="1" aria-label="Sumar una unidad de ${product.name}">+</button></div></div><button class="remove-line" type="button" data-remove="${product.id}" aria-label="Quitar ${product.name}">Quitar</button>`;items.append(row)});
  empty.hidden=entries.length>0;
  send.classList.toggle('disabled',entries.length===0);
  send.setAttribute('aria-disabled',String(entries.length===0));
  const message=entries.length?`Hola, quiero consultar por una compra mayorista de STE Indumentaria.\n\n${entries.map(product=>`• ${product.name}: ${order[product.id]} unidad(es) estimada(s)`).join('\n')}\n\n¿Me confirman opciones, mínimos, precios y disponibilidad?`:'Hola, quiero consultar por productos mayoristas de STE Indumentaria.';
  send.href=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  save();
}
function openCart(){panel.classList.add('open');panel.setAttribute('aria-hidden','false');backdrop.hidden=false;document.body.style.overflow='hidden';panel.querySelector('.cart-close').focus()}
function closeCart(){panel.classList.remove('open');panel.setAttribute('aria-hidden','true');backdrop.hidden=true;document.body.style.overflow=''}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(add){order[add.dataset.add]=(order[add.dataset.add]||0)+1;renderOrder();openCart()}
  const change=event.target.closest('[data-change]');if(change){const id=change.dataset.change;order[id]=Math.max(0,(order[id]||0)+Number(change.dataset.delta));if(!order[id])delete order[id];renderOrder()}
  const remove=event.target.closest('[data-remove]');if(remove){delete order[remove.dataset.remove];renderOrder()}
});
document.querySelectorAll('.cart-trigger,.cart-float').forEach(button=>button.addEventListener('click',openCart));
document.querySelector('.cart-close').addEventListener('click',closeCart);backdrop.addEventListener('click',closeCart);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel.classList.contains('open'))closeCart()});
send.addEventListener('click',event=>{if(send.classList.contains('disabled'))event.preventDefault()});
renderOrder();

const menuButton=document.querySelector('.menu-toggle'),menu=document.querySelector('.main-nav');
menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));

const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.slide-dot')];let current=0;
function showSlide(index){slides.forEach((slide,i)=>slide.classList.toggle('active',i===index));dots.forEach((dot,i)=>{dot.classList.toggle('active',i===index);dot.setAttribute('aria-current',String(i===index))});current=index}
dots.forEach(dot=>dot.addEventListener('click',()=>showSlide(Number(dot.dataset.go))));
if(slides.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>showSlide((current+1)%slides.length),6500);
