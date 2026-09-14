# Cabañas La Rústica — demo

Propuesta minimalista de alojamiento, creada el 14 de septiembre de 2026 siguiendo los prompts base de Gokywebs. Concepto: “Tu cabaña. El lago. Nada de apuro.”

## Referencias y decisiones

- [Habitas AlUla](https://www.ourhabitas.com/alula/): destino y paisaje como entrada a la experiencia; portada fotográfica con una acción de reserva clara.
- [Awasi Iguazú](https://awasi.com/iguazu/accommodations/): presentación del alojamiento apoyada en fotografía; galería amplia con texto breve.
- [Explora El Chaltén](https://www.explora.com/el-chalten-lodge/): vínculo entre refugio y entorno de montaña; relato de la estadía desde el paisaje.

Formato propio: cabecera tipográfica editorial, portada panorámica con contenido superpuesto, galería asimétrica sin tarjetas repetidas, tres cruces visuales entre secciones y bloques alternados. Fondo #F9FAFB, principal #000000, acento #00FF00; Instrument Serif y Manrope.

## Arquitectura y movimiento

Una página con portada, refugio y galería, tres momentos del día, consulta de estadía, zona del lago, preguntas frecuentes y cierre. HTML, CSS y JavaScript sin compilación. GSAP 3.13.0 y ScrollTrigger con detección de disponibilidad. Entradas por desplazamiento, escala, recorte y secuencias; enlaces y controles con estados visibles.

Sección firma A: escena sticky nativa, tres capítulos con fotografía y texto sincronizados, selección activa Mañana/Tarde/Refugio y enlace a la consulta. Usa lago, terraza e interior. El usuario puede recorrerla desplazándose o con sus botones. Con movimiento reducido se convierte en una sección de navegación manual, sin recorrido largo.

## Reservas y datos

Calendario de rango: dos meses en escritorio, uno en móvil; no admite pasado ni salida igual/anterior a entrada, cuenta noches entre meses y años. Huéspedes enteros positivos. WhatsApp recibe fechas, noches, cantidad de personas y consulta por tarifa/capacidad/servicios. Abrir o cerrar los paneles conserva la posición y devuelve el foco.

No hay inventario sincronizado, cobro ni confirmación automática. La disponibilidad real y las condiciones se confirman con el alojamiento. El límite técnico de 99 personas no representa capacidad del establecimiento.

El número recibido (+3541239349) se interpretó como número argentino con característica 3541: wa.me/5493541239349. Conviene confirmar esta normalización con el negocio.

Los $40.000 y $20.000 se interpretaron como precio de la web, no tarifa de alojamiento; no aparecen como precio por noche.

No se inventaron dirección exacta, servicios, capacidades de cabañas, horarios, tarifas, reseñas, email o Instagram. Se usa identidad tipográfica porque no se entregó logo. El mapa enlaza a la zona general del lago, sin ubicar falsamente las cabañas.

Cinco imágenes finales (se descargaron seis candidatas y se descartó una), con fuentes en images/sources.json. La del lago es real; las cuatro de ambientes están identificadas como referencias. La foto del lago pesa 340 KiB; todo el conjunto, aproximadamente 1,1 MiB.

## Validación

- Auditoría Gokywebs StrictHtml: cero errores y cero advertencias.
- ESLint y Stylelint sin errores.
- Diez pruebas automáticas de fechas/huéspedes: fechas inexistentes, año bisiesto, pasado/cero noches, cambio de mes/año, selección pasada, reinicio de llegada, corrección de salida, corrección de entrada, huéspedes inválidos y mensaje/número/singular. Todas aprobadas.
- Navegador: calendario en escritorio y móvil, consulta entre septiembre y octubre (4 noches), rechazo de cero huéspedes, cambio de paleta, menú, carga de las cinco imágenes y consola sin errores.
- Geometría a 375 px: sin desborde horizontal, escena sticky en top 0, fotografía y texto separados, botón de capítulo recibe clic y ningún elemento hidden visible.
- Se corrigieron superposición de textos durante transiciones, controles flotantes sobre los capítulos y salto de página al abrir/cerrar paneles.

No se enviaron consultas reales ni se guardaron elecciones de prueba en Firebase. El selector incluye cinco paletas, persistencia local y el envío canónico de elección de Gokywebs, con confirmación únicamente al completarse la escritura.
