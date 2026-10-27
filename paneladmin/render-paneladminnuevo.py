from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent
source = Path(r"C:\Users\pablo\Downloads\paneladminnuevo.mp4")
audio = root / "narracion-paneladminnuevo-valentina.wav"
output = root / "panel-admin-nuevo-valentina-voz-1.25x.mp4"

args = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "warning", "-i", str(source)]
for seconds, name in [
    (4, "freeze-resumen.png"),
    (1, "freeze-categorias.png"),
    (2, "freeze-productos.png"),
    (6, "pedido-insert.png"),
]:
    args += ["-loop", "1", "-framerate", "30", "-t", str(seconds), "-i", str(root / name)]
args += ["-i", str(audio)]

filters = [
    "[0:v]split=4[s0][s1][s2][s3]",
    "[s0]trim=start=0:end=6,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v0]",
    "[1:v]scale=1914:866,trim=duration=4,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v1]",
    "[s1]trim=start=6:end=14,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v2]",
    "[2:v]scale=1914:866,trim=duration=1,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v3]",
    "[s2]trim=start=14:end=66,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v4]",
    "[3:v]scale=1914:866,trim=duration=2,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v5]",
    "[4:v]scale=1914:866,trim=duration=6,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v6]",
    "[s3]trim=start=69,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p[v7]",
]
redactions = [
    "drawbox=x=55:y=18:w=245:h=42:color=white:t=fill",
    "drawbox=x=372:y=80:w=270:h=35:color=0xf8f1f3:t=fill",
    "drawbox=x=410:y=575:w=220:h=43:color=white:t=fill:enable='between(t,156.4,158.3)'",
    "drawbox=x=410:y=450:w=220:h=43:color=white:t=fill:enable='between(t,158.2,158.9)'",
    "drawbox=x=410:y=360:w=220:h=43:color=white:t=fill:enable='between(t,158.8,162.3)'",
    "drawbox=x=410:y=575:w=220:h=43:color=white:t=fill:enable='between(t,162.2,163.3)'",
    "drawbox=x=410:y=540:w=440:h=43:color=white:t=fill:enable='between(t,168.2,171.0)'",
    "drawbox=x=410:y=226:w=440:h=43:color=white:t=fill:enable='between(t,170.8,175.0)'",
]
filters += [
    "[v0][v1][v2][v3][v4][v5][v6][v7]concat=n=8:v=1:a=0," + ",".join(redactions) + "[v]",
    "[5:a]aresample=48000,pan=stereo|c0=c0|c1=c0[a]",
]
args += [
    "-filter_complex", ";".join(filters),
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
    "-movflags", "+faststart", "-shortest", str(output),
]
subprocess.run(args, check=True)
print(output)
