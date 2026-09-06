<?php
require_once __DIR__."/../models/ricetta.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$id = $_POST['id'] ?? null;
$titolo = $_POST['titolo'] ?? null;
$tipo = $_POST['tipo'] ?? null;

if (empty($id) || empty($titolo) || empty($tipo)) {
    http_response_code(400);
    echo json_encode(['error' => 'Input non validi']);
    exit;
}

$ricetta = new Ricetta();
$ricetta->update($id, $titolo, $tipo);
echo json_encode([
	'success' => true
]);