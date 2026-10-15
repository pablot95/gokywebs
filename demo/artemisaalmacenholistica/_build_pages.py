from pathlib import Path
import json

root = Path(__file__).parent
base = 'https://gokywebs.com/demo/artemisaalmacenholistica/'
phone = '5492994733000'
image = 'images/02_Artemisa_productos_16x9.webp'
logo = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 43V6m0 19C12 25 8 19 7 10c10 0 16 5 17 15Zm0 6c12 0 17-6 17-16-10 1-16 6-17 16Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
cart_icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h2l2.1 11.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H6"/><circle cx="10" cy="20" r="1.3" fill="currentColor"/><circle cx="19" cy="20" r="1.3" fill="currentColor"/></svg>'
wa_icon = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 1A15 15 0 0 0 3.1 23.6L1 31l7.6-2A15 15 0 1 0 16 1Zm0 27.2c-2.3 0-4.5-.6-6.5-1.8l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.2 12.2 0 1 1 16 28.2Zm6.7-9.2c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.5-.6-2.9-1.8-1.1-1-1.8-2.1-2-2.5-.2-.4 0-.6.2-.8l.6-.6c.2-.2.2-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.8-2-1.2-2.8-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.6 1.5 3.8c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.2.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.3-.7-.5Z"/></svg>'
cats = [('yerbas', 'Yerbas', 'Orgánicas, agroecológicas y compuestas', '01_Artemisa_yerbas_9x16.webp'), ('cereales', 'Cereales y semillas', 'Para sumar a tus recetas', '03_Artemisa_cereales_1x1.webp'), ('bebidas', 'Bebidas vegetales', 'Opciones para cada momento', '04_Artemisa_bebidas_y_miel_1x1.webp'), ('frutos', 'Frutos secos', 'Sabores para tener a mano', '05_Artemisa_frutos_secos_1x1.webp')]
all_cats = [('yerbas','Yerbas'),('cereales','Cereales y semillas'),('bebidas','Bebidas vegetales'),('frutos','Frutos secos'),('dulces','Miel y mascabo'),('sahumerios','Sahumerios')]

def head(filename, catalog=False, admin=False):
    title = ('Panel de muestra' if admin else 'Tienda online' if catalog else 'Alimentación natural para tu día a día') + ' | Artemisa Almacén Holística'
    desc = 'Yerbas, cereales, bebidas vegetales, frutos secos, miel, azúcar mascabo y sahumerios en Artemisa Almacén Holística.'
    canonical = base + ('' if filename == 'index.html' else filename)
    schema = json.dumps({'@context':'https://schema.org','@type':'Store','name':'Artemisa Almacén Holística','description':'Local de productos saludables con tienda online.','telephone':'+54 9 299 473-3000','url':base},ensure_ascii=False,separators=(',',':'))
    return f'''<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#F7F8F5"><title>{title}</title><meta name="description" content="{desc}"><link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{base}{image}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=1"><script type="application/ld+json">{schema}</script></head>'''

def modelbar(model, catalog):
    a = 'catalogo.html' if catalog else './'
    b = 'catalogo-2.html' if catalog else 'modelo-2.html'
    return f'''<nav class="gw-modelos" aria-label="Modelos de la web"><a class="gw-modelos__btn" href="{a}"{' aria-current="page"' if model==1 else ''}>Modelo 1</a><a class="gw-modelos__btn" href="{b}"{' aria-current="page"' if model==2 else ''}>Modelo 2</a></nav>'''

def header(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    menu = ''.join(f'<a href="{catalog}?cat={slug}">{label}</a>' for slug,label in all_cats)
    return f'''<div class="topline"><div class="wrap"><span>Un almacén para elegir bien, todos los días</span><a href="https://wa.me/{phone}" target="_blank" rel="noopener noreferrer">Consultanos por WhatsApp ↗</a></div></div><header class="site-header"><div class="wrap header-inner"><a class="brand" href="{home}" aria-label="Artemisa Almacén Holística, inicio">{logo}<span>Artemisa<small>ALMACÉN HOLÍSTICA</small></span></a><nav class="main-nav" id="main-nav" aria-label="Navegación principal"><a href="{home}">Inicio</a><a href="{catalog}">Tienda</a><div class="nav-categories"><button type="button" class="nav-category-toggle" aria-expanded="false" aria-controls="category-menu">Categorías <span aria-hidden="true">⌄</span></button><div class="category-menu" id="category-menu">{menu}<a class="menu-all" href="{catalog}">Ver todo el catálogo ↗</a></div></div><a href="{home}#artemisa">Artemisa</a></nav><div class="header-actions"><form class="header-search" action="{catalog}" method="get" role="search"><label class="sr-only" for="header-q">Buscar productos</label><input id="header-q" name="q" placeholder="Buscar productos..."><button type="submit" aria-label="Buscar">⌕</button></form><button class="cart-button" type="button" data-open-cart aria-label="Abrir carrito">{cart_icon}<span data-cart-count>0</span></button><button class="menu-button" type="button" data-menu aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span></button></div></div></header>'''

def category_section(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    cards = ''.join(f'''<a class="category-card" data-animate href="{catalog}?cat={slug}"><img src="images/{img}" width="1050" height="1050" loading="lazy" alt="{label}, imagen ilustrativa"><span><b>{label}</b><small>{sub}</small><i aria-hidden="true">↗</i></span></a>''' for slug,label,sub,img in cats)
    return f'''<section class="section category-section" id="categorias" aria-labelledby="categories-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">EXPLORÁ POR CATEGORÍA</span><h2 id="categories-title">Lo natural, <em>a tu manera.</em></h2></div><p>Encontrá yerbas, alimentos y pequeños rituales para sumar a tu día.</p></div><div class="category-grid">{cards}</div></div></section>'''

def hero(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    klass = 'hero-one' if model == 1 else 'hero-two'
    return f'''<section class="hero {klass}" aria-labelledby="hero-title"><div class="wrap hero-inner"><div class="hero-copy"><span class="eyebrow">ARTEMISA · ALMACÉN HOLÍSTICA</span><h1 id="hero-title">Alimentación natural <em>para tu día a día.</em></h1><p>Yerbas, cereales, bebidas vegetales, frutos secos, miel y sahumerios para elegir con calma desde un solo lugar.</p><div class="hero-actions"><a class="button button-primary" href="{catalog}">Explorar la tienda <span aria-hidden="true">↗</span></a><a class="under-link" href="#categorias">Ver categorías <span aria-hidden="true">→</span></a></div></div><div class="hero-image"><img src="{image}" width="1600" height="900" fetchpriority="high" alt="Selección de yerbas, cereales, bebidas vegetales, frutos secos y miel sobre una mesa"></div></div></section>'''

def featured(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section featured-section" aria-labelledby="featured-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">PARA CONOCER ARTEMISA</span><h2 id="featured-title">Elegidos para <em>empezar.</em></h2></div><div class="featured-links"><div class="rail-controls"><button type="button" data-rail-prev aria-label="Productos anteriores">←</button><button type="button" data-rail-next aria-label="Productos siguientes">→</button></div><a class="under-link" href="{catalog}">Ver toda la tienda ↗</a></div></div><div class="product-grid featured-grid" data-featured aria-live="polite"><p>Cargando productos...</p></div><p class="demo-note">Productos y precios ilustrativos para esta demo. Consultá disponibilidad y precio final antes de confirmar.</p></div></section>'''

def story(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="story-section" id="artemisa" aria-labelledby="story-title"><div class="story-photo" data-animate><img src="images/01_Artemisa_yerbas_9x16.webp" width="788" height="1400" loading="lazy" alt="Yerbas y mate rodeados de hierbas y frascos"></div><div class="story-copy" data-animate><span class="eyebrow">EL ALMACÉN</span><h2 id="story-title">Una pausa para <em>elegir mejor.</em></h2><p>En Artemisa conviven las yerbas de siempre con cereales, bebidas vegetales, frutos secos, miel y otros productos para tus rutinas. Explorá la tienda y armá tu selección a tu ritmo.</p><a class="under-link" href="{catalog}">Descubrir el catálogo ↗</a></div></section>'''

def preview(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section preview-section" aria-labelledby="preview-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">MÁS PARA EXPLORAR</span><h2 id="preview-title">Encontrá eso que <em>buscabas.</em></h2></div><a class="under-link" href="{catalog}">Ver todo el catálogo ↗</a></div><div class="product-grid preview-grid" data-preview aria-live="polite"><p>Cargando productos...</p></div><div class="preview-end"><a class="button button-primary" href="{catalog}">Explorar toda la tienda ↗</a></div></div></section>'''

def closing(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="reiki-section"><div class="wrap reiki-inner"><span class="reiki-symbol" aria-hidden="true">✳</span><div><span class="eyebrow">UN MOMENTO PARA VOS</span><h2>Bienestar en cada aroma.</h2><p>También encontrás sahumerios para acompañar tus espacios y tus pausas cotidianas.</p></div><a class="button button-primary" href="{catalog}?cat=sahumerios">Descubrir sahumerios ↗</a></div></section>'''

def footer(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<footer class="site-footer"><div class="wrap footer-grid"><div><a class="brand footer-brand" href="{home}">{logo}<span>Artemisa<small>ALMACÉN HOLÍSTICA</small></span></a><p>Alimentación natural para tu día a día.</p></div><div><h2>Explorá</h2><a href="{catalog}">Tienda</a><a href="{catalog}?cat=yerbas">Yerbas</a><a href="{catalog}?cat=cereales">Cereales y semillas</a><a href="{catalog}?cat=frutos">Frutos secos</a></div><div><h2>Conversemos</h2><a href="https://wa.me/{phone}" target="_blank" rel="noopener noreferrer">+54 9 299 473-3000 ↗</a><a href="admin-demo.html">Panel de muestra</a></div></div><div class="wrap footer-bottom"><span>© 2026 Artemisa Almacén Holística</span><span>Diseño web por <a href="https://gokywebs.com/" target="_blank" rel="noopener noreferrer">Gokywebs</a></span></div></footer>'''

def drawers():
    return f'''<div class="overlay" data-overlay hidden></div><aside class="cart-drawer" data-cart role="dialog" aria-modal="true" aria-label="Tu pedido" aria-hidden="true" tabindex="-1"><div class="drawer-head"><div><span class="eyebrow">ARTEMISA</span><h2>Tu selección</h2></div><button type="button" data-close-cart aria-label="Cerrar carrito">×</button></div><div class="cart-items" data-cart-items></div><div class="drawer-foot"><div class="cart-total"><span>Total de muestra</span><strong data-cart-total>$0</strong></div><p>Productos y precios ilustrativos. Confirmá disponibilidad y precio final por WhatsApp.</p><a class="button button-primary" data-checkout href="https://wa.me/{phone}" target="_blank" rel="noopener noreferrer">Enviar pedido por WhatsApp ↗</a></div></aside><dialog class="product-dialog" data-dialog aria-label="Detalle del producto"><button type="button" class="dialog-close" data-close-dialog aria-label="Cerrar detalle">×</button><div data-dialog-body></div></dialog><div class="toast" data-toast role="status" aria-live="polite"></div><div class="float-stack"><button class="float-cart" type="button" data-open-cart aria-label="Abrir carrito">{cart_icon}<span data-cart-count>0</span></button><a class="float-wa" href="https://wa.me/{phone}" target="_blank" rel="noopener noreferrer" aria-label="Escribir a Artemisa por WhatsApp">{wa_icon}</a></div>'''

def scripts():
    return '<script src="script.js?v=1" defer></script><script src="/demo/track.js" defer></script></body></html>'

def home(model):
    filename = 'index.html' if model == 1 else 'modelo-2.html'
    sections = [category_section(model), featured(model)] if model == 1 else [featured(model), category_section(model)]
    body = head(filename) + f'<body data-page="home" data-model="{model}" class="model-{model}">' + modelbar(model,False) + header(model)
    body += '<main>' + hero(model) + ''.join(sections) + story(model) + preview(model) + closing(model) + '</main>' + footer(model) + drawers() + scripts()
    (root/filename).write_text(body,encoding='utf-8')

def catalog(model):
    filename = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    homeurl = './' if model == 1 else 'modelo-2.html'
    filters = '<button type="button" data-cat="" class="is-active">Todo</button>' + ''.join(f'<button type="button" data-cat="{slug}">{label}</button>' for slug,label in all_cats)
    main = f'''<main><section class="catalog-hero"><div class="catalog-wrap"><nav class="breadcrumb" aria-label="Miga de pan"><a href="{homeurl}">Inicio</a><span>/</span><span>Tienda</span></nav><span class="eyebrow">CATÁLOGO ARTEMISA</span><h1>Tu próxima elección <em>empieza acá.</em></h1><p>Buscá por producto o explorá por categoría.</p></div></section><section class="catalog-section"><div class="catalog-wrap"><div class="catalog-tools"><form data-catalog-search role="search"><label for="catalog-q">Buscar en la tienda</label><div class="search-field"><input id="catalog-q" name="q" type="search" placeholder="¿Qué estás buscando?" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><label class="sort-control" for="catalog-sort">Ordenar por <select id="catalog-sort" data-sort><option value="destacados">Destacados</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label></div><div class="category-filters" aria-label="Filtrar por categoría">{filters}</div><div class="catalog-status"><p data-count aria-live="polite">Cargando productos...</p><button type="button" data-clear hidden>Limpiar filtros ×</button></div><div class="product-grid catalog-grid" data-products aria-live="polite"></div><div class="more-wrap"><button class="button button-outline" type="button" data-more hidden>Ver más productos ↓</button></div><p class="demo-note">Productos y precios ilustrativos para esta demo. Consultá disponibilidad y precio final antes de confirmar.</p></div></section></main>'''
    body = head(filename,catalog=True) + f'<body data-page="catalog" data-model="{model}" class="model-{model}">' + modelbar(model,True) + header(model) + main + footer(model) + drawers() + scripts()
    (root/filename).write_text(body,encoding='utf-8')

for m in (1,2):
    home(m)
    catalog(m)

admin = head('admin-demo.html',admin=True) + '''<body data-page="admin"><main class="admin-shell"><a href="./">← Volver a la tienda</a><span class="eyebrow">PANEL DE MUESTRA</span><h1>Productos de Artemisa</h1><p>Este panel muestra el listado paginado. La carga y edición segura de productos, precios y stock se habilita al completar la tienda final.</p><form data-admin-search role="search"><label for="admin-q">Buscar productos</label><div class="search-field"><input id="admin-q" name="q" type="search" placeholder="Nombre o categoría" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><p data-admin-count>Cargando primera página...</p><div class="admin-list" data-admin-list aria-live="polite"></div><button class="button button-outline" type="button" data-admin-more hidden>Ver más productos ↓</button><p class="demo-note">La primera consulta pide 10 productos. Cada respuesta queda limitada en el servidor a un máximo de 100 y usa un cursor para avanzar.</p></main>''' + scripts()
(root/'admin-demo.html').write_text(admin,encoding='utf-8')
