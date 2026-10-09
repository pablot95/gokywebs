# Información comercial consolidada — flujo comercial del 9 de octubre de 2026

Ficha única de lo que el bot puede decir en el flujo comercial unificado (`comercial.php`), armada
a partir del plan de traspaso del 9-oct (decisiones de Pablo), los textos vigentes de `textos.php`
y las respuestas rápidas del panel. Donde dos fuentes se contradicen y el plan no lo resuelve, el
punto queda en la lista final para que lo decida Pablo; mientras tanto el bot usa lo indicado en
cada caso.

## 1. Soluciones y precios (decisión del plan)

| Solución (`solucion`) | Plan | Mensual | Anual | Pago único | Tipo que guarda la charla |
|---|---|---:|---:|---:|---|
| informativa — presentar negocio, profesión o servicios, contacto por WhatsApp. **Sin panel** | informativa | $20.000 | $140.000 | $220.000 | landing |
| informativa_panel — la misma, con panel para que el cliente cambie el contenido | con panel | $30.000 | $190.000 | $330.000 | landing (con panel) |
| tienda — vende productos, carrito y cobro con Mercado Pago | con panel | $30.000 | $190.000 | $330.000 | ecommerce |
| catalogo — productos con fotos y precios, pedido por WhatsApp, sin cobro online | con panel | $30.000 | $190.000 | $330.000 | ecommerce |
| cursos — online o presenciales, aunque solo muestre y reciba consultas | con panel | $30.000 | $190.000 | $330.000 | elearning |
| inmobiliaria — publica propiedades, aunque solo reciba consultas | con panel | $30.000 | $190.000 | $330.000 | inmobiliaria |
| reservas — web pública con reserva de turnos online | con panel | $30.000 | $190.000 | $330.000 | landing (con panel) |
| cualquiera que cobre a clientes del exterior (PayPal u otra pasarela) | internacional | $40.000 | $240.000 | — (Pablo) | según la solución |
| crm — sistema de gestión, CRM, app, software a medida | — | no se cotiza: Pablo | | | sistema |

Decisiones de Pablo del 9-oct a la noche: tres mensajes al cotizar; la informativa de $20.000 no tiene
panel (con panel va el plan de $30.000); anual $140.000 / $190.000 (seña $60.000, saldos $80.000 /
$130.000); pago único $220.000 / $330.000 con mantenimiento opcional de $15.000 por mes para todos; se
pueden cargar miles de productos avisando antes; envíos por provincia con Correo Argentino y Andreani
integrados; internacional $40.000 por mes; el dominio se transfiere con el primer pago.

Los montos salen de `tipos` en `textos.php` (landing para el plan informativa; ecommerce para el plan
con panel). Cambios respecto del código anterior, por decisión del plan: el catálogo con pedidos por
WhatsApp y los cursos presenciales ya no bajan al precio del sitio profesional; la web con reservas
de turnos es una solución aprobada del plan con panel.

Reglas:
- Una cotización ya dada se mantiene aunque la lista haya cambiado, hacia arriba o hacia abajo
  (`cotizacion_conservar = true`). Vale para lo congelado por el bot y para lo que Pablo pegó a mano
  en la charla (`wabot_comercial_cotizacion` lo lee del transcript). Si no hay una página de pago
  que cobre ese monto, no se manda ningún link.
- Sin saber a qué se dedica no hay precio: se pregunta una vez; si pide el precio sin contar nada,
  `precio_sin_rubro` (sin montos).
- Pago único solo si pide comprar la web, el código propio, tenerla a su nombre o no tener
  suscripción (`pago_unico` en la decisión → línea `comercial.pago_unico` debajo de los planes).
- Descuentos: `descuento` ("No manejamos descuentos: el valor es el mismo por transferencia o con
  tarjeta") y se sigue atendiendo.
- Dos webs distintas: pasa a Pablo (ver pendiente 5).

## 2. Secuencia aprobada

1. Propuesta breve adaptada al negocio (la redacta GPT Sol con el estilo de los chats de Pablo; si no
   pasa la red —montos, links, plazos, funciones no aprobadas— sale la fija de `comercial.propuesta_fija`).
2. Planes: `comercial.planes_informativa` o `comercial.planes_panel` (anual primero) con los montos
   de la charla. Con pago único pedido, la línea `comercial.pago_unico` debajo.
3. Oferta de la demo: `comercial.oferta_demo`, tal cual.
4. Con el sí (aceptación leída en contexto, sin frase literal): `prediseno_link` con el link del
   formulario de esa charla. Si además trae una duda habitual, la respuesta oficial va antes, en
   el mismo turno.

Rubros con turnos (Pablo, chats del 9-oct): primero un mensaje con la web que le podemos armar y la
pregunta "Te consulto: querés que la gente solamente te escriba por WhatsApp o también que pueda
reservar turnos desde la página?". La pregunta queda pendiente hasta que la conteste:
- contesta → "Perfecto, entonces podés elegir entre dos planes:" (la propuesta corta pegada al
  bloque) y la oferta;
- pregunta otra cosa → se contesta eso y se le recuerda la pregunta (`comercial.pregunta_turnos`),
  una sola vez;
- pregunta el precio o si tiene costo → `comercial.dos_planes_intro`, los planes de la informativa
  con "Sin reservas" adelante y `comercial.con_reservas`; se congela el de sin reservas y la oferta
  sale cuando elige (si elige reservas, se recotiza con el plan con panel).

Antes de salir, cada respuesta pasa por el revisor (sección 6).

## 3. Ficha vigente (lo que el bot contesta con las respuestas oficiales de `info`)

- **Qué incluye** (mensual y anual): desarrollo completo, adaptada a celular, preparada para Google,
  un cambio por mes, hosting, dominio .com.ar, actualizaciones y soporte técnico; el plan con panel
  suma el panel de autogestión. Certificado SSL incluido (`seguridad`).
- **Mensual**: por Mercado Pago, con cualquier tarjeta, sin permanencia, se da de baja desde Mercado
  Pago; el valor se actualiza una vez al año (`mensual`, `baja_del_plan`, `cuenta_mercado_pago`).
- **Anual**: seña de $60.000 (`tipos[].sena`), el resto al entregar, renovación anual desde la seña.
  La seña no se devuelve (`devolucion`). Pasar de un plan al otro se coordina con Pablo
  (`cambio_modalidad`); Pablo, 6-oct: "se puede cambiar de plan, pero no se acumula el saldo".
- **Pago único**: una vez; el código queda del cliente al abonar el total. Seña y saldo al
  entregar. Mantenimiento aparte y opcional: $15.000 por mes (`tipos[].mantenimiento`).
  Hosting y dominio incluidos el primer año; a nombre del cliente, aparte (`hosting_pago_unico`).
- **Propiedad del código**: pago único al abonar el total; anual al pagar el segundo año; mensual a
  los 18 meses (`titularidad`, `entrega_codigo`). Licencias de terceros no se transfieren (`licencias`).
- **Mantenimiento**: actualizaciones, seguridad, arreglos, soporte y un cambio por mes; incluido en
  mensual y anual (`mantenimiento`, `cambios_plan`). Los textos e imágenes los cambia el cliente desde
  el panel sin costo (`cambios_plan_panel`).
- **Carga de contenido**: "lo cargo yo?" → el cliente desde su panel (`carga`); "lo cargan
  ustedes?" → `carga_nosotros`, con las palabras de Pablo del 22-sep: algunos los cargamos para
  entregarla funcionando; todos, también, con un costo adicional según la cantidad. Cuánto cuesta
  la carga → Pablo (pendiente 4).
- **Medios de pago de la tienda** (`medios_pago_tienda`, Pablo 9-oct): Mercado Pago, u otra billetera
  virtual si la prefiere; también transferencia o efectivo. **Nombre que figura al cobrar**
  (`mp_nombre_negocio`, Pablo 9-oct): el que configure como nombre del negocio en Mercado Pago.
- **Plazos**: la web queda lista en unos 7 días desde que se arranca con el plan y se pasa el
  contenido (`plazos`); la demo, en menos de 24 hs desde el formulario (`prediseno_link`).
- **Dominio y hosting**: incluidos, .com.ar, en Hostinger (`hosting`, `accesos`); .com con renovación
  adicional (`dominio_com`, ver pendiente 3); el dominio puede quedar a nombre del cliente
  (`dominio_a_nombre`).
- **Demo**: gratis y sin compromiso (`demo_gratis`); queda disponible 5 días (`demo_vigencia`); es una
  primera versión, no la web final (`muestra_no_es_final`); dos modelos para elegir.
- **Funciones estándar** (ver matriz): formularios (`formularios`), mapa (`maps`), hasta 3 idiomas
  (`bilingue`), pixel y Analytics (`pixel`), envíos (`envios`), cupones (`cupones`), estadísticas
  (`estadisticas`), usuarios (`usuarios`), reseñas, Instagram.
- **Lo que no hacemos**: publicidad y redes (`marketing`), logos (`logo`, `sin_logo`), webs sobre
  Tiendanube/Shopify/WordPress (`plataformas`), trabajar sobre una web ya hecha (`ya_tiene_plataforma`,
  ver pendiente 7).
- **Empresa**: Tigre, Buenos Aires, trabajo remoto (`ubicacion`); Factura C (`facturacion`); sin
  comisión por venta, solo la del medio de pago (`comisiones`); emprendimientos y negocios chicos sí
  (`emprendimientos`).

Claves de `info` que este flujo NO ofrece al modelo: `otra` (comodín), `rangos` (duplica
`precio_sin_rubro`). Las dos claves virtuales que sí suma: `descuento` y `pago_antes_demo`
(`pago_antes_o_despues`: "El primer diseño es sin cargo: lo ves antes de decidir…").

## 4. Matriz: estándar vs. requiere a Pablo

Estándar (se cotiza y se contesta solo):
- Tienda: catálogo, carrito, Mercado Pago, botón de WhatsApp, envíos por código postal / retiro /
  costo por zona, cupones, estadísticas, usuarios, stock y pedidos desde el panel, mayorista y
  minorista. Quien fabrica lo que vende (impresión 3D, costura, artesanías) también es tienda, con
  sus trabajos a pedido (Pablo con Ronin3d y Kassu, 9-oct). La palabra "catálogo" sola no cambia
  nada: si vende productos, se asume venta online.
- Informativa: secciones, trabajos, formulario de contacto, mapa, Instagram, reseñas, idiomas,
  carta (gastronomía), botón para pedir turno por WhatsApp. Gastronomía con pedidos desde la web
  es tienda (Pablo, pizzería del 9-oct).
- Cursos: videos y material con acceso propio de cada alumno, cobro por Mercado Pago; o solo
  mostrarlos e inscribirse por WhatsApp.
- Inmobiliaria: fichas con fotos y video, buscador por zona, tipo y precio, consultas por WhatsApp.
- Reservas: turnos online donde el cliente elige día y horario.
- Cualquier web: pixel de Meta, Analytics, SSL, hosting y dominio.

Requiere a Pablo (el bot se calla y lo marca en el panel con el motivo):
- CRM, sistema de gestión interna, app, software a medida.
- Conexión con Mercado Libre o con un sistema que ya usa (Tango, ERP…); facturación electrónica;
  sincronización de stock/precios con otro sistema.
- Marketplace de varios vendedores; entrega automática de archivos al pagar; portal de noticias.
  La cantidad de productos ya no deriva (9-oct): se avisa con `muchos_productos`.
- Cuotas sin interés, cualquier condición de pago fuera de las aprobadas; qué pasa si un mes no
  puede pagar (el mes de gracia fue una excepción de Pablo para una sola clienta: nunca se ofrece).
- Internacional con pago único. Mayorista con dropshipping o importador con catálogo grande (Pablo
  cotizó a mano $40.000 / $260.000 el 9-oct).
- Cuánto cuesta que carguemos nosotros todos los productos.
- Dos webs distintas.
- Problemas para abrir o completar el formulario; pagos avisados o comprobantes; reclamos;
  negociaciones; pedidos de excepción; pedido de llamada o de hablar con una persona; clientes
  que ya trabajan con nosotros; conocidos y referidos; quien busca trabajo o vende algo.
- Cualquier pregunta sin respuesta oficial.

## 5. Contradicciones y vacíos que necesitan decisión de Pablo

**Resueltas el 9-oct a la noche:** la informativa no tiene panel (punto 9: las reservas online son
del plan con panel; el texto `turnos` ya no se le ofrece al modelo); miles de productos con aviso
(punto 4, en lo que respecta a la cantidad: la carga inicial por nosotros sigue abierta); mantenimiento
del pago único $15.000 para todos, opcional; dominio transferido con el primer pago; envíos por
provincia; internacional $40.000 / $240.000; catálogo y turnos en el plan con panel (punto 10,
también en presupuestos/catalogo y presupuestos/turnos); hosting y dominio del pago único (punto 1).
Siguen abiertas las de abajo.

El bot no inventa ninguna de estas condiciones: donde hay dos versiones usa la que se indica.

1. ~~Hosting y dominio en el pago único~~ **Resuelto (9-oct):** incluidos el primer año; si los
   quiere a su nombre, aparte. El bot contesta con `hosting_pago_unico`. El texto viejo "corren por
   tu cuenta" quedó solo en el catálogo de respuestas rápidas anterior al 3-oct, ya reemplazado.
2. **Cuotas.** El plan trata "cuotas sin interés" como fuera de lista; Pablo dijo (4-oct) que el
   pago único "se puede abonar en cuotas con interés" y una respuesta rápida dice "pagás con tarjeta
   y elegís las cuotas". `info.cuotas` solo dice que el mensual se paga con cualquier tarjeta. El bot
   usa `cuotas` y no promete cuotas del anual ni del pago único.
3. **Dominio .com.** `info.dominio_com`: renovación adicional de $40.000 por año; la respuesta rápida
   anterior decía $15.000 (pendiente desde el 2-oct); Pablo, 6-oct: "tienen un valor extra, no hay
   tanta diferencia"; en una charla del 8-oct cotizó $40.000 mensual con dominio .com incluido. El bot
   usa `dominio_com` ($40.000).
4. **Carga inicial de productos.** En parte resuelto (9-oct): "se pueden cargar todos ustedes?"
   se contesta con las palabras de Pablo del 22-sep (`carga_nosotros`: algunos los cargamos; todos,
   con costo adicional según la cantidad). Sigue abierto el monto: `catalogo_carga` dice $500 por
   producto (texto de Pablo del 28-sep, también en su chat del 22-sep); el bot no lo dice y pasa la
   pregunta a Pablo.
5. **Dos webs.** El código del 28-sep cotiza las dos con 20 % de descuento en ambas; el plan dice que
   no se manejan descuentos y pide no inventar la resolución; Pablo (5-oct) cotizó a mano "$40.000
   mensual / $240.000 anual por las dos webs". El flujo nuevo las deriva a Pablo con el motivo.
6. **Montos fuera de lista que Pablo dio a mano** ($40.000 / $240.000 para cursos con alcance a
   Latinoamérica, $40.000 / $250.000 para una tienda con dedicatorias y entregas por franja horaria):
   el bot no los usa para cotizar; solo los respeta si ya están en esa charla.
7. **Web existente.** `info.ya_tiene_plataforma`: "no trabajamos sobre webs hechas: hacemos una nueva";
   respuesta rápida: "se puede trabajar sobre una web existente o hacer una nueva". El bot usa
   `ya_tiene_plataforma`.
8. **"Demo" vs. "primer diseño / muestra".** El plan y los textos de Pablo dicen "demo"; varias
   respuestas oficiales (`ejemplos`, `demo_gratis`, `que_necesitan`, `sin_fotos`, `muestra_no_es_final`,
   `proceso`) dicen "primer diseño" o "muestra". No cambia condiciones; conviene unificar la palabra.
9. **Turnos online en una informativa.** `info.turnos` y `info.usuarios` dicen "está incluido, no se
   paga aparte"; según el plan, las reservas online son la solución `reservas` (plan con panel). El
   flujo nuevo no le ofrece `turnos` al modelo (la solución `reservas` lo cubre); `usuarios` sigue
   disponible. Confirmar si una informativa ($20.000) puede tener turnos online.
10. ~~Catálogo = plan con panel~~ **Resuelto (9-oct):** $30.000 / $190.000, igual que turnos; las
    páginas presupuestos/catalogo y presupuestos/turnos ya cobran eso.
11. **Seña y saldo del pago único** se nombran en `WABOT_RR_PAGO_UNICO` y en las páginas de pago/;
    el bloque aprobado del plan no los menciona. El bot no los dice salvo que pregunten (`pago`).
12. **Cliente sin rubro claro.** Regla del 28-sep: sin negocio no hay precio (el bot pregunta a qué se
    dedica). Pero el 9-oct Pablo le cotizó el plan con panel a uno que solo dijo "es de servicio la
    página, con publicaciones mensuales" y quería gestionarla él. El bot sigue preguntando.
13. **Dropshipping.** Pablo cotizó a mano $40.000 / $260.000 a una mayorista con dropshipping (9-oct).
    El bot se lo pasa a Pablo; falta decidir si ese es un plan de lista.
14. **`que_necesitan`** dice que el formulario pide el nombre; el formulario no lo pide desde el 2-oct.

## 6. El revisor (9-oct a la noche)

Pablo: "que pueda autodarse cuenta de que está desviándose o respondiendo idioteces incoherentes, o si
se saltea respuestas". Antes de que salga, una segunda llamada a GPT Sol (`comercial_revisor`) lee la
charla, la decisión y los mensajes exactos que va a recibir el cliente, con las reglas del asistente y
esta ficha. Marca: no_contesta, contradice, incoherente, se_desvia, repite, decide_por_cliente,
se_saltea_paso, inventa, promete, tono, otro. No marca los bloques aprobados, lo que cumple las
reglas ni los pases a Pablo.

- Si marca algo, el modelo corrige una vez con lo que dijo (`wabot_comercial_decidir`).
- Si lo corregido sigue con un problema grave (no_contesta, contradice, incoherente,
  decide_por_cliente, se_saltea_paso, inventa, promete): en automático no sale y queda para Pablo
  con el motivo "Revisión: …"; en sugerencias sale con el aviso en la tarjeta.
- Menor (repite, tono, se_desvia, otro): sale igual.
- Si el revisor no contesta, el turno sigue como estaba. Se apaga con `comercial.revisor = false`.
- No se revisan los pases a Pablo ni un formulario solo cuando el cliente no preguntó nada.
