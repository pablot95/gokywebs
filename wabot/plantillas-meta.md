# Plantillas de WhatsApp que usa el bot

Fuera de las 24 h desde el último mensaje del cliente, Meta **no deja mandar
texto libre**: una plantilla aprobada es la única forma de volver a escribirle.
Se cargan en **WhatsApp Manager → Herramientas de cuenta → Plantillas de
mensajes**. El nombre va en minúsculas y con guiones bajos; la categoría de todo
lo que sea "volver a contactar para vender" es **Marketing**.

## La única cableada: confirmación de la demo a las 48 h

La manda el cron (`seguimiento.php` → `wabot_confirmacion_demo_correr`) a quien
tiene la demo presentada y no contestó en `presentadas_sin_respuesta_horas`
(48 h por defecto). Una sola vez por conversación, siempre por plantilla.

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

## Qué pasa después

- **Se paga por mensaje.** Las de Marketing tienen costo por envío; el texto
  libre dentro de las 24 h es gratis.
- Cuando el cliente contesta, **reabre la ventana de 24 h** y el bot vuelve a
  poder escribirle normalmente.
- No mandar la misma plantilla dos veces al mismo cliente: Meta mide quejas y
  bloqueos y puede limitar el número.
