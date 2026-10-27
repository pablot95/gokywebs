from pathlib import Path
import json
import subprocess
import wave

import numpy as np

root = Path(__file__).resolve().parent
old_video = root / "panel-admin-nuevo-valentina-voz-1.25x.mp4"
old_audio = root / "narracion-paneladminnuevo-valentina.wav"
new_audio = root / "narracion-paneladminnuevo-sincronizada.wav"
new_video = root / "panel-admin-nuevo-valentina-sincronizado-10porciento-mas-rapido.mp4"
sections = json.loads((root / "guion-paneladminnuevo.json").read_text(encoding="utf-8"))

# Fragmentos de la narración original y entrada corregida según las pantallas.
original = [
    (.08, 2.91), (3, 7.74), (8, 11.25), (11.35, 18.92),
    (19, 32.56), (34, 40.11), (40.5, 46.68), (47, 54.4),
    (55, 59.38), (60, 65.74), (66, 71.3), (73, 77.03),
    (79, 81.94), (83, 90.45), (93, 98.53), (99.87, 105.92),
    (106, 109.48), (111, 120.57), (125.7, 133.92), (134, 141.22),
    (146, 152.55), (155, 160.71), (162, 171.95), (177.65, 180.92),
    (181, 185.9),
]
corrected = [
    .08, 3, 8, 11.55, 19.6, 35, 41.3, 47.55, 55.15, 60, 66.5,
    73.55, 79.5, 85.35, 94, 101.7, 108.1, 112, 125.7, 134,
    147.5, 156.2, 163.7, 177.2, 180.1,
]
assert len(sections) == len(original) == len(corrected)

with wave.open(str(old_audio), "rb") as src:
    assert src.getnchannels() == 1 and src.getsampwidth() == 2 and src.getframerate() == 48000
    samples = np.frombuffer(src.readframes(src.getnframes()), dtype="<i2").astype(np.float32)

rate = 48000
track = np.zeros_like(samples)
last_end = 0
for index, ((old_start, old_end), new_start) in enumerate(zip(original, corrected)):
    # Dejar 20 ms alrededor de cada frase protege las consonantes iniciales y finales.
    fragment = samples[round((old_start - .02) * rate):round((old_end + .02) * rate)].copy()
    if index == 23:  # Avisos: cabe completo antes de pasar a Carritos abandonados.
        fragment = np.frombuffer(subprocess.check_output([
            "ffmpeg", "-v", "error", "-f", "s16le", "-ar", "48000", "-ac", "1", "-i", "-",
            "-af", "atempo=1.15", "-f", "s16le", "-ar", "48000", "-ac", "1", "-",
        ], input=np.clip(fragment, -32768, 32767).astype("<i2").tobytes()), dtype="<i2").astype(np.float32)
    begin = round(new_start * rate)
    end = begin + len(fragment)
    if begin < last_end + round(.025 * rate):
        raise RuntimeError(f"Se superponen las frases {index - 1} y {index}")
    if end > len(track):
        raise RuntimeError(f"La frase {index} excede el video")
    fade = round(.015 * rate)
    fragment[:fade] *= np.linspace(0, 1, fade)
    fragment[-fade:] *= np.linspace(1, 0, fade)
    track[begin:end] += fragment
    last_end = end
    print(f"{index:02} {new_start:6.2f}-{end/rate:6.2f} {sections[index]['section']}")

with wave.open(str(new_audio), "wb") as dst:
    dst.setnchannels(1)
    dst.setsampwidth(2)
    dst.setframerate(rate)
    dst.writeframes(np.clip(track, -32768, 32767).astype("<i2").tobytes())

# La aceleración final se aplica a imagen y voz por igual.
subprocess.run([
    "ffmpeg", "-y", "-hide_banner", "-loglevel", "warning",
    "-i", str(old_video), "-i", str(new_audio),
    "-filter_complex", "[0:v]setpts=PTS/1.1[v];[1:a]atempo=1.1,pan=stereo|c0=c0|c1=c0[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
    "-movflags", "+faststart", "-shortest", str(new_video),
], check=True)
print(new_video)
