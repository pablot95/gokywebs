"""Capturas en alta del portfolio: previews/hd/<id>.webp (1920 px de ancho).

El visor muestra la web elegida a pantalla completa en la compu: las
capturas de previews/ (960 px) quedan para el celular y se agrandaban
borrosas. Estas se sacan con la ventana de 1440 px (la web en su versión
de escritorio) y densidad 1.333, o sea 1920 px reales.

    python portfolio/capturar-hd.py              # solo las que faltan
    python portfolio/capturar-hd.py sparrow kare # esas, aunque existan
    python portfolio/capturar-hd.py --lento x    # más espera (animaciones pesadas)

Receta: reveals acelerados, un barrido rápido para disparar lazy y
observers, y después una foto por pantalla pegadas en orden (el header y
los flotantes se ocultan después de la primera).
"""
import base64
import io
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import tempfile
import time

import requests
import websocket
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(AQUI, 'previews', 'hd')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
PUERTO = 9377
ANCHO, ALTO_VENTANA, DPR = 1440, 900, 4 / 3
LENTO = '--lento' in sys.argv     # webs con animaciones pesadas: más espera por pantalla
TOPE_ALTO = 5200          # px CSS; Chrome falla arriba de ~16k px reales
CALIDAD = 82
# Webs que hoy no muestran lo que entregamos (en mantenimiento, etc.): se
# quedan con la captura de 960 que ya está en previews/. Revisar cada tanto.
SIN_HD = set()   # p. ej. {'segeym'} si una web está en mantenimiento

FORZAR = """
(() => {
  let s = document.getElementById('__gv_forzar');
  if (!s) { s = document.createElement('style'); s.id = '__gv_forzar'; document.head.appendChild(s); }
  s.textContent = `*,*::before,*::after{animation-duration:.001s!important;animation-delay:0s!important;transition-duration:.001s!important;transition-delay:0s!important}
  [data-animate],[data-aos],.reveal,.fade-in,.fade-up,.animate-on-scroll,.is-hidden,.aos-init,.wow,[data-reveal],[data-scroll]{opacity:1!important;transform:none!important;visibility:visible!important;clip-path:none!important}`;
  document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
  document.querySelectorAll('img[data-src]').forEach(i => { if (!i.src || i.src.startsWith('data:')) i.src = i.dataset.src; });
})();
"""


def trabajos():
    txt = open(os.path.join(AQUI, 'data.js'), encoding='utf-8').read()
    return re.findall(r"id: '([^']+)'[^\n]*?url: '([^']+)'", txt)


def puerto_libre(p):
    with socket.socket() as s:
        return s.connect_ex(('127.0.0.1', p)) != 0


class CDP:
    def __init__(self, ws_url):
        self.ws = websocket.create_connection(ws_url, timeout=180, suppress_origin=True)
        self.n = 0

    def __call__(self, metodo, **params):
        self.n += 1
        mid = self.n
        self.ws.send(json.dumps({'id': mid, 'method': metodo, 'params': params}))
        while True:
            m = json.loads(self.ws.recv())
            if m.get('id') == mid:
                if 'error' in m:
                    raise RuntimeError(m['error'])
                return m.get('result', {})

    def js(self, expr):
        r = self('Runtime.evaluate', expression=expr, returnByValue=True, awaitPromise=True)
        return r.get('result', {}).get('value')


OCULTAR_FIJOS = """
(() => {
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') { el.style.setProperty('opacity', '0', 'important'); continue; }
    if (cs.position === 'sticky') {
      const r = el.getBoundingClientRect();
      if (r.top <= 4 && r.height < 180) el.style.setProperty('opacity', '0', 'important');
    }
  }
})();
"""


def foto(cdp):
    r = cdp('Page.captureScreenshot', format='png')
    return Image.open(io.BytesIO(base64.b64decode(r['data']))).convert('RGB')


def capturar(cdp, url):
    """Recorre la web como una persona: una foto por pantalla, pegadas una
    abajo de la otra. La captura larga de Chrome (captureBeyondViewport)
    dejaba en blanco las escenas animadas y sticky; así sale lo que se ve."""
    cdp('Emulation.setDeviceMetricsOverride', width=ANCHO, height=ALTO_VENTANA, deviceScaleFactor=DPR, mobile=False)
    cdp('Page.navigate', url=url)
    time.sleep(9 if LENTO else 5)
    cdp.js("document.documentElement.style.scrollBehavior='auto'")
    cdp.js(FORZAR)
    alto = cdp.js('Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)') or ALTO_VENTANA
    y = 0
    while y < min(alto, TOPE_ALTO + 900):          # dispara lazy y observers
        cdp.js(f'window.scrollTo(0,{y})')
        time.sleep(0.08)
        y += 600
    cdp.js('window.scrollTo(0,0)')
    time.sleep(1.2)
    alto = cdp.js('Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)') or ALTO_VENTANA
    alto = int(min(alto, TOPE_ALTO))
    lienzo = Image.new('RGB', (round(ANCHO * DPR), round(alto * DPR)), 'white')
    y, primera = 0, True
    while True:
        cdp.js(f'window.scrollTo(0,{y})')
        time.sleep(1.6 if LENTO else 0.5)
        if not primera:
            # El header y el botón de WhatsApp salen solo en la primera foto.
            # Se revisa en cada una: muchos headers se vuelven fijos al scrollear.
            cdp.js(OCULTAR_FIJOS)
            time.sleep(0.05)
        real = cdp.js('window.scrollY') or 0
        tile = foto(cdp)
        lienzo.paste(tile, (0, round(real * DPR)))
        primera = False
        if real + ALTO_VENTANA >= alto or real < y - 2:
            break
        y += ALTO_VENTANA
    img = lienzo
    if img.width != 1920:
        img = img.resize((1920, round(img.height * 1920 / img.width)), Image.LANCZOS)
    return img


def main():
    os.makedirs(SALIDA, exist_ok=True)
    pedidos = set(a for a in sys.argv[1:] if not a.startswith('--'))
    lista = [(i, u) for i, u in trabajos() if (i in pedidos if pedidos else
             i not in SIN_HD and not os.path.exists(os.path.join(SALIDA, i + '.webp')))]
    print(len(lista), 'para capturar', flush=True)
    if not lista:
        return
    if not puerto_libre(PUERTO):
        sys.exit(f'El puerto {PUERTO} está ocupado (¿Chrome zombie?). Matalo antes de seguir.')
    perfil = tempfile.mkdtemp(prefix='cdp-portfolio-hd-')
    proc = subprocess.Popen([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
                             f'--remote-debugging-port={PUERTO}', '--remote-allow-origins=*',
                             f'--user-data-dir={perfil}', 'about:blank'],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(40):
            try:
                pags = requests.get(f'http://127.0.0.1:{PUERTO}/json', timeout=2).json()
                if pags:
                    break
            except Exception:
                pass
            time.sleep(0.5)
        ws = [p for p in pags if p.get('type') == 'page'][0]['webSocketDebuggerUrl']
        cdp = CDP(ws)
        cdp('Page.enable')
        mal = []
        for n, (wid, url) in enumerate(lista, 1):
            t0 = time.time()
            try:
                img = capturar(cdp, url)
                out = os.path.join(SALIDA, wid + '.webp')
                img.save(out, 'WEBP', quality=CALIDAD, method=5)
                print(f'{n}/{len(lista)} {wid} {img.size[1]}px {os.path.getsize(out)//1024}KB {time.time()-t0:.0f}s', flush=True)
            except Exception as e:
                mal.append(wid)
                print(f'{n}/{len(lista)} {wid} FALLÓ: {e}', flush=True)
        if mal:
            print('Fallaron:', ' '.join(mal), flush=True)
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()
        shutil.rmtree(perfil, ignore_errors=True)


if __name__ == '__main__':
    main()
