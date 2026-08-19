<?php

class Pdf
{
    const ANCHO = 595.28;
    const ALTO = 841.89;

    private static $anchos = [
        'F1' => [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,
                 556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,
                 1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,
                 667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,
                 333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,
                 556,556,333,500,278,556,500,722,500,500,500,334,260,334,584],
        'F2' => [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,
                 556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,
                 975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,
                 667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,
                 333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,
                 611,611,389,556,333,611,556,778,556,556,500,389,280,389,584],
    ];

    private static $latin1 = [
        'á' => "\xE1", 'é' => "\xE9", 'í' => "\xED", 'ó' => "\xF3", 'ú' => "\xFA",
        'Á' => "\xC1", 'É' => "\xC9", 'Í' => "\xCD", 'Ó' => "\xD3", 'Ú' => "\xDA",
        'ñ' => "\xF1", 'Ñ' => "\xD1", 'ü' => "\xFC", 'Ü' => "\xDC",
        '¿' => "\xBF", '¡' => "\xA1", 'º' => "\xBA", 'ª' => "\xAA", '°' => "\xB0",
        '·' => "\xB7", '—' => "\x97", '–' => "\x96", '“' => "\x93", '”' => "\x94",
        '‘' => "\x91", '’' => "\x92", '€' => "\x80", '…' => "\x85", '«' => "\xAB", '»' => "\xBB",
    ];

    private $partes = [];

    public static function aWinAnsi($texto)
    {
        $convertido = preg_replace_callback('/[\x{0080}-\x{FFFF}]/u', function ($m) {
            return self::$latin1[$m[0]] ?? '?';
        }, (string) $texto);
        return $convertido === null ? '' : $convertido;
    }

    public static function ancho($texto, $fuente, $tam)
    {
        $texto = self::aWinAnsi($texto);
        $tabla = self::$anchos[$fuente];
        $total = 0;
        for ($i = 0; $i < strlen($texto); $i++) {
            $c = ord($texto[$i]);
            $total += $c >= 32 && $c <= 126 ? $tabla[$c - 32] : 556;
        }
        return $total * $tam / 1000;
    }

    public static function recortar($texto, $fuente, $tam, $anchoMaximo)
    {
        $texto = (string) $texto;
        if (self::ancho($texto, $fuente, $tam) <= $anchoMaximo) return $texto;
        $puntos = self::ancho('...', $fuente, $tam);
        $largo = mb_strlen($texto, 'UTF-8');
        while ($largo > 1) {
            $largo--;
            $corte = mb_substr($texto, 0, $largo, 'UTF-8');
            if (self::ancho($corte, $fuente, $tam) + $puntos <= $anchoMaximo) return rtrim($corte) . '...';
        }
        return '';
    }

    public static function envolver($texto, $fuente, $tam, $anchoMaximo)
    {
        $palabras = preg_split('/\s+/', trim((string) $texto));
        $lineas = [];
        $actual = '';
        foreach ($palabras as $palabra) {
            $intento = $actual === '' ? $palabra : $actual . ' ' . $palabra;
            if (self::ancho($intento, $fuente, $tam) <= $anchoMaximo || $actual === '') {
                $actual = $intento;
            } else {
                $lineas[] = $actual;
                $actual = $palabra;
            }
        }
        if ($actual !== '') $lineas[] = $actual;
        return $lineas ?: [''];
    }

    private function agregar($s)
    {
        $this->partes[] = $s;
    }

    public function texto($x, $y, $texto, $fuente = 'F1', $tam = 9, $gris = 0)
    {
        $t = self::aWinAnsi($texto);
        $t = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $t);
        $this->agregar(sprintf(
            "BT /%s %.2F Tf %.3F g %.2F %.2F Td (%s) Tj ET",
            $fuente, $tam, $gris, $x, self::ALTO - $y, $t
        ));
        return $this;
    }

    public function textoDerecha($xDerecho, $y, $texto, $fuente = 'F1', $tam = 9, $gris = 0)
    {
        return $this->texto($xDerecho - self::ancho($texto, $fuente, $tam), $y, $texto, $fuente, $tam, $gris);
    }

    public function textoCentrado($xCentro, $y, $texto, $fuente = 'F1', $tam = 9, $gris = 0)
    {
        return $this->texto($xCentro - self::ancho($texto, $fuente, $tam) / 2, $y, $texto, $fuente, $tam, $gris);
    }

    public function rectangulo($x, $y, $ancho, $alto, $grosor = 0.8, $relleno = null)
    {
        $yPdf = self::ALTO - $y - $alto;
        if ($relleno !== null) {
            $this->agregar(sprintf("%.3F g %.2F %.2F %.2F %.2F re f", $relleno, $x, $yPdf, $ancho, $alto));
        }
        if ($grosor > 0) {
            $this->agregar(sprintf("0 G %.2F w %.2F %.2F %.2F %.2F re S", $grosor, $x, $yPdf, $ancho, $alto));
        }
        return $this;
    }

    public function linea($x1, $y1, $x2, $y2, $grosor = 0.8)
    {
        $this->agregar(sprintf(
            "0 G %.2F w %.2F %.2F m %.2F %.2F l S",
            $grosor, $x1, self::ALTO - $y1, $x2, self::ALTO - $y2
        ));
        return $this;
    }

    public function matrizQr($matriz, $x, $y, $lado)
    {
        $n = count($matriz);
        $borde = 4;
        $total = $n + $borde * 2;
        $paso = $lado / $total;

        $this->agregar(sprintf("1 g %.2F %.2F %.2F %.2F re f", $x, self::ALTO - $y - $lado, $lado, $lado));

        $piezas = ['0 g'];
        for ($fila = 0; $fila < $n; $fila++) {
            $col = 0;
            while ($col < $n) {
                if (!$matriz[$fila][$col]) { $col++; continue; }
                $ancho = 0;
                while ($col + $ancho < $n && $matriz[$fila][$col + $ancho]) $ancho++;
                $piezas[] = sprintf(
                    "%.3F %.3F %.3F %.3F re",
                    $x + ($col + $borde) * $paso,
                    self::ALTO - $y - ($fila + $borde + 1) * $paso,
                    $ancho * $paso + 0.05,
                    $paso + 0.05
                );
                $col += $ancho;
            }
        }
        $piezas[] = 'f';
        $this->agregar(implode(' ', $piezas));
        return $this;
    }

    public function salida()
    {
        $contenido = implode("\n", $this->partes);

        $objetos = [];
        $objetos[1] = "<< /Type /Catalog /Pages 2 0 R >>";
        $objetos[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
        $objetos[3] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " . sprintf('%.2F %.2F', self::ANCHO, self::ALTO) . "]"
            . " /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>";
        $objetos[4] = "<< /Length " . strlen($contenido) . " >>\nstream\n" . $contenido . "\nendstream";
        $objetos[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
        $objetos[6] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $posiciones = [];
        foreach ($objetos as $numero => $cuerpo) {
            $posiciones[$numero] = strlen($pdf);
            $pdf .= "$numero 0 obj\n$cuerpo\nendobj\n";
        }

        $inicioXref = strlen($pdf);
        $cantidad = count($objetos) + 1;
        $pdf .= "xref\n0 $cantidad\n0000000000 65535 f \n";
        for ($i = 1; $i <= count($objetos); $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $posiciones[$i]);
        }
        $pdf .= "trailer\n<< /Size $cantidad /Root 1 0 R >>\nstartxref\n$inicioXref\n%%EOF\n";

        return $pdf;
    }
}
