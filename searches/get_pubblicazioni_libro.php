<?php
require_once __DIR__."/../models/libro.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$isbn = $_POST['isbn'] ?? null;

if (empty($isbn)) {
    http_response_code(400);
    echo json_encode(['error' => 'ISBN non valido']);
    exit;
}

$libro = new Libro();
echo json_encode($libro->getPubblicazioni($isbn));