import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent
segments = json.loads((root / "guion-paneladminnuevo.json").read_text(encoding="utf-8"))
for i, segment in enumerate(segments):
    path = root / "voz-paneladminnuevo-segmentos" / f"segment-{i:02}.mp3"
    duration = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=nokey=1:noprint_wrappers=1", str(path)
    ], text=True).strip()) / 1.25
    slot = segment["end"] - segment["start"]
    print(f"{i:02} {segment['section']:<27} espacio={slot:5.1f} voz={duration:5.1f} diferencia={slot-duration:5.1f}")
