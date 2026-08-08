<?php
require_once __DIR__."/../models/libro.php";
require_once __DIR__."/../models/ricetta.php";
require_once __DIR__."/../models/regione.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$entity = $_POST["entity"] ?? "";

switch($entity)
{
case "libro":
	$libro = new Libro();
	echo json_encode($libro->search($_POST));
	break;
case "ricetta":
	$ricetta = new Ricetta();
	echo json_encode($ricetta->search($_POST));
	break;
case "regione":
	$regione = new Regione();
	echo json_encode($regione->search($_POST));
	break;
}
?>