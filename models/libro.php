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
		$sql = "SELECT l.codISBN AS isbn, l.titolo, l.anno,
					(SELECT COUNT(*) FROM Pagina WHERE Pagina.libro = l.codISBN) AS numPagine,
					(SELECT COUNT(*) FROM RicettaPubblicata WHERE RicettaPubblicata.libro = l.codISBN) AS numRicette
				FROM Libro l
				WHERE l.codISBN LIKE :isbn AND l.titolo LIKE :titolo";
		$params = [
			":isbn"   => "%" . ($filters["isbn"] ?? "") . "%",
			":titolo" => "%" . ($filters["titolo"] ?? "") . "%",
		];
	
		if (!empty($filters["anno"])) {
			$sql .= " AND l.anno = :anno";
			$params[":anno"] = $filters["anno"];
		}
	
		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public function getPubblicazioni(string $isbn): array
	{
		$sql = "SELECT ri.titolo AS titolo, rp.numeroPagina
				FROM RicettaPubblicata rp
				JOIN Ricetta ri ON ri.numero = rp.numeroRicetta
				WHERE rp.libro = :isbn";
		$stmt = $this->db->prepare($sql);
		$stmt->execute([":isbn" => $isbn]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
}
?>