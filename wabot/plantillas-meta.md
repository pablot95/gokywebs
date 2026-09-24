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

`seguimiento_interesado` se manda a las 18:00, una sola vez, cuando el chat
está marcado como favorito y pasaron siete días completos desde el último
mensaje registrado del cliente, del bot o escrito a mano desde el panel.
Los favoritos que ya estaban marcados antes de activar este flujo no entran:
hay que quitar y volver a poner la estrella para programarlos.
Los mensajes enviados por fuera del panel no quedan registrados en ese reloj.
La opción «Automática a las 18 h» en Ajustes permite apagar cada flujo sin
desactivar el botón manual de la plantilla.

## Qué pasa después

- **Se paga por mensaje.** Las de Marketing tienen costo por envío; el texto
  libre dentro de las 24 h es gratis.
- Cuando el cliente contesta, **reabre la ventana de 24 h** y el bot vuelve a
  poder escribirle normalmente.
- No mandar la misma plantilla dos veces al mismo cliente: Meta mide quejas y
  bloqueos y puede limitar el número.
