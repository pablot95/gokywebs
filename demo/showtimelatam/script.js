const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WA = '5493564417625';
let LANG = 'es';
try { if (window.localStorage.getItem('st-lang') === 'en') LANG = 'en'; } catch (e) { LANG = 'es'; }

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const t = o => (o == null ? '' : typeof o === 'string' ? o : (o[LANG] ?? o.es ?? ''));
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const UI = {
  es: {
    comprar: 'Comprar entradas',
    agendar: 'Agendalo',
    avisar: 'Avisame las fechas',
    verIg: 'Ver en Instagram',
    verAgenda: 'Ver en la agenda',
    puntos: 'Puntos de venta',
    estado: { venta: 'Entradas a la venta', gira: 'En gira', pronto: 'Próximamente', realizado: 'Realizado' },
    todos: 'Todos',
    zonas: { ar: 'Argentina', bo: 'Bolivia', int: 'Giras internacionales' },
    vacio: 'No hay fechas con ese filtro por ahora. Probá con otro país.',
    vacioProd: 'No hay producciones con ese filtro.',
    agendado: 'Listo: el evento se descargó para tu calendario.',
    gracias: '¡Gracias! El envío de mensajes se activa al pasar la web a producción.',
    enviando: 'Enviando…',
    errVacio: 'Completá este campo.',
    errEmail: 'Revisá el email: falta algo.',
    errUrl: 'Pegá un link completo (https://…).',
    abierto: 'En horario',
    cerrado: 'Fuera de horario',
    escribinos: 'Escribinos por WhatsApp',
    formulario: 'Completar el formulario',
    mandanos: 'Qué conviene mandarnos',
    msgAviso: (pais, interes) => `Hola Showtime LATAM, quiero que me avisen cuando salgan las entradas en ${pais} (${interes}).`,
    msgFechas: titulo => `Hola Showtime LATAM, quiero que me avisen cuando salgan las fechas de ${titulo}.`,
    detalle: 'Ver detalle'
  },
  en: {
    comprar: 'Buy tickets',
    agendar: 'Add to calendar',
    avisar: 'Notify me of dates',
    verIg: 'View on Instagram',
    verAgenda: 'See in the calendar',
    puntos: 'Ticket outlets',
    estado: { venta: 'On sale', gira: 'On tour', pronto: 'Coming soon', realizado: 'Past show' },
    todos: 'All',
    zonas: { ar: 'Argentina', bo: 'Bolivia', int: 'International tours' },
    vacio: 'No dates with that filter yet. Try another country.',
    vacioProd: 'No productions with that filter.',
    agendado: 'Done: the event was downloaded for your calendar.',
    gracias: 'Thanks! Messages will be delivered once the site goes live.',
    enviando: 'Sending…',
    errVacio: 'Please fill in this field.',
    errEmail: 'Check the email: something is missing.',
    errUrl: 'Paste a full link (https://…).',
    abierto: 'Open now',
    cerrado: 'Closed now',
    escribinos: 'Message us on WhatsApp',
    formulario: 'Fill in the form',
    mandanos: 'What to send us',
    msgAviso: (pais, interes) => `Hello Showtime LATAM, please let me know when tickets go on sale in ${pais} (${interes}).`,
    msgFechas: titulo => `Hello Showtime LATAM, please let me know when the dates for ${titulo} are announced.`,
    detalle: 'See details'
  }
};
const ui = k => UI[LANG][k] ?? UI.es[k];

const ICO = {
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
  cal: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M10 16h4"/><path d="M12 14v4"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  brief: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>'
};
const ico = n => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[n]}</svg>`;
const WA_ICO = '<svg class="ico-wa" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const EVENTOS = [
  {
    id: 'tierra-adentro-2026', estado: 'venta', anio: '2026', zona: 'ar', foto: 'images/teatro-clasico.webp',
    fecha: '2026-11-06T21:00:00-03:00', grande: '06', chico: { es: 'Nov 2026 · 21 h', en: 'Nov 2026 · 9 pm' },
    titulo: { es: 'Tierra Adentro 2026 · Primera Gala', en: 'Tierra Adentro 2026 · Opening Gala' },
    artista: { es: 'Leandro Lovato · show principal', en: 'Leandro Lovato · headliner' },
    detalle: { es: '«Latidos de mi tierra»: el show de Leandro Lovato con Academia Martín Fierro, Santi Pace y Sin Orilla. Una nueva forma de vivir nuestras raíces.', en: '"Latidos de mi tierra": Leandro Lovato\'s show with Academia Martín Fierro, Santi Pace and Sin Orilla. A new way to live our roots.' },
    recinto: 'Teatro Ideal', ciudad: { es: 'Venado Tuerto, Santa Fe', en: 'Venado Tuerto, Santa Fe' }, pais: { es: 'Argentina', en: 'Argentina' },
    precio: { es: 'Segunda tanda: $30.000 · En puerta: $35.000', en: 'Second release: ARS 30,000 · At the door: ARS 35,000' },
    nota: { es: 'Primera tanda agotada', en: 'First release sold out' },
    puntos: { es: 'Boletería del Teatro Ideal (lunes a viernes de 9 a 12 h y sábados de 9:30 a 12 h), Academia Martín Fierro, Santi Pace y Alpogo. Cantidad limitada.', en: 'Teatro Ideal box office (Mon–Fri 9 am–12 pm, Sat 9:30 am–12 pm), Academia Martín Fierro, Santi Pace and Alpogo. Limited availability.' },
    rol: { es: 'Producción nacional', en: 'National production' },
    entradas: 'https://alpogo.com/', ig: 'https://www.instagram.com/teatro_ideal_/p/Dexh4rrB6xn/'
  },
  {
    id: 'juanes-tour-2026', estado: 'gira', anio: '2026', zona: 'int', foto: 'images/backstage.webp',
    grande: '2026', chico: { es: 'Tour', en: 'Tour' },
    titulo: { es: 'Juanes · Tour 2026', en: 'Juanes · 2026 Tour' },
    artista: { es: 'Gira internacional junto a Showtime LATAM', en: 'International tour with Showtime LATAM' },
    detalle: { es: 'Seguimos en gira junto a Juanes: el Tour 2026 ya está en marcha y pronto compartimos las nuevas fechas.', en: 'We are back on the road with Juanes: the 2026 Tour is under way and new dates are coming soon.' },
    recinto: { es: 'Recintos a anunciar', en: 'Venues to be announced' }, ciudad: { es: 'Fechas a anunciar', en: 'Dates to be announced' }, pais: { es: 'Gira internacional', en: 'International tour' },
    rol: { es: 'Gira internacional', en: 'International tour' },
    ig: 'https://www.instagram.com/showtimelatam/reel/DdEiP4IAIa0/'
  },
  {
    id: 'santa-cruz-2027', estado: 'pronto', anio: '2027', zona: 'bo', foto: 'images/festival-atardecer.webp',
    grande: '2027', chico: { es: 'Verano', en: 'Summer' },
    titulo: { es: 'Santa Cruz de la Sierra · Verano 2027', en: 'Santa Cruz de la Sierra · Summer 2027' },
    artista: { es: 'Artistas internacionales a anunciar', en: 'International artists to be announced' },
    detalle: { es: 'Una nueva propuesta y un lugar que promete convertirse en escenario de grandes espectáculos con artistas internacionales de renombre.', en: 'A brand-new proposal and a place set to become the stage for major shows with renowned international artists.' },
    recinto: { es: 'Escenario a anunciar', en: 'Venue to be announced' }, ciudad: { es: 'Santa Cruz de la Sierra', en: 'Santa Cruz de la Sierra' }, pais: { es: 'Bolivia', en: 'Bolivia' },
    rol: { es: 'Nuevo proyecto', en: 'New project' },
    ig: 'https://www.instagram.com/showtimelatam/reel/DezfUFRgcNK/'
  },
  {
    id: 'chayanne-chicago', estado: 'realizado', anio: '2026', zona: 'int', foto: 'images/luces-rig.webp',
    grande: '2026', chico: { es: 'Chicago', en: 'Chicago' },
    titulo: { es: 'Chayanne · Bailemos otra vez', en: 'Chayanne · Bailemos otra vez' },
    artista: { es: 'Showtime LATAM × Chayanne', en: 'Showtime LATAM × Chayanne' },
    detalle: { es: 'Detrás de cada gran show hay horas de trabajo, pasión, compromiso y un enorme equipo. Gracias a nuestra crew y a la producción que hicieron posible la noche.', en: 'Behind every big show there are hours of work, passion, commitment and a huge team. Thanks to our crew and production for making the night happen.' },
    recinto: 'Allstate Arena', ciudad: { es: 'Chicago', en: 'Chicago' }, pais: { es: 'Estados Unidos', en: 'United States' },
    rol: { es: 'Show internacional', en: 'International show' },
    ig: 'https://www.instagram.com/showtimelatam/reel/Dc4HMPDRuW9/'
  },
  {
    id: 'juanes-tour-2025', estado: 'realizado', anio: '2025', zona: 'int', foto: 'images/escenario-arena.webp',
    grande: '2025', chico: { es: 'Tour', en: 'Tour' },
    titulo: { es: 'Juanes · Tour 2025', en: 'Juanes · 2025 Tour' },
    artista: { es: 'Una gira, cuatro países', en: 'One tour, four countries' },
    detalle: { es: 'Una gira. Cuatro países. Grandes escenarios. Así vivimos el Tour 2025 de Juanes junto a Showtime LATAM.', en: 'One tour. Four countries. Big stages. That is how we lived the Juanes 2025 Tour with Showtime LATAM.' },
    recinto: { es: 'Grandes escenarios', en: 'Big stages' }, ciudad: { es: 'México · Estados Unidos · Uruguay · Colombia', en: 'Mexico · United States · Uruguay · Colombia' }, pais: { es: 'Gira internacional', en: 'International tour' },
    rol: { es: 'Gira internacional', en: 'International tour' },
    ig: 'https://www.instagram.com/showtimelatam/reel/DdEiP4IAIa0/'
  }
];
const evento = id => EVENTOS.find(e => e.id === id);

const NOVEDADES = [
  { fecha: [2026, 10, 22], titulo: { es: 'Santa Cruz de la Sierra, nuestro próximo escenario', en: 'Santa Cruz de la Sierra, our next stage' }, texto: { es: 'Verano 2027 en Bolivia: una nueva propuesta con artistas internacionales de renombre. Lo mejor está por venir.', en: 'Summer 2027 in Bolivia: a new proposal with renowned international artists. The best is yet to come.' }, link: 'https://www.instagram.com/showtimelatam/reel/DezfUFRgcNK/' },
  { fecha: [2026, 10, 21], titulo: { es: 'Tierra Adentro 2026: primera tanda agotada', en: 'Tierra Adentro 2026: first release sold out' }, texto: { es: 'Ya está a la venta la segunda tanda para la Primera Gala con Leandro Lovato en el Teatro Ideal: $30.000.', en: 'Second-release tickets for the Opening Gala with Leandro Lovato at Teatro Ideal are on sale: ARS 30,000.' }, link: 'https://www.instagram.com/teatro_ideal_/p/Dexh4rrB6xn/' },
  { fecha: [2026, 9, 9], titulo: { es: 'Juanes: una gira, cuatro países', en: 'Juanes: one tour, four countries' }, texto: { es: 'Así vivimos el Tour 2025 en México, Estados Unidos, Uruguay y Colombia. El Tour 2026 ya está en marcha.', en: 'Looking back at the 2025 Tour across Mexico, the United States, Uruguay and Colombia. The 2026 Tour is already under way.' }, link: 'https://www.instagram.com/showtimelatam/reel/DdEiP4IAIa0/' },
  { fecha: [2026, 9, 4], titulo: { es: 'Showtime LATAM × Chayanne en Chicago', en: 'Showtime LATAM × Chayanne in Chicago' }, texto: { es: 'Gracias a la crew y a cada persona que hizo posible la noche en el Allstate Arena.', en: 'Thanks to the crew and everyone who made the night at the Allstate Arena possible.' }, link: 'https://www.instagram.com/showtimelatam/reel/Dc4HMPDRuW9/' }
];

const PAISES = [
  { id: 'ar', nombre: { es: 'Argentina', en: 'Argentina' }, rol: { es: 'Base de producción', en: 'Production base' }, txt: { es: ['Producción, booking y venta de entradas con plataformas oficiales y boleterías.', 'En noviembre, Tierra Adentro 2026 en el Teatro Ideal de Venado Tuerto.'], en: ['Production, booking and ticketing through official platforms and box offices.', 'In November, Tierra Adentro 2026 at Teatro Ideal in Venado Tuerto.'] } },
  { id: 'bo', nombre: { es: 'Bolivia', en: 'Bolivia' }, rol: { es: 'Nuevo escenario', en: 'New stage' }, txt: { es: ['Santa Cruz de la Sierra se prepara para el verano 2027.', 'Una nueva propuesta con artistas internacionales de renombre.'], en: ['Santa Cruz de la Sierra is getting ready for summer 2027.', 'A new proposal with renowned international artists.'] } },
  { id: 'pe', nombre: { es: 'Perú', en: 'Peru' }, rol: { es: 'Contratación y alianzas', en: 'Booking & partnerships' }, txt: { es: ['Contratación de artistas, coproducciones y alianzas con productores y recintos locales.'], en: ['Artist booking, co-productions and partnerships with local producers and venues.'] } },
  { id: 'co', nombre: { es: 'Colombia', en: 'Colombia' }, rol: { es: 'Giras internacionales', en: 'International tours' }, txt: { es: ['Parte del Tour 2025 de Juanes junto a Showtime LATAM.', 'Contratación de artistas y coproducciones.'], en: ['Part of the Juanes 2025 Tour with Showtime LATAM.', 'Artist booking and co-productions.'] } },
  { id: 'py', nombre: { es: 'Paraguay', en: 'Paraguay' }, rol: { es: 'Booking y eventos', en: 'Booking & events' }, txt: { es: ['Booking de artistas y eventos corporativos con aliados locales.'], en: ['Artist booking and corporate events with local partners.'] } },
  { id: 'uy', nombre: { es: 'Uruguay', en: 'Uruguay' }, rol: { es: 'Giras internacionales', en: 'International tours' }, txt: { es: ['Parte del Tour 2025 de Juanes junto a Showtime LATAM.', 'Producción y promoción de shows.'], en: ['Part of the Juanes 2025 Tour with Showtime LATAM.', 'Show production and promotion.'] } },
  { id: 'int', nombre: { es: 'México y EE. UU.', en: 'Mexico & U.S.' }, rol: { es: 'Mercados internacionales', en: 'International markets' }, txt: { es: ['Tour 2025 de Juanes en México y Estados Unidos.', 'Showtime LATAM × Chayanne en el Allstate Arena de Chicago.'], en: ['Juanes 2025 Tour in Mexico and the United States.', 'Showtime LATAM × Chayanne at the Allstate Arena in Chicago.'] } }
];

const GUIA = [
  {
    id: 'contratar', icon: 'mic', tipo: 'contratacion',
    op: { es: 'Contratar un artista para mi evento', en: 'Book an artist for my event' },
    rot: { es: 'Booking y contratación', en: 'Booking & hiring' },
    tit: { es: 'Te conectamos con el artista indicado', en: 'We connect you with the right artist' },
    txt: { es: 'Consultamos disponibilidad, armamos la oferta y coordinamos la contratación con el artista o su representación.', en: 'We check availability, put the offer together and handle the booking with the artist or their management.' },
    lista: { es: ['Fecha estimada y ciudad', 'Tipo de evento y capacidad del lugar', 'Artista o estilo que buscás', 'Presupuesto aproximado'], en: ['Estimated date and city', 'Type of event and venue capacity', 'Artist or style you are looking for', 'Approximate budget'] },
    msg: { es: 'Hola Showtime LATAM, quiero contratar un artista para mi evento.', en: 'Hello Showtime LATAM, I would like to book an artist for my event.' }
  },
  {
    id: 'producir', icon: 'globe', tipo: 'contratacion',
    op: { es: 'Producir un show o una gira', en: 'Produce a show or a tour' },
    rot: { es: 'Producción y giras', en: 'Production & tours' },
    tit: { es: 'Armamos el show de punta a punta', en: 'We build the show end to end' },
    txt: { es: 'Producción técnica, promoción, venta de entradas y logística, en un país o en varios, con producción completa o en coproducción.', en: 'Technical production, promotion, ticketing and logistics, in one country or several, fully produced or co-produced.' },
    lista: { es: ['Artista y fechas tentativas', 'Ciudades o países de la gira', 'Recintos que tenés en mente', 'Si buscás producción completa o coproducción'], en: ['Artist and tentative dates', 'Tour cities or countries', 'Venues you have in mind', 'Full production or co-production'] },
    msg: { es: 'Hola Showtime LATAM, quiero producir un show o una gira.', en: 'Hello Showtime LATAM, I would like to produce a show or a tour.' }
  },
  {
    id: 'proponer', icon: 'star', tipo: 'propuesta',
    op: { es: 'Proponer un artista o un proyecto', en: 'Pitch an artist or a project' },
    rot: { es: 'Propuestas artísticas', en: 'Artist proposals' },
    tit: { es: 'Contanos tu propuesta', en: 'Tell us about your proposal' },
    txt: { es: 'Evaluamos cada propuesta y, si encaja, armamos un plan de booking o de producción.', en: 'We review every proposal and, if it fits, we put together a booking or production plan.' },
    lista: { es: ['Link a tu música o tus videos', 'Público y ciudades donde ya te presentaste', 'Formato y duración del show', 'Redes del artista'], en: ['Link to your music or videos', 'Audience and cities where you have performed', 'Show format and length', 'Artist social media'] },
    msg: { es: 'Hola Showtime LATAM, quiero proponerles un artista o un proyecto.', en: 'Hello Showtime LATAM, I would like to pitch an artist or a project.' }
  },
  {
    id: 'aliarse', icon: 'brief', tipo: 'alianza',
    op: { es: 'Sumar a mi empresa como aliada o sponsor', en: 'Join as a partner or sponsor' },
    rot: { es: 'Alianzas empresariales', en: 'Business partnerships' },
    tit: { es: 'Construyamos una alianza', en: 'Let us build a partnership' },
    txt: { es: 'Patrocinios, recintos, venta de entradas o desarrollo de negocios entre mercados.', en: 'Sponsorships, venues, ticketing or business development between markets.' },
    lista: { es: ['Tu empresa y en qué país opera', 'Tipo de alianza que buscás', 'Públicos o eventos de interés', 'Un contacto comercial'], en: ['Your company and where it operates', 'Type of partnership you are after', 'Audiences or events of interest', 'A business contact'] },
    msg: { es: 'Hola Showtime LATAM, quiero sumar a mi empresa como aliada o sponsor.', en: 'Hello Showtime LATAM, I would like my company to join as a partner or sponsor.' }
  }
];

const OFICINAS = [
  { pais: { es: 'Argentina', en: 'Argentina' }, ciudad: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires' },
  { pais: { es: 'Uruguay', en: 'Uruguay' }, ciudad: 'Montevideo', tz: 'America/Montevideo' },
  { pais: { es: 'Paraguay', en: 'Paraguay' }, ciudad: 'Asunción', tz: 'America/Asuncion' },
  { pais: { es: 'Bolivia', en: 'Bolivia' }, ciudad: 'La Paz', tz: 'America/La_Paz' },
  { pais: { es: 'Perú', en: 'Peru' }, ciudad: 'Lima', tz: 'America/Lima' },
  { pais: { es: 'Colombia', en: 'Colombia' }, ciudad: 'Bogotá', tz: 'America/Bogota' }
];

const anim = (on, tipo) => {
  if (!on) return '';
  const st = { subir: 'opacity:0;transform:translateY(36px)', izq: 'opacity:0;transform:translateX(-40px)', der: 'opacity:0;transform:translateX(40px)' }[tipo];
  return ` data-animate="${tipo}" style="${st}"`;
};
const fechaNovedad = f => new Date(f[0], f[1] - 1, f[2]).toLocaleDateString(LANG === 'en' ? 'en-US' : 'es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
const donde = ev => `${esc(t(ev.recinto))} · ${esc(t(ev.ciudad))}${t(ev.pais) && !t(ev.pais).startsWith('Gira') && !t(ev.pais).startsWith('International') ? ', ' + esc(t(ev.pais)) : ''}`;

function accionesEvento(ev, cls = '') {
  if (ev.estado === 'venta') {
    return `<a class="btn btn--negro ${cls}" href="${ev.entradas}" target="_blank" rel="noopener">${ico('ticket')}<span>${esc(ui('comprar'))}</span></a>`
      + `<button type="button" class="btn btn--linea ${cls}" data-ics="${ev.id}">${ico('cal')}<span>${esc(ui('agendar'))}</span></button>`;
  }
  if (ev.estado === 'realizado') {
    return `<a class="btn btn--linea ${cls}" href="${ev.ig}" target="_blank" rel="noopener"><span>${esc(ui('verIg'))}</span>${ico('ext')}</a>`;
  }
  return `<a class="btn btn--negro ${cls}" href="${waLink(ui('msgFechas')(t(ev.titulo)))}" target="_blank" rel="noopener">${WA_ICO}<span>${esc(ui('avisar'))}</span></a>`
    + `<a class="btn btn--linea ${cls}" href="${ev.ig}" target="_blank" rel="noopener"><span>${esc(ui('verIg'))}</span>${ico('ext')}</a>`;
}

function renderDestacado(an) {
  const cont = document.getElementById('eventoDestacado');
  if (!cont) return;
  const ev = EVENTOS.find(e => e.estado === 'venta');
  if (!ev) return;
  cont.innerHTML = `<article class="destacado__card"${anim(an, 'subir')}>
    <figure class="destacado__foto"><img src="${ev.foto}" alt="${esc(t(ev.recinto))}" width="1254" height="1254"><span class="fecha-bloque"><b>${ev.grande}</b><span>${esc(t(ev.chico).split(' · ')[0])}</span></span></figure>
    <div class="destacado__txt">
      <span class="badges"><span class="badge badge--venta">${esc(ui('estado')[ev.estado])}</span><span class="badge badge--realizado">${esc(t(ev.nota))}</span></span>
      <h3>${esc(t(ev.titulo))}</h3>
      <p>${esc(t(ev.detalle))}</p>
      <ul class="datos">
        <li>${ico('pin')}<span>${donde(ev)}</span></li>
        <li>${ico('clock')}<span>${esc(t(ev.chico))}</span></li>
        <li>${ico('ticket')}<span>${esc(t(ev.precio))}</span></li>
      </ul>
      <div class="acciones">${accionesEvento(ev, 'btn--sm')}</div>
    </div>
  </article>`;
}

function renderNovedadesLista(an) {
  const cont = document.getElementById('novedadesLista');
  if (!cont) return;
  cont.innerHTML = NOVEDADES.map(n => `<li${anim(an, 'subir')}><a href="${n.link}" target="_blank" rel="noopener">
    <span class="nitem__fecha">${esc(fechaNovedad(n.fecha))}</span>
    <span class="nitem__tit">${esc(t(n.titulo))}</span>
    <span class="nitem__txt">${esc(t(n.texto))}</span>
    ${ico('ext')}
  </a></li>`).join('');
}

function renderNovedadesCards(an) {
  const cont = document.getElementById('novedadesCards');
  if (!cont) return;
  cont.innerHTML = NOVEDADES.map(n => `<div${anim(an, 'subir')}><a class="ncard" href="${n.link}" target="_blank" rel="noopener">
    <span class="nitem__fecha">${esc(fechaNovedad(n.fecha))}</span>
    <span class="nitem__tit">${esc(t(n.titulo))}</span>
    <span class="nitem__txt">${esc(t(n.texto))}</span>
    <span class="ncard__ir">${esc(ui('verIg'))}${ico('ext')}</span>
  </a></div>`).join('');
}

function renderBoard(an) {
  const cont = document.getElementById('board');
  if (!cont) return;
  cont.innerHTML = EVENTOS.filter(e => e.estado !== 'realizado').map(ev => `<li class="board__fila"${anim(an, 'izq')}>
    <span class="board__cuando"><span class="board__grande">${ev.grande}</span><span class="board__chico">${esc(t(ev.chico))}</span></span>
    <span class="board__que"><span class="board__tit">${esc(t(ev.titulo))}</span><span class="board__donde">${donde(ev)}</span></span>
    <span class="badge badge--${ev.estado}">${esc(ui('estado')[ev.estado])}</span>
    <span class="board__accion">${ev.estado === 'venta'
      ? `<a class="btn btn--negro btn--sm" href="${ev.entradas}" target="_blank" rel="noopener">${ico('ticket')}<span>${esc(ui('comprar'))}</span></a>`
      : `<a class="btn btn--linea btn--sm" href="${waLink(ui('msgFechas')(t(ev.titulo)))}" target="_blank" rel="noopener">${WA_ICO}<span>${esc(ui('avisar'))}</span></a>`}</span>
  </li>`).join('');
}

const pcardInner = ev => `<span class="pcard__foto"><img src="${ev.foto}" alt="${esc(t(ev.titulo))}" width="${ev.foto.includes('arena') ? 900 : ev.foto.includes('festival') ? 1600 : 1254}" height="${ev.foto.includes('arena') ? 1600 : ev.foto.includes('festival') ? 900 : 1254}"></span>
  <span class="pcard__txt"><span class="pcard__rol">${esc(t(ev.rol))} · ${esc(ev.anio)}</span><span class="pcard__tit">${esc(t(ev.titulo))}</span><span class="pcard__donde">${esc(t(ev.ciudad))}</span></span>`;

function renderBento(an) {
  const cont = document.getElementById('bento');
  if (!cont) return;
  cont.innerHTML = ['juanes-tour-2025', 'santa-cruz-2027', 'tierra-adentro-2026', 'chayanne-chicago'].map(evento).filter(Boolean)
    .map(ev => `<div class="bento__item"${anim(an, 'subir')}><a class="pcard" href="artistas.html">${pcardInner(ev)}</a></div>`).join('');
}

let filtroProd = 'todas';
function renderProducciones(an) {
  const cont = document.getElementById('prodGrid');
  if (!cont) return;
  const orden = ['juanes-tour-2025', 'chayanne-chicago', 'tierra-adentro-2026', 'juanes-tour-2026', 'santa-cruz-2027'].map(evento).filter(Boolean);
  const lista = orden.filter(ev => filtroProd === 'todas' || (filtroProd === 'realizadas' ? ev.estado === 'realizado' : ev.estado !== 'realizado'));
  cont.classList.toggle('pgrid--todas', filtroProd === 'todas');
  cont.innerHTML = lista.length
    ? lista.map(ev => `<div class="pgrid__item"${anim(an, 'subir')}><button type="button" class="pcard" data-prod="${ev.id}" aria-label="${esc(ui('detalle'))}: ${esc(t(ev.titulo))}">${pcardInner(ev)}</button></div>`).join('')
    : `<p class="pgrid__vacio">${esc(ui('vacioProd'))}</p>`;
}

let estadoAgenda = 'proximas';
let zonaAgenda = 'todas';
function renderAgendaChips() {
  const cont = document.getElementById('agendaPaises');
  if (!cont) return;
  const zonas = [...new Set(EVENTOS.filter(e => (estadoAgenda === 'realizadas') === (e.estado === 'realizado')).map(e => e.zona))];
  if (zonaAgenda !== 'todas' && !zonas.includes(zonaAgenda)) zonaAgenda = 'todas';
  cont.innerHTML = [['todas', ui('todos')], ...zonas.map(z => [z, ui('zonas')[z]])]
    .map(([z, l]) => `<button type="button" class="chip" data-zona="${z}" aria-pressed="${z === zonaAgenda}">${esc(l)}</button>`).join('');
}
function renderAgenda(an) {
  const cont = document.getElementById('agendaLista');
  if (!cont) return;
  renderAgendaChips();
  const lista = EVENTOS.filter(e => ((estadoAgenda === 'realizadas') === (e.estado === 'realizado')) && (zonaAgenda === 'todas' || e.zona === zonaAgenda));
  cont.innerHTML = lista.length ? lista.map(ev => `<li class="evento"${anim(an, 'subir')}>
    <div class="evento__fecha"><span class="evento__grande">${ev.grande}</span><span class="evento__chico">${esc(t(ev.chico))}</span></div>
    <figure class="evento__foto"><img src="${ev.foto}" alt="${esc(t(ev.titulo))}" width="1254" height="1254"></figure>
    <div class="evento__info">
      <span><span class="badge badge--${ev.estado}">${esc(ui('estado')[ev.estado])}</span></span>
      <h3>${esc(t(ev.titulo))}</h3>
      <p class="evento__artista">${esc(t(ev.artista))}</p>
      <ul class="datos">
        <li>${ico('pin')}<span>${donde(ev)}</span></li>
        ${ev.precio ? `<li>${ico('ticket')}<span>${esc(t(ev.precio))} · ${esc(t(ev.nota))}</span></li>` : ''}
      </ul>
      ${ev.puntos ? `<details class="evento__mas"><summary>${esc(ui('puntos'))}</summary><p>${esc(t(ev.puntos))}</p></details>` : `<p class="evento__desc">${esc(t(ev.detalle))}</p>`}
    </div>
    <div class="evento__acciones">${accionesEvento(ev, 'btn--sm')}</div>
  </li>`).join('') : `<li class="alista__vacio">${esc(ui('vacio'))}</li>`;
}

function initAgendaFiltros() {
  const tabs = document.getElementById('agendaTabs');
  const chips = document.getElementById('agendaPaises');
  const lista = document.getElementById('agendaLista');
  if (!tabs || !chips || !lista) return;
  const btns = [...tabs.querySelectorAll('.tab')];
  const elegir = b => {
    btns.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
    estadoAgenda = b.dataset.estado;
    renderAgenda(true);
    revelarNuevos(lista);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => elegir(b));
    b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
      n.focus();
      elegir(n);
    });
  });
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-zona]');
    if (!b) return;
    zonaAgenda = b.dataset.zona;
    renderAgenda(true);
    revelarNuevos(lista);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

function initProdFiltros() {
  const cont = document.getElementById('prodFiltros');
  const grid = document.getElementById('prodGrid');
  if (!cont || !grid) return;
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-filtro]');
    if (!b) return;
    filtroProd = b.dataset.filtro;
    cont.querySelectorAll('[data-filtro]').forEach(x => x.setAttribute('aria-pressed', x === b));
    renderProducciones(true);
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

let paisActivo = 'ar';
function renderPresencia() {
  const tabs = document.getElementById('presenciaTabs');
  const panel = document.getElementById('presenciaPanel');
  if (!tabs || !panel) return;
  tabs.innerHTML = PAISES.map(p => `<button type="button" class="ptab" role="tab" id="ptab-${p.id}" aria-controls="presenciaPanel" aria-selected="${p.id === paisActivo}" tabindex="${p.id === paisActivo ? 0 : -1}" data-pais="${p.id}"><span class="ptab__nodo" aria-hidden="true"></span><span>${esc(t(p.nombre))}</span></button>`).join('');
  const p = PAISES.find(x => x.id === paisActivo) || PAISES[0];
  panel.setAttribute('aria-labelledby', `ptab-${p.id}`);
  panel.innerHTML = `<div><p class="ppanel__pais">${esc(t(p.nombre))}</p><p class="ppanel__rol">${esc(t(p.rol))}</p></div>
    <div class="ppanel__txt">${(p.txt[LANG] || p.txt.es).map(x => `<p>${esc(x)}</p>`).join('')}</div>`;
}
function initPresencia() {
  const tabs = document.getElementById('presenciaTabs');
  const panel = document.getElementById('presenciaPanel');
  if (!tabs || !panel) return;
  const elegir = id => {
    paisActivo = id;
    renderPresencia();
    panel.classList.remove('cambia');
    void panel.offsetWidth;
    panel.classList.add('cambia');
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-pais]');
    if (b) elegir(b.dataset.pais);
  });
  tabs.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = PAISES.findIndex(p => p.id === paisActivo);
    const n = PAISES[(i + (e.key === 'ArrowRight' ? 1 : PAISES.length - 1)) % PAISES.length];
    elegir(n.id);
    document.getElementById(`ptab-${n.id}`)?.focus();
  });
}

let guiaActiva = 'contratar';
function renderGuia() {
  const ops = document.getElementById('guiaOpciones');
  const res = document.getElementById('guiaResultado');
  if (!ops || !res) return;
  ops.innerHTML = GUIA.map(g => `<button type="button" class="gopcion" role="radio" aria-checked="${g.id === guiaActiva}" tabindex="${g.id === guiaActiva ? 0 : -1}" data-guia="${g.id}">${ico(g.icon)}<span>${esc(t(g.op))}</span></button>`).join('');
  const g = GUIA.find(x => x.id === guiaActiva) || GUIA[0];
  res.innerHTML = `<p class="gres__rot">${esc(t(g.rot))}</p>
    <h3 class="gres__tit">${esc(t(g.tit))}</h3>
    <p class="gres__txt">${esc(t(g.txt))}</p>
    <p class="gres__rot gres__lista-tit">${esc(ui('mandanos'))}</p>
    <ul class="check gres__lista">${(g.lista[LANG] || g.lista.es).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="gres__ctas">
      <a class="btn btn--negro" href="${waLink(t(g.msg))}" target="_blank" rel="noopener">${WA_ICO}<span>${esc(ui('escribinos'))}</span></a>
      <a class="btn btn--linea" href="contacto.html?tipo=${g.tipo}"><span>${esc(ui('formulario'))}</span>${ico('arrow')}</a>
    </div>`;
}
function initGuia() {
  const ops = document.getElementById('guiaOpciones');
  const res = document.getElementById('guiaResultado');
  if (!ops || !res) return;
  const elegir = id => {
    guiaActiva = id;
    renderGuia();
    res.classList.remove('cambia');
    void res.offsetWidth;
    res.classList.add('cambia');
  };
  ops.addEventListener('click', e => {
    const b = e.target.closest('[data-guia]');
    if (b) elegir(b.dataset.guia);
  });
  ops.addEventListener('keydown', e => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const i = GUIA.findIndex(g => g.id === guiaActiva);
    const n = GUIA[(i + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : GUIA.length - 1)) % GUIA.length];
    elegir(n.id);
    ops.querySelector(`[data-guia="${n.id}"]`)?.focus();
  });
}

function horaEn(tz) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' }).formatToParts(new Date());
  const g = type => parts.find(p => p.type === type)?.value ?? '';
  return { h: parseInt(g('hour'), 10) % 24, m: g('minute'), d: g('weekday') };
}
function renderRelojes() {
  const cont = document.getElementById('relojes');
  if (!cont) return;
  cont.innerHTML = OFICINAS.map(o => {
    const { h, m, d } = horaEn(o.tz);
    const abierto = !['Sat', 'Sun'].includes(d) && h >= 9 && h < 18;
    return `<li><span class="reloj__pais">${esc(t(o.pais))}<span class="reloj__ciudad">${esc(o.ciudad)}</span></span>
      <span class="reloj__hora">${String(h).padStart(2, '0')}:${esc(m)}</span>
      <span class="reloj__estado${abierto ? ' is-abierto' : ''}">${esc(ui(abierto ? 'abierto' : 'cerrado'))}</span></li>`;
  }).join('');
}
function initRelojes() {
  if (!document.getElementById('relojes')) return;
  window.setInterval(renderRelojes, 30000);
}

function descargarIcs(ev) {
  if (!ev?.fecha) return;
  const ini = new Date(ev.fecha);
  const fin = new Date(ini.getTime() + 3 * 3600e3);
  const f = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const e = s => String(s).replace(/([,;\\])/g, '\\$1');
  const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Showtime LATAM//Agenda//ES', 'BEGIN:VEVENT', `UID:${ev.id}@showtimelatam`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(ini)}`, `DTEND:${f(fin)}`, `SUMMARY:${e(t(ev.titulo))}`, `LOCATION:${e(`${t(ev.recinto)}, ${t(ev.ciudad)}, ${t(ev.pais)}`)}`, `URL:${ev.entradas || ev.ig}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new window.Blob([txt], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ev.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  showToast(ui('agendado'));
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-ics]');
  if (b) descargarIcs(evento(b.dataset.ics));
});

let modalUltimoFoco = null;
function abrirModal(ev) {
  const modal = document.getElementById('prodModal');
  const cuerpo = document.getElementById('prodModalCuerpo');
  if (!modal || !cuerpo || !ev) return;
  cuerpo.innerHTML = `<div class="mprod">
    <figure class="mprod__foto"><img src="${ev.foto}" alt="${esc(t(ev.titulo))}" width="1254" height="1254"></figure>
    <div class="mprod__txt">
      <span><span class="badge badge--${ev.estado}">${esc(ui('estado')[ev.estado])}</span></span>
      <h3>${esc(t(ev.titulo))}</h3>
      <p>${esc(t(ev.detalle))}</p>
      <ul class="datos">
        <li>${ico('pin')}<span>${donde(ev)}</span></li>
        <li>${ico('clock')}<span>${esc(ev.grande)} · ${esc(t(ev.chico))}</span></li>
        ${ev.precio ? `<li>${ico('ticket')}<span>${esc(t(ev.precio))}</span></li>` : ''}
      </ul>
      <div class="acciones">${ev.estado === 'venta' ? `<a class="btn btn--negro btn--sm" href="agenda.html"><span>${esc(ui('verAgenda'))}</span>${ico('arrow')}</a>` : ''}<a class="btn btn--linea btn--sm" href="${ev.ig}" target="_blank" rel="noopener"><span>${esc(ui('verIg'))}</span>${ico('ext')}</a></div>
    </div>
  </div>`;
  modalUltimoFoco = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  modal.querySelector('.modal__caja')?.focus();
}
function cerrarModal() {
  const modal = document.getElementById('prodModal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  modalUltimoFoco?.focus?.();
}
function initModal() {
  const modal = document.getElementById('prodModal');
  const grid = document.getElementById('prodGrid');
  if (!modal || !grid) return;
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-prod]');
    if (b) abrirModal(evento(b.dataset.prod));
  });
  modal.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { cerrarModal(); return; }
    if (e.key !== 'Tab') return;
    const f = [...modal.querySelectorAll('a[href], button:not([disabled])')].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === modal.querySelector('.modal__caja'))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

function renderDinamico(an) {
  renderDestacado(an);
  renderNovedadesLista(an);
  renderNovedadesCards(an);
  renderBoard(an);
  renderBento(an);
  renderProducciones(an);
  renderAgenda(an);
  renderPresencia();
  renderGuia();
  renderRelojes();
}

const ORIGINAL = new WeakMap();
const I18N_ATTRS = ['placeholder', 'aria-label', 'alt', 'href'];
let tituloEs = document.title;
function aplicarIdiomaEstatico(lang) {
  document.documentElement.lang = lang === 'en' ? 'en' : 'es-AR';
  document.querySelectorAll('[data-en]').forEach(el => {
    const o = ORIGINAL.get(el) || {};
    if (o.html === undefined) { o.html = el.innerHTML; ORIGINAL.set(el, o); }
    el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : o.html;
  });
  I18N_ATTRS.forEach(a => {
    document.querySelectorAll(`[data-en-${a}]`).forEach(el => {
      const o = ORIGINAL.get(el) || {};
      if (!(a in o)) { o[a] = el.getAttribute(a) ?? ''; ORIGINAL.set(el, o); }
      el.setAttribute(a, lang === 'en' ? el.getAttribute(`data-en-${a}`) : o[a]);
    });
  });
  document.title = lang === 'en' ? (document.body.dataset.titleEn || tituloEs) : tituloEs;
  document.querySelectorAll('.lang__btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
}
function initLang() {
  document.querySelectorAll('.lang__btn').forEach(b => b.addEventListener('click', () => {
    const lang = b.dataset.lang === 'en' ? 'en' : 'es';
    if (lang === LANG) return;
    LANG = lang;
    try { window.localStorage.setItem('st-lang', lang); } catch (e) { void e; }
    aplicarIdiomaEstatico(lang);
    renderDinamico(false);
    document.querySelectorAll('.campo.is-error').forEach(c => { c.classList.remove('is-error'); c.querySelector('.campo__error')?.remove(); });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

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

function setError(campo, inp, msg) {
  campo.classList.toggle('is-error', !!msg);
  inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
  let p = campo.querySelector('.campo__error');
  if (msg) {
    if (!p) { p = document.createElement('p'); p.className = 'campo__error'; p.id = `${inp.id}-error`; campo.appendChild(p); }
    p.textContent = msg;
    inp.setAttribute('aria-describedby', p.id);
  } else if (p) {
    p.remove();
    inp.removeAttribute('aria-describedby');
  }
}
function validarCampo(inp) {
  const campo = inp.closest('.campo');
  if (!campo || campo.hidden) return '';
  const v = inp.value.trim();
  let err = '';
  if (inp.required && !v) err = ui('errVacio');
  else if (v && inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) err = ui('errEmail');
  else if (v && inp.type === 'url' && !/^https?:\/\/\S+\.\S+/.test(v)) err = ui('errUrl');
  setError(campo, inp, err);
  return err;
}
function initForms() {
  document.querySelectorAll('.js-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let primero = null;
      form.querySelectorAll('input:not([type="radio"]), textarea').forEach(inp => {
        if (validarCampo(inp) && !primero) primero = inp;
      });
      if (primero) { primero.focus(); return; }
      const btn = form.querySelector('[type="submit"]');
      const span = btn?.querySelector('span');
      const previo = span?.innerHTML;
      if (btn) btn.disabled = true;
      if (span) span.textContent = ui('enviando');
      setTimeout(() => {
        if (btn) btn.disabled = false;
        if (span) span.innerHTML = previo;
        form.reset();
        form.querySelectorAll('.campo.is-error').forEach(c => c.classList.remove('is-error'));
        form.dispatchEvent(new window.Event('change'));
        showToast(ui('gracias'));
      }, 800);
    });
    form.addEventListener('input', e => {
      const campo = e.target.closest('.campo');
      if (campo?.classList.contains('is-error')) validarCampo(e.target);
    });
  });
}

function initContactoTipos() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const sync = () => {
    const tipo = form.querySelector('input[name="tipo"]:checked')?.value || 'contratacion';
    form.querySelectorAll('.campo[data-tipo]').forEach(c => { c.hidden = c.dataset.tipo !== tipo; });
  };
  const pedido = new URLSearchParams(location.search).get('tipo');
  const radio = pedido && form.querySelector(`input[name="tipo"][value="${window.CSS.escape(pedido)}"]`);
  if (radio) radio.checked = true;
  form.addEventListener('change', sync);
  sync();
}

function initAviso() {
  const form = document.getElementById('avisoForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const sel = n => { const s = form.querySelector(`[name="${n}"]`); return s?.options[s.selectedIndex]?.textContent.trim() || ''; };
    window.open(waLink(ui('msgAviso')(sel('pais'), sel('interes').toLowerCase())), '_blank', 'noopener');
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHeader() {
  const h = document.getElementById('siteHeader');
  if (!h) return;
  const upd = () => h.classList.toggle('is-solid', window.scrollY > 24);
  upd();
  window.addEventListener('scroll', upd, { passive: true });
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero__marca'), { y: 24, opacity: 0, duration: 1.1 }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lema'), { y: 24, opacity: 0, duration: 1 }, 0.36)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.paises__linea'), { scaleX: 0, duration: 1.4, ease: 'power3.inOut' }, 0.6)
    .from(hero.querySelectorAll('.paises__lista li'), { y: 10, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.72)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.68);
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

function initModelos() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let m = bar.querySelector('[aria-current="page"]')?.dataset.modelo;
  try {
    if (m) window.sessionStorage.setItem('gw-modelo', m);
    else m = window.sessionStorage.getItem('gw-modelo') || '1';
  } catch (e) { m = m || '1'; }
  if (bar.hasAttribute('data-interna')) bar.querySelector(`[data-modelo="${m}"]`)?.setAttribute('aria-current', 'true');
  if (m === '2') document.querySelectorAll('a[href="./"], a[href="index.html"]').forEach(a => {
    if (!a.closest('.gw-modelos')) a.setAttribute('href', 'modelo-2.html');
  });
}

if (LANG === 'en') aplicarIdiomaEstatico('en');
renderDinamico(true);
initAgendaFiltros();
initProdFiltros();
initPresencia();
initGuia();
initReveals();
initHeroMotion();
initHeader();
initNav();
initLang();
initWspFloat();
initModelBarScroll();
initModelos();
initForms();
initContactoTipos();
initAviso();
initModal();
initRelojes();
