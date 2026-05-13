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

| Campo        | Tipo      | Descripción              |
|--------------|-----------|--------------------------|
| `nombre`     | string    | Nombre del cliente       |
| `proyecto`   | string    | Proyecto contratado      |
| `telefono`   | string    | Teléfono de contacto     |
| `valorTotal` | number    | Valor total del proyecto |
| `abono`      | number    | Monto abonado            |
| `createdAt`  | timestamp | Fecha de creación        |
| `updatedAt`  | timestamp | Última modificación      |
| `createdBy`  | string    | UID del admin creador    |

## Uso

1. Abrí `admin/index.html` (servido vía HTTP, no `file://`).
2. Iniciá sesión con el usuario creado en Firebase.
3. Desde el dashboard podés crear, editar, buscar y eliminar clientes.

## Notas

- El proyecto utiliza Firebase 10.12.2 vía CDN (módulos ES). No requiere build.
- Para desarrollo local: `npx serve .` o cualquier servidor estático.
- Recordá agregar tu dominio en **Firebase Console → Authentication → Settings → Authorized domains**.
