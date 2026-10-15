"""Genera las dos propuestas de la demo de fumigación."""
from pathlib import Path
from urllib.parse import quote
from PIL import Image
import json

ROOT = Path(__file__).parent
IMAGES = ROOT / 'images'
BASE = 'https://gokywebs.com/demo/fumigacionmonigramajo/'
PHONE = '5491125148369'
DISPLAY = '+54 9 11 2514-8369'
HORIZONTAL = 'images/02_fumigacion_interiores_16x9.webp'
VERTICAL = 'images/01_fumigacion_exterior_9x16.webp'

for source in IMAGES.glob('*.jpg'):
    destination = source.with_suffix('.webp')
    with Image.open(source) as image:
        image.convert('RGB').save(destination, 'WEBP', quality=82, method=6)


def wa(message):
    return f'https://wa.me/{PHONE}?text={quote(message)}'


def head(filename):
    title = 'Fumigación · Consultas con Moni Gramajo'
    description = 'Servicio de fumigación. Contanos qué sucede en tu espacio y consultá por WhatsApp para conocer las opciones y la zona de atención.'
    canonical = BASE if filename == 'index.html' else BASE + filename
    schema = json.dumps({
        '@context': 'https://schema.org', '@type': 'LocalBusiness',
        'name': 'Fumigación — Moni Gramajo', 'description': description,
        'url': BASE, 'telephone': DISPLAY,
    }, ensure_ascii=False, separators=(',', ':'))
    return f'''<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#153d3b"><title>{title}</title><meta name="description" content="{description}"><link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{description}"><meta property="og:image" content="{BASE}{HORIZONTAL}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=1"><noscript><style>[data-animate]{{opacity:1!important;transform:none!important}}</style></noscript><script type="application/ld+json">{schema}</script></head>'''


def modelbar(model):
    one = ' aria-current="page"' if model == 1 else ''
    two = ' aria-current="page"' if model == 2 else ''
    return f'<nav class="gw-modelos" aria-label="Modelos de la web"><a class="gw-modelos__btn" href="./"{one}>Modelo 1</a><a class="gw-modelos__btn" href="modelo-2.html"{two}>Modelo 2</a></nav>'


def brand(home):
    return f'<a class="brand" href="{home}" aria-label="Fumigación, inicio"><span class="brand-mark" aria-hidden="true">F</span><span class="brand-type">FUMIGACIÓN<small>CONSULTAS · MONI GRAMAJO</small></span></a>'


def header(model):
    home = './' if model == 1 else 'modelo-2.html'
    return f'''<header class="site-header"><div class="wrap header-inner">{brand(home)}<nav class="main-nav" id="main-nav" aria-label="Navegación principal"><a href="#inicio">Inicio</a><a href="#consultas">Qué podés consultar</a><a href="#proceso">Cómo empezamos</a><a href="#contacto">Contacto</a></nav><a class="header-cta" href="{wa('Hola, quiero consultar por un servicio de fumigación.')}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span></button></div></header>'''


def hero(model):
    copy = f'''<div class="hero-copy"><span class="eyebrow">SERVICIO DE FUMIGACIÓN · CONSULTA DIRECTA</span><h1>Fumigación para <em>cuidar tus espacios.</em></h1><p>Contanos qué está pasando y dónde. Te ayudamos a dar el primer paso con una consulta clara por WhatsApp.</p><div class="hero-actions"><a class="button button-primary" href="{wa('Hola, quiero consultar por un servicio de fumigación.')}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <span aria-hidden="true">↗</span></a><a class="text-link" href="#consultas">Ver qué podés consultar <span aria-hidden="true">↓</span></a></div></div>'''
    media = f'''<div class="hero-media"><img src="{HORIZONTAL}" width="1600" height="900" fetchpriority="high" alt="Imagen ilustrativa de una persona realizando tareas de fumigación en un interior"><span class="media-label">IMAGEN ILUSTRATIVA</span></div>'''
    if model == 1:
        inset = f'<div class="hero-inset" aria-hidden="true"><img src="{VERTICAL}" width="900" height="1600" alt=""></div>'
        return f'<section class="hero hero-one" id="inicio"><div class="hero-shell">{copy}{media}{inset}</div></section>'
    return f'<section class="hero hero-two" id="inicio"><div class="wrap hero-center">{copy}</div>{media}</section>'


def situations():
    items = [
        ('01', 'Hormigas', 'Si las ves aparecer con frecuencia, contanos dónde y desde cuándo.', '03_hormigas_1x1.webp', 'Hormigas sobre el piso'),
        ('02', 'Roedores', 'Si detectaste señales o actividad, describinos el espacio para evaluar el caso.', '04_roedores_1x1.webp', 'Roedor asomándose en una pared'),
        ('03', 'Cucarachas', 'Contanos en qué sector aparecen y qué observaste hasta ahora.', '05_cucarachas_1x1.webp', 'Cucaracha sobre una superficie'),
        ('04', 'Espacios exteriores', 'Consultanos por situaciones en patios, jardines u otros espacios abiertos.', '06_fumigacion_jardines_1x1.webp', 'Aplicación ilustrativa en un espacio exterior'),
    ]
    cards = ''.join(f'''<article class="situation-card" data-animate><a class="situation-photo" href="{wa('Hola, quiero consultar por ' + title.lower() + ' y saber si pueden evaluar mi caso.')}" target="_blank" rel="noopener noreferrer" aria-label="Consultar por {title.lower()}"><img src="images/{photo}" width="960" height="960" loading="lazy" alt="{alt}"></a><div class="situation-body"><span>{num} / 04</span><h3>{title}</h3><p>{copy}</p><a class="text-link" href="{wa('Hola, quiero consultar por ' + title.lower() + ' y saber si pueden evaluar mi caso.')}" target="_blank" rel="noopener noreferrer">Consultar este caso ↗</a></div></article>''' for num, title, copy, photo, alt in items)
    return f'''<section class="section situations" id="consultas" aria-labelledby="situations-title"><div class="wrap"><div class="section-head" data-animate><div><span class="eyebrow">CADA CASO ES DISTINTO</span><h2 id="situations-title">¿Qué situación <em>querés consultar?</em></h2></div><p>Estas son situaciones frecuentes para iniciar una consulta. Contanos la tuya y confirmamos si podemos ayudarte.</p></div><div class="situation-grid">{cards}</div><p class="photo-note">Imágenes ilustrativas. La disponibilidad de tratamientos y la zona de atención se confirman por WhatsApp.</p></div></section>'''


def process():
    steps = [
        ('01', 'Contanos qué pasa', 'Escribinos qué observaste y en qué tipo de espacio ocurre.'),
        ('02', 'Compartí los detalles', 'Si tenés fotos o información útil, podés enviarlas en la conversación.'),
        ('03', 'Acordamos cómo seguir', 'Te respondemos para definir si podemos tomar el caso y cuál sería el siguiente paso.'),
    ]
    rows = ''.join(f'<li data-animate><span>{num}</span><div><h3>{title}</h3><p>{copy}</p></div></li>' for num, title, copy in steps)
    return f'''<section class="section process" id="proceso" aria-labelledby="process-title"><div class="wrap process-layout"><div class="process-intro" data-animate><span class="eyebrow">UN PRIMER PASO SENCILLO</span><h2 id="process-title">Empecemos por <em>entender tu caso.</em></h2><p>Con una descripción breve podemos orientarte mejor sobre la consulta. No hace falta que tengas todo resuelto antes de escribir.</p><a class="text-link" href="{wa('Hola, quiero contarles mi caso para consultar por fumigación.')}" target="_blank" rel="noopener noreferrer">Iniciar una consulta ↗</a></div><ol class="process-steps">{rows}</ol></div></section>'''


def visual():
    return f'''<section class="visual-section" aria-labelledby="visual-title"><div class="visual-photo" data-animate><img src="{VERTICAL}" width="900" height="1600" loading="lazy" alt="Imagen ilustrativa de una persona realizando tareas de fumigación en el exterior"><span>IMAGEN ILUSTRATIVA</span></div><div class="visual-copy" data-animate><span class="eyebrow">FUMIGACIÓN · CONSULTAS</span><h2 id="visual-title">Tu espacio, <em>tu situación.</em></h2><p>Cada consulta empieza con lo que está pasando en tu lugar. Escribinos para conocer opciones de atención y confirmar si el servicio está disponible en tu zona.</p><a class="button button-light" href="{wa('Hola, quiero consultar si atienden mi zona por un servicio de fumigación.')}" target="_blank" rel="noopener noreferrer">Consultar cobertura ↗</a></div></section>'''


def contact():
    return f'''<section class="section contact" id="contacto" aria-labelledby="contact-title"><div class="wrap contact-layout"><div class="contact-copy" data-animate><span class="eyebrow">HABLEMOS DE TU CASO</span><h2 id="contact-title">Contanos qué <em>necesitás.</em></h2><p>Dejá los datos de tu consulta y se abrirá un mensaje preparado para enviar por WhatsApp. También podés escribirnos directamente.</p><a class="phone-link" href="{wa('Hola, quiero consultar por fumigación.')}" target="_blank" rel="noopener noreferrer">{DISPLAY} <span aria-hidden="true">↗</span></a><p class="contact-small">Consultá la zona de atención y la disponibilidad antes de coordinar.</p></div><form class="contact-form" data-contact-form data-animate><label for="name">Tu nombre</label><input id="name" name="name" type="text" autocomplete="name" placeholder="¿Cómo te llamás?" required maxlength="70"><label for="topic">¿Qué querés consultar?</label><select id="topic" name="topic" required><option value="">Seleccioná una opción</option><option>Hormigas</option><option>Roedores</option><option>Cucarachas</option><option>Espacios exteriores</option><option>Otra situación</option></select><label for="details">Contanos un poco más</label><textarea id="details" name="details" rows="4" placeholder="Qué observaste y en qué zona estás" maxlength="500" required></textarea><button class="button button-primary" type="submit">Preparar consulta por WhatsApp ↗</button><p>La consulta se envía desde tu WhatsApp. Este formulario no guarda tus datos.</p></form></div></section>'''


def footer():
    return f'''<footer class="site-footer"><div class="wrap footer-main"><div>{brand('#inicio')}<p>Servicio de fumigación. Consultas por WhatsApp para evaluar cada caso.</p></div><nav aria-label="Enlaces del pie"><a href="#consultas">Qué podés consultar</a><a href="#proceso">Cómo empezamos</a><a href="#contacto">Contacto</a></nav><div><a href="{wa('Hola, quiero consultar por fumigación.')}" target="_blank" rel="noopener noreferrer">{DISPLAY} ↗</a><span>Zona de atención: consultanos</span></div></div><div class="wrap footer-bottom"><span>© 2026 Fumigación · Moni Gramajo</span><span>Diseño web por <a href="https://gokywebs.com/" target="_blank" rel="noopener noreferrer">Gokywebs</a></span></div></footer>'''


WA_ICON = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 1A15 15 0 0 0 3.1 23.6L1 31l7.6-2A15 15 0 1 0 16 1Zm0 27.2c-2.3 0-4.5-.6-6.5-1.8l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.2 12.2 0 1 1 16 28.2Zm6.7-9.2c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.4 1.4-.2.2-.4.3-.8.1-.4-.2-1.5-.6-2.9-1.8-1.1-1-1.8-2.1-2-2.5-.2-.4 0-.6.2-.8l.6-.6c.2-.2.2-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.8-2-1.2-2.8-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.6 1.5 3.8c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.2.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.3-.7-.5Z"/></svg>'


def page(model):
    filename = 'index.html' if model == 1 else 'modelo-2.html'
    sections = situations() + process() if model == 1 else process() + situations()
    html = head(filename) + f'<body class="model-{model}">' + modelbar(model) + header(model)
    html += '<main>' + hero(model) + sections + visual() + contact() + '</main>' + footer()
    html += f'<a class="wsp-float" href="{wa("Hola, quiero consultar por fumigación.")}" target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp">{WA_ICON}</a>'
    html += '<script src="script.js?v=1" defer></script><script src="/demo/track.js" defer></script></body></html>'
    (ROOT / filename).write_text(html, encoding='utf-8')


for number in (1, 2):
    page(number)
