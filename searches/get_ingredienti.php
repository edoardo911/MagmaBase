<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

require_once __DIR__."/../models/ricetta.php";
header('Content-Type: application/json');

$numero = $_POST['numero'] ?? null;

if (!is_numeric($numero)) {
    http_response_code(400);
    echo json_encode(['error' => 'Numero non valido']);
    exit;
}

$ricetta = new Ricetta();
echo json_encode($ricetta->getIngredienti((int) $numero));