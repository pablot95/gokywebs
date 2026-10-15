"""Genera los dos modelos y sus catálogos con un mismo contenido."""
from pathlib import Path
import json

ROOT = Path(__file__).parent
BASE = 'https://gokywebs.com/demo/tintamorena/'
PHONE = '5493574402371'
IG = 'https://www.instagram.com/tintamorenario1/'
HERO = 'images/02_horizontal_16x9.webp'
VERTICAL = 'images/01_vertical_9x16.webp'
CATEGORIES = [
    ('tratamientos', 'Tratamientos', 'Nutrición y cuidado', '03_tratamientos_1x1.webp'),
    ('styling', 'Styling', 'Definición y peinado', '04_styling_1x1.webp'),
    ('coloracion', 'Coloración', 'Productos para profesionales', '05_coloracion_1x1.webp'),
    ('oleos', 'Óleos y mascarillas', 'Brillo y reparación', '06_oleos_1x1.webp'),
]
CART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h2l2.1 11.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H6"/><circle cx="10" cy="20" r="1.3" fill="currentColor"/><circle cx="19" cy="20" r="1.3" fill="currentColor"/></svg>'
WA_ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 1A15 15 0 0 0 3.1 23.6L1 31l7.6-2A15 15 0 1 0 16 1Zm0 27.2c-2.3 0-4.5-.6-6.5-1.8l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.2 12.2 0 1 1 16 28.2Zm6.7-9.2c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.4-.2-.2.2-.4.3-.8.1-.4-.2-1.5-.6-2.9-1.8-1.1-1-1.8-2.1-2-2.5-.2-.4 0-.6.2-.8l.6-.6c.2-.2.2-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.8-2-1.2-2.8-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.6 1.5 3.8c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.2.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.3-.7-.5Z"/></svg>'

def head(filename, catalog=False, admin=False):
    title = ('Panel de muestra' if admin else 'Catálogo capilar' if catalog else 'Belleza para cada cabello') + ' | Tinta Morena'
    desc = 'Productos capilares para tu rutina y para profesionales de peluquería. Conocé la tienda online de Tinta Morena.'
    canonical = BASE + ('' if filename == 'index.html' else filename)
    schema = json.dumps({'@context':'https://schema.org','@type':'Store','name':'Tinta Morena','description':'Distribuidora de productos de peluquería para clientes minoristas y profesionales.','telephone':'+54 9 357 440-2371','url':BASE,'sameAs':[IG]},ensure_ascii=False,separators=(',',':'))
    robots = '<meta name="robots" content="noindex,nofollow">' if admin else ''
    return f'''<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#FAF8F5"><title>{title}</title><meta name="description" content="{desc}">{robots}<link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{BASE}{HERO}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=1"><script type="application/ld+json">{schema}</script></head>'''

def modelbar(model, catalog):
    first = 'catalogo.html' if catalog else './'
    second = 'catalogo-2.html' if catalog else 'modelo-2.html'
    current1 = ' aria-current="page"' if model == 1 else ''
    current2 = ' aria-current="page"' if model == 2 else ''
    return f'<nav class="gw-modelos" aria-label="Modelos de la web"><a class="gw-modelos__btn" href="{first}"{current1}>Modelo 1</a><a class="gw-modelos__btn" href="{second}"{current2}>Modelo 2</a></nav>'

def brand(home):
    return f'<a class="brand" href="{home}" aria-label="Tinta Morena, inicio"><span>Tinta Morena<small>BELLEZA PROFESIONAL</small></span></a>'

def header(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    menu = ''.join(f'<a href="{catalog}?cat={slug}">{label}</a>' for slug,label,*_ in CATEGORIES)
    return f'''<div class="topline"><div class="wrap"><span>Productos capilares para vos y para profesionales</span><a href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer">Consultas y pedidos ↗</a></div></div><header class="site-header"><div class="wrap header-inner">{brand(home)}<nav class="main-nav" id="main-nav" aria-label="Navegación principal"><a href="{home}">Inicio</a><a href="{catalog}">Productos</a><div class="nav-categories"><button type="button" class="nav-category-toggle" aria-expanded="false" aria-controls="category-menu">Categorías <span aria-hidden="true">⌄</span></button><div class="category-menu" id="category-menu">{menu}<a class="menu-all" href="{catalog}">Ver todo el catálogo ↗</a></div></div><a href="{home}#profesionales">Profesionales</a></nav><div class="header-actions"><form class="header-search" action="{catalog}" method="get" role="search"><label class="sr-only" for="header-q">Buscar productos</label><input id="header-q" name="q" placeholder="Buscar productos..."><button type="submit" aria-label="Buscar">⌕</button></form><button class="cart-button" type="button" data-open-cart aria-label="Abrir carrito">{CART_ICON}<span data-cart-count>0</span></button><button class="menu-button" type="button" data-menu aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span></button></div></div></header>'''

def hero(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    klass = 'hero-one' if model == 1 else 'hero-two'
    return f'''<section class="hero {klass}" aria-labelledby="hero-title"><div class="hero-grid"><div class="hero-primary"><img src="{HERO}" width="1600" height="900" fetchpriority="high" alt="Productos de cuidado capilar sobre una mesa de salón"><div class="hero-copy"><span class="eyebrow">CUIDADO CAPILAR · TINTA MORENA</span><h1 id="hero-title">Belleza para <em>cada cabello.</em></h1><p>Productos para tu rutina y para tu salón. Explorá tratamientos, styling, coloración y cuidado capilar.</p><div class="hero-actions"><a class="button button-primary" href="{catalog}">Ver productos <span aria-hidden="true">↗</span></a><a class="under-link" href="#categorias">Explorar categorías →</a></div></div></div><div class="hero-secondary"><img src="{VERTICAL}" width="788" height="1400" alt="Productos capilares en un salón"><div class="side-copy"><span class="eyebrow">PARA TU RUTINA Y TU SALÓN</span><h2>Tu pelo, <em>tu esencia.</em></h2><a class="under-link" href="{catalog}?cat=tratamientos">Descubrir tratamientos ↗</a></div></div></div></section>'''

def categories(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    cards = ''.join(f'<a class="category-card" data-animate href="{catalog}?cat={slug}"><img src="images/{photo}" width="1254" height="1254" loading="lazy" alt="{label}, imagen ilustrativa"><span><b>{label}</b><small>{sub}</small><i aria-hidden="true">↗</i></span></a>' for slug,label,sub,photo in CATEGORIES)
    return f'''<section class="section category-section" id="categorias" aria-labelledby="categories-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">NUESTRAS CATEGORÍAS</span><h2 id="categories-title">Todo para el cuidado <em>y estilo de tu cabello.</em></h2></div><a class="under-link" href="{catalog}">Ver todas ↗</a></div><div class="category-grid">{cards}</div></div></section>'''

def featured(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section featured-section" aria-labelledby="featured-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">SELECCIÓN DE LA TIENDA</span><h2 id="featured-title">Tu próxima rutina <em>empieza acá.</em></h2></div><div class="featured-links"><div class="rail-controls"><button type="button" data-rail-prev aria-label="Productos anteriores">←</button><button type="button" data-rail-next aria-label="Productos siguientes">→</button></div><a class="under-link" href="{catalog}">Ver todo el catálogo ↗</a></div></div><div class="product-grid featured-grid" data-featured aria-live="polite"><p>Cargando productos...</p></div><p class="demo-note">Productos y precios ilustrativos para esta demo. Consultá marca, disponibilidad y precio final antes de confirmar.</p></div></section>'''

def story(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="story-section" id="profesionales" aria-labelledby="story-title"><div class="story-photo" data-animate><img src="{VERTICAL}" width="788" height="1400" loading="lazy" alt="Productos de peluquería en un salón"></div><div class="story-copy" data-animate><span class="eyebrow">TINTA MORENA</span><h2 id="story-title">Para vos. <em>Para tu salón.</em></h2><p>Tinta Morena reúne productos capilares para quienes cuidan su cabello todos los días y para quienes trabajan en peluquería. Elegí en la tienda o consultanos por una selección para tu trabajo.</p><a class="under-link" href="{catalog}">Explorar productos ↗</a></div></section>'''

def preview(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section preview-section" aria-labelledby="preview-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">SEGUÍ EXPLORANDO</span><h2 id="preview-title">Encontrá lo que <em>necesitás.</em></h2></div><a class="under-link" href="{catalog}">Ver toda la tienda ↗</a></div><div class="product-grid preview-grid" data-preview aria-live="polite"><p>Cargando productos...</p></div><div class="preview-end"><a class="button button-primary" href="{catalog}">Ir al catálogo completo ↗</a></div></div></section>'''

def closing():
    message = 'Hola, quiero consultar productos de peluquería para profesionales.'
    from urllib.parse import quote
    href = f'https://wa.me/{PHONE}?text={quote(message)}'
    return f'''<section class="professional-cta"><div class="wrap professional-inner"><span class="eyebrow">ATENCIÓN A PROFESIONALES</span><h2>¿Trabajás en peluquería?</h2><p>Contanos qué productos buscás y te ayudamos a encontrar opciones para tu salón.</p><a class="button button-primary" href="{href}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp ↗</a></div></section>'''

def footer(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<footer class="site-footer"><div class="wrap footer-grid"><div>{brand(home)}<p>Productos capilares para tu rutina y para profesionales.</p></div><div><h2>Explorá</h2><a href="{catalog}">Todos los productos</a><a href="{catalog}?cat=tratamientos">Tratamientos</a><a href="{catalog}?cat=styling">Styling</a><a href="{catalog}?cat=coloracion">Coloración</a></div><div><h2>Conversemos</h2><a href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer">+54 9 357 440-2371 ↗</a><a href="{IG}" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="admin-demo.html">Panel de muestra</a></div></div><div class="wrap footer-bottom"><span>© 2026 Tinta Morena</span><span>Diseño web por <a href="https://gokywebs.com/" target="_blank" rel="noopener noreferrer">Gokywebs</a></span></div></footer>'''

def drawers():
    return f'''<div class="overlay" data-overlay hidden></div><aside class="cart-drawer" data-cart role="dialog" aria-modal="true" aria-label="Tu pedido" aria-hidden="true" tabindex="-1"><div class="drawer-head"><div><span class="eyebrow">TINTA MORENA</span><h2>Tu selección</h2></div><button type="button" data-close-cart aria-label="Cerrar carrito">×</button></div><div class="cart-items" data-cart-items></div><div class="drawer-foot"><div class="cart-total"><span>Total de muestra</span><strong data-cart-total>$0</strong></div><p>Productos y precios ilustrativos. Confirmá disponibilidad y precio final por WhatsApp.</p><a class="button button-primary" data-checkout href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer">Enviar pedido por WhatsApp ↗</a></div></aside><dialog class="product-dialog" data-dialog aria-label="Detalle del producto"><button type="button" class="dialog-close" data-close-dialog aria-label="Cerrar detalle">×</button><div data-dialog-body></div></dialog><div class="toast" data-toast role="status" aria-live="polite"></div><div class="float-stack"><button class="float-cart" type="button" data-open-cart aria-label="Abrir carrito">{CART_ICON}<span data-cart-count>0</span></button><a class="float-wa" href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer" aria-label="Escribir a Tinta Morena por WhatsApp">{WA_ICON}</a></div>'''

def scripts():
    return '<script src="script.js?v=1" defer></script><script src="/demo/track.js" defer></script></body></html>'

def home(model):
    name = 'index.html' if model == 1 else 'modelo-2.html'
    sections = [categories(model), featured(model)] if model == 1 else [featured(model), categories(model)]
    body = head(name) + f'<body data-page="home" data-model="{model}" class="model-{model}">' + modelbar(model, False) + header(model)
    body += '<main>' + hero(model) + ''.join(sections) + story(model) + preview(model) + closing() + '</main>' + footer(model) + drawers() + scripts()
    (ROOT / name).write_text(body, encoding='utf-8')

def catalog(model):
    name = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    home_url = './' if model == 1 else 'modelo-2.html'
    filters = '<button type="button" data-cat="" class="is-active">Todo</button>' + ''.join(f'<button type="button" data-cat="{slug}">{label}</button>' for slug,label,*_ in CATEGORIES)
    main = f'''<main><section class="catalog-hero"><div class="catalog-wrap"><nav class="breadcrumb" aria-label="Miga de pan"><a href="{home_url}">Inicio</a><span>/</span><span>Productos</span></nav><span class="eyebrow">CATÁLOGO TINTA MORENA</span><h1>El cuidado empieza <em>con una elección.</em></h1><p>Explorá productos capilares para tu rutina o para el salón.</p></div></section><section class="catalog-section"><div class="catalog-wrap"><div class="catalog-tools"><form data-catalog-search role="search"><label for="catalog-q">Buscar productos</label><div class="search-field"><input id="catalog-q" name="q" type="search" placeholder="¿Qué producto buscás?" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><label class="sort-control" for="catalog-sort">Ordenar por <select id="catalog-sort" data-sort><option value="destacados">Destacados</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label></div><div class="category-filters" aria-label="Filtrar por categoría">{filters}</div><div class="catalog-status"><p data-count aria-live="polite">Cargando productos...</p><button type="button" data-clear hidden>Limpiar filtros ×</button></div><div class="product-grid catalog-grid" data-products aria-live="polite"></div><div class="more-wrap"><button class="button button-outline" type="button" data-more hidden>Ver más productos ↓</button></div><p class="demo-note">Productos y precios ilustrativos para esta demo. Consultá marca, disponibilidad y precio final antes de confirmar.</p></div></section></main>'''
    body = head(name, catalog=True) + f'<body data-page="catalog" data-model="{model}" class="model-{model}">' + modelbar(model, True) + header(model) + main + footer(model) + drawers() + scripts()
    (ROOT / name).write_text(body, encoding='utf-8')

for model in (1, 2):
    home(model)
    catalog(model)

admin = head('admin-demo.html', admin=True) + '''<body data-page="admin"><main class="admin-shell"><a href="./">← Volver a la tienda</a><span class="eyebrow">PANEL DE MUESTRA</span><h1>Productos de Tinta Morena</h1><p>Este panel muestra el listado paginado. La carga y edición segura de productos, precios y stock se habilita al completar la tienda final.</p><form data-admin-search role="search"><label for="admin-q">Buscar productos</label><div class="search-field"><input id="admin-q" name="q" type="search" placeholder="Nombre o categoría" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><p data-admin-count>Cargando primera página...</p><div class="admin-list" data-admin-list aria-live="polite"></div><button class="button button-outline" type="button" data-admin-more hidden>Ver más productos ↓</button><p class="demo-note">La primera consulta pide 10 productos. Cada respuesta queda limitada en el servidor a un máximo de 100 y usa un cursor para avanzar.</p></main>''' + scripts()
(ROOT / 'admin-demo.html').write_text(admin, encoding='utf-8')
