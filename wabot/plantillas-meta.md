# Plantillas para presentar a Meta

Para qué sirven: fuera de las 24 h desde el último mensaje del cliente, Meta **no
deja mandar texto libre**. Una plantilla aprobada es la única forma de volver a
escribirle. Se cargan en **WhatsApp Manager → Herramientas de cuenta → Plantillas
de mensajes → Crear plantilla**.

Tardan de unos minutos a 24-48 h en aprobarse.

## Reglas que hacen que te la rechacen

Las cuatro que importan acá:

1. **Categoría equivocada** — es el motivo de rechazo número uno. Todo lo que sea
   "volver a contactar para vender" es **Marketing**, aunque suene informativo.
   Mandarlo como Utility para ahorrar plata es rechazo casi seguro.
2. **Contenido vago** — "Hola, ¿cómo estás?" a secas se rechaza: sirve para
   cualquier cosa, que es exactamente lo que hace un spammer. Por eso las tres
   plantillas de abajo dicen quiénes somos y por qué escribimos.
3. **Variables al principio o al final del cuerpo** — el texto no puede empezar
   ni terminar con `{{1}}`. Todas las de abajo cumplen.
4. **Faltan los valores de ejemplo** — al cargarla, Meta pide un ejemplo de cada
   variable. Están indicados en cada plantilla.

El nombre va en minúsculas y con guiones bajos.

---

## 1. Seguimiento de la demo

La que pediste. Se le manda al que ya tiene la demo presentada y no contestó.

| Campo | Valor |
|---|---|
| **Nombre** | `seguimiento_demo_web` |
| **Categoría** | Marketing |
| **Idioma** | Español (ARG) |
| **Encabezado** | (ninguno) |

**Cuerpo:**

```
Hola {{1}}, ¿cómo estás? Te escribimos de Gokywebs por la demo de la página web que preparamos para {{2}}. ¿Pudiste verla? Contanos qué te pareció, o si hay algo que quieras que ajustemos.
```

**Ejemplos:** `{{1}}` = `Marcos` · `{{2}}` = `Mate Sur`

**Botones (Respuesta rápida):** `Sí, la vi` · `Todavía no`

---

## 2. Recordatorio genérico

La segunda que pediste: no nombra la demo. Igual dice quiénes somos y que hubo
una consulta previa — sin eso no pasa la revisión.

| Campo | Valor |
|---|---|
| **Nombre** | `recordatorio_consulta_web` |
| **Categoría** | Marketing |
| **Idioma** | Español (ARG) |
| **Encabezado** | (ninguno) |

**Cuerpo:**

```
Hola {{1}}, ¿cómo estás? Te escribimos de Gokywebs, donde habías consultado por una página web para tu negocio. Si te quedó pendiente, seguimos disponibles para retomarlo cuando quieras.
```

**Ejemplos:** `{{1}}` = `Marcos`

**Botones (Respuesta rápida):** `Me interesa` · `Ahora no`

---

## 3. Presupuesto sin respuesta

Para los de la pestaña **Interesados**: vieron el precio y no pasaron los datos.

| Campo | Valor |
|---|---|
| **Nombre** | `seguimiento_presupuesto_web` |
| **Categoría** | Marketing |
| **Idioma** | Español (ARG) |
| **Encabezado** | (ninguno) |

**Cuerpo:**

```
Hola {{1}}, ¿cómo estás? Te habíamos pasado el valor de la página web y quedamos ahí. Si querés, te armamos una demo gratis para que veas cómo quedaría antes de decidir nada.
```

**Ejemplos:** `{{1}}` = `Marcos`

**Botones (Respuesta rápida):** `Dale, quiero verla` · `Ahora no`

---

## Después de que las aprueben

- **Se paga por mensaje.** Las de Marketing tienen costo por envío, a diferencia
  del texto libre dentro de las 24 h, que es gratis.
- **Los botones de respuesta rápida son lo más importante.** Cuando el cliente
  toca uno, eso cuenta como mensaje suyo y **reabre la ventana de 24 h**: a
  partir de ahí el bot vuelve a poder escribirle normalmente.
- **No mandar la misma plantilla dos veces al mismo cliente.** Meta mide las
  quejas y los bloqueos; si suben, baja la calidad del número y en el peor caso
  lo limitan.
- Todavía **no están cableadas en el bot**: una vez aprobadas, pasame los nombres
  exactos y las conecto a Presentadas 48 h y a Interesados.

## Fuentes

- [Por qué se rechazan las plantillas de WhatsApp](https://www.spurnow.com/en/blogs/why-are-my-whatsapp-templates-getting-rejected)
- [Categorías de plantillas de WhatsApp](https://greentick.ai/blogs/whatsapp-message-template-categories/)
