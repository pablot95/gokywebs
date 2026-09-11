<?php
declare(strict_types=1);

/**
 * Devuelve la ruta pública con las mayúsculas reales del sistema de archivos.
 * Si no existe una coincidencia única y segura, devuelve null.
 */
function gokyCanonicalPath(string $documentRoot, string $requestPath): ?string
{
    $path = parse_url($requestPath, PHP_URL_PATH);
    if (!is_string($path)) {
        return null;
    }

    $path = rawurldecode($path);
    if ($path === '' || $path === '/') {
        return '/';
    }

    if (str_contains($path, "\0")) {
        return null;
    }

    $root = realpath($documentRoot);
    if ($root === false || !is_dir($root)) {
        return null;
    }

    $segments = array_values(array_filter(
        explode('/', trim(str_replace('\\', '/', $path), '/')),
        static fn (string $segment): bool => $segment !== ''
    ));

    $current = $root;
    $canonicalSegments = [];
    $lastIndex = count($segments) - 1;

    foreach ($segments as $index => $segment) {
        if ($segment === '.' || $segment === '..' || str_starts_with($segment, '.')) {
            return null;
        }

        $entries = @scandir($current);
        if ($entries === false) {
            return null;
        }

        $matches = [];
        foreach ($entries as $entry) {
            if ($entry === '.' || $entry === '..') {
                continue;
            }

            if ($entry === $segment) {
                $matches = [$entry];
                break;
            }

            if (strcasecmp($entry, $segment) === 0) {
                $matches[] = $entry;
            }
        }

        if (count($matches) !== 1) {
            return null;
        }

        $entry = $matches[0];
        $next = realpath($current . DIRECTORY_SEPARATOR . $entry);
        if ($next === false) {
            return null;
        }

        $insideRoot = $next === $root || str_starts_with($next, $root . DIRECTORY_SEPARATOR);
        if (!$insideRoot || ($index < $lastIndex && !is_dir($next))) {
            return null;
        }

        $canonicalSegments[] = rawurlencode($entry);
        $current = $next;
    }

    $canonical = '/' . implode('/', $canonicalSegments);
    if (is_dir($current)) {
        $canonical .= '/';
    }

    return $canonical;
}

if (defined('GOKY_CASE_ROUTER_TESTING')) {
    return;
}

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestPath = parse_url($requestUri, PHP_URL_PATH);
$requestPath = is_string($requestPath) ? $requestPath : '/';
$canonicalPath = gokyCanonicalPath(__DIR__, $requestPath);

// Evita redirigir una URL canónica que haya dado 404 por otro motivo.
if ($canonicalPath !== null && rawurldecode($canonicalPath) !== rawurldecode($requestPath)) {
    $query = $_SERVER['QUERY_STRING'] ?? '';
    $location = $canonicalPath . ($query !== '' ? '?' . $query : '');
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $status = in_array($method, ['GET', 'HEAD'], true) ? 301 : 308;

    header('Location: ' . $location, true, $status);
    exit;
}

http_response_code(404);
header('Content-Type: text/html; charset=UTF-8');

$notFoundPage = __DIR__ . DIRECTORY_SEPARATOR . '404.html';
if (is_file($notFoundPage)) {
    readfile($notFoundPage);
    exit;
}

echo '<!doctype html><html lang="es"><meta charset="utf-8"><title>Página no encontrada</title><h1>Página no encontrada</h1></html>';
