<?php
require_once __DIR__."/../models/regione.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$cod = $_POST['cod'] ?? null;

if ($cod === null || $cod === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Codice regione non valido']);
    exit;
}

$regione = new Regione();
echo json_encode($regione->getRicetteOriginali($cod));