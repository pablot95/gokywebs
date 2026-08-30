// Estado compartido entre app.js (lo escribe), clientes.js y facturacion.js (lo leen).
// Modulo separado para que ninguno de los tres tenga que importarse circularmente.
export const estado = {
    user: null,   // objeto de Firebase Auth del usuario logueado
    arca: null,   // ultima respuesta de api/config.php: {configurado, certListo, config}
};

export function arcaListoParaFacturar() {
    return !!(estado.arca && estado.arca.configurado && estado.arca.certListo);
}

export function emisorEsResponsableInscripto() {
    return estado.arca?.config?.emisor?.condicionIva === 'Responsable Inscripto';
}
