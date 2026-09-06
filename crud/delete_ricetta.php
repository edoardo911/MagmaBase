<?php
require_once __DIR__."/../models/ricetta.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$numero = $_POST['numero'] ?? null;

if (empty($numero)) {
    http_response_code(400);
    echo json_encode(['error' => 'Input non validi']);
    exit;
}

$ricetta = new Ricetta();
$ricetta->delete($numero);
echo json_encode([
	'success' => true
]);