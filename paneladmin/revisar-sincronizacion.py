from pathlib import Path
import cv2
import numpy as np

root = Path(__file__).resolve().parent
video = cv2.VideoCapture(str(root / "panel-admin-nuevo-valentina-voz-1.25x.mp4"))
for batch, start in enumerate(range(0, 188, 24)):
    frames = []
    for second in range(start, min(start + 24, 188), 2):
        video.set(cv2.CAP_PROP_POS_MSEC, second * 1000)
        ok, frame = video.read()
        if not ok:
            continue
        frame = cv2.resize(frame, (638, 289))
        cv2.rectangle(frame, (0, 0), (110, 32), (255, 255, 255), -1)
        cv2.putText(frame, f"{second}s", (8, 24), cv2.FONT_HERSHEY_SIMPLEX, .75, (0, 0, 0), 2)
        frames.append(frame)
    while len(frames) % 3:
        frames.append(np.zeros_like(frames[0]))
    rows = [np.hstack(frames[i:i+3]) for i in range(0, len(frames), 3)]
    cv2.imwrite(str(root / f"revision-{batch}.jpg"), np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 85])
