"""Auditoría visual de webs en vivo por CDP: textos que se pisan, texto cortado, desborde, fotos rotas.
uso: python auditar.py <lista.txt> <salida_dir> <puerto>
lista.txt: una línea por web: carpeta<TAB>url
"""
import json, os, subprocess, sys, time, base64, shutil
import requests, websocket

LISTA, SALIDA, PUERTO = sys.argv[1], sys.argv[2], int(sys.argv[3])
TODOS = [(1366, 800, False), (820, 1100, True), (390, 844, True), (1280, 800, False), (1024, 768, False), (360, 780, True)]
ANCHOS = TODOS[:3] if not os.environ.get('ANCHOS') else [a for a in TODOS if str(a[0]) in os.environ['ANCHOS'].split(',')]
os.makedirs(SALIDA, exist_ok=True)

try:
    requests.get(f'http://127.0.0.1:{PUERTO}/json/version', timeout=1)
    sys.exit(f'puerto {PUERTO} ocupado')
except requests.exceptions.RequestException:
    pass

perfil = os.path.abspath(os.path.join(SALIDA, f'perfil-{PUERTO}'))
chrome = subprocess.Popen([r'C:\Program Files\Google\Chrome\Application\chrome.exe', '--headless=new',
    f'--remote-debugging-port={PUERTO}', f'--user-data-dir={perfil}', '--no-first-run', '--hide-scrollbars',
    '--mute-audio', '--disable-extensions', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(150):
    try:
        requests.get(f'http://127.0.0.1:{PUERTO}/json/version', timeout=1); break
    except requests.exceptions.RequestException:
        time.sleep(.2)

tab = [t for t in requests.get(f'http://127.0.0.1:{PUERTO}/json').json() if t['type'] == 'page'][0]
ws = websocket.create_connection(tab['webSocketDebuggerUrl'], suppress_origin=True, timeout=60)
nid = 0
eventos = []
def cdp(metodo, **params):
    global nid
    nid += 1; mi = nid
    ws.send(json.dumps({'id': mi, 'method': metodo, 'params': params}))
    while True:
        m = json.loads(ws.recv())
        if m.get('id') == mi:
            if 'error' in m: raise RuntimeError(f"{metodo}: {m['error']}")
            return m.get('result', {})
        eventos.append(m)

def evaluar(js, espera=True):
    r = cdp('Runtime.evaluate', expression=js, returnByValue=True, awaitPromise=espera, timeout=60000)
    if 'exceptionDetails' in r: return {'error': r['exceptionDetails'].get('exception', {}).get('description', str(r['exceptionDetails']))[:300]}
    return r['result'].get('value')

DETECTOR = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.environ.get('DET','detector.js')), encoding='utf8').read()

cdp('Page.enable'); cdp('Runtime.enable'); cdp('Network.enable'); cdp('Network.setCacheDisabled', cacheDisabled=True)
cdp('Emulation.setEmulatedMedia', features=[{'name': 'prefers-reduced-motion', 'value': 'reduce'}])

resultados = {}
for linea in open(LISTA, encoding='utf8'):
    linea = linea.strip()
    if not linea: continue
    carpeta, url = linea.split('\t')[:2]
    res = {'url': url, 'anchos': {}}
    for ancho, alto, movil in ANCHOS:
        try:
            cdp('Emulation.setDeviceMetricsOverride', width=ancho, height=alto, deviceScaleFactor=1, mobile=movil)
            cdp('Emulation.setTouchEmulationEnabled', enabled=movil)
            eventos.clear()
            cdp('Page.navigate', url=url)
            t0 = time.time()
            while time.time() - t0 < 25:
                if evaluar('document.readyState', False) == 'complete': break
                time.sleep(.5)
            time.sleep(2.5)
            # recorrer la página para disparar lazy-load y reveals
            evaluar('''(async()=>{const h=()=>document.documentElement.scrollHeight;for(let y=0;y<h()&&y<40000;y+=innerHeight*.7){scrollTo(0,y);await new Promise(r=>setTimeout(r,160));}scrollTo(0,0);await new Promise(r=>setTimeout(r,900));})()''')
            r = evaluar(DETECTOR)
            r['final'] = evaluar('location.href', False)
            errores = [e['params']['exceptionDetails'].get('exception', {}).get('description', '')[:160] for e in eventos if e.get('method') == 'Runtime.exceptionThrown']
            r['js'] = errores[:5]
            if os.environ.get('DET'): res['anchos'][ancho] = r; continue
            hay = r.get('pisados') or r.get('cortados') or r.get('desborde') or r.get('rotas') or r.get('fuera')
            if hay:
                # captura de la zona de cada hallazgo (hasta 3)
                zonas = (r.get('pisados') or []) + (r.get('fuera') or []) + (r.get('cortados') or [])
                caps = []
                for i, z in enumerate(zonas[:3]):
                    y = max(0, z['y'] - 120)
                    shot = cdp('Page.captureScreenshot', format='jpeg', quality=60, captureBeyondViewport=True,
                               clip={'x': 0, 'y': y, 'width': ancho, 'height': min(500, alto), 'scale': 1 if ancho < 900 else .7})
                    fn = f'{carpeta}-{ancho}-{i}.jpg'
                    open(os.path.join(SALIDA, fn), 'wb').write(base64.b64decode(shot['data']))
                    caps.append(fn)
                r['capturas'] = caps
            res['anchos'][ancho] = r
        except Exception as e:
            res['anchos'][ancho] = {'error': str(e)[:300]}
    resultados[carpeta] = res
    json.dump(resultados, open(os.path.join(SALIDA, f'res-{PUERTO}.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print(carpeta, {a: (len(v.get('pisados', [])), len(v.get('cortados', [])), len(v.get('fuera', [])), v.get('desborde', 0) and 1, len(v.get('rotas', []))) if 'error' not in v else 'ERR' for a, v in res['anchos'].items()}, flush=True)

ws.close(); chrome.terminate()
time.sleep(1); shutil.rmtree(perfil, ignore_errors=True)
