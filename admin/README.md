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

Desde el 10-sep-2026 se vende **primer pago + plan mensual obligatorio**: el plan arranca a los 30 días del primer pago y se cobra por suscripción de Mercado Pago. Los campos nuevos se escriben **además** de los viejos, nunca en lugar de ellos: `valorTotal` y `abono` se conservan para no romper los documentos anteriores, pero el panel ya no muestra saldo pendiente.

| Campo               | Tipo              | Descripción |
|---------------------|-------------------|-------------|
| `nombre`            | string            | Nombre del cliente |
| `proyecto`          | string            | Proyecto contratado |
| `telefono`          | string            | Teléfono de contacto |
| `email`             | string            | Email; sirve para cruzarlo con la suscripción de Mercado Pago |
| `estadoCliente`     | string            | Embudo: `seguimiento1` / `ultimo-mensaje` / `standby` / `cliente` |
| `planLabel`         | string            | `Sitio profesional` / `Ecommerce` / `Plataforma de cursos` / `Inmobiliaria` (`Portal de noticias` solo para el presupuesto viejo). `""` = sin definir |
| `primerPago`        | number            | Primer pago: 60000 (sitio profesional) o 90000 (el resto) |
| `primerPagoAt`      | timestamp o null  | Cuándo se cobró el primer pago (null = sin registrar) |
| `montoMensual`      | number            | Plan mensual: 20000 (sitio profesional) o 30000 (el resto) |
| `estadoSuscripcion` | string            | `pendiente` / `activa` / `baja` |
| `suscripcionDesde`  | timestamp o null  | Cuándo arranca el plan: `primerPagoAt` + 30 días (estimado, editable) |
| `preapprovalId`     | string            | ID de la suscripción en Mercado Pago; vacío hasta que lo carga el webhook o se pega a mano |
| `cambiosPeriodo`    | string            | Inicio (`AAAA-MM-DD`) del ciclo en que pidió el cambio del mes; mismo criterio que Mantenimiento |
| `entregadoAt`       | timestamp         | Cuándo se marcó la web como entregada (el cliente sigue en `clientes`) |
| `completadoId`      | string            | ID de la copia de la entrega en `completados` (esa copia guarda `clienteId`) |
| `valorTotal`        | number            | Compatibilidad: = primer pago. En los docs del modelo anterior es el valor total del proyecto y no se pisa |
| `abono`             | number            | Compatibilidad: lo cobrado del primer pago. En los docs del modelo anterior, lo abonado |
| `notas`             | string            | Notas internas |
| `createdAt`         | timestamp         | Fecha de creación |
| `updatedAt`         | timestamp         | Última modificación |
| `createdBy`         | string            | UID del admin creador |

Campos que quedan en los documentos anteriores y el panel ya no muestra: `sena`, `saldo` y `precioTotal` (copias del boceto) y `senaAt` (sello del primer cobro antes del 10-sep-2026; las stats lo usan cuando falta `primerPagoAt`).

## Clientes ≈ Mantenimiento

El tab **Clientes** se ve como **Mantenimiento**: una fila por cliente con su plan (y cuánto paga por mes), el primer pago (cobrado o sin registrar, con la fecha), la suscripción (estado y desde cuándo corre) y el check del cambio del mes (1 cambio por mes incluido; el ciclo se reinicia el mismo día del mes en que arrancó el plan). Arriba hay dos números: **Mensualidad activa** (suma de `montoMensual` de las suscripciones activas) y **Por activar** (suscripciones pendientes cuya fecha de inicio ya pasó).

- `mantenimiento` la sigue escribiendo el webhook de Mercado Pago y no se fusiona con `clientes`: se cruzan al pintar. Si un suscriptor coincide con un cliente por `preapprovalId`, email o WhatsApp, en Clientes la suscripción figura **activa** (salvo que el cliente esté marcado como baja) y se ve su ID.
- Pasar un prospecto a Cliente pide el primer pago. Sugiere 60000 o 90000 según el tipo de web, o lo que traiga el boceto en `primerPago` / `mensualidad`. Además fija el plan y deja la suscripción pendiente, con inicio a los 30 días.
- Marcar la web como entregada (el tacho de un cliente, con factura o sin factura) ya **no borra** el cliente: se marca `entregadoAt` y queda en Clientes con su suscripción. En `completados` queda una copia como registro de la entrega.
- `import-completados.html` es un importador histórico del modelo viejo: no usarlo con clientes del plan mensual.

## Uso

1. Abrí `admin/index.html` (servido vía HTTP, no `file://`).
2. Iniciá sesión con el usuario creado en Firebase.
3. Desde el dashboard podés crear, editar, buscar y eliminar clientes.

## Notas

- El proyecto utiliza Firebase 10.12.2 vía CDN (módulos ES). No requiere build.
- Para desarrollo local: `npx serve .` o cualquier servidor estático.
- Recordá agregar tu dominio en **Firebase Console → Authentication → Settings → Authorized domains**.
