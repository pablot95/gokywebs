/* Pendientes de cada web en desarrollo (11-oct-2026, Pablo): las cosas que le
   toca hacer a él (o a Claude, que las marca cuando las hace) hasta entregar.
   Se guardan en `clientes.pendientes` = [{ id, texto, hecho, por, at }]:
   - id: clave estable (la usa el script admin/pendientes-claude.mjs para marcar).
   - por: 'pablo' o 'claude', quién la marcó; at: cuándo (ISO).
   El panel siembra la lista (pendientesIniciales) la primera vez que ve una web
   en desarrollo sin `pendientes`; después cada web puede sumar o sacar las suyas.
   `legado` es la clave del checklist anterior (`clientes.tareas`), para no
   perder lo que ya estaba tildado.
   15-oct: solo quedan Comprar dominio, Cargar email, Completar tienda, Subir a host,
   Google Search y Mandar acc. (Firebase salió; sembrarPendientes lo saca de las webs ya sembradas). */

const GOOGLE = { id: "google", texto: "Google Search", ayuda: "Dar de alta el sitio en Search Console, enviar el sitemap y pedir la indexación" };
const DOMINIO = { id: "dominio", texto: "Comprar dominio", ayuda: "Comprar y cargar el dominio de la web", legado: "dominio" };
const ACCESOS = { id: "accesos", texto: "Mandar acc.", ayuda: "Enviarle al cliente los accesos a su web y a su panel" };
const EMAIL_NOTIF = { id: "email", texto: "Cargar email", ayuda: "El email que recibe los avisos de pedidos y consultas", legado: "mail" };

// Solo tiendas y cursos (12-oct, Pablo). Las webs ya sembradas lo reciben una vez (sembrarPendientes, marca `pendientesHostinger`).
export const HOSTINGER = { id: "hostinger", texto: "Subir a host", ayuda: "Subir los archivos de la web al hosting del cliente" };

const POR_TIPO = {
    ecommerce: [
        DOMINIO, EMAIL_NOTIF,
        { id: "tienda", texto: "Completar tienda", ayuda: "Productos, precios, fotos y categorías", legado: "ecommerce" },
        HOSTINGER, GOOGLE, ACCESOS,
    ],
    cursos: [
        DOMINIO, EMAIL_NOTIF,
        { id: "contenido", texto: "Cargar los cursos", ayuda: "Cursos, módulos y contenido", legado: "ecommerce" },
        HOSTINGER, GOOGLE, ACCESOS,
    ],
    inmobiliaria: [
        DOMINIO, EMAIL_NOTIF,
        { id: "contenido", texto: "Cargar las propiedades", ayuda: "Propiedades, fotos y datos", legado: "ecommerce" },
        GOOGLE, ACCESOS,
    ],
    noticias: [
        DOMINIO, EMAIL_NOTIF,
        { id: "contenido", texto: "Cargar las notas", ayuda: "Notas, secciones y portada", legado: "ecommerce" },
        GOOGLE, ACCESOS,
    ],
    profesional: [
        DOMINIO, EMAIL_NOTIF,
        { id: "contenido", texto: "Completar textos y fotos", ayuda: "Lo que el cliente mandó para su sitio" },
        GOOGLE, ACCESOS,
    ],
};
// Tipo que no se reconoce: lo común a todas.
const GENERICO = [DOMINIO, EMAIL_NOTIF, GOOGLE, ACCESOS];

// Los ids que ya no existen (se sacan de las webs ya sembradas) y los textos nuevos de los que quedan.
export const PENDIENTES_SACADOS = ["firebase"];
export const TEXTOS_NUEVOS = { dominio: DOMINIO.texto, email: EMAIL_NOTIF.texto, tienda: "Completar tienda", google: GOOGLE.texto, hostinger: HOSTINGER.texto, accesos: ACCESOS.texto };

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
