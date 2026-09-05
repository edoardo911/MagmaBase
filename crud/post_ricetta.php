<?php
require_once __DIR__."/../models/libro.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$titolo = $_POST['titolo'] ?? null;
$tipo = $_POST['tipo'] ?? null;
$isbn = $_POST['isbn'] ?? null;
$pagina = $_POST['pagina'] ?? null;
$regione = $_POST['regione'] ?? null;

if (empty($titolo) || empty($tipo) || empty($isbn) || empty($pagina)) {
    http_response_code(400);
    echo json_encode(['error' => 'Input non validi']);
    exit;
}

$libro = new Libro();
$libro->getPubblicazioni($titolo, $tipo, $isbn, $pagina, $regione);