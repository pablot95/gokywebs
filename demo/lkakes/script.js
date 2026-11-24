const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;
const intentar = fn => { try { return fn(); } catch { return undefined; } };
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const DOCENTE = {
  "id": "lore",
  "nombre": "Lore Koniusyzk",
  "rol": "Pastelera y creadora de Lkakes",
  "bio": "Hace tortas, tartas y boxes por encargo en Lkakes, y en estas clases comparte esas mismas recetas, con los tiempos y las terminaciones que usa para que lleguen enteras a cada caja.",
  "foto": "images/sello-lkakes.webp",
  "redes": {
    "instagram": "https://www.instagram.com/lkakes.ok/"
  },
  "credencialesVerificadas": false
};
const FORMATOS = {
  "recetario": "Recetario PDF",
  "videos": "Videos + recetario"
};
const CATEGORIAS = {
  "tortas": "Tortas",
  "tartas": "Tartas y tartaletas",
  "postres": "Postres en vaso",
  "navidad": "Navidad",
  "bases": "Masas y cremas"
};
const CURSOS = [
  {
    "id": "box-navidad",
    "titulo": "Box navideño: renos, coronas y gorritos de frutilla",
    "categoria": "navidad",
    "nivel": "Intermedio",
    "formato": "videos",
    "precio": 26900,
    "descuento": 0,
    "duracion": "2 h 35 min",
    "cantidadClases": 9,
    "portada": "images/torta-reno-600.webp",
    "portadaGrande": "images/torta-reno.webp",
    "alt": "Minitorta de chocolate decorada como reno, con astas de chocolate y nariz roja",
    "destacado": 1,
    "badge": "Nuevo",
    "nuevo": true,
    "descripcionCorta": "Brownie, bizcochuelo y tres decoraciones de Navidad para armar un box de minitortas.",
    "descripcionCompleta": "Es el box que sale de Lkakes para las fiestas, explicado de punta a punta: las dos bases, los rellenos que aguantan la caja y las tres decoraciones (renos, coronas y gorritos de frutilla), con el orden de trabajo para tenerlo listo en una tarde.",
    "resultados": [
      "Armar un box de minitortas con tres decoraciones distintas",
      "Hacer cremas firmes que no se caen dentro de la caja",
      "Organizar los tiempos para producir varias cajas"
    ],
    "requisitos": [
      "Conviene haber hecho alguna vez un bizcochuelo",
      "Manga con picos 1M y liso"
    ],
    "incluye": [
      "9 clases en video",
      "Recetario PDF con cantidades para 12 minitortas",
      "Lista de utensilios y moldes",
      "Acceso con tu usuario, desde el celu o la compu"
    ],
    "etiquetas": [
      "reno",
      "corona",
      "frutilla",
      "brownie",
      "box",
      "fiestas",
      "minitortas",
      "chocolate"
    ],
    "faqs": [
      [
        "¿Sirve para vender en las fiestas?",
        "El recetario trae cantidades por caja para que calcules tus costos; los precios los definís vos."
      ],
      [
        "¿Se puede hacer sin moldes especiales?",
        "Sí: las bases se cortan con aro o con un vaso."
      ]
    ],
    "modulos": [
      {
        "titulo": "Las bases del box",
        "clases": [
          {
            "titulo": "Brownie húmedo para minitortas",
            "duracion": "16 min",
            "min": 16,
            "tipo": "video",
            "preview": true
          },
          {
            "titulo": "Bizcochuelo de vainilla en placa",
            "duracion": "14 min",
            "min": 14,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Almíbar y armado en moldes",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Rellenos y cremas",
        "clases": [
          {
            "titulo": "Dulce de leche repostero con crema",
            "duracion": "11 min",
            "min": 11,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Chantilly estabilizada que aguanta la caja",
            "duracion": "15 min",
            "min": 15,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Ganache de chocolate para las bases",
            "duracion": "13 min",
            "min": 13,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Decoración navideña",
        "clases": [
          {
            "titulo": "Renos con astas de chocolate",
            "duracion": "22 min",
            "min": 22,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Coronas de crema verde con moños",
            "duracion": "24 min",
            "min": 24,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Gorritos de frutilla y armado del box",
            "duracion": "28 min",
            "min": 28,
            "tipo": "video",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "tortas-manga",
    "titulo": "Tortas con manga y frutillas, desde cero",
    "categoria": "tortas",
    "nivel": "Inicial",
    "formato": "videos",
    "precio": 22900,
    "descuento": 0,
    "duracion": "2 h 10 min",
    "cantidadClases": 9,
    "portada": "images/tortas-manga-600.webp",
    "portadaGrande": "images/tortas-manga.webp",
    "alt": "Torta de crema decorada con manga, borde de frutillas y macarons",
    "destacado": 2,
    "badge": "Para empezar",
    "descripcionCorta": "Bizcochuelo alto, crema lisa y los picos de manga para decorar tu primera torta.",
    "descripcionCompleta": "Una torta completa desde el bizcochuelo hasta la última frutilla: cómo cortar y rellenar parejo, cubrir con crema lisa, cargar la manga y usar cinco picos distintos para que quede prolija.",
    "resultados": [
      "Hacer un bizcochuelo alto que no se hunde",
      "Cubrir una torta con crema lisa",
      "Decorar con manga sin que se te corte la crema"
    ],
    "requisitos": [
      "Ninguno: arranca desde pesar los ingredientes",
      "Manga descartable y un pico 1M"
    ],
    "incluye": [
      "9 clases en video",
      "Recetario PDF de bizcochuelo, crema y almíbar",
      "Guía de picos de manga",
      "Acceso con tu usuario, desde el celu o la compu"
    ],
    "etiquetas": [
      "manga",
      "frutilla",
      "crema",
      "bizcochuelo",
      "decoracion",
      "macarons"
    ],
    "faqs": [
      [
        "¿Qué molde necesito?",
        "Un molde de 20 o 24 cm; en la clase se ve cómo adaptar las cantidades."
      ],
      [
        "¿Puedo usar crema vegetal?",
        "Sí, en la clase de cremas se ve la diferencia y cuándo conviene cada una."
      ]
    ],
    "modulos": [
      {
        "titulo": "La torta por dentro",
        "clases": [
          {
            "titulo": "Bizcochuelo alto que no se hunde",
            "duracion": "18 min",
            "min": 18,
            "tipo": "video",
            "preview": true
          },
          {
            "titulo": "Cortar, almibarar y rellenar",
            "duracion": "14 min",
            "min": 14,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Crema para cubrir lisa",
            "duracion": "16 min",
            "min": 16,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Manga y picos",
        "clases": [
          {
            "titulo": "Cómo cargar y sostener la manga",
            "duracion": "10 min",
            "min": 10,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Cinco picos y para qué sirve cada uno",
            "duracion": "17 min",
            "min": 17,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Rosetas, conchitas y bordes",
            "duracion": "15 min",
            "min": 15,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Decorado final",
        "clases": [
          {
            "titulo": "Frutillas en el borde, prolijas",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Coronar con frutillas y macarons",
            "duracion": "13 min",
            "min": 13,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Transporte y conservación",
            "duracion": "15 min",
            "min": 15,
            "tipo": "video",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "recetario-esencial",
    "titulo": "Recetario esencial: 24 recetas de base",
    "categoria": "bases",
    "nivel": "Inicial",
    "formato": "recetario",
    "precio": 11900,
    "descuento": 0,
    "duracion": "72 páginas",
    "cantidadClases": 24,
    "portada": "images/recetario-cuaderno-600.webp",
    "portadaGrande": "images/recetario-cuaderno.webp",
    "alt": "Cuaderno de recetas abierto junto a harina, manteca, huevos y un batidor",
    "destacado": 3,
    "badge": "Para imprimir",
    "descripcionCorta": "Las masas, cremas y coberturas que sostienen todas las tortas de Lkakes, en un PDF para imprimir.",
    "descripcionCompleta": "Veinticuatro recetas base con cantidades, tiempos de horno y fotos del paso a paso. Es el recetario para tener al lado de la mesada y combinar: una masa, una crema y una cobertura ya son una torta.",
    "resultados": [
      "Tener a mano las masas y cremas de base",
      "Combinar recetas para armar tus propias tortas",
      "Adaptar cantidades a cada molde"
    ],
    "requisitos": [
      "Ninguno"
    ],
    "incluye": [
      "Recetario PDF de 72 páginas para imprimir",
      "Fotos del paso a paso",
      "Tabla de equivalencias y medidas",
      "Acceso con tu usuario para descargarlo"
    ],
    "etiquetas": [
      "bizcochuelo",
      "pionono",
      "brownie",
      "pastelera",
      "ganache",
      "buttercream",
      "merengue",
      "pdf"
    ],
    "faqs": [
      [
        "¿Trae videos?",
        "No: es un recetario en PDF. Las técnicas en video están en «Masas y cremas base»."
      ],
      [
        "¿Lo puedo imprimir?",
        "Sí, está armado en tamaño A4."
      ]
    ],
    "modulos": [
      {
        "titulo": "Masas",
        "clases": [
          {
            "titulo": "Bizcochuelo de vainilla",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": true
          },
          {
            "titulo": "Bizcochuelo de chocolate",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Pionono",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Masa sablée",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Masa brisée",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Brownie",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Budín",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Muffins",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Cremas y rellenos",
        "clases": [
          {
            "titulo": "Crema pastelera",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Chantilly",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Ganache",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Dulce de leche repostero",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Crema de queso",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Lemon curd",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Mousse base",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Merengue italiano",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Coberturas y terminaciones",
        "clases": [
          {
            "titulo": "Glasé",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Buttercream",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Baño de chocolate",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Almíbares",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Frutas glaseadas",
            "duracion": "2 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Crocante de almendras",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Decoraciones de chocolate",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Equivalencias y medidas",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "tarta-lima",
    "titulo": "Tarta de lima con crema",
    "categoria": "tartas",
    "nivel": "Inicial",
    "formato": "videos",
    "precio": 18900,
    "descuento": 0,
    "duracion": "1 h 40 min",
    "cantidadClases": 9,
    "portada": "images/tarta-lima-600.webp",
    "portadaGrande": "images/tarta-lima.webp",
    "alt": "Tarta de lima con rosetas de crema y rodajas de lima dentro de su caja",
    "destacado": 4,
    "badge": "Receta de la casa",
    "descripcionCorta": "Base crocante, relleno de lima en su punto y rosetas de crema para terminarla.",
    "descripcionCompleta": "La tarta de lima de Lkakes, con dos bases posibles (galletitas o masa sablée), el relleno que corta limpio y la decoración con chantilly y ralladura que la hace reconocible.",
    "resultados": [
      "Hacer una base crocante que no se humedece",
      "Lograr un relleno de lima firme y cremoso",
      "Decorar con rosetas parejas"
    ],
    "requisitos": [
      "Ninguno",
      "Molde desmontable de 22 a 24 cm"
    ],
    "incluye": [
      "9 clases en video",
      "Recetario PDF con las dos bases",
      "Acceso con tu usuario, desde el celu o la compu"
    ],
    "etiquetas": [
      "lima",
      "limon",
      "crema",
      "tarta",
      "chantilly",
      "galletitas"
    ],
    "faqs": [
      [
        "¿Se puede hacer con limón?",
        "Sí, en la clase del relleno se ve cómo ajustar el azúcar."
      ],
      [
        "¿Cuánto dura en la heladera?",
        "En el recetario están los tiempos de conservación de cada parte."
      ]
    ],
    "modulos": [
      {
        "titulo": "La base",
        "clases": [
          {
            "titulo": "Base de galletitas y manteca",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": true
          },
          {
            "titulo": "Masa sablée como alternativa",
            "duracion": "16 min",
            "min": 16,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Horneado en blanco",
            "duracion": "9 min",
            "min": 9,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "El relleno",
        "clases": [
          {
            "titulo": "Crema de lima con leche condensada",
            "duracion": "13 min",
            "min": 13,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Punto justo del horneado",
            "duracion": "8 min",
            "min": 8,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Enfriado sin grietas",
            "duracion": "7 min",
            "min": 7,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Decoración",
        "clases": [
          {
            "titulo": "Chantilly con ralladura",
            "duracion": "11 min",
            "min": 11,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Rosetas con manga",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Rodajas y terminación",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "recetario-navidad",
    "titulo": "Recetario de Navidad: 12 postres para las fiestas",
    "categoria": "navidad",
    "nivel": "Inicial",
    "formato": "recetario",
    "precio": 12000,
    "descuento": 15,
    "duracion": "48 páginas",
    "cantidadClases": 12,
    "portada": "images/corona-navidad-600.webp",
    "portadaGrande": "images/corona-navidad.webp",
    "alt": "Corona navideña de bizcochuelo con crema verde, romero y frutos rojos",
    "destacado": 0,
    "badge": "",
    "descripcionCorta": "Coronas, postres fríos y dulces para regalar: doce recetas para la mesa de fin de año.",
    "descripcionCompleta": "Doce recetas pensadas para diciembre: tortas y coronas para el centro de la mesa, postres fríos que se hacen el día anterior y dulces chicos para regalar en cajitas.",
    "resultados": [
      "Resolver el postre de las fiestas con anticipación",
      "Armar cajitas de dulces para regalar",
      "Decorar con motivos navideños simples"
    ],
    "requisitos": [
      "Ninguno"
    ],
    "incluye": [
      "Recetario PDF de 48 páginas",
      "Fotos del paso a paso",
      "Cronograma de qué hacer cada día",
      "Acceso con tu usuario para descargarlo"
    ],
    "etiquetas": [
      "corona",
      "navidad",
      "fiestas",
      "jengibre",
      "trufas",
      "alfajores",
      "pdf"
    ],
    "faqs": [
      [
        "¿Las recetas llevan horno?",
        "La mayoría sí; los postres fríos se arman sin horno."
      ],
      [
        "¿Sirve para principiantes?",
        "Sí, todas las recetas son de nivel inicial."
      ]
    ],
    "modulos": [
      {
        "titulo": "Coronas y tortas",
        "clases": [
          {
            "titulo": "Corona de bizcochuelo y crema verde",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": true
          },
          {
            "titulo": "Torta helada de frutillas",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Budín de frutos secos",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Arrollado de chocolate y dulce de leche",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Postres fríos",
        "clases": [
          {
            "titulo": "Vasitos de frutillas y crema",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Mousse de chocolate blanco",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Copa de frutos rojos",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Tiramisú en frasco",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Para regalar",
        "clases": [
          {
            "titulo": "Galletitas de jengibre decoradas",
            "duracion": "5 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Trufas de chocolate",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Alfajorcitos de maicena",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Cajitas y presentación",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "torta-chocolate",
    "titulo": "Torta de chocolate, dulce de leche y merengue",
    "categoria": "tortas",
    "nivel": "Intermedio",
    "formato": "videos",
    "precio": 24900,
    "descuento": 0,
    "duracion": "2 h 20 min",
    "cantidadClases": 9,
    "portada": "images/torta-chocolate-600.webp",
    "portadaGrande": "images/torta-chocolate.webp",
    "alt": "Torta de chocolate con dulce de leche y merengue tostado dentro de su caja",
    "destacado": 0,
    "badge": "",
    "descripcionCorta": "Bizcocho húmedo de chocolate, dulce de leche y merengue italiano tostado con soplete.",
    "descripcionCompleta": "Una de las tortas que más prepara Lore: bizcocho húmedo de chocolate, mucho dulce de leche y una corona de merengue italiano con picos altos, tostado parejo y con hilos de chocolate.",
    "resultados": [
      "Hacer un bizcocho de chocolate húmedo",
      "Preparar merengue italiano estable",
      "Tostar con soplete sin quemar"
    ],
    "requisitos": [
      "Haber hecho un bizcochuelo antes",
      "Soplete de cocina (opcional)"
    ],
    "incluye": [
      "9 clases en video",
      "Recetario PDF con tiempos y temperaturas",
      "Acceso con tu usuario, desde el celu o la compu"
    ],
    "etiquetas": [
      "chocolate",
      "dulce de leche",
      "merengue",
      "soplete",
      "torta"
    ],
    "faqs": [
      [
        "¿Y si no tengo soplete?",
        "Se puede gratinar unos segundos en el horno; está en la clase de tostado."
      ],
      [
        "¿Necesito termómetro?",
        "Ayuda para el merengue, pero en la clase se ven las señales para hacerlo sin."
      ]
    ],
    "modulos": [
      {
        "titulo": "Bizcocho de chocolate",
        "clases": [
          {
            "titulo": "Bizcocho húmedo de chocolate",
            "duracion": "17 min",
            "min": 17,
            "tipo": "video",
            "preview": true
          },
          {
            "titulo": "Nivelar y almibarar",
            "duracion": "11 min",
            "min": 11,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Armado con dulce de leche",
            "duracion": "14 min",
            "min": 14,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Merengue",
        "clases": [
          {
            "titulo": "Merengue italiano paso a paso",
            "duracion": "21 min",
            "min": 21,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Picos altos con manga",
            "duracion": "16 min",
            "min": 16,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Soplete y tostado parejo",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Terminaciones",
        "clases": [
          {
            "titulo": "Bolitas de dulce de leche en el borde",
            "duracion": "15 min",
            "min": 15,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Hilos de chocolate",
            "duracion": "13 min",
            "min": 13,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Armado en caja para entregar",
            "duracion": "21 min",
            "min": 21,
            "tipo": "video",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "tartaletas",
    "titulo": "Tartaletas de masa sablée con crema",
    "categoria": "tartas",
    "nivel": "Intermedio",
    "formato": "videos",
    "precio": 21900,
    "descuento": 0,
    "duracion": "1 h 55 min",
    "cantidadClases": 9,
    "portada": "images/tartaleta-manga-600.webp",
    "portadaGrande": "images/tartaleta-manga.webp",
    "alt": "Manga rellenando con crema una tartaleta de masa sablée",
    "destacado": 0,
    "badge": "",
    "descripcionCorta": "Masa sablée que no se deforma, tres cremas y el montaje con manga y merengue.",
    "descripcionCompleta": "Tartaletas individuales de masa sablée: cómo forrar moldes chicos, hornearlas sin que se encojan y rellenarlas con pastelera, diplomática o lemon curd.",
    "resultados": [
      "Forrar moldes chicos sin que la masa se encoja",
      "Preparar tres cremas para rellenar",
      "Montar tartaletas con terminación de pastelería"
    ],
    "requisitos": [
      "Conviene saber usar la manga",
      "Moldes de tartaleta de 8 a 10 cm"
    ],
    "incluye": [
      "9 clases en video",
      "Recetario PDF de masa y cremas",
      "Acceso con tu usuario, desde el celu o la compu"
    ],
    "etiquetas": [
      "tartaleta",
      "sablee",
      "pastelera",
      "lemon curd",
      "merengue",
      "manga"
    ],
    "faqs": [
      [
        "¿Se pueden congelar?",
        "Las bases horneadas sí; en el recetario está cómo."
      ],
      [
        "¿Sirven para mesa dulce?",
        "Sí, el tamaño individual está pensado para eso."
      ]
    ],
    "modulos": [
      {
        "titulo": "Masa sablée",
        "clases": [
          {
            "titulo": "Sablée de vainilla",
            "duracion": "15 min",
            "min": 15,
            "tipo": "video",
            "preview": true
          },
          {
            "titulo": "Estirar y forrar moldes chicos",
            "duracion": "14 min",
            "min": 14,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Hornear sin que se deformen",
            "duracion": "10 min",
            "min": 10,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Cremas",
        "clases": [
          {
            "titulo": "Crema pastelera",
            "duracion": "16 min",
            "min": 16,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Crema diplomática",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Lemon curd",
            "duracion": "13 min",
            "min": 13,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Montaje",
        "clases": [
          {
            "titulo": "Rellenar con manga",
            "duracion": "11 min",
            "min": 11,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Merengue y soplete",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Frutas y brillo",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "postres-vaso",
    "titulo": "Postres en vaso: frutillas, crema y bizcochuelo",
    "categoria": "postres",
    "nivel": "Inicial",
    "formato": "recetario",
    "precio": 9900,
    "descuento": 0,
    "duracion": "36 páginas",
    "cantidadClases": 9,
    "portada": "images/postre-vaso-frutillas-600.webp",
    "portadaGrande": "images/postre-vaso-frutillas.webp",
    "alt": "Postre en vaso con capas de bizcochuelo, crema y frutillas",
    "destacado": 0,
    "badge": "",
    "descripcionCorta": "Bases, cremas y tres armados de postres en vaso que se preparan sin horno el día anterior.",
    "descripcionCompleta": "Un recetario corto para resolver postres individuales: tres bases, tres cremas y tres armados completos, con el orden de las capas y cuánto rinde cada preparación.",
    "resultados": [
      "Armar postres individuales prolijos",
      "Calcular cuántos vasos rinde cada receta",
      "Preparar todo con un día de anticipación"
    ],
    "requisitos": [
      "Ninguno"
    ],
    "incluye": [
      "Recetario PDF de 36 páginas",
      "Fotos del armado capa por capa",
      "Acceso con tu usuario para descargarlo"
    ],
    "etiquetas": [
      "vaso",
      "frutilla",
      "crema",
      "sin horno",
      "postre",
      "pdf"
    ],
    "faqs": [
      [
        "¿Qué vasos uso?",
        "Cualquier vaso de 200 a 250 ml; el recetario trae rendimientos para los dos."
      ],
      [
        "¿Llevan horno?",
        "Solo el bizcochuelo de base, que también se puede comprar hecho."
      ]
    ],
    "modulos": [
      {
        "titulo": "Bases",
        "clases": [
          {
            "titulo": "Bizcochuelo en placa para vasos",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": true
          },
          {
            "titulo": "Crumble de manteca",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Almíbar de frutillas",
            "duracion": "3 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Cremas",
        "clases": [
          {
            "titulo": "Chantilly estabilizada",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Crema de queso",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Mousse de frutilla",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Armados",
        "clases": [
          {
            "titulo": "Vasito de frutillas y crema",
            "duracion": "5 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Vasito de chocolate y dulce de leche",
            "duracion": "5 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          },
          {
            "titulo": "Vasito de limón y merengue",
            "duracion": "4 págs.",
            "min": 0,
            "tipo": "pdf",
            "preview": false
          }
        ]
      }
    ]
  },
  {
    "id": "bases",
    "titulo": "Masas y cremas base de la pastelería",
    "categoria": "bases",
    "nivel": "Inicial",
    "formato": "videos",
    "precio": 19900,
    "descuento": 0,
    "duracion": "2 h 05 min",
    "cantidadClases": 9,
    "portada": "images/batido-base-600.webp",
    "portadaGrande": "images/batido-base.webp",
    "alt": "Manos batiendo una masa amarilla con batidor de alambre",
    "destacado": 0,
    "badge": "",
    "descripcionCorta": "Bizcochuelos, masas secas y las tres cremas que se usan en casi todas las tortas.",
    "descripcionCompleta": "Las nueve recetas que conviene dominar antes de decorar: tres masas batidas, tres masas secas y tres cremas, explicadas con los errores más comunes y cómo darse cuenta del punto.",
    "resultados": [
      "Hacer bizcochuelos que leven parejo",
      "Trabajar masas secas sin que se rompan",
      "Preparar pastelera, chantilly y dulce de leche repostero"
    ],
    "requisitos": [
      "Ninguno: es el curso para empezar"
    ],
    "incluye": [
      "9 clases en video",
      "Recetario PDF con las nueve recetas",
      "Acceso con tu usuario, desde el celu o la compu"
    ],
    "etiquetas": [
      "bizcochuelo",
      "pionono",
      "sablee",
      "pastelera",
      "chantilly",
      "dulce de leche",
      "principiantes"
    ],
    "faqs": [
      [
        "¿Es para alguien que nunca hizo pastelería?",
        "Sí, arranca desde pesar los ingredientes y prender el horno."
      ],
      [
        "¿Qué batidora necesito?",
        "Una de mano alcanza; se aclara cuándo conviene una planetaria."
      ]
    ],
    "modulos": [
      {
        "titulo": "Masas batidas",
        "clases": [
          {
            "titulo": "Bizcochuelo de vainilla",
            "duracion": "16 min",
            "min": 16,
            "tipo": "video",
            "preview": true
          },
          {
            "titulo": "Bizcochuelo de chocolate",
            "duracion": "14 min",
            "min": 14,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Pionono",
            "duracion": "13 min",
            "min": 13,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Masas secas",
        "clases": [
          {
            "titulo": "Masa sablée",
            "duracion": "15 min",
            "min": 15,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Masa de tarta rápida",
            "duracion": "11 min",
            "min": 11,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Masa de galletitas",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          }
        ]
      },
      {
        "titulo": "Cremas",
        "clases": [
          {
            "titulo": "Crema pastelera",
            "duracion": "15 min",
            "min": 15,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Chantilly que se sostiene",
            "duracion": "12 min",
            "min": 12,
            "tipo": "video",
            "preview": false
          },
          {
            "titulo": "Dulce de leche repostero",
            "duracion": "17 min",
            "min": 17,
            "tipo": "video",
            "preview": false
          }
        ]
      }
    ]
  }
];

const getCurso = id => CURSOS.find(c => c.id === id);
const unidad = c => (c.formato === 'recetario' ? 'recetas' : 'clases');

const ICONOS = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.6v12.8a.8.8 0 0 0 1.2.7l10.1-6.4a.8.8 0 0 0 0-1.4L9.7 4.9a.8.8 0 0 0-1.2.7z" fill="currentColor"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="m16 10.5 5-3v9l-5-3"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
};

const Cart = {
  KEY: 'lkakes_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && getCurso(i.id)) : [];
    } catch { return []; }
  },
  save(items) {
    intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items)));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso) {
    if (!curso || this.has(curso.id)) return false;
    const items = this.get();
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); },
  ahorro() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + (c.precio - precioFinal(c)) : s; }, 0); },
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function precioHTML(c, clase = 'precio') {
  const final = precioFinal(c);
  const antes = c.descuento > 0 ? `<s class="${clase}-antes">${formatearPrecio(c.precio)}</s>` : '';
  const off = c.descuento > 0 ? `<span class="${clase}-off">-${c.descuento}%</span>` : '';
  return `<span class="${clase}"><span class="${clase}-final">${formatearPrecio(final)}</span>${antes}${off}</span>`;
}

function botonAgregar(c, extra = '') {
  const dentro = Cart.has(c.id);
  return `<button type="button" class="btn-add${dentro ? ' is-added' : ''}${extra}" data-add="${c.id}" aria-label="${dentro ? 'Ya está en tu compra' : 'Agregar a mi compra'}: ${esc(c.titulo)}">${dentro ? `${ICONOS.check}<span>En tu compra</span>` : '<span>Agregar</span>'}</button>`;
}

function cardHTML(c, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : '';
  return `<article class="card-curso"${anim}>
    <button type="button" class="card-media" data-curso="${c.id}" aria-label="Ver ${esc(c.titulo)}">
      <img src="${c.portada}" alt="${esc(c.alt)}" width="600" height="600">
      <span class="badge-formato badge-formato--${c.formato}">${c.formato === 'recetario' ? ICONOS.pdf : ICONOS.video}${FORMATOS[c.formato]}</span>
    </button>
    <div class="card-cuerpo">
      <p class="card-meta">${esc(CATEGORIAS[c.categoria])} · ${esc(c.nivel)}</p>
      <h3 class="card-titulo"><button type="button" data-curso="${c.id}">${esc(c.titulo)}</button></h3>
      <p class="card-datos">Con ${esc(DOCENTE.nombre)} · ${esc(c.duracion)} · ${c.cantidadClases} ${unidad(c)}</p>
      <div class="card-pie">${precioHTML(c)}${botonAgregar(c)}</div>
    </div>
  </article>`;
}

function destacadoHTML(c, i, variante) {
  if (variante === 'lista') {
    return `<li class="dest-fila" data-animate="der" style="opacity:0;transform:translateX(40px)">
      <span class="dest-num">0${i + 1}</span>
      <div class="dest-thumb"><img src="${c.portada}" alt="${esc(c.alt)}" width="600" height="600"></div>
      <div class="dest-info">
        <p class="dest-badge">${esc(c.badge)} · ${FORMATOS[c.formato]}</p>
        <h3><button type="button" data-curso="${c.id}">${esc(c.titulo)}</button></h3>
        <p class="dest-datos">${esc(c.nivel)} · ${esc(c.duracion)} · ${c.cantidadClases} ${unidad(c)}</p>
      </div>
      ${precioHTML(c, 'dest-precio')}
      <div class="dest-acciones"><button type="button" class="btn btn-ghost btn-chico" data-curso="${c.id}">Ver el programa</button>${botonAgregar(c, ' btn-add--fuerte')}</div>
    </li>`;
  }
  return `<article class="dest-card" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <button type="button" class="dest-media" data-curso="${c.id}" aria-label="Ver ${esc(c.titulo)}"><img src="${c.portadaGrande}" alt="${esc(c.alt)}" width="1024" height="1024"><span class="dest-badge">${esc(c.badge)}</span></button>
    <div class="dest-cuerpo">
      <p class="dest-formato">${c.formato === 'recetario' ? ICONOS.pdf : ICONOS.video}${FORMATOS[c.formato]}</p>
      <h3><button type="button" data-curso="${c.id}">${esc(c.titulo)}</button></h3>
      <p class="dest-desc">${esc(c.descripcionCorta)}</p>
      <dl class="ficha"><div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div><div><dt>${c.formato === 'recetario' ? 'Extensión' : 'Duración'}</dt><dd>${esc(c.duracion)}</dd></div><div><dt>${c.formato === 'recetario' ? 'Recetas' : 'Clases'}</dt><dd>${c.cantidadClases}</dd></div></dl>
      <div class="dest-pie">${precioHTML(c)}<div class="dest-acciones"><button type="button" class="btn btn-primary btn-chico" data-curso="${c.id}">Ver el programa</button>${botonAgregar(c)}</div></div>
    </div>
  </article>`;
}

function initDestacados() {
  const cont = document.getElementById('destGrid');
  if (!cont) return;
  const variante = cont.dataset.variante;
  const lista = CURSOS.filter(c => c.destacado > 0).sort((a, b) => a.destacado - b.destacado).slice(0, 4);
  cont.innerHTML = lista.map((c, i) => destacadoHTML(c, i, variante)).join('');
}

const estado = { q: '', formato: 'todos', categoria: 'todas', nivel: 'todos', visibles: 12 };
const POR_PAGINA = 12;

function coincide(c) {
  if (estado.formato !== 'todos' && c.formato !== estado.formato) return false;
  if (estado.categoria !== 'todas' && c.categoria !== estado.categoria) return false;
  if (estado.nivel !== 'todos' && c.nivel !== estado.nivel) return false;
  const q = norm(estado.q).trim();
  if (!q) return true;
  const texto = norm([c.titulo, CATEGORIAS[c.categoria], c.nivel, FORMATOS[c.formato], DOCENTE.nombre, c.descripcionCorta, ...(c.etiquetas || []), ...c.modulos.flatMap(m => m.clases.map(k => k.titulo))].join(' '));
  return q.split(/\s+/).every(t => texto.includes(t));
}

const hayFiltros = () => estado.q.trim() !== '' || estado.formato !== 'todos' || estado.categoria !== 'todas' || estado.nivel !== 'todos';

function renderCatalogo(previos = 0) {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const lista = CURSOS.filter(coincide);
  grid.innerHTML = lista.slice(0, estado.visibles).map((c, k) => cardHTML(c, k >= previos)).join('');
  const cuenta = document.getElementById('catCuenta');
  if (cuenta) cuenta.textContent = lista.length === 1 ? '1 recetario o clase' : `${lista.length} recetarios y clases`;
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const mas = document.getElementById('catVerMas');
  if (mas) mas.hidden = lista.length <= estado.visibles;
  const limpiar = document.getElementById('catLimpiar');
  if (limpiar) limpiar.hidden = !hayFiltros();
  document.querySelectorAll('.chip[data-filtro]').forEach(ch => ch.setAttribute('aria-pressed', String(estado[ch.dataset.filtro] === ch.dataset.valor)));
  revelarNuevos(grid);
}

function limpiarFiltros() {
  Object.assign(estado, { q: '', formato: 'todos', categoria: 'todas', nivel: 'todos', visibles: POR_PAGINA });
  const buscar = document.getElementById('catBuscar');
  if (buscar) buscar.value = '';
  renderCatalogo();
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  renderCatalogo();
  document.querySelectorAll('.chip[data-filtro]').forEach(ch => ch.addEventListener('click', () => {
    estado[ch.dataset.filtro] = ch.dataset.valor;
    estado.visibles = POR_PAGINA;
    renderCatalogo();
  }));
  const buscar = document.getElementById('catBuscar');
  let t = 0;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = buscar.value; estado.visibles = POR_PAGINA; renderCatalogo(); }, 140);
  });
  document.getElementById('catLimpiar')?.addEventListener('click', limpiarFiltros);
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarFiltros));
  document.getElementById('catVerMas')?.addEventListener('click', () => {
    const previos = estado.visibles;
    estado.visibles += POR_PAGINA;
    renderCatalogo(previos);
  });
  document.querySelectorAll('[data-ir-categoria]').forEach(a => a.addEventListener('click', () => {
    estado.categoria = a.dataset.irCategoria;
    estado.formato = 'todos';
    estado.nivel = 'todos';
    estado.q = '';
    if (buscar) buscar.value = '';
    estado.visibles = POR_PAGINA;
    renderCatalogo();
  }));
}

function initFiltrosMovil() {
  const panel = document.getElementById('catFiltros');
  const abrir = document.querySelector('[data-abrir-filtros]');
  const fondo = document.querySelector('.filtros-fondo');
  if (!panel || !abrir || !document.body.classList.contains('m2')) return;
  const mq = window.matchMedia('(max-width: 899px)');
  const marcar = () => { if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(e => e.classList.add('in')); };
  marcar();
  mq.addEventListener('change', marcar);
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    fondo?.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    abrir.focus();
  };
  abrir.addEventListener('click', () => {
    panel.classList.add('open');
    fondo?.classList.add('open');
    abrir.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('input, button')?.focus();
  });
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(); });
}

function trapFocus(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !cont.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function minutos(mod) {
  const m = mod.clases.reduce((s, k) => s + (k.min || 0), 0);
  if (!m) return `${mod.clases.length} recetas`;
  const hs = Math.floor(m / 60);
  const resto = m % 60;
  return `${mod.clases.length} clases · ${hs ? `${hs} h ` : ''}${resto ? `${resto} min` : ''}`.trim();
}

function modalHTML(c) {
  const modulos = c.modulos.map((mod, i) => `<details class="md-modulo"${i === 0 ? ' open' : ''}>
      <summary><span class="md-mod-num">${c.formato === 'recetario' ? 'Capítulo' : 'Módulo'} ${i + 1}</span><span class="md-mod-titulo">${esc(mod.titulo)}</span><span class="md-mod-datos">${minutos(mod)}</span><span class="md-mod-ico">${ICONOS.chev}</span></summary>
      <ol>${mod.clases.map(k => `<li class="md-clase"><span class="md-clase-ico">${k.tipo === 'pdf' ? ICONOS.pdf : ICONOS.video}</span><span class="md-clase-titulo">${esc(k.titulo)}${k.preview ? '<span class="md-preview">Vista previa</span>' : ''}</span><span class="md-clase-dur">${esc(k.duracion)}</span></li>`).join('')}</ol>
    </details>`).join('');
  const ficha = [
    ['Formato', FORMATOS[c.formato]],
    [c.formato === 'recetario' ? 'Extensión' : 'Duración', c.duracion],
    [c.formato === 'recetario' ? 'Recetas' : 'Clases', `${c.cantidadClases} en ${c.modulos.length} ${c.formato === 'recetario' ? 'capítulos' : 'módulos'}`],
    ['Nivel', c.nivel],
    ['Acceso', 'Con tu usuario, desde el celu o la compu'],
  ].map(([t, d]) => `<div><dt>${t}</dt><dd>${esc(d)}</dd></div>`).join('');
  const dentro = Cart.has(c.id);
  return `<div class="md-top">
    <div class="md-media"><img src="${c.portadaGrande}" alt="${esc(c.alt)}" width="1024" height="1024"><span class="badge-formato badge-formato--${c.formato}">${c.formato === 'recetario' ? ICONOS.pdf : ICONOS.video}${FORMATOS[c.formato]}</span></div>
    <div class="md-info">
      <p class="md-meta">${esc(CATEGORIAS[c.categoria])} · ${esc(c.nivel)}</p>
      <h2 class="md-titulo">${esc(c.titulo)}</h2>
      <p class="md-promesa">${esc(c.descripcionCorta)}</p>
      <div class="md-precio">${precioHTML(c, 'precio')}${c.descuento > 0 ? `<span class="md-ahorro">Ahorrás ${formatearPrecio(c.precio - precioFinal(c))}</span>` : ''}</div>
      <div class="md-ctas"><button type="button" class="btn btn-primary" data-buy="${c.id}">Comprar ahora</button><button type="button" class="btn btn-ghost${dentro ? ' is-added' : ''}" data-add="${c.id}">${dentro ? `${ICONOS.check}<span>En tu compra</span>` : '<span>Agregar a mi compra</span>'}</button></div>
      <dl class="md-ficha">${ficha}</dl>
    </div>
  </div>
  <div class="md-cuerpo">
    <div class="md-principal">
      <h3>De qué se trata</h3>
      <p>${esc(c.descripcionCompleta)}</p>
      <h3>Vas a poder</h3>
      <ul class="md-lista">${c.resultados.map(r => `<li>${ICONOS.check}${esc(r)}</li>`).join('')}</ul>
      <h3>${c.formato === 'recetario' ? 'Índice del recetario' : 'Programa'}</h3>
      <div class="md-programa">${modulos}</div>
    </div>
    <div class="md-lado">
      <h3>Qué incluye</h3>
      <ul class="md-lista md-lista--simple">${c.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      <h3>Antes de empezar</h3>
      <ul class="md-lista md-lista--simple">${c.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      <div class="md-docente"><img src="${DOCENTE.foto}" alt="" width="480" height="480"><div><p class="md-docente-nombre">${esc(DOCENTE.nombre)}</p><p class="md-docente-rol">${esc(DOCENTE.rol)}</p><p>${esc(DOCENTE.bio)}</p></div></div>
      <h3>Preguntas</h3>
      ${c.faqs.map(([q, a]) => `<details class="md-faq"><summary>${esc(q)}<span class="md-mod-ico">${ICONOS.chev}</span></summary><p>${esc(a)}</p></details>`).join('')}
    </div>
  </div>`;
}

const Modal = {
  el: null, cuerpo: null, panel: null, volver: null, timer: 0,
  init() {
    this.el = document.getElementById('cursoModal');
    if (!this.el) return;
    this.cuerpo = document.getElementById('modalCuerpo');
    this.panel = this.el.querySelector('.modal-panel');
    this.el.querySelectorAll('[data-cerrar-modal]').forEach(b => b.addEventListener('click', () => this.cerrar()));
    this.el.addEventListener('keydown', e => trapFocus(this.panel, e));
  },
  abierto() { return this.el && !this.el.hidden && this.el.classList.contains('open'); },
  abrir(id, origen) {
    const c = getCurso(id);
    if (!c || !this.el) return;
    clearTimeout(this.timer);
    this.volver = origen || document.activeElement;
    this.cuerpo.innerHTML = modalHTML(c);
    this.panel.scrollTop = 0;
    this.el.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => this.el.classList.add('open')));
    this.panel.focus({ preventScroll: true });
    intentar(() => { const u = new URL(location.href); u.searchParams.set('curso', id); window.history.replaceState(null, '', u); });
  },
  cerrar(devolver = true) {
    if (!this.el || this.el.hidden) return;
    this.el.classList.remove('open');
    document.body.classList.remove('no-scroll');
    this.timer = setTimeout(() => { this.el.hidden = true; }, reduceMotion ? 0 : 320);
    intentar(() => { const u = new URL(location.href); u.searchParams.delete('curso'); window.history.replaceState(null, '', u); });
    if (devolver && this.volver && document.contains(this.volver)) this.volver.focus({ preventScroll: true });
  },
};

const Drawer = {
  el: null, panel: null, volver: null, timer: 0,
  init() {
    this.el = document.getElementById('cartDrawer');
    if (!this.el) return;
    this.panel = this.el.querySelector('.drawer-panel');
    this.el.querySelectorAll('[data-cerrar-cart]').forEach(b => b.addEventListener('click', () => this.cerrar()));
    this.el.addEventListener('keydown', e => trapFocus(this.panel, e));
    this.render();
    document.addEventListener('cart:updated', () => this.render());
  },
  abierto() { return this.el && !this.el.hidden; },
  render() {
    const items = document.getElementById('cartItems');
    const pie = document.getElementById('cartPie');
    if (!items || !pie) return;
    const lista = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
    if (!lista.length) {
      items.innerHTML = `<div class="drawer-vacio"><p class="drawer-vacio-titulo">Tu compra está vacía.</p><p>Elegí un recetario o una clase y aparece acá.</p><a class="btn btn-ghost" href="#recetas" data-cerrar-cart-link>Ver recetarios y clases</a></div>`;
      pie.innerHTML = '';
      items.querySelector('[data-cerrar-cart-link]')?.addEventListener('click', () => this.cerrar(false));
      return;
    }
    items.innerHTML = `<ul class="drawer-lista">${lista.map(c => `<li class="drawer-item">
        <img src="${c.portada}" alt="" width="600" height="600">
        <div class="drawer-item-info"><p class="drawer-item-titulo">${esc(c.titulo)}</p><p class="drawer-item-meta">${FORMATOS[c.formato]} · ${esc(c.duracion)}</p>${precioHTML(c)}</div>
        <button type="button" class="drawer-quitar" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)}">${ICONOS.trash}</button>
      </li>`).join('')}</ul>`;
    const ahorro = Cart.ahorro();
    pie.innerHTML = `${ahorro > 0 ? `<p class="drawer-fila drawer-ahorro"><span>Ahorrás</span><span>${formatearPrecio(ahorro)}</span></p>` : ''}
      <p class="drawer-fila drawer-total"><span>Total</span><span>${formatearPrecio(Cart.total())}</span></p>
      <button type="button" class="btn btn-primary btn-bloque" id="btnFinalizar">Finalizar compra</button>
      <p class="drawer-nota">Al pagar se activa tu usuario para ver las clases y descargar los recetarios.</p>`;
    items.querySelectorAll('[data-quitar]').forEach(b => b.addEventListener('click', () => {
      const c = getCurso(b.dataset.quitar);
      Cart.remove(b.dataset.quitar);
      showToast(`Sacaste «${c?.titulo ?? 'la receta'}» de tu compra.`);
      this.panel.focus({ preventScroll: true });
    }));
    pie.querySelector('#btnFinalizar')?.addEventListener('click', e => {
      const b = e.currentTarget;
      b.disabled = true;
      b.textContent = 'Procesando…';
      setTimeout(() => {
        b.disabled = false;
        b.textContent = 'Finalizar compra';
        showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
      }, 800);
    });
  },
  abrir(origen) {
    if (!this.el) return;
    clearTimeout(this.timer);
    this.volver = origen || document.activeElement;
    this.el.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => this.el.classList.add('open')));
    this.panel.focus({ preventScroll: true });
  },
  cerrar(devolver = true) {
    if (!this.el || this.el.hidden) return;
    this.el.classList.remove('open');
    if (!Modal.abierto()) document.body.classList.remove('no-scroll');
    this.timer = setTimeout(() => { this.el.hidden = true; }, reduceMotion ? 0 : 380);
    if (devolver && this.volver && document.contains(this.volver)) this.volver.focus({ preventScroll: true });
  },
};

function actualizarBotones() {
  document.querySelectorAll('[data-add]').forEach(b => {
    const c = getCurso(b.dataset.add);
    if (!c) return;
    const dentro = Cart.has(c.id);
    b.classList.toggle('is-added', dentro);
    const largo = b.closest('.md-ctas');
    b.innerHTML = dentro ? `${ICONOS.check}<span>En tu compra</span>` : `<span>${largo ? 'Agregar a mi compra' : 'Agregar'}</span>`;
    if (!largo) b.setAttribute('aria-label', `${dentro ? 'Ya está en tu compra' : 'Agregar a mi compra'}: ${c.titulo}`);
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-curso]');
    if (ver) { e.preventDefault(); Modal.abrir(ver.dataset.curso, ver); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const c = getCurso(add.dataset.add);
      if (!c) return;
      if (Cart.has(c.id)) { Drawer.abrir(add); return; }
      Cart.add(c);
      showToast(`Sumaste «${c.titulo}» a tu compra.`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const c = getCurso(buy.dataset.buy);
      if (!c) return;
      Cart.add(c);
      const origen = Modal.volver;
      if (Modal.el && !Modal.el.hidden) Modal.cerrar(false);
      Drawer.abrir(origen && document.contains(origen) ? origen : buy);
      return;
    }
    if (e.target.closest('[data-open-cart]')) Drawer.abrir(e.target.closest('[data-open-cart]'));
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (Drawer.abierto()) Drawer.cerrar();
    else if (Modal.el && !Modal.el.hidden) Modal.cerrar();
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); actualizarBotones(); });
  updateCartBadge();
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', () => Drawer.abrir(cart));
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initRecorridos() {
  if (!document.body.classList.contains('m2') || !window.matchMedia('(min-width: 900px)').matches) return;
  document.querySelectorAll('.recorrido').forEach(d => { d.open = true; });
}

function initDeepLink() {
  const id = intentar(() => new URLSearchParams(location.search).get('curso'));
  if (id && getCurso(id)) Modal.abrir(id, null);
}

initModelBarScroll();
initDestacados();
initCatalogo();
initFiltrosMovil();
initRecorridos();
Modal.init();
Drawer.init();
initAcciones();
initFloats();
initReveals();
initNav();
initDeepLink();
