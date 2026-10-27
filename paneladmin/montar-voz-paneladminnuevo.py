import json
import subprocess
import wave
from pathlib import Path

import numpy as np

root = Path(__file__).resolve().parent
segments = json.loads((root / "guion-paneladminnuevo.json").read_text(encoding="utf-8"))
rate = 48000
duration = 187.266633
track = np.zeros(round(duration * rate), dtype=np.float32)
placements = []
previous_end = 0.0

for index, segment in enumerate(segments):
    path = root / "voz-paneladminnuevo-segmentos" / f"segment-{index:02}.mp3"
    raw = subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(path),
        "-af", "atempo=1.25", "-f", "s16le", "-ac", "1", "-ar", str(rate), "-",
    ])
    samples = np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768
    voice_duration = len(samples) / rate
    start = float(segment["start"])
    if start + voice_duration > segment["end"] - .08:
        start = float(segment["end"]) - voice_duration - .08
    start = max(start, previous_end + .08)
    finish = start + voice_duration
    if finish > segment["end"] + .1:
        raise RuntimeError(f"Segmento {index} ({segment['section']}) no entra: {finish:.2f} > {segment['end']}")
    begin_sample = round(start * rate)
    end_sample = begin_sample + len(samples)
    fade = min(round(.05 * rate), len(samples) // 4)
    if fade:
        samples[:fade] *= np.linspace(0, 1, fade)
        samples[-fade:] *= np.linspace(1, 0, fade)
    track[begin_sample:end_sample] += samples
    previous_end = finish
    placements.append((index, segment["section"], round(start, 2), round(finish, 2)))

out = root / "narracion-paneladminnuevo-valentina.wav"
with wave.open(str(out), "wb") as dst:
    dst.setnchannels(1)
    dst.setsampwidth(2)
    dst.setframerate(rate)
    dst.writeframes((np.clip(track, -1, 1) * 32767).astype("<i2").tobytes())

for item in placements:
    print(*item)
print(out)
