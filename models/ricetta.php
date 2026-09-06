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
	
	public function getIngredienti(int $numero): array
	{
		$sql = "SELECT ingrediente, quantita FROM Ingrediente WHERE numeroRicetta = :numero";
		$stmt = $this->db->prepare($sql);
		$stmt->execute([":numero" => $numero]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public function getPubblicazioni(int $numero): array
	{
		$sql = "SELECT l.titolo AS libro, rp.numeroPagina
				FROM RicettaPubblicata rp
				JOIN Libro l ON l.codISBN = rp.libro
				WHERE rp.numeroRicetta = :numero";
		$stmt = $this->db->prepare($sql);
		$stmt->execute([":numero" => $numero]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public function create(string $titolo, string $tipo): void
	{
		$sql = "INSERT INTO Ricetta(titolo, tipo) values(:titolo, :tipo)";
		$params = [
			":titolo" => $titolo,
			":tipo" => $tipo,
		];

		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
	}

	public function getDatiRicetta($id): array
	{
		$sql = "SELECT titolo, tipo FROM Ricetta WHERE numero = :id";
		$params = [
			":id" => $id,
		];

		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function update($id, $titolo, $tipo): void
	{
		$sql = "UPDATE Ricetta SET titolo = :titolo, tipo = :tipo WHERE numero = :id";
		$params = [
			":id" => $id,
			":titolo" => $titolo,
			":tipo" => $tipo,
		];

		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
	}
	
	public function delete($numero): void
	{
		$sql = "DELETE FROM Ricetta WHERE numero = :numero";
		$params = [
			":numero" => $numero
		];
		$stmt = $this->db->prepare($sql);
		$stmt->execute($params);
	}
}
?>