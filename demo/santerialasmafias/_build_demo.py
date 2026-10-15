"""Construye las dos muestras de Santeria las mafias con datos ilustrativos."""
from pathlib import Path
from PIL import Image
from urllib.parse import quote
import json
import re
import unicodedata

ROOT = Path(__file__).parent
IMAGES = ROOT / 'images'
BASE = 'https://gokywebs.com/demo/santerialasmafias/'
PHONE = '5491169560340'
WA = f'https://wa.me/{PHONE}'
HERO = 'images/02_Santeria_altar_productos_16x9.webp'
VERTICAL = 'images/01_Santeria_velones_local_9x16.webp'
CATEGORIES = [
    ('velones', 'Velones Fortaleza', 'El corazón de la tienda', '03_Santeria_velas_1x1.webp'),
    ('velas', 'Velas', 'Distintas opciones para elegir', '01_Santeria_velones_local_9x16.webp'),
    ('rosarios', 'Rosarios e incienso', 'Accesorios y detalles', '04_Santeria_rosarios_incienso_1x1.webp'),
    ('imagenes', 'Imágenes religiosas', 'Piezas para descubrir', '05_Santeria_santos_imagenes_1x1.webp'),
]
PRODUCTS = {
    'velones': ('03_Santeria_velas_1x1.webp', [
        ('Velón Fortaleza azul', 8500), ('Velón Fortaleza blanco', 8500), ('Velón Fortaleza dorado', 9500),
        ('Velón Fortaleza clásico', 8200), ('Velón Fortaleza color surtido', 8400),
        ('Velón Fortaleza grande', 12500), ('Velón Fortaleza mediano', 9700), ('Velón Fortaleza para altar', 11000),
    ]),
    'velas': ('01_Santeria_velones_local_9x16.webp', [
        ('Vela blanca', 2500), ('Vela azul', 2500), ('Vela dorada', 3200), ('Vela de color surtido', 2700),
        ('Vela pequeña', 1900), ('Vela en vaso', 5800), ('Vela para altar', 4300), ('Set de velas', 7900),
    ]),
    'rosarios': ('04_Santeria_rosarios_incienso_1x1.webp', [
        ('Rosario azul', 6800), ('Rosario blanco', 6800), ('Rosario con cruz', 7500), ('Incienso clásico', 3200),
        ('Incienso surtido', 3500), ('Porta incienso', 5900), ('Pulsera de cuentas', 6200), ('Dije de protección', 4900),
    ]),
    'imagenes': ('05_Santeria_santos_imagenes_1x1.webp', [
        ('Imagen religiosa azul', 24900), ('Imagen religiosa blanca', 22900), ('Imagen religiosa pequeña', 13900),
        ('Imagen religiosa para altar', 27900), ('Figura decorativa religiosa', 18900),
        ('Imagen religiosa de mesa', 16900), ('Conjunto de imágenes religiosas', 39900), ('Imagen religiosa clásica', 21900),
    ]),
}


def slug(value):
    ascii_value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', '-', ascii_value).strip('-')


for source in IMAGES.glob('*.png'):
    if source.name.startswith('07_'):
        continue
    output = source.with_suffix('.webp')
    with Image.open(source) as photo:
        photo.convert('RGB').save(output, 'WEBP', quality=82, method=6)

rows = []
for pos in range(8):
    for cat, (photo, items) in PRODUCTS.items():
        name, price = items[pos]
        index = len(rows) + 1
        rows.append({
            'id': f'{slug(name)}-{index:02d}',
            'name': name,
            'category': cat,
            'description': f'{name}. Ejemplo de producto para mostrar cómo se vería el catálogo de Santeria las mafias. La foto representa la categoría; consultá presentación, disponibilidad y precio final antes de hacer tu pedido.',
            'price': price,
            'image': photo,
            'visible': index != 32,
        })
for filename, data in [
    ('productos-data.php', rows),
    ('productos-precio-asc-data.php', sorted(rows, key=lambda p: (p['price'], p['id']))),
    ('productos-precio-desc-data.php', sorted(rows, key=lambda p: (-p['price'], p['id']))),
]:
    # Si alguien solicita este archivo directamente, PHP corta la respuesta.
    header = '<?php http_response_code(404); exit; ?>\n'
    (ROOT / filename).write_text(header + ''.join(json.dumps(row, ensure_ascii=False, separators=(',', ':')) + '\n' for row in data), encoding='utf-8')

CART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h2l2.1 11.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H6"/><circle cx="10" cy="20" r="1.3" fill="currentColor"/><circle cx="19" cy="20" r="1.3" fill="currentColor"/></svg>'
WA_ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 1A15 15 0 0 0 3.1 23.6L1 31l7.6-2A15 15 0 1 0 16 1Zm0 27.2c-2.3 0-4.5-.6-6.5-1.8l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.2 12.2 0 1 1 16 28.2Zm6.7-9.2c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.4-.2-.2.2-.4.3-.8.1-.4-.2-1.5-.6-2.9-1.8-1.1-1.8-2.1-2-2.5-.2-.4 0-.6.2-.8l.6-.6c.2-.2.2-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.8-2-1.2-2.8-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.6 1.5 3.8c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.2.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.3-.7-.5Z"/></svg>'


def head(filename, catalog=False, admin=False):
    title = ('Panel de muestra' if admin else 'Catálogo de velas y artículos religiosos' if catalog else 'Velas, velones y artículos religiosos') + ' | Santeria las mafias'
    desc = 'Velas, velones Fortaleza y artículos religiosos en José C. Paz. Venta mayorista y minorista. Conocé Santeria las mafias.'
    canonical = BASE + ('' if filename == 'index.html' else filename)
    schema = json.dumps({'@context': 'https://schema.org', '@type': 'Store', 'name': 'Santeria las mafias', 'description': desc, 'telephone': '+54 9 11 6956-0340', 'address': {'@type': 'PostalAddress', 'streetAddress': 'Av. Croacia 833', 'addressLocality': 'José C. Paz', 'addressCountry': 'AR'}, 'url': BASE}, ensure_ascii=False, separators=(',', ':'))
    robots = '<meta name="robots" content="noindex,nofollow">' if admin else ''
    return f'''<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#1E3A5F"><title>{title}</title><meta name="description" content="{desc}">{robots}<link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{BASE}{HERO}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=1"><script type="application/ld+json">{schema}</script></head>'''


def modelbar(model, catalog):
    first = 'catalogo.html' if catalog else './'
    second = 'catalogo-2.html' if catalog else 'modelo-2.html'
    return f'<nav class="gw-modelos" aria-label="Modelos de la web"><a class="gw-modelos__btn" href="{first}"{" aria-current=\"page\"" if model == 1 else ""}>Modelo 1</a><a class="gw-modelos__btn" href="{second}"{" aria-current=\"page\"" if model == 2 else ""}>Modelo 2</a></nav>'


def brand(home):
    return f'<a class="brand" href="{home}" aria-label="Santeria las mafias, inicio"><span class="brand-symbol" aria-hidden="true">✷</span><span>Santeria las mafias<small>VELAS · VELONES · ARTÍCULOS RELIGIOSOS</small></span></a>'


def header(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    menu = ''.join(f'<a href="{catalog}?cat={slug}">{label}</a>' for slug, label, *_ in CATEGORIES)
    return f'''<div class="topline"><div class="wrap"><span>Av. Croacia 833 · José C. Paz</span><span>Venta mayorista y minorista</span></div></div><header class="site-header"><div class="wrap header-inner">{brand(home)}<nav class="main-nav" id="main-nav" aria-label="Navegación principal"><a href="{home}">Inicio</a><a href="{catalog}">Tienda</a><div class="nav-categories"><button type="button" class="nav-category-toggle" aria-expanded="false" aria-controls="category-menu">Categorías <span aria-hidden="true">⌄</span></button><div class="category-menu" id="category-menu">{menu}<a class="menu-all" href="{catalog}">Ver todo el catálogo ↗</a></div></div><a href="{home}#mayoristas">Mayoristas</a><a href="{home}#visitanos">Cómo encontrarnos</a></nav><div class="header-actions"><a class="header-wa" href="{WA}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><button class="cart-button" type="button" data-open-cart aria-label="Abrir carrito">{CART_ICON}<span data-cart-count>0</span></button><button class="menu-button" type="button" data-menu aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span></button></div></div></header>'''


def hero(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    if model == 1:
        return f'''<section class="hero hero-one" aria-labelledby="hero-title"><img class="hero-bg" src="{HERO}" width="1600" height="900" fetchpriority="high" alt="Velas, imágenes y artículos religiosos en una composición de muestra"><div class="wrap hero-inner"><div class="hero-copy" data-animate><span class="eyebrow">SANTERIA LAS MAFIAS · JOSÉ C. PAZ</span><h1 id="hero-title">Velas, velones y <em>artículos religiosos.</em></h1><p>Encontrá opciones para tu espacio, tu comercio o tu altar. Vendemos al por mayor y al por menor en José C. Paz.</p><div class="hero-actions"><a class="button button-primary" href="{catalog}">Explorar el catálogo <span aria-hidden="true">↗</span></a><a class="under-link" href="#categorias">Ver categorías ↓</a></div></div></div><span class="hero-index">01 / LA TIENDA</span></section>'''
    return f'''<section class="hero hero-two" aria-labelledby="hero-title"><div class="wrap hero-inner"><div class="hero-copy" data-animate><span class="eyebrow">SANTERIA LAS MAFIAS · JOSÉ C. PAZ</span><h1 id="hero-title">Velas, velones y <em>artículos religiosos.</em></h1><p>Encontrá opciones para tu espacio, tu comercio o tu altar. Vendemos al por mayor y al por menor en José C. Paz.</p><div class="hero-actions"><a class="button button-primary" href="{catalog}">Explorar el catálogo <span aria-hidden="true">↗</span></a><a class="under-link" href="#categorias">Ver categorías ↓</a></div></div><div class="hero-image"><img src="{VERTICAL}" width="788" height="1400" fetchpriority="high" alt="Velones y artículos religiosos en una tienda"></div></div><span class="hero-index">01 / LA TIENDA</span></section>'''


def categories(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    tiles = ''.join(f'<a class="category-card" data-animate href="{catalog}?cat={slug}"><img src="images/{photo}" width="1254" height="1254" loading="lazy" alt="{label}, imagen ilustrativa"><span><b>{label}</b><small>{sub}</small><i aria-hidden="true">↗</i></span></a>' for slug, label, sub, photo in CATEGORIES)
    return f'''<section class="section category-section" id="categorias" aria-labelledby="categories-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">RECORRÉ LA TIENDA</span><h2 id="categories-title">Un lugar para <em>cada búsqueda.</em></h2></div><a class="under-link" href="{catalog}">Ver toda la tienda ↗</a></div><div class="category-grid">{tiles}</div></div></section>'''


def featured(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section featured-section" aria-labelledby="featured-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">UNA MUESTRA DEL CATÁLOGO</span><h2 id="featured-title">Para empezar <em>a elegir.</em></h2></div><div class="featured-links"><div class="rail-controls"><button type="button" data-rail-prev aria-label="Productos anteriores">←</button><button type="button" data-rail-next aria-label="Productos siguientes">→</button></div><a class="under-link" href="{catalog}">Ver todo el catálogo ↗</a></div></div><div class="product-grid featured-grid" data-featured aria-live="polite"><p>Cargando productos...</p></div><p class="demo-note">Productos, imágenes y precios ilustrativos para esta demo. Confirmá opciones y valores por WhatsApp.</p></div></section>'''


def story(model):
    return f'''<section class="story-section" id="mayoristas" aria-labelledby="story-title"><div class="story-photo" data-animate><img src="{VERTICAL}" width="788" height="1400" loading="lazy" alt="Selección de velones y artículos religiosos"></div><div class="story-copy" data-animate><span class="eyebrow">VENTA MAYORISTA Y MINORISTA</span><h2 id="story-title">Para una pieza. <em>Para muchas.</em></h2><p>En Santeria las mafias podés consultar por velas, velones Fortaleza y artículos religiosos tanto para una compra particular como para tu comercio. Escribinos y contanos qué necesitás.</p><a class="button button-dark" href="{WA}?text={quote('Hola, quiero consultar por compras mayoristas en Santeria las mafias.') }" target="_blank" rel="noopener noreferrer">Consultar por mayor ↗</a></div></section>'''


def preview(model):
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<section class="section preview-section" aria-labelledby="preview-title"><div class="wrap"><div class="section-heading" data-animate><div><span class="eyebrow">SEGUÍ EXPLORANDO</span><h2 id="preview-title">Más para <em>descubrir.</em></h2></div><a class="under-link" href="{catalog}">Ir al catálogo ↗</a></div><div class="product-grid preview-grid" data-preview aria-live="polite"><p>Cargando productos...</p></div><div class="preview-end"><a class="button button-primary" href="{catalog}">Ver el catálogo completo ↗</a></div></div></section>'''


def visit():
    map_url = 'https://www.google.com/maps/search/?api=1&query=' + quote('Av Croacia 833, José C. Paz')
    return f'''<section class="visit-section" id="visitanos" aria-labelledby="visit-title"><div class="wrap visit-inner"><div><span class="eyebrow">EN JOSÉ C. PAZ</span><h2 id="visit-title">Encontranos en <em>Av. Croacia 833.</em></h2><p>Acercate o escribinos por WhatsApp para consultar por productos y compras mayoristas o minoristas.</p><div class="visit-actions"><a class="button button-primary" href="{map_url}" target="_blank" rel="noopener noreferrer">Ver ubicación ↗</a><a class="under-link" href="{WA}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp ↗</a></div></div><div class="visit-photo"><img src="images/06_Santeria_combos_espirituales_1x1.webp" width="1254" height="1254" loading="lazy" alt="Composición de artículos religiosos, imagen ilustrativa"></div></div></section>'''


def footer(model):
    home = './' if model == 1 else 'modelo-2.html'
    catalog = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    return f'''<footer class="site-footer"><div class="wrap footer-grid"><div>{brand(home)}<p>Velas, velones Fortaleza y artículos religiosos en José C. Paz. Ventas mayoristas y minoristas.</p></div><div><h2>Explorá</h2><a href="{catalog}">Tienda completa</a><a href="{catalog}?cat=velones">Velones Fortaleza</a><a href="{catalog}?cat=velas">Velas</a><a href="{catalog}?cat=imagenes">Imágenes religiosas</a></div><div><h2>Contacto</h2><a href="{WA}" target="_blank" rel="noopener noreferrer">+54 9 11 6956-0340 ↗</a><span>Av. Croacia 833, José C. Paz</span><a href="admin-demo.html">Panel de muestra</a></div></div><div class="wrap footer-bottom"><span>© 2026 Santeria las mafias</span><span>Diseño web por <a href="https://gokywebs.com/" target="_blank" rel="noopener noreferrer">Gokywebs</a></span></div></footer>'''


def drawers():
    return f'''<div class="overlay" data-overlay hidden></div><aside class="cart-drawer" data-cart role="dialog" aria-modal="true" aria-label="Tu pedido" aria-hidden="true" tabindex="-1"><div class="drawer-head"><div><span class="eyebrow">SANTERIA LAS MAFIAS</span><h2>Tu selección</h2></div><button type="button" data-close-cart aria-label="Cerrar carrito">×</button></div><div class="cart-items" data-cart-items></div><div class="drawer-foot"><div class="cart-total"><span>Total de muestra</span><strong data-cart-total>$0</strong></div><p>Productos y precios ilustrativos. Confirmá disponibilidad y precio final por WhatsApp.</p><a class="button button-primary" data-checkout href="{WA}" target="_blank" rel="noopener noreferrer">Enviar pedido por WhatsApp ↗</a></div></aside><dialog class="product-dialog" data-dialog aria-label="Detalle del producto"><button type="button" class="dialog-close" data-close-dialog aria-label="Cerrar detalle">×</button><div data-dialog-body></div></dialog><div class="toast" data-toast role="status" aria-live="polite"></div><div class="float-stack"><button class="float-cart" type="button" data-open-cart aria-label="Abrir carrito">{CART_ICON}<span data-cart-count>0</span></button><a class="float-wa" href="{WA}" target="_blank" rel="noopener noreferrer" aria-label="Escribir a Santeria las mafias por WhatsApp">{WA_ICON}</a></div>'''


def scripts():
    return '<script src="script.js?v=1" defer></script><script src="/demo/track.js" defer></script></body></html>'


def home(model):
    name = 'index.html' if model == 1 else 'modelo-2.html'
    sections = [categories(model), featured(model)] if model == 1 else [featured(model), categories(model)]
    html = head(name) + f'<body data-page="home" data-model="{model}" class="model-{model}">' + modelbar(model, False) + header(model)
    html += '<main>' + hero(model) + ''.join(sections) + story(model) + preview(model) + visit() + '</main>' + footer(model) + drawers() + scripts()
    (ROOT / name).write_text(html, encoding='utf-8')


def catalog(model):
    name = 'catalogo.html' if model == 1 else 'catalogo-2.html'
    home_url = './' if model == 1 else 'modelo-2.html'
    filters = '<button type="button" data-cat="" class="is-active">Todo</button>' + ''.join(f'<button type="button" data-cat="{slug}">{label}</button>' for slug, label, *_ in CATEGORIES)
    main = f'''<main><section class="catalog-hero"><div class="catalog-wrap"><nav class="breadcrumb" aria-label="Miga de pan"><a href="{home_url}">Inicio</a><span>/</span><span>Catálogo</span></nav><span class="eyebrow">SANTERIA LAS MAFIAS · CATÁLOGO</span><h1>Elegí a tu <em>manera.</em></h1><p>Velas, velones Fortaleza y artículos religiosos para compras mayoristas y minoristas.</p><p class="catalog-demo-note">Productos y precios ilustrativos. Consultá el catálogo actualizado por WhatsApp.</p></div></section><section class="catalog-section"><div class="catalog-wrap"><div class="catalog-tools"><form data-catalog-search role="search"><label for="catalog-q">Buscar productos</label><div class="search-field"><input id="catalog-q" name="q" type="search" placeholder="¿Qué estás buscando?" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><label class="sort-control" for="catalog-sort">Ordenar por <select id="catalog-sort" data-sort><option value="destacados">Destacados</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label></div><div class="category-filters" aria-label="Filtrar por categoría">{filters}</div><div class="catalog-status"><p data-count aria-live="polite">Cargando productos...</p><button type="button" data-clear hidden>Limpiar filtros ×</button></div><div class="product-grid catalog-grid" data-products aria-live="polite"></div><div class="more-wrap"><button class="button button-outline" type="button" data-more hidden>Ver más productos ↓</button></div><p class="demo-note">Los productos, imágenes y precios son ilustrativos para esta demo. Confirmá el catálogo real, la disponibilidad y el precio final por WhatsApp.</p></div></section></main>'''
    html = head(name, catalog=True) + f'<body data-page="catalog" data-model="{model}" class="model-{model}">' + modelbar(model, True) + header(model) + main + footer(model) + drawers() + scripts()
    (ROOT / name).write_text(html, encoding='utf-8')


for m in (1, 2):
    home(m)
    catalog(m)

admin = head('admin-demo.html', admin=True) + '''<body data-page="admin"><main class="admin-shell"><a href="./">← Volver a la tienda</a><span class="eyebrow">PANEL DE MUESTRA</span><h1>Productos de Santeria las mafias</h1><p>Esta vista muestra el listado paginado. La carga y edición segura de productos, fotos y precios se habilita al completar la tienda final.</p><form data-admin-search role="search"><label for="admin-q">Buscar productos</label><div class="search-field"><input id="admin-q" name="q" type="search" placeholder="Nombre o categoría" autocomplete="off"><button type="submit">Buscar ↗</button></div></form><p data-admin-count>Cargando primera página...</p><div class="admin-list" data-admin-list aria-live="polite"></div><button class="button button-outline" type="button" data-admin-more hidden>Ver más productos ↓</button><p class="demo-note">La primera consulta pide 10 productos. Cada respuesta queda limitada en el servidor a un máximo de 100 y usa un cursor para avanzar.</p></main>''' + scripts()
(ROOT / 'admin-demo.html').write_text(admin, encoding='utf-8')
