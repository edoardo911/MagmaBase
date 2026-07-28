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
		$sql = "SELECT ri.numero, ri.titolo AS nome, ri.tipo,
					GROUP_CONCAT(DISTINCT reg.nome SEPARATOR ', ') AS regioni,
					(SELECT COUNT(*) FROM RicettaPubblicata WHERE RicettaPubblicata.numeroRicetta = ri.numero) AS numPubblicazioni
				FROM Ricetta ri
				LEFT JOIN RicettaRegionale rr ON rr.ricetta = ri.numero
				LEFT JOIN Regione reg ON reg.cod = rr.regione
				WHERE ri.titolo LIKE :titolo AND ri.tipo LIKE :tipo";
		$params = [
			":titolo" => "%" . ($filters["nome"] ?? "") . "%",
			":tipo"   => "%" . ($filters["tipo"] ?? "") . "%",
		];
	
		if (!empty($filters["numero"])) {
			$sql .= " AND ri.numero = :numero";
			$params[":numero"] = $filters["numero"];
		}
	
		$sql .= " GROUP BY ri.numero, ri.titolo, ri.tipo";
	
		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>