# Demo Analiajoyas

Dos diseños en `index.html` y `modelo-2.html`, catálogo en `catalogo.html` y panel en `admin/`.

Los productos y precios son **muestras para la demo**. El carrito prepara un pedido por WhatsApp; no cobra ni confirma stock automáticamente.

## Datos y paginación

`api.php` lee únicamente un archivo `data/page-NNNN.json` por consulta. Cada archivo admite hasta 100 productos; el endpoint aplica `MAX_PAGE = 100` incluso cuando se solicita un límite mayor. La respuesta incluye `nextCursor`, que apunta a la página o posición siguiente. El panel y el catálogo reemplazan los resultados visibles al pasar de página; no mantienen la colección completa en memoria. La búsqueda avanza por cursor solo cuando necesita más coincidencias.

La portada pide los destacados de la primera página y muestra hasta ocho.

## Acceso al panel

Configurar `ANALIAJOYAS_ADMIN_KEY` como variable de entorno del servidor PHP. Sin esa clave, el panel no permite iniciar sesión ni editar. El servidor valida la sesión para crear, cambiar o eliminar productos. Los archivos de `data/` deben ser escribibles por PHP y no servirse directamente; `.htaccess` deniega el acceso en Apache.
