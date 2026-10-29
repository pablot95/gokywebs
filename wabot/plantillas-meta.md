# Plantillas de WhatsApp que usa el bot

Fuera de las 24 h desde el último mensaje del cliente, Meta **no deja mandar
texto libre**: una plantilla aprobada es la única forma de volver a escribirle.
Se cargan en **WhatsApp Manager → Herramientas de cuenta → Plantillas de
mensajes**. El nombre va en minúsculas y con guiones bajos; la categoría de todo
lo que sea "volver a contactar para vender" es **Marketing**.

## Seguimiento automático de la demo

El cron `seguimiento.php` la manda a las 18:00 (hora argentina), en la primera
ejecución después de que pasen 72 horas desde una demo entregada por el bot,
si el cliente no respondió, el chat no es favorito y no hay un cierre o baja.
Solo entran demos presentadas a partir del 24/09/2026 a las 18:00.
Se registra el intento antes de llamar a Meta para evitar duplicados si hay
un tiempo de espera. Si falla, queda disponible el botón manual.

| Campo | Valor |
|---|---|
| **Clave en el bot** | `plantillas.confirmacion_demo_48h` (se edita en el panel, pestaña Ajustes) |
| **Nombre aprobado en Meta** | `seguimiento_demo_72h` |
| **Idioma** | `es_AR` |
| **Categoría** | Marketing |

**Cuerpo aprobado:**

```
Hola! Te escribo para saber si pudiste ver la demo que te enviamos. Si hay algo que quieras cambiar, lo podemos ajustar. Cuando puedas, contame qué te pareció
```

Si algún día se aprueba otra, alcanza con cambiar el nombre y el idioma desde el
panel: el cron toma lo que haya en esa clave.

## Seguimiento automático de interesados

`seguimiento_interesado` se manda a las 18:00 cuando el chat está marcado como
favorito y pasaron cuatro días completos desde el último mensaje registrado del
cliente, del bot o escrito a mano desde el panel. Al mandarla, el chat sale de
favoritos. Volver a ponerle la estrella lo programa de nuevo (20-oct): si el
cliente contestó aquella plantilla se repite la misma; si no la contestó, va
`seguimiento_demo_72h` (si tuvo demo y nunca le llegó) y, si no, nada.
Desde **Admin → Seguimientos** también se puede enviar la misma plantilla a mano
a un contacto sin estrella. Ese envío no lo marca como favorito ni programa
envíos automáticos; la plantilla queda registrada para no repetirla en el chat.
Los favoritos que ya estaban marcados antes de activar este flujo no entran:
hay que quitar y volver a poner la estrella para programarlos.
Los mensajes enviados por fuera del panel no quedan registrados en ese reloj.
La opción «Automática a las 18 h» en Ajustes permite apagar cada flujo sin
desactivar el botón manual de la plantilla.

**Cuerpo aprobado:**

```
Hola, cómo estás?
```

## El mantenimiento contado por WhatsApp (29-oct)

Dos plantillas de **Utilidad** que salen solas desde `wabot/webs.php` (lo corre
`seguimiento.php` cada media hora) a los clientes que están en Mantenimiento en
el admin: los mensuales activos (con o sin suscripción de Mercado Pago) y los
del plan anual. El admin le pasa esa lista al bot cada vez que cambia
(`webs_sync`), con el dominio cargado en cada ficha. Las dos están apagadas en
Ajustes hasta que Meta las apruebe.

### Resumen mensual de la web

Desde el día 1 de cada mes, de 10 a 20 h, una vez por cliente, con los datos
del mes anterior. Si el 1 no sale (cron caído), sale otro día del mes. No sale
si la web está caída en ese momento (espera a que vuelva) ni si ese mes tiene
menos de 15 días monitoreados (el primero sale completo, no a medias). Pablo
recibe un push con cuántos salieron y a quiénes no se les pudo mandar.

| Campo | Valor |
|---|---|
| **Clave en el bot** | `plantillas.reporte_mensual_web` |
| **Nombre en Meta** | `reporte_mensual_web` |
| **Idioma** | `es_AR` |
| **Categoría** | Utilidad |
| **Variables** | {{1}} nombre, {{2}} mes, {{3}} negocio, {{4}} disponibilidad, {{5}} visitas, {{6}} errores, {{7}} certificado |

**Cuerpo para cargar en Meta:**

```
Hola {{1}}, te paso el resumen de {{2}} de la web de {{3}}:

✅ Disponibilidad: {{4}}
👥 Visitas: {{5}}
🛠️ Errores: {{6}}
🔒 Certificado de seguridad: {{7}}

Todo esto es parte del mantenimiento. Si querés hacer algún cambio en la web, escribinos por acá.
```

Ejemplos de valores (Meta los pide al cargar la plantilla): `Juan`, `octubre`,
`Panadería Sol`, `100 % (online todo el mes)`, `312 visitas`, `ninguno detectado`,
`vigente hasta el 15/01/2027`. Otros valores posibles: `99,8 % (una caída de 1 hora,
ya resuelta)`, `sin visitas registradas`, `3 detectados, 2 corregidos, 1 en revisión`.

De dónde sale cada número:
- **Disponibilidad**: el bot pide la portada de cada dominio cada media hora
  (`wabot/data/webs-estado.json`). Lo que falla se vuelve a pedir en la misma
  pasada antes de contarlo como caída.
- **Visitas**: la señal de vida de `err/err.js` (una por navegador por día, sin
  bots), que `err/log.php` suma por web en `err/data/visitas-AAAA-MM.json`.
- **Errores**: los errores distintos del mes (`err/data/errores-AAAA-MM.json`) y
  qué hizo con cada uno la rutina de Claude (`err/data/estados.json`): `pr`/`rama`
  cuentan como corregidos; `descartado`/`no_reproduce`/`sin_repo` como revisados sin
  impacto; el resto, en revisión.
- **Certificado**: la fecha de vencimiento que devuelve el servidor al pedir la
  portada por https.

### Web caída y resuelta

Cuando una web que estuvo caída 20 minutos o más vuelve a responder, en horario
(10 a 20 h; si fue de noche sale a la mañana), como mucho una vez por día por
web. Pablo recibe el push siempre, al caerse y al volver, esté o no activa la
plantilla.

| Campo | Valor |
|---|---|
| **Clave en el bot** | `plantillas.web_caida_resuelta` |
| **Nombre en Meta** | `web_caida_resuelta` |
| **Idioma** | `es_AR` |
| **Categoría** | Utilidad |
| **Variables** | {{1}} nombre, {{2}} negocio, {{3}} desde, {{4}} hasta |

**Cuerpo para cargar en Meta:**

```
Hola {{1}}, te aviso que la web de {{2}} dejó de responder {{3}} y {{4}} ya estaba funcionando otra vez. Lo detectó nuestro monitoreo y quedó registrado. Si ves algo raro, escribinos por acá.
```

Ejemplos: `Ana`, `Gomería Lorenzo`, `hoy a las 3:00`, `hoy a las 3:30` (también
`ayer a las 23:30` o `el 3/11 a las 23:30`).

## El texto en el chat del panel

Meta no devuelve el cuerpo de la plantilla al mandarla: lo que queda escrito en
el chat es el campo «Texto aprobado en Meta» de cada plantilla en Ajustes. Si se
cambia la plantilla por otra, hay que cambiar también ese texto. Si queda vacío,
el chat muestra `[Plantilla de WhatsApp: nombre]`, para que el envío no quede
invisible.

## Qué pasa después

- Después de enviar cualquier plantilla, el bot queda apagado en esa
  conversación y Pablo toma el control. Solo el botón «Encender bot acá» puede
  devolverle el control.
- **Se paga por mensaje.** Las de Marketing tienen costo por envío; el texto
  libre dentro de las 24 h es gratis.
- Cuando el cliente contesta, **reabre la ventana de 24 h** para escribirle
  texto libre. El bot sigue apagado hasta que Pablo lo encienda en ese chat.
- No mandar la misma plantilla dos veces al mismo cliente: Meta mide quejas y
  bloqueos y puede limitar el número.
