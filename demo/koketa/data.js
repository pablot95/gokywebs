/* Catálogo demo KOKETA — datos compartidos por index / catalogo / producto */
const CATEGORIAS = [
  { id:"vestidos",   nombre:"Vestidos",           img:"cat-vestidos.jpg",   desc:"Para el día y para la noche" },
  { id:"remeras",    nombre:"Remeras y Tops",     img:"cat-remeras.jpg",    desc:"Básicos y no tan básicos" },
  { id:"jeans",      nombre:"Pantalones y Jeans", img:"cat-jeans.jpg",      desc:"Tiro alto, rectos y flare" },
  { id:"conjuntos",  nombre:"Conjuntos",          img:"cat-conjuntos.jpg", desc:"Combinados y listos para salir" },
  { id:"zapatillas", nombre:"Zapatillas",         img:"cat-zapatillas.jpg", desc:"Para ellas y para él" }
];

const PRODUCTOS = [
  { id:1,  nombre:"Vestido Floral Midi",        cat:"vestidos",  precio:26900, descuento:0,  destacado:true,
    img:"p-vestido-floral.jpg", desc:"Estampa floral en tela liviana que cae bien sin transparentar. Para el día completo, de un mate con amigas a salir de noche con unas sandalias." },
  { id:2,  nombre:"Vestido Lencero Satinado",    cat:"vestidos",  precio:24500, descuento:0,  destacado:false,
    img:"p-vestido-lencero.jpg", desc:"Caída suelta con brillo sutil, tiritas ajustables. El comodín para cuando no sabés qué ponerte y tenés que quedar bien." },
  { id:3,  nombre:"Vestido Palazzo Fluido",      cat:"vestidos",  precio:29900, descuento:15, destacado:true,
    img:"p-vestido-palazzo.jpg", desc:"Tela fluida con pinzas en la cintura que estiliza sin apretar. El que se lleva puesto y no se saca en todo el verano." },
  { id:4,  nombre:"Vestido Corto Acampanado",    cat:"vestidos",  precio:21900, descuento:0,  destacado:false,
    img:"p-vestido-corto.jpg", desc:"Corte a la cintura con pollera acampanada, ideal para combinar con botas o zapatillas según el día." },
  { id:5,  nombre:"Vestido Wrap Cruzado",        cat:"vestidos",  precio:27500, descuento:0,  destacado:false,
    img:"p-vestido-wrap.jpg", desc:"Escote cruzado que se ata al costado y se adapta a tu cuerpo. Favorece a cualquier talle, es de los que más se piden." },

  { id:6,  nombre:"Top Corset Canalé",           cat:"remeras",   precio:13900, descuento:0,  destacado:true,
    img:"p-top-corset.jpg", desc:"Textura canalé con boning sutil que marca la cintura sin ajustar de más. Se banca solo o debajo de un blazer." },
  { id:7,  nombre:"Remera Oversize Básica",      cat:"remeras",   precio:9900,  descuento:0,  destacado:false,
    img:"p-remera-oversize.jpg", desc:"Algodón grueso que no se transparenta ni se deforma al lavar. La remera que combinás con todo, en varios colores." },
  { id:8,  nombre:"Musculosa Escote V",          cat:"remeras",   precio:10500, descuento:0,  destacado:false,
    img:"p-musculosa-v.jpg", desc:"Tela fresca para el calor, escote en V favorecedor. Va bien sola o como base debajo de una camisa abierta." },
  { id:9,  nombre:"Top Cruzado Anudado",         cat:"remeras",   precio:12900, descuento:0,  destacado:true,
    img:"p-top-cruzado.jpg", desc:"Se anuda al frente y se ajusta a tu gusto. Ideal con jean tiro alto para un look canchero de entrecasa a la calle." },
  { id:10, nombre:"Blusa Manga Globo",           cat:"remeras",   precio:15900, descuento:0,  destacado:false,
    img:"p-blusa-globo.jpg", desc:"Mangas con volumen que le dan un toque femenino a cualquier look de oficina o salida." },

  { id:11, nombre:"Jean Mom Tiro Alto",          cat:"jeans",     precio:23900, descuento:0,  destacado:true,
    img:"p-jean-mom.jpg", desc:"Tiro alto, calce relajado en la pierna. El jean que no pasa de moda y le queda bien a todos los cuerpos." },
  { id:12, nombre:"Jean Recto Clásico",          cat:"jeans",     precio:22500, descuento:0,  destacado:false,
    img:"p-jean-recto.jpg", desc:"Calce recto de siempre, en denim con un poco de elastano para que acompañe el movimiento." },
  { id:13, nombre:"Pantalón Palazzo Fluido",     cat:"jeans",     precio:19900, descuento:0,  destacado:false,
    img:"p-pantalon-palazzo.jpg", desc:"Pantalón de tela liviana con pierna ancha, para los días de calor que igual querés vestirte bien." },
  { id:14, nombre:"Jean Flare Tiro Alto",        cat:"jeans",     precio:25900, descuento:10, destacado:false,
    img:"p-jean-flare.jpg", desc:"Se abre desde la rodilla y estiliza la silueta. El que combina perfecto con plataformas." },

  { id:15, nombre:"Conjunto Deportivo Oversize", cat:"conjuntos", precio:28900, descuento:20, destacado:true,
    img:"p-conjunto-deportivo.jpg", desc:"Top y jogger en el mismo género, corte oversize cómodo. Para el mate, el gimnasio o directamente para no hacer nada." },
  { id:16, nombre:"Conjunto Short y Top",        cat:"conjuntos", precio:26500, descuento:0,  destacado:false,
    img:"p-conjunto-short.jpg", desc:"Combinado de dos piezas en la misma tela, para no pensar qué ponerte arriba. Ideal para el verano." },
  { id:17, nombre:"Conjunto Palazzo Elegante",   cat:"conjuntos", precio:34900, descuento:0,  destacado:true,
    img:"p-conjunto-palazzo.jpg", desc:"Top y pantalón palazzo a juego, con caída elegante. El combo para un evento sin complicarte buscando qué combinar." },
  { id:18, nombre:"Conjunto Blazer y Pollera",   cat:"conjuntos", precio:36900, descuento:0,  destacado:false,
    img:"p-conjunto-blazer.jpg", desc:"Blazer estructurado con pollera a tono. Para la reunión importante o para sentirte una ejecutiva un rato." },

  { id:19, nombre:"Zapatillas Urbanas Blancas",  cat:"zapatillas",precio:38900, descuento:0,  destacado:true,
    img:"p-zapa-urbana.jpg", desc:"El básico blanco que combina con todo, de jean a vestido. Suela cómoda para el día entero parada." },
  { id:20, nombre:"Zapatillas Plataforma Rosa",  cat:"zapatillas",precio:44900, descuento:0,  destacado:true,
    img:"p-zapa-plataforma.jpg", desc:"Un poco de altura extra sin sacrificar comodidad. El toque de color que le falta a tus looks de todos los días." },
  { id:21, nombre:"Zapatillas de Lona Livianas", cat:"zapatillas",precio:32900, descuento:0,  destacado:false,
    img:"p-zapa-lona.jpg", desc:"Lona resistente con suela liviana, para el día entero de acá para allá. El comodín que combina con jean o con vestido." },
  { id:22, nombre:"Zapatillas Slip-On Casual",   cat:"zapatillas",precio:34900, descuento:0,  destacado:false,
    img:"p-zapa-slipon.jpg", desc:"Sin cordones, para salir rápido sin perder estilo. Unisex, le queda bien a cualquiera." }
];
