# Auditoría visual de las webs en vivo

Revisa la portada de cada web con Chrome headless (CDP) y marca:

- **PISA**: textos de elementos distintos que se superponen (el caso de Molina Games del 20-nov: 13 categorías en una fila de 71 px).
- **CORTA**: texto recortado por un contenedor con `overflow` (ignora line-clamp, carriles y marquesinas).
- **FUERA**: texto que queda parcialmente afuera de la pantalla (con `overflow-x: clip` la página no se mueve, pero el texto se corta).
- **DESBORDE**: el contenido es más ancho que la pantalla (si la lista de elementos viene vacía, es algo recortado/invisible: ignorar).
- **ROTA**: fotos que no cargan. **JS**: errores de JavaScript.

## Uso

```
node dominios.mjs sitios.json          # dominio de cada carpeta de Mantenimiento/ y EnProceso/
# armar lista.txt: carpeta<TAB>https://dominio/   (una por línea; partirla en 4 para correr en paralelo)
python auditar.py lista.txt out 9640   # puerto CDP libre y poco común; aborta si está ocupado
ANCHOS=1280,1024,360 python auditar.py lista.txt out2 9650   # otros anchos (1366, 820, 390 por defecto)
python resumen.py                      # lee out/res-*.json (editar el glob para otra carpeta)
```

Cada web tarda ~1 min por tanda de 3 anchos. Las capturas de cada hallazgo quedan en `out/<carpeta>-<ancho>-<n>.jpg`.

Falsos positivos conocidos: palabras decorativas gigantes detrás de otro texto (se filtran por tamaño), el sello
circular con texto en curva (SVG, se ignora), la atribución de Leaflet tapada por una ficha sobre el mapa, y la
biografía «leer más» recortada a propósito (José Omar León). Siempre mirar la captura antes de tocar nada.
