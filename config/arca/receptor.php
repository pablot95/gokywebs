<?php

/**
 * Datos del receptor y del comprobante que ARCA no devuelve pero la factura C
 * impresa tiene que mostrar. Se comparte entre el emisor (facturar.php) y el
 * renderizador del comprobante (comprobante.php) para que la validacion y las
 * etiquetas sean siempre las mismas.
 */

// Tabla de condiciones frente al IVA del receptor para comprobantes clase C
// (RG 5616). Solo se usa si FEParamGetCondicionIvaReceptor no responde.
function receptor_condiciones_respaldo()
{
    return [
        ['id' => 1, 'descripcion' => 'IVA Responsable Inscripto'],
        ['id' => 4, 'descripcion' => 'IVA Sujeto Exento'],
        ['id' => 5, 'descripcion' => 'Consumidor Final'],
        ['id' => 6, 'descripcion' => 'Responsable Monotributo'],
        ['id' => 7, 'descripcion' => 'Sujeto No Categorizado'],
        ['id' => 8, 'descripcion' => 'Proveedor del Exterior'],
        ['id' => 9, 'descripcion' => 'Cliente del Exterior'],
        ['id' => 10, 'descripcion' => 'IVA Liberado - Ley N° 19.640'],
        ['id' => 13, 'descripcion' => 'Monotributista Social'],
        ['id' => 15, 'descripcion' => 'IVA No Alcanzado'],
        ['id' => 16, 'descripcion' => 'Monotributo Trabajador Independiente Promovido'],
    ];
}

function receptor_condicion_descripcion($id, $lista = null)
{
    foreach ($lista ?: receptor_condiciones_respaldo() as $condicion) {
        if ((int) $condicion['id'] === (int) $id) return $condicion['descripcion'];
    }
    return '';
}

function receptor_tipos_documento()
{
    return [
        99 => 'Sin identificar (consumidor final)',
        96 => 'DNI',
        80 => 'CUIT',
        86 => 'CUIL',
    ];
}

function receptor_etiqueta_documento($tipo)
{
    $etiquetas = [99 => 'DNI', 96 => 'DNI', 80 => 'CUIT', 86 => 'CUIL'];
    return isset($etiquetas[(int) $tipo]) ? $etiquetas[(int) $tipo] : 'DNI';
}

// CUIT/CUIL con guiones y DNI con puntos, como se imprime en el comprobante.
function receptor_documento_lindo($tipo, $numero)
{
    $numero = (string) $numero;
    if ((int) $tipo === 96) return number_format((float) $numero, 0, ',', '.');
    return preg_replace('/^(\d{2})(\d{8})(\d)$/', '$1-$2-$3', $numero);
}

function receptor_condiciones_venta()
{
    return [
        'Contado',
        'Transferencia bancaria',
        'Mercado Pago',
        'Tarjeta de débito',
        'Tarjeta de crédito',
        'Cuenta corriente',
        'Cheque',
        'Otra',
    ];
}

function receptor_descripcion_por_defecto()
{
    return 'Diseño y desarrollo web';
}

// Digito verificador de CUIT/CUIL (modulo 11). Mandar uno invalido hace que ARCA
// devuelva un error opaco, asi que conviene frenarlo antes.
function receptor_cuit_valido($numero)
{
    if (!preg_match('/^\d{11}$/', $numero)) return false;
    $base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    $suma = 0;
    for ($i = 0; $i < 10; $i++) $suma += (int) $numero[$i] * $base[$i];
    $digito = 11 - ($suma % 11);
    if ($digito === 11) $digito = 0;
    if ($digito === 10) $digito = 9;
    return $digito === (int) $numero[10];
}

/**
 * @throws InvalidArgumentException con un mensaje mostrable al admin.
 */
function receptor_normalizar(array $entrada, $idsPermitidos = null)
{
    $tipos = receptor_tipos_documento();
    $numero = preg_replace('/\D/', '', (string) ($entrada['documento'] ?? ''));

    $tipo = isset($entrada['tipoDocumento']) ? (int) $entrada['tipoDocumento'] : null;
    if (!isset($tipos[$tipo])) {
        // Compatibilidad con el modal viejo, que solo mandaba el numero pelado.
        $tipo = $numero === '' ? 99 : (strlen($numero) === 11 ? 80 : 96);
    }
    if ($numero === '') $tipo = 99;

    if ($tipo === 99) {
        $numero = '0';
        $condicionId = 5;
    } else {
        if ($tipo === 96) {
            if (!preg_match('/^\d{6,8}$/', $numero)) {
                throw new InvalidArgumentException('El DNI tiene que tener entre 6 y 8 dígitos.');
            }
        } else {
            $etiqueta = receptor_etiqueta_documento($tipo);
            if (!preg_match('/^\d{11}$/', $numero)) {
                throw new InvalidArgumentException('El ' . $etiqueta . ' tiene que tener 11 dígitos.');
            }
            if (!receptor_cuit_valido($numero)) {
                throw new InvalidArgumentException('El ' . $etiqueta . ' ' . $numero . ' no es válido: falla el dígito verificador.');
            }
        }

        $condicionId = (int) ($entrada['condicionIva'] ?? 0);
        $permitidos = $idsPermitidos ?: array_column(receptor_condiciones_respaldo(), 'id');
        if (!in_array($condicionId, array_map('intval', $permitidos), true)) {
            throw new InvalidArgumentException('Elegí la condición frente al IVA del cliente.');
        }
    }

    $nombre = trim(preg_replace('/\s+/u', ' ', (string) ($entrada['nombre'] ?? '')));

    // Sin CUIT/CUIL/DNI no hay a quien atribuir el comprobante: la razon social
    // solo es obligatoria cuando el receptor esta identificado.
    if ($tipo !== 99 && $nombre === '') {
        throw new InvalidArgumentException('Poné el apellido y nombre o la razón social del cliente.');
    }

    return [
        'tipoDocumento' => $tipo,
        'numeroDocumento' => $numero,
        'etiquetaDocumento' => receptor_etiqueta_documento($tipo),
        'condicionIvaId' => $condicionId,
        'condicionIva' => receptor_condicion_descripcion($condicionId),
        'nombre' => mb_substr($nombre, 0, 120),
    ];
}

function receptor_fecha_ymd($valor, $porDefecto)
{
    $texto = preg_replace('/\D/', '', (string) $valor);
    if (strlen($texto) !== 8 || !checkdate((int) substr($texto, 4, 2), (int) substr($texto, 6, 2), (int) substr($texto, 0, 4))) {
        return $porDefecto;
    }
    return $texto;
}

/**
 * @throws InvalidArgumentException
 */
function receptor_normalizar_comprobante(array $entrada)
{
    $concepto = (int) ($entrada['concepto'] ?? 2);
    if (!in_array($concepto, [1, 2, 3], true)) $concepto = 2;

    $hoy = date('Ymd');
    $desde = receptor_fecha_ymd($entrada['servicioDesde'] ?? null, date('Ymd', strtotime('-30 days')));
    $hasta = receptor_fecha_ymd($entrada['servicioHasta'] ?? null, $hoy);
    $vence = receptor_fecha_ymd($entrada['vencimientoPago'] ?? null, $hoy);

    if ($concepto !== 1 && $desde > $hasta) {
        throw new InvalidArgumentException('El período facturado empieza después de terminar.');
    }

    $descripcion = trim((string) ($entrada['descripcion'] ?? ''));
    if ($descripcion === '') $descripcion = receptor_descripcion_por_defecto();

    $condicionVenta = trim((string) ($entrada['condicionVenta'] ?? ''));
    if ($condicionVenta === '') $condicionVenta = 'Contado';

    return [
        'concepto' => $concepto,
        'servicioDesde' => $desde,
        'servicioHasta' => $hasta,
        'vencimientoPago' => $vence,
        'descripcion' => mb_substr($descripcion, 0, 300),
        'condicionVenta' => mb_substr($condicionVenta, 0, 40),
    ];
}

/**
 * Datos del receptor listos para imprimir. Las facturas emitidas antes de que el
 * modal pidiera los datos fiscales no tienen el bloque 'receptor': ahi se cae a
 * lo que se pueda deducir del tipo de documento.
 */
function receptor_desde_factura($factura)
{
    if (!empty($factura['receptor']) && is_array($factura['receptor'])) {
        $r = $factura['receptor'];
        $tipo = (int) ($r['tipoDocumento'] ?? 99);
        $condicion = (string) ($r['condicionIva'] ?? '');
        return [
            'etiqueta' => $r['etiquetaDocumento'] ?? receptor_etiqueta_documento($tipo),
            'valor' => $tipo === 99 ? '' : receptor_documento_lindo($tipo, $r['numeroDocumento'] ?? ''),
            'condicion' => $condicion !== '' ? $condicion : receptor_condicion_descripcion($r['condicionIvaId'] ?? 5),
            'nombre' => (string) ($r['nombre'] ?? ''),
        ];
    }

    $tipo = (int) ($factura['tipoDocumento'] ?? 99);
    $numero = (string) ($factura['numeroDocumento'] ?? '');
    $condicionId = (int) ($factura['condicionIvaReceptor'] ?? ($tipo === 80 ? 6 : 5));

    return [
        'etiqueta' => receptor_etiqueta_documento($tipo),
        'valor' => $tipo === 99 ? '' : receptor_documento_lindo($tipo, $numero),
        'condicion' => receptor_condicion_descripcion($condicionId),
        'nombre' => $tipo === 99 ? '' : trim((string) ($factura['cliente'] ?? '')),
    ];
}
