<?php
require_once "Database.php";
class Regione
{
	private PDO $db;
	
	public function __construct()
	{
		$this->db = Database::getConnection();
	}
	
	public function search(array $filters): array
	{
		$sql = "SELECT cod AS codice, nome,
		               (SELECT COUNT(*) FROM RicettaRegionale WHERE RicettaRegionale.regione = Regione.cod) AS numRicette
		        FROM Regione
		        WHERE nome LIKE :nome";
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

	public function getRicetteOriginali(string $cod): array
	{
		$sql = "SELECT ri.titolo AS titolo
				FROM RicettaRegionale rr
				JOIN Ricetta ri ON ri.numero = rr.ricetta
				WHERE rr.regione = :cod";
		$stmt = $this->db->prepare($sql);
		$stmt->execute([":cod" => $cod]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>