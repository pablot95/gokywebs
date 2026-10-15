"""Construye dos propuestas de una página con el mismo contenido."""
from pathlib import Path
from urllib.parse import quote
import json

ROOT = Path(__file__).parent
BASE = 'https://gokywebs.com/demo/gasargentina/'
PHONE = '5491162162580'
DISPLAY_PHONE = '+54 9 11 6216-2580'
INSTAGRAM = 'https://www.instagram.com/gas.argentina/'
HERO = 'images/02_horizontal_16x9.webp'
VERTICAL = 'images/01_vertical_9x16.webp'

def wa(message):
    return f'https://wa.me/{PHONE}?text={quote(message)}'

def head(name):
    title = 'Gas Argentina — Instalaciones y reconexiones de gas natural'
    description = 'Instalaciones y trabajos para reconexiones de gas natural. Conocé los servicios de Gas Argentina y consultá directamente por WhatsApp.'
    canonical = BASE if name == 'index.html' else BASE + name
    schema = json.dumps({
        '@context': 'https://schema.org', '@type': 'LocalBusiness',
        'name': 'Gas Argentina', 'description': description,
        'url': BASE, 'telephone': DISPLAY_PHONE, 'sameAs': [INSTAGRAM],
    }, ensure_ascii=False, separators=(',', ':'))
    return f'''<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#F8FAFC"><title>{title}</title><meta name="description" content="{description}"><link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{description}"><meta property="og:image" content="{BASE}{HERO}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=1"><noscript><style>[data-animate]{{opacity:1!important;transform:none!important;clip-path:none!important}}</style></noscript><script type="application/ld+json">{schema}</script></head>'''

def modelbar(model):
    one = ' aria-current="page"' if model == 1 else ''
    two = ' aria-current="page"' if model == 2 else ''
    return f'''<nav class="gw-modelos" aria-label="Modelos de la web"><a class="gw-modelos__btn" href="./" data-modelo="1"{one}>Modelo 1</a><a class="gw-modelos__btn" href="modelo-2.html" data-modelo="2"{two}>Modelo 2</a></nav>'''

def brand(home):
    return f'<a class="brand" href="{home}" aria-label="Gas Argentina, inicio"><span>GAS</span><span>ARGENTINA</span><i aria-hidden="true"></i></a>'

def header(model):
    home = './' if model == 1 else 'modelo-2.html'
    return f'''<header class="site-header"><div class="wrap header-inner">{brand(home)}<nav class="main-nav" id="main-nav" aria-label="Navegación principal"><a href="#inicio">Inicio</a><a href="#servicios">Servicios</a><a href="#proceso">Cómo trabajamos</a><a href="#imagenes">Imágenes</a><a href="#contacto">Contacto</a></nav><a class="header-cta" href="{wa('Hola, quiero consultar por un trabajo de gas natural.') }" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span></button></div></header>'''

def hero(model):
    content = f'''<div class="hero-copy"><p class="hero-kicker">GAS ARGENTINA · INSTALACIONES DE GAS NATURAL</p><h1>Instalaciones y reconexiones de <em>gas natural.</em></h1><p class="hero-lead">Contanos qué necesitás y conversemos los próximos pasos para tu instalación.</p><div class="hero-actions"><a class="btn btn-primary" href="{wa('Hola, quiero consultar por una instalación o reconexión de gas natural.') }" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <span aria-hidden="true">↗</span></a><a class="text-link" href="#servicios">Ver servicios <span aria-hidden="true">↓</span></a></div></div>'''
    photo = f'''<div class="hero-media"><img src="{HERO}" width="1600" height="900" fetchpriority="high" alt="Imagen ilustrativa de una instalación de gas en una cocina"><span class="photo-label">Instalaciones de gas natural</span></div>'''
    if model == 1:
        return f'<section class="hero hero-one" id="inicio" aria-label="Presentación de Gas Argentina"><div class="hero-shell">{content}{photo}</div></section>'
    return f'<section class="hero hero-two" id="inicio" aria-label="Presentación de Gas Argentina"><div class="wrap hero-copy-wrap">{content}</div>{photo}</section>'

def strip():
    return '''<div class="service-strip" aria-label="Servicios principales"><div class="wrap"><span data-animate>01 <strong>Instalaciones</strong></span><span data-animate>02 <strong>Reconexiones</strong></span><span data-animate>03 <strong>Consulta directa</strong></span></div></div>'''

def services():
    cards = [
        ('01', 'Instalaciones de gas natural', 'Describinos el espacio y qué necesitás instalar. Te ayudamos a definir el alcance de la consulta.', '03_instalaciones_1x1.webp', 'Imagen ilustrativa de una instalación de gas con cañerías y medidor', 'Hola, quiero consultar por una instalación de gas natural.'),
        ('02', 'Trabajos para reconexión', 'Si necesitás recuperar el suministro, contanos qué pasó y qué información te dio la distribuidora. Conversamos los trabajos necesarios sobre la instalación.', '04_reconexiones_1x1.webp', 'Imagen ilustrativa de una revisión de instalación de gas', 'Hola, quiero consultar por trabajos para una reconexión de gas natural.'),
    ]
    markup = ''.join(f'''<article class="service-card"><div class="service-photo" data-animate><img src="images/{img}" width="1200" height="1200" alt="{alt}"></div><div class="service-content" data-animate><span class="service-index">{num} / 02</span><h3>{title}</h3><p>{description}</p><a class="text-link" href="{wa(message)}" target="_blank" rel="noopener noreferrer">Consultar este servicio <span aria-hidden="true">↗</span></a></div></article>''' for num,title,description,img,alt,message in cards)
    return f'''<section class="section services" id="servicios" aria-labelledby="services-title"><div class="wrap"><div class="section-head" data-animate><p class="eyebrow">QUÉ HACEMOS</p><h2 id="services-title">Tu instalación, <em>paso a paso.</em></h2><p>Dos motivos frecuentes para escribirnos. Contanos el tuyo.</p></div><div class="service-list">{markup}</div></div></section>'''

def process():
    steps = [
        ('01', 'Contanos el caso', 'Mandanos una descripción breve y, si tenés, fotos de la instalación.'),
        ('02', 'Revisamos el alcance', 'Con esa información conversamos qué intervención necesitás y qué datos faltan.'),
        ('03', 'Definimos los próximos pasos', 'Coordinamos por WhatsApp cómo avanzar con tu consulta.'),
    ]
    rows = ''.join(f'<li data-animate><span>{num}</span><div><h3>{title}</h3><p>{description}</p></div></li>' for num,title,description in steps)
    return f'''<section class="section process" id="proceso" aria-labelledby="process-title"><div class="wrap process-layout"><div class="process-intro" data-animate><p class="eyebrow">CÓMO EMPEZAMOS</p><h2 id="process-title">Primero, <em>hablemos.</em></h2><p>Una buena consulta empieza con los datos de tu caso. Así podemos responderte de manera más clara.</p></div><ol class="process-steps">{rows}</ol></div></section>'''

def gallery():
    items = [
        ('01_vertical_9x16.webp', 'Trabajo sobre medidor y cañerías', 'Técnico junto a un medidor de gas natural', '900', '1600'),
        ('05_calderas_1x1.webp', 'Revisión de equipo a gas', 'Técnico examinando el interior de un equipo a gas', '1200', '1200'),
        ('06_herramientas_1x1.webp', 'Herramientas para instalaciones', 'Herramientas y accesorios para instalaciones de gas', '1200', '1200'),
    ]
    cards = ''.join(f'''<figure class="gallery-item" data-animate><div class="gallery-photo"><img src="images/{img}" width="{w}" height="{h}" alt="{alt}"></div><figcaption><strong>{title}</strong><span>Imagen ilustrativa</span></figcaption></figure>''' for img,title,alt,w,h in items)
    return f'''<section class="section gallery" id="imagenes" aria-labelledby="gallery-title"><div class="wrap"><div class="section-head" data-animate><p class="eyebrow">EL OFICIO EN IMÁGENES</p><h2 id="gallery-title">Cada conexión <em>requiere atención.</em></h2><p>Estas imágenes son ilustrativas del tipo de tareas y herramientas del rubro; no representan obras realizadas por Gas Argentina.</p></div><div class="gallery-grid">{cards}</div></div></section>'''

def contact():
    return f'''<section class="section contact" id="contacto" aria-labelledby="contact-title"><div class="wrap contact-layout"><div data-animate><p class="eyebrow">CONTACTO DIRECTO</p><h2 id="contact-title">Hablemos de tu <em>instalación.</em></h2><p>Escribinos y contanos si se trata de una instalación nueva o de una reconexión. Te respondemos por WhatsApp.</p><a class="contact-phone" href="{wa('Hola, quiero consultar por un trabajo de gas natural.') }" target="_blank" rel="noopener noreferrer">{DISPLAY_PHONE} <span aria-hidden="true">↗</span></a><a class="contact-instagram" href="{INSTAGRAM}" target="_blank" rel="noopener noreferrer">Instagram de Gas Argentina ↗</a></div><div class="contact-visual" data-animate><img src="{VERTICAL}" width="900" height="1600" alt="Imagen ilustrativa de un técnico trabajando en una instalación de gas"><span>Instalaciones y reconexiones<br>de gas natural.</span></div></div></section>'''

def footer():
    return f'''<footer class="site-footer"><div class="wrap footer-main"><div data-animate>{brand('#inicio')}<p>Instalaciones y trabajos para reconexiones de gas natural.</p></div><nav aria-label="Enlaces del pie" data-animate><a href="#servicios">Servicios</a><a href="#proceso">Cómo trabajamos</a><a href="#imagenes">Imágenes</a><a href="#contacto">Contacto</a></nav><div data-animate><a href="{wa('Hola, quiero consultar por un trabajo de gas natural.') }" target="_blank" rel="noopener noreferrer">{DISPLAY_PHONE}</a><a href="{INSTAGRAM}" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></div><div class="wrap footer-bottom" data-animate><span>© 2026 Gas Argentina</span><a href="https://gokywebs.com/" target="_blank" rel="noopener noreferrer">Diseño web por Gokywebs</a></div></footer>'''

WHATSAPP_ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>'

def page(model):
    name = 'index.html' if model == 1 else 'modelo-2.html'
    sections = services() + process() if model == 1 else process() + services()
    body = head(name) + f'<body class="model-{model}">' + modelbar(model) + header(model)
    body += '<main>' + hero(model) + strip() + sections + gallery() + contact() + '</main>' + footer()
    body += f'<a class="wsp-float" id="wsp-float" href="{wa("Hola, quiero consultar por un trabajo de gas natural.")}" target="_blank" rel="noopener noreferrer" aria-label="Escribir a Gas Argentina por WhatsApp">{WHATSAPP_ICON}</a>'
    body += '<script src="script.js?v=1" defer></script><script src="/demo/track.js" defer></script></body></html>'
    (ROOT / name).write_text(body, encoding='utf-8')

for model in (1, 2):
    page(model)
