const phone = '5491164239532';
const products = [
  {name:'Hierros',category:'estructura',description:'Varillas y armaduras para bases, columnas y losas.',image:'images/hierros.webp',position:'left center'},
  {name:'Vigas',category:'estructura',description:'Soluciones estructurales para cada tipo de obra.',image:'images/hierros.webp',position:'center center'},
  {name:'Rejas',category:'estructura',description:'Opciones de hierro para protección y cerramientos.',image:'images/hierros.webp',position:'right center'},
  {name:'Áridos',category:'mamposteria',description:'Arena y otros áridos para mezclas y hormigón.',image:'images/materiales.webp',position:'right bottom'},
  {name:'Ladrillos huecos',category:'mamposteria',description:'Bloques cerámicos para levantar muros y tabiques.',image:'images/materiales.webp',position:'left center'},
  {name:'Refractarios',category:'mamposteria',description:'Materiales para parrillas y zonas de alta temperatura.',image:'images/materiales.webp',position:'center center'},
  {name:'Pegamentos',category:'terminacion',description:'Adhesivos y mezclas para colocación y terminación.',image:'images/adhesivos.webp',position:'left center'},
  {name:'Hidrófugos',category:'terminacion',description:'Productos para proteger superficies de la humedad.',image:'images/adhesivos.webp',position:'right center'}
];

const grid = document.querySelector('#product-grid');
if (grid) {
  products.forEach((product,index) => {
    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.dataset.category = product.category;
    card.style.transitionDelay = `${(index % 4) * 70}ms`;
    const query = encodeURIComponent(`Hola, quiero consultar por ${product.name.toLowerCase()} para mi obra. ¿Me pasan opciones y presupuesto?`);
    card.innerHTML = `<div class="product-image"><img src="${product.image}" alt="Materiales de la categoría ${product.name}" loading="lazy" style="object-position:${product.position}"><span>${String(index+1).padStart(2,'0')} / MATERIALES</span></div><div class="product-body"><h3>${product.name}</h3><p>${product.description}</p><a href="https://wa.me/${phone}?text=${query}" target="_blank" rel="noopener" aria-label="Consultar por ${product.name} en WhatsApp">Consultar por WhatsApp <span aria-hidden="true">↗</span></a></div>`;
    grid.append(card);
  });
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  document.querySelectorAll('.product-card').forEach(card => { card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter; });
}));

const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mainNav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menú'); }));
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.08,rootMargin:'0px 0px 40px 0px'});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}
