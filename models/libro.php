<?php
class Regione
{
	private int $codISBN;
	private string $titolo;
	private int $anno;
	
	public function __construct($codISBN, $titolo, $anno)
	{
		$this->codISBN = $codISBN;
		$this->titolo = $titolo;
		$this->anno = $anno;
	}
	
	public function toArray(): array
	{
		return [
			'codISBN': $this->codISBN,
			'titolo': $this->titolo,
			'anno': $this->anno
		];
	}
}
?>