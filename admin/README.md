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

Desde el 14-sep-2026 se vende **solo la suscripción mensual de Mercado Pago, sin pago inicial y sin permanencia**: sitio profesional $20.000/mes, tienda online, cursos, inmobiliaria y noticias $30.000/mes. El plan arranca cuando el cliente se suscribe. Del modelo del 10-sep-2026 (primer pago + plan mensual) quedan `primerPago` y `primerPagoAt`: en los clientes nuevos van en 0 / null y el panel solo los muestra, marcados como modelo anterior, en los docs que los traen cargados. Los campos nuevos se escriben **además** de los viejos, nunca en lugar de ellos: `valorTotal` y `abono` se conservan para no romper los documentos anteriores, pero el panel ya no muestra saldo pendiente.

| Campo               | Tipo              | Descripción |
|---------------------|-------------------|-------------|
| `nombre`            | string            | Nombre del cliente |
| `proyecto`          | string            | Proyecto contratado |
| `telefono`          | string            | Teléfono de contacto |
| `email`             | string            | Email; sirve para cruzarlo con la suscripción de Mercado Pago |
| `estadoCliente`     | string            | Embudo: `seguimiento1` / `ultimo-mensaje` / `standby` / `cliente` |
| `planLabel`         | string            | `Sitio profesional` / `Ecommerce` / `Plataforma de cursos` / `Inmobiliaria` (`Portal de noticias` solo para el presupuesto viejo). `""` = sin definir |
| `primerPago`        | number            | Modelo anterior (10 al 14-sep-2026): primer pago de 40000 (sitio profesional) o 50000 (el resto). En los clientes nuevos, 0 |
| `primerPagoAt`      | timestamp o null  | Cuándo se cobró ese primer pago (null = sin registrar, o cliente sin pago inicial) |
| `montoMensual`      | number            | Plan mensual: 20000 (sitio profesional) o 30000 (el resto) |
| `estadoSuscripcion` | string            | `pendiente` / `activa` / `baja`. En Clientes también figura de baja si Mercado Pago avisó que se canceló (ver "Bajas de Mercado Pago") |
| `suscripcionDesde`  | timestamp o null  | Cuándo arranca el plan (editable). Sin pago inicial queda vacío y vale el alta en Mercado Pago; con primer pago del modelo anterior, `primerPagoAt` + 7 días |
| `preapprovalId`     | string            | ID de la suscripción en Mercado Pago; vacío hasta que lo carga el webhook o se pega a mano |
| `cambiosPeriodo`    | string            | Inicio (`AAAA-MM-DD`) del ciclo en que pidió el cambio del mes; mismo criterio que Mantenimiento |
| `entregadoAt`       | timestamp         | Cuándo se marcó la web como entregada (el cliente sigue en `clientes`) |
| `completadoId`      | string            | ID de la copia de la entrega en `completados` (esa copia guarda `clienteId`) |
| `valorTotal`        | number            | Compatibilidad: = primer pago (0 en los clientes sin pago inicial). En los docs anteriores al 10-sep-2026 es el valor total del proyecto y no se pisa |
| `abono`             | number            | Compatibilidad: lo cobrado del primer pago. En los docs del modelo anterior, lo abonado |
| `notas`             | string            | Notas internas |
| `createdAt`         | timestamp         | Fecha de creación |
| `updatedAt`         | timestamp         | Última modificación |
| `createdBy`         | string            | UID del admin creador |

Campos que quedan en los documentos anteriores y el panel ya no muestra: `sena`, `saldo` y `precioTotal` (copias del boceto) y `senaAt` (sello del primer cobro antes del 10-sep-2026; las stats lo usan cuando falta `primerPagoAt`).

## Clientes ≈ Mantenimiento

El tab **Clientes** se ve como **Mantenimiento**: una fila por cliente con su plan (y cuánto paga por mes), la suscripción (estado y desde cuándo corre) y el check del cambio del mes (1 cambio por mes incluido; el ciclo se reinicia el mismo día del mes en que arrancó el plan). Si el cliente tiene cargado un primer pago del modelo anterior, se ve abajo del plan. Arriba hay dos números: **Mensualidad activa** (suma de `montoMensual` de las suscripciones activas) y **Por activar** (suscripciones pendientes cuya fecha de inicio ya pasó).

- `mantenimiento` la sigue escribiendo el webhook de Mercado Pago y no se fusiona con `clientes`: se cruzan al pintar. Si un suscriptor coincide con un cliente por `preapprovalId`, email o WhatsApp, en Clientes la suscripción figura **activa** (salvo que el cliente esté marcado como baja o que Mercado Pago haya avisado la baja o la pausa) y se ve su ID.
- Pasar un prospecto a Cliente ya no pide primer pago: fija el plan y la mensualidad (20000 o 30000 según el tipo de web, o lo que traiga el boceto en `mensualidad`) y deja la suscripción pendiente hasta que se suscribe en Mercado Pago.
- Marcar la web como entregada (el tacho de un cliente, con factura o sin factura) ya **no borra** el cliente: se marca `entregadoAt` y queda en Clientes con su suscripción. En `completados` queda una copia como registro de la entrega.
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
