<?php
require_once "Database.php";

class Pagina
{
	private PDO $db;
	
	public function __construct()
	{
		$this->db = Database::getConnection();
	}
	
	public function search(array $filters): array
	{
		$sql = "SELECT * FROM Regione WHERE nome LIKE :nome";
		$params = [
			":nome" => "%" . ($filters["nome"] ?? "") . "%",
		];
		
		if(!empty($filters["codice"])) {
			$sql .= " AND cod = :codice";
			$params[":codice"] = $filters["codice"];
		}
		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getAll(string $isbn): array
	{
		$sql = "SELECT libro, numeroPagina FROM Pagina WHERE libro = :isbn ORDER BY numeroPagina";
		$params = [
			":isbn" => $isbn
		];
		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>