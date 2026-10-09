# Flujo comercial unificado y modo de sugerencias — informe del 9 de octubre de 2026

Implementación local del plan de traspaso (`output/plan-wabot-2026-10-09.md`). Nada está
commiteado ni publicado; el bot en producción sigue igual (solo bienvenida, GPT Sol). El modo nuevo
arranca apagado (`flujo_comercial = off` en `textos.php`) y se prende desde Ajustes cuando Pablo
quiera probar las sugerencias.

## Qué se hizo

**Flujo comercial (`wabot/comercial.php`, `wabot/comercial-instrucciones.php`).** Un solo criterio
desde el primer mensaje hasta el formulario, antes y después del precio. GPT Sol recibe los hechos
confirmados, la cotización previa (la del bot o la que Pablo pegó a mano), si ya se ofreció la demo,
las citas y los últimos 30 mensajes de los dos lados (2.500 caracteres por mensaje del cliente, 6.000
el nuevo), y devuelve una decisión estricta: acción (responder / cotizar / formulario / humano /
esperar), solución (informativa, tienda, catálogo, cursos, inmobiliaria, reservas, CRM), intención
(acepta / posterga / rechaza / condiciona), pago único, respuestas oficiales y ficha. El sistema valida
(sin negocio no hay precio; CRM, dos webs y funciones fuera de lista van a Pablo; el formulario solo
después de la oferta; descuento con el texto aprobado; un "dale" claro con la oferta abierta manda el
formulario) y construye los mensajes con los bloques aprobados: propuesta breve adaptada (el modelo,
con red y texto fijo de respaldo), planes (anual primero, con los montos de esa charla), oferta de la
demo y, con el sí, el formulario. Las respuestas del modelo pasan por la red de siempre más una propia
(funciones no aprobadas).

**Modo de sugerencias (`wabot/sugerencias.php`, `admin.php`).** Con `flujo_comercial = sugerencias`
el bot solo saluda; por cada tanda del cliente, el webhook deja la respuesta preparada en
`data/sugerencias/<clave>.json`. En el chat aparece la tarjeta "💡 Sugerencia del bot" con cada
mensaje etiquetado (Propuesta, Planes, Oferta de demo, Formulario, Respuesta oficial), editable y con
tilde; Enviar manda por el mismo camino que el cuadro de escribir (con `envio_id` contra duplicados),
anota los mensajes como de Pablo, toma el control de la charla y recién ahí aplica los efectos de lo
que salió de verdad (precio congelado con los montos que vio el cliente, oferta abierta, formulario
enviado). Si el cliente escribió después, la sugerencia aparece como desactualizada y no se puede
mandar sin recalcular. Los casos para Pablo muestran el motivo y ningún mensaje. Todo queda registrado
en `data/sugerencias-log/`. En la lista, 💡 marca los chats con sugerencia lista.

**Estados.** `atencion`, `formulario` (sin respuestas conversacionales; el recordatorio de 12 h sigue),
`humano` (derivación por caso especial: no se reactiva por tiempo, solo con "Encender bot"),
`rechazo` (sin recordatorios para avanzar).

**Cambios que valen aunque el modo esté apagado.** `wabot_precio_vigente` conserva la cotización
congelada aunque la lista haya bajado (`cotizacion_conservar = true`, decisión del plan; la regla del
26-sep queda detrás del ajuste en false). `wabot_texto_es_oferta_entrega` reconoce la oferta aprobada
("demo gratis… antes de decidir"), así que el seguimiento de las 23 h también saldría cuando Pablo
manda ese texto a mano (se apaga en Ajustes → Avisos automáticos). "Encender bot acá" levanta también
la pausa del flujo comercial.

**Información comercial consolidada.** `wabot/COMERCIAL.md`: ficha única, matriz estándar / requiere a
Pablo y 11 contradicciones o vacíos que necesitan su decisión (abajo).

## Cómo se probó

| Prueba | Resultado |
|---|---|
| `test-comercial.php` (sin red, matriz del plan, montos históricos, estados, recordatorio, webhook, modo off) | 108 / 108 |
| `test-sugerencias.php` (sin red: bienvenida sola, sugerencia sin efectos, desactualizada, envío y efectos, editada, formulario, para Pablo, descartar, fallas) | 42 / 42 |
| 29 suites existentes, comparadas contra una copia de HEAD (`cdf52c4`) | Sin fallas nuevas. Iguales: test.php 84, respuestas-rápidas 34 (36 en HEAD), postdemo 2, ia 2, formulario 2 (11 en HEAD). test-precios y test-postprecio se actualizaron por la regla del 9-oct (lo congelado se mantiene aunque la lista baje); la regla vieja sigue probada con el ajuste apagado. |
| `test-comercial-vivo.php` con GPT Sol real sobre 83 fragmentos de charlas reales del 4 al 9-oct (`wabot/test-comercial-charlas.json`, anonimizados) | 35 casos con el formulario o la demo ya mandados: 35 / 35 detectados como pausa, sin gastar. 48 casos con el modelo: 39 / 48 en la primera corrida; los 9 que no coincidieron se revisaron (2 etiquetas eran discutibles y se ampliaron; 5 ajustes de reglas y prompt) y volvieron a correr: 9 / 9. Costo US$ 0,36 en total (~US$ 0,005 por caso con caché), 4 a 6 s por decisión. |
| Panel en un sandbox local (sesión abierta, OpenAI simulado) | La tarjeta se ve, Enviar manda los tres mensajes y quedan como de Pablo, el caso para Pablo muestra el motivo, la opción aparece en Ajustes. |

Comparación con el flujo anterior (`wabot_ia_pensar`, el de antes del precio) en los mismos casos:
en 6 aceptaciones de la demo el flujo viejo "esperaba" y el nuevo manda el formulario; en 3 dudas el
viejo callaba y el nuevo contesta; en los 14 casos de cotizar coinciden.

Lo que la corrida en vivo muestra del modelo: entiende aceptaciones indirectas ("te paso un catálogo,
me preparás?", "me interesa mucho… a ver cómo quedaría" en un audio), no manda el formulario al que
posterga, lee la cotización que Pablo pegó a mano y no la vuelve a dar, y escribe propuestas en el
estilo de Pablo ("Perfecto, te podemos armar una tienda online para que vendas…"). Donde sigue
preguntando de más es cuando la historia de Pablo ya fue ambigua (cortinas metálicas: "vender o
mostrar?" dos veces).

## Qué NO se verificó

- El webhook real con WhatsApp: todo el transporte fue simulado. El sandbox del panel usa OpenAI
  simulado; la interfaz con el modelo real solo se probó por consola.
- La evaluación en vivo es sobre fragmentos: el historial anterior a cada mensaje, nunca lo que
  siguió. Los 9 casos ajustados se volvieron a correr después de tocar las reglas, así que ese 9 / 9
  no es una prueba independiente. Conviene medir de nuevo con charlas de la semana que viene.
- Cursos online vs. presenciales e inmobiliaria casi no aparecen en el export de esta semana: están
  cubiertos por los tests simulados, no por charlas reales.
- No se corrió `test-charlas.php` ni `test-sondas-postprecio-1oct.php` a propósito: no se llaman
  "vivo" pero llaman a OpenAI real (la línea base los arrancó por error; US$ 0,12 de hoy son de eso).

## Decisiones pendientes de Pablo (detalle en `wabot/COMERCIAL.md`)

1. Hosting y dominio en el pago único: ¿incluidos el primer año (textos) o a cargo del cliente (lo que
   dijiste en los chats del 4 y 6-oct)? Mientras, el bot no lo menciona.
2. Cuotas: el plan las deja afuera; vos ofreciste "cuotas con interés" para el pago único y una
   respuesta rápida dice "elegís las cuotas". El bot no promete cuotas del anual ni del único.
3. Dominio .com: $40.000 por año (texto oficial) vs. $15.000 (respuesta rápida) vs. "no hay tanta
   diferencia". El bot usa $40.000.
4. Carga inicial de productos: "los primeros" / "los primeros 10" / "$500 por producto". El bot no da
   cantidad ni precio.
5. Dos webs: el código tiene el 20 % de descuento en ambas; el plan dice sin descuentos; el 5-oct
   cotizaste $40.000 / $240.000 por las dos. El flujo las deriva a vos.
6. Montos que diste a mano fuera de lista ($40.000 / $240.000 y $40.000 / $250.000): el bot solo los
   respeta si ya están en esa charla.
7. Web existente: "no trabajamos sobre webs hechas" (texto) vs. "se puede trabajar sobre una web
   existente" (respuesta rápida). El bot pide el link y dice que hace una nueva.
8. "Demo" vs. "primer diseño / muestra" en varias respuestas oficiales: unificar la palabra.
9. Turnos online en una informativa: según el plan son la solución "reservas" ($30.000); el texto
   oficial `turnos` dice "incluido, no se paga aparte". El bot no usa ese texto.
10. Catálogo con pedidos por WhatsApp = plan con panel ($30.000) y cursos presenciales = plan con
    panel: cambia lo que hacía el bot viejo (sitio profesional). Es lo que dice el plan.
11. Seña y saldo del pago único: están en las respuestas rápidas y en las páginas de pago, no en el
    bloque aprobado; el bot solo los dice si preguntan.

## Cómo seguir

1. Revisar este informe y `wabot/COMERCIAL.md`. Con el OK, commit y push (los archivos nuevos y los
   hunks en `textos.php`, `lib.php`, `engine.php`, `redactor.php`, `webhook.php`, `admin.php`,
   `test-precios.php`, `test-postprecio.php`; `err/pendientes.php` tiene un cambio previo ajeno que no se
   toca). El modo sigue en off al publicar.
2. En el panel: Ajustes → Inteligencia artificial → Flujo comercial nuevo → Sugerencias. Desde ahí,
   cada chat nuevo trae la sugerencia; las correcciones quedan en `data/sugerencias-log/` para revisarlas.
3. Después de una semana de sugerencias, decidir las 11 pendientes y, si las propuestas sirven,
   pasar a Automático para consultas nuevas y estándar. Volver a Sugerencias es un clic.

Archivos: `wabot/comercial.php`, `wabot/comercial-instrucciones.php`, `wabot/sugerencias.php`,
`wabot/COMERCIAL.md`, `wabot/SUGERENCIAS.md`, `wabot/test-comercial.php`, `wabot/test-sugerencias.php`,
`wabot/test-comercial-vivo.php`, `wabot/test-comercial-charlas.json`; cambios en `wabot/textos.php`,
`wabot/lib.php`, `wabot/engine.php`, `wabot/redactor.php`, `wabot/webhook.php`, `wabot/admin.php`,
`wabot/test-precios.php`, `wabot/test-postprecio.php`.
