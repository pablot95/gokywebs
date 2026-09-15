# Panel de Administración — Gokywebs

Panel privado para gestionar clientes, conectado a Firebase (Auth + Firestore).

## Estructura

- `index.html` — Pantalla de login.
- `dashboard.html` — Listado y CRUD de clientes (protegido).
- `firebase-config.js` — Inicialización de Firebase (Auth + Firestore).
- `login.js` — Lógica del login.
- `dashboard.js` — Lógica del panel (listado, alta, edición, borrado).
- `styles.css` — Estilos del panel.

## Configuración previa en Firebase

1. **Habilitar Authentication → Sign-in method → Email/Password**.
2. **Crear un usuario administrador** desde Firebase Console → Authentication → Users → *Add user* (email + contraseña).
3. **Crear la base de datos Firestore** (modo producción).
4. **Reglas de seguridad recomendadas** (Firestore → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clientes/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> Solo usuarios autenticados podrán leer y escribir la colección `clientes`.
> Si querés restringir a un único admin, podés usar `request.auth.uid == "EL_UID_DEL_ADMIN"`.

## Modelo de datos (`clientes`)

Desde el 15-sep-2026 la misma web se contrata de **dos maneras**, y cada cliente guarda cuál eligió en `modalidad`:

- **Pago único** (`'unico'`): una seña para arrancar y el saldo al entregar.
- **Servicio mensual** (`'mensual'`): la suscripción de Mercado Pago, sin pago inicial y sin permanencia. El plan arranca cuando el cliente se suscribe.

Los montos salen de `PLANES` en `dashboard.js` (una sola fuente; iguales a los de `/presupuesto/script.js`). El saldo es siempre precio único menos seña:

| Plan (`planLabel`)     | Pago único | Seña    | Saldo al entregar | Mensual |
|------------------------|------------|---------|-------------------|---------|
| `Sitio profesional`    | 180000     | 40000   | 140000            | 20000   |
| `Ecommerce`            | 290000     | 60000   | 230000            | 30000   |
| `Plataforma de cursos` | 290000     | 60000   | 230000            | 30000   |
| `Inmobiliaria`         | 240000     | 60000   | 180000            | 30000   |
| `Portal de noticias`   | 350000     | 90000   | 260000            | 30000   |
| Tipo sin reconocer     | 290000     | 60000   | 230000            | 30000   |

`Portal de noticias` usa el pago único y la seña de su presupuesto anterior al 10-sep-2026 (`presupuestos/noticias`).

Del modelo del 10 al 14-sep-2026 (primer pago + plan mensual) quedan `primerPago` y `primerPagoAt`: el panel solo los muestra, marcados como modelo anterior, en los docs que los traen cargados. Guardar un cliente escribe los campos de la modalidad elegida y **nunca borra** los de la otra ni los del modelo anterior.

| Campo               | Tipo              | Descripción |
|---------------------|-------------------|-------------|
| `nombre`            | string            | Nombre del cliente |
| `proyecto`          | string            | Proyecto contratado |
| `telefono`          | string            | Teléfono de contacto |
| `email`             | string            | Email; sirve para cruzarlo con la suscripción de Mercado Pago |
| `estadoCliente`     | string            | Embudo: `seguimiento1` / `ultimo-mensaje` / `standby` / `cliente` |
| `planLabel`         | string            | `Sitio profesional` / `Ecommerce` / `Plataforma de cursos` / `Inmobiliaria` / `Portal de noticias`. `""` = sin definir |
| `modalidad`         | string            | `unico` (pago único) / `mensual` (servicio mensual). `""` solo en un prospecto que todavía no eligió: pasar a Cliente siempre la fija. Sin el campo (docs anteriores al 15-sep-2026) el panel la deduce: ver "Modalidad de los docs anteriores" |
| `valorTotal`        | number            | Pago único: el precio único acordado. En un cliente mensual es el primer pago del modelo anterior (0 si no tuvo) |
| `abono`             | number            | Pago único: lo cobrado (la seña y lo que se cobre después); saldo pendiente = `valorTotal` − `abono`. En un cliente mensual, lo cobrado del primer pago del modelo anterior |
| `senaAt`            | timestamp o null  | Pago único: cuándo se cobró la seña (editable). Antes del 10-sep-2026 era el mismo sello; del 10 al 14-sep se escribía junto con `primerPagoAt` |
| `primerPago`        | number            | Modelo anterior (10 al 14-sep-2026): primer pago del plan mensual. En los clientes nuevos, 0 o sin el campo |
| `primerPagoAt`      | timestamp o null  | Cuándo se cobró ese primer pago (null = sin registrar, o cliente sin pago inicial) |
| `montoMensual`      | number            | Servicio mensual: 20000 (sitio profesional) o 30000 (el resto) |
| `estadoSuscripcion` | string            | Servicio mensual: `pendiente` / `activa` / `baja`. En Clientes también figura de baja si Mercado Pago avisó que se canceló (ver "Bajas de Mercado Pago") |
| `suscripcionDesde`  | timestamp o null  | Servicio mensual: cuándo arranca el plan (editable). Sin pago inicial queda vacío y vale el alta en Mercado Pago; con primer pago del modelo anterior, `primerPagoAt` + 7 días |
| `preapprovalId`     | string            | Servicio mensual: ID de la suscripción en Mercado Pago; vacío hasta que lo carga el webhook o se pega a mano |
| `cambiosPeriodo`    | string            | Servicio mensual: inicio (`AAAA-MM-DD`) del ciclo en que pidió el cambio del mes; mismo criterio que Mantenimiento |
| `entregadoAt`       | timestamp         | Cuándo se marcó la web como entregada (el cliente sigue en `clientes`) |
| `completadoId`      | string            | ID de la copia de la entrega en `completados` (esa copia guarda `clienteId`) |
| `notas`             | string            | Notas internas |
| `createdAt`         | timestamp         | Fecha de creación |
| `updatedAt`         | timestamp         | Última modificación |
| `createdBy`         | string            | UID del admin creador |

Campos de los documentos anteriores que el panel ya no edita: `sena`, `saldo` y `precioTotal` (copias del boceto al pasarlo a Seguimiento).

### Modalidad de los docs anteriores

Los clientes (y las copias de `completados`) guardados antes del 15-sep-2026 no tienen `modalidad`. El panel la deduce al pintar, sin escribir nada, en este orden (`_modalidadDeducida` en `dashboard.js`):

1. `primerPagoAt` cargado → `mensual` (primer pago del 10 al 14-sep-2026).
2. `valorTotal` de 100000 o más → `unico`: es un proyecto de antes del 10-sep-2026 (el primer pago nunca pasó de 90000 y desde el 14-sep va en 0). El `primerPago` / `montoMensual` que pueda traer lo sugirió el modal de esos días al guardarlo.
3. `primerPago` o `montoMensual` → `mensual`, con la nota "primer pago … (modelo anterior)" si lo tiene.
4. `sena`, `senaAt` o `abono` → `unico`.
5. Nada de eso → sin definir: la fila se ve como el servicio mensual, igual que hasta el 14-sep.

Al abrir y guardar un cliente, la modalidad que muestra el modal (la deducida) queda escrita en el doc. En un prospecto de Seguimiento el modal muestra solo la modalidad elegida; pasar a Cliente la pregunta y sugiere la elegida en el doc, el boceto o la calculadora o, si no hay, la deducida.

### Contrato con la calculadora, los bocetos y el bot (`presupuestos` / `propuestas`)

Desde el 15-sep-2026 la calculadora (`/presupuesto/`), "+ Nuevo boceto" y los bocetos del bot (`origen` `whatsapp-bot` / `instagram-bot`) guardan los montos de las dos modalidades:

| Campo                     | Descripción |
|---------------------------|-------------|
| `precioUnico`             | Precio del pago único |
| `sena`                    | Seña del pago único |
| `saldo`                   | `precioUnico` − `sena` |
| `mensualidad`             | Servicio mensual |
| `modalidad`               | `unico` / `mensual` / `""` (todavía no eligió) |
| `totalPrice`, `basePrice` | = `precioUnico` (`presupuestos`) |
| `precioTotal`             | = `precioUnico` (`propuestas`) |
| `primerPago`              | Siempre 0 |
| `presupuesto_cotizado`    | Solo los del bot: el texto que se le cotizó, por ejemplo "Pago único $290.000 (seña $60.000) o $30.000 por mes" |

- Un doc nuevo se reconoce por `precioUnico` o `modalidad`: ahí `sena` es la seña del pago único. En los anteriores, `primerPago` y `sena` se siguen leyendo como el primer pago del modelo anterior.
- Si un doc no trae los montos (los bocetos viejos del bot solo traen `tipoDetectado`), salen de `PLANES` según el tipo de web.
- Los detalles (boceto, lead, presupuesto, brief del cliente) muestran la modalidad elegida o, si todavía no eligió, las dos.
- Un doc de `presupuestos` con `paymentStatus` `approved` pagó la seña del pago único, salvo que traiga `modalidad` `mensual` o que sea anterior al contrato y traiga `primerPago` / `mensualidad` (primer pago del 10 al 14-sep o suscripción del 14-sep): esos son del servicio mensual.

## Clientes ≈ Mantenimiento

El tab **Clientes** se ve como **Mantenimiento**: una fila por cliente con su plan, el cobro y el check del cambio del mes.

- **Pago único**: abajo del plan, el precio único. En Cobro, la seña cobrada con su fecha (o "Seña sin registrar") y el saldo pendiente; "Pagado" cuando ya no queda saldo. No lleva cambio del mes.
- **Servicio mensual**: abajo del plan, cuánto paga por mes (y el primer pago del modelo anterior, si lo tiene). En Cobro, la suscripción: estado, desde cuándo corre y las bajas y pausas de Mercado Pago. El check del cambio del mes (1 por mes incluido) se reinicia el mismo día del mes en que arrancó el plan.

Arriba hay tres números: **Mensualidad activa** (suma de `montoMensual` de las suscripciones activas de los clientes mensuales), **Por activar** (suscripciones pendientes cuya fecha de inicio ya pasó) y **Saldo pendiente** (suma de `valorTotal` − `abono` de los clientes de pago único; los "a cotizar" no suman).

- `mantenimiento` la sigue escribiendo el webhook de Mercado Pago y no se fusiona con `clientes`: se cruzan al pintar. Si un suscriptor coincide con un cliente mensual por `preapprovalId`, email o WhatsApp, en Clientes la suscripción figura **activa** (salvo que el cliente esté marcado como baja o que Mercado Pago haya avisado la baja o la pausa) y se ve su ID.
- **Pasar un prospecto a Cliente** pregunta la modalidad (1 = pago único, 2 = servicio mensual) y sugiere la del boceto o la calculadora; si se cancela, sigue en Seguimiento. Pago único: fija `valorTotal` con el precio único y pregunta cuánto se cobró de seña (sugiere la del plan) → `abono` y `senaAt`. Servicio mensual: fija la mensualidad y deja la suscripción pendiente hasta que se suscribe en Mercado Pago.
- En el modal de cliente, **Modalidad** muestra solo los campos de la elegida. Un Cliente no se guarda sin modalidad.
- "→ Cliente" de un presupuesto pagado por Mercado Pago lo pasa a Seguimiento. Si pagó la seña: `modalidad` `unico`, `valorTotal` = el precio único, `abono` = la seña y `senaAt` = la fecha del pago. Si fue la suscripción (o un pago del 10 al 14-sep), queda `mensual`, como se explica en el contrato de arriba.
- Marcar la web como entregada (el tacho de un cliente, con factura o sin factura) **no borra** el cliente: se marca `entregadoAt` y queda en Clientes. En `completados` queda una copia como registro de la entrega. La factura propone lo cobrado del pago único (o su seña); en el servicio mensual queda vacía, salvo el primer pago de un cliente del modelo anterior.
- **Stats → Total por semana**: los clientes de pago único suman su `valorTotal`, como antes del 10-sep-2026; los mensuales suman el primer pago del modelo anterior o $0, sin el aviso de "valor total sin cargar".
- `import-completados.html` es un importador histórico del modelo viejo: no usarlo con clientes del plan mensual.

## Bajas de Mercado Pago

Cuando una suscripción se cancela (o se pausa) en Mercado Pago, el webhook `mantenimiento/api/webhook-mp.php` **no toca** el doc del suscriptor (las reglas públicas de `mantenimiento` solo dejan crear): crea un aviso aparte en la misma colección.

| Campo                        | Tipo            | Descripción |
|------------------------------|-----------------|-------------|
| ID del doc                   |                 | `baja_<preapprovalId>` o `pausa_<preapprovalId>`. Si MP repite la notificación, Firestore responde 409 y no se duplica |
| `tipoEvento`                 | string          | `baja` (status `cancelled`) o `pausa` (status `paused`). Los suscriptores no tienen este campo |
| `estado`                     | string          | Status de MP tal cual: `cancelled` / `paused` |
| `preapprovalId`              | string          | ID de la suscripción: con él se cruza con el suscriptor (en las altas manuales sin ID, por email) |
| `email`, `payerId`           | string          | Datos del pagador en MP |
| `plan`, `planLabel`, `monto` | string / number | Plan y precio de la suscripción, con el mismo criterio que el alta |
| `reason`                     | string          | Nombre del plan en MP |
| `fechaBaja`                  | timestamp       | Cuándo se canceló (o pausó) según MP (`last_modified`); si no viene, cuándo llegó el aviso |
| `fechaAlta`                  | timestamp       | Alta de la suscripción en MP (`date_created`) |
| `createdAt`                  | timestamp       | Cuándo se registró el aviso. Obligatorio: el admin lista la colección ordenando por este campo |
| `origen`                     | string          | `mp-webhook` |

- En **Mantenimiento** hay filtros *Todos / Activos / Pausados / Bajas*. El suscriptor con aviso figura como **Dio de baja** (o **Pausado**) con la fecha y deja de contar como activo. Un aviso sin suscriptor en la lista (el alta no llegó o se borró) aparece igual, como fila de baja.
- En **Clientes** la suscripción de ese cliente figura **Dio de baja** y deja de sumar a la mensualidad activa.
- Si una suscripción pausada se reactiva en MP, el aviso no se borra solo: se quita con **Quitar aviso** (o con el tacho, en la fila de un aviso sin suscriptor).

## Uso

1. Abrí `admin/index.html` (servido vía HTTP, no `file://`).
2. Iniciá sesión con el usuario creado en Firebase.
3. Desde el dashboard podés crear, editar, buscar y eliminar clientes.

## Notas

- El proyecto utiliza Firebase 10.12.2 vía CDN (módulos ES). No requiere build.
- Para desarrollo local: `npx serve .` o cualquier servidor estático.
- Recordá agregar tu dominio en **Firebase Console → Authentication → Settings → Authorized domains**.
