import asyncio
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent
sys.path.insert(0, str(root / ".tts-deps"))
import edge_tts

segments = json.loads((root / "guion-paneladminnuevo.json").read_text(encoding="utf-8"))
out = root / "voz-paneladminnuevo-segmentos"
out.mkdir(exist_ok=True)
sem = asyncio.Semaphore(3)

async def render(index, text):
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(
                    text, "es-UY-ValentinaNeural", rate="-20%", pitch="-2Hz"
                ).save(str(out / f"segment-{index:02}.mp3"))
                print(index, flush=True)
                return
            except Exception:
                if attempt == 2:
                    raise
                await asyncio.sleep(2 + 2 * attempt)

async def main():
    await asyncio.gather(*(render(i, x["text"]) for i, x in enumerate(segments)))

asyncio.run(main())
