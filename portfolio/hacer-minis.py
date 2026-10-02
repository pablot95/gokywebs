"""Arma las miniaturas de la tira del portfolio: previews/mini/<id>.webp.

Toma la parte de arriba de cada captura (previews/<id>.webp, 960 de ancho)
y la deja en 560x350. Solo crea las que faltan; con --todas las rehace.
Si una mini falta, el visor usa la captura entera (anda, pero pesa más).

    python portfolio/hacer-minis.py
"""
import glob
import os
import sys

from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
todas = '--todas' in sys.argv
os.makedirs(os.path.join(AQUI, 'previews', 'mini'), exist_ok=True)

hechas = 0
for f in sorted(glob.glob(os.path.join(AQUI, 'previews', '*.webp'))):
    out = os.path.join(AQUI, 'previews', 'mini', os.path.basename(f))
    if os.path.exists(out) and not todas:
        continue
    im = Image.open(f).convert('RGB')
    w, h = im.size
    im = im.crop((0, 0, w, min(h, int(w * 0.625)))).resize((560, 350), Image.LANCZOS)
    im.save(out, 'WEBP', quality=74, method=6)
    hechas += 1
print(hechas, 'miniaturas nuevas')
