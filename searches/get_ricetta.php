<?php
require_once __DIR__."/../models/ricetta.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$id = $_GET['id'] ?? null;

if ($id === null || $id === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Codice ricetta non valido']);
    exit;
}

$ricetta = new Ricetta();
echo json_encode($ricetta->getDatiRicetta($id));