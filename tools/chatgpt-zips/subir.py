"""
tools/chatgpt-zips/subir.py - sube a la ficha del prospecto en el admin los zips
de imagenes de ChatGPT («Gokywebs Copiar 10») que la extension de Chrome
(tools/chatgpt-zips/extension) bajo a Descargas (Pablo, 29-oct: «cada ZIP en la
ficha de su prospecto y tambien en Descargas»).

El nombre del zip trae el id de la propuesta (Negocio_<id>.zip). Se sube a
wabot/imagenes-ia-subir.php firmado con la cuenta de servicio (HMAC del id y el
sha256 del cuerpo). Cada zip se sube una vez; si falla, se reintenta en la
corrida siguiente. Lo corre la tarea de Windows cada 10 minutos
(instalar-tarea.ps1). La primera corrida solo mira lo de las ultimas 12 horas.

    py tools/chatgpt-zips/subir.py
"""
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
ESTADO = DATOS / 'subidos.json'
LOG = DATOS / 'log.txt'
DESCARGAS = Path(os.environ.get('USERPROFILE', str(Path.home()))) / 'Downloads'
CUENTA = AQUI.parent.parent / 'config' / 'service-account.json'
SUBIR_URL = 'https://gokywebs.com/wabot/imagenes-ia-subir.php'
# Negocio_<id de 20>.zip, o con el « (1)» que agrega Chrome si ya existia.
NOMBRE = re.compile(r'_([A-Za-z0-9]{20})(?: \(\d+\))?\.zip$')


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


def subir(archivo, pid):
    """True si el server guardo el zip."""
    cuerpo = archivo.read_bytes()
    clave = json.loads(CUENTA.read_text(encoding='utf-8'))['private_key']
    sha = hashlib.sha256(cuerpo).hexdigest()
    firma = hmac.new(clave.encode(), ('imagenes-ia|' + pid + '|' + sha).encode(), hashlib.sha256).hexdigest()
    url = SUBIR_URL + '?' + urllib.parse.urlencode({'id': pid, 'firma': firma, 'nombre': re.sub(r' \(\d+\)(?=\.zip$)', '', archivo.name)})
    pedido = urllib.request.Request(url, data=cuerpo, method='POST', headers={'Content-Type': 'application/zip'})
    try:
        with urllib.request.urlopen(pedido, timeout=300) as r:
            return bool(json.loads(r.read().decode('utf-8')).get('ok'))
    except Exception as e:
        anotar('No se pudo subir ' + archivo.name + ': ' + str(e))
        return False


def main():
    DATOS.mkdir(parents=True, exist_ok=True)
    try:
        estado = json.loads(ESTADO.read_text(encoding='utf-8'))
    except Exception:
        estado = {'desde': time.time() - 12 * 3600, 'subidos': {}}
        ESTADO.write_text(json.dumps(estado), encoding='utf-8')

    subidos = []
    for archivo in sorted(DESCARGAS.glob('*.zip'), key=lambda f: f.stat().st_mtime):
        m = NOMBRE.search(archivo.name)
        st = archivo.stat()
        if not m or st.st_mtime < estado['desde'] or time.time() - st.st_mtime < 20:
            continue   # sin id, de antes, o Chrome todavia lo esta escribiendo
        marca = f'{st.st_size}|{int(st.st_mtime)}'
        if estado['subidos'].get(archivo.name) == marca:
            continue
        with open(archivo, 'rb') as f:
            if f.read(2) != b'PK':
                continue
        if subir(archivo, m.group(1)):
            estado['subidos'][archivo.name] = marca
            ESTADO.write_text(json.dumps(estado, ensure_ascii=False, indent=1), encoding='utf-8')
            anotar('Subido al admin: ' + archivo.name)
            subidos.append(archivo.name)
    if subidos:
        avisar('Zips de ChatGPT', ('En Descargas y en el admin: ' if len(subidos) == 1 else str(len(subidos)) + ' zips en Descargas y en el admin: ') + ', '.join(subidos))
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as e:
        anotar('Error: ' + repr(e))
        sys.exit(1)
