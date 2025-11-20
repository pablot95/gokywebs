# Configuración de EmailJS

## Pasos para completar la integración:

### 1. Crear una plantilla de email en EmailJS

1. Ve a https://dashboard.emailjs.com/
2. Inicia sesión con tu cuenta
3. Ve a la sección **"Email Templates"**
4. Crea una nueva plantilla con los siguientes campos:

**Nombre de la plantilla:** Puedes usar cualquier nombre (ej: "Contacto desde Web")

**Contenido de la plantilla:**
```
Asunto: {{subject}}

De: {{from_name}}
Email: {{from_email}}

Mensaje:
{{message}}
```

### 2. Obtener el Template ID

1. Una vez creada la plantilla, copia el **Template ID** (aparece en la parte superior)
2. Abre el archivo `script.js`
3. Busca la línea que dice:
   ```javascript
   const response = await emailjs.send('service_w15l48a', 'template_id', templateParams);
   ```
4. Reemplaza `'template_id'` con el ID real de tu plantilla (entre comillas)

### 3. Variables ya configuradas:

✅ Public Key: `_WA82jXCJEH8sWNSq`
✅ Service ID: `service_w15l48a`

### 4. Campos del formulario que se enviarán:

- **from_name**: Nombre del usuario
- **from_email**: Email del usuario
- **subject**: Asunto del mensaje
- **message**: Mensaje completo

## Importante:

Asegúrate de que tu plantilla de EmailJS use exactamente los mismos nombres de variables:
- `{{from_name}}`
- `{{from_email}}`
- `{{subject}}`
- `{{message}}`

Una vez que tengas el Template ID, reemplázalo en el código y el formulario funcionará perfectamente.
