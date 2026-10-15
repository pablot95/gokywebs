"""Genera dos propuestas de tienda a partir de las mismas fotos y productos."""
from pathlib import Path
from urllib.parse import quote
import json

ROOT = Path(__file__).parent
BASE = 'https://gokywebs.com/demo/impactoblanqueria/'
PHONE = '5491162143852'
IG = 'https://www.instagram.com/impacto_blanqueria/'
HERO = 'images/02_Impacto_dormitorio_16x9.webp'
VERTICAL = 'images/01_Impacto_sabanas_9x16.webp'
CATEGORIES = [
    ('sabanas', 'Sábanas', 'Para vestir la cama', '01_Impacto_sabanas_9x16.webp'),
    ('toallas', 'Toallas', 'Para todos los días', '03_Impacto_toallas_1x1.webp'),
    ('almohadas', 'Almohadas', 'Descanso y detalles', '04_Impacto_almohadones_1x1.webp'),
    ('bebes', 'Bebés', 'Textiles para los más chicos', '05_Impacto_bebes_1x1.webp'),
    ('mantas', 'Mantas', 'Calidez para tu casa', '06_Impacto_mantas_1x1.webp'),
    ('banio', 'Baño y ambiente', 'Cortinas y alfombras', '03_Impacto_toallas_1x1.webp'),
]
CART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h2l2.1 11.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H6"/><circle cx="10" cy="20" r="1.3" fill="currentColor"/><circle cx="19" cy="20" r="1.3" fill="currentColor"/></svg>'
WA_ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 1A15 15 0 0 0 3.1 23.6L1 31l7.6-2A15 15 0 1 0 16 1Zm0 27.2c-2.3 0-4.5-.6-6.5-1.8l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.2 12.2 0 1 1 16 28.2Zm6.7-9.2c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.4-.2-.2.2-.4.3-.8.1-.4-.2-1.5-.6-2.9-1.8-1.1-1-1.8-2.1-2-2.5-.2-.4 0-.6.2-.8l.6-.6c.2-.2.2-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.8-2-1.2-2.8-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.6 1.5 3.8c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.2.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.3-.7-.5Z"/></svg>'

def head(name, catalog=False, admin=False):
    title = ('Panel de muestra' if admin else 'Catálogo de blanquería' if catalog else 'Textiles para cada rincón') + ' | Impacto Blanquería'
    desc = 'Sábanas, toallas, mantas, almohadas y textiles para el hogar. Explorá la tienda de Impacto Blanquería.'
    schema = json.dumps({'@context':'https://schema.org','@type':'Store','name':'Impacto Blanquería','description':'Productos de blanquería y textiles para el hogar.','telephone':'+54 9 11 6214-3852','url':BASE,'sameAs':[IG]}, ensure_ascii=False, separators=(',',':'))
    canonical = BASE + ('' if name == 'index.html' else name)
    robots = '<meta name="robots" content="noindex,nofollow">' if admin else ''
    return f'''<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#FCFAFC"><title>{title}</title><meta name="description" content="{desc}">{robots}<link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{BASE}{HERO}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=1"><script type="application/ld+json">{schema}</script></head>'''

def modelbar(model, catalog=False):
    first = 'catalogo.html' if catalog else './'
    second = 'catalogo-2.html' if catalog else 'modelo-2.html'
    a = ' aria-current="page"' if model == 1 else ''
    b = ' aria-current="page"' if model == 2 else ''
    return f'<nav class="gw-modelos" aria-label="Modelos de la web"><a class="gw-modelos__btn" href="{first}"{a}>Modelo 1</a><a class="gw-modelos__btn" href="{second}"{b}>Modelo 2</a></nav>'

def brand(home):
    return f'<a class="brand" href="{home}" aria-label="Impacto Blanquería, inicio"><span class="brand-mark">✳</span><span>Impacto<small>BLANQUERÍA</small></span></a>'

def header(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    menu = ''.join(f'<a href="{catalog}?cat={slug}">{label}</a>' for slug,label,*_ in CATEGORIES)
    return f'''<div class="topline"><div class="wrap"><span>Textiles para hacer de tu casa tu lugar</span><a href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer">Consultas por WhatsApp ↗</a></div></div><header class="site-header"><div class="wrap header-inner">{brand(home)}<nav class="main-nav" id="main-nav" aria-label="Navegación principal"><a href="{home}">Inicio</a><a href="{catalog}">Productos</a><div class="nav-categories"><button type="button" class="nav-category-toggle" aria-expanded="false" aria-controls="category-menu">Categorías <span aria-hidden="true">⌄</span></button><div class="category-menu" id="category-menu">{menu}<a class="menu-all" href="{catalog}">Ver todo el catálogo ↗</a></div></div><a href="{home}#contacto">Contacto</a></nav><div class="header-actions"><form class="header-search" action="{catalog}" method="get" role="search"><label class="sr-only" for="header-q">Buscar productos</label><input id="header-q" name="q" placeholder="Buscar productos..."><button type="submit" aria-label="Buscar">⌕</button></form><button class="cart-button" type="button" data-open-cart aria-label="Abrir pedido">{CART_ICON}<span data-cart-count>0</span></button><button class="menu-button" type="button" data-menu aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span></button></div></div></header>'''

def hero(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    if model == 1:
        return f'''<section class="impact-hero impact-hero-one" aria-labelledby="hero-title"><div class="impact-hero-text"><span class="eyebrow">IMPACTO BLANQUERÍA · TEXTILES PARA EL HOGAR</span><h1 id="hero-title">Un hogar que se siente <em>como vos.</em></h1><p>Sábanas, toallas, mantas y pequeños detalles para disfrutar cada espacio.</p><div class="hero-actions"><a class="button button-primary" href="{catalog}">Explorar productos ↗</a><a class="under-link" href="#categorias">Ver categorías →</a></div><span class="hero-footnote">Tu casa, en cada detalle ✳</span></div><div class="impact-hero-image"><img src="{HERO}" width="1600" height="900" fetchpriority="high" alt="Dormitorio cálido con textiles claros y detalles rosados"></div></section>'''
    return f'''<section class="impact-hero impact-hero-two" aria-labelledby="hero-title"><img class="impact-hero-bg" src="{HERO}" width="1600" height="900" fetchpriority="high" alt="Dormitorio cálido con textiles claros y detalles rosados"><div class="impact-hero-overlay"></div><div class="wrap impact-hero-inner"><span class="eyebrow">IMPACTO BLANQUERÍA · TEXTILES PARA EL HOGAR</span><h1 id="hero-title">Un hogar que se siente <em>como vos.</em></h1><p>Sábanas, toallas, mantas y pequeños detalles para disfrutar cada espacio.</p><div class="hero-actions"><a class="button button-primary" href="{catalog}">Explorar productos ↗</a><a class="under-link" href="#categorias">Ver categorías →</a></div><span class="hero-footnote">Tu casa, en cada detalle ✳</span></div></section>'''

def categories(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    cards = ''.join(f'<a class="category-card" data-animate href="{catalog}?cat={slug}"><img src="images/{photo}" width="1254" height="1254" loading="lazy" alt="{label}, foto ilustrativa"><span><b>{label}</b><small>{sub}</small><i aria-hidden="true">↗</i></span></a>' for slug,label,sub,photo in CATEGORIES)
    return f'''<section class="section category-section" id="categorias" aria-labelledby="categories-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">CADA RINCÓN CUENTA</span><h2 id="categories-title">Elegí por <em>categoría.</em></h2></div><a class="under-link" href="{catalog}">Ver el catálogo ↗</a></div><div class="category-grid">{cards}</div></div></section>'''

def featured(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section featured-section" aria-labelledby="featured-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">EN LA TIENDA</span><h2 id="featured-title">Elegidos para <em>tu casa.</em></h2></div><div class="featured-links"><div class="rail-controls"><button type="button" data-rail-prev aria-label="Productos anteriores">←</button><button type="button" data-rail-next aria-label="Productos siguientes">→</button></div><a class="under-link" href="{catalog}">Todos los productos ↗</a></div></div><div class="product-grid featured-grid" data-featured aria-live="polite"><p>Cargando productos...</p></div><p class="demo-note">Productos, fotos y precios ilustrativos para la demo. Consultá opciones, disponibilidad y precio final.</p></div></section>'''

def story(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="story-section" aria-labelledby="story-title"><div class="story-photo" data-animate><img src="{VERTICAL}" width="788" height="1400" loading="lazy" alt="Textiles de cama en una habitación luminosa"></div><div class="story-copy" data-animate><span class="eyebrow">IMPACTO BLANQUERÍA</span><h2 id="story-title">Textiles que acompañan <em>todos los días.</em></h2><p>Encontrá opciones para la cama, el baño y los espacios que más disfrutás: sábanas, toallas, mantas, almohadones y más.</p><p>Las medidas indicadas en el catálogo son referencias de los productos. Escribinos para consultar colores, materiales y disponibilidad.</p><a class="under-link" href="{catalog}">Conocé los productos ↗</a></div></section>'''

def preview(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section preview-section" aria-labelledby="preview-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">SEGUÍ DESCUBRIENDO</span><h2 id="preview-title">Más ideas para <em>renovar tu hogar.</em></h2></div><a class="under-link" href="{catalog}">Ver todo ↗</a></div><div class="product-grid preview-grid" data-preview aria-live="polite"><p>Cargando productos...</p></div><div class="preview-end"><a class="button button-primary" href="{catalog}">Ir al catálogo completo ↗</a></div></div></section>'''

def contact():
    href = f'https://wa.me/{PHONE}?text={quote("Hola, quiero consultar la ubicación y los productos de Impacto Blanquería.")}'
    return f'''<section class="contact-section" id="contacto"><div class="wrap contact-grid"><div><span class="eyebrow">ESTAMOS PARA AYUDARTE</span><h2>¿Buscás algo <em>especial?</em></h2><p>Consultanos por medidas, opciones y disponibilidad para elegir lo que mejor va con tu casa.</p><a class="button button-primary" href="{href}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp ↗</a></div><div class="contact-panel"><span>UBICACIÓN</span><h3>Coordinemos por WhatsApp</h3><p>Consultanos dónde encontrarnos o cómo coordinar la entrega.</p><span>REFERENCIAS</span><h3>Conocé los productos</h3><p>Encontrá medidas y detalles en el catálogo. También podés ver más de Impacto Blanquería en <a href="{IG}" target="_blank" rel="noopener noreferrer">Instagram ↗</a></p></div></div></section>'''

def footer(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<footer class="site-footer"><div class="wrap footer-grid"><div>{brand(home)}<p>Textiles para los espacios que hacen hogar.</p></div><div><h2>Explorá</h2><a href="{catalog}">Todos los productos</a><a href="{catalog}?cat=sabanas">Sábanas</a><a href="{catalog}?cat=toallas">Toallas</a><a href="{catalog}?cat=mantas">Mantas</a></div><div><h2>Conversemos</h2><a href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer">+54 9 11 6214-3852 ↗</a><a href="{IG}" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="admin-demo.html">Panel de muestra</a></div></div><div class="wrap footer-bottom"><span>© 2026 Impacto Blanquería</span><span>Diseño web por <a href="https://gokywebs.com/" target="_blank" rel="noopener noreferrer">Gokywebs</a></span></div></footer>'''

def drawers():
    return f'''<div class="overlay" data-overlay hidden></div><aside class="cart-drawer" data-cart role="dialog" aria-modal="true" aria-label="Tu pedido" aria-hidden="true" tabindex="-1"><div class="drawer-head"><div><span class="eyebrow">IMPACTO BLANQUERÍA</span><h2>Tu selección</h2></div><button type="button" data-close-cart aria-label="Cerrar carrito">×</button></div><div class="cart-items" data-cart-items></div><div class="drawer-foot"><div class="cart-total"><span>Total de muestra</span><strong data-cart-total>$0</strong></div><p>Productos y precios ilustrativos. Confirmá opciones y precio final por WhatsApp.</p><a class="button button-primary" data-checkout href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer">Enviar pedido por WhatsApp ↗</a></div></aside><dialog class="product-dialog" data-dialog aria-label="Detalle del producto"><button type="button" class="dialog-close" data-close-dialog aria-label="Cerrar detalle">×</button><div data-dialog-body></div></dialog><div class="toast" data-toast role="status" aria-live="polite"></div><div class="float-stack"><button class="float-cart" type="button" data-open-cart aria-label="Abrir carrito">{CART_ICON}<span data-cart-count>0</span></button><a class="float-wa" href="https://wa.me/{PHONE}" target="_blank" rel="noopener noreferrer" aria-label="Escribir a Impacto Blanquería por WhatsApp">{WA_ICON}</a></div>'''

def scripts():
    return '<script src="script.js?v=1" defer></script><script src="/demo/track.js" defer></script></body></html>'

def home(model):
    name = 'index.html' if model == 1 else 'modelo-2.html'
    sections = [categories(model), featured(model)] if model == 1 else [featured(model), categories(model)]
    body = head(name) + f'<body data-page="home" data-model="{model}" class="model-{model}">' + modelbar(model) + header(model)
    body += '<main>' + hero(model) + ''.join(sections) + story(model) + preview(model) + contact() + '</main>' + footer(model) + drawers() + scripts()
    (ROOT / name).write_text(body, encoding='utf-8')

def catalog(model):
    name = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    home_url = './' if model == 1 else 'modelo-2.html'
    filters = '<button type="button" data-cat="" class="is-active">Todo</button>' + ''.join(f'<button type="button" data-cat="{slug}">{label}</button>' for slug,label,*_ in CATEGORIES)
    main = f'''<main><section class="catalog-hero"><div class="catalog-wrap"><nav class="breadcrumb" aria-label="Miga de pan"><a href="{home_url}">Inicio</a><span>/</span><span>Productos</span></nav><span class="eyebrow">CATÁLOGO IMPACTO BLANQUERÍA</span><h1>Todo para hacer <em>hogar.</em></h1><p>Buscá sábanas, toallas, mantas y más textiles para cada rincón.</p></div></section><section class="catalog-section"><div class="catalog-wrap"><div class="catalog-tools"><form data-catalog-search role="search"><label for="catalog-q">Buscar productos</label><div class="search-field"><input id="catalog-q" name="q" type="search" placeholder="¿Qué producto buscás?" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><label class="sort-control" for="catalog-sort">Ordenar por <select id="catalog-sort" data-sort><option value="destacados">Destacados</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label></div><div class="category-filters" aria-label="Filtrar por categoría">{filters}</div><div class="catalog-status"><p data-count aria-live="polite">Cargando productos...</p><button type="button" data-clear hidden>Limpiar filtros ×</button></div><div class="product-grid catalog-grid" data-products aria-live="polite"></div><div class="more-wrap"><button class="button button-outline" type="button" data-more hidden>Ver más productos ↓</button></div><p class="demo-note">Productos, fotos y precios ilustrativos. Confirmá medidas, opciones, disponibilidad y precio final antes de pedir.</p></div></section></main>'''
    body = head(name, catalog=True) + f'<body data-page="catalog" data-model="{model}" class="model-{model}">' + modelbar(model, True) + header(model) + main + footer(model) + drawers() + scripts()
    (ROOT / name).write_text(body, encoding='utf-8')

for model in (1, 2):
    home(model)
    catalog(model)

admin = head('admin-demo.html', admin=True) + '''<body data-page="admin"><main class="admin-shell"><a href="./">← Volver a la tienda</a><span class="eyebrow">PANEL DE MUESTRA</span><h1>Productos de Impacto Blanquería</h1><p>Este panel muestra el listado paginado. La carga y edición segura de productos, precios y stock se habilita al completar la tienda final.</p><form data-admin-search role="search"><label for="admin-q">Buscar productos</label><div class="search-field"><input id="admin-q" name="q" type="search" placeholder="Nombre o categoría" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><p data-admin-count>Cargando primera página...</p><div class="admin-list" data-admin-list aria-live="polite"></div><button class="button button-outline" type="button" data-admin-more hidden>Ver más productos ↓</button><p class="demo-note">La primera consulta pide 10 productos. Cada respuesta queda limitada en el servidor a un máximo de 100 y usa un cursor para avanzar.</p></main>''' + scripts()
(ROOT / 'admin-demo.html').write_text(admin, encoding='utf-8')
