from pathlib import Path
import cv2

root = Path(__file__).resolve().parent
frame_dir = root / ".privacy-frames"
refs = {
    "email": (root / "snap-135.jpg", (370, 85, 590, 107), (350, 0, 700, 140), 0, 177),
    "phone": (root / "privacy-ref-151.jpg", (415, 366, 555, 391), (390, 150, 970, 700), 146, 154),
    "url": (root / "privacy-ref-163.jpg", (415, 231, 840, 261), (390, 0, 1000, 700), 158, 169),
}
templates = {}
for label, (path, box, roi, start, end) in refs.items():
    image = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    x1, y1, x2, y2 = box
    templates[label] = image[y1:y2, x1:x2]

results = {label: [] for label in refs}
for index, path in enumerate(sorted(frame_dir.glob("f-*.jpg"))):
    t = index / 2
    frame = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    for label, (_, box, roi, start, end) in refs.items():
        if not start <= t <= end:
            continue
        a, b, c, d = roi
        scores = cv2.matchTemplate(frame[b:d, a:c], templates[label], cv2.TM_CCOEFF_NORMED)
        _, score, _, loc = cv2.minMaxLoc(scores)
        if score > .84:
            results[label].append((t, a + loc[0], b + loc[1], round(score, 2)))

for label, rows in results.items():
    print(label, len(rows))
    print(rows[:30])
    print(rows[-30:])
