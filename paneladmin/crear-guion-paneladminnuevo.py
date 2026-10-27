import json
from pathlib import Path

root = Path(__file__).resolve().parent
segments = json.loads((root / "guion-paneladminnuevo.json").read_text(encoding="utf-8"))

def timestamp(seconds):
    return f"{int(seconds // 60):02}:{int(seconds % 60):02}"

lines = [
    "# Guion del nuevo panel administrativo",
    "",
    "Narración con Valentina a 1,25×. Los tiempos corresponden al video editado.",
    "",
]
for item in segments:
    lines.extend([
        f"**{timestamp(item['start'])}–{timestamp(item['end'])} · {item['section']}**",
        item["text"],
        "",
    ])
(root / "guion-paneladminnuevo.md").write_text("\n".join(lines), encoding="utf-8")
