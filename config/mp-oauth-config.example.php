<?php
/**
 * Puente de "Conectar con Mercado Pago" (mp-conectar/index.php).
 *
 * Copiá este archivo como `mp-oauth-config.php` (en la misma carpeta) y pegá el
 * Client Secret de la aplicación "Gokywebs Tiendas" (Mercado Pago Developers →
 * la aplicación → Credenciales de producción). Es el mismo que va en
 * api/secrets.local.php de cada tienda. `mp-oauth-config.php` NUNCA se commitea:
 * en Hostinger se sube a mano una sola vez por File Manager.
 */

define('MP_OAUTH_CLIENT_SECRET', 'CHANGE_ME');
