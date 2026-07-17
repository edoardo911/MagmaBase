<?php
require_once "Database.php";

class Libro
{
	private PDO $db;
	
	public function __construct()
	{
		$this->db = Database::getConnection();
	}
	
	public function search(array $filters): array
	{
		$sql = "SELECT * FROM Libro WHERE codISBN LIKE :isbn AND titolo LIKE :titolo";
		$params = [
			":isbn" => "%" . ($filters["isbn"] ?? "") . "%",
			":titolo" => "%" . ($filters["titolo"] ?? "") . "%",
		];
		
		if(!empty($filters["anno"])) {
			$sql .= " AND anno = :anno";
			$params[":anno"] = $filters["anno"];
		}
		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>