"""Genera imágenes livianas y productos ilustrativos para la demo."""
from pathlib import Path
from PIL import Image
import json
import re
import unicodedata

ROOT = Path(__file__).parent
IMAGES = ROOT / 'images'

for original in IMAGES.glob('*.png'):
    if original.name.startswith('07_'):
        continue
    target = original.with_suffix('.webp')
    with Image.open(original) as source:
        source.convert('RGB').save(target, 'WEBP', quality=82, method=6)

GROUPS = {
    'tratamientos': (
        '03_tratamientos_1x1.webp',
        [('Shampoo nutritivo 500 ml', 7800), ('Acondicionador nutritivo 500 ml', 8200),
         ('Máscara capilar hidratante 250 g', 10500), ('Shampoo de uso diario 1 L', 11200),
         ('Acondicionador de uso diario 1 L', 11900), ('Baño de crema 500 g', 13600),
         ('Ampollas de tratamiento capilar', 9200), ('Crema de peinar 300 ml', 8900)],
    ),
    'styling': (
        '04_styling_1x1.webp',
        [('Spray de fijación 300 ml', 6900), ('Mousse para peinar 250 ml', 7400),
         ('Protector térmico 200 ml', 9700), ('Serum de brillo 60 ml', 11500),
         ('Gel de peinado 250 g', 5900), ('Cera de modelado 100 g', 7900),
         ('Cepillo de peinado', 8600), ('Peine profesional de corte', 4800)],
    ),
    'coloracion': (
        '05_coloracion_1x1.webp',
        [('Tintura permanente tono natural', 8900), ('Tintura permanente tono cobrizo', 8900),
         ('Polvo decolorante 250 g', 13900), ('Oxidante en crema 20 vol 1 L', 12200),
         ('Oxidante en crema 30 vol 1 L', 12200), ('Matizador violeta 250 ml', 10800),
         ('Kit de pincel y bowl', 7700), ('Guantes para coloración x 10 pares', 6300)],
    ),
    'oleos': (
        '06_oleos_1x1.webp',
        [('Óleo capilar 60 ml', 12500), ('Aceite para puntas 50 ml', 9900),
         ('Máscara capilar reparadora 300 g', 12800), ('Tratamiento en crema 500 g', 15200),
         ('Sérum capilar 30 ml', 10900), ('Óleo nutritivo 100 ml', 16800),
         ('Mascarilla de hidratación 250 g', 13400), ('Aceite capilar de brillo 60 ml', 11900)],
    ),
}

def slug(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', '-', value).strip('-')

rows = []
index = 0
for position in range(8):
    for category, (image, products) in GROUPS.items():
        name, price = products[position]
        index += 1
        rows.append({
            'id': f'{slug(name)}-{index:02d}',
            'name': name,
            'category': category,
            'description': f'{name}. Producto ilustrativo para mostrar el catálogo de Tinta Morena. Consultá marca, presentación, disponibilidad y precio final antes de confirmar el pedido.',
            'price': price,
            'image': image,
            'visible': index != 32,
        })

for filename, data in [
    ('productos.jsonl', rows),
    ('productos-precio-asc.jsonl', sorted(rows, key=lambda x: (x['price'], x['id']))),
    ('productos-precio-desc.jsonl', sorted(rows, key=lambda x: (-x['price'], x['id']))),
]:
    (ROOT / filename).write_text(''.join(json.dumps(row, ensure_ascii=False, separators=(',', ':')) + '\n' for row in data), encoding='utf-8')
