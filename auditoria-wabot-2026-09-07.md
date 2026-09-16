# Auditoría de Wabot — 7 de septiembre de 2026

> **Nota del 10-sep-2026: cambió el modelo comercial.** Desde el 10 de septiembre ya no se vende un pago único: el precio es un primer pago más un plan mensual obligatorio que arranca a los 30 días (sitio profesional: $60.000 + $20.000 por mes; tienda online, plataforma de cursos e inmobiliaria: $90.000 + $30.000 por mes). Ya no hay pago único, seña ni saldo, y el segundo mensaje después del precio son los tres pasos del proceso, sin link: el link del formulario sale recién cuando el cliente contesta que sí. Este informe es anterior al cambio: las salidas esperadas que se citen con «$290.000», «pago único», «mantenimiento opcional» o «seña», acá o en las suites que menciona, corresponden al modelo anterior. El resto del informe queda como se escribió.

## Dictamen

El bot tiene una base importante: atención por WhatsApp e Instagram, lectura de adjuntos, historial, ficha del negocio, precios centralizados, herramientas de IA, reglas de respaldo, derivación humana, panel, recordatorios y numerosas pruebas. La prioridad es hacer que cada respuesta respete la consulta completa y que cada compromiso tenga una acción verificable detrás.

El problema más relevante es la distancia entre **lo que el bot dice, lo que guarda y lo que realmente ejecuta**. Hay ejemplos reproducibles de preguntas omitidas, cambios que dice anotar pero no incorpora a la ficha, contactos futuros prometidos sin una tarea que los ejecute y estados comerciales que avanzan sin confirmar la entrega de los mensajes.

## Alcance y evidencia

- Código local de `Gokywebsweb/wabot`: motor, agente, filtros de respuesta, persistencia, webhook, formulario, seguimientos y panel. Se revisó también la conexión con `form/script.js`, `form/index.html` y el seguimiento del formulario.
- Contraste con las conversaciones del 3 y 4 de septiembre aportadas previamente. El código actual contiene cambios posteriores; un fallo de esos chats no se considera automáticamente vigente.
- Pruebas en una copia aislada, sin datos de clientes y con credenciales de prueba. No se llamó a Gemini, WhatsApp ni Firestore reales.
- Diez archivos PHP de ejecución pasan la revisión de sintaxis.
- Ocho suites existentes: 2.870 comprobaciones, 2.867 aprobadas y tres fallidas. Las tres fallas son expectativas de textos antiguos, detalladas al final.
- Se agregaron escenarios de auditoría únicamente en la copia aislada para comprobar los problemas descritos.
- No se verificó el despliegue ni su configuración efectiva en producción. La calidad de las respuestas generadas por el modelo real requiere otra prueba; los fallos deterministas identificados no dependen de ese modelo.

## Lo que más le falta

### 1. Una ficha de la oportunidad comercial, además de la ficha del negocio

Ya hay nombre, descripción, colores, referencia, objetivo y datos para el diseño. Falta representar de manera uniforme:

- Qué quiere conseguir y qué funciones pidió explícitamente.
- Qué no quiere: por ejemplo, carrito, pagos online o un abono.
- Qué oferta se acordó y qué alcance queda por confirmar.
- Qué preguntas siguen sin respuesta.
- Qué frena el avance: presupuesto, dudas, comparación, decisión compartida o falta de tiempo.
- Quién tiene el próximo paso, cuál es y cuándo corresponde.

Esto debe aprovechar lo que el cliente ya contó; no convertirse en un interrogatorio adicional. Un caso debería poder resumirse como: “Quiere mostrar paneles solares y recibir consultas. Rechazó ecommerce. Falta explicar el alcance del sitio profesional. Confirmará el lunes con su socia”.

### 2. Resolver todas las intenciones de un mensaje

Un mensaje puede contener un elogio, un cambio y dos preguntas a la vez. Hoy varios atajos devuelven una respuesta y terminan el turno al encontrar la primera coincidencia. La lógica debe identificar todas las partes, registrar los aportes y responder las dudas antes de proponer otro paso.

La validación actual de temas respondidos busca palabras, no comprueba que la respuesta resuelva la pregunta. Una frase como “El hosting te lo explica el desarrollador” alcanza para considerar cubierto “hosting”.

### 3. Tareas y compromisos con fecha

“Te escribo el lunes”, “te envío la demo mañana” y “lo revisa el desarrollador” necesitan una tarea con fecha, estado y responsable, visible hasta que se cumpla. Si el contacto futuro será manual, debe aparecer de forma explícita en una cola de pendientes y generar una alerta al vencer.

Hoy existen marcas, bandejas y notificaciones, pero no completan este circuito. La fecha de recontacto se exporta en los datos de la lista sin aparecer utilizada en el código del panel revisado.

### 4. Un recorrido medible desde la consulta hasta el resultado

Separar: recibió presupuesto, respondió, aceptó demo, abrió formulario, empezó, completó, recibió demo, mostró intención de avanzar, fue atendido por una persona y tuvo un resultado comercial.

El contacto y el proyecto deberían tener una identidad común entre Instagram, WhatsApp y formulario. Ya hay mecanismos de vinculación entre conversaciones; falta usarlos también en la medición y separar proyectos distintos del mismo contacto.

También hacen falta motivos de pérdida o pausa. “No respondió”, “no le alcanza”, “lo ve el mes próximo” y “pidió otro servicio” requieren tratamientos diferentes.

### 5. Un formulario que aproveche el chat

El enlace actual identifica la conversación, pero no precarga el nombre del negocio ni su descripción. El formulario tiene soporte parcial para parámetros antiguos; el enlace nuevo solo lleva código y, en Instagram, una marca de canal.

Conviene precargar de forma segura los datos ya conocidos, pedir solamente lo que falta y permitir delegar decisiones de diseño. La confirmación debe explicar qué se recibió y el próximo paso. Los errores deben ser específicos y recuperables.

### 6. Garantías de entrega y recuperación

Debe poder distinguir: respuesta preparada, enviada, aceptada por el proveedor, entregada y fallida. Una caída del servidor o del proveedor no debería hacer desaparecer trabajo pendiente ni dejar el estado comercial por delante de lo que recibió el cliente.

### 7. Una derivación que facilite el trabajo humano

La bandeja y las notificaciones existentes son útiles. Falta completar la entrega con un resumen breve, la duda concreta pendiente, el último acuerdo, la urgencia y un control de cuánto lleva esperando. Esto permite que el desarrollador continúe la conversación sin pedir nuevamente toda la información.

### 8. Evaluación del recorrido completo

Las pruebas existentes cubren muchas reglas y casos históricos. Falta una batería que reproduzca conversaciones completas y evalúe también qué se guardó, qué se envió y qué tarea quedó pendiente. El simulador del panel debe usar exactamente el mismo procesamiento final que el webhook.

## Errores e incoherencias comprobados

### A. Las respuestas fijas posteriores a la demo se comen preguntas — prioridad alta

**Prueba:** “Me gustó, pero cuánto sale y tiene mantenimiento mensual?” devuelve únicamente “Me alegro que te haya gustado. Le cambiarías algo?”.

**Segunda prueba:** “Quiero cambiar el color y saber cuánto cuesta el mantenimiento” devuelve únicamente “Perfecto, anoto esos cambios para aplicarlos cuando avancemos”.

El atajo de postdemo termina la respuesta antes de que el agente pueda atender las otras preguntas. Esto sigue vigente en el código actual, aunque existan instrucciones que obliguen al modelo a responder todo.

**Corrección:** registrar elogio/cambios sin cerrar el turno; procesar las preguntas pendientes y componer una respuesta conjunta.

Fuentes: [redactor.php:65](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/redactor.php:65), [engine.php:4945](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/engine.php:4945), [engine.php:1714](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/engine.php:1714).

### B. Dice que anotó cambios, pero no los guarda en la ficha — prioridad alta

**Prueba:** “Sí, quiero cambiar los colores” recibe la confirmación de anotación, pero `cambios_pedidos` sigue vacío.

El mensaje permanece en el historial; no se pierde la conversación. Lo que falla es la anotación estructurada que el bot afirma haber hecho. La herramienta para guardar cambios existe, pero este atajo la evita. Otra rama, después de la derivación, sí escribe ese campo: el comportamiento depende de la etapa.

**Corrección:** una única operación que guarde el pedido y luego lo confirme, usada en todas las fases.

Fuentes: [engine.php:4963](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/engine.php:4963), [redactor.php:98](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/redactor.php:98), [agente.php:2260](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/agente.php:2260).

### C. Promete recontactar y no crea una tarea ejecutable — prioridad alta

**Prueba:** “Contactame en 30 días” guarda `retomar_ts`, bloquea los seguimientos y responde “te escribo en un mes”. Al llegar la fecha, los dos procesos de seguimiento revisados siguen devolviendo que no corresponde escribir. No hay un proceso que consuma la fecha y complete el compromiso.

Además, el intérprete no reconoce “Escribime el lunes”, “Hablamos mañana” ni “Vuelvo a principios de octubre y te escribo”. Reconoce algunos plazos relativos, como 30 días o una semana.

**Corrección:** interpretar fechas de calendario, distinguir “yo te aviso” de “escribime vos” y crear una tarea real. Si será manual, mostrarla y alertar al responsable.

Fuentes: [agente.php:126](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/agente.php:126), [engine.php:1755](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/engine.php:1755), [lib.php:4838](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:4838), [lib.php:6699](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:6699).

### D. El último recordatorio puede enviarse de madrugada — prioridad alta

**Prueba:** una conversación elegible a la 01:00 devuelve `true` para la última llamada, aunque la comprobación del horario permitido devuelve `false`.

La última llamada usa las horas transcurridas desde el mensaje del cliente, pero no aplica el horario de contacto que usa el seguimiento habitual. El bloqueo por “te aviso” también dura solo hasta que cambia el día.

**Corrección:** una política compartida de horario, pausa, rechazo, fecha pactada y responsable del próximo paso para todos los automatismos.

Fuentes: [lib.php:6810](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:6810), [lib.php:6657](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:6657), [engine.php:1549](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/engine.php:1549).

### E. El panel confunde actividad con interés — prioridad alta

**Prueba 1:** una conversación con precio comunicado y ninguna respuesta posterior devuelve que está interesada.

**Prueba 2:** un mensaje posterior a la demo que dice “No me interesa, no quiero avanzar” devuelve `true` en el indicador de interés después de la demo.

Son dos funciones diferentes: una trata `precio_dado` como interés; la otra trata cualquier respuesta como interés. Sirven para detectar actividad, pero sus nombres y el uso comercial inducen a priorizar mal.

**Corrección:** separar actividad, recepción, evaluación, aceptación, rechazo y decisión aplazada. Conservar cada señal con su fecha.

Fuentes: [lib.php:4928](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:4928), [lib.php:4958](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:4958).

### F. El formulario puede modificar una conversación sin verificar pertenencia — prioridad alta

**Prueba local:** una petición con un teléfono de prueba, sin código y sin autenticación, fue aceptada y reemplazó la descripción de una conversación de prueba existente.

La validación controla presencia y longitud de campos, pero no acredita que quien envía sea dueño de la conversación. Los códigos cortos también funcionan como identificadores de acceso y no tienen una protección equivalente a un token de alta entropía. La política CORS no autentica al remitente.

**Corrección:** permitir altas públicas sin habilitar la sobrescritura automática de contactos existentes; usar un token firmado y con vencimiento para vincular y actualizar una conversación. Añadir límites de frecuencia y una confirmación cuando se cambia el contacto.

No se hicieron peticiones contra el formulario público ni se alteraron datos reales.

Fuentes: [form-lead.php:19](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/form-lead.php:19), [lib.php:7222](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:7222), [lib.php:7306](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:7306).

### G. El procesamiento de mensajes no garantiza recuperación después de una caída — prioridad alta

**Evidencia de código:** se responde 200 al webhook antes de persistir el trabajo; se marca el mensaje como visto antes de preparar y guardar la entrada; la cola se vacía al tomar una tanda; y la conversación se guarda después de intentar los envíos, aunque alguno falle.

Esto deja ventanas de fallo: una caída puede dejar un mensaje marcado como visto sin completar su atención, o una conversación avanzada sin haber entregado la respuesta que justificaba ese avance. No se observó un incidente productivo de este tipo durante esta auditoría; es una condición de fallo identificable en el flujo.

El aviso asíncrono de entrega fallida se agrega al historial, pero no vuelve a poner el envío en una cola de recuperación ni corrige la etapa comercial.

**Corrección:** bandeja persistente de entrada, estado de procesamiento y bandeja de salida con identificador, intentos y resultado; evitar avances que dependan de una entrega no confirmada.

Fuentes: [webhook.php:48](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/webhook.php:48), [webhook.php:93](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/webhook.php:93), [webhook.php:328](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/webhook.php:328), [webhook.php:520](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/webhook.php:520), [lib.php:2755](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:2755).

### H. Presentar una demo puede registrar un avance que no ocurrió — prioridad alta

El panel cambia la fase a postdemo y registra `muestra_presentada` y el evento comercial externo aunque no se haya enviado el mensaje que contiene el enlace. El campo `presentado_via_bot` distingue el resultado, pero no condiciona esos otros avances.

Además, esta operación y la escritura del aviso de entrega fallida no toman el mismo candado de conversación que usa el webhook. Una escritura concurrente puede reemplazar información más reciente. Las pruebas actuales de concurrencia no cubren estos caminos.

**Corrección:** distinguir intento, envío y entrega; confirmar los estados correctos y usar el mismo control de concurrencia en todas las escrituras del chat.

Fuentes: [admin.php:488](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/admin.php:488), [admin.php:528](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/admin.php:528), [admin.php:536](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/admin.php:536), [webhook.php:533](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/webhook.php:533).

### I. Hay una regla comercial que fuerza ecommerce — decisión a revisar

El agente recibe explícitamente la instrucción “Si vende CUALQUIER producto, el tipo es ecommerce y no se pregunta nada antes de cotizar”. No es únicamente una equivocación ocasional del modelo: el comportamiento forma parte del diseño actual.

Esto simplifica la oferta, pero puede chocar con quien pide presentar productos y recibir consultas sin carrito. Hay excepciones para trabajos a medida y algunas correcciones de modalidad, por lo que no todos los casos se comportan igual.

**Recomendación:** conservar el catálogo comercial que decidas vender, pero priorizar las funciones y exclusiones expresadas por el cliente. Si una opción no se ofrece, explicarlo claramente; no atribuirle una necesidad de cobro online que no manifestó.

Fuentes: [agente.php:2548](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/agente.php:2548), [agente.php:2581](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/agente.php:2581), [lib.php:2261](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:2261).

### J. La medición del formulario no queda vinculada al chat — prioridad media

Existe seguimiento de entrada, inicio, campos y éxito del formulario; sería incorrecto afirmar que no hay medición. El problema es la integración.

**Prueba:** abrir los formatos actuales `?c=AB` y `?c=AB&ig=1` sin referente hace que el detector de origen devuelva `nativo`. No interpreta el código como procedencia WhatsApp ni el parámetro `ig=1` como Instagram. El evento tampoco incluye el identificador de la conversación, y el envío del formulario no lleva el identificador de sesión de analítica.

El resumen del embudo del bot acumula eventos por conversación/sesión y no incorpora el recorrido completo del formulario, ni une automáticamente las conversiones entre canales.

**Corrección:** un identificador común de oportunidad, atribución explícita desde el enlace, intervalos de fechas y un recorrido agregado consistente.

Fuentes: [form/script.js:23](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/form/script.js:23), [form/script.js:61](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/form/script.js:61), [form/script.js:256](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/form/script.js:256), [lib.php:6555](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:6555).

### K. El formulario permite llegar a errores evitables — prioridad media

- El servidor rechaza descripciones de más de 600 caracteres, pero el campo no tiene ese máximo y el validador del navegador solo comprueba que no esté vacío. Una descripción extensa termina en una alerta genérica.
- Si el chat está ocupado, el servidor indica que se puede reintentar. El navegador no trata ese caso: muestra la misma alerta genérica y obliga a repetir la acción.
- El bot conoce información que el formulario vuelve a pedir; el enlace actual no la precarga.

**Corrección:** validar de forma consistente, mostrar el límite, recuperar automáticamente la ocupación transitoria y distinguir errores por campo de errores de servicio.

Fuentes: [lib.php:7273](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:7273), [lib.php:7286](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:7286), [form/index.html:63](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/form/index.html:63), [form/script.js:192](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/form/script.js:192), [form/script.js:280](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/form/script.js:280).

### L. El reinicio de una sesión conserva una marca incompatible — prioridad media

**Prueba:** una conversación con formulario completado, sin demo presentada y nueve días de inactividad pasa a fase nueva y deja `lead_creado` en falso. Sin embargo, conserva `form_completado_ts`, y por eso no permite generar un enlace al formulario.

Se conserva información de la sesión anterior mientras se borra otra que le daba sentido. También existe la limitación explícita de un único prediseño automático por conversación.

**Corrección:** separar contacto, proyecto y sesión, y decidir qué se conserva por proyecto. Hasta entonces, hacer que el reinicio sea coherente con las marcas de formulario y lead.

Fuentes: [lib.php:3890](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:3890), [lib.php:3284](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/lib.php:3284), [agente.php:2597](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/agente.php:2597).

### M. El simulador del panel no ejecuta la misma salida que el chat — prioridad media

El botón de prueba usa `wabot_responder` y personalización. El webhook agrega `wabot_salida_preparar`, que aplica filtros finales. Por lo tanto, lo que se prueba en el panel puede diferir de lo que recibe el cliente.

**Corrección:** un único punto de ejecución reutilizado por webhook, simulador y pruebas de conversación, con envío real reemplazable por un transporte simulado.

Fuentes: [admin.php:314](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/admin.php:314), [webhook.php:306](C:/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb/wabot/webhook.php:306).

## Mantenimiento y consistencia

El núcleo se reparte entre 7.470 líneas en `lib.php`, 5.438 en `engine.php` y 2.884 en `agente.php`, además de filtros, webhook y panel. El tamaño por sí solo no constituye un error. La dificultad es que una misma decisión puede vivir en el prompt, una regla previa, una herramienta, un filtro posterior y una migración de configuración.

Las migraciones se ejecutan en cada carga. Algunas respetan textos personalizados y otras reconstruyen valores; las presentaciones por tipo, por ejemplo, se asignan desde código en cada carga. Hay comentarios y pruebas que todavía describen reglas antiguas.

Conviene separar responsabilidades de forma gradual: catálogo/precios, políticas comerciales, interpretación de mensajes, cambios de estado, redacción, transporte y tareas programadas. Cada decisión importante debe tener un dueño claro. Evitar seguir agregando correcciones aisladas a todas esas capas para el mismo problema.

## Qué ya está bien resuelto o encaminado

- Precios y enlaces se obtienen de herramientas y configuración; existen validaciones para reducir invenciones.
- El agente trabaja sobre una copia del estado y confirma sus cambios al obtener una respuesta completa. Esa protección es valiosa, aunque todavía falta extenderla hasta la entrega del mensaje.
- Hay agrupación de mensajes, deduplicación y candados en el camino principal.
- Hay respaldo cuando falla la IA, con control de fallos repetidos.
- Se guardan adjuntos y existe distinción entre recibirlos y poder interpretarlos.
- Se incorporó la vinculación entre conversaciones de Instagram y WhatsApp.
- Las presentaciones de demos ya distinguen tipos y aclaran contenido ficticio; e-learning diferencia la presentación pública del aula.
- El bot después de la demo está diseñado para informar y derivar el cierre humano. Esa decisión es válida; lo que necesita mejorar es su continuidad y precisión.
- Hay historial, alertas, bandejas y pruebas extensas. La recomendación es fortalecer y ordenar esa base.

## Validación realizada

| Suite | Comprobaciones | Resultado |
|---|---:|---|
| Motor | 1.975 | Aprobadas |
| Agente sin red | 457 | 454 aprobadas; 3 expectativas antiguas |
| Redactor | 95 | Aprobadas |
| Salida | 85 | Aprobadas |
| Postdemo | 65 | Aprobadas |
| Formulario | 55 | Aprobadas |
| Adjuntos | 126 | Aprobadas |
| Concurrencia | 12 | Aprobadas |
| **Total** | **2.870** | **2.867 aprobadas** |

Las tres fallas de la suite del agente buscan una frase anterior del formulario y dos condiciones que todavía exigen mencionar “Pablo” en la videollamada, mientras el código actual utiliza “el desarrollador”. No son evidencia de tres errores nuevos de atención. Son evidencia de desactualización de la suite. También hay advertencias PHP en algunos escenarios de prueba que conviene limpiar.

Las pruebas adicionales reprodujeron omisión de preguntas, falta de anotación de cambios, recontacto no ejecutable, recordatorio fuera de horario, etiquetas falsas de interés, sobrescritura del formulario, reinicio incoherente y atribución incorrecta del canal. Las condiciones de pérdida de trabajo y concurrencia del panel se fundamentan en inspección del flujo; no se afirma que hayan ocurrido en producción.

## Orden de trabajo recomendado

1. **Corregir la atención actual:** preguntas múltiples, guardado efectivo de cambios, clasificación de interés y respeto de fechas/horarios.
2. **Proteger los datos y los envíos:** asociación segura del formulario, procesamiento recuperable y cambios de estado consistentes con las entregas.
3. **Completar el seguimiento comercial:** ficha de oportunidad, pendientes con responsable, vencimientos y resultados de venta/pausa/pérdida.
4. **Reducir la fricción del formulario y unir la medición:** precarga segura, errores recuperables y atribución común entre canales.
5. **Unificar ejecución y evaluación:** mismo recorrido en simulador y webhook, conversaciones de prueba completas y configuración coherente.

El criterio de éxito no debería ser solamente que el bot responda de manera natural. Debe contestar lo preguntado, conservar lo acordado, ejecutar lo prometido y dejar visible quién tiene que hacer qué después.
