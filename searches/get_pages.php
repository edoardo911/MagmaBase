<?php
require_once __DIR__."/../models/pagina.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$isbn = $_GET['isbn'] ?? null;

if (empty($isbn)) {
    http_response_code(400);
    echo json_encode(['error' => 'Input non validi']);
    exit;
}

$pagina = new Pagina();
echo json_encode($pagina->getAll($isbn));