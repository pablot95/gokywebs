# Auditoría de Wabot — 9 de septiembre de 2026

> **Nota del 10-sep-2026: cambió el modelo comercial.** Desde el 10 de septiembre ya no se vende un pago único: el precio es un primer pago más un plan mensual obligatorio que arranca a los 30 días (sitio profesional: $60.000 + $20.000 por mes; tienda online, plataforma de cursos e inmobiliaria: $90.000 + $30.000 por mes). Ya no hay pago único, seña ni saldo, y el segundo mensaje después del precio son los tres pasos del proceso, sin link: el link del formulario sale recién cuando el cliente contesta que sí. Las salidas del bot citadas más abajo con «$290.000», «$180.000», «pago único», «mantenimiento opcional» o «seña» (puntos 6, 9, 10 y 15) corresponden al modelo anterior: no son la respuesta esperada hoy. El resto del informe queda como se escribió.

## Estado al 10 de septiembre: corregido

Pablo pidió el 10-sep «lo que tengas que arreglar arreglalo». Se corrigieron los puntos 1 a 19, 22 y 23 (ver abajo), y el 20 en su parte segura (el tope de tokens pasa de 500 a 1.500; `thinkingConfig` no se tocó porque no se pudo probar contra la API). El 21 (IP real detrás de Cloudflare) quedó resuelto leyendo `CF-Connecting-IP` cuando existe; falta confirmar en producción que ese header llega.

Cada frase de este informe está ahora en `wabot/test-falsos-positivos.php` como control negativo, junto a los positivos que ya existían: 187 casos. Las 8 suites anteriores siguen en verde (3.006 casos); cinco aserciones se actualizaron porque el segundo mensaje del precio cambió a los tres pasos (pedido de Pablo del 10-sep, ver `wabot_config_ventas` en lib.php).

Lo que NO se tocó: la variante sin link del ofrecimiento (`msg_prediseno_oferta`, la que sale en Instagram o con el formulario apagado) sigue con el texto anterior; el bot sigue sin poder cumplir solo un «te escribo el lunes» a más de 24 h sin plantilla `retomar`; y la regla «producto = ecommerce sin preguntar» es de Pablo y se respeta.

## Dictamen

Las 8 suites locales pasan en verde (3.005 casos), así que lo que sigue no son regresiones de lo ya probado: son **falsos positivos de los detectores deterministas** que corren ANTES del modelo y que los tests nunca alimentaron con frases reales de cliente. Cada uno se verificó ejecutando el código con PHP local (sin Gemini, sin WhatsApp): las frases de abajo son las que se corrieron y el resultado es el que devolvió el motor, no una lectura.

El patrón común: un matcher de palabras decide algo **irreversible dentro de la charla** (baja, cierre, derivación, tipo de web) sobre un mensaje que no lo pedía. Como los cortes viven en el borde común (`wabot_responder`, `wabot_agente_intento`), aplican en modo agente igual que en el motor, y el modelo nunca llega a ver el mensaje.

Los puntos 1 a 4 son los que más cuestan: cierran o silencian charlas con frases que cualquier cliente argentino escribe todos los días.

## Fallas confirmadas, por gravedad

### 1. Cortesías y reclamos se leen como pedido de BAJA — el bot se apaga para siempre

`wabot_cierre_sin_presion_tipo()` (engine.php:319-330) devuelve `baja` con:

| Mensaje del cliente | Por qué |
|---|---|
| «Hola, no quiero molestar, cuánto sale una página web?» | `no … molestar\w*` |
| «no te quiero molestar, solo quería saber el precio» | ídem |
| «Hola, no me mandaron nada todavía, la demo?» | `no … mand\w* … nada` |
| «no me llegó nada, no me mandaste nada» | ídem |
| «no me escribieron más, sigue en pie?» | `no … escrib\w* … mas` |

Efecto reproducido de punta a punta: el bot contesta «Listo, no te escribimos más. Gracias por avisar», marca `cierre=baja`, `bot_off=true`. A partir de ahí webhook.php:258 ni siquiera llama al motor (`silencio / chat_off`): el «hola??» siguiente queda sin respuesta. El camino de reapertura de redactor.php:56-65 («pedir una web de nuevo sí la reabre») es código muerto en producción porque `bot_off` corta antes.

El caso 3 es el peor: es el cliente que **está esperando la demo** y pregunta por ella.

Corrección: el patrón de molestar tiene que exigir que el objeto sea el bot («no me molesten», «dejen de molestarme»), no un «no quiero molestar» del cliente; los de escribir/mandar tienen que excluir la tercera persona del plural y los verbos en pasado con «nada/todavía» («no me mandaron nada» es un reclamo, no una baja). Y ninguna baja debería salir de un mensaje que trae una pregunta.

### 2. «Estoy viendo de hacer una web» y «se puede en cuotas?» cierran la venta sin presión

Misma función, rama `consulta` (engine.php:356-365):

| Mensaje | Resultado |
|---|---|
| «Hola, estoy viendo de hacer una web para mi negocio de ropa» (primer mensaje) | «Dale, ningún problema. Si más adelante querés retomarlo, escribime por acá.» |
| «estaba consultando por el precio de una web» | ídem |
| «estoy viendo cómo hacer para vender más» | ídem |
| «no puedo pagar todo junto, se puede en cuotas?» (con precio dado) | cierre + «Ya queda anotado que lo tuyo sería sitio profesional…» |
| «cuando tenga las fotos te escribo» (en prediseño) | cierre |
| «cuando pueda te paso el logo y avanzamos» | cierre |

Queda `cierre=consulta_sin_presion`, `seguimiento_bloqueado=true` y `cta_muestra=true`. En producción el agente recibe en el prompt «Seguimiento comercial bloqueado: sí; no vendas ni ofrezcas la demo» (agente.php:2800) y solo `wabot_reabre_consulta()` («ahora sí», «quiero contratar», «mandame el CBU») lo destraba: el cliente que después describe su negocio con todas las letras no vuelve a recibir la oferta. Encima, con `cierre` puesto, un «ok dale» o un «sí» se contestan con silencio (redactor.php:316-322) y el motor calla ante todo mensaje corto que arranque con dale/ok/listo (engine.php:2687-2691).

Corrección: «estoy viendo/averiguando» sin «solo/nomás/por ahora» no es despedida; «no puedo pagar» seguido de una pregunta de cuotas es objeción de precio (ya existe `wabot_texto_objecion_precio_suave`); «cuando tenga X te escribo» en prediseño es el cliente prometiendo datos, no yéndose. Y el cierre no debería dispararse sobre un mensaje con `?`.

### 3. «No me interesa X» cierra como rechazo total

engine.php:333-339 solo exceptúa vender/cobrar/carrito/tienda. Verificado:

- «no me interesa el mantenimiento, solo la web» → «Perfecto, gracias por escribirnos…», `cierre=sin_interes`; el «dale, hagamos la demo» siguiente sale en silencio.
- «no me interesa la videollamada, prefiero por acá» (postdemo, con la videollamada recién ofrecida) → mismo cierre; el «me gustó, cómo sigo?» de después sí deriva, pero el panel ya lo tenía como rechazo.

Corrección: exigir que el objeto del «no me interesa» sea la web/el proyecto/«nada», o que no haya objeto (frase corta). Cualquier sustantivo de una función (mantenimiento, videollamada, hosting, redes, logo) es una condición, no un rechazo.

### 4. Un rubro de una sola palabra larga se toma por teclado apretado al azar

`wabot_token_implausible()` (engine.php:1225-1233) marca implausible toda palabra de 11 letras o más, o con 4 consonantes seguidas. `wabot_texto_ininteligible()` corre en `wabot_agente_intento()` (agente.php:171-189) justo cuando el cliente contesta «a qué te dedicás». Devuelven `true`: Electricista, Veterinaria, Inmobiliaria, Nutricionista, Odontología, Kinesiología, Restaurante, Construcción, Distribuidora, Indumentaria, Marroquinería, Gastronomía, Consultoría, Arquitectura, Instructor, Emprendimiento, y «Electricista matriculado».

Charla reproducida: «Electricista» → «Te lo pregunto de otra forma: a qué rubro te dedicás…»; «Electricista matriculado» → «No estoy pudiendo entender el mensaje…» + `handoff_pendiente`. Recién «Trabajo como electricista» destraba.

Corrección: sacar el techo de 11 letras (o subirlo a 16 y exigir que no tenga vocales alternadas) y correr `wabot_fallback_rubro_local()` ANTES del detector también en la primera falla, no solo con `$yaFallo > 0`.

### 5. «Atiendo por videollamada» deriva la charla como pedido de llamada

`wabot_pide_llamada()` (engine.php:1393-1415) matchea la palabra suelta `videollamada` y `podemos hablar` sin tema. El corte es el de redactor.php:240 y deriva SIEMPRE, en cualquier fase:

- «Soy psicóloga, atiendo por videollamada, quiero una web» → «Dale, eso lo hablás directo con el desarrollador… para coordinar la llamada», `fase=derivado`, sin precio.
- «doy clases de inglés por videollamada», «tengo un call center de llamadas», «podemos hablar por acá?», «Hola, podemos hablar mañana? tengo una peluquería» → lo mismo.

Corrección: «videollamada/llamada» solo cuenta con un verbo de pedido (quiero/podemos/me hacen una…) y no precedido de atiendo/doy/trabajo/hago; «podemos hablar» exige «por teléfono/con alguien/en persona» (ya está en la lista de arriba, sobra la variante suelta).

### 6. La palabra «local» convierte en tienda online lo que el modelo cotizó como sitio profesional

`wabot_fallback_rubro_local()` (engine.php:2522-2525) lista `local`, `imprenta`, `grafica`, `fabricamos` como productos. `wabot_agente_desempate_pendiente()` (agente.php:2334-2337) pisa el `landing` que eligió el modelo si ese matcher dice `ecommerce`. Verificado con `dar_precio(tipo=landing)` y el contexto «tengo un local de comidas y hago delivery, quiero una web»: sale «sería un ecommerce. Es un pago único de $290.000». Lo mismo con «local de comidas rápidas», «somos una imprenta», «fabricamos piscinas de fibra», «agencia de viajes con local en el centro».

El prompt dice explícitamente que un restaurante o bar es sitio profesional (agente.php:2561); el código lo contradice por la palabra «local». Y como «el precio no se cambia una vez dado», el error queda fijo para el resto de la charla.

Corrección: sacar `local`, `imprenta`, `grafica`, `fabricamos` de esa lista (o exigir «local de + producto»), y que el override del agente solo aplique cuando el matcher encuentra un producto concreto, no un sustantivo de lugar.

### 7. «La semana pasada» agenda un retomar dentro de una semana

`wabot_texto_pide_retomar_en()` (engine.php:1797-1799) toma «(la|proxima|que viene) semana» sin mirar lo que sigue. Con precio y boceto ya cerrados:

- «les escribí la semana pasada y no me contestaron» → «Dale, queda anotado: el desarrollador te escribe en una semana para retomarlo», `retomar_ts` +7 días, `seguimiento_bloqueado`.
- «ya hablamos con Pablo la semana pasada» → ídem.

Es un reclamo por falta de respuesta contestado con una postergación de siete días. Corrección: `la semana` solo con «que viene/próxima/entrante», nunca seguido de «pasada/anterior», y todo retomar debería descartarse si el verbo está en pasado (escribí, hablamos ya, mandé).

Riesgo asociado, ya conocido: cuando el retomar es a más de 24 h y no hay plantilla `retomar` en producción, el cron lo vence y le manda un push al desarrollador; el bot igual le dijo al cliente «te escribo el lunes». Es una promesa que el sistema no puede cumplir solo (lib.php:7008-7024).

### 8. Después de la demo, dos mensajes del mismo tipo derivan con el texto equivocado

`wabot_anti_repeticion()` (engine.php:605-676) deriva a la PRIMERA repetición de una tanda idéntica si no hay reformulación disponible, y `wabot_texto_reformulado()` solo conoce contame/desempates. En postdemo los textos fijos se repiten por diseño:

- «me encanta!!» → «Me alegro que te haya gustado. Le cambiarías algo?»; «quedó hermosa la verdad» → **«Perfecto. A partir de acá sigue el desarrollador…»** (el texto genérico de derivación, no `postdemo_derivar`), `fase=derivado`, `postdemo_avisado=0`.
- «dale, la voy a mirar y te digo» → «Dale, miralo tranquilo…»; «ahora la miro tranquilo y te aviso» → misma derivación.

Va contra la regla del 5-sep (avisar solo con interés real, seguir conversando mientras mira), y el panel no lo ve como «avanza» porque el flag no se marca. Corrección: en fase postdemo la repetición legítima de un texto fijo (elogio, la miro, cambios) tiene que contar como «repetición legítima» igual que el pedido de info, o directamente devolver `[]` a la segunda vez.

### 9. Un «te paso … con …» escrito por el modelo deriva la charla

`wabot_texto_anuncia_handoff()` (engine.php:1052) matchea `(te|lo|la) (paso|comunico|derivo|conecto|pongo en contacto) … (con|directamente)`. Devuelven `true`: «Te paso el detalle con lo que incluye el hosting», «te paso el link con los trabajos: gokywebs.com/portfolio», «Te paso la info directamente: el mantenimiento es opcional», «La conecto con el pixel de Meta sin problema».

Verificado por `wabot_salida_preparar()`: «Te paso la info directamente: el mantenimiento es opcional y son $15.000 por mes.» sale al cliente y deja `fase=derivado`, `handoff_pendiente=1`. El guard previo del agente (`wabot_texto_promete_info_sin_entregar`) no lo frena justamente cuando el texto trae un monto o un link, que es cuando la frase es legítima.

Corrección: exigir que el objeto sea una persona («te paso con el desarrollador/Pablo/una persona»), no «con» a secas; «te paso el/la/los» seguido de sustantivo de información nunca es un handoff.

### 10. Descuentos de la tienda del cliente se leen como regateo, y a la segunda deriva

`wabot_es_regateo()` (engine.php:369-391): «la tienda puede tener cupones de descuento?» → texto de objeción «Es pago único, sin costos mensuales…»; «pero se pueden hacer cupones de descuento o no?» → **derivación con causa `pago_explicito`**. También matchea «vendo con 10% de descuento los lunes» y cualquier «100% algodón» (`\d{1,2}%` toma «00%»).

Corrección: el regateo exige que el sujeto seamos nosotros («me hacés», «me dejás», «baja el precio»), no que aparezca la palabra descuento; los porcentajes solo pegados a «descuento/menos/rebaja».

### 11. Claves de info que responden preguntas que no se hicieron

`wabot_info_por_palabras()` (engine.php:3280-3546), verificado:

| Mensaje (fase) | Clave devuelta | Lo que sale |
|---|---|---|
| «puedo agregar más fotos a la demo?» (postdemo) | `carga` | el texto de quién carga los productos, en vez de anotar el cambio (`wabot_postdemo_pide_cambios` no reconoce «puedo agregar») |
| «puedo cambiar el precio de los productos yo?» (prediseño) | `carga` | aceptable |
| «vendo abonos mensuales de gimnasio» (menu) | `mantenimiento` | el plan de mantenimiento a quien contó su rubro |
| «quiero que mis clientes paguen por mercado pago» | `pago` | nuestras condiciones de pago |
| «cuánto tiempo llevan en el mercado?» | `plazos` | el plazo de entrega |
| «mi negocio se llama Buen Valor» (prediseño, precio dado) | `precio_actual` | el atajo de agente.php:245 repite el precio en vez de anotar el nombre |

Corrección puntual: `carga` no debería ganar en postdemo (ahí «agregar/cambiar/sacar» es un cambio a la demo; sumar «puedo/podría agregar» a `wabot_postdemo_pide_cambios`); `precio_actual` no puede depender de que el mensaje TERMINE en valor/precio/costo; `mantenimiento` necesita forma de pregunta como el resto (misma regla de [[tecnica_wabot_matcher_rubro_vs_pregunta]]).

### 12. El flyer del propio cliente se descarta como proveedor

`wabot_texto_es_proveedor()` (engine.php:475-505). Una agencia de marketing que pega su presentación y cierra con «Quiero una página web para mostrar nuestros servicios» (≥90 caracteres, nombra «marketing digital/redes sociales», trae «consultanos» y «nuestros planes son») → silencio, `cierre=proveedor`, `seguimiento_bloqueado`. Después el prompt del agente le dice que no venda. Agencias, community managers y estudios de diseño son compradores reales de webs.

Corrección: si el mensaje además PIDE una web («quiero/necesito una página/web»), gana el pedido, como ya hace `wabot_contexto_consulta()`.

### 13. Reclamos laborales y de clientes viejos por palabras sueltas

`wabot_contexto_consulta()` (engine.php:1629-1655): «necesito más trabajo para mi taller» → `laboral` («las propuestas para sumarse al equipo las ve Pablo»); «ya pagué otra web y fue un desastre, quiero una nueva» → `cliente_existente`. En los dos casos queda `handoff_pendiente`, `seguimiento_bloqueado` y silencio hasta que escriba «quiero una web» textual.

### 14. «Quiero avanzar con la demo» autoriza un handoff de pago

`wabot_handoff_causa_explicita()` (engine.php:2121) devuelve `pago_explicito` con «Dale, quiero avanzar con la demo gratis» y con «quiero arrancar con una web para mi negocio». Es la autorización que usan el clasificador (`quiere_avanzar`) y la herramienta `derivar`: si el modelo la llama con ese mensaje, la charla se deriva sin precio ni boceto. Corrección: excluir «avanzar/arrancar» cuando el objeto es la demo/muestra/web.

### 15. El reset a los 7 días deja marcas de la sesión vieja y el precio sale mutilado

`wabot_conv_reset_si_vieja()` (lib.php:3906-4001) no limpia `pitch_hecho`, `pitch_tipo`, `link_form_enviado`, `form_completado_ts` (ya anotado como L), `mixto_avisado`, `bilingue_avisado`, `prediseno_acuse_respondido`, `hermana_adoptada`, `avance_sello`. Reproducido: cliente que vuelve a los 20 días y dice «soy abogado» → `wabot_pitch_corresponde()` es `false` por `pitch_hecho`, y `wabot_msg_precio_texto()` elige `msg_precio_tras_pitch` porque `pitch_tipo` coincide: sale **«Para una web de este tipo, el desarrollo queda en $180.000.»**, sin descripción, sin nombrar el rubro y sin el texto que dictó Pablo. Y como `form_completado_ts` sobrevive, no hay link del formulario: le pide los datos por chat.

### 16. «Primero» + «pago» en la descripción del negocio

`wabot_texto_pregunta_cuando_se_paga()` (engine.php:2045-2060): «Hago pagos con mercado pago en mi local, primero quiero ver ejemplos» → contesta «La demo no se paga: primero te la mostramos…». Bajo, pero corre antes del modelo en toda charla sin demo.

## Fallas de código e infraestructura (verificadas leyendo, no reproducibles sin Meta)

### 17. Si Pablo contesta desde la app mientras el bot piensa, su respuesta se descarta y el bot no se pausa

webhook.php:499-500 (WhatsApp) y 444-445 (Instagram): si el candado de la charla está tomado, el eco humano se salta con `continue`. El bot retiene el candado 20 s de espera inicial + hasta 3 llamadas a Gemini + demoras de tipeo: es exactamente la ventana en la que Pablo, viendo el mensaje en el celular, contesta rápido. Resultado: el bot responde encima de Pablo, no se pausa 24 h y la respuesta humana no queda en el transcript. Corrección: en vez de descartar, anotar el eco en un archivo aparte que el bot lea al soltar el candado (o esperar el candado con `wabot_lock_tomar_esperando`).

### 18. Un mensaje que entra durante el «rescate de la cola» queda varado

webhook.php:355-367 y 370-399: el rescate (`wabot_procesar_entrante_reintento`) drena la cola una sola vez y no vuelve a mirar. Si un tercer mensaje llega mientras ese rescate está en Gemini, su proceso no consigue el candado, se va, y el mensaje queda en `data/cola/` hasta que el cliente vuelva a escribir. El cliente ve que el bot contestó lo anterior y no lo último. Baja probabilidad, pero es el escenario de la ráfaga de tres mensajes, muy común en WhatsApp. Corrección: que el rescate use el mismo `do … while (wabot_cola_tiene())` del camino principal.

### 19. La foto o el documento pierden el texto que los acompaña si Gemini no los lee

webhook.php:123-144 y 200-211: para imagen y audio, el `caption` solo se conserva si `wabot_media_a_texto()` devolvió algo. Con la IA caída, el circuito abierto (429), o una foto de más de 12 MB (`WABOT_MEDIA_MAX_LEER`), «Este es mi logo, quiero estos colores» se transforma en `[imagen]`: el bot contesta «Me llegó tu archivo… contame de qué se trata» y en el transcript de Pablo tampoco queda el texto. En la rama de documentos sí se rescata el caption (línea 190); falta lo mismo para imagen y audio.

### 20. El 30 % de los turnos descartados del agente son por `MAX_TOKENS`

En los logs locales hay 86 «respuesta cortada / MAX_TOKENS» contra 28 del siguiente motivo. `wabot_agente_llamar()` (agente.php:2850) manda `maxOutputTokens: 500` y no fija `thinkingConfig`; en los modelos Flash el razonamiento interno consume ese mismo presupuesto, así que una respuesta de dos líneas puede cortarse antes de empezar. Cada corte tira el turno al motor de reglas, que es donde nacen la mayoría de los falsos positivos de arriba. Es una hipótesis (no se llamó a la API), pero explica que se corte un texto que nunca supera las 3 líneas. Corrección: subir el tope a 1.500-2.000 o poner `thinkingConfig.thinkingBudget` bajo, y loguear `usageMetadata` para confirmarlo.

### 21. El freno por IP del formulario puede ser un freno para todos

`wabot_form_rate_ok()` (lib.php:7516) cuenta por `REMOTE_ADDR` (form-lead.php:36). Si gokywebs.com está detrás del proxy de Cloudflare y Hostinger no reescribe la IP real, todos los visitantes comparten unas pocas IPs de borde y el tope de 10 envíos cada 10 minutos se alcanza entre clientes distintos en cualquier pico de campaña. Hay que verificar en producción qué trae `REMOTE_ADDR` (o usar `CF-Connecting-IP` cuando exista).

### 22. El formulario se rinde antes de que el bot suelte el candado

form/script.js:345-354 reintenta 3 veces con 0,9/1,8/2,7 s (≈5 s en total). El bot retiene el candado 10-20 s de espera más Gemini más tipeo (20-40 s). Un cliente que manda «dale» por WhatsApp y enseguida completa el formulario ve «El sistema estaba ocupado un instante… tocá Enviar de nuevo». No pierde los datos, pero es fricción justo en el paso que convierte.

## Lo que sí funciona y no hace falta tocar

- Dedup atómico de mensajes, cola por conversación y candado: correctos salvo la ventana del punto 18.
- El borde común de `wabot_responder()` y el punto único de salida: bien resuelto; el problema es lo que se decide adentro, no la arquitectura.
- Los cambios del 8-sep (postdemo coherente, horario de última llamada, form que no pisa, agenda de retomar) están en su lugar y sus suites en verde.

## Método y límites

- Se leyeron completos webhook.php, redactor.php, engine.php, agente.php y las secciones de lib.php que tocan el flujo (cola, candado, conversación, seguimientos, formulario, envío). admin.php solo en presentar/responder/reset.
- Verificación: dos scripts locales que llaman a las funciones con frases de cliente y corren `wabot_responder()` con el mismo orden que el webhook (transcript y `ultimo_cliente_ts` antes), sin red. Cada tabla de este informe es salida real de esos scripts.
- No se llamó a Gemini: todo lo reportado ocurre ANTES del modelo o después de su texto, así que no depende de él. Lo que sí depende del modelo (qué clave elige, cuándo llama una herramienta) no está medido acá; para eso está la batería en vivo.
- No se revisaron datos de producción (no hay `data/conv/` local): las frecuencias son de sentido común, no medidas.
