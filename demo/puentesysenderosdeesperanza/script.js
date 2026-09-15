document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WSP = '5491164189472';
const POR_PAGINA = 6;

const IMG = {
  encuentro: { src: 'images/encuentro-comunitario_2098x750.webp', w: 1600, h: 572 },
  alimento: { src: 'images/seguridad-alimentaria_1619x971.webp', w: 1600, h: 960 },
  deporte: { src: 'images/deporte-inclusivo_1122x1402.webp', w: 1122, h: 1402 },
  empleo: { src: 'images/orientacion-primer-empleo_941x1672.webp', w: 900, h: 1600 },
  escucha: { src: 'images/acompanamiento-y-escucha_1254x1254.webp', w: 1254, h: 1254 },
  comunitaria: { src: 'images/accion-comunitaria_1254x1254.webp', w: 1254, h: 1254 },
};

const LINEAS = [
  {
    titulo: 'Prevención y acompañamiento en consumos problemáticos',
    texto: 'Generamos espacios de escucha y orientación para jóvenes y sus familias, y articulamos con organismos especializados como SEDRONAR cuando la situación lo requiere.',
    dato: 'Más de 50 jóvenes acompañados',
    nota: 'Si necesitás ayuda ahora: <b>Línea 141</b> de SEDRONAR, gratuita y confidencial, las 24 horas en todo el país.',
    img: IMG.escucha,
    alt: 'Grupo de jóvenes y una coordinadora conversando sentados en ronda',
  },
  {
    titulo: 'Seguridad alimentaria y desarrollo nutricional',
    texto: 'Acompañamos a las familias del barrio con alimento y trabajo sobre hábitos nutricionales, organizados junto a vecinas, vecinos e instituciones de la zona.',
    dato: 'Entregas organizadas con la comunidad',
    img: IMG.alimento,
    alt: 'Voluntarios entregando bolsas de frutas y verduras a familias del barrio',
  },
  {
    titulo: 'Primer empleo y proyecto de vida',
    texto: 'Alentamos a los jóvenes a terminar sus estudios y damos orientación laboral: armado de currículum, preparación para entrevistas y acompañamiento en la búsqueda. Articulamos con empresas e instituciones para promover empleo formal.',
    dato: 'Orientación laboral y articulación con empresas',
    img: IMG.empleo,
    alt: 'Una voluntaria acompaña a dos jóvenes que trabajan en una computadora',
  },
  {
    titulo: 'Deporte, niñez e inclusión comunitaria',
    texto: 'El deporte abre la puerta al encuentro. Sostenemos espacios donde chicas y chicos del barrio juegan, se conocen y aprenden a cuidar lo común, con la inclusión como punto de partida.',
    dato: 'Espacios deportivos abiertos al barrio',
    img: IMG.deporte,
    alt: 'Chicas y chicos jugando al fútbol en la calle, una jugadora en silla de ruedas',
  },
];

const TRAMOS = [
  { nombre: 'Vecinos y vecinas', texto: 'Los que conocen el barrio y sostienen lo cotidiano. Sin su participación, ninguna obra se sostiene en el tiempo.' },
  { nombre: 'Organizaciones sociales', texto: 'Las que ya están en el territorio. Sumamos esfuerzos en vez de superponer intervenciones.' },
  { nombre: 'Empresas', texto: 'Materiales, prácticas laborales y apoyo a proyectos concretos. Así se levantó el muro de Pergamino.' },
  { nombre: 'Universidades', texto: 'Conocimiento técnico, diagnóstico y formación para que las respuestas tengan respaldo.' },
  { nombre: 'Estado', texto: 'Municipal, provincial y nacional. Gestionamos, documentamos y acompañamos para que las respuestas lleguen.' },
];

const EJES = [
  { id: 'todos', nombre: 'Todas' },
  { id: 'espacio', nombre: 'Espacio público y seguridad' },
  { id: 'acompanamiento', nombre: 'Acompañamiento' },
  { id: 'comunidad', nombre: 'Comunidad y cultura' },
  { id: 'institucional', nombre: 'Articulación institucional' },
];

const ACCIONES = [
  {
    id: 'muro-lamadrid', eje: 'espacio', fecha: '2024', orden: 2024.5, destacada: true,
    titulo: 'Cuidar el barrio también es construir esperanza',
    resumen: 'Levantamos un muro de protección en uno de los sectores más vulnerables de Villa Lamadrid, con materiales donados por empresas y el acompañamiento del Municipio.',
    texto: 'Ante una situación que afectaba la tranquilidad del barrio, vecinas y vecinos decidimos organizarnos para cuidar a nuestra comunidad. En 2024, con materiales donados por empresas privadas y el acompañamiento del área de Seguridad del Municipio de Lomas de Zamora, construimos un muro de protección en uno de los sectores más vulnerables de Villa Lamadrid. Más que una obra, fue una acción comunitaria para recuperar un espacio y brindar mayor seguridad y tranquilidad a las familias.',
    actores: ['Urkupiña S.A.', 'Cooperativa Ocean', 'Municipio de Lomas de Zamora'],
    img: IMG.comunitaria, alt: 'Vecinas, vecinos y chicos pintando y plantando en un cantero del barrio',
  },
  {
    id: 'luminarias', eje: 'espacio', fecha: '', orden: 2024.4,
    titulo: 'Pequeñas acciones, grandes cambios',
    resumen: 'Compramos dos luminarias urbanas para reforzar la seguridad del primer muro que levantamos.',
    texto: 'Iluminamos el muro de Pergamino. Como comunidad, compramos dos luminarias urbanas para reforzar la seguridad del primer muro que levantamos en 2024. El Municipio de Lomas de Zamora realizó la instalación. Un paso más para cuidar el barrio entre todos.',
    actores: ['Municipio de Lomas de Zamora'],
  },
  {
    id: 'denuncias', eje: 'espacio', fecha: '2023 — 2025', orden: 2024.0,
    titulo: 'Cuando la comunidad se organiza, el barrio cambia',
    resumen: 'Promovimos denuncias seguras y anónimas y pedimos la intervención de los organismos competentes, con acciones coordinadas entre 2023 y 2025.',
    texto: 'Creemos que los cambios duraderos se construyen con compromiso, responsabilidad y trabajo conjunto entre la comunidad y el Estado. Frente a situaciones que afectaban la vida cotidiana del barrio, nos organizamos para promover denuncias seguras y anónimas, fortalecer la participación ciudadana y solicitar la intervención de los organismos competentes. Entre 2023 y 2025 impulsamos acciones coordinadas con autoridades nacionales, provinciales y municipales para recuperar tranquilidad y promover una convivencia basada en el respeto y la prevención.',
    actores: ['Autoridades nacionales', 'Autoridades provinciales', 'Municipio de Lomas de Zamora'],
  },
  {
    id: 'otermin', eje: 'institucional', fecha: '', orden: 2025.2,
    titulo: 'Puentes que acercan soluciones',
    resumen: 'La visita del intendente al barrio permitió que vecinas y vecinos plantearan sus necesidades de forma directa y avanzar en respuestas concretas.',
    texto: 'La visita del intendente Federico Otermín al barrio de Lamadrid representó un hecho significativo. El jefe comunal estuvo acompañado por la directora del CGM de Lamadrid, Vilma González, y dialogaron con vecinos y vecinas, referentes e instituciones. Desde Puentes y Senderos de Esperanza acompañamos esta jornada de trabajo territorial en la que se pudieron plantear las necesidades de forma directa. El encuentro permitió avanzar en respuestas concretas como la reparación de baches, la instalación de reductores de velocidad y el relevamiento de otras demandas urgentes. Durante la recorrida también se visitó el muro comunitario de Pergamino.',
    actores: ['Municipio de Lomas de Zamora', 'CGM Lamadrid'],
    img: IMG.encuentro, alt: 'Vecinas, vecinos y referentes conversando en la calle del barrio',
  },
  {
    id: 'carnaval', eje: 'comunidad', fecha: 'Febrero 2024', orden: 2024.2,
    titulo: 'Carnaval de la Esperanza',
    resumen: 'Organizamos un carnaval comunitario y una choripaneada con un objetivo sencillo: encontrarnos y fortalecer los vínculos del barrio.',
    texto: 'En febrero de 2024 compartimos una noche especial junto a las familias del barrio de Lamadrid: organizamos un carnaval comunitario y una choripaneada con un objetivo sencillo, encontrarnos, fortalecer los vínculos y demostrar que la esperanza también se construye celebrando juntos. Fue una oportunidad para que niños, jóvenes y adultos compartieran un espacio de alegría, respeto y comunidad. Cuando un barrio se une, recupera la confianza en sí mismo y empieza a construir un futuro con más oportunidades para todos.',
  },
  {
    id: 'consumos', eje: 'acompanamiento', fecha: '', orden: 2025.0, destacada: true,
    titulo: 'Escuchar para construir nuevas oportunidades',
    resumen: 'Generamos espacios de escucha y orientación para jóvenes y sus familias. Hasta el momento acompañamos, en una primera instancia, a más de 50 jóvenes.',
    texto: 'Entendimos que recuperar un barrio también es acompañar a quienes atraviesan consumos problemáticos. Por eso generamos espacios de escucha y orientación para jóvenes y sus familias, articulando con organismos especializados como SEDRONAR. Hasta el momento acompañamos, en una primera instancia, a más de 50 jóvenes. Creemos que una comunidad presente puede abrir el primer camino de esperanza.',
    actores: ['SEDRONAR'],
    img: IMG.escucha, alt: 'Ronda de jóvenes conversando con una coordinadora',
  },
  {
    id: 'empleo', eje: 'acompanamiento', fecha: '', orden: 2025.1,
    titulo: 'Construir caminos a través del trabajo',
    resumen: 'Orientación laboral, armado de currículums y preparación para entrevistas, con articulación con empresas para promover empleo formal.',
    texto: 'Creemos que el trabajo es una herramienta fundamental para construir un proyecto de vida. Por eso alentamos a los jóvenes a finalizar sus estudios y brindamos orientación laboral: armado de currículums, preparación para entrevistas y acompañamiento en la búsqueda de empleo. Además articulamos con empresas e instituciones para promover oportunidades de empleo formal. Nuestro objetivo es que cada joven acceda a más herramientas para desarrollar su futuro con autonomía y dignidad.',
    img: IMG.empleo, alt: 'Una voluntaria acompaña a dos jóvenes frente a una computadora',
  },
  {
    id: 'bandera', eje: 'institucional', fecha: 'Mayo 2025', orden: 2025.4,
    titulo: 'Un símbolo que fortalece el vínculo con las comunidades',
    resumen: 'Donamos una bandera nacional a la Comisaría Décima de Lomas de Zamora y asumimos su renovación y cuidado anual.',
    texto: 'En la Semana de Mayo de 2025 donamos una bandera nacional a la Comisaría Décima de Lomas de Zamora para su mástil institucional. La iniciativa buscó fortalecer el vínculo entre comunidad e instituciones y promover el respeto por nuestros símbolos patrios. Asumimos también la renovación y el cuidado anual de la bandera, reafirmando nuestro trabajo permanente junto a la comunidad.',
    actores: ['Comisaría Décima de Lomas de Zamora'],
  },
  {
    id: 'prevencion-jornada', eje: 'acompanamiento', fecha: '', orden: 2025.3,
    titulo: 'La prevención desde el compromiso comunitario',
    resumen: 'Nuestro secretario participó de una jornada de prevención sobre consumos problemáticos en una escuela secundaria de Ingeniero Budge.',
    texto: 'Nuestro secretario, Monseñor Luis Bergonzi Moreno, participó de una jornada de prevención sobre consumos problemáticos organizada por la Iglesia de Scientology junto a la Mesa de Diálogo Interreligioso de Lomas de Zamora, realizada en la Escuela Secundaria N.º 83 de Ingeniero Budge. Monseñor compartió su experiencia en el acompañamiento de personas que atraviesan situaciones de adicción, destacando la importancia del trabajo conjunto entre instituciones para fortalecer la prevención, la contención y el compromiso con los barrios.',
    actores: ['Mesa de Diálogo Interreligioso de Lomas de Zamora', 'Escuela Secundaria N.º 83'],
  },
  {
    id: 'espacio-verde', eje: 'espacio', fecha: 'Octubre 2025', orden: 2025.8,
    titulo: 'Recuperar espacios es recuperar comunidad',
    resumen: 'Recuperamos junto a vecinas y vecinos un espacio de unos 50 m² que estaba en abandono, para transformarlo en un espacio verde y de encuentro.',
    texto: 'En octubre de 2025 recuperamos junto a vecinos y vecinas un espacio de aproximadamente 50 metros cuadrados en Otto Krause y Ribera Sur, que estaba en abandono. Impulsamos su transformación en un espacio verde y de encuentro para la comunidad. En nuestro libro de actas registramos la propuesta de que lleve el nombre del fiscal Julio César Strassera, por su compromiso con la justicia y la democracia. Para nosotros, recuperar un espacio público es devolverle al barrio un lugar de convivencia, de memoria y de esperanza.',
    img: IMG.comunitaria, alt: 'Vecinos plantando y pintando un cantero recuperado',
  },
  {
    id: 'blandengues', eje: 'institucional', fecha: '2025', orden: 2025.9,
    titulo: 'Puentes de diálogo, senderos de soluciones',
    resumen: 'Entregamos al Municipio la documentación para reanudar la segunda obra de cerramiento, paralizada desde mayo de 2025.',
    texto: 'Tras completar con éxito la construcción del muro de Pergamino, impulsamos una nueva gestión para destrabar la segunda obra de cerramiento en Blandengues y las vías, paralizada desde el 31 de mayo de 2025, otro punto crítico de inseguridad en el barrio de Lamadrid. Acompañados por vecinas y vecinos, entregamos al Secretario de Desarrollo Social, Lucas Modarelli, del Gobierno Municipal de Lomas de Zamora, la documentación respaldatoria solicitando la reanudación de la obra. Durante el encuentro, el funcionario se comprometió a elevar el planteo a la Jefatura de Gabinete para su evaluación.',
    actores: ['Municipio de Lomas de Zamora'],
  },
  {
    id: 'reciclado', eje: 'comunidad', fecha: '', orden: 2024.1,
    titulo: 'Cuando desde el juego enseñamos a cuidar',
    resumen: 'Taller de reciclado para chicas y chicos del barrio: con materiales reciclados armamos las guirnaldas que después usamos en el carnaval.',
    texto: 'Durante el verano realizamos un taller de reciclado para niñas y niños del barrio, promoviendo el cuidado del ambiente y el valor de los espacios comunes. Con materiales reciclados confeccionamos guirnaldas y elementos decorativos, luego utilizados en los festejos de carnaval. Creemos que educar desde la infancia es sembrar valores que fortalecen a toda la comunidad.',
  },
  {
    id: 'disfraces', eje: 'comunidad', fecha: '', orden: 2024.15,
    titulo: 'Creatividades que unen a la comunidad',
    resumen: 'Taller de disfraces con papel crepé, donde cada chica y cada chico creó el suyo para el carnaval.',
    texto: 'En el marco de las actividades de carnaval realizamos un taller de disfraces con papel crepé, donde cada niña y niño creó su propio disfraz. La propuesta fomentó la creatividad, el trabajo en equipo y la inclusión, fortaleciendo el sentido de pertenencia. Creemos que cuando un niño se siente parte de su comunidad, también aprende a cuidarla y a valorarla.',
  },
  {
    id: 'murga', eje: 'comunidad', fecha: '', orden: 2025.5,
    titulo: 'Uniendo cultura y comunidad',
    resumen: 'Acompañamos a la Murga Amanecer de los Tigres para que suene en los eventos de la Feria Urkupiña.',
    texto: 'Acompañamos a la Murga Amanecer de los Tigres, histórico corazón del barrio, para que suene en los eventos que lleva adelante la Feria Urkupiña. Abrimos ese contacto para que la cultura popular tenga presencia hoy y en los próximos encuentros dentro del predio.',
    actores: ['Murga Amanecer de los Tigres', 'Urkupiña S.A.'],
  },
  {
    id: 'belgrano', eje: 'institucional', fecha: 'Junio 2026', orden: 2026.6,
    titulo: 'Compromiso con la historia y los valores democráticos',
    resumen: 'Participamos del acto por el 256.º aniversario del nacimiento del General Manuel Belgrano, en Barrancas de Belgrano.',
    texto: 'Con motivo del 256.º aniversario del nacimiento del General Manuel Belgrano, en junio de 2026 participamos del acto conmemorativo realizado en Barrancas de Belgrano, invitados por el profesor Rubén Gavalda y Castro, presidente de la Academia Belgraniana de la República Argentina. Compartir esta jornada de homenaje nos permitió reafirmar nuestro compromiso con la memoria histórica, los valores democráticos, la identidad nacional y la formación ciudadana.',
    actores: ['Academia Belgraniana de la República Argentina'],
  },
  {
    id: 'herramientas', eje: 'espacio', fecha: 'Verano 2024/2025', orden: 2024.9,
    titulo: 'Herramientas compartidas para cuidar el barrio',
    resumen: 'Ante la preocupación por el dengue, compramos entre vecinas y vecinos una fumigadora y una cortadora de pasto de uso comunitario.',
    texto: 'Durante el verano 2024/2025, ante la preocupación por el dengue, vecinos y vecinas de la zona 17 de Villa Lamadrid nos organizamos y adquirimos una fumigadora y una cortadora de pasto para uso comunitario. Estas herramientas se utilizan de manera solidaria y sin fines de lucro para colaborar con el mantenimiento de los espacios comunes y el cuidado del ambiente del barrio.',
  },
  {
    id: 'juridica', eje: 'acompanamiento', fecha: '', orden: 2025.6,
    titulo: 'Orientación jurídica para acercar soluciones',
    resumen: 'Brindamos orientación jurídica inicial gratuita, con información clara y derivación a los organismos o profesionales competentes.',
    texto: 'Brindamos orientación jurídica inicial gratuita a vecinos y vecinas, ofreciendo información clara y derivación a los organismos o profesionales competentes según cada caso. No reemplazamos la representación legal: facilitamos el primer paso para que cada persona conozca sus derechos y sepa dónde acudir.',
  },
];

const GAL_DIR = 'images/trabajos-nosostros-gente/';
const POR_TANDA = 12;

const GALERIA = [
  ['muro-iluminado-jpg-1024x488', 1024, 488, 'El muro iluminado, donde antes había oscuridad', 'espacio'],
  ['6b6f54f6-3ccb-4022-b915-6f37889af9b5-1024x576', 1024, 576, 'Taller de armado de currículum y preparación de entrevistas', 'acompanamiento'],
  ['ChatGPT-Image-2-ago-2026-10_44_57-p.m-1024x491', 1024, 491, 'La noche del encuentro: mesas largas y el barrio junto', 'comunidad'],
  ['20240915_114901_HDR-1024x473', 1024, 473, 'Ladrillo por ladrillo, el muro toma altura', 'espacio'],
  ['WhatsApp-Image-2026-08-01-at-17.24.12-1024x443', 1024, 443, 'La Murga Amanecer de los Tigres, corazón del barrio', 'comunidad'],
  ['561571708_122222621858106665_6514175141397668730_n-1-1024x574', 1024, 574, 'Entrega de certificados a quienes terminaron la capacitación', 'acompanamiento'],
  ['20250107_133026-1024x629', 1024, 629, 'Las luminarias que refuerzan el muro, durante la instalación', 'espacio'],
  ['nor-1024x482', 1024, 482, 'Con la comisaría, referentes religiosos y vecinas del barrio', 'institucional'],
  ['7ecfdc87-1110-4d99-8877-b3ac9a752bce-1-1024x576', 1024, 576, 'Jornada contra el dengue con la fumigadora comunitaria', 'espacio'],
  ['trashed-1773623581-IMG_20260213_203410889_HDR-1024x533', 1024, 533, 'Los disfraces salieron del taller de papel crepé', 'comunidad'],
  ['480475660_122189801690106665_2267995330811943545_n-1-1024x417', 1024, 417, 'Asfalto nuevo: una de las respuestas que llegaron al barrio', 'institucional'],
  ['ADICCIONES-1024x576', 1024, 576, 'Espacio de escucha y orientación para jóvenes y familias', 'acompanamiento'],
  ['20240828_111627_HDR-1024x473', 1024, 473, 'Las primeras columnas, antes de que hubiera muro', 'espacio'],
  ['20240907_111507_HDR-1024x473', 1024, 473, 'La mezcla se prepara en la vereda, entre vecinos', 'espacio'],
  ['20240907_111540_HDR-1024x473', 1024, 473, 'La obra, acompañada por el área de Seguridad del Municipio', 'espacio'],
  ['20240915_114921_HDR-1024x473', 1024, 473, 'Nadie mira de afuera: la obra se hizo entre todos', 'espacio'],
  ['ZZ20240907_111423_HDR-3-1024x473', 1024, 473, 'Otra jornada de trabajo sobre el muro', 'espacio'],
  ['20250108_120811-1024x630', 1024, 630, 'Gestión y seguimiento junto al Municipio de Lomas de Zamora', 'institucional'],
  ['480996670_122189801426106665_7385627076727559090_n-1024x467', 1024, 467, 'Un abrazo cuando una gestión sale', 'institucional'],
  ['481076382_122189801726106665_1572340350085416759_n', 748, 396, 'En la calle, cara a cara con los referentes del barrio', 'institucional'],
  ['560008798_122222622206106665_3120230454991660780_n-1-1024x451', 1024, 451, 'Jornada de formación con jóvenes del barrio', 'acompanamiento'],
  ['ChatGPT-Image-2-ago-2026-10_47_00-p.m-1024x457', 1024, 457, 'Guirnaldas en la calle para el carnaval comunitario', 'comunidad'],
  ['IMG-20250108-WA0136_1-1024x389', 1024, 389, 'Después de la jornada, la mesa compartida', 'comunidad'],
  ['Z-20250125_180217-1024x567', 1024, 567, 'Taller de reciclado: los adornos los hicieron ellos', 'comunidad'],
  ['Z-20250304_215825-1024x598', 1024, 598, 'Los reductores de velocidad, ya instalados en el barrio', 'institucional'],
  ['ZBANDERA-1024x483', 1024, 483, 'Jornada interreligiosa junto a instituciones de la zona', 'institucional'],
  ['WhatsApp-Image-2026-08-01-at-17.22.34-3-1024x528', 1024, 528, 'Acto conmemorativo por el aniversario del General Belgrano', 'institucional'],
].map(([archivo, w, h, texto, eje]) => ({ src: `${GAL_DIR}${archivo}.webp`, w, h, texto, eje }));

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const getAccion = id => ACCIONES.find(a => a.id === id);
const getEje = id => EJES.find(e => e.id === id);
const wsp = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

function trapFocus(panel, e) {
  if (e.key !== 'Tab') return;
  const foco = panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const first = foco[0], last = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- líneas de acción ---------- */

function initLineas() {
  const grid = document.getElementById('gridLineas');
  if (!grid) return;
  grid.innerHTML = LINEAS.map((l, i) => `
    <article class="linea" data-animate style="transform:translateY(30px);opacity:0">
      <div class="linea-media">
        <span class="linea-n" aria-hidden="true">0${i + 1}</span>
        <img src="${l.img.src}" alt="${esc(l.alt)}" width="${l.img.w}" height="${l.img.h}" loading="lazy" decoding="async">
      </div>
      <div class="linea-body">
        <h3>${esc(l.titulo)}</h3>
        <p>${esc(l.texto)}</p>
        <p class="linea-dato">${esc(l.dato)}</p>
        ${l.nota ? `<p class="linea-nota">${l.nota}</p>` : ''}
      </div>
    </article>`).join('');
}

/* ---------- galería ---------- */

const mosaico = document.getElementById('mosaico');
const btnMasFotos = document.getElementById('verMasFotos');
let fotosVisibles = POR_TANDA;

// El patrón se repite cada 5: una ancha, una media y tres angostas.
// Cada línea suma 12 columnas, así que 12 y 27 fotos cierran sin huecos.
const TAMANIOS = ['ancha', 'media', 'angosta', 'angosta', 'angosta'];

function renderGaleria() {
  if (!mosaico) return;
  const previas = mosaico.children.length;

  mosaico.innerHTML = GALERIA.slice(0, fotosVisibles).map((f, i) => `
    <figure class="gal-item gal-${TAMANIOS[i % TAMANIOS.length]}"${i >= previas ? ' data-animate style="opacity:0;clip-path:inset(0 0 100% 0)"' : ''}>
      <button type="button" class="gal-btn" data-foto="${i}" aria-label="Ampliar: ${esc(f.texto)}">
        <img src="${f.src}" alt="${esc(f.texto)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async">
        <figcaption class="gal-cap"><span class="gal-eje">${esc(getEje(f.eje)?.nombre || '')}</span>${esc(f.texto)}</figcaption>
        <span class="gal-lupa" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg>
        </span>
      </button>
    </figure>`).join('');

  if (btnMasFotos) {
    btnMasFotos.hidden = fotosVisibles >= GALERIA.length;
    btnMasFotos.textContent = `Ver las ${GALERIA.length - fotosVisibles} fotos restantes`;
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initGaleria() {
  if (!mosaico) return;
  renderGaleria();

  btnMasFotos?.addEventListener('click', () => {
    fotosVisibles = GALERIA.length;
    renderGaleria();
    // Las fotos nuevas nacen ocultas: sin este barrido quedarían invisibles para siempre.
    revelarPendientes();
  });

  mosaico.addEventListener('click', e => {
    const btn = e.target.closest('[data-foto]');
    if (btn) abrirLightbox(Number(btn.dataset.foto), btn);
  });
}

/* ---------- lightbox ---------- */

const lightbox = document.getElementById('lightbox');
let fotoActual = 0;
let ultimoFocoLb = null;

function pintarFoto() {
  const f = GALERIA[fotoActual];
  if (!f) return;
  const img = document.getElementById('lbImg');
  img.src = f.src;
  img.alt = f.texto;
  img.width = f.w;
  img.height = f.h;
  document.getElementById('lbTexto').textContent = f.texto;
  document.getElementById('lbEje').textContent = getEje(f.eje)?.nombre || '';
  document.getElementById('lbCount').textContent = `${fotoActual + 1} / ${GALERIA.length}`;
}

function moverFoto(paso) {
  fotoActual = (fotoActual + paso + GALERIA.length) % GALERIA.length;
  pintarFoto();
}

function abrirLightbox(i, origen) {
  if (!lightbox) return;
  ultimoFocoLb = origen || document.activeElement;
  fotoActual = i;
  pintarFoto();
  lightbox.classList.add('open');
  lightbox.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('lbClose')?.focus();
}

function cerrarLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  ultimoFocoLb?.focus();
}

function initLightbox() {
  if (!lightbox) return;
  document.getElementById('lbClose')?.addEventListener('click', cerrarLightbox);
  document.getElementById('lbPrev')?.addEventListener('click', () => moverFoto(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => moverFoto(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) cerrarLightbox(); });
  lightbox.addEventListener('keydown', e => trapFocus(lightbox, e));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarLightbox();
    if (e.key === 'ArrowLeft') moverFoto(-1);
    if (e.key === 'ArrowRight') moverFoto(1);
  });
}

/* ---------- la red ---------- */

function initRed() {
  const stage = document.getElementById('redStage');
  const visual = document.getElementById('redVisual');
  const listaEl = document.getElementById('tramosLista');
  const cierre = document.getElementById('redCierre');
  if (!stage || !visual || !listaEl) return;

  listaEl.innerHTML = TRAMOS.map(t => `
    <li class="tramo-card"><b>${esc(t.nombre)}</b><span>${esc(t.texto)}</span></li>`).join('');

  const cards = [...listaEl.querySelectorAll('.tramo-card')];
  const tramos = TRAMOS.map((_, i) => visual.querySelector(`#tramo${i}`)).filter(Boolean);
  const cruce = visual.querySelector('#cruce');

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    cards.forEach(c => c.classList.add('is-on'));
    cierre?.classList.add('is-on');
    return;
  }

  const CORTES = [.1, .26, .42, .58, .74];
  let modoUna = false;
  let ultimo = -1;

  function setEstado(p) {
    if (modoUna) {
      let i = 0;
      for (let n = 0; n < CORTES.length; n++) if (p >= CORTES[n]) i = n;
      if (i !== ultimo) {
        ultimo = i;
        cards.forEach((c, n) => c.classList.toggle('is-on', n === i));
      }
    } else {
      cards.forEach((c, n) => c.classList.toggle('is-on', p >= CORTES[n]));
    }
    cierre?.classList.toggle('is-on', p >= .88);
  }

  function armar(triggerVars, una) {
    modoUna = una;
    ultimo = -1;
    const tl = gsap.timeline({
      scrollTrigger: Object.assign({
        trigger: stage, scrub: .65, invalidateOnRefresh: true,
        onUpdate: self => setEstado(self.progress),
      }, triggerVars),
    });
    tramos.forEach((el, i) => {
      tl.fromTo(el,
        { y: -170, opacity: 0, rotate: i % 2 ? 7 : -7 },
        { y: 0, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out' },
        i * .8);
    });
    if (cruce) {
      const largo = cruce.getTotalLength ? cruce.getTotalLength() : 900;
      gsap.set(cruce, { strokeDasharray: largo, strokeDashoffset: largo, opacity: 1 });
      tl.to(cruce, { strokeDashoffset: 0, duration: 1.4, ease: 'none' }, tramos.length * .8);
    }
    return tl;
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    armar({ start: 'top top', end: '+=280%', pin: true, anticipatePin: 1 }, false);
  });
  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    armar({ start: 'top top', end: 'bottom bottom' }, true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => stage.classList.remove('is-sticky-mobile');
  });
}

/* ---------- acciones territoriales ---------- */

const timelineEl = document.getElementById('timeline');
const filtrosEl = document.getElementById('filtrosEje');
const countEl = document.getElementById('filtroCount');
const btnVerMas = document.getElementById('verMas');

let filtroEje = 'todos';
let visibles = POR_PAGINA;

function accionesFiltradas() {
  const out = filtroEje === 'todos' ? [...ACCIONES] : ACCIONES.filter(a => a.eje === filtroEje);
  return out.sort((a, b) => b.orden - a.orden);
}

function renderAcciones() {
  if (!timelineEl) return;
  const todas = accionesFiltradas();
  const mostrar = todas.slice(0, visibles);

  timelineEl.innerHTML = mostrar.map(a => `
    <article class="hito">
      <button type="button" class="hito-card" data-accion="${a.id}">
        <span class="hito-meta">
          <span class="hito-eje">${esc(getEje(a.eje)?.nombre || '')}</span>
          ${a.fecha ? `<span class="hito-fecha">${esc(a.fecha)}</span>` : ''}
        </span>
        <h3>${esc(a.titulo)}</h3>
        <span class="hito-mas" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
        <p>${esc(a.resumen)}</p>
      </button>
    </article>`).join('');

  if (countEl) {
    const n = todas.length;
    countEl.innerHTML = n === 1 ? '<b>1</b> acción documentada' : `<b>${n}</b> acciones documentadas`;
  }
  if (btnVerMas) btnVerMas.hidden = todas.length <= visibles;

  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(timelineEl.querySelectorAll('.hito'),
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: .5, stagger: .05, ease: 'power2.out', overwrite: true });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initAcciones() {
  if (!timelineEl) return;

  if (filtrosEl) {
    filtrosEl.innerHTML = EJES.map(e =>
      `<button type="button" class="chip${e.id === 'todos' ? ' is-on' : ''}" data-eje="${e.id}" aria-pressed="${e.id === 'todos'}">${esc(e.nombre)}</button>`).join('');
    filtrosEl.addEventListener('click', ev => {
      const btn = ev.target.closest('[data-eje]');
      if (!btn) return;
      filtroEje = btn.dataset.eje;
      filtrosEl.querySelectorAll('.chip').forEach(c => {
        const on = c.dataset.eje === filtroEje;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      visibles = POR_PAGINA;
      renderAcciones();
    });
  }

  btnVerMas?.addEventListener('click', () => { visibles += POR_PAGINA; renderAcciones(); });

  timelineEl.addEventListener('click', ev => {
    const card = ev.target.closest('[data-accion]');
    if (card) abrirModal(card.dataset.accion, card);
  });

  renderAcciones();
}

/* ---------- modal ---------- */

const modal = document.getElementById('modalAccion');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalBody = document.getElementById('modalBody');
let ultimoFoco = null;

function abrirModal(id, origen) {
  const a = getAccion(id);
  if (!a || !modal || !modalBody) return;
  ultimoFoco = origen || document.activeElement;

  const titulo = document.getElementById('modalTitulo');
  if (titulo) titulo.textContent = a.titulo;

  modalBody.innerHTML = `
    ${a.img ? `<div class="md-media"><img src="${a.img.src}" alt="${esc(a.alt || '')}" width="${a.img.w}" height="${a.img.h}" decoding="async"></div>` : ''}
    <div class="md-body">
      <span class="hito-meta">
        <span class="hito-eje">${esc(getEje(a.eje)?.nombre || '')}</span>
        ${a.fecha ? `<span class="hito-fecha">${esc(a.fecha)}</span>` : ''}
      </span>
      <h2>${esc(a.titulo)}</h2>
      <p>${esc(a.texto)}</p>
      ${a.actores?.length ? `<div class="md-actores">${a.actores.map(x => `<span class="md-actor">${esc(x)}</span>`).join('')}</div>` : ''}
      <a class="btn btn-cta" href="${wsp(`Hola, leí sobre "${a.titulo}" en la web y quiero saber más.`)}" target="_blank" rel="noopener">Quiero saber más</a>
    </div>`;

  modal.classList.add('open');
  modalBackdrop?.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modalBackdrop?.classList.remove('open');
  modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modalBackdrop?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) cerrarModal(); });
  modal?.addEventListener('keydown', e => trapFocus(modal, e));
}

/* ---------- nav, footer, whatsapp ---------- */

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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

  const mq = window.matchMedia('(min-width: 769px)');
  const sync = () => { if (mq.matches) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener('change', sync);
  sync();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initFooter() {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
}

/* ---------- reveals ---------- */

let revelarPendientes = () => {};

function initReveals() {
  const items = [...document.querySelectorAll('[data-animate]')];
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    revelarPendientes = () => document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
    });
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });

  // Los nodos que se inyectan después (galería, listados) no los vio el observer
  // del arranque: hay que darlos de alta o quedan ocultos para siempre.
  revelarPendientes = () => {
    document.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
      if (items.includes(el)) return;
      items.push(el);
      io.observe(el);
    });
    queueSweep();
  };
}

/* ---------- movimiento ---------- */

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-bg img', { scale: 1.12, duration: 1.7, ease: 'power2.out' }, 0)
    .from('.hero-copy .eyebrow', { opacity: 0, x: -16, duration: .7 }, .1)
    .from('.hero-title .line-in', { yPercent: 108, duration: 1.05, stagger: .12, ease: 'power3.out' }, .2)
    .from('.hero-prod', { opacity: 0, y: 60, duration: 1.3 }, .35)
    .from('.hero-lead', { opacity: 0, y: 20, duration: .8 }, .7)
    .from('.hero-cta .btn', { opacity: 0, y: 18, duration: .6, stagger: .1 }, .85)
    .from('.hero-facts li', { opacity: 0, y: 16, duration: .6, stagger: .09 }, 1);
}

function initScrollFx() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;

  const path = document.querySelector('.sendero-path');
  if (path && path.getTotalLength) {
    const largo = path.getTotalLength();
    gsap.fromTo(path,
      { strokeDasharray: `0 ${largo}` },
      {
        strokeDasharray: `${largo} 0`, ease: 'none',
        scrollTrigger: { trigger: '.pasos', start: 'top 82%', end: 'bottom 60%', scrub: .5 },
      });
  }

  gsap.utils.toArray('.paso-n').forEach(el => {
    gsap.from(el, {
      scale: .5, opacity: 0, duration: .6, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  const seam = document.querySelector('.seam-node');
  if (seam) {
    gsap.from(seam, {
      scale: .3, opacity: 0, duration: .7, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.metodo', start: 'bottom 95%' },
    });
  }

  gsap.utils.toArray('.aporte').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 34, duration: .7, delay: i * .08, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  const foto = document.querySelector('.transparencia-foto img');
  if (foto) {
    gsap.to(foto, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.transparencia', start: 'top bottom', end: 'bottom top', scrub: .5 } });
  }
}

/* ---------- arranque ---------- */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initLineas();
initGaleria();
initLightbox();
initRed();
initAcciones();
initModal();
initNav();
initWspFloat();
initFooter();
initReveals();
initHero();
initScrollFx();
