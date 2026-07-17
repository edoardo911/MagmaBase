<?php
require_once "Database.php";

class Ricetta
{
	private PDO $db;
	
	public function __construct()
	{
		$this->db = Database::getConnection();
	}
	
	public function search(array $filters): array
	{
		$sql = "SELECT ri.numero, ri.titolo, ri.tipo FROM Ricetta ri WHERE ri.titolo LIKE :titolo AND ri.tipo LIKE :tipo";
		$params = [
			":titolo" => "%" . ($filters["nome"] ?? "") . "%",
			":tipo" => "%" . ($filters["tipo"] ?? "") . "%",
		];
		
		if(!empty($filters["numero"])) {
			$sql .= " AND ri.numero = :numero";
			$params[":numero"] = $filters["numero"];
		}
		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);		
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>