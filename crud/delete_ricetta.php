<?php
require_once __DIR__."/../models/ricetta.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$numero = $_POST['numero'] ?? null;

if ($numero === null || $numero === '' || !is_numeric($numero)) {
    http_response_code(400);
    echo json_encode(['error' => 'Input non validi']);
    exit;
}

$ricetta = new Ricetta();
$result = $ricetta->delete((int) $numero);

if (!$result['success']) {
    http_response_code(403);
    echo json_encode(['error' => 'Questa ricetta non può essere eliminata']);
    exit;
}

echo json_encode(['success' => true]);