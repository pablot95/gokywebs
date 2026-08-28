/* ============================================================
   portfolio/data.js — Catálogo único de trabajos de Gokywebs.

   Campos por trabajo:
     id      slug; es también el nombre del preview: previews/<id>.webp
     nombre  como se muestra en la tarjeta
     url     web pública (se abre en pestaña nueva)
     tipo    tipo de web → ecommerce | landing | institucional |
             inmobiliaria | elearning | noticias
     rubro   rubro del negocio (ver RUBROS más abajo)
     que     profesión / actividad concreta del cliente
     zona    ciudad o provincia, si la web la declara
     tags    palabras extra que tienen que encontrar al buscador
     estado  online (cliente real publicado) | demo (muestra propia)

   Para agregar un trabajo: sumá el objeto acá y dejá el preview
   en previews/<id>.webp (captura de página completa, 960px de ancho).
   ============================================================ */

const GW_TIPOS = [
    { id: 'ecommerce',     label: 'Ecommerce' },
    { id: 'landing',       label: 'Landing' },
    { id: 'institucional', label: 'Institucional' },
    { id: 'inmobiliaria',  label: 'Inmobiliaria' },
    { id: 'elearning',     label: 'Plataforma de cursos' },
    { id: 'noticias',      label: 'Noticias' }
];

const GW_RUBROS = [
    { id: 'comercios',   label: 'Comercios y distribuidoras' },
    { id: 'gastronomia', label: 'Gastronomía y eventos' },
    { id: 'moda',        label: 'Moda e indumentaria' },
    { id: 'hogar',       label: 'Hogar y muebles' },
    { id: 'belleza',     label: 'Belleza y estética' },
    { id: 'salud',       label: 'Salud y bienestar' },
    { id: 'legales',     label: 'Legales y contable' },
    { id: 'finanzas',    label: 'Seguros y finanzas' },
    { id: 'inmobiliaria',label: 'Inmobiliaria' },
    { id: 'educacion',   label: 'Educación y cursos' },
    { id: 'tecnologia',  label: 'Tecnología y electrónica' },
    { id: 'industria',   label: 'Industria y construcción' },
    { id: 'servicios',   label: 'Servicios y oficios' },
    { id: 'automotor',   label: 'Automotor' },
    { id: 'deportes',    label: 'Deportes y fitness' },
    { id: 'arte',        label: 'Arte y espectáculos' },
    { id: 'turismo',     label: 'Turismo y hotelería' }
];

const GW_TRABAJOS = [

    /* ── Ecommerce ───────────────────────────────────────────── */
    { id: 'distsur', nombre: 'D.Sur', url: 'https://distsur.com.ar/', tipo: 'ecommerce', rubro: 'comercios',
      que: 'Distribuidora mayorista', zona: 'La Plata', tags: 'mayorista distribuidora almacén reparto pedidos', estado: 'online' },
    { id: 'lanuevasantelmo', nombre: 'La Nueva San Telmo', url: 'https://lanuevasantelmo.com/', tipo: 'ecommerce', rubro: 'gastronomia',
      que: 'Panadería y pastelería', zona: 'CABA', tags: 'panadería pastelería facturas tortas pan delivery', estado: 'online' },
    { id: 'mdaromes', nombre: 'Maison des Arômes', url: 'https://mdaromes.com/', tipo: 'ecommerce', rubro: 'hogar',
      que: 'Productos aromáticos', zona: '', tags: 'velas difusores aromas home spray perfume de ambiente', estado: 'online' },
    { id: 'jukkamoda', nombre: 'Jukka', url: 'https://jukkamoda.com.ar/', tipo: 'ecommerce', rubro: 'moda',
      que: 'Fábrica mayorista de indumentaria femenina', zona: '', tags: 'ropa mujer mayorista fábrica textil talles', estado: 'online' },
    { id: 'saborquetecuida', nombre: 'Sabor que te cuida', url: 'https://saborquetecuida.com.ar/', tipo: 'ecommerce', rubro: 'gastronomia',
      que: 'Despensa gourmet y saludable', zona: 'La Plata', tags: 'almacén saludable dietética gourmet sin tacc', estado: 'online' },
    { id: 'sparrow', nombre: 'Sparrow', url: 'https://www.sparrow.com.ar/', tipo: 'ecommerce', rubro: 'moda',
      que: 'Zapatillas y medias de estilo urbano', zona: '', tags: 'calzado sneakers urbano medias', estado: 'online' },
    { id: 'kare', nombre: 'Kare', url: 'https://kare.com.ar/', tipo: 'ecommerce', rubro: 'belleza',
      que: 'Productos, servicios y cursos de estética', zona: '', tags: 'estética cosmética cursos productos', estado: 'online' },
    { id: 'distririogrande', nombre: 'Distribuidora Río Grande', url: 'https://distririogrande.com.ar/', tipo: 'ecommerce', rubro: 'belleza',
      que: 'Cosmética premium', zona: 'Tierra del Fuego', tags: 'cosmética perfumería maquillaje distribuidora', estado: 'online' },
    { id: 'spstoreandservice', nombre: 'SP Store and Service', url: 'https://spstoreandservice.com.ar/', tipo: 'ecommerce', rubro: 'tecnologia',
      que: 'Repuestos de telefonía para técnicos', zona: '', tags: 'celulares repuestos módulos pantallas service técnico', estado: 'online' },
    { id: 'jdmaquinasyherramientas', nombre: 'JD Máquinas y Herramientas', url: 'https://www.jdmaquinasyherramientas.com.ar/', tipo: 'ecommerce', rubro: 'industria',
      que: 'Máquinas y herramientas manuales, eléctricas e hidráulicas', zona: '', tags: 'ferretería herramientas industriales taller', estado: 'online' },
    { id: 'elmundodelcalzado', nombre: 'El Mundo del Calzado', url: 'https://elmundodelcalzado.com.ar/', tipo: 'ecommerce', rubro: 'moda',
      que: 'Zapatillas, mocasines y accesorios', zona: '', tags: 'calzado zapatos zapatillas cuero', estado: 'online' },
    { id: 'infinitamente', nombre: 'InfinitaMente', url: 'https://infinitamente.com.ar/', tipo: 'ecommerce', rubro: 'comercios',
      que: 'Librería online', zona: '', tags: 'librería libros papelería regalos', estado: 'online' },
    { id: 'locufre', nombre: 'Locufre', url: 'https://locufre.com.ar/', tipo: 'ecommerce', rubro: 'educacion',
      que: 'Contenidos y productos en lengua de señas', zona: '', tags: 'lengua de señas LSA inclusión accesibilidad', estado: 'online' },
    { id: 'lasmagnolias', nombre: 'Las Magnolias', url: 'https://lasmagnolias.com.ar/', tipo: 'ecommerce', rubro: 'gastronomia',
      que: 'Bombones, tabletas y paletas artesanales', zona: 'Córdoba', tags: 'chocolate bombones artesanal regalería', estado: 'online' },
    { id: 'lasmagnoliasfloreria', nombre: 'Las Magnolias Florería', url: 'https://lasmagnoliasfloreria.com/', tipo: 'ecommerce', rubro: 'comercios',
      que: 'Florería y regalos', zona: '', tags: 'flores ramos florería regalos envíos', estado: 'online' },
    { id: 'niftybar', nombre: 'NiftyBar Protein', url: 'https://niftybar.com.ar/', tipo: 'ecommerce', rubro: 'deportes',
      que: 'Barras proteicas artesanales', zona: '', tags: 'suplementos proteína nutrición fitness snack', estado: 'online' },
    { id: 'botinesfv', nombre: 'Botines FV', url: 'https://botinesfv.com/', tipo: 'ecommerce', rubro: 'deportes',
      que: 'Botines de fútbol', zona: '', tags: 'fútbol botines calzado deportivo', estado: 'online' },
    { id: 'mirameindumentaria', nombre: 'Mírame Indumentaria', url: 'https://mirameindumentaria.com/', tipo: 'ecommerce', rubro: 'moda',
      que: 'Tienda de ropa', zona: '', tags: 'ropa indumentaria mujer tienda', estado: 'online' },
    { id: 'intimatebycelina', nombre: 'Intima by Celina', url: 'https://intimatebycelina.com.ar/', tipo: 'ecommerce', rubro: 'moda',
      que: 'Lencería y masajes estéticos', zona: '', tags: 'lencería ropa interior corsetería estética', estado: 'online' },
    { id: 'esbelt', nombre: 'Esbelt', url: 'https://esbelt.com.ar/', tipo: 'ecommerce', rubro: 'moda',
      que: 'Fajas modeladoras, reductoras y lencería', zona: '', tags: 'fajas postoperatorio reductoras lencería', estado: 'online' },
    { id: 'verdehogar', nombre: 'HogarVerde', url: 'https://www.verdehogar.shop/', tipo: 'ecommerce', rubro: 'hogar',
      que: 'Decoración para el hogar', zona: '', tags: 'decoración deco hogar plantas bazar', estado: 'online' },
    { id: 'rebelsinstruments', nombre: 'Rebels Instruments', url: 'https://rebelsinstruments.com.ar/', tipo: 'ecommerce', rubro: 'arte',
      que: 'Compra, venta y empeño de instrumentos musicales', zona: '', tags: 'música guitarras instrumentos empeño usados', estado: 'online' },
    { id: 'movilmarket', nombre: 'Móvil Market', url: 'https://movilmarket.com.ar/', tipo: 'ecommerce', rubro: 'comercios',
      que: 'Catálogo y reparto de mercadería', zona: 'Vaca Muerta, Neuquén', tags: 'almacén reparto delivery mercadería petrolero', estado: 'online' },
    { id: 'gicold', nombre: 'GiCOLD', url: 'https://gicold.com.ar/', tipo: 'ecommerce', rubro: 'tecnologia',
      que: 'Tecnología importada premium', zona: '', tags: 'electrónica importados gadgets tecnología', estado: 'online' },
    { id: 'tusencantos', nombre: 'Tus Encantos', url: 'https://tusencantosindumentaria.com.ar/', tipo: 'ecommerce', rubro: 'moda',
      que: 'Boutique de moda femenina', zona: '', tags: 'ropa mujer boutique indumentaria', estado: 'online' },
    { id: 'xbrake', nombre: 'XBRAKE', url: 'https://xbrake.ar/', tipo: 'ecommerce', rubro: 'automotor',
      que: 'Discos de freno wave para moto', zona: '', tags: 'moto motos frenos repuestos discos wave', estado: 'online' },

    /* ── Catálogo ────────────────────────────────────────────── */
    { id: 'giudicattivisual', nombre: 'Giudicatti Visual', url: 'https://giudicattivisual.com.ar/', tipo: 'ecommerce', rubro: 'comercios',
      que: 'Armazones mayoristas para ópticas', zona: '', tags: 'óptica anteojos armazones lentes mayorista', estado: 'online' },
    { id: 'carpinteriars', nombre: 'Carpintería R.S.', url: 'https://carpinteriars.com.ar/', tipo: 'ecommerce', rubro: 'hogar',
      que: 'Muebles a medida: placares, cocinas y racks', zona: '', tags: 'carpintería carpintero muebles placares cocinas madera', estado: 'online' },
    { id: 'autofull', nombre: 'AutoFull Neumáticos', url: 'https://autofullneumaticos.com.ar/', tipo: 'ecommerce', rubro: 'automotor',
      que: 'Distribuidor de neumáticos', zona: '', tags: 'gomería neumáticos cubiertas autos camionetas agrícola', estado: 'online' },
    { id: 'rivasrys', nombre: 'RIVAS Repuestos y Servicios', url: 'https://rivasrys.com.ar/', tipo: 'ecommerce', rubro: 'automotor',
      que: 'Mantenimiento de motor y reparaciones eléctricas', zona: '', tags: 'mecánico taller repuestos autos electricidad del automotor', estado: 'online' },

    /* ── Inmobiliaria ────────────────────────────────────────── */
    { id: 'zaguirinmobiliaria', nombre: 'LZ Zaguir Inmobiliaria', url: 'https://zaguirinmobiliaria.com.ar/', tipo: 'inmobiliaria', rubro: 'inmobiliaria',
      que: 'Casas, lotes y terrenos', zona: 'Merlo, San Luis', tags: 'propiedades venta alquiler lotes terrenos martillero', estado: 'online' },
    { id: 'ventoinmobiliaria', nombre: 'Vento Inmobiliaria', url: 'https://ventoinmobiliaria.com.ar/', tipo: 'inmobiliaria', rubro: 'inmobiliaria',
      que: 'Martilleras — propiedades en venta y alquiler', zona: '', tags: 'propiedades venta alquiler martillera casas departamentos', estado: 'online' },
    { id: 'inmobiliariatornquist', nombre: 'Inmobiliaria Tornquist', url: 'https://inmobiliariatornquist.com.ar/', tipo: 'inmobiliaria', rubro: 'inmobiliaria',
      que: 'Propiedades en la zona serrana', zona: 'Tornquist, Buenos Aires', tags: 'propiedades sierras campos casas venta alquiler', estado: 'online' },
    { id: 'inmobiliariagomezyasociados', nombre: 'Gomez & Asociados', url: 'https://inmobiliariagomezyasociados.com/', tipo: 'inmobiliaria', rubro: 'inmobiliaria',
      que: 'Venta y alquiler de propiedades', zona: 'Mendoza', tags: 'propiedades venta alquiler departamentos casas', estado: 'online' },
    { id: 'bastonspaulete', nombre: 'Bastons Paulete', url: 'https://bastonspaulete.com/', tipo: 'inmobiliaria', rubro: 'inmobiliaria',
      que: 'Compra, venta, alquiler y administración de consorcios', zona: 'General Roca y La Plata', tags: 'propiedades consorcios administración alquiler', estado: 'online' },

    /* ── Plataformas de cursos ───────────────────────────────── */
    { id: 'academiaalquimiadelser', nombre: 'Academia Alquimia del Ser', url: 'https://www.academiaalquimiadelser.com.ar/', tipo: 'elearning', rubro: 'educacion',
      que: 'Cursos de runas y Tameana', zona: '', tags: 'cursos online holístico runas tameana campus alumnos', estado: 'online' },
    { id: 'espaciocreativo', nombre: 'Espacio Creativo', url: 'https://espacio-creativo.com.ar/', tipo: 'elearning', rubro: 'educacion',
      que: 'Membresía de proyectos de artesanías', zona: '', tags: 'artesanías manualidades membresía cursos moldes', estado: 'online' },
    { id: 'valuhcatyarte', nombre: 'VALUHCATY ARTE', url: 'https://valuhcatyarte.com.ar/', tipo: 'elearning', rubro: 'educacion',
      que: 'Cursos de dibujo y pintura online', zona: '', tags: 'dibujo pintura arte clases online alumnos', estado: 'online' },
    { id: 'danielsaire', nombre: "Daniel's Aire", url: 'https://www.danielsaire.com.ar/', tipo: 'elearning', rubro: 'educacion',
      que: 'Curso de aire acondicionado automotor', zona: '', tags: 'curso oficio aire acondicionado automotor mecánica', estado: 'online' },
    { id: 'historiaspapelytijeras', nombre: 'Historias, Papel y Tijeras', url: 'https://historiaspapelytijeras.ar/', tipo: 'elearning', rubro: 'educacion',
      que: 'Clases de acuarela, scrapbook y álbumes', zona: '', tags: 'acuarela scrapbook manualidades clases taller', estado: 'online' },
    { id: 'encantoestetica', nombre: 'Encanto Estética', url: 'https://encantoestetica.com.ar/', tipo: 'elearning', rubro: 'belleza',
      que: 'Capacitación en aparatología estética', zona: '', tags: 'estética capacitación aparatología cursos cosmiatría', estado: 'online' },

    /* ── Institucionales ─────────────────────────────────────── */
    { id: 'culturapixel', nombre: 'Instituto Cultura Pixel', url: 'https://www.institutoculturapixel.com/', tipo: 'institucional', rubro: 'educacion',
      que: 'Cursos de fotografía, video, sonido y marketing', zona: 'Mendoza', tags: 'instituto fotografía video sonido marketing carreras', estado: 'online' },
    { id: 'lenguasadicionales', nombre: 'Lenguas Adicionales', url: 'https://lenguasadicionales.com.ar/', tipo: 'institucional', rubro: 'educacion',
      que: 'Instituto de inglés y portugués', zona: 'Spegazzini, Buenos Aires', tags: 'inglés portugués idiomas instituto clases', estado: 'online' },
    { id: 'sanatoriosarmiento', nombre: 'Sanatorio Sarmiento Salud', url: 'https://www.sanatoriosarmientosalud.com.ar/', tipo: 'institucional', rubro: 'salud',
      que: 'Centro médico integral', zona: 'Resistencia, Chaco', tags: 'sanatorio clínica médicos especialidades turnos', estado: 'online' },
    { id: 'aisamsalud', nombre: 'A.I.Sa.M', url: 'https://www.aisamsalud.com.ar/', tipo: 'institucional', rubro: 'salud',
      que: 'Atención integral en salud mental', zona: 'Gral. Alvear, Mendoza', tags: 'salud mental psiquiatría psicología centro', estado: 'online' },
    { id: 'ahcd', nombre: 'AHCD', url: 'https://ahcd.org.ar/', tipo: 'institucional', rubro: 'deportes',
      que: 'Intervención profesional en alto rendimiento deportivo', zona: '', tags: 'deporte alto rendimiento asociación profesionales', estado: 'online' },
    { id: 'fiam', nombre: 'FIAM Guerreros Tiger', url: 'https://fiam.club/', tipo: 'institucional', rubro: 'deportes',
      que: 'Federación internacional de artistas marciales', zona: '', tags: 'artes marciales karate federación graduaciones campeonatos', estado: 'online' },
    { id: 'ampsolutionsar', nombre: 'AMP Solutions Argentina', url: 'https://ampsolutionsar.com/', tipo: 'institucional', rubro: 'industria',
      que: 'Ingeniería y servicios industriales', zona: '', tags: 'ingeniería industria mantenimiento planta', estado: 'online' },
    { id: 'grupoacot', nombre: 'GrupoAcot', url: 'https://grupoacot.com/', tipo: 'institucional', rubro: 'industria',
      que: 'Construcción y mantenimiento industrial', zona: '', tags: 'construcción obra mantenimiento industrial empresa', estado: 'online' },
    { id: 'silcasa', nombre: 'SILCA', url: 'https://silcasa.com/', tipo: 'institucional', rubro: 'industria',
      que: 'Fabricación, montajes metalúrgicos y soldadura industrial', zona: '', tags: 'metalúrgica soldadura montajes herrería industria', estado: 'online' },

    /* ── Noticias ────────────────────────────────────────────── */
    { id: 'altavocesproducciones', nombre: 'Altavoces Producciones', url: 'https://altavocesproducciones.com.ar/', tipo: 'noticias', rubro: 'arte',
      que: 'Portal de noticias y podcasts', zona: '', tags: 'noticias prensa medio podcast radio periodismo', estado: 'online' },

    /* ── Landings destacadas (orden fijo en el portfolio) ───── */
    { id: 'cansuarconsultora', nombre: 'Cansuar Consultora', url: 'https://www.cansuarconsultora.com.ar/', tipo: 'landing', rubro: 'servicios',
      que: 'Capacitaciones y consultoría en gestión', zona: '', tags: 'consultora capacitación rrhh gestión empresas', estado: 'online' },
    { id: 'masmomentosunicos', nombre: 'Momentos Únicos', url: 'https://www.masmomentosunicos.com/', tipo: 'landing', rubro: 'gastronomia',
      que: 'Barra de tragos para eventos', zona: '', tags: 'barra tragos coctelería eventos casamiento fiesta', estado: 'online' },
    { id: 'anasuarezfotografia', nombre: 'Ana Suárez Fotografía', url: 'https://anasuarezfotografa.com.ar/', tipo: 'landing', rubro: 'arte',
      que: 'Fotografía profesional', zona: '', tags: 'fotografía fotógrafa books eventos sesiones', estado: 'online' },
    { id: 'licenciadaluena', nombre: 'Lic. MM Luena', url: 'https://licenciadaluena.com.ar/', tipo: 'landing', rubro: 'salud',
      que: 'Psicóloga: terapia virtual y presencial', zona: 'Mar del Plata', tags: 'psicóloga terapia online consultorio sesiones', estado: 'online' },
    { id: 'catalinasolaridorda', nombre: 'Catalina Solari Dorda', url: 'https://www.catalinasolaridorda.com.ar/', tipo: 'landing', rubro: 'arte',
      que: 'Taller de escenografía, dibujo y pintura', zona: 'Quilmes y Neuquén', tags: 'arte taller pintura dibujo escenografía galería', estado: 'online' },
    { id: 'petitapp', nombre: 'Pet it', url: 'https://www.petit-app.com/', tipo: 'landing', rubro: 'tecnologia',
      que: 'App para el cuidado de mascotas', zona: '', tags: 'app mascotas perros gatos veterinaria paseadores', estado: 'online' },
    { id: 'estudioasilva', nombre: 'Estudio A. Silva', url: 'https://www.estudioasilva.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Abogada de familia y sucesiones', zona: '', tags: 'abogada abogado familia divorcios sucesiones estudio jurídico', estado: 'online' },
    { id: 'bfsoluciones', nombre: 'BF Soluciones', url: 'https://bfsoluciones.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Contadores y asesoría contable', zona: '', tags: 'contador contable monotributo impuestos afip arca', estado: 'online' },
    { id: 'tesisenderecho', nombre: 'Tesis en Derecho', url: 'https://www.tesisenderecho.com.ar/', tipo: 'landing', rubro: 'educacion',
      que: 'Mentoría de tesis en Derecho', zona: '', tags: 'tesis derecho posgrado mentoría académico', estado: 'online' },
    { id: 'tuprepagaonline', nombre: 'Prepagas Argentina', url: 'https://tuprepagaonline.com.ar/', tipo: 'landing', rubro: 'salud',
      que: 'Comparador de planes de salud', zona: '', tags: 'prepaga obra social planes de salud cotizador asesor', estado: 'online' },
    { id: 'psicorodas', nombre: 'Alder Rodas', url: 'https://www.psicorodas.com.ar/', tipo: 'landing', rubro: 'salud',
      que: 'Psicólogo clínico: ansiedad, depresión y trauma', zona: '', tags: 'psicólogo terapia online ansiedad depresión trauma', estado: 'online' },

    /* ── Turnos ──────────────────────────────────────────────── */
    { id: 'skymed', nombre: 'SkyMed Consultorios', url: 'https://www.skymedconsultorios.com/', tipo: 'landing', rubro: 'salud',
      que: 'Consultorios médicos', zona: '', tags: 'consultorio médico turnos especialidades salud', estado: 'online' },
    { id: 'entrecartasyjose', nombre: 'Entre Cartas y Jose', url: 'https://www.entrecartasyjose.com/', tipo: 'landing', rubro: 'salud',
      que: 'Lecturas de tarot', zona: 'Zona Norte, Buenos Aires', tags: 'tarot lectura cartas espiritual consulta turnos', estado: 'online' },

    /* ── Landings de servicios y profesionales ───────────────── */
    { id: 'segeym', nombre: 'Segeym', url: 'https://www.segeym.com/', tipo: 'landing', rubro: 'servicios',
      que: 'Electricista industrial y domiciliario', zona: 'Neuquén y Vaca Muerta', tags: 'electricista electricidad instalaciones tableros', estado: 'online' },
    { id: 'servitechba', nombre: 'Servitech BA', url: 'https://www.servitechba.com/', tipo: 'landing', rubro: 'servicios',
      que: 'Servicio técnico de electrodomésticos a domicilio', zona: 'Buenos Aires', tags: 'service reparación heladeras lavarropas electrodomésticos', estado: 'online' },
    { id: 'jnservicios', nombre: 'JN Servicios Integrales', url: 'https://jnservicios.com.ar/', tipo: 'landing', rubro: 'industria',
      que: 'Mantenimiento, obras y proyectos', zona: '', tags: 'mantenimiento obras albañilería empresa servicios', estado: 'online' },
    { id: 'transportemrtruck', nombre: 'Transporte MR TRUCK', url: 'https://transportemrtruck.com.ar/', tipo: 'landing', rubro: 'servicios',
      que: 'Transporte de carga empresarial', zona: 'Buenos Aires', tags: 'transporte fletes carga camiones logística', estado: 'online' },
    { id: 'riveropinturas', nombre: 'Jesús A. Rivero Pinturas', url: 'https://riveropinturas.com/', tipo: 'landing', rubro: 'servicios',
      que: 'Pintura profesional de obra', zona: 'Médanos, Buenos Aires', tags: 'pintor pintura obra revestimientos', estado: 'online' },
    { id: 'grupohv', nombre: 'Grupo HV Logística', url: 'https://grupohv.com.ar/', tipo: 'landing', rubro: 'servicios',
      que: 'Transporte y soluciones logísticas', zona: '', tags: 'logística transporte depósito distribución', estado: 'online' },
    { id: 'consultoramaritima', nombre: 'Galeón Consultora Marítima', url: 'https://consultoramaritima.com.ar/', tipo: 'landing', rubro: 'servicios',
      que: 'Servicios marítimos profesionales', zona: '', tags: 'marítimo náutica buques consultora puerto', estado: 'online' },
    { id: 'hidroarca', nombre: 'HidroArca', url: 'https://hidroarca.com/', tipo: 'landing', rubro: 'industria',
      que: 'Riego por goteo subterráneo', zona: 'Córdoba', tags: 'riego goteo agro campo agua instalación', estado: 'online' },
    { id: 'smartsync', nombre: 'Smart House', url: 'https://smartsync.com.ar/', tipo: 'landing', rubro: 'tecnologia',
      que: 'Domótica y tecnología para la vivienda', zona: '', tags: 'domótica smart home automatización seguridad', estado: 'online' },
    { id: 'mattigraff', nombre: 'Gráfica y Ploteo', url: 'https://mattigraff.com.ar/', tipo: 'landing', rubro: 'servicios',
      que: 'Ploteo vehicular y gráfica comercial', zona: 'Quilmes, Buenos Aires', tags: 'ploteo gráfica cartelería vinilos impresión', estado: 'online' },
    { id: 'agrimensurasatelital', nombre: 'Agrimensura Satelital', url: 'https://agrimensurasatelital.com/', tipo: 'landing', rubro: 'servicios',
      que: 'Topografía, mensuras, drones y GPS', zona: 'Chubut', tags: 'agrimensor mensura topografía drones GPS lotes', estado: 'online' },
    { id: 'csgestionpymes', nombre: 'CS Gestión', url: 'https://www.csgestionpymes.com.ar/', tipo: 'landing', rubro: 'servicios',
      que: 'Consultoría para PyMEs', zona: '', tags: 'consultoría pymes gestión empresas capacitación', estado: 'online' },
    { id: 'pgmsconsultora', nombre: 'PGMS Consultora', url: 'https://pgmsconsultora.com.ar/', tipo: 'landing', rubro: 'educacion',
      que: 'Propuestas educativas', zona: '', tags: 'educación capacitación docentes propuestas consultora', estado: 'online' },
    { id: 'cococatering', nombre: 'Cocó Catering', url: 'https://cococatering.com.ar/', tipo: 'landing', rubro: 'gastronomia',
      que: 'Catering para eventos', zona: 'Buenos Aires', tags: 'catering eventos casamientos finger food', estado: 'online' },
    { id: 'enanosbuenosaires', nombre: 'Enanos Buenos Aires', url: 'https://enanosbuenosaires.com.ar/', tipo: 'landing', rubro: 'arte',
      que: 'Shows para fiestas en todo el país', zona: '', tags: 'shows animación fiestas eventos espectáculo', estado: 'online' },
    { id: 'hostelsrosarinos', nombre: 'Hostels Rosarinos', url: 'https://www.hostelsrosarinos.com.ar/', tipo: 'landing', rubro: 'turismo',
      que: 'Hostels y alojamiento', zona: 'Rosario', tags: 'hostel alojamiento hospedaje turismo habitaciones', estado: 'online' },
    { id: 'elgaleondeoro', nombre: 'El Galeón de Oro', url: 'https://elgaleondeoro.com.ar/', tipo: 'landing', rubro: 'turismo',
      que: 'Camping, recreo y dormis en el Delta', zona: 'Tigre, Buenos Aires', tags: 'camping recreo isla delta kayak parrillas pesca', estado: 'online' },

    /* ── Legales, contable y seguros ─────────────────────────── */
    { id: 'mgabogado', nombre: 'Dr. Martín García', url: 'https://www.mgabogado.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Abogado previsional: jubilaciones y pensiones', zona: 'CABA', tags: 'abogado previsional jubilación pensión anses reajuste', estado: 'online' },
    { id: 'jubilacionesmisiones', nombre: 'Jubilaciones Misiones', url: 'https://jubilacionesmisiones.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Estudio jurídico previsional', zona: 'Misiones', tags: 'abogado jubilación pensión previsional anses', estado: 'online' },
    { id: 'mtgestoriaintegral', nombre: 'Estudio Jurídico M&T', url: 'https://mtgestoriaintegral.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Gestoría integral y estudio jurídico', zona: 'Comodoro Rivadavia, Chubut', tags: 'abogado gestoría trámites automotor sucesiones', estado: 'online' },
    { id: 'viaamparo', nombre: 'Vía Amparo', url: 'https://www.viaamparo.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Amparos de salud contra obras sociales y prepagas', zona: '', tags: 'abogado amparo salud obra social prepaga discapacidad', estado: 'online' },
    { id: 'italianosdelmundo', nombre: 'Italianos del Mundo', url: 'https://italianosdelmundo.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Ciudadanía italiana y pasaporte europeo', zona: '', tags: 'ciudadanía italiana pasaporte trámites jure sanguinis', estado: 'online' },
    { id: 'axiotek', nombre: 'AXIOTEK', url: 'https://www.axiotek.com.ar/', tipo: 'landing', rubro: 'legales',
      que: 'Habilitaciones comerciales, seguridad e higiene y peritajes', zona: 'CABA', tags: 'habilitaciones seguridad e higiene peritaje ingeniería trámites', estado: 'online' },
    { id: 'infinitytrader', nombre: 'Infinity Trader', url: 'https://infinitytrader.com.ar/', tipo: 'landing', rubro: 'finanzas',
      que: 'Formación en trading', zona: '', tags: 'trading inversiones finanzas mentoría bolsa', estado: 'online' },
    { id: 'tuproductoronline', nombre: 'Tu Productor Online', url: 'https://tuproductordesegurosonline.com.ar/', tipo: 'landing', rubro: 'finanzas',
      que: 'Asesor y productor de seguros', zona: '', tags: 'seguros productor póliza auto hogar vida', estado: 'online' },

    /* ── Salud y bienestar ───────────────────────────────────── */
    { id: 'urgencias24hs', nombre: 'Guardia Odontológica Bosques', url: 'https://www.urgencias24hs.com.ar/', tipo: 'landing', rubro: 'salud',
      que: 'Urgencias dentales 24 horas', zona: 'Bosques y Varela, Buenos Aires', tags: 'odontólogo dentista urgencia guardia muela', estado: 'online' },
    { id: 'espaciovicenzo', nombre: 'Espacio Vicenzo', url: 'https://espaciovicenzo.com.ar/', tipo: 'landing', rubro: 'salud',
      que: 'Centro de apoyo integral en adicciones', zona: '', tags: 'adicciones tratamiento centro terapia acompañamiento', estado: 'online' },
    { id: 'experienciaki', nombre: 'Experiencia Ki', url: 'https://experienciaki.com.ar/', tipo: 'landing', rubro: 'salud',
      que: 'Terapias y experiencias de bienestar', zona: '', tags: 'bienestar terapias holístico meditación retiros', estado: 'online' },
    { id: 'zechtatuajes', nombre: 'Zech Tatuajes', url: 'https://www.zechtatuajes.com.ar/', tipo: 'landing', rubro: 'belleza',
      que: 'Estudio de tatuajes realismo black & grey', zona: '', tags: 'tatuajes tattoo estudio realismo piercing', estado: 'online' },
    { id: 'lessence', nombre: "L'Essence", url: 'https://lessence.studio/', tipo: 'landing', rubro: 'belleza',
      que: 'Estética y tratamientos faciales', zona: '', tags: 'estética facial tratamientos spa belleza', estado: 'online' }
];
