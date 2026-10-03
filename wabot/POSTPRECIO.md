# Atención posterior al precio — 1 de octubre de 2026

`postprecio.php` selecciona respuestas comerciales aprobadas a partir de las consultas de los chats analizados. Sol clasifica cada pregunta y la vincula con reglas; el servidor construye el texto y valida las condiciones. No se envía texto libre generado por el modelo en esta etapa.

## Tarifas nuevas

| Tipo | Mensual | Anual | Pago único |
|---|---:|---:|---:|
| Sitio profesional | $20.000 | $140.000 | $220.000 |
| Tienda, cursos e inmobiliaria | $30.000 | $220.000 | $330.000 |

Seña del anual y del pago único: $60.000. Saldos: $80.000/$160.000 para sitio profesional y $160.000/$270.000 para el resto. El mantenimiento aparte del pago único conserva su importe: $10.000/$15.000.

Mensual profesional: `https://mpago.la/2nEoNGN`. Mensual resto: `https://mpago.la/2CQLnCv`. Los enlaces se incorporaron tal como fueron proporcionados; Mercado Pago bloqueó la consulta automatizada con HTTP 403, por lo que no se verificó allí el importe contratado.

Los precios comerciales salen de `textos.php`; las páginas nuevas están en `/pago/mensual20000`, `/pago/mensual30000`, `/pago/anual140`, `/pago/anual220`, `/pago/unico220` y `/pago/unico330` (3-oct: el bot ofrece solo mensual y anual; el pago único queda para el que pide el código propio). Se conservan las páginas anteriores para los planes existentes. El administrador conserva los montos guardados de cada cliente.

Una cotización previa toma la lista actual si es más baja; si conserva una oferta especial menor, el bot no puede mandarle una página que cobre más. Las imágenes anteriores permanecen para visualizar el historial y no se ofrecen botones para enviarlas en las conversaciones.

## Control y límites

- Ajustes permite activar/desactivar esta etapa. Valores por defecto: OpenAI, `gpt-6-sol`, etapa habilitada. La configuración guardada del servidor conserva las preferencias explícitas del panel.
- Consultas conocidas: detalle de cada modalidad (los links a las páginas de pago/, que desde el 2-oct ya no van en el turno del precio), alternativas, pago estándar, servicio mensual, mantenimiento, panel/carga, hosting/dominio, titularidad estándar, plataforma, alcance, envíos aprobados, cupones, estadísticas, Google, material, identidad, demo/formulario/modelo/cambios, plazos generales y otras condiciones enumeradas en el catálogo.
- Cualquier consulta sin cobertura completa, cotización especial, condición nueva, pago avisado, comprobante, reclamo, negociación, pedido de llamada o intervención humana deja `control_manual`, `bot_off`, `handoff_pendiente` y `seguimiento_bloqueado` activos. No envía un aviso al cliente.
- Fallas de OpenAI o decisiones inválidas también derivan en silencio. No se usa una respuesta comercial improvisada de respaldo.
- El panel muestra el motivo. Un sí posterior y el paso del tiempo no reactivan una derivación. Solo la acción manual de encender el bot lo devuelve a la atención automática. Las conversaciones antiguas apagadas conservan el silencio.
- Un formulario se confirma solo con el registro de recepción. Elegir la muestra no suscribe ni prueba un pago. Entregar la demo conserva el control humano cuando ya lo tenía Pablo.
- Se desactivan los seguimientos automáticos de esta etapa para impedir que una plantilla conteste una consulta pendiente para Pablo.
- El modo sombra registra propuestas sin enviar respuestas. Las categorías nuevas se incorporan a mano después de revisar mensajes de Pablo; el bot no aprende políticas nuevas por su cuenta.

Las validaciones de formato, precios y estado no garantizan que el modelo interprete siempre correctamente cada mensaje. Mantener revisión de conversaciones y ampliar la batería con casos nuevos.

## Validación

`php wabot/test-postprecio.php` comprueba decisiones simuladas y el envío/cola reales del webhook con transporte simulado. `php wabot/test-postprecio-vivo.php --evaluar` evalúa consultas contra OpenAI real, sin enviar WhatsApp ni crear pagos/leads. Las suites anteriores declaran la función desactivada cuando verifican el comportamiento de respaldo.
