<?php
/**
 * wabot/test-aceptacion-demo.php — cuándo el sí al primer diseño se lleva el
 * formulario (solo CLI).
 *
 * Sale de las charlas reales del 11-sep al 2-oct (2-oct, Pablo: "expandir el
 * CUÁNDO el bot entiende que tiene que dar el form"): las 175 respuestas que
 * dieron los clientes a la oferta del primer diseño ("Querés que lo armemos?"
 * y la versión vieja "Querés que preparemos la demo para tu negocio?"),
 * clasificadas a mano. Van solo los textos, sin nombres. Varias líneas en un
 * mismo texto son mensajes seguidos que el webhook junta en una tanda.
 *
 *   - Cada sí real tiene que llevarse el formulario. Antes del 2-oct se
 *     perdían 31 de 90 ("Sería bueno", "Si porfavor", "Diseño y construcción
 *     // Dale", "Si te paso el logo", "Mi tienda se llama… // Dale!").
 *   - Ninguna otra respuesta puede llevárselo: un "lo pienso", una pregunta
 *     de verdad, un no, un audio o un sí con una pregunta van a Pablo.
 *   - Cinco síes reales siguen yendo a Pablo a propósito (abajo, con el
 *     motivo): si un cambio los empieza a aceptar, que sea a conciencia.
 */

require_once __DIR__ . '/test-lib.php';

/** El nombre del caso: el texto en una línea, cortado. */
function nombre_respuesta($texto) {
    $t = str_replace("\n", ' // ', (string)$texto);
    return '"' . (mb_strlen($t) > 70 ? mb_substr($t, 0, 70) . '…' : $t) . '"';
}

$siReales = [
    "Y es lo que quería ver",
    "Dale si",
    "Si",
    "Si si",
    "Si",
    "Si",
    "Quiero una demo",
    "Gracias por la atención 🤗\n❤️ si",
    "Si",
    "Hola buenas tardes\nMe gustaría que me hagan el demo",
    "Si por favor",
    "Dale si me interesa",
    "Si sería bueno",
    "Si",
    "Si",
    "Me interesa",
    "Sería anual",
    "Sería para vender remeras que yo mismo fabrico\nY poder ofrecer encios\nEnvios\nCobros\nBueno",
    "Sisi es sin compromiso si",
    "Dale me interesa.....",
    "Diseño y construcción\nDale",
    "Que necesitas para realizar el diseño de prueba",
    "Bueno",
    "Si",
    "Por favor .",
    "Si dale por favor",
    "Si te paso el logo",
    "Si",
    "Si si me interesa y puedo pagar por mes",
    "Sí\nMe parece\nPerfecto\nAsí veo\nGracias",
    "Y voy a agregar carro de fritas para bañar con chocolate\nMe guataria ver de q se trata",
    "Ok",
    "Ok si no es molestia me lo prepararías para ver como quedaria\nPerdon me podrías armar una para que se deriven a wpp",
    "Sí, por favor",
    "Dale",
    "Vender y generar más clientes\nA ok\nDale",
    "Si genial",
    "Podria ser... quiero ver como quedaria\nPor favor",
    "Dale si me interesa un primer diseño para ver como seria🙏",
    "Hola si si me interesa",
    "Si",
    "Exelente me interesa",
    "Las dos cosas. \nMuebles publicados.\nSi es sin cargo si",
    "Bueno",
    "Si por favor",
    "Si me interesa",
    "Si\nDale",
    "vender x la web\n[audio] [adjunto: audio]\ndale\navísame\n[audio] [adjunto: audio]",
    "Bueno, ver de que se trata, quisiera tener otra forma de venta, por instagram nunca lo logre.\nBueno, dale",
    "❤️ si",
    "si",
    "Si, me interesa",
    "Ok dale. Mostrame x favor",
    "[foto] Mandó el logo de su marca que consiste en un diseño octogonal con las letras entrelazadas \"Q\" y \"P\" en color blanco sobre un fondo azul oscuro. [adjunto: imagen]",
    "si porfavor\nque datos necesitas te paso",
    "Bueno",
    "Se trata sobre libros didácticos y juguetes sensoriales también, artículos de librería. Para todas las edades y tipos de neurodivergencias\nBueno, me gustaría",
    "Sii",
    "Si",
    "Dale , me interesa",
    "Sii\nQ necesitan",
    "Si dale seguramente el plan mensual contrataria!",
    "Buenoo a ver cómo quedaría",
    "Bueno por favor",
    "Perfecto perfecto si",
    "Ok",
    "Si",
    "Si",
    "Si por ahora mensual, la idea es tomarme estos tres meses para poder organizar todo y empezar a probar para que en enero pueda comenzar a vender on Line solamente",
    "Plan mensual",
    "Ok",
    "Dale perfecto si me interesa",
    "Si porfavor\n[imagen] [adjunto: imagen]\n[imagen] [adjunto: imagen]\n[imagen] [adjunto: imagen]\n[imagen] [adjunto: imagen]\nAlgo de nuestros productos",
    "Ok",
    "Si por favor",
    "Dale",
    "Si me interesa",
    "Mi tienda es de lenceria\nDale!\nMi tienda se llama \"LUNA LENCERIA\"",
    "Bueno dale",
    "Si\nPor favor",
    "Sería bueno",
    "Dale si si",
    "Dale me interesa",
    "Si",
    "[sticker] [adjunto: sticker]\n👍🏻 si",
];

$noAunReales = [
    "Si podrian por favor?",
    "Se puede ver cómo quedaría ?",
    "Como quedaria?\nQue info estimada tendria que pasarte ?",
    "Te dejo el ig para q veas\nhttps://www.instagram.com/mitienda_demo?stkn=abc123\nSi es posible sii\nSinceramente me gustaría comenzar con un plan mensual",
    "Nose si me entendes pero vendo curso online\nY preparame quiero ver\nEs de como crear productos naturales",
];

$noReales = [
    'POSTERGA' => [
        "Paso la información con mi equipo y te vuelvo a contactar",
        "Ok gracias  después  te aviso",
        "Te confirmo en la semana q pueda jubtar el dinero",
        "Lo converso con mi equipo primero 🤗",
        "Déjame que consulte... No me interesa el mantenimiento. Si poder hacerlo de vez en cuando si es necesario pero no creo que sea necesario mensualmente. Son 4 productos solamente",
        "Déjame ver lo analiso y veo. Gracias",
        "Ok veo el link q me pasaste y te aviso estoy esperando varios presupuestos no sabía que requería un abono mensual pensé q era el diseño. Una vez intenté hacer por tienda nube pero mí tiempo limitado no me dejó avanzar",
        "Lo charlo con mi gente y te confirmo. Gracias",
        "Una vez que me den el alta el registro\nDe la marca\nAhí los contrato chuxos\nChicos",
        "Tranqui. Cierro unas últimas cosas y me contacto con ustedes",
        "Genial dejame consultar y  breve estoy contacto nuevamente \nGracias",
        "Necesito que sea un lugar de consulta. Por ejemplo de la historia de mi pueblo, que escribí un libro de investigación\nSalgo de trabajar y te mando bien mi consulta. Me interesa",
        "Lo consulto y me vuelvo a comunicar.",
        "Mira yo Keria asesorarme ya q resien cobro el viernes\nEstoy trabajando para otra persona por eso kiero ampliar mí experiencia",
        "Lo consulto y te aviso\n\$30,000 por mes incluyen todo ,es asi?",
        "ahí lo veo bien y te aviso\nmuchas gracias\nal final el otro chico no jodió más! jajaja lo pude ayudar con lo último yo y listo",
        "Dejame que vea las 3 opciones y lo decidamos con mi esposa y te vuelvo a escribir muchas gracias",
        "Ahora no tengo \$#",
        "Dale, te vuelvo a escribir más tarde / mañana x favor\nGracias",
        "Ahora veo y me comunico,  son 2 tiendas distinta la mía y la de mi esposo.",
        "Déjame analizar, muchas gracias",
        "Lo consulto con mi bolsillo y te aviso si\nCuánto sería el pago único en cuotas",
        "Me encanta déjame que lo consulto y me vuelvo a comunicar",
        "Lo hablo con mi equipo y le aviso mañana",
        "Gracias mañana te confirmo",
        "Yo la semana que viene los voy a estar contactando porque todavía tengo que cerrar algunas cosas es algo simple con poquitas cosas lo que voy a hacer pero todavía no está definido y tengo que hablar con mi socio así que la semana que viene los voy a los voy a contactar",
        "Te aviso más tarde",
        "Ahy consulto  y te digo",
        "Voy a consultarlo con mi socio y en caso de avanzar me vuelvo a comunicar con la elección de la propuesta",
        "Lo charlo con mi pareja y te vuelvo a escribir para darte una respuesta",
    ],
    'PREGUNTA' => [
        "Y la landing?",
        "Solo consulta por wp? No hay reservas online",
        "Te consulto para vender por amazon",
        "Hace falta vender en blanco ,porque yo recién arranco",
        "Tengo que pagar 30 mil por mes?",
        "Todos los meses debo abonar 30mil ?",
        "Y cuanto es el precio de la web \$20.000?",
        "Uds arman la pagina y yo tengo un costo mensual de \$ 30 000",
        "consulta y cuando esté la página web creada, tengo algún link como de admin para actualizar o algo así?",
        "Cuanto seria por mes en dólares?\nO es en pesos",
        "Dale. Me interesa. Se paga algo aparte o solo los valores que me pasaste?\nNo es necesario un primer diseño igual, Con ver alguna captura de alguno de sus trabajos me alcanza",
        "Como seria nosotros tenemos una pagina www.mitextil.com.ar pero no es atractiva no es practica para que el cliente cuando entra a ver el instagram vea la pagina y elijan los artículos",
        "[audio] Okay, okay. Y te hago una pregunta, sí, la idea mía es poder vender eh por la web, tipo carrito, que la gente pueda ir comprando. Eh, no sé si si eso después se sube a alguna página como Tienda Nube, no sé cómo cómo sería la la la movida. Eh, ¿qué era que te iba a decir? Eh, eso es lo que me interesaría y también estaría bueno eh poder subir el link a a redes sociales y que aprieten el botón y salte el WhatsApp mío eh y nos consulten y todas esas cosas. [adjunto: audio]\nDe donde son ustedes?",
        "Las 2 cosas\nPero cual es el que me conviene ?",
        "En los 3 planes yo puedo modificar stock,precio imagen??\nSe puede vincular con correo argentino?",
        "Para entender, tengo que abonar 200000 pesos y luego elegir el plan anual o mensual?",
        "Cuando se paga antes o después",
        "Mi medio de cobro es mercadopago?",
        "Es tienda nube?",
        "No es para mi,\nCuanto saldria una pagina sencilla? Es para mi novia",
        "Queria saber los precios para un web solo informativa, para el negocio y servicios",
        "en que tecnologia trabajan?\ntengo un par de presupuestos mas y me arman en wordpres.\nperdon wordpress.",
        "Hola. Tendria para mostrarme alguna pagina para ver ? Gracias",
        "[audio] Perfecto, te tengo un par de preguntas que me gustaría saber antes de proseguir. Número uno, ¿cómo funciona el tema del hosting? El tema del hosting está incluido, no está incluido por mes, según la modalidad. A su vez qué es lo que incluye el mantenimiento de esto? O sea, el mantenimiento a qué se refiere? A que si yo, si yo quiero cambiar algo les tengo que pagar un extra a ustedes por cambiarlo, qué tanto acceso tengo yo a la tienda? Puedo modificarla, no puedo modificarla a mi gusto? ¿Qué más te iba a preguntar? Es una plantilla que ustedes usan para todos los clientes o es personalizado lo que se arma? [adjunto: audio]",
        "Que incluye",
        "Te consulto se puede poner links como por ejemplo un multicotizador?",
    ],
    'RECHAZA' => [
        "No",
        "No gracias",
    ],
    'OTRO' => [
        "[video] [adjunto: video]",
        "Solo necesito landing para wsp No web page\n[video] [adjunto: video]",
        "Más q nada orientado al ciclismo",
        "Eso pago por el dominio, ya lo tengo",
        "Yo publico desde WhatsApp bines pero no tengo mucha repercusión",
        "Mí sobrina armó una página pero queremos optimizarla",
        "Ya tenemos un kiosko, la idea sería registrar a los deudores, registrar los productos para ver los precios, actualizar los precios. Todavía no vendemos por Internet pero en un futuro nos gustaría\nLo mas complicado es el Registro de productos",
        "Ah con ese mensaje automático ya no puedo subirle nada arriba jaja\nPq apenas te hablé le llega eso\nAna se llama, ya le pasé tu contacto",
        "Te comento yo compre un curso de apemax\nPartner 360",
        "Dicto curso presenciales.",
        "Para que no trabajen de mas, quizas me podrias pasar un modelo aunque sea con otros pruductos no te parece\nEs simplemente para nonponerte a.trabajar en algo que recien estoy edtudiando",
        "Hola",
        "[audio] Lo que a mí me estaría faltando es desarrollar un producto ahora, por ejemplo, yo quiero crear una marca propia. [adjunto: audio]",
        "Fm",
    ],
    'ACEPTA_CON_PREGUNTA' => [
        "la Fundacion se llama Manos Unidas, tenemos merendero, ropero comunitario, musica, arte,\nno se que datos mas necesitas",
        "Si, consulto porque nosé bien, ese sería mí negocio digital y como vende??? \nUds lo mueven para llegar a más personas, me enseñan cómo hacerlo o tengo que pagar en otro lado para que lo haga.?",
        "Si y sabes que yo no tengo idea como usarla ,siempre trabaje con local físico\nUstedes me enseñan?",
        "Consulta quien manejaria las páginas\nSisi kiero que lo armen",
        "Sí, me interesa. Antes de avanzar con el diseño quería confirmar bien qué incluye el pago único de \$200.000, porque mi idea es hacer una inversión ahora y después poder administrar la web yo misma sin depender de un plan mensual.\nQuería consultar:\n• ¿La web sería solo catálogo o también puede funcionar como tienda online con carrito y compra directa?",
        "Buenísimo. Si si me gustaría ver un diseño.\nEsto sería en tiendanube o algo así o me equivoco?\nNosé mucho de esto.",
        "Si que necesitas para hacerlo\nQue diferencia hay entre el plan anual con mantenimiento y el de pago único.",
        "Si por favor, consulta la gente q compré lo abona directamente de la página o se contactan conmigo?",
        "Y cuantos me sale?\nQué requisitos tengo que mandarte",
        "Buenísimo dale, ese sería el precio final por mes? Si contrato mensual?",
        "Bien\nTienen INSTANGRAM?",
        "Me interesa de dónde son\nPara probar el mensual",
        "1\nSi\nComo haria para el control de la cuenta ? Me pasan un ID ?",
    ],
];

echo "— 1. Los síes reales se llevan el formulario —\n";
foreach ($siReales as $x) caso('acepta ' . nombre_respuesta($x), wabot_oferta_diseno_aceptada($x));

echo "\n— 2. Síes reales que siguen yendo a Pablo (a propósito) —\n";
/* "Si podrian por favor?" y "Se puede ver cómo quedaría ?" son pedidos con
 * forma de pregunta: el "?" manda y lo ve Pablo. "Como quedaria? // Que info
 * estimada…" pregunta dos cosas. El del link de Instagram dice "si es
 * posible", que también es pregunta. "Nose si me entendes pero vendo curso
 * online // Y preparame quiero ver" trae un "pero": se prefiere perder ese sí
 * a mandarle el formulario a un "sí, pero…". */
foreach ($noAunReales as $x) caso('todavía no acepta ' . nombre_respuesta($x), !wabot_oferta_diseno_aceptada($x));

echo "\n— 3. Lo que no es un sí limpio no se lleva el formulario —\n";
foreach ($noReales as $clase => $textos) {
    foreach ($textos as $x) caso(strtolower($clase) . ': no acepta ' . nombre_respuesta($x), !wabot_oferta_diseno_aceptada($x));
}

echo "\n— 4. Formas inventadas del sí —\n";
foreach (['si porfavor', 'Si porfavor', 'por favor', 'Por favor .', 'porfa', 'si por fa', 'Siiii', 'sip', 'si si', 'Sisi',
          'si seria bueno', 'Sería bueno', 'sería genial', 'si claro', 'Sí, cómo no!', 'si te paso el logo', 'te paso los datos',
          'Si, te paso los datos', 'si me parece', 'me parece perfecto', 'me parece genial', 'Si es sin cargo si',
          'sería anual', 'Prefiero el anual', 'sería mensual', 'mostrame', 'Ok dale. Mostrame x favor', 'Bueno dale',
          'Dale!', '👍🏻 si', '❤️ si', 'Si 😊', 'Dale 🙏', 'Si si me interesa y puedo pagar por mes',
          'Ok si no es molestia armalo', 'Dale si me interesa para ver como seria', 'Buenoo a ver cómo quedaría',
          "Hola\nsi", "Mi local se llama La Esquina\nok", "Vendemos ropa de bebé\nDale!", "Gracias por la atención\nsi",
          "[sticker] [adjunto: sticker]\n👍🏻 si", "Que datos necesitas", "Sii\nQ necesitan", "si porfa\nque info te paso",
          'Que necesitas para hacer el diseño', 'me guataria ver de q se trata'] as $x) {
    caso('acepta ' . nombre_respuesta($x), wabot_oferta_diseno_aceptada($x));
}

echo "\n— 5. Lo inventado que tiene que seguir yendo a Pablo —\n";
foreach (['si no', 'no se', 'nose', 'no gracias', 'ahora no', 'por ahora no', 'si pero mas adelante', 'dale pero primero lo hablo',
          'si, despues te aviso', 'lo pienso', 'dale lo pienso', 'me interesa pero es caro', 'bueno lo consulto', 'dale te aviso',
          'si me interesa pero ahora no tengo plata', 'si, cuanto sale?', 'seria bueno pero es caro', 'seria bueno saber el precio',
          'mostrame precios', 'me parece caro', 'me parece bien pero lo hablo con mi socio', 'Gracias, lo veo y te digo',
          'Te paso el logo mañana', 'Si, mañana te paso los datos', 'Que necesitas? Cuanto sale?', 'si por favor, cuanto tarda',
          'se llama La Esquina', 'Si es caro no', 'seria el mensual?', 'sería anual o mensual', 'ok gracias', "ok\ngracias",
          'Gracias // Saludos', 'y si', 'depende si', 'Lo converso con mi socia', 'Déjame analizarlo', 'Ahora veo y te digo',
          'Si, cuando cobre lo hacemos', 'Una vez que tenga el logo arrancamos', 'Lo decido con mi esposa', "Hola\nCuanto sale?\nsi",
          "Te paso el logo\nmañana te escribo", "si\nllamame", "si\nprefiero hablar con una persona", 'que necesito para pagar',
          'si, que necesitan para contratar el plan', "Que datos necesitas\ncuanto sale",
          "Si que necesitas\nQue diferencia hay entre el anual y el pago único", '😊', '🙏', "[audio] [adjunto: audio]"] as $x) {
    caso('no acepta ' . nombre_respuesta($x), !wabot_oferta_diseno_aceptada($x));
}

echo "\n— 6. La pregunta de verdad —\n";
foreach (['Que diferencia hay entre el plan anual y el pago único' => true, 'q precio tiene' => true,
          'Si podrian por favor?' => true, 'Dale si me interesa' => false] as $x => $esperada) {
    caso(($esperada ? 'pregunta ' : 'no pregunta ') . nombre_respuesta($x), wabot_oferta_diseno_pregunta($x) === $esperada);
}

echo "\n— 7. El sí que llega por wabot_prospecto_acepta (charla con el precio ya dado) —\n";
$recien = ['precio_dado' => true, 'precio_cta_pendiente' => true, 'precio_turnos_desde' => 1];
$despues = ['precio_dado' => true, 'precio_cta_pendiente' => false, 'precio_turnos_desde' => 3];
foreach (['Siiii', 'Si porfavor', 'por favor', 'Sería bueno', 'si claro', 'Si, armala'] as $x) {
    caso('justo después del precio acepta ' . nombre_respuesta($x), wabot_prospecto_acepta($x, $recien));
}
foreach (['Siiii', 'Si porfavor', 'Sería bueno'] as $x) {
    // Un sí pelado tres turnos después puede contestar otra cosa: no se toma.
    caso('más tarde no toma el sí pelado ' . nombre_respuesta($x), !wabot_prospecto_acepta($x, $despues));
}
foreach (['quiero avanzar, te dejo el ig https://www.instagram.com/mitienda_demo?stkn=abc123', 'Ok si no es molestia armala'] as $x) {
    caso('el "?" de un link o "si no es molestia" no frenan ' . nombre_respuesta($x), wabot_prospecto_acepta($x, $despues));
}
foreach (['si no', 'no gracias', 'lo voy a pensar', 'Si, cuanto sale?', 'es caro', 'Gracias'] as $x) {
    caso('no acepta ' . nombre_respuesta($x), !wabot_prospecto_acepta($x, $recien));
}

todo_ok();
