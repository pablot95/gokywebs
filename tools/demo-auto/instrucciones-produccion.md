Sesión automática de producción (tools/demo-auto/preparar-produccion.php): el cliente ya pagó y el bot ya le pidió todo lo que faltaba. Nadie está mirando esta sesión.

- El pedido está abajo, después de la línea de guiones: la carpeta de la demo, el modelo que eligió, el brief original del formulario, lo que mandó después del pago (datos para la factura, nombres de dominio que le gustarían, email del panel, logo, fotos, cambios, horarios/dirección/redes) y la lista de lo que hace Pablo a mano.
- Seguí el prompt de producción que indica el pedido (prompt_completar_<tipo>.md de la memoria compartida de Gokywebs, con prompt_panel_editor_visual.md para el panel): quedarse con el modelo elegido, sacar todo lo de demo, adoptar el backend del template de EnProceso que corresponde, configurar SITE_URL / Firebase / ADMIN_EMAIL, SEO con el dominio real.
- El dominio todavía NO está comprado y el proyecto de Firebase todavía NO existe: eso lo hace Pablo (checklist al final del pedido). Usá el primer dominio deseado como provisorio y dejalo en UN solo lugar (SITE_URL y lo que derive de ahí) para que se cambie con un reemplazo; para Firebase dejá la config con los valores de ejemplo del template y un comentario claro de qué pegar.
- Los archivos del cliente (logo y fotos) ya están bajados en la carpeta que dice el pedido. Si el logo vino en PDF, extraelo en alta (ver la técnica de PyMuPDF en la memoria). Las fotos reemplazan las de la demo donde corresponda.
- Los datos para la factura NO van en la web: son para que Pablo emita la Factura C.
- Antes de escribir el primer archivo, `ListAgents`: si hay una sesión interactiva con el nombre del negocio, o archivos ajenos en la carpeta, retirate sin tocar nada («PRODUCCION ERROR la está haciendo otra sesión»).
- No hay nadie para contestar: no hagas preguntas ni uses herramientas que esperan una respuesta. Si falta un dato, dejalo anotado como pendiente de Pablo en la memoria del proyecto.
- Otras sesiones pueden estar trabajando en el mismo checkout: seguí project_sesiones_paralelas_mismo_checkout (nunca stash/checkout/restore, stagear solo lo tuyo).
- Al terminar, dejá el sitio en una carpeta/repo aparte como se hace siempre con las webs de clientes (165 repos privados), sin publicar nada en gokywebs.com, y anotá en index_demos_publicadas.md (o la memoria de la demo) qué quedó hecho y qué espera a Pablo.
- Tu última línea tiene que ser exactamente una de estas dos: «PRODUCCION OK <ruta o repo del sitio>» o «PRODUCCION ERROR <motivo en una frase>».

----------------------------------------------------------------------

