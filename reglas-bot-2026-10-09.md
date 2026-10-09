# Reglas del bot comercial y cómo maneja cada caso

Estado al 9-oct-2026 a la noche, antes de publicar. En producción el flujo nuevo está apagado: el bot sigue solo con la bienvenida hasta que elijas un modo en Ajustes.

## Cómo arma cada respuesta

1. **GPT Sol lee la charla entera** y decide una sola cosa: contestar, cotizar, mandar el formulario, pasártela a vos o esperar.
2. **Las reglas fijas del código** corrigen esa decisión cuando choca con algo que definiste (están en la sección 8).
3. **El sistema arma los mensajes.** Los precios, los planes, la oferta de la demo y el formulario son siempre tus textos aprobados. El modelo solo escribe la propuesta y las respuestas cortas.
4. **El revisor lee lo que está por salir** junto con la charla. Si ve un problema, el bot corrige una vez con lo que dijo el revisor (sección 7).
5. **Sale, o te queda a vos**, según el modo:
   - **Apagado** (hoy): solo la bienvenida, como ahora.
   - **Sugerencias**: no sale nada solo. En cada chat aparece la tarjeta 💡 con la respuesta propuesta y lo que vio el revisor. Vos la mandás, la editás o la descartás. Entre mensaje y mensaje van 4 segundos con "escribiendo".
   - **Automático**: contesta solo. Todavía no se activa.

## 1. Cómo escribe

- **Voseo, corto y cálido**: una o dos ideas por mensaje, sin frases de manual.
- **Sin punto final** en los renglones, y sin ¿ ni ¡.
- **No asume el género**: "pensalo con calma", nunca "tranquila" o "tranquilo".
- **Saluda una sola vez por charla.** No repite lo que ya se dijo ni pregunta lo que el cliente ya contó.
- **Si el cliente está por avanzar, no sigue vendiendo**: contesta lo justo.

## 2. Antes del precio

- **Primer mensaje sin rubro** ("Quiero más información"): sale tu bienvenida fija.
- **Sin saber a qué se dedica no cotiza.** Pregunta una vez. Si pide el precio sin contar nada, contesta "Con gusto te paso los valores. Te consulto, a qué te dedicás o qué vendés?".
- **Elige la solución así:**

| Lo que cuenta el cliente | Solución | Mensual / anual |
|---|---|---|
| Vende productos, aunque diga "catálogo" | Tienda | $30.000 / $190.000 |
| Fabrica lo que vende: impresión 3D, costura, artesanías | Tienda, con sus trabajos a pedido | $30.000 / $190.000 |
| Dice que solo quiere mostrar y recibir el pedido por WhatsApp | Catálogo | $30.000 / $190.000 |
| Servicios o profesión | Informativa, sin panel | $20.000 / $140.000 |
| Servicios, pero quiere manejar él el contenido | Informativa con panel | $30.000 / $190.000 |
| Cursos, presenciales u online | Cursos | $30.000 / $190.000 |
| Inmobiliaria o martillero | Inmobiliaria | $30.000 / $190.000 |
| Turnos online donde el cliente elige día y horario | Reservas | $30.000 / $190.000 |
| Pizzería o comidas con pedidos desde la web | Tienda | $30.000 / $190.000 |
| Cobra a clientes del exterior | Internacional | $40.000 / $240.000 |
| Sistema de gestión, CRM, app o software | Te la pasa a vos | — |

- **Rubros con turnos** (masajes, psicología, fonoaudiología, estética, peluquería): pregunta como vos, en un solo mensaje. Ejemplo: "Buenísimo. Podemos armarte una web para mostrar los tipos de masajes que ofrecés, precios, horarios y contacto directo. Te consulto: querés que la gente solamente te escriba por WhatsApp o también que pueda reservar turnos desde la página?". Después:
  - **Si contesta**, sale "Perfecto, entonces podés elegir entre dos planes:" con los planes que corresponden y la oferta de la demo.
  - **Si pregunta otra cosa** ("cuánto tardan?"), contesta solo eso y le recuerda la pregunta. No cotiza ni elige por el cliente.
  - **Si pregunta el precio** ("Si tiene un costo"), hace lo que hiciste vos hoy: "Es otro plan si incluye reservas", después los planes sin reservas y "Con reservas quedaría en: $190.000 / $30.000". La oferta de la demo sale cuando elige.
  - **Si ya se la recordó y sigue sin contestar**, cotiza la informativa con WhatsApp.
- **Dos rubros muy distintos** (blanquería y frutos secos): pregunta una vez si son dos marcas. Si dijo que vende todo en el mismo local, no pregunta.
- **Muchos productos**: "Sí, se pueden cargar miles de productos. Si vas a tener tantos, avisanos antes".

## 3. El precio

- **Tres mensajes**: la propuesta, el bloque de planes y la oferta de la demo.
- **La propuesta va como las tuyas de hoy**: qué le armamos, un párrafo "La web te sirve como herramienta para…" y, si tiene panel, para qué le sirve. Ejemplo: "Buenísimo. En tu caso podemos armarte una tienda online para vender los productos del bazar… / La web te sirve como una herramienta para ordenar mejor el negocio y aprovechar a la gente que llegue desde Instagram, Facebook, WhatsApp, Google o publicidad… / Después tendrías un panel para cargar productos nuevos…".
- **Nunca promete resultados.** Si escribe "vas a vender más", "llegar a más gente" o "captar clientes", el código lo frena y le pide corregir.
- **Si dice que no consigue clientes** o quiere más audiencia, aclara como vos: "Nosotros no hacemos publicidad directamente".
- **El precio queda congelado.** Si ya se le cotizó, se mantiene ese monto aunque cambie la lista.
- **Si pide el precio de nuevo**, repite los mismos planes.
- **Si cambia lo que necesita y lo confirma** (era tienda y solo quiere mostrar), cotiza de nuevo con lo que corresponde.
- **Pago único**, solo si pide comprar la web, tener el código o no pagar suscripción: $220.000 la informativa y $330.000 el resto. El mantenimiento es opcional, $15.000 por mes. Hosting y dominio van incluidos el primer año; a su nombre, aparte. Internacional con pago único te la pasa a vos.

## 4. Dudas después del precio

Contesta con tus respuestas oficiales, tal cual, y como mucho dos por turno. Las más comunes:

- **Cómo se paga**: mensual por Mercado Pago sin permanencia, o anual con seña y el resto al entregar.
- **Cuánto tarda**: unos 7 días desde que arranca el plan y pasa el contenido.
- **Hosting, dominio y mantenimiento**: incluidos en el mensual y el anual.
- **"Lo cargan ustedes?"**: "Si preferís que carguemos nosotros todos los productos, también podemos, con un costo adicional según la cantidad. Algunos los cargamos igual para entregarte la web funcionando, y el resto lo cargás vos desde el panel sin costo". Son tus palabras del 22-sep.
- **"Lo cargo yo?"**: que lo maneja desde su panel.
- **Medios de pago de la tienda** (texto nuevo, de tu chat de hoy): "Por lo general integramos Mercado Pago, pero si tenés otra billetera virtual de preferencia, integramos esa. También podés ofrecer transferencia o efectivo".
- **Nombre que figura al cobrar** (texto nuevo, de hoy): "Sí, eso depende de cómo tengas configurado Mercado Pago: ahí elegís el nombre del negocio, y cuando te pagan figura ese nombre".
- **Instagram**: lo sigue usando igual; la web es aparte y se vinculan.
- **Envíos**: por código postal con Correo Argentino o Andreani, o costo por provincia.
- **Descuento**: "No manejamos descuentos", y sigue atendiendo.
- **Publicidad o "esto es marketing?"**: que no hacemos publicidad ni redes, y para qué le sirve la web.
- **Ejemplos**: el portfolio. Ver ejemplos no cuenta como aceptar la demo.
- **Si no hay respuesta oficial**, no inventa: te la pasa a vos.

## 5. La demo y el formulario

- **Cuenta como aceptar**: "dale", "me interesa", "a ver cómo quedaría", "armala", "qué necesitás para hacerla?", un 👍, "sería buenísimo, así lo analizo con mi esposo", "ok pasame el demo".
- **Acepta y pregunta algo**: contesta la duda y manda el formulario en el mismo turno.
- **"Dale", "ok" o "bueno" después de aclararle una duda**, con la oferta abierta, también es aceptar.
- **Posterga** ("lo hablo con mi señora"): contesta corto, sin insistir.
- **Rechaza**: no contesta y la charla queda cerrada, sin seguimientos.
- **Formulario enviado**: el bot se calla y seguís vos. El recordatorio automático del formulario sigue.

## 6. Cuándo te la pasa a vos

No le contesta nada al cliente. El chat queda como "Pendiente para Pablo" con el motivo.

- **Pide algo que no es de lista**: CRM, sistema, app, conexión con Mercado Libre o con el sistema de un proveedor, varios vendedores, entrega automática de archivos, portales, cuotas sin interés, facturación electrónica o registro de marca.
- **Dos webs distintas.**
- **Mayorista con dropshipping** o importador con catálogo grande.
- **Internacional con pago único.**
- **Pregunta qué pasa si un mes no puede pagar.** Nunca ofrece un mes de gracia.
- **Pregunta cuánto cuesta que carguemos todos los productos.**
- **Problemas con el formulario**, pagos o comprobantes, reclamos, negociaciones, excepciones, pedidos de llamada, clientes que ya trabajan con vos, conocidos y referidos.
- **El revisor ve un problema grave que no se pudo corregir.** Esto pasa solo en automático.

## 7. El revisor

Es nuevo, por lo que pediste hoy: que el bot se dé cuenta solo cuando se desvía, contesta algo incoherente o se saltea una respuesta. Lee cada respuesta antes de que salga, con la charla y con todas tus reglas.

- **Marca**: que no conteste lo que le preguntaron, que conteste otra cosa o lo contrario, que sea incoherente, que se desvíe, que repita, que decida por el cliente, que se saltee un paso, que invente un dato, que prometa resultados o que el tono suene a robot.
- **No marca**: tus bloques aprobados, lo que cumple tus reglas aunque él lo haría distinto, ni los chats que te pasa a vos.
- **Si encuentra algo**, el bot corrige una vez con lo que dijo el revisor.
- **Si lo corregido sigue mal**:
  - En automático, si es grave, no sale nada y te queda a vos con el motivo.
  - Si es menor, como un saludo repetido, sale igual.
  - En sugerencias nunca frena: la tarjeta te muestra "⚠ El revisor todavía ve un problema" y decidís vos.
- **Si el revisor no responde**, la respuesta sale igual. Nunca traba un turno.
- **Cuesta una llamada más** en cada respuesta que revisa, unos 3 o 4 segundos más de espera. Se puede apagar en la configuración del bot: no está en el panel, pedímelo.

**Cómo le fue en la simulación.** Corrí 32 charlas con GPT Sol real y el revisor prendido. Hay 22 armadas con comportamientos de clientes reales de septiembre y octubre, y 10 sacadas de tus chats de hoy. Están completas en `simulacion-charlas-2026-10-09.md`.

| Resultado | Charlas |
|---|---|
| Llegaron al formulario | 21 |
| Te las pasó a vos: kiosco, radio, costo de la carga, dropshipping, mes sin pagar | 5 |
| Lo piensan o lo dejan para más adelante | 3 |
| Preguntó por el hosting del pago único y la simulación terminó con esa respuesta | 1 |
| Sigue esperando a qué se dedica | 1 |
| Referido: le avisa que sigue el desarrollador | 1 |

- El revisor corrigió 4 respuestas, las cuatro por repetir lo que ya se había dicho, y no frenó ninguna.
- En las primeras pruebas, sin tus reglas, marcaba como error lo que ellas mandan. Por eso ahora las lee todas.
- La corrida costó US$0,83 en total, unos 3 centavos de dólar por charla. Sin revisor son unos 1,5 centavos.

## 8. Controles fijos del código

No dependen de que el modelo acierte:

- **Montos, plazos, links, "gratis" o promesas** en un mensaje del modelo: se le pide corregir. Si insiste, no sale.
- **Funciones no aprobadas** nombradas en un mensaje: lo mismo.
- **El precio congelado** se respeta siempre.
- **El formulario** sale solo después de ofrecer la demo.
- **Sin negocio no hay precio.**
- **Hosting del pago único**: sale siempre tu texto específico.
- **"Lo cargan ustedes?"**: sale siempre la respuesta de carga por nosotros, nunca "lo manejás vos".
- **La pregunta de los turnos** queda pendiente, y los dos precios salen cuando pregunta el costo.
- **Catálogo** sin que haya dicho que no quiere cobrar online: se le pide que lo revise como tienda.
- **Descuento**: siempre tu texto. **Muchos productos**: siempre el aviso.
- **Internacional con pago único**: te la pasa a vos.

## 9. Lo que falta que decidas

- **Cliente sin rubro claro**: hoy el bot pregunta a qué se dedica antes de cotizar, por tu regla del 28-sep. Pero hoy le cotizaste el plan con panel a uno que solo dijo "es de servicio, con publicaciones mensuales". ¿Cuál vale?
- **Precio de la carga de productos**: tu texto del 28-sep dice $500 por producto. Hoy el bot no lo dice y te lo pasa a vos.
- **Dropshipping**: hoy te lo pasa a vos. A la mayorista de hoy le cotizaste $40.000 / $260.000.
- **"Qué necesitás para hacerla?"**: el texto oficial dice que el formulario pide el nombre, y el formulario no lo pide desde el 2-oct.
- **Pendientes de antes**: cuotas, dominio .com, si trabajamos sobre una web existente, "demo" o "primer diseño", y la seña y el saldo del pago único.

## 10. Para vigilarlo: Conversaciones live

- **Muestra solo los chats que tiene el bot**, cuatro por pantalla, con el último mensaje primero. Los que tienen solo la bienvenida, sin respuesta del cliente, no aparecen.
- **Cada columna dice lo que hizo el bot**: qué le cotizó, si ofreció la demo, si hay una sugerencia esperando y si el revisor corrigió algo.
- **Cuando te pasa el chat, sale de ahí**: también cuando manda el formulario, cuando el cliente rechaza o cuando lo tomás vos contestando.
- **Arriba quedan anotados media hora** los que salieron, con el motivo y el link al chat.

## 11. Para publicar

1. Subir los cambios de esta tarde. Hoy están solo en la PC y necesitan tu OK.
2. En el panel, Ajustes, elegir "Sugerencias" en "Flujo comercial nuevo".
3. Mirar las tarjetas y Conversaciones live unos días.
4. Pasar a "Automático" cuando confíes en lo que propone.
