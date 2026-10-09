# Flujo comercial unificado y modo de sugerencias — 9 de octubre de 2026

Implementación del plan de traspaso (`output/plan-wabot-2026-10-09.md`). El modelo del bot sigue
siendo GPT Sol (`openai_modelo`), con la misma key y el mismo cliente de la Responses API (`ia.php`).

## Qué hay

- `wabot/comercial.php` — el flujo: contexto (hechos, cotización previa, oferta, citas, historial de
  los dos lados), decisión del modelo (Structured Outputs), red de mensajes, reglas comerciales y de
  estado (`wabot_comercial_validar`), construcción de los mensajes con su efecto
  (`wabot_comercial_construir`) y aplicación de efectos (`wabot_comercial_efectos_aplicar`).
- `wabot/comercial-instrucciones.php` — las instrucciones del modelo (parte A). Editables.
- `wabot/sugerencias.php` — el modo de sugerencias: genera, guarda, muestra, manda y descarta.
- `textos.php` → `comercial` (bloques aprobados), `flujo_comercial` (modo), `cotizacion_conservar`.
- `wabot/COMERCIAL.md` — la ficha comercial consolidada y las decisiones pendientes de Pablo.
- Panel (`admin.php`): Ajustes → Inteligencia artificial → "Flujo comercial nuevo" (Apagado /
  Sugerencias / Automático); en cada chat, la tarjeta "💡 Sugerencia del bot" arriba del cuadro de
  escribir; en la lista, la marca 💡 en los chats con una sugerencia lista.

## Modos (`flujo_comercial`)

- **off** (de fábrica, y lo que queda en producción hasta que Pablo decida): nada de esto corre.
- **sugerencias**: el bot solo manda la bienvenida (como "solo bienvenida"). Por cada tanda del
  cliente que queda sin respuesta, el webhook piensa la respuesta y la deja en
  `data/sugerencias/<clave>.json`. Nada sale solo.
- **auto**: el flujo contesta solo (`wabot_comercial_turno`, desde `wabot_responder`). Queda para
  después de revisar las sugerencias; se vuelve a `sugerencias` desde Ajustes en cualquier momento.

## Cómo se usa el modo de sugerencias

1. Ajustes → Inteligencia artificial → Flujo comercial nuevo → **Sugerencias** → Guardar.
2. Cuando un cliente escribe, el chat muestra la tarjeta con lo que el bot mandaría: cada mensaje
   con su etiqueta (Propuesta, Planes, Oferta de demo, Formulario, Respuesta oficial, Mensaje), un
   cuadro editable y un tilde para dejarlo afuera.
   - **Enviar sugerencia** manda los tildados, en orden, por el mismo camino que el cuadro de
     escribir (quedan como mensajes tuyos; con `envio_id`, un reintento no los repite), con 4 s y el
     "escribiendo…" entre uno y otro (`comercial.demora_entre_sugeridos`). La charla
     pasa a control manual (como cuando contestás vos). Recién ahí se aplican los efectos de lo que
     salió de verdad: si salieron los planes, se congela ese precio (si editaste un monto, vale el que
     vio el cliente); si salió la oferta, queda abierta; si salió el formulario, la charla queda en
     pausa por formulario (el recordatorio de 12 h sigue).
   - **Descartar** la saca y queda registrada.
   - **Recalcular** la vuelve a pensar con lo último de la charla.
   - Si el cliente escribió (o alguien contestó) después de pensarla, aparece **Desactualizada** y
     no se puede mandar hasta recalcular.
3. Cuando corresponde una persona, la tarjeta muestra "Para Pablo: <motivo>" y ningún mensaje. Con el
   formulario ya mandado, muestra el aviso y no piensa (no gasta).
4. Las sugerencias siguen apareciendo aunque la charla esté en control manual (es la prueba).

Registro: `data/sugerencias-log/AAAA-MM.jsonl` (lo sugerido, lo mandado de verdad, si se editó,
descartes). Consumo: pestaña IA, tarea `comercial`, modo `sugerencia`.

## Estados de la charla (`wabot_comercial_estado`)

- `atencion`: puede conversar y cotizar.
- `formulario` (`comercial_pausa = formulario`, o cualquier link del formulario mandado, formulario
  completado, ficha o demo): sin respuestas conversacionales; el recordatorio del formulario sigue si
  no está bloqueado.
- `humano` (`comercial_pausa = humano`, `comercial_motivo`): caso especial; en automático toma el
  control (control manual, bot apagado, sin recordatorios). Solo "Encender bot acá" lo levanta.
- `rechazo`: el cliente no quiso avanzar; sin recordatorios para avanzar.

## Pruebas

- `php wabot/test-comercial.php` — 108 casos sin red (matriz del plan, montos históricos, estados,
  recordatorio, webhook de punta a punta en automático, modo apagado).
- `php wabot/test-sugerencias.php` — 42 casos sin red (bienvenida sola, sugerencia sin efectos,
  desactualizada, envío con efectos, editada, formulario, para Pablo, descartar, fallas).
- `php wabot/test-comercial-vivo.php [--grupo=evaluacion|guia|todos] [--max=N] [--ids=…] [--viejo]`
  — charlas reales anonimizadas (`wabot/test-comercial-charlas.json`) contra GPT Sol real. Cuesta
  ~US$ 0,01 por caso; no va en los barridos.

## Lo que cambia aunque el modo esté apagado

- `wabot_precio_vigente` conserva la cotización congelada aunque la lista haya bajado
  (`cotizacion_conservar = true`; con false vuelve la regla del 26-sep).
- `wabot_texto_es_oferta_entrega` reconoce también la oferta aprobada ("demo gratis… antes de
  decidir"): el seguimiento de las 23 h de la oferta también sale cuando Pablo manda ese texto a mano
  (se apaga en Ajustes → Avisos automáticos si no se quiere).
- `wabot_conv_encender_manual` también levanta la pausa del flujo comercial.
- La fila de la lista trae `sugerencia` y el `transcript` del chat trae `sugerencia` (null con el
  modo apagado).
