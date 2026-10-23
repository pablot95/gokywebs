/* Pendientes de cada web en desarrollo (11-oct-2026, Pablo): las cosas que le
   toca hacer a él (o a Claude, que las marca cuando las hace) hasta entregar.
   Se guardan en `clientes.pendientes` = [{ id, texto, hecho, por, at }]:
   - id: clave estable (la usa el script admin/pendientes-claude.mjs para marcar).
   - por: 'pablo' o 'claude', quién la marcó; at: cuándo (ISO).
   El panel siembra la lista (pendientesIniciales) la primera vez que ve una web
   en desarrollo sin `pendientes`; después cada web puede sumar o sacar las suyas.
   `legado` es la clave del checklist anterior (`clientes.tareas`), para no
   perder lo que ya estaba tildado.
   23-oct: todas las webs, de cualquier tipo, quedan con Completar web, Google Search
   y Mandar acc. (salen Comprar dominio, Cargar email y Subir a host). Las ya sembradas
   se pasan una vez con normalizarPendientes (marca `pendientesVersion`). */

const WEB = { id: "web", texto: "Completar web", ayuda: "Textos, fotos y lo que haya que cargar (productos, cursos, propiedades…)", legado: "ecommerce" };
const GOOGLE = { id: "google", texto: "Google Search", ayuda: "Dar de alta el sitio en Search Console, enviar el sitemap y pedir la indexación" };
const ACCESOS = { id: "accesos", texto: "Mandar acc.", ayuda: "Enviarle al cliente los accesos a su web y a su panel" };
const CATALOGO = [WEB, GOOGLE, ACCESOS];

export const PENDIENTES_VERSION = "20261023";
// Los ids que ya no existen y los que pasaron a ser «Completar web» (tienda y los contenidos de cada tipo).
const SACADOS = ["firebase", "dominio", "email", "hostinger"];
const IDS_VIEJOS = { tienda: WEB.id, contenido: WEB.id };

const vacio = (p) => ({ id: p.id, texto: p.texto, hecho: false, por: "", at: "" });

/* La lista de arranque de una web. `tareasViejas` es el `clientes.tareas` del
   checklist anterior: lo que estaba tildado queda hecho. */
export function pendientesIniciales(tareasViejas = null) {
    return CATALOGO.map(p => {
        const hecho = !!(p.legado && tareasViejas && tareasViejas[p.legado]);
        return { ...vacio(p), hecho, por: hecho ? "pablo" : "", at: hecho ? new Date().toISOString() : "" };
    });
}

/* Una lista guardada con el catálogo de hoy: saca los que ya no van, pasa tienda/contenido
   a «Completar web» (con lo hecho) y deja los nombres del catálogo. Con `completar`
   (la primera vez, sin `pendientesVersion`) suma los del catálogo que falten; después no,
   así un pendiente que Pablo quitó con la × no vuelve. Los que agregó él quedan al final. */
export function normalizarPendientes(lista, completar = false) {
    const porId = new Map();
    const propios = [];
    for (const p of lista) {
        const id = IDS_VIEJOS[p.id] || p.id;
        if (SACADOS.includes(id)) continue;
        const del = CATALOGO.find(x => x.id === id);
        if (!del) { propios.push(p); continue; }
        if (!porId.has(id) || (p.hecho && !porId.get(id).hecho)) porId.set(id, { ...p, id, texto: del.texto });
    }
    return [
        ...CATALOGO.map(x => porId.get(x.id) || (completar ? vacio(x) : null)).filter(Boolean),
        ...propios,
    ];
}

// El texto de ayuda (tooltip) de un pendiente conocido.
export function ayudaDePendiente(id) {
    return CATALOGO.find(p => p.id === (IDS_VIEJOS[id] || id))?.ayuda || "";
}
