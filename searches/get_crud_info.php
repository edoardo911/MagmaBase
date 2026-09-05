<?php
require_once __DIR__."/../models/libro.php";
require_once __DIR__."/../models/regione.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$libro = new Libro();
$regione = new Regione();
echo json_encode([
	"libri" => $libro->getAll(),
	"regioni" => $regione->getAll(),
]);