<?php
class RicettaRegionale
{
	private int $regione;
	private int $ricetta;
	
	public function __construct($regione, $ricetta)
	{
		$this->regione = $regione;
		$this->ricetta = $ricetta;
	}
	
	public function toArray(): array
	{
		return [
			'regione': $this->regione,
			'ricetta': $this->ricetta
		];
	}
}

class RicettaPubblicata
{
	private int $numeroRicetta;
	private int $libro;
	private int $numeroPagina;
	
	public function __construct($numeroRicetta, $libro, $numeroPagina)
	{
		$this->numeroRicetta = $numeroRicetta;
		$this->libro = $libro;
		$this->numeroPagina = $numeroPagina;
	}
	
	public function toArray(): array
	{
		return [
			'numeroRicetta': $this->numeroRicetta,
			'libro': $this->libro,
			'numeroPagina': $this->numeroPagina
		];
	}
}
?>