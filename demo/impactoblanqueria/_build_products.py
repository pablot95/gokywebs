"""Optimiza las fotos aportadas y genera un catálogo de muestra."""
from pathlib import Path
from PIL import Image
import json
import re
import unicodedata

ROOT = Path(__file__).parent
IMAGES = ROOT / 'images'

for original in IMAGES.glob('*.png'):
    if 'mockup' in original.name.lower():
        continue
    target = original.with_suffix('.webp')
    with Image.open(original) as source:
        source.convert('RGB').save(target, 'WEBP', quality=80, method=6)

GROUPS = {
    'sabanas': ('01_Impacto_sabanas_9x16.webp', [
        ('Juego de sábanas 1½ plazas', 37900), ('Juego de sábanas 2½ plazas', 48900),
        ('Sábana ajustable 1½ plazas', 22900), ('Sábana ajustable 2½ plazas', 29900),
        ('Juego de sábanas para dormitorio', 42900), ('Sábana ajustable para dormitorio', 26900),
    ]),
    'toallas': ('03_Impacto_toallas_1x1.webp', [
        ('Juego de toallón y toalla', 31900), ('Toallón para baño', 21900),
        ('Toalla de mano', 10900), ('Juego de toallas para baño', 27900),
        ('Toallón para uso diario', 24900), ('Set de toalla y toallón', 33900),
    ]),
    'almohadas': ('04_Impacto_almohadones_1x1.webp', [
        ('Almohada viscoelástica', 41900), ('Almohada de vellón siliconado', 25900),
        ('Almohadón 50 × 50 cm', 18900), ('Almohadón 35 × 35 cm', 13900),
        ('Par de almohadones 50 × 50 cm', 34900), ('Par de almohadones 35 × 35 cm', 25900),
    ]),
    'bebes': ('05_Impacto_bebes_1x1.webp', [
        ('Manta para bebé', 23900), ('Toallón para bebé', 19900),
        ('Manta suave para bebé', 25900), ('Toallón de bebé para baño', 21900),
        ('Manta de bebé para la cuna', 28900), ('Set manta y toallón para bebé', 39900),
    ]),
    'mantas': ('06_Impacto_mantas_1x1.webp', [
        ('Manta rústica', 32900), ('Manta Teddy', 38900),
        ('Acolchado para dormitorio', 82900), ('Frazada para dormitorio', 49900),
        ('Manta para el sillón', 35900), ('Acolchado para la cama', 89900),
    ]),
    'banio': ('03_Impacto_toallas_1x1.webp', [
        ('Cortina para baño', 26900), ('Alfombra de baño', 16900),
        ('Alfombra de ambiente', 39900), ('Cortina de baño para renovar el espacio', 29900),
        ('Alfombra para el baño', 18900), ('Alfombra para el ambiente', 43900),
    ]),
}

def slug(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', '-', value).strip('-')

rows = []
index = 0
for position in range(6):
    for category, (image, products) in GROUPS.items():
        name, price = products[position]
        index += 1
        rows.append({
            'id': f'{slug(name)}-{index:02d}',
            'name': name,
            'category': category,
            'description': f'{name}. Referencia de producto para mostrar el catálogo de Impacto Blanquería. Consultá colores, materiales, disponibilidad y precio final antes de confirmar.',
            'price': price,
            'image': image,
            'visible': index != 36,
        })

for filename, data in [
    ('productos.jsonl', rows),
    ('productos-precio-asc.jsonl', sorted(rows, key=lambda x: (x['price'], x['id']))),
    ('productos-precio-desc.jsonl', sorted(rows, key=lambda x: (-x['price'], x['id']))),
]:
    (ROOT / filename).write_text(''.join(json.dumps(row, ensure_ascii=False, separators=(',', ':')) + '\n' for row in data), encoding='utf-8')
