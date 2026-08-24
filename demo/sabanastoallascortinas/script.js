const WHATSAPP_NUMBER = "5492302478811";
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const CATEGORIAS = [
  {
    id: "sabanas",
    nombre: "Sábanas",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    copy: "Percal, franela y estampadas para cada estación",
  },
  {
    id: "toallas",
    nombre: "Toallas",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    copy: "Toallones, toallas de mano y sets completos",
  },
  {
    id: "cortinas",
    nombre: "Cortinas",
    imagen: "images/cortinas-luz-1200x1500.webp",
    copy: "Blackout, gasa y lino para vestir cada ventana",
  },
  {
    id: "acolchados",
    nombre: "Acolchados",
    imagen: "images/acolchados-cama-1200x1500.webp",
    copy: "Livianos, de invierno y reversibles",
  },
  {
    id: "batas",
    nombre: "Batas de Baño",
    imagen: "images/bata-bano-1200x1500.webp",
    copy: "Adultos y niños, algodón y microfibra",
  },
  {
    id: "manteles",
    nombre: "Manteles",
    imagen: "images/manteles-mesa-1200x1500.webp",
    copy: "Redondos, rectangulares e individuales",
  },
  {
    id: "almohadones",
    nombre: "Almohadones",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    copy: "Decorativos, cervicales y fundas",
  },
];

const PRODUCTOS = [
  {
    id: "p01",
    slug: "juego-sabanas-percal-200-blanco",
    nombre: "Juego de Sábanas Percal 200 Hilos Blanco",
    categoria: "sabanas",
    subcategoria: "Percal",
    precio: 34900,
    descuento: 0,
    stock: 22,
    varianteLabel: "Plaza",
    varianteOpciones: ["1 plaza", "2 plazas", "Queen", "King"],
    descripcion:
      "Percal 200 hilos 100% algodón, en blanco liso. Incluye sábana ajustable, sábana superior y dos fundas de almohada.",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    tags: ["sabanas", "percal", "blanco", "algodon"],
    destacado: true,
    nuevo: false,
    perfil: ["dormitorio", "clasica"],
  },
  {
    id: "p02",
    slug: "sabanas-estampadas-hojas-verdes",
    nombre: "Sábanas Estampadas Hojas Verdes",
    categoria: "sabanas",
    subcategoria: "Estampadas",
    precio: 38500,
    descuento: 20,
    stock: 14,
    varianteLabel: "Plaza",
    varianteOpciones: ["2 plazas", "Queen"],
    descripcion:
      "Estampado botánico en tonos verdes sobre base natural. Tela suave de fácil plancha, ideal para dormitorios luminosos.",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    tags: ["sabanas", "estampadas", "verde", "hojas"],
    destacado: true,
    nuevo: true,
    perfil: ["dormitorio", "color", "renovar"],
  },
  {
    id: "p03",
    slug: "juego-sabanas-franela-gris-invierno",
    nombre: "Juego de Sábanas Franela Gris Invierno",
    categoria: "sabanas",
    subcategoria: "Franela",
    precio: 42900,
    descuento: 0,
    stock: 9,
    varianteLabel: "Plaza",
    varianteOpciones: ["2 plazas", "Queen", "King"],
    descripcion:
      "Franela afelpada gris perla, pensada para las noches más frías. Mayor gramaje que el percal tradicional.",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    tags: ["sabanas", "franela", "gris", "invierno"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "abrigada"],
  },
  {
    id: "p04",
    slug: "sabanas-lisas-lino-beige",
    nombre: "Sábanas Lisas Lino Beige",
    categoria: "sabanas",
    subcategoria: "Lisas",
    precio: 36900,
    descuento: 15,
    stock: 18,
    varianteLabel: "Plaza",
    varianteOpciones: ["1 plaza", "2 plazas", "Queen"],
    descripcion:
      "Mezcla de lino y algodón en beige natural, con caída suelta y textura relajada. Transpirable todo el año.",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    tags: ["sabanas", "lino", "beige", "lisas"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "liviana", "clasica"],
  },
  {
    id: "p05",
    slug: "juego-sabanas-rayas-marino",
    nombre: "Juego de Sábanas Rayas Marino",
    categoria: "sabanas",
    subcategoria: "Estampadas",
    precio: 33500,
    descuento: 0,
    stock: 25,
    varianteLabel: "Plaza",
    varianteOpciones: ["1 plaza", "1 1/2 plaza", "2 plazas"],
    descripcion:
      "Finas rayas azul marino sobre blanco, estilo náutico. Percal liviano de secado rápido.",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    tags: ["sabanas", "rayas", "marino"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "clasica"],
  },
  {
    id: "p06",
    slug: "sabanas-percal-terracota",
    nombre: "Sábanas Percal Terracota",
    categoria: "sabanas",
    subcategoria: "Percal",
    precio: 35900,
    descuento: 0,
    stock: 3,
    varianteLabel: "Plaza",
    varianteOpciones: ["Queen", "King"],
    descripcion:
      "Percal liso color terracota, un básico con carácter para renovar el dormitorio sin cambiar toda la paleta.",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    tags: ["sabanas", "terracota", "percal"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "color"],
  },
  {
    id: "p07",
    slug: "juego-sabanas-infantil-estrellas",
    nombre: "Juego de Sábanas Infantil Estrellas",
    categoria: "sabanas",
    subcategoria: "Estampadas",
    precio: 27900,
    descuento: 10,
    stock: 16,
    varianteLabel: "Plaza",
    varianteOpciones: ["1 plaza"],
    descripcion:
      "Estampado de estrellas en tonos suaves, tela 100% algodón peinado. Pensado para camas de una plaza.",
    imagen: "images/sabanas-pliegue-1200x1500.webp",
    tags: ["sabanas", "infantil", "estrellas"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "regalo"],
  },

  {
    id: "p08",
    slug: "toallon-liso-blanco-premium",
    nombre: "Toallón Liso Blanco Premium",
    categoria: "toallas",
    subcategoria: "Toallón",
    precio: 15900,
    descuento: 0,
    stock: 30,
    varianteLabel: "Color",
    varianteOpciones: ["Blanco", "Crudo"],
    descripcion:
      "Rizo americano 500 g/m², alta absorción. El básico de hotel para el baño de todos los días.",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    tags: ["toallas", "toallon", "blanco"],
    destacado: true,
    nuevo: false,
    perfil: ["bano", "clasica"],
  },
  {
    id: "p09",
    slug: "set-toallas-rayas-marino",
    nombre: "Set de Toallas Rayas Marino",
    categoria: "toallas",
    subcategoria: "Set",
    precio: 22900,
    descuento: 20,
    stock: 12,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Toallón + toalla de mano a juego, con rayas marinas en los bordes. Rizo suave de secado rápido.",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    tags: ["toallas", "set", "marino"],
    destacado: true,
    nuevo: false,
    perfil: ["bano", "regalo"],
  },
  {
    id: "p10",
    slug: "toalla-mano-bordada-beige",
    nombre: "Toalla de Mano Bordada Beige",
    categoria: "toallas",
    subcategoria: "Toalla de Mano",
    precio: 8900,
    descuento: 0,
    stock: 40,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Bordado artesanal en el borde, tono beige cálido. Ideal para tocador o cocina.",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    tags: ["toallas", "mano", "bordada"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "color"],
  },
  {
    id: "p11",
    slug: "toallon-jacquard-verde-salvia",
    nombre: "Toallón Jacquard Verde Salvia",
    categoria: "toallas",
    subcategoria: "Toallón",
    precio: 18500,
    descuento: 0,
    stock: 17,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Tejido jacquard con textura propia en verde salvia. Más grueso que el rizo liso tradicional.",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    tags: ["toallas", "jacquard", "verde"],
    destacado: false,
    nuevo: true,
    perfil: ["bano", "abrigada"],
  },
  {
    id: "p12",
    slug: "toalla-playa-estampada-tropical",
    nombre: "Toalla de Playa Estampada Tropical",
    categoria: "toallas",
    subcategoria: "Playa",
    precio: 16900,
    descuento: 0,
    stock: 21,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Estampado tropical de gran formato, tela liviana de algodón que seca rápido al sol.",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    tags: ["toallas", "playa", "tropical"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "liviana", "color"],
  },
  {
    id: "p13",
    slug: "set-toallas-infantil-animalitos",
    nombre: "Set de Toallas Infantil Animalitos",
    categoria: "toallas",
    subcategoria: "Set",
    precio: 14900,
    descuento: 15,
    stock: 19,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Toalla con capucha bordada de animalitos + toalla de mano a juego. Algodón hipoalergénico.",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    tags: ["toallas", "infantil", "animalitos"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "regalo"],
  },
  {
    id: "p14",
    slug: "toallon-microalgodon-terracota",
    nombre: "Toallón Microalgodón Terracota",
    categoria: "toallas",
    subcategoria: "Toallón",
    precio: 17500,
    descuento: 0,
    stock: 0,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Fibra de microalgodón de secado ultra rápido, en terracota. Liviano y compacto para colgar.",
    imagen: "images/toallas-apiladas-1200x1500.webp",
    tags: ["toallas", "microalgodon", "terracota"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "liviana"],
  },

  {
    id: "p15",
    slug: "cortina-blackout-lisa-gris",
    nombre: "Cortina Blackout Lisa Gris",
    categoria: "cortinas",
    subcategoria: "Blackout",
    precio: 32900,
    descuento: 0,
    stock: 15,
    varianteLabel: "Ancho",
    varianteOpciones: ["1.40 m", "2.00 m"],
    descripcion:
      "Tela blackout que bloquea la luz casi por completo, en gris liso. Incluye ojales para riel o barral.",
    imagen: "images/cortinas-luz-1200x1500.webp",
    tags: ["cortinas", "blackout", "gris"],
    destacado: true,
    nuevo: false,
    perfil: ["dormitorio", "abrigada"],
  },
  {
    id: "p16",
    slug: "cortina-gasa-voile-blanca",
    nombre: "Cortina de Gasa Voile Blanca",
    categoria: "cortinas",
    subcategoria: "Gasa/Voile",
    precio: 24900,
    descuento: 0,
    stock: 28,
    varianteLabel: "Ancho",
    varianteOpciones: ["1.40 m", "2.00 m"],
    descripcion:
      "Voile translúcido blanco que deja pasar la luz filtrada. Liviana, con caída suelta.",
    imagen: "images/cortinas-luz-1200x1500.webp",
    tags: ["cortinas", "voile", "blanca"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "liviana"],
  },
  {
    id: "p17",
    slug: "cortina-estampada-botanica",
    nombre: "Cortina Estampada Botánica",
    categoria: "cortinas",
    subcategoria: "Estampadas",
    precio: 29900,
    descuento: 25,
    stock: 11,
    varianteLabel: "Ancho",
    varianteOpciones: ["1.40 m"],
    descripcion:
      "Hojas y ramas en tono verde sobre base clara. Tela de peso medio, semi-translúcida.",
    imagen: "images/cortinas-luz-1200x1500.webp",
    tags: ["cortinas", "estampada", "botanica"],
    destacado: true,
    nuevo: true,
    perfil: ["living", "color", "renovar"],
  },
  {
    id: "p18",
    slug: "cortina-lino-rustico-natural",
    nombre: "Cortina de Lino Rústico Natural",
    categoria: "cortinas",
    subcategoria: "Lino",
    precio: 35900,
    descuento: 0,
    stock: 13,
    varianteLabel: "Ancho",
    varianteOpciones: ["1.40 m", "2.00 m"],
    descripcion:
      "Textura de lino natural sin teñir, con caída pesada. Suma calidez a livings y comedores.",
    imagen: "images/cortinas-luz-1200x1500.webp",
    tags: ["cortinas", "lino", "natural"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "clasica"],
  },
  {
    id: "p19",
    slug: "cortina-blackout-termica-azul-noche",
    nombre: "Cortina Blackout Térmica Azul Noche",
    categoria: "cortinas",
    subcategoria: "Blackout",
    precio: 38500,
    descuento: 0,
    stock: 8,
    varianteLabel: "Ancho",
    varianteOpciones: ["1.40 m", "2.00 m"],
    descripcion:
      "Doble capa térmica que además de oscurecer ayuda a aislar del frío. Azul noche profundo.",
    imagen: "images/cortinas-luz-1200x1500.webp",
    tags: ["cortinas", "blackout", "termica"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "abrigada"],
  },
  {
    id: "p20",
    slug: "cortina-bambula-bordada-marfil",
    nombre: "Cortina Bambula Bordada Marfil",
    categoria: "cortinas",
    subcategoria: "Gasa/Voile",
    precio: 27900,
    descuento: 0,
    stock: 10,
    varianteLabel: "Ancho",
    varianteOpciones: ["1.40 m"],
    descripcion:
      "Bambula liviana con bordado floral en el borde inferior, tono marfil. Un clásico renovado.",
    imagen: "images/cortinas-luz-1200x1500.webp",
    tags: ["cortinas", "bambula", "bordada"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "clasica"],
  },
  {
    id: "p21",
    slug: "cortina-infantil-estrellas-blackout",
    nombre: "Cortina Infantil Estrellas Blackout",
    categoria: "cortinas",
    subcategoria: "Blackout",
    precio: 26900,
    descuento: 10,
    stock: 14,
    varianteLabel: "Ancho",
    varianteOpciones: ["1.40 m"],
    descripcion:
      "Estampado de estrellas sobre blackout, ideal para la siesta de los más chicos.",
    imagen: "images/cortinas-luz-1200x1500.webp",
    tags: ["cortinas", "infantil", "estrellas"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "regalo"],
  },

  {
    id: "p22",
    slug: "acolchado-verano-liviano-blanco",
    nombre: "Acolchado de Verano Liviano Blanco",
    categoria: "acolchados",
    subcategoria: "Verano",
    precio: 45900,
    descuento: 0,
    stock: 16,
    varianteLabel: "Plaza",
    varianteOpciones: ["2 plazas", "Queen"],
    descripcion:
      "Relleno fino de fibra, ideal para noches templadas. Funda 100% algodón lavable.",
    imagen: "images/acolchados-cama-1200x1500.webp",
    tags: ["acolchados", "verano", "blanco"],
    destacado: true,
    nuevo: false,
    perfil: ["dormitorio", "liviana"],
  },
  {
    id: "p23",
    slug: "acolchado-reversible-terracota-beige",
    nombre: "Acolchado Reversible Terracota/Beige",
    categoria: "acolchados",
    subcategoria: "Reversible",
    precio: 52900,
    descuento: 15,
    stock: 9,
    varianteLabel: "Plaza",
    varianteOpciones: ["2 plazas", "Queen"],
    descripcion:
      "Dos caras, dos looks: terracota de un lado y beige liso del otro. Cambia el dormitorio sin comprar dos.",
    imagen: "images/acolchados-cama-1200x1500.webp",
    tags: ["acolchados", "reversible", "terracota"],
    destacado: true,
    nuevo: false,
    perfil: ["dormitorio", "renovar", "color"],
  },
  {
    id: "p24",
    slug: "acolchado-invierno-relleno-siliconado",
    nombre: "Acolchado de Invierno Relleno Siliconado",
    categoria: "acolchados",
    subcategoria: "Invierno",
    precio: 68900,
    descuento: 0,
    stock: 6,
    varianteLabel: "Plaza",
    varianteOpciones: ["Queen", "King"],
    descripcion:
      "Relleno siliconado de alta densidad para el frío intenso. Funda acolchada gris perla.",
    imagen: "images/acolchados-cama-1200x1500.webp",
    tags: ["acolchados", "invierno", "siliconado"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "abrigada"],
  },
  {
    id: "p25",
    slug: "pie-de-cama-acolchado-gris-perla",
    nombre: "Pie de Cama Acolchado Gris Perla",
    categoria: "acolchados",
    subcategoria: "Pie de Cama",
    precio: 28900,
    descuento: 0,
    stock: 20,
    varianteLabel: "Plaza",
    varianteOpciones: ["2 plazas", "Queen", "King"],
    descripcion:
      "El remate perfecto a los pies de la cama, en gris perla acolchado. Suma textura sin sumar abrigo.",
    imagen: "images/acolchados-cama-1200x1500.webp",
    tags: ["acolchados", "pie de cama", "gris"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "renovar"],
  },
  {
    id: "p26",
    slug: "acolchado-estampado-geometrico",
    nombre: "Acolchado Estampado Geométrico",
    categoria: "acolchados",
    subcategoria: "Verano",
    precio: 47900,
    descuento: 20,
    stock: 12,
    varianteLabel: "Plaza",
    varianteOpciones: ["2 plazas"],
    descripcion:
      "Guarda geométrica en tonos tierra sobre base clara. Relleno liviano de entretiempo.",
    imagen: "images/acolchados-cama-1200x1500.webp",
    tags: ["acolchados", "geometrico"],
    destacado: false,
    nuevo: true,
    perfil: ["dormitorio", "color"],
  },
  {
    id: "p27",
    slug: "acolchado-infantil-nubes",
    nombre: "Acolchado Infantil Nubes",
    categoria: "acolchados",
    subcategoria: "Verano",
    precio: 32900,
    descuento: 0,
    stock: 17,
    varianteLabel: "Plaza",
    varianteOpciones: ["1 plaza"],
    descripcion:
      "Estampado de nubes en tonos pastel, relleno liviano apto para todo el año en dormitorios infantiles.",
    imagen: "images/acolchados-cama-1200x1500.webp",
    tags: ["acolchados", "infantil", "nubes"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "regalo"],
  },
  {
    id: "p28",
    slug: "acolchado-microfibra-premium-azul-noche",
    nombre: "Acolchado Microfibra Premium Azul Noche",
    categoria: "acolchados",
    subcategoria: "Invierno",
    precio: 64900,
    descuento: 0,
    stock: 5,
    varianteLabel: "Plaza",
    varianteOpciones: ["Queen", "King"],
    descripcion:
      "Microfibra de tacto sedoso, azul noche profundo. Relleno de mayor gramaje para climas fríos.",
    imagen: "images/acolchados-cama-1200x1500.webp",
    tags: ["acolchados", "microfibra", "premium"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "abrigada"],
  },

  {
    id: "p29",
    slug: "bata-bano-rizo-blanco",
    nombre: "Bata de Baño Rizo Blanco",
    categoria: "batas",
    subcategoria: "Adulto",
    precio: 34900,
    descuento: 0,
    stock: 18,
    varianteLabel: "Talle",
    varianteOpciones: ["S", "M", "L", "XL"],
    descripcion:
      "Rizo de algodón 100%, con capucha y cinturón. El clásico de siempre, en blanco.",
    imagen: "images/bata-bano-1200x1500.webp",
    tags: ["batas", "rizo", "blanco"],
    destacado: true,
    nuevo: false,
    perfil: ["bano", "clasica"],
  },
  {
    id: "p30",
    slug: "bata-bano-waffle-gris",
    nombre: "Bata de Baño Waffle Gris",
    categoria: "batas",
    subcategoria: "Adulto",
    precio: 39900,
    descuento: 15,
    stock: 10,
    varianteLabel: "Talle",
    varianteOpciones: ["S", "M", "L"],
    descripcion:
      "Tejido waffle liviano, más fresco que el rizo tradicional. Gris topo con vivos en los bolsillos.",
    imagen: "images/bata-bano-1200x1500.webp",
    tags: ["batas", "waffle", "gris"],
    destacado: true,
    nuevo: true,
    perfil: ["bano", "liviana"],
  },
  {
    id: "p31",
    slug: "bata-bano-infantil-estrellas",
    nombre: "Bata de Baño Infantil Estrellas",
    categoria: "batas",
    subcategoria: "Infantil",
    precio: 24900,
    descuento: 0,
    stock: 14,
    varianteLabel: "Talle",
    varianteOpciones: ["4-6 años", "7-9 años", "10-12 años"],
    descripcion:
      "Capucha con orejitas y estampado de estrellas. Rizo suave apto para piel sensible.",
    imagen: "images/bata-bano-1200x1500.webp",
    tags: ["batas", "infantil", "estrellas"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "regalo"],
  },
  {
    id: "p32",
    slug: "bata-bano-microfibra-terracota",
    nombre: "Bata de Baño Microfibra Terracota",
    categoria: "batas",
    subcategoria: "Adulto",
    precio: 31900,
    descuento: 0,
    stock: 13,
    varianteLabel: "Talle",
    varianteOpciones: ["S", "M", "L", "XL"],
    descripcion:
      "Microfibra de secado rápido en terracota. Liviana para usar todo el año.",
    imagen: "images/bata-bano-1200x1500.webp",
    tags: ["batas", "microfibra", "terracota"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "liviana", "color"],
  },
  {
    id: "p33",
    slug: "bata-bano-premium-capuchon-beige",
    nombre: "Bata de Baño Premium Capuchón Beige",
    categoria: "batas",
    subcategoria: "Premium",
    precio: 48900,
    descuento: 0,
    stock: 4,
    varianteLabel: "Talle",
    varianteOpciones: ["M", "L", "XL"],
    descripcion:
      "Rizo de mayor gramaje, capuchón forrado y cinturón ancho. La más abrigada de la línea.",
    imagen: "images/bata-bano-1200x1500.webp",
    tags: ["batas", "premium", "beige"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "abrigada", "regalo"],
  },
  {
    id: "p34",
    slug: "bata-bano-rayas-marino",
    nombre: "Bata de Baño Rayas Marino",
    categoria: "batas",
    subcategoria: "Adulto",
    precio: 36900,
    descuento: 0,
    stock: 11,
    varianteLabel: "Talle",
    varianteOpciones: ["S", "M", "L"],
    descripcion:
      "Rayas marinas sobre base blanca, estilo spa. Rizo de algodón peinado.",
    imagen: "images/bata-bano-1200x1500.webp",
    tags: ["batas", "rayas", "marino"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "clasica"],
  },
  {
    id: "p35",
    slug: "set-bata-toalla-waffle-verde-salvia",
    nombre: "Set Bata + Toalla Waffle Verde Salvia",
    categoria: "batas",
    subcategoria: "Premium",
    precio: 54900,
    descuento: 20,
    stock: 7,
    varianteLabel: "Talle",
    varianteOpciones: ["S", "M", "L"],
    descripcion:
      "Bata y toallón a juego en tejido waffle verde salvia. Ideal para regalar en un solo combo.",
    imagen: "images/bata-bano-1200x1500.webp",
    tags: ["batas", "set", "waffle"],
    destacado: false,
    nuevo: false,
    perfil: ["bano", "regalo"],
  },

  {
    id: "p36",
    slug: "mantel-redondo-lino-natural",
    nombre: "Mantel Redondo Lino Natural (180 cm)",
    categoria: "manteles",
    subcategoria: "Redondo",
    precio: 26900,
    descuento: 0,
    stock: 12,
    varianteLabel: "Medida",
    varianteOpciones: ["160 cm", "180 cm", "220 cm"],
    descripcion:
      "Lino natural sin teñir, caída pesada. Para mesas de 8 a 10 comensales en la medida grande.",
    imagen: "images/manteles-mesa-1200x1500.webp",
    tags: ["manteles", "redondo", "lino"],
    destacado: true,
    nuevo: false,
    perfil: ["living", "clasica"],
  },
  {
    id: "p37",
    slug: "mantel-rectangular-antimanchas-blanco",
    nombre: "Mantel Rectangular Antimanchas Blanco",
    categoria: "manteles",
    subcategoria: "Rectangular",
    precio: 22900,
    descuento: 0,
    stock: 24,
    varianteLabel: "Medida",
    varianteOpciones: ["150x220 cm", "150x250 cm"],
    descripcion:
      "Tratamiento antimanchas de fábrica, blanco liso. Pensado para el uso diario sin cuidados especiales.",
    imagen: "images/manteles-mesa-1200x1500.webp",
    tags: ["manteles", "rectangular", "antimanchas"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "renovar"],
  },
  {
    id: "p38",
    slug: "set-individuales-yute-x4",
    nombre: "Set de Individuales Yute x4",
    categoria: "manteles",
    subcategoria: "Individual",
    precio: 15900,
    descuento: 0,
    stock: 26,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Cuatro individuales tejidos en yute natural, bordes reforzados. Suman textura a cualquier mesa.",
    imagen: "images/manteles-mesa-1200x1500.webp",
    tags: ["manteles", "individuales", "yute"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "clasica"],
  },
  {
    id: "p39",
    slug: "mantel-estampado-botanico-rectangular",
    nombre: "Mantel Estampado Botánico Rectangular",
    categoria: "manteles",
    subcategoria: "Rectangular",
    precio: 24900,
    descuento: 25,
    stock: 9,
    varianteLabel: "Medida",
    varianteOpciones: ["150x220 cm"],
    descripcion:
      "Hojas y flores en tonos terracota y verde. Tela liviana de algodón con mezcla sintética.",
    imagen: "images/manteles-mesa-1200x1500.webp",
    tags: ["manteles", "estampado", "botanico"],
    destacado: true,
    nuevo: true,
    perfil: ["living", "color", "renovar"],
  },
  {
    id: "p40",
    slug: "mantel-redondo-bordado-marfil",
    nombre: "Mantel Redondo Bordado Marfil (160 cm)",
    categoria: "manteles",
    subcategoria: "Redondo",
    precio: 29900,
    descuento: 0,
    stock: 8,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Bordado artesanal en el borde, tono marfil. Para mesas de ocasión, hasta 6 comensales.",
    imagen: "images/manteles-mesa-1200x1500.webp",
    tags: ["manteles", "bordado", "marfil"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "regalo"],
  },
  {
    id: "p41",
    slug: "camino-mesa-lino-terracota",
    nombre: "Camino de Mesa Lino Terracota",
    categoria: "manteles",
    subcategoria: "Camino de Mesa",
    precio: 12900,
    descuento: 0,
    stock: 19,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Franja central en lino terracota, para sumar color sin cubrir toda la mesa.",
    imagen: "images/manteles-mesa-1200x1500.webp",
    tags: ["manteles", "camino", "terracota"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "color"],
  },
  {
    id: "p42",
    slug: "mantel-rectangular-rayas-marino",
    nombre: "Mantel Rectangular a Rayas Marino (150x250)",
    categoria: "manteles",
    subcategoria: "Rectangular",
    precio: 27900,
    descuento: 0,
    stock: 6,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Rayas marinas sobre base blanca, estilo náutico. Tela de algodón grueso, ideal para mesas largas.",
    imagen: "images/manteles-mesa-1200x1500.webp",
    tags: ["manteles", "rayas", "marino"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "clasica"],
  },

  {
    id: "p43",
    slug: "almohadon-decorativo-terracota-50",
    nombre: "Almohadón Decorativo Terracota (50x50)",
    categoria: "almohadones",
    subcategoria: "Decorativo",
    precio: 13900,
    descuento: 0,
    stock: 27,
    varianteLabel: "Medida",
    varianteOpciones: ["40x40", "50x50", "60x60"],
    descripcion:
      "Funda de algodón grueso en terracota, con relleno incluido. Suma color a sillones y camas.",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    tags: ["almohadones", "decorativo", "terracota"],
    destacado: true,
    nuevo: false,
    perfil: ["living", "color"],
  },
  {
    id: "p44",
    slug: "almohadon-cervical-viscoelastico",
    nombre: "Almohadón Cervical Viscoelástico",
    categoria: "almohadones",
    subcategoria: "Cervical",
    precio: 24900,
    descuento: 0,
    stock: 15,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Espuma viscoelástica que se adapta al cuello, funda desmontable lavable. Para dormir o para el auto.",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    tags: ["almohadones", "cervical", "viscoelastico"],
    destacado: true,
    nuevo: false,
    perfil: ["dormitorio", "clasica"],
  },
  {
    id: "p45",
    slug: "funda-almohadon-lino-beige-40",
    nombre: "Funda de Almohadón Lino Beige (40x40)",
    categoria: "almohadones",
    subcategoria: "Funda",
    precio: 9900,
    descuento: 0,
    stock: 32,
    varianteLabel: "Medida",
    varianteOpciones: ["40x40", "45x45"],
    descripcion:
      "Funda sola de lino beige natural, con cierre invisible. El relleno se vende por separado.",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    tags: ["almohadones", "funda", "lino"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "clasica"],
  },
  {
    id: "p46",
    slug: "almohadon-bordado-botanico-45",
    nombre: "Almohadón Bordado Botánico (45x45)",
    categoria: "almohadones",
    subcategoria: "Decorativo",
    precio: 16900,
    descuento: 20,
    stock: 10,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Bordado floral artesanal sobre lino crudo. Relleno de fibra siliconada incluido.",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    tags: ["almohadones", "bordado", "botanico"],
    destacado: false,
    nuevo: true,
    perfil: ["living", "regalo", "color"],
  },
  {
    id: "p47",
    slug: "almohadon-relleno-plumon-60",
    nombre: "Almohadón Relleno de Plumón (60x60)",
    categoria: "almohadones",
    subcategoria: "Decorativo",
    precio: 22900,
    descuento: 0,
    stock: 11,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Relleno de plumón sintético, mullido y liviano. Funda lisa blanca incluida.",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    tags: ["almohadones", "plumon"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "abrigada"],
  },
  {
    id: "p48",
    slug: "set-almohadones-rayas-marino-x2",
    nombre: "Set de Almohadones Rayas Marino x2 (40x40)",
    categoria: "almohadones",
    subcategoria: "Set",
    precio: 19900,
    descuento: 0,
    stock: 14,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Dos almohadones a juego con rayas marinas, relleno incluido. Ideales en pareja sobre un sillón.",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    tags: ["almohadones", "set", "rayas"],
    destacado: false,
    nuevo: false,
    perfil: ["living", "clasica"],
  },
  {
    id: "p49",
    slug: "almohadon-infantil-estrellas-35",
    nombre: "Almohadón Infantil Estrellas (35x35)",
    categoria: "almohadones",
    subcategoria: "Decorativo",
    precio: 10900,
    descuento: 0,
    stock: 20,
    varianteLabel: null,
    varianteOpciones: null,
    descripcion:
      "Estampado de estrellas en tonos pastel, tamaño chico para dormitorios infantiles.",
    imagen: "images/almohadones-detalle-1200x1500.webp",
    tags: ["almohadones", "infantil", "estrellas"],
    destacado: false,
    nuevo: false,
    perfil: ["dormitorio", "regalo"],
  },
];

const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const formatearPrecio = (n) => "$" + Math.round(n).toLocaleString("es-AR");
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);

const Cart = {
  KEY: "stc_cart",
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },
  add(producto, qty = 1, variante = null) {
    const items = this.get();
    const existing = items.find(
      (i) => i.id === producto.id && (i.variante || null) === variante,
    );
    const tope = producto.stock ?? 99;
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, variante, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get();
    const it = items.find(
      (i) => i.id === id && (i.variante || null) === variante,
    );
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, variante) {
    this.save(
      this.get().filter(
        (i) => !(i.id === id && (i.variante || null) === variante),
      ),
    );
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p) * i.qty : s;
    }, 0);
  },
};

const Vistos = {
  KEY: "stc_vistos",
  add(id) {
    let arr = this.get().filter((x) => x !== id);
    arr.unshift(id);
    arr = arr.slice(0, 8);
    localStorage.setItem(this.KEY, JSON.stringify(arr));
  },
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },
};

function showToast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (
    k === "f12" ||
    (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
    (e.ctrlKey && k === "u")
  ) {
    e.preventDefault();
  }
});

let paginaCatalogo = 16;
let filtroActual = {
  q: "",
  categoria: "all",
  subcategoria: "all",
  precio: "all",
};

function badgeHtml(p) {
  if (p.stock === 0)
    return '<span class="prod-badge prod-badge--agotado">Sin stock</span>';
  if (p.descuento > 0)
    return `<span class="prod-badge prod-badge--off">-${p.descuento}%</span>`;
  if (p.nuevo) return '<span class="prod-badge prod-badge--nuevo">Nuevo</span>';
  if (p.stock <= 4)
    return '<span class="prod-badge prod-badge--stock">Últimas unidades</span>';
  return "";
}

function cardHtml(p, i) {
  const final = precioFinal(p);
  const tachado =
    p.descuento > 0
      ? `<s class="prod-original">${formatearPrecio(p.precio)}</s>`
      : "";
  const disabled = p.stock === 0 ? "disabled" : "";
  return `
  <article class="prod-card" data-animate style="transition-delay:${Math.min(i * 0.05, 0.4)}s" data-id="${p.id}">
    <button type="button" class="prod-media" data-open="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${badgeHtml(p)}
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="600" height="750" loading="lazy">
    </button>
    <div class="prod-body">
      <p class="prod-cat">${esc(p.subcategoria)}</p>
      <h3 class="prod-nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-precio">${tachado}<span>${formatearPrecio(final)}</span></p>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="prod-add btn btn-cta" data-add="${p.id}" ${disabled}>${p.stock === 0 ? "Sin stock" : "Agregar"}</button>
      </div>
    </div>
  </article>`;
}

function renderCategorias() {
  const cont = document.getElementById("categoriasGrid");
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(
    (c, i) => `
    <a href="#tienda" class="cat-card" data-animate style="transition-delay:${i * 0.08}s" data-cat="${c.id}">
      <span class="cat-media"><img src="${c.imagen}" alt="${esc(c.nombre)}" width="500" height="625" loading="lazy"></span>
      <span class="cat-info">
        <span class="cat-nombre">${esc(c.nombre)}</span>
        <span class="cat-copy">${esc(c.copy)}</span>
      </span>
    </a>`,
  ).join("");
  cont.querySelectorAll("[data-cat]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      filtroActual.categoria = a.dataset.cat;
      filtroActual.subcategoria = "all";
      paginaCatalogo = 16;
      syncFiltrosUI();
      renderCatalogo();
      document
        .getElementById("tienda")
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    }),
  );
}

function renderRail() {
  const track = document.getElementById("railTrack");
  if (!track) return;
  const destacados = PRODUCTOS.filter((p) => p.destacado).slice(0, 8);
  track.innerHTML = destacados
    .map(
      (p) => `
    <article class="rail-card" data-id="${p.id}">
      <button type="button" class="rail-media" data-open="${p.id}" aria-label="Ver ${esc(p.nombre)}">
        ${badgeHtml(p)}
        <img src="${p.imagen}" alt="${esc(p.nombre)}" width="480" height="600" loading="lazy">
      </button>
      <div class="rail-body">
        <p class="rail-cat">${esc(p.subcategoria)}</p>
        <h3 class="rail-nombre">${esc(p.nombre)}</h3>
        <p class="prod-precio">${p.descuento > 0 ? `<s class="prod-original">${formatearPrecio(p.precio)}</s>` : ""}<span>${formatearPrecio(precioFinal(p))}</span></p>
      </div>
    </article>`,
    )
    .join("");
  bindCardEvents(track);
}

function initRailDrag() {
  const vp = document.getElementById("railViewport");
  const track = document.getElementById("railTrack");
  const prev = document.getElementById("railPrev");
  const next = document.getElementById("railNext");
  if (!vp || !track) return;
  let startX = 0,
    startScroll = 0,
    moved = false,
    pointerId = null,
    isDown = false;

  const updateArrows = () => {
    const inicio =
      parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next)
      next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };

  vp.addEventListener("pointerdown", (e) => {
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
    pointerId = e.pointerId;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add("dragging");
      try {
        vp.setPointerCapture?.(pointerId);
      } catch {
        /* sin capture el drag igual funciona */
      }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    isDown = false;
    vp.classList.remove("dragging");
    try {
      vp.releasePointerCapture?.(pointerId);
    } catch {
      /* ya liberado */
    }
  };
  vp.addEventListener("pointerup", end);
  vp.addEventListener("pointerleave", end);
  vp.addEventListener("pointercancel", end);
  vp.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
  vp.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        vp.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    },
    { passive: false },
  );
  vp.addEventListener("scroll", updateArrows, { passive: true });
  prev?.addEventListener("click", () =>
    vp.scrollBy({ left: -320, behavior: "smooth" }),
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({ left: 320, behavior: "smooth" }),
  );
  window.addEventListener("resize", updateArrows);
  updateArrows();
}

function filtrarProductos() {
  const q = norm(filtroActual.q);
  return PRODUCTOS.filter((p) => {
    if (
      filtroActual.categoria !== "all" &&
      p.categoria !== filtroActual.categoria
    )
      return false;
    if (
      filtroActual.subcategoria !== "all" &&
      p.subcategoria !== filtroActual.subcategoria
    )
      return false;
    if (filtroActual.precio !== "all") {
      const f = precioFinal(p);
      if (filtroActual.precio === "r1" && !(f < 20000)) return false;
      if (filtroActual.precio === "r2" && !(f >= 20000 && f < 40000))
        return false;
      if (filtroActual.precio === "r3" && !(f >= 40000)) return false;
    }
    if (q) {
      const hay = norm(
        [
          p.nombre,
          p.categoria,
          p.subcategoria,
          p.descripcion,
          ...(p.tags || []),
        ].join(" "),
      ).includes(q);
      if (!hay) return false;
    }
    return true;
  });
}

function syncFiltrosUI() {
  const selCat = document.getElementById("filtroCategoria");
  if (selCat) selCat.value = filtroActual.categoria;
  renderSubcategorias();
}

function renderSubcategorias() {
  const selSub = document.getElementById("filtroSubcategoria");
  if (!selSub) return;
  const subs =
    filtroActual.categoria === "all"
      ? [...new Set(PRODUCTOS.map((p) => p.subcategoria))]
      : [
          ...new Set(
            PRODUCTOS.filter((p) => p.categoria === filtroActual.categoria).map(
              (p) => p.subcategoria,
            ),
          ),
        ];
  selSub.innerHTML =
    '<option value="all">Todas las subcategorías</option>' +
    subs.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join("");
  selSub.value = filtroActual.subcategoria;
}

function renderCatalogo() {
  const cont = document.getElementById("catalogoGrid");
  const contador = document.getElementById("catalogoContador");
  const verMasBtn = document.getElementById("verMasBtn");
  const vacio = document.getElementById("catalogoVacio");
  if (!cont) return;
  const resultados = filtrarProductos();
  const visibles = resultados.slice(0, paginaCatalogo);
  cont.innerHTML = visibles.map((p, i) => cardHtml(p, i)).join("");
  if (contador)
    contador.textContent =
      resultados.length === 0
        ? "Sin resultados"
        : `${resultados.length} producto${resultados.length === 1 ? "" : "s"}`;
  if (verMasBtn) verMasBtn.hidden = paginaCatalogo >= resultados.length;
  if (vacio) vacio.hidden = resultados.length !== 0;
  cont.hidden = resultados.length === 0;
  bindCardEvents(cont);
  revelarNuevos(cont);
  if (typeof ScrollTrigger !== "undefined")
    requestAnimationFrame(() => ScrollTrigger.refresh());
}

function bindCardEvents(scope) {
  scope
    .querySelectorAll("[data-open]")
    .forEach((el) =>
      el.addEventListener("click", () => abrirModal(el.dataset.open)),
    );
  scope.querySelectorAll("[data-stepper]").forEach((step) => {
    const qtyEl = step.querySelector("[data-qty]");
    step.querySelectorAll("[data-step]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const p = getProducto(step.dataset.stepper);
        const cur = parseInt(qtyEl.textContent, 10) || 1;
        const next = Math.max(
          1,
          Math.min(cur + parseInt(btn.dataset.step, 10), p?.stock ?? 99),
        );
        qtyEl.textContent = next;
      }),
    );
  });
  scope.querySelectorAll("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const p = getProducto(btn.dataset.add);
      if (!p || p.stock === 0) return;
      const card = btn.closest(".prod-card, .rail-card");
      const qty =
        parseInt(card?.querySelector("[data-qty]")?.textContent, 10) || 1;
      const variante = p.varianteOpciones ? p.varianteOpciones[0] : null;
      Cart.add(p, qty, variante);
      showToast("¡Agregado! Tu carrito te espera");
    }),
  );
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  const items = cont.querySelectorAll("[data-animate]:not(.in)");
  items.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight + 40) el.classList.add("in");
    else io?.observe(el);
  });
}

function initFiltros() {
  const buscador = document.getElementById("buscador");
  const selCat = document.getElementById("filtroCategoria");
  const selSub = document.getElementById("filtroSubcategoria");
  const selPrecio = document.getElementById("filtroPrecio");
  const limpiar = document.getElementById("limpiarFiltros");
  const verMasBtn = document.getElementById("verMasBtn");

  selCat.innerHTML =
    '<option value="all">Todas las categorías</option>' +
    CATEGORIAS.map(
      (c) => `<option value="${c.id}">${esc(c.nombre)}</option>`,
    ).join("");
  renderSubcategorias();

  buscador?.addEventListener("input", () => {
    filtroActual.q = buscador.value;
    paginaCatalogo = 16;
    renderCatalogo();
  });
  selCat?.addEventListener("change", () => {
    filtroActual.categoria = selCat.value;
    filtroActual.subcategoria = "all";
    paginaCatalogo = 16;
    renderSubcategorias();
    renderCatalogo();
  });
  selSub?.addEventListener("change", () => {
    filtroActual.subcategoria = selSub.value;
    paginaCatalogo = 16;
    renderCatalogo();
  });
  selPrecio?.addEventListener("change", () => {
    filtroActual.precio = selPrecio.value;
    paginaCatalogo = 16;
    renderCatalogo();
  });
  limpiar?.addEventListener("click", () => {
    filtroActual = {
      q: "",
      categoria: "all",
      subcategoria: "all",
      precio: "all",
    };
    paginaCatalogo = 16;
    if (buscador) buscador.value = "";
    selCat.value = "all";
    selPrecio.value = "all";
    renderSubcategorias();
    renderCatalogo();
  });
  verMasBtn?.addEventListener("click", () => {
    paginaCatalogo += 16;
    renderCatalogo();
  });
}

function abrirModal(id) {
  const p = getProducto(id);
  if (!p) return;
  Vistos.add(p.id);
  const modal = document.getElementById("modalProducto");
  const body = document.getElementById("modalBody");
  const relacionados = PRODUCTOS.filter(
    (r) => r.categoria === p.categoria && r.id !== p.id,
  ).slice(0, 3);
  const vistosIds = Vistos.get()
    .filter((v) => v !== p.id)
    .slice(0, 8);
  const varianteHtml = p.varianteOpciones
    ? `
    <div class="modal-variante">
      <span class="modal-variante-label">${esc(p.varianteLabel)}</span>
      <div class="chip-group" data-variante-group>
        ${p.varianteOpciones.map((o, i) => `<button type="button" class="chip ${i === 0 ? "is-active" : ""}" data-variante="${esc(o)}">${esc(o)}</button>`).join("")}
      </div>
    </div>`
    : "";
  body.innerHTML = `
    <div class="modal-media">
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="700" height="875">
      ${badgeHtml(p)}
    </div>
    <div class="modal-info">
      <p class="modal-cat">${esc(p.categoria)} · ${esc(p.subcategoria)}</p>
      <h2 id="modalTitulo">${esc(p.nombre)}</h2>
      <p class="modal-precio">${p.descuento > 0 ? `<s class="prod-original">${formatearPrecio(p.precio)}</s>` : ""}<span>${formatearPrecio(precioFinal(p))}</span></p>
      <p class="modal-desc">${esc(p.descripcion)}</p>
      ${varianteHtml}
      <div class="modal-qty">
        <span class="modal-variante-label">Cantidad</span>
        <div class="stepper" data-stepper-modal>
          <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="modalAgregar" ${p.stock === 0 ? "disabled" : ""}>${p.stock === 0 ? "Sin stock" : "Agregar al carrito"}</button>
        <button type="button" class="btn btn-cta" id="modalComprar" ${p.stock === 0 ? "disabled" : ""}>Comprar ahora</button>
      </div>
      ${relacionados.length ? `<div class="modal-relacionados"><h3>También te puede interesar</h3><div class="modal-relacionados-grid">${relacionados.map((r) => `<button type="button" class="mini-card" data-open="${r.id}"><img src="${r.imagen}" alt="${esc(r.nombre)}" width="200" height="250" loading="lazy"><span>${esc(r.nombre)}</span><span class="mini-precio">${formatearPrecio(precioFinal(r))}</span></button>`).join("")}</div></div>` : ""}
      ${
        vistosIds.length
          ? `<div class="modal-relacionados"><h3>Vistos recientemente</h3><div class="modal-relacionados-grid">${vistosIds
              .map((vid) => {
                const v = getProducto(vid);
                return v
                  ? `<button type="button" class="mini-card" data-open="${v.id}"><img src="${v.imagen}" alt="${esc(v.nombre)}" width="200" height="250" loading="lazy"><span>${esc(v.nombre)}</span><span class="mini-precio">${formatearPrecio(precioFinal(v))}</span></button>`
                  : "";
              })
              .join("")}</div></div>`
          : ""
      }
    </div>`;

  body
    .querySelectorAll("[data-open]")
    .forEach((el) =>
      el.addEventListener("click", () => abrirModal(el.dataset.open)),
    );
  body.querySelectorAll("[data-variante]").forEach((chip) =>
    chip.addEventListener("click", () => {
      body
        .querySelectorAll("[data-variante]")
        .forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    }),
  );
  const qtyModal = body.querySelector("[data-stepper-modal] [data-qty]");
  body
    .querySelector("[data-stepper-modal]")
    ?.querySelectorAll("[data-step]")
    .forEach((btn) =>
      btn.addEventListener("click", () => {
        const cur = parseInt(qtyModal.textContent, 10) || 1;
        qtyModal.textContent = Math.max(
          1,
          Math.min(cur + parseInt(btn.dataset.step, 10), p.stock ?? 99),
        );
      }),
    );
  const varianteSeleccionada = () =>
    body.querySelector("[data-variante].is-active")?.dataset.variante ||
    (p.varianteOpciones ? p.varianteOpciones[0] : null);
  document.getElementById("modalAgregar")?.addEventListener("click", () => {
    const qty = parseInt(qtyModal.textContent, 10) || 1;
    Cart.add(p, qty, varianteSeleccionada());
    showToast("¡Agregado! Tu carrito te espera");
  });
  document.getElementById("modalComprar")?.addEventListener("click", () => {
    const qty = parseInt(qtyModal.textContent, 10) || 1;
    Cart.add(p, qty, varianteSeleccionada());
    cerrarModal();
    abrirDrawer();
  });

  const jsonLd = document.getElementById("productJsonLd");
  if (jsonLd)
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.nombre,
      description: p.descripcion,
      image: p.imagen,
      offers: {
        "@type": "Offer",
        priceCurrency: "ARS",
        price: precioFinal(p),
        availability:
          p.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
    });

  const lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  window.lenis?.stop?.();
  requestAnimationFrame(() => modal.classList.add("open"));
  modal._lastFocused = lastFocused;
  modal.querySelector(".modal-close")?.focus();
}

function cerrarModal() {
  const modal = document.getElementById("modalProducto");
  if (!modal || modal.hidden) return;
  modal.classList.remove("open");
  document.body.classList.remove("no-scroll");
  window.lenis?.start?.();
  setTimeout(() => {
    modal.hidden = true;
  }, 320);
  modal._lastFocused?.focus?.();
}

function initModal() {
  const modal = document.getElementById("modalProducto");
  modal
    ?.querySelector(".modal-backdrop")
    ?.addEventListener("click", cerrarModal);
  modal?.querySelector(".modal-close")?.addEventListener("click", cerrarModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) cerrarModal();
    if (e.key === "Tab" && modal && !modal.hidden) {
      const focusables = modal.querySelectorAll(
        'button, a, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0],
        last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

function renderDrawer() {
  const cont = document.getElementById("drawerItems");
  const totalEl = document.getElementById("drawerTotal");
  const vacio = document.getElementById("drawerVacio");
  if (!cont) return;
  const items = Cart.get();
  if (!items.length) {
    cont.innerHTML = "";
    if (vacio) vacio.hidden = false;
    if (totalEl) totalEl.textContent = formatearPrecio(0);
    return;
  }
  if (vacio) vacio.hidden = true;
  cont.innerHTML = items
    .map((i) => {
      const p = getProducto(i.id);
      if (!p) return "";
      return `
    <div class="drawer-item" data-line="${i.id}" data-variante="${esc(i.variante || "")}">
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="90" height="112" loading="lazy">
      <div class="drawer-item-info">
        <p class="drawer-item-nombre">${esc(p.nombre)}</p>
        ${i.variante ? `<p class="drawer-item-variante">${esc(i.variante)}</p>` : ""}
        <p class="drawer-item-precio">${formatearPrecio(precioFinal(p))}</p>
        <div class="stepper stepper--sm" data-drawer-stepper>
          <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
          <span data-qty>${i.qty}</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
      </div>
      <button type="button" class="drawer-item-remove" data-remove aria-label="Quitar del carrito">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6" stroke-linecap="round"/></svg>
      </button>
    </div>`;
    })
    .join("");
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());

  cont.querySelectorAll(".drawer-item").forEach((line) => {
    const id = line.dataset.line,
      variante = line.dataset.variante || null;
    line.querySelector("[data-remove]")?.addEventListener("click", () => {
      Cart.remove(id, variante);
      showToast("Producto quitado del carrito");
    });
    const qtyEl = line.querySelector("[data-qty]");
    line.querySelectorAll("[data-step]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const cur = parseInt(qtyEl.textContent, 10) || 1;
        Cart.setQty(id, variante, cur + parseInt(btn.dataset.step, 10));
      }),
    );
  });
}

function abrirDrawer() {
  const drawer = document.getElementById("drawerCarrito");
  drawer._lastFocused = document.activeElement;
  drawer.hidden = false;
  document.body.classList.add("no-scroll", "drawer-open");
  window.lenis?.stop?.();
  requestAnimationFrame(() => drawer.classList.add("open"));
  drawer.querySelector(".drawer-close")?.focus();
}
function cerrarDrawer() {
  const drawer = document.getElementById("drawerCarrito");
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove("open");
  document.body.classList.remove("no-scroll", "drawer-open");
  window.lenis?.start?.();
  setTimeout(() => {
    drawer.hidden = true;
  }, 340);
  drawer._lastFocused?.focus?.();
}

function initDrawer() {
  const drawer = document.getElementById("drawerCarrito");
  document
    .querySelectorAll("[data-cart-open]")
    .forEach((b) => b.addEventListener("click", abrirDrawer));
  drawer
    ?.querySelector(".drawer-backdrop")
    ?.addEventListener("click", cerrarDrawer);
  drawer
    ?.querySelectorAll(".drawer-close")
    ?.forEach((b) => b.addEventListener("click", cerrarDrawer));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && !drawer.hidden) cerrarDrawer();
    if (e.key === "Tab" && drawer && !drawer.hidden) {
      const focusables = drawer.querySelectorAll(
        'button, a, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0],
        last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  document.getElementById("drawerCheckout")?.addEventListener("click", () => {
    showToast(
      "¡Genial! El pago online se activa al pasar la web a producción.",
    );
  });
  document.addEventListener("cart:updated", renderDrawer);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll("[data-cart-count]").forEach((b) => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove("bump");
    void b.offsetWidth;
    if (n) b.classList.add("bump");
  });
}
document.addEventListener("cart:updated", updateCartBadge);

function initFloats() {
  const wsp = document.getElementById("wsp-float");
  const cart = document.getElementById("cart-float");
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle("visible", scrolled);
    cart?.classList.toggle("visible", scrolled || Cart.count() > 0);
  };
  window.addEventListener("scroll", sync, { passive: true });
  document.addEventListener("cart:updated", sync);
  cart?.addEventListener("click", abrirDrawer);
  sync();
}

function initNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeBtn = document.getElementById("navClose");
  if (!toggle || !nav) return;
  const header = document.querySelector(".site-header");
  let bd = document.querySelector(".nav-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.className = "nav-backdrop";
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia("(min-width: 861px)");
  const close = () => {
    nav.classList.remove("open");
    bd.classList.remove("open");
    if (!desktopMq.matches) nav.setAttribute("inert", "");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  const open = () => {
    nav.classList.add("open");
    bd.classList.add("open");
    nav.removeAttribute("inert");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    nav.querySelector("a")?.focus();
  };
  toggle.addEventListener("click", () =>
    nav.classList.contains("open") ? close() : open(),
  );
  closeBtn?.addEventListener("click", () => {
    close();
    toggle.focus();
  });
  bd.addEventListener("click", close);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute("inert");
    else if (!nav.classList.contains("open")) nav.setAttribute("inert", "");
  };
  desktopMq.addEventListener("change", syncInert);
  syncInert();
}

function initWspHref() {
  const lines = [
    "Hola! Quiero consultar por sus productos de blanquería (sábanas, toallas, cortinas, acolchados, batas, manteles o almohadones).",
  ];
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  document
    .querySelectorAll("[data-wsp-href]")
    .forEach((a) => a.setAttribute("href", href));
}

const PREGUNTAS_CONSULTIVO = [
  {
    pregunta: "¿Para qué ambiente es?",
    opciones: [
      { label: "Dormitorio", tag: "dormitorio" },
      { label: "Baño", tag: "bano" },
      { label: "Living o comedor", tag: "living" },
    ],
  },
  {
    pregunta: "¿Qué estás buscando?",
    opciones: [
      { label: "Renovar todo", tag: "renovar" },
      { label: "Un toque de color", tag: "color" },
      { label: "Es para regalo", tag: "regalo" },
    ],
  },
  {
    pregunta: "¿Cómo te gusta la tela?",
    opciones: [
      { label: "Suave y abrigada", tag: "abrigada" },
      { label: "Fresca y liviana", tag: "liviana" },
      { label: "Clásica y lisa", tag: "clasica" },
    ],
  },
];

function initConsultivo() {
  const cont = document.getElementById("consultivoPreguntas");
  const ficha = document.getElementById("consultivoFicha");
  const resultado = document.getElementById("consultivoResultado");
  const resultadoGrid = document.getElementById("consultivoResultadoGrid");
  if (!cont) return;
  const respuestas = [];

  function renderPregunta(idx) {
    if (idx >= PREGUNTAS_CONSULTIVO.length) {
      mostrarResultado();
      return;
    }
    const q = PREGUNTAS_CONSULTIVO[idx];
    cont.innerHTML = `
      <p class="consultivo-numero">Pregunta ${idx + 1} de ${PREGUNTAS_CONSULTIVO.length}</p>
      <h3>${esc(q.pregunta)}</h3>
      <div class="chip-group chip-group--grande">
        ${q.opciones.map((o) => `<button type="button" class="chip chip--grande" data-tag="${o.tag}" data-label="${esc(o.label)}">${esc(o.label)}</button>`).join("")}
      </div>`;
    cont.querySelectorAll("[data-tag]").forEach((chip) =>
      chip.addEventListener("click", () => {
        const label = chip.dataset.label,
          tag = chip.dataset.tag;
        respuestas.push(tag);
        const item = document.createElement("span");
        item.className = "ficha-chip";
        item.textContent = label;
        ficha?.appendChild(item);
        if (typeof gsap !== "undefined" && !reduceMotion) {
          gsap.fromTo(
            item,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
          );
        }
        renderPregunta(idx + 1);
      }),
    );
  }

  function mostrarResultado() {
    cont.hidden = true;
    resultado.hidden = false;
    const puntuados = PRODUCTOS.map((p) => ({
      p,
      score: (p.perfil || []).filter((t) => respuestas.includes(t)).length,
    }));
    puntuados.sort(
      (a, b) => b.score - a.score || b.p.destacado - a.p.destacado,
    );
    const top3 = puntuados.slice(0, 3).map((x) => x.p);
    const state =
      typeof window.Flip !== "undefined" && !reduceMotion
        ? window.Flip.getState(resultadoGrid.children)
        : null;
    resultadoGrid.innerHTML = top3
      .map(
        (p) => `
      <article class="consultivo-card">
        <div class="consultivo-card-media"><img src="${p.imagen}" alt="${esc(p.nombre)}" width="400" height="500" loading="lazy"></div>
        <p class="consultivo-elegido">Elegido por vos</p>
        <h4>${esc(p.nombre)}</h4>
        <p class="prod-precio"><span>${formatearPrecio(precioFinal(p))}</span></p>
        <button type="button" class="btn btn-cta" data-add="${p.id}">Agregar al carrito</button>
      </article>`,
      )
      .join("");
    resultadoGrid.querySelectorAll("[data-add]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const p = getProducto(btn.dataset.add);
        Cart.add(p, 1, p.varianteOpciones ? p.varianteOpciones[0] : null);
        showToast("¡Agregado! Tu carrito te espera");
      }),
    );
    if (state && typeof window.Flip !== "undefined")
      window.Flip.from(state, {
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
      });
    revelarNuevos(resultado);
  }

  document
    .getElementById("consultivoSaltear")
    ?.addEventListener("click", () => {
      document
        .getElementById("tienda")
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  document
    .getElementById("consultivoReiniciar")
    ?.addEventListener("click", () => {
      respuestas.length = 0;
      if (ficha) ficha.innerHTML = "";
      resultado.hidden = true;
      cont.hidden = false;
      renderPregunta(0);
    });

  renderPregunta(0);
}

let io = null;
let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll("[data-animate]");
  revealsListos = true;
  if (!items.length) return;
  document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
    parent.querySelectorAll("[data-animate]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -7% 0px" },
  );
  items.forEach((el) => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.classList.add("in");
        io.unobserve(el);
      } else pending++;
    });
    if (!pending) {
      window.removeEventListener("scroll", queueSweep);
      window.removeEventListener("resize", queueSweep);
    }
  };
  const queueSweep = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sweep);
    }
  };
  window.addEventListener("load", queueSweep);
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep, { passive: true });
}

function initHeroCurtain() {
  const curtainL = document.querySelector(".curtain-panel--l");
  const curtainR = document.querySelector(".curtain-panel--r");
  if (!curtainL || !curtainR) return;
  const hiddenByCss = window.getComputedStyle(curtainL).display === "none";
  if (reduceMotion || typeof gsap === "undefined" || hiddenByCss) {
    curtainL.style.visibility = "hidden";
    curtainR.style.visibility = "hidden";
    return;
  }
  gsap
    .timeline({ delay: 0.2 })
    .to([curtainL, curtainR], {
      scaleX: 0,
      duration: 0.9,
      ease: "power3.inOut",
    })
    .set([curtainL, curtainR], { visibility: "hidden" });
}

function initScrollFx() {
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    reduceMotion
  )
    return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".editorial-img").forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1.12 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  });

  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    gsap.to(marquee, { xPercent: -50, ease: "none", duration: 22, repeat: -1 });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap !== "undefined" && typeof window.Flip !== "undefined") {
    gsap.registerPlugin(window.Flip);
  }
  if (typeof gsap === "undefined") {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }

  renderCategorias();
  renderRail();
  initRailDrag();
  initFiltros();
  renderCatalogo();
  initConsultivo();
  initWspHref();

  initReveals();
  initNav();
  initModal();
  initDrawer();
  initFloats();
  updateCartBadge();
  renderDrawer();
  initHeroCurtain();
  initScrollFx();

  document.getElementById("yearNow") &&
    (document.getElementById("yearNow").textContent = new Date().getFullYear());
});
