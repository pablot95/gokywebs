"""
tools/chatgpt-zips/bajar.py - los zips de imagenes de la tarea de ChatGPT
«Gokywebs Copiar 10», solos a Descargas y a la ficha del prospecto en el admin
(Pablo, 29-oct: «quiero que los zips se descarguen en la carpeta Descargas» +
«que queden tambien en Admin»).

La tarea de ChatGPT corre en la nube y deja cada zip como un link
«Descargar ZIP» (sandbox:/...zip) en un chat titulado «Gokywebs Copiar 10».
Esto abre ChatGPT en Chrome con un perfil propio (la sesion de Pablo, iniciada
una vez con --login), busca esos links en los chats de los ultimos dias y baja
cada zip nuevo con las mismas llamadas que hace la pagina al tocar el link.
El nombre del zip trae el id de la propuesta (Negocio_<id>.zip): con eso se
sube a wabot/imagenes-ia-subir.php, firmado con la cuenta de servicio.

    py tools/chatgpt-zips/bajar.py --login     (una vez: iniciar sesion en ChatGPT)
    py tools/chatgpt-zips/bajar.py             (lo corre la tarea de Windows)

No toca nada en ChatGPT: solo lee los chats y baja los archivos.
"""
import argparse
import hashlib
import hmac
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

AQUI = Path(__file__).resolve().parent
DATOS = AQUI / 'data'
PERFIL = DATOS / 'perfil'
PENDIENTES = DATOS / 'zips'          # copia hasta que sube al admin
ESTADO = DATOS / 'estado.json'
LOG = DATOS / 'log.txt'
CANDADO = DATOS / 'corriendo.lock'
DESCARGAS = Path(os.environ.get('USERPROFILE', str(Path.home()))) / 'Downloads'
CUENTA = AQUI.parent.parent / 'config' / 'service-account.json'
SUBIR_URL = 'https://gokywebs.com/wabot/imagenes-ia-subir.php'
TITULO = 'Copiar 10'

# Corre dentro de chatgpt.com: la sesion, los chats de la tarea y sus links a zips.
JS_BUSCAR = r"""
async ([titulo, desde]) => {
  const s = await fetch('/api/auth/session').then(r => r.json()).catch(() => ({}));
  if (!s.accessToken) return { sinSesion: true };
  const h = { Authorization: 'Bearer ' + s.accessToken };
  const chats = [];
  for (let offset = 0; offset < 300; offset += 100) {
    const r = await fetch(`/backend-api/conversations?offset=${offset}&limit=100&order=updated`, { headers: h });
    if (!r.ok) return { error: 'conversations HTTP ' + r.status };
    const items = (await r.json()).items || [];
    let viejo = false;
    for (const c of items) {
      const t = Date.parse(c.update_time) / 1000 || Number(c.update_time) || 0;
      if (t < desde) { viejo = true; continue; }
      if ((c.title || '').includes(titulo)) chats.push(c.id);
    }
    if (viejo || items.length < 100) break;
  }
  const zips = [];
  for (const cid of chats) {
    const r = await fetch('/backend-api/conversation/' + cid, { headers: h });
    if (!r.ok) continue;
    const c = await r.json();
    for (const n of Object.values(c.mapping || {})) {
      const m = n.message;
      if (!m || m.author?.role !== 'assistant' || m.content?.content_type !== 'text') continue;
      const texto = (m.content.parts || []).filter(x => typeof x === 'string').join('\n');
      // Los «Descargar todas» repiten los zips de cada negocio: no se bajan.
      for (const k of texto.matchAll(/sandbox:([^\s)\]]+?\.zip)/g)) {
        if (!/Descargar_todas/i.test(k[1])) zips.push({ cid, mid: m.id, ruta: k[1], ts: m.create_time || 0 });
      }
    }
  }
  return { token: s.accessToken, zips };
}
"""

# El link temporal de un zip, como lo pide la pagina al tocar «Descargar ZIP».
JS_LINK = r"""
async ([token, cid, mid, ruta]) => {
  const r = await fetch(`/backend-api/conversation/${cid}/interpreter/download?message_id=${mid}&sandbox_path=${encodeURIComponent(ruta)}`,
                        { headers: { Authorization: 'Bearer ' + token } });
  const j = await r.json().catch(() => ({}));
  return { http: r.status, url: j.download_url || '', nombre: j.file_name || '' };
}
"""


def anotar(texto):
    DATOS.mkdir(parents=True, exist_ok=True)
    with open(LOG, 'a', encoding='utf-8') as f:
        f.write(datetime.now().strftime('%Y-%m-%d %H:%M:%S') + '  ' + texto + '\n')


def avisar(titulo, texto):
    """Notificacion de Windows (la misma de tools/demo-auto/vigilar.ps1)."""
    ps = (
        "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null;"
        "$x = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02);"
        "$n = $x.GetElementsByTagName('text');"
        "$n.Item(0).AppendChild($x.CreateTextNode($env:AVISO_T)) | Out-Null;"
        "$n.Item(1).AppendChild($x.CreateTextNode($env:AVISO_C)) | Out-Null;"
        "$a = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe';"
        "[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($a).Show([Windows.UI.Notifications.ToastNotification]::new($x))"
    )
    try:
        subprocess.run(['powershell', '-NoProfile', '-Command', ps], timeout=30, capture_output=True,
                       env={**os.environ, 'AVISO_T': titulo, 'AVISO_C': texto},
                       creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    except Exception as e:
        anotar('No se pudo mostrar la notificacion: ' + str(e))


def leer_estado():
    try:
        return json.loads(ESTADO.read_text(encoding='utf-8'))
    except Exception:
        return {'hechos': {}}


def guardar_estado(estado):
    tmp = ESTADO.with_suffix('.tmp')
    tmp.write_text(json.dumps(estado, ensure_ascii=False, indent=1), encoding='utf-8')
    tmp.replace(ESTADO)


def id_propuesta(nombre):
    m = re.search(r'([A-Za-z0-9]{20})\.zip$', nombre)
    return m.group(1) if m else ''


def nombre_seguro(nombre):
    nombre = re.sub(r'[<>:"/\\|?*\x00-\x1f]+', '_', nombre).strip(' .')
    return nombre if nombre.lower().endswith('.zip') else (nombre or 'imagenes') + '.zip'


def subir(archivo, pid):
    """Sube el zip a la ficha del prospecto. True si el server lo guardo."""
    cuerpo = archivo.read_bytes()
    clave = json.loads(CUENTA.read_text(encoding='utf-8'))['private_key']
    sha = hashlib.sha256(cuerpo).hexdigest()
    firma = hmac.new(clave.encode(), ('imagenes-ia|' + pid + '|' + sha).encode(), hashlib.sha256).hexdigest()
    url = SUBIR_URL + '?' + urllib.parse.urlencode({'id': pid, 'firma': firma, 'nombre': archivo.name})
    pedido = urllib.request.Request(url, data=cuerpo, method='POST', headers={'Content-Type': 'application/zip'})
    try:
        with urllib.request.urlopen(pedido, timeout=300) as r:
            return bool(json.loads(r.read().decode('utf-8')).get('ok'))
    except Exception as e:
        anotar('No se pudo subir ' + archivo.name + ' al admin: ' + str(e))
        return False


def subir_pendientes(estado):
    for ruta, h in estado['hechos'].items():
        if h.get('subido') or not h.get('id'):
            continue
        copia = PENDIENTES / h['archivo']
        if not copia.exists():
            continue
        if subir(copia, h['id']):
            h['subido'] = True
            copia.unlink()
            anotar('Subido al admin: ' + h['archivo'])
            guardar_estado(estado)


def correr(args):
    from playwright.sync_api import sync_playwright

    estado = leer_estado()
    estado.setdefault('hechos', {})
    # La primera vez solo cuentan los zips de las ultimas 12 horas: los de
    # antes ya los bajo Pablo a mano (en 3 dias hay ~70 zips de ~17 MB).
    if 'desde' not in estado:
        estado['desde'] = time.time() - 12 * 3600
        guardar_estado(estado)
    desde = time.time() - args.dias * 86400
    PENDIENTES.mkdir(parents=True, exist_ok=True)
    nuevos = []

    with sync_playwright() as p:
        ventana = [] if args.login else ['--window-position=-2400,-2400', '--window-size=1100,800']
        ctx = p.chromium.launch_persistent_context(str(PERFIL), channel='chrome', headless=False, args=ventana)
        try:
            pagina = ctx.pages[0] if ctx.pages else ctx.new_page()
            pagina.goto('https://chatgpt.com/', wait_until='domcontentloaded', timeout=60000)

            if args.login:
                print('Inicia sesion en ChatGPT en la ventana de Chrome que se abrio (tenes 10 minutos).')
                for _ in range(120):
                    pagina.wait_for_timeout(5000)
                    if pagina.evaluate("fetch('/api/auth/session').then(r => r.json()).then(j => !!j.accessToken).catch(() => false)"):
                        print('Listo: la sesion quedo guardada. Ya podes cerrar esto.')
                        anotar('Sesion de ChatGPT iniciada')
                        return 0
                print('No se detecto la sesion. Volve a correr con --login.')
                return 2

            pagina.wait_for_timeout(4000)
            res = pagina.evaluate(JS_BUSCAR, [TITULO, desde])
            if res.get('sinSesion'):
                anotar('Sin sesion de ChatGPT (o ChatGPT pidio verificacion)')
                if not estado.get('aviso_sesion'):
                    avisar('Zips de ChatGPT', 'Hay que iniciar sesion: corre tools\\chatgpt-zips\\login.cmd')
                    estado['aviso_sesion'] = time.time()
                    guardar_estado(estado)
                return 2
            if res.get('error'):
                anotar('ChatGPT: ' + res['error'])
                return 1
            estado.pop('aviso_sesion', None)

            for z in res['zips']:
                if z['ruta'] in estado['hechos'] or z['ts'] < estado['desde']:
                    continue
                link = pagina.evaluate(JS_LINK, [res['token'], z['cid'], z['mid'], z['ruta']])
                if link['http'] != 200 or not link['url']:
                    anotar('Sin link para ' + z['ruta'] + ' (HTTP ' + str(link['http']) + ')')
                    continue
                url = link['url'] if link['url'].startswith('http') else 'https://chatgpt.com' + link['url']
                r = ctx.request.get(url, headers={'Authorization': 'Bearer ' + res['token']}, timeout=180000)
                cuerpo = r.body() if r.ok else b''
                if cuerpo[:2] != b'PK':
                    anotar('No se pudo bajar ' + z['ruta'] + ' (HTTP ' + str(r.status) + ')')
                    continue
                nombre = nombre_seguro(link['nombre'] or z['ruta'].rsplit('/', 1)[-1])
                destino = DESCARGAS / nombre
                if destino.exists() and destino.stat().st_size != len(cuerpo):
                    destino = DESCARGAS / (destino.stem + time.strftime('_%H%M%S') + '.zip')
                destino.write_bytes(cuerpo)
                pid = id_propuesta(nombre)
                if pid:
                    (PENDIENTES / nombre).write_bytes(cuerpo)
                estado['hechos'][z['ruta']] = {'archivo': nombre, 'id': pid, 'bajado': time.strftime('%Y-%m-%d %H:%M:%S'), 'subido': False}
                guardar_estado(estado)
                anotar('Bajado a Descargas: ' + destino.name + ('' if pid else ' (sin id de propuesta: no se sube al admin)'))
                nuevos.append(destino.name)
        finally:
            ctx.close()

    if not args.sin_subir:
        subir_pendientes(estado)
    if nuevos:
        avisar('Zips de ChatGPT', ('Ya esta en Descargas: ' if len(nuevos) == 1 else str(len(nuevos)) + ' zips nuevos en Descargas: ') + ', '.join(nuevos))
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--login', action='store_true', help='abrir Chrome para iniciar sesion en ChatGPT')
    ap.add_argument('--dias', type=float, default=3, help='chats de los ultimos N dias (3)')
    ap.add_argument('--sin-subir', action='store_true', help='solo bajar a Descargas')
    args = ap.parse_args()

    DATOS.mkdir(parents=True, exist_ok=True)
    # Una corrida a la vez (el perfil de Chrome no se puede abrir dos veces).
    try:
        if CANDADO.exists() and time.time() - CANDADO.stat().st_mtime < 1800:
            return 0
        CANDADO.write_text(str(os.getpid()))
    except OSError:
        return 0
    try:
        return correr(args)
    except Exception as e:
        anotar('Error: ' + repr(e))
        return 1
    finally:
        CANDADO.unlink(missing_ok=True)


if __name__ == '__main__':
    sys.exit(main())
