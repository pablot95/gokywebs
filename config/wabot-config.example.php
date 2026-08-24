<?php
/**
 * Plantilla de config del bot de WhatsApp. Copiar a wabot-config.php y completar.
 * Ver config/wabot-config.php (real, gitignored).
 */
define('WABOT_META_TOKEN', 'COMPLETAR');
define('WABOT_PHONE_NUMBER_ID', 'COMPLETAR');

/* ── Instagram (DMs). Vacío = el canal queda apagado y el bot sigue solo en WhatsApp. ──
   Flujo "API con inicio de sesión de Instagram" (graph.instagram.com), no el de
   página de Facebook. IG_TOKEN es el identificador de acceso que genera el paso
   2 del caso de uso. IG_USER_ID son los ids propios de la cuenta separados por
   coma (la consola muestra uno y /me devuelve otro): solo se usan para descartar
   los ecos de lo que mandamos nosotros. El envío siempre va por /me. */
define('WABOT_IG_USER_ID', '');
define('WABOT_IG_TOKEN', '');

/* Claves con las que Meta firma los webhooks. Dos claves separadas por coma:
   la de la app de Meta (Configuración → Información básica) y la de la app de
   Instagram (caso de uso de Instagram → Clave secreta). Cada canal firma con la
   suya. Vacío = no se valida la firma, y con la app publicada eso es un agujero. */
define('WABOT_APP_SECRET', '');
define('WABOT_VERIFY_TOKEN', 'COMPLETAR');
define('WABOT_GRAPH_VERSION', 'v21.0');
define('WABOT_GEMINI_KEY', 'COMPLETAR');
/* El modelo se elige desde el panel del bot (Textos -> Modelo de IA), no aca. */
define('WABOT_FIREBASE_API_KEY', 'COMPLETAR');
define('WABOT_FIREBASE_PROJECT', 'COMPLETAR');
define('WABOT_ADMIN_PASS', 'COMPLETAR');
