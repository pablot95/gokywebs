<?php

class QrCode
{
    const NIVEL_M = 1;

    private static $tablaEc = [
        1 => [26, 10, 1, 16, 0, 0], 2 => [44, 16, 1, 28, 0, 0], 3 => [70, 26, 1, 44, 0, 0],
        4 => [100, 18, 2, 32, 0, 0], 5 => [134, 24, 2, 43, 0, 0], 6 => [172, 16, 4, 27, 0, 0],
        7 => [196, 18, 4, 31, 0, 0], 8 => [242, 22, 2, 38, 2, 39], 9 => [292, 22, 3, 36, 2, 37],
        10 => [346, 26, 4, 43, 1, 44], 11 => [404, 30, 1, 50, 4, 51], 12 => [466, 22, 6, 36, 2, 37],
        13 => [532, 22, 8, 37, 1, 38], 14 => [581, 24, 4, 40, 5, 41], 15 => [655, 24, 5, 41, 5, 42],
        16 => [733, 28, 7, 45, 3, 46], 17 => [815, 28, 10, 46, 1, 47], 18 => [901, 26, 9, 43, 4, 44],
        19 => [991, 26, 3, 44, 11, 45], 20 => [1085, 26, 3, 41, 13, 42], 21 => [1156, 26, 17, 42, 0, 0],
        22 => [1258, 28, 17, 46, 0, 0], 23 => [1364, 30, 4, 47, 14, 48], 24 => [1474, 30, 6, 45, 14, 46],
        25 => [1588, 28, 8, 47, 13, 48],
    ];

    private static $alineacion = [
        2 => [6, 18], 3 => [6, 22], 4 => [6, 26], 5 => [6, 30], 6 => [6, 34],
        7 => [6, 22, 38], 8 => [6, 24, 42], 9 => [6, 26, 46], 10 => [6, 28, 50],
        11 => [6, 30, 54], 12 => [6, 32, 58], 13 => [6, 34, 62], 14 => [6, 26, 46, 66],
        15 => [6, 26, 48, 70], 16 => [6, 26, 50, 74], 17 => [6, 30, 54, 78], 18 => [6, 30, 56, 82],
        19 => [6, 30, 58, 86], 20 => [6, 34, 62, 90], 21 => [6, 28, 50, 72, 94], 22 => [6, 26, 50, 74, 98],
        23 => [6, 30, 54, 78, 102], 24 => [6, 28, 54, 80, 106], 25 => [6, 32, 58, 84, 110],
    ];

    public static function generarMatriz($texto, $mascaraForzada = null)
    {
        $bytes = array_values(unpack('C*', $texto));
        $version = self::elegirVersion(count($bytes));
        $capacidadDatos = self::$tablaEc[$version][0]
            - self::$tablaEc[$version][1] * (self::$tablaEc[$version][2] + self::$tablaEc[$version][4]);

        $bits = self::armarBits($bytes, $version, $capacidadDatos);
        $codewords = self::bitsACodewords($bits);
        $entrelazado = self::codificarYEntrelazar($codewords, $version);
        $bitsFinales = self::codewordsABits($entrelazado);

        $n = 17 + 4 * $version;
        $matriz = array_fill(0, $n, array_fill(0, $n, 0));
        $reservado = array_fill(0, $n, array_fill(0, $n, false));

        self::colocarFinder($matriz, $reservado, 0, 0);
        self::colocarFinder($matriz, $reservado, $n - 7, 0);
        self::colocarFinder($matriz, $reservado, 0, $n - 7);
        self::colocarAlineaciones($matriz, $reservado, $version, $n);
        self::colocarTiming($matriz, $reservado, $n);
        $matriz[$n - 8][8] = 1;
        $reservado[$n - 8][8] = true;
        self::reservarFormato($reservado, $n);
        if ($version >= 7) self::reservarVersion($reservado, $n);

        self::colocarDatos($matriz, $reservado, $bitsFinales, $n);

        $mejorMascara = $mascaraForzada;
        if ($mejorMascara === null) {
            $mejorPuntaje = null;
            for ($m = 0; $m < 8; $m++) {
                $prueba = self::aplicarMascara($matriz, $reservado, $n, $m);
                self::colocarFormato($prueba, $n, self::NIVEL_M, $m);
                if ($version >= 7) self::colocarVersion($prueba, $n, $version);
                $puntaje = self::penalizacion($prueba, $n);
                if ($mejorPuntaje === null || $puntaje < $mejorPuntaje) {
                    $mejorPuntaje = $puntaje;
                    $mejorMascara = $m;
                }
            }
        }

        $final = self::aplicarMascara($matriz, $reservado, $n, $mejorMascara);
        self::colocarFormato($final, $n, self::NIVEL_M, $mejorMascara);
        if ($version >= 7) self::colocarVersion($final, $n, $version);

        return $final;
    }

    private static function elegirVersion($cantidadBytes)
    {
        foreach (self::$tablaEc as $version => $t) {
            $overhead = $version <= 9 ? 2 : 3;
            $capacidadDatos = $t[0] - $t[1] * ($t[2] + $t[4]);
            if ($cantidadBytes + $overhead <= $capacidadDatos) return $version;
        }
        throw new Exception('Texto demasiado largo para el QR (máx. version 25 soportada)');
    }

    private static function armarBits($bytes, $version, $capacidadDatos)
    {
        $bits = '0100';
        $bits .= str_pad(decbin(count($bytes)), $version <= 9 ? 8 : 16, '0', STR_PAD_LEFT);
        foreach ($bytes as $b) $bits .= str_pad(decbin($b), 8, '0', STR_PAD_LEFT);

        $capacidadBits = $capacidadDatos * 8;
        $bits .= str_repeat('0', min(4, max(0, $capacidadBits - strlen($bits))));
        while (strlen($bits) % 8 !== 0) $bits .= '0';

        if (strlen($bits) < $capacidadBits) $bits .= '00000000';
        $relleno = ['11101100', '00010001'];
        $i = 0;
        while (strlen($bits) < $capacidadBits) {
            $bits .= $relleno[$i % 2];
            $i++;
        }
        return $bits;
    }

    private static function bitsACodewords($bits)
    {
        $out = [];
        for ($i = 0; $i < strlen($bits); $i += 8) $out[] = bindec(substr($bits, $i, 8));
        return $out;
    }

    private static $expTabla = null;
    private static $logTabla = null;

    private static function inicializarGF()
    {
        if (self::$expTabla !== null) return;
        $exp = array_fill(0, 512, 0);
        $log = array_fill(0, 256, 0);
        $x = 1;
        for ($i = 0; $i < 255; $i++) {
            $exp[$i] = $x;
            $log[$x] = $i;
            $x <<= 1;
            if ($x & 0x100) $x ^= 0x11D;
        }
        for ($i = 255; $i < 512; $i++) $exp[$i] = $exp[$i - 255];
        self::$expTabla = $exp;
        self::$logTabla = $log;
    }

    private static function gfMul($a, $b)
    {
        if ($a === 0 || $b === 0) return 0;
        return self::$expTabla[self::$logTabla[$a] + self::$logTabla[$b]];
    }

    private static function generadorRS($grado)
    {
        $poli = [1];
        for ($i = 0; $i < $grado; $i++) {
            $nuevo = array_fill(0, count($poli) + 1, 0);
            for ($j = 0; $j < count($poli); $j++) {
                $nuevo[$j] ^= $poli[$j];
                $nuevo[$j + 1] ^= self::gfMul($poli[$j], self::$expTabla[$i]);
            }
            $poli = $nuevo;
        }
        return $poli;
    }

    private static function ecParaBloque($datos, $cantEc)
    {
        self::inicializarGF();
        $generador = self::generadorRS($cantEc);
        $resto = array_fill(0, $cantEc, 0);
        foreach ($datos as $d) {
            $factor = $d ^ $resto[0];
            array_shift($resto);
            $resto[] = 0;
            if ($factor !== 0) {
                for ($j = 0; $j < $cantEc; $j++) {
                    $resto[$j] ^= self::gfMul($generador[$j + 1], $factor);
                }
            }
        }
        return $resto;
    }

    private static function codificarYEntrelazar($codewords, $version)
    {
        [$total, $ecpb, $g1n, $g1s, $g2n, $g2s] = self::$tablaEc[$version];
        $bloquesDatos = [];
        $bloquesEc = [];
        $pos = 0;
        for ($i = 0; $i < $g1n; $i++) {
            $bloque = array_slice($codewords, $pos, $g1s);
            $bloquesDatos[] = $bloque;
            $bloquesEc[] = self::ecParaBloque($bloque, $ecpb);
            $pos += $g1s;
        }
        for ($i = 0; $i < $g2n; $i++) {
            $bloque = array_slice($codewords, $pos, $g2s);
            $bloquesDatos[] = $bloque;
            $bloquesEc[] = self::ecParaBloque($bloque, $ecpb);
            $pos += $g2s;
        }

        $out = [];
        $maxDatos = max($g1s, $g2s ?: 0);
        for ($i = 0; $i < $maxDatos; $i++) {
            foreach ($bloquesDatos as $b) if (isset($b[$i])) $out[] = $b[$i];
        }
        for ($i = 0; $i < $ecpb; $i++) {
            foreach ($bloquesEc as $b) $out[] = $b[$i];
        }
        return $out;
    }

    private static function codewordsABits($codewords)
    {
        $bits = '';
        foreach ($codewords as $c) $bits .= str_pad(decbin($c), 8, '0', STR_PAD_LEFT);
        return $bits;
    }

    private static function colocarFinder(&$m, &$r, $fy, $fx)
    {
        for ($y = -1; $y <= 7; $y++) {
            for ($x = -1; $x <= 7; $x++) {
                $py = $fy + $y;
                $px = $fx + $x;
                if ($py < 0 || $px < 0 || $py >= count($m) || $px >= count($m)) continue;
                $enAnillo = ($x >= 0 && $x <= 6 && ($y === 0 || $y === 6))
                    || ($y >= 0 && $y <= 6 && ($x === 0 || $x === 6));
                $enCentro = $x >= 2 && $x <= 4 && $y >= 2 && $y <= 4;
                $m[$py][$px] = ($enAnillo || $enCentro) ? 1 : 0;
                $r[$py][$px] = true;
            }
        }
    }

    private static function colocarAlineaciones(&$m, &$r, $version, $n)
    {
        if (!isset(self::$alineacion[$version])) return;
        $centros = self::$alineacion[$version];
        foreach ($centros as $cy) {
            foreach ($centros as $cx) {
                if (($cy < 9 && $cx < 9) || ($cy < 9 && $cx > $n - 9) || ($cy > $n - 9 && $cx < 9)) continue;
                for ($y = -2; $y <= 2; $y++) {
                    for ($x = -2; $x <= 2; $x++) {
                        $borde = (abs($y) === 2 || abs($x) === 2);
                        $m[$cy + $y][$cx + $x] = ($borde || ($x === 0 && $y === 0)) ? 1 : 0;
                        $r[$cy + $y][$cx + $x] = true;
                    }
                }
            }
        }
    }

    private static function colocarTiming(&$m, &$r, $n)
    {
        for ($i = 8; $i < $n - 8; $i++) {
            if (!$r[6][$i]) { $m[6][$i] = $i % 2 === 0 ? 1 : 0; $r[6][$i] = true; }
            if (!$r[$i][6]) { $m[$i][6] = $i % 2 === 0 ? 1 : 0; $r[$i][6] = true; }
        }
    }

    private static function reservarFormato(&$r, $n)
    {
        for ($i = 0; $i <= 8; $i++) { $r[8][$i] = true; $r[$i][8] = true; }
        for ($i = 0; $i < 8; $i++) { $r[8][$n - 1 - $i] = true; $r[$n - 1 - $i][8] = true; }
    }

    private static function reservarVersion(&$r, $n)
    {
        for ($y = 0; $y < 6; $y++) for ($x = 0; $x < 3; $x++) {
            $r[$y][$n - 11 + $x] = true;
            $r[$n - 11 + $x][$y] = true;
        }
    }

    private static function colocarDatos(&$m, $reservado, $bits, $n)
    {
        $idx = 0;
        $total = strlen($bits);
        $subiendo = true;
        $col = $n - 1;
        while ($col > 0) {
            if ($col === 6) $col--;
            for ($paso = 0; $paso < $n; $paso++) {
                $fila = $subiendo ? ($n - 1 - $paso) : $paso;
                for ($k = 0; $k < 2; $k++) {
                    $c = $col - $k;
                    if ($reservado[$fila][$c]) continue;
                    $m[$fila][$c] = $idx < $total ? (int) $bits[$idx] : 0;
                    $idx++;
                }
            }
            $subiendo = !$subiendo;
            $col -= 2;
        }
    }

    private static function aplicarMascara($matriz, $reservado, $n, $mascara)
    {
        $out = $matriz;
        for ($y = 0; $y < $n; $y++) {
            for ($x = 0; $x < $n; $x++) {
                if ($reservado[$y][$x]) continue;
                if (self::condicionMascara($mascara, $y, $x)) {
                    $out[$y][$x] = $out[$y][$x] ? 0 : 1;
                }
            }
        }
        return $out;
    }

    private static function condicionMascara($m, $y, $x)
    {
        switch ($m) {
            case 0: return ($y + $x) % 2 === 0;
            case 1: return $y % 2 === 0;
            case 2: return $x % 3 === 0;
            case 3: return ($y + $x) % 3 === 0;
            case 4: return (intdiv($y, 2) + intdiv($x, 3)) % 2 === 0;
            case 5: return (($y * $x) % 2) + (($y * $x) % 3) === 0;
            case 6: return ((($y * $x) % 2) + (($y * $x) % 3)) % 2 === 0;
            case 7: return ((($y + $x) % 2) + (($y * $x) % 3)) % 2 === 0;
        }
        return false;
    }

    private static function colocarFormato(&$m, $n, $nivel, $mascara)
    {
        $niveles = [1, 0, 3, 2];
        $datos = ($niveles[$nivel] << 3) | $mascara;
        $resto = $datos << 10;
        $gen = 0b10100110111;
        for ($i = 14; $i >= 10; $i--) {
            if (($resto >> $i) & 1) $resto ^= $gen << ($i - 10);
        }
        $codigo = (($datos << 10) | $resto) ^ 0b101010000010010;

        $bits = str_pad(decbin($codigo), 15, '0', STR_PAD_LEFT);

        $m[8][0] = (int) $bits[0]; $m[8][1] = (int) $bits[1]; $m[8][2] = (int) $bits[2];
        $m[8][3] = (int) $bits[3]; $m[8][4] = (int) $bits[4]; $m[8][5] = (int) $bits[5];
        $m[8][7] = (int) $bits[6]; $m[8][8] = (int) $bits[7]; $m[7][8] = (int) $bits[8];
        $m[5][8] = (int) $bits[9]; $m[4][8] = (int) $bits[10]; $m[3][8] = (int) $bits[11];
        $m[2][8] = (int) $bits[12]; $m[1][8] = (int) $bits[13]; $m[0][8] = (int) $bits[14];

        $m[$n - 1][8] = (int) $bits[0]; $m[$n - 2][8] = (int) $bits[1]; $m[$n - 3][8] = (int) $bits[2];
        $m[$n - 4][8] = (int) $bits[3]; $m[$n - 5][8] = (int) $bits[4]; $m[$n - 6][8] = (int) $bits[5];
        $m[$n - 7][8] = (int) $bits[6];
        $m[8][$n - 8] = (int) $bits[7]; $m[8][$n - 7] = (int) $bits[8]; $m[8][$n - 6] = (int) $bits[9];
        $m[8][$n - 5] = (int) $bits[10]; $m[8][$n - 4] = (int) $bits[11]; $m[8][$n - 3] = (int) $bits[12];
        $m[8][$n - 2] = (int) $bits[13]; $m[8][$n - 1] = (int) $bits[14];
    }

    private static function colocarVersion(&$m, $n, $version)
    {
        $resto = $version << 12;
        $gen = 0b1111100100101;
        for ($i = 17; $i >= 12; $i--) {
            if (($resto >> $i) & 1) $resto ^= $gen << ($i - 12);
        }
        $codigo = ($version << 12) | $resto;
        $bits = str_pad(decbin($codigo), 18, '0', STR_PAD_LEFT);

        for ($i = 0; $i < 18; $i++) {
            $bit = (int) $bits[17 - $i];
            $fila = intdiv($i, 3);
            $col = $i % 3;
            $m[$fila][$n - 11 + $col] = $bit;
            $m[$n - 11 + $col][$fila] = $bit;
        }
    }

    private static function penalizacion($m, $n)
    {
        $p = 0;

        for ($y = 0; $y < $n; $y++) {
            $p += self::penalizacionCorrida($m[$y]);
            $p += self::penalizacionPatron($m[$y]);
        }
        for ($x = 0; $x < $n; $x++) {
            $col = array_column($m, $x);
            $p += self::penalizacionCorrida($col);
            $p += self::penalizacionPatron($col);
        }

        for ($y = 0; $y < $n - 1; $y++) {
            for ($x = 0; $x < $n - 1; $x++) {
                $v = $m[$y][$x];
                if ($m[$y][$x + 1] === $v && $m[$y + 1][$x] === $v && $m[$y + 1][$x + 1] === $v) $p += 3;
            }
        }

        $oscuros = 0;
        foreach ($m as $fila) $oscuros += array_sum($fila);
        $porcentaje = ($oscuros * 100) / ($n * $n);
        $previo = floor($porcentaje / 5) * 5;
        $siguiente = ceil($porcentaje / 5) * 5;
        $k = min(abs($previo - 50), abs($siguiente - 50)) / 5;
        $p += (int) $k * 10;

        return $p;
    }

    private static function penalizacionCorrida($linea)
    {
        $p = 0;
        $actual = $linea[0];
        $largo = 1;
        for ($i = 1; $i < count($linea); $i++) {
            if ($linea[$i] === $actual) {
                $largo++;
            } else {
                if ($largo >= 5) $p += 3 + ($largo - 5);
                $actual = $linea[$i];
                $largo = 1;
            }
        }
        if ($largo >= 5) $p += 3 + ($largo - 5);
        return $p;
    }

    private static function penalizacionPatron($linea)
    {
        $p = 0;
        $s = '0000' . implode('', $linea) . '0000';
        $buscar = ['10111010000', '00001011101'];
        foreach ($buscar as $patron) {
            $desde = 0;
            while (($pos = strpos($s, $patron, $desde)) !== false) {
                $p += 40;
                $desde = $pos + 1;
            }
        }
        return $p;
    }
}
