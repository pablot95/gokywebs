/* Catálogo de The Travel Edit: destinos → paquetes → fotos y videos.
   En la web final esto se carga desde el panel (sin tocar código). */
const DESTINOS = [
  {
    slug: "argentina",
    nombre: "Argentina",
    portada: "calafate-1.webp",
    bajada:
      "Cataratas, glaciares y quebradas de colores. El país entero, a tu ritmo.",
    paquetes: [
      {
        slug: "cataratas",
        nombre: "Cataratas del Iguazú",
        resumen:
          "Pasarelas entre la selva y el estruendo de la Garganta del Diablo, con tiempo para recorrerlas sin apuro.",
        texto:
          "Las cataratas se viven mejor en dos o tres días: un circuito por la mañana temprano, otro por la tarde y una escapada al lado brasileño para verlas de frente. Elegimos el alojamiento según cuánto quieras estar cerca de la selva.",
        destacados: [
          "Circuitos superior e inferior del Parque Nacional",
          "Garganta del Diablo",
          "Vista panorámica desde el lado brasileño",
          "Alojamiento rodeado de selva",
        ],
        fotos: [
          { src: "iguazu-1.webp", alt: "Saltos de las Cataratas del Iguazú entre la vegetación" },
          { src: "iguazu-2.webp", alt: "Agua cayendo con fuerza entre rocas y bruma en Iguazú" },
        ],
        videos: [],
      },
      {
        slug: "el-calafate",
        nombre: "El Calafate y los glaciares",
        resumen:
          "El Perito Moreno desde las pasarelas, navegaciones entre témpanos y la estepa patagónica.",
        texto:
          "Un viaje para mirar el hielo de cerca. Combinamos las pasarelas del Perito Moreno con una navegación por el lago Argentino y, si te gusta caminar, unos días en El Chaltén.",
        destacados: [
          "Pasarelas frente al glaciar Perito Moreno",
          "Navegación por el lago Argentino",
          "Escapada a El Chaltén",
          "Estancias patagónicas",
        ],
        fotos: [
          { src: "calafate-1.webp", alt: "Glaciar Perito Moreno sobre el lago, con montañas nevadas" },
          { src: "calafate-3.webp", alt: "Frente del glaciar visto desde las pasarelas entre árboles" },
          { src: "calafate-2.webp", alt: "Barco navegando frente a la pared de hielo del glaciar" },
        ],
        videos: [],
      },
      {
        slug: "salta-y-jujuy",
        nombre: "Salta y Jujuy",
        resumen:
          "Cardones, cerros de colores y pueblos de adobe en la ruta del norte argentino.",
        texto:
          "Un recorrido por rutas de montaña con paradas para comer bien y dormir en lugares con carácter. Quebrada de Humahuaca, Purmamarca y los valles de Cafayate, al ritmo que elijas.",
        destacados: [
          "Quebrada de Humahuaca",
          "Cerro de los Siete Colores en Purmamarca",
          "Salinas Grandes",
          "Bodegas de altura en Cafayate",
        ],
        fotos: [
          { src: "norte-1.webp", alt: "Cardones en un cerro del norte argentino bajo cielo azul" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "chile",
    nombre: "Chile",
    portada: "torres-del-paine-1.webp",
    bajada: "De la Patagonia al desierto más alto: dos extremos en un mismo país.",
    paquetes: [
      {
        slug: "torres-del-paine",
        nombre: "Torres del Paine",
        resumen:
          "Caminatas, lagos turquesa y lodges con vista a los Cuernos del Paine.",
        texto:
          "Un parque para recorrer caminando o con excursiones más tranquilas, siempre con el paisaje de frente. Se puede combinar con El Calafate cruzando la frontera.",
        destacados: [
          "Caminata a la base de las Torres",
          "Lodges dentro del parque",
          "Lagos y glaciares",
          "Combinable con El Calafate",
        ],
        fotos: [
          { src: "torres-del-paine-1.webp", alt: "Casa de campo frente a los Cuernos del Paine" },
          { src: "torres-del-paine-2.webp", alt: "Las tres Torres del Paine bajo un cielo azul intenso" },
        ],
        videos: [{ id: "Na1xB7RCrMY", titulo: "Torres del Paine" }],
      },
      {
        slug: "atacama",
        nombre: "Desierto de Atacama",
        resumen:
          "Lagunas altiplánicas, volcanes y algunos de los cielos más limpios del mundo.",
        texto:
          "San Pedro de Atacama es la base para salir cada día a un paisaje distinto: salares, géiseres al amanecer y noches para mirar las estrellas.",
        destacados: [
          "Valle de la Luna",
          "Lagunas altiplánicas",
          "Géiseres del Tatio al amanecer",
          "Observación astronómica",
        ],
        fotos: [
          { src: "atacama-1.webp", alt: "Volcán nevado reflejado en una laguna del altiplano" },
          { src: "atacama-2.webp", alt: "Volcanes sobre la llanura del desierto al atardecer" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "peru",
    nombre: "Perú",
    portada: "machu-picchu.webp",
    bajada: "Cusco, el Valle Sagrado y Machu Picchu, con el tren como protagonista.",
    paquetes: [
      {
        slug: "machu-picchu-en-tren",
        nombre: "Machu Picchu en tren",
        resumen:
          "Un viaje en tren de lujo por el valle hasta la ciudadela inca.",
        texto:
          "El camino a Machu Picchu puede ser parte de la experiencia: vagones con ventanales, almuerzo a bordo y el río Urubamba al costado. Organizamos la visita guiada y los tiempos para disfrutarla.",
        destacados: [
          "Tren de lujo desde Cusco",
          "Visita guiada a la ciudadela",
          "Noche en Aguas Calientes o regreso en el día",
          "Combinable con el Valle Sagrado",
        ],
        fotos: [
          { src: "machu-picchu.webp", alt: "Ciudadela de Machu Picchu con el Huayna Picchu detrás" },
          { src: "tren-interior.webp", alt: "Mesa servida junto a la ventana de un tren" },
        ],
        videos: [{ id: "x_OxJJzPg6U", titulo: "En tren hasta Machu Picchu" }],
      },
      {
        slug: "cusco-y-valle-sagrado",
        nombre: "Cusco y el Valle Sagrado",
        resumen:
          "Calles empedradas, mercados de altura y pueblos incas para recorrer sin apuro.",
        texto:
          "Unos días en Cusco y el Valle Sagrado sirven para aclimatarse y para entender todo lo que vas a ver después. Pisac, Ollantaytambo y el barrio de San Blas, entre otros.",
        destacados: [
          "Barrio de San Blas",
          "Mercado de Pisac",
          "Ollantaytambo",
          "Tiempo para aclimatarse",
        ],
        fotos: [
          { src: "cusco.webp", alt: "Calle empedrada de Cusco entre casas blancas con balcones" },
          { src: "peru-llamas.webp", alt: "Llamas en un campo con montañas al fondo" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "europa",
    nombre: "Europa",
    portada: "pueblo.webp",
    bajada: "Pueblos de piedra, canales, campos de lavanda y paisajes de cuento.",
    paquetes: [
      {
        slug: "provenza",
        nombre: "Provenza y la Costa Azul",
        resumen:
          "Pueblos del Luberon, mercados, vinos rosados y la luz del sur de Francia.",
        texto:
          "Un viaje para manejar sin apuro entre pueblos de piedra y terminar frente al mar. Elegimos casas de campo y hoteles chicos con carácter.",
        destacados: [
          "Pueblos del Luberon",
          "Campos de lavanda (junio y julio)",
          "Mercados provenzales",
          "Niza y la Costa Azul",
        ],
        fotos: [
          { src: "provenza.webp", alt: "Casona provenzal entre pinos al atardecer" },
          { src: "hotel.webp", alt: "Patio de piedra con piscina y un olivo" },
          { src: "terraza.webp", alt: "Terraza con cortinas de lino frente al mar" },
        ],
        videos: [],
      },
      {
        slug: "amsterdam",
        nombre: "Ámsterdam y los Países Bajos",
        resumen: "Canales, museos y bicicleta por el campo holandés.",
        texto:
          "Ámsterdam se disfruta caminando y desde el agua. Desde ahí, trenes cortos llevan a pueblos de molinos o a Bruselas y París.",
        destacados: [
          "Paseo por los canales",
          "Museos de la ciudad",
          "Pueblos y molinos en bicicleta",
          "Combinable en tren con Bruselas o París",
        ],
        fotos: [
          { src: "amsterdam.webp", alt: "Terraza con flores junto a un canal de Ámsterdam" },
        ],
        videos: [],
      },
      {
        slug: "mediterraneo",
        nombre: "Islas y costas del Mediterráneo",
        resumen: "Escaleras con buganvilias, calas y cenas frente al mar.",
        texto:
          "Islas griegas, la costa amalfitana o Mallorca: elegimos juntos según la época y el ritmo que buscás.",
        destacados: [
          "Islas griegas",
          "Costa amalfitana",
          "Navegaciones de un día",
          "Hoteles boutique frente al mar",
        ],
        fotos: [
          { src: "pueblo.webp", alt: "Escalera de piedra con flores y el mar al fondo" },
          { src: "terraza.webp", alt: "Terraza con vista al mar" },
        ],
        videos: [],
      },
      {
        slug: "capadocia",
        nombre: "Capadocia y Estambul",
        resumen: "Globos al amanecer y una ciudad entre dos continentes.",
        texto:
          "Unos días en Estambul y un vuelo corto a Capadocia, para dormir en un hotel en la roca y subir a un globo al salir el sol.",
        destacados: [
          "Vuelo en globo al amanecer",
          "Hotel cueva en Capadocia",
          "Bazares y mezquitas de Estambul",
          "Paseo por el Bósforo",
        ],
        fotos: [
          { src: "globo.webp", alt: "Globo aerostático sobre un valle al amanecer" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "africa",
    nombre: "África",
    portada: "safari-cebras.webp",
    bajada: "Safaris para ver la fauna en su lugar y lodges en medio de la sabana.",
    paquetes: [
      {
        slug: "safari",
        nombre: "Safari en Kenia y Tanzania",
        resumen:
          "Salidas al amanecer, campamentos de lona y la gran migración según la temporada.",
        texto:
          "Un primer safari bien armado cambia todo: cuántos días, qué reservas y qué tipo de lodge. Lo pensamos con vos y lo podés terminar con unos días de playa en Zanzíbar.",
        destacados: [
          "Masái Mara y Serengeti",
          "Gran migración (según temporada)",
          "Lodges y campamentos de lona",
          "Final de playa en Zanzíbar",
        ],
        fotos: [
          { src: "safari-cebras.webp", alt: "Dos cebras juntas en la sabana" },
          { src: "safari-elefantes.webp", alt: "Familia de elefantes caminando por la sabana" },
          { src: "safari-jirafa.webp", alt: "Jirafa entre arbustos secos" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "maldivas",
    nombre: "Maldivas e islas",
    portada: "maldivas.webp",
    bajada: "Agua turquesa, villas sobre el mar y días sin reloj.",
    paquetes: [
      {
        slug: "maldivas",
        nombre: "Maldivas",
        resumen:
          "Villas sobre el agua, arrecifes para hacer snorkel y atardeceres desde el muelle.",
        texto:
          "Cada isla es un resort distinto: te ayudamos a elegir según el tipo de villa, el arrecife y cómo se llega (lancha o hidroavión).",
        destacados: [
          "Villas sobre el agua",
          "Snorkel en arrecifes",
          "Traslado en lancha o hidroavión",
          "Combinable con Dubái",
        ],
        fotos: [
          { src: "maldivas.webp", alt: "Muelle de madera hacia villas sobre el agua en Maldivas" },
          { src: "indico-1.webp", alt: "Bungalows sobre el agua turquesa" },
          { src: "indico-2.webp", alt: "Muelle largo sobre agua cristalina" },
        ],
        videos: [],
      },
      {
        slug: "luna-de-miel",
        nombre: "Luna de miel en islas",
        resumen: "Un viaje para los dos, con playas, cenas especiales y tiempo de sobra.",
        texto:
          "Maldivas, Polinesia o el Caribe: pensamos el destino y los detalles para que el viaje se parezca a ustedes.",
        destacados: [
          "Villas privadas",
          "Cenas en la playa",
          "Excursiones para dos",
          "Combinaciones con una ciudad",
        ],
        fotos: [
          { src: "luna-de-miel.webp", alt: "Pareja caminando por la playa al atardecer" },
          { src: "maldivas.webp", alt: "Muelle hacia villas sobre el agua" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "caribe",
    nombre: "Caribe y México",
    portada: "caribe-1.webp",
    bajada: "Playas de arena blanca, cenotes y ruinas mayas frente al mar.",
    paquetes: [
      {
        slug: "riviera-maya",
        nombre: "Riviera Maya",
        resumen: "Tulum, cenotes y hoteles frente al mar Caribe.",
        texto:
          "Más allá de la playa: cenotes para nadar, ruinas mayas y pueblos como Bacalar. Elegimos la zona según si buscás tranquilidad o movimiento.",
        destacados: [
          "Ruinas de Tulum frente al mar",
          "Cenotes",
          "Laguna de Bacalar",
          "Hoteles adults only o para familias",
        ],
        fotos: [
          { src: "caribe-1.webp", alt: "Palmeras sobre una playa de agua transparente" },
          { src: "caribe-2.webp", alt: "Playa de arena dorada y agua turquesa vista desde arriba" },
        ],
        videos: [],
      },
      {
        slug: "islas-del-caribe",
        nombre: "Islas del Caribe",
        resumen: "Aruba, Curazao o Punta Cana: una isla para cada tipo de viaje.",
        texto:
          "Te ayudamos a elegir la isla según la época del año, el tipo de playa y lo que te gusta hacer además de descansar.",
        destacados: [
          "Aruba y Curazao",
          "Punta Cana",
          "Snorkel y navegaciones",
          "Todo incluido o boutique",
        ],
        fotos: [
          { src: "caribe-3.webp", alt: "Playa con palmeras y gente en el agua turquesa" },
          { src: "caribe-1.webp", alt: "Palmeras sobre el mar" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "trenes-y-cruceros",
    nombre: "Trenes y cruceros",
    portada: "tren-paisaje.webp",
    bajada: "Viajes en los que el camino es tan importante como el destino.",
    paquetes: [
      {
        slug: "trenes",
        nombre: "Trenes panorámicos",
        resumen: "Ventanales, coches comedor y paisajes que pasan sin apuro.",
        texto:
          "De los Alpes a los Andes: sumamos un recorrido en tren a tu itinerario o armamos el viaje alrededor de uno.",
        destacados: [
          "Trenes por los Alpes suizos",
          "Tren a Machu Picchu",
          "Coches comedor y suites",
          "Combinables con cualquier destino",
        ],
        fotos: [
          { src: "tren-paisaje.webp", alt: "Tren junto a un lago de montaña" },
          { src: "tren-interior.webp", alt: "Mesa junto a la ventana de un tren" },
        ],
        videos: [{ id: "x_OxJJzPg6U", titulo: "Un viaje en tren por los Andes" }],
      },
      {
        slug: "cruceros",
        nombre: "Cruceros",
        resumen: "Fiordos, glaciares o islas: despertarse cada día frente a otro paisaje.",
        texto:
          "Elegimos el barco y el recorrido según cómo te gusta viajar: expediciones chicas, cruceros fluviales o grandes barcos.",
        destacados: [
          "Fiordos noruegos",
          "Patagonia y Tierra del Fuego",
          "Cruceros fluviales por Europa",
          "Expediciones a la Antártida",
        ],
        fotos: [
          { src: "crucero.webp", alt: "Crucero navegando por un fiordo entre montañas" },
          { src: "calafate-2.webp", alt: "Barco frente a un glaciar" },
        ],
        videos: [],
      },
    ],
  },
];

const POSTS = [
  {
    slug: "cuando-ir-a-la-patagonia",
    titulo: "Cuándo ir a la Patagonia",
    fecha: "2026-11-10",
    foto: "calafate-3.webp",
    alt: "Glaciar Perito Moreno visto desde las pasarelas",
    resumen: "Temporadas, viento y luz: qué cambia según el mes que elijas.",
    cuerpo: [
      "La temporada fuerte va de noviembre a marzo: días largos, más servicios abiertos y el clima más amable para caminar. Enero y febrero son los meses con más gente.",
      "Octubre y abril son una buena opción si buscás tranquilidad: menos visitantes, colores de otoño o primavera y precios de alojamiento más flexibles.",
      "El viento es parte del paisaje. Conviene llevar abrigo en capas y un buen rompeviento, incluso en verano.",
      "Si combinás El Calafate con Torres del Paine, sumá un día para el cruce de frontera y el traslado.",
    ],
  },
  {
    slug: "primer-safari",
    titulo: "Tu primer safari: lo que conviene saber",
    fecha: "2026-10-28",
    foto: "safari-elefantes.webp",
    alt: "Elefantes caminando por la sabana",
    resumen: "Cuántos días, qué llevar y cómo elegir el lodge.",
    cuerpo: [
      "Para un primer safari, cuatro a seis días de salidas suelen alcanzar para ver mucha fauna sin cansarse. Más días permiten combinar reservas distintas.",
      "La ropa en tonos neutros, un buen par de binoculares y una campera liviana para las salidas del amanecer hacen la diferencia.",
      "Los lodges cambian mucho la experiencia: algunos están en reservas privadas con grupos chicos, otros más cerca de las rutas principales.",
      "Terminar con unos días de playa en Zanzíbar es una forma de bajar el ritmo antes de volver.",
    ],
  },
  {
    slug: "machu-picchu-en-tren",
    titulo: "Machu Picchu en tren: cómo es el viaje",
    fecha: "2026-10-15",
    foto: "machu-picchu.webp",
    alt: "Ciudadela de Machu Picchu",
    resumen: "Las opciones de tren, los tiempos y cómo aclimatarse antes.",
    cuerpo: [
      "Hay distintos trenes hacia Aguas Calientes, desde servicios simples hasta coches de lujo con almuerzo a bordo y música en vivo.",
      "Pasar un par de noches en el Valle Sagrado antes de subir a Machu Picchu ayuda a aclimatarse a la altura.",
      "Las entradas a la ciudadela tienen cupo y horario. Conviene reservarlas con tiempo, sobre todo entre junio y agosto.",
      "Dormir una noche en Aguas Calientes permite llegar temprano, antes de los grupos grandes.",
    ],
  },
];
