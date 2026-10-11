/* Pendientes de cada web en desarrollo (11-oct-2026, Pablo): las cosas que le
   toca hacer a él (o a Claude, que las marca cuando las hace) hasta entregar.
   Se guardan en `clientes.pendientes` = [{ id, texto, hecho, por, at }]:
   - id: clave estable (la usa el script admin/pendientes-claude.mjs para marcar).
   - por: 'pablo' o 'claude', quién la marcó; at: cuándo (ISO).
   El panel siembra la lista (pendientesIniciales) la primera vez que ve una web
   en desarrollo sin `pendientes`; después cada web puede sumar o sacar las suyas.
   `legado` es la clave del checklist anterior (`clientes.tareas`), para no
   perder lo que ya estaba tildado. */

const GOOGLE = { id: "google", texto: "Google Search", ayuda: "Dar de alta el sitio en Search Console, enviar el sitemap y pedir la indexación" };
const DOMINIO = { id: "dominio", texto: "Cargar el dominio", legado: "dominio" };
const ACCESOS = { id: "accesos", texto: "Mandar los accesos", ayuda: "Enviarle al cliente los accesos a su web y a su panel" };
const EMAIL_NOTIF = { id: "email", texto: "Cargar el email de notificaciones", ayuda: "El email que recibe los avisos de pedidos y consultas", legado: "mail" };
const FIREBASE = { id: "firebase", texto: "Firebase", ayuda: "Crear el proyecto de Firebase y conectarlo a la web", legado: "firebase" };

const POR_TIPO = {
    ecommerce: [
        { id: "tienda", texto: "Completar la tienda", ayuda: "Productos, precios, fotos y categorías", legado: "ecommerce" },
        EMAIL_NOTIF, DOMINIO, FIREBASE, GOOGLE, ACCESOS,
    ],
    cursos: [
        { id: "contenido", texto: "Cargar los cursos", ayuda: "Cursos, módulos y contenido", legado: "ecommerce" },
        EMAIL_NOTIF, DOMINIO, FIREBASE, GOOGLE, ACCESOS,
    ],
    inmobiliaria: [
        { id: "contenido", texto: "Cargar las propiedades", ayuda: "Propiedades, fotos y datos", legado: "ecommerce" },
        EMAIL_NOTIF, DOMINIO, FIREBASE, GOOGLE, ACCESOS,
    ],
    noticias: [
        { id: "contenido", texto: "Cargar las notas", ayuda: "Notas, secciones y portada", legado: "ecommerce" },
        EMAIL_NOTIF, DOMINIO, FIREBASE, GOOGLE, ACCESOS,
    ],
    profesional: [
        { id: "contenido", texto: "Completar textos y fotos", ayuda: "Lo que el cliente mandó para su sitio" },
        { ...EMAIL_NOTIF, texto: "Cargar el email del formulario", ayuda: "El email que recibe las consultas del formulario de contacto" },
        DOMINIO, GOOGLE, ACCESOS,
    ],
};
// Tipo que no se reconoce: lo común a todas.
const GENERICO = [
    { ...EMAIL_NOTIF, texto: "Cargar el email del formulario", ayuda: "El email que recibe las consultas del formulario de contacto" },
    DOMINIO, GOOGLE, ACCESOS,
];

/* La lista de arranque de una web según su tipo (clave de PLANES: ecommerce,
   cursos, inmobiliaria, noticias, profesional o null). `tareasViejas` es el
   `clientes.tareas` del checklist anterior: lo que estaba tildado queda hecho. */
export function pendientesIniciales(planKey, tareasViejas = null) {
    const base = POR_TIPO[planKey] || GENERICO;
    return base.map(p => {
        const hecho = !!(p.legado && tareasViejas && tareasViejas[p.legado]);
        return { id: p.id, texto: p.texto, hecho, por: hecho ? "pablo" : "", at: hecho ? new Date().toISOString() : "" };
    });
}

// El texto de ayuda (tooltip) de un pendiente conocido.
export function ayudaDePendiente(id) {
    const todos = [...Object.values(POR_TIPO).flat(), ...GENERICO];
    return todos.find(p => p.id === id)?.ayuda || "";
}
