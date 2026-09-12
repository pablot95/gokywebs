# Auditoría del wabot — 11 de septiembre de 2026

Revisión del proyecto local `Gokywebsweb`, con conversaciones nuevas y la IA real configurada en el bot (`gemini-3.5-flash`). Se usó el mismo recorrido de respuesta y filtros de salida que el webhook, con identificadores `QATEST`. No se enviaron mensajes a clientes ni se crearon leads reales.

Durante la revisión entró otro cambio en los archivos: el precio y los tres pasos se unieron en un solo mensaje y se amplió la explicación de los pasos. La última batería vuelve a comprobar los diez escenarios sobre esa versión, con las correcciones de esta auditoría.

## Correcciones

1. **Dar de baja una propiedad apagaba el bot.** “Puedo dar de baja una propiedad cuando se vende y cargar otra yo mismo?” recibía “Listo, no te escribimos más”. Las preguntas siguientes quedaban sin respuesta. Ahora distingue las tareas del panel de una baja de contacto. También se cubrieron bloquear usuarios y quitar una foto, conservando los pedidos reales de no recibir mensajes.

2. **La demo parecía costar $90.000.** A “Cuánto tengo que pagar ahora para ver la demo?” respondía con el primer pago y las condiciones de financiación. Ahora empieza por “La demo no se paga” y explica que el primer pago corresponde a avanzar con el desarrollo. Se verificó tanto en modo agente como en modo fijo.

3. **El cambio de servicios a tienda perdía el contexto.** Al sumar venta de skincare a una web de estética, primero decía que el precio debía cotizarlo el desarrollador; después repetía los $60.000 + $20.000 del sitio profesional. Al aceptar una demo con tienda, el formulario seguía vinculado al tipo anterior. Ahora informa $90.000 + $30.000 para la tienda completa, conserva esa alternativa mientras el cliente consulta y actualiza el tipo y el precio cuando la acepta. La alternativa pendiente se limpia al reiniciar una sesión antigua. Combinar tienda con cursos o un sistema de gestión sigue siendo un alcance distinto.

4. **Un cambio de la demo tapaba una pregunta.** “Podés cambiar el fondo a beige? Y los turnos online están incluidos?” recibía solo el acuse del cambio. Ahora guarda el cambio y responde la consulta en el mismo turno. Se incorporaron las funciones nuevas al seguimiento de preguntas y se conservaron los signos de interrogación y el punto de `.com` al separar las frases.

5. **“Ya completé todo, te llegó?” no miraba la recepción.** Contestaba “cuando completes el formulario arrancamos”, aunque el cliente acababa de decir que lo había completado. El signo de pregunta impedía entrar al control existente. Ahora distingue la pregunta de recepción y comprueba si el formulario llegó: si falta, lo dice y recuerda tocar Enviar; si llegó, lo confirma.

6. **Cupones y Mercado Pago recibían la explicación del carrito.** Agregué respuestas concretas para crear cupones y para cobrarles a los compradores con Mercado Pago. También se corrige la elección de una respuesta genérica cuando el modelo selecciona la clave equivocada. La función de cupones está respaldada por la sección Promociones de `paneladmin/index.html`. Se conserva la diferencia entre cobrarles a los clientes de la tienda y pagarle a Gokywebs.

7. **Los adicionales se contradecían.** El texto decía “solo dos adicionales” o “el único adicional”, pero el dominio `.com` tiene una renovación adicional de $40.000 por año. Se eliminaron esas afirmaciones de exclusividad, incluso del contexto que recibe el modelo. Además, se aclaró que los $500 por producto extra corresponden a la carga realizada por nosotros: el cliente puede cargarlo desde su panel. La configuración anterior se corrige al cargarla y queda estable en cargas sucesivas.

8. **El acceso de alumnos recibía un resumen de todo el plan.** La consulta por el acceso ahora usa la respuesta sobre usuarios. Si además pregunta por `.com`, se contestan ambas cosas sin listar productos ni adicionales que no vienen al caso.

9. **Había advertencias ocultas detrás de pruebas en verde.** Se corrigió el acceso a `origen_prediseno` cuando todavía no existe. También se arreglaron pruebas que usaban conversaciones antes de definirlas, índices incorrectos de rangos, un nombre de variable mal interpolado y campos retirados. Tras el cambio a un solo mensaje se adaptaron las comprobaciones de demora y contenido que todavía buscaban un segundo mensaje inexistente.

10. **Un pedido cordial de asesor se tomaba como aceptación de demo.** “Me gustaría hablar por acá con un asesor antes de decidir” recibía el formulario. Se agregó esa forma de pedir una persona y se priorizó la derivación antes de las reglas de aceptación de la demo. El caso se volvió a ejecutar por separado después de corregirlo.

## Las diez conversaciones

Los escenarios tienen 39 mensajes de cliente en total. Las transcripciones incluyen respuestas reales, estado del bot y resultado esperado por caso.

| Caso | Conversación | Qué se comprueba |
|---|---|---|
| A01 | Psicóloga que atiende por videollamada | Precio, turnos, idiomas, aceptación y ausencia de logo |
| A02 | Tienda de ropa de bebé | Cupones, estadísticas y cobros por Mercado Pago |
| A03 | Pastelería que pide Wix | Respuesta sobre plataforma, continuidad de la venta, plan obligatorio y baja |
| A04 | Alquiler de sonido e iluminación | Rubro concreto, formulario, datos por chat, marca Buen Valor y colores |
| A05 | Cursos grabados de pastelería | Acceso de alumnos, `.com`, demo gratuita y formulario |
| A06 | Inmobiliaria | Editar y dar de baja propiedades sin perder el contacto, titularidad y formulario |
| A07 | Estética que suma skincare | Alternativa de tienda, precio total y cambio de tipo al aceptar |
| A08 | Demo ya presentada | Cambio visual, pregunta sobre turnos, elogio y solicitud de contratación |
| A09 | Veterinaria | Cortesía inicial, rubro de una palabra, rechazo solo a videollamada y asesor |
| A10 | Electricista | Aceptación, consulta de recepción y reenvío del formulario |

Transcripciones:

- [Primera ejecución: diez escenarios](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-charlas-11sep-auditoria-antes.txt).
- [Repetición de los seis escenarios afectados](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-charlas-11sep-auditoria-despues.txt).
- [Tercera ejecución de los diez escenarios; detectó el caso del asesor](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-charlas-11sep-auditoria-final.txt).
- [Repetición del caso del asesor después de corregirlo](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-charlas-11sep-auditoria-asesor.txt).
- [Casos reproducibles](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-charlas-11sep-auditoria.json).
- [Pruebas de regresión añadidas](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-auditoria-11sep.php).

## Mejoras de texto aplicadas

Las siete sugerencias quedaron aplicadas tras la aprobación de Pablo, con validación terminada el 12 de septiembre. Se conserva el formato de precio y tres pasos definido en el proyecto. Las configuraciones guardadas también reciben las correcciones al cargarse, sin volver a la versión anterior en cargas sucesivas.

| Texto observado | Problema | Cambio aplicado |
|---|---|---|
| “Querés que te preparemos la demo gratis…?” después de sucesivas dudas | La invitación repetida puede sonar insistente cuando el cliente todavía compara funciones. | Contestar la duda y reservar la invitación para cuando termina de consultar. |
| “Para tu alquiler de sonido e iluminación…” | El rubro se entiende, pero suena poco natural. | “Para tu servicio de alquiler de sonido e iluminación…” |
| “Con eso ya lo preparamos… mandame el logo y 3 o 4 fotos…” | Parece dar por cerrado el pedido y, a la vez, poner otra condición para empezar. | “Ya tenemos los datos para preparar la demo. Si tenés logo o fotos, mandámelos para personalizarla.” |
| “Le cambiarías algo?” después de haber anotado un cambio | No reconoce explícitamente el ajuste que el cliente ya pidió. | “Los cambios que pediste ya quedaron anotados. Querés ajustar algo más?” Solo se usa cuando hay cambios guardados. |
| “No te lleva más de un minuto” | Promete un tiempo que depende de lo que el cliente tenga preparado. | “Es un formulario cortito.” |
| “No tenés que ocuparte de nada” | Es demasiado absoluto: el cliente todavía debe aportar datos, revisar la demo y confirmar contenido. | “Nos ocupamos del armado y de lo técnico.” |
| “Para seguir con el proyecto te va a escribir el desarrollador desde otro número” ante “cómo hago el primer pago?” | La derivación corresponde al flujo, pero no explica para qué lo contactan. | “El desarrollador te va a escribir desde nuestro número de proyectos para coordinar el primer pago y los cambios.” |

La invitación repetida se controla tanto en las instrucciones de la IA como al preparar la respuesta final. El control conserva la primera oferta, las explicaciones, los precios, los enlaces y las preguntas necesarias para preparar la demo. El cierre distingue si ya llegaron fotos o solamente el logo.

Además, se corrigió la detección de “Cómo hago el primer pago?” y “Cuánto es el primer pago?” después de presentar la demo: ahora deriva para coordinar ese pago aunque el cliente no agregue “quiero contratar”. Los cobros a los compradores de su tienda siguen siendo otra consulta.

La repetición completa de los diez escenarios sumó **39 mensajes de cliente**, sin excepciones, advertencias ni silencios. Se revisaron las respuestas y el estado guardado: los diez tipos y precios son correctos, ningún contacto quedó dado de baja y solo se deriva cuando corresponde. El caso de alquiler respondió con una propuesta natural sobre sus equipos; la variante “tu alquiler de…” también queda normalizada y cubierta por regresión.

- [Diez conversaciones con los textos aplicados](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-charlas-11sep-textos-aplicados.txt).
- [Treinta regresiones nuevas de redacción y contexto](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/test-textos-auditoria-11sep.php).

## Validación y alcance

Los archivos PHP revisados pasan la validación de sintaxis. Las 14 suites suman **3.594 comprobaciones aprobadas**, sin fallos ni advertencias. De ellas, 83 son regresiones añadidas en esta auditoría y en la aplicación de los textos. También se verificó que las modificaciones no tengan errores de formato en el diff.

La revisión cubre el motor local, sus filtros, el estado de las conversaciones y respuestas de Gemini. El envío efectivo por WhatsApp/Instagram y el servidor publicado no forman parte de estas simulaciones. Los cambios quedaron en los archivos locales.

**Cierre de validación:** los diez escenarios quedaron verificados después de sus correcciones y de aplicar los textos. Hubo 144 mensajes de cliente entre la primera ejecución y todas las repeticiones. Se comprobó además el estado guardado: tipo y precio aceptados, nombre y colores del negocio, cambio de la demo y derivación cuando corresponde. Las conversaciones ficticias se retiraron del almacenamiento local; se conservan las transcripciones para revisar las respuestas.
