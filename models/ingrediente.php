<?php
class Ingrediente
{
	private int $numeroRicetta;
	private int $numero;
	private string $ingrediente;
	private float $quantita;
	
	public function __construct($numeroRicetta, $numero, $ingrediente, $quantita)
	{
		$this->numeroRicetta = $numeroRicetta;
		$this->numero = $numero;
		$this->ingrediente = $ingrediente;
		$this->quantita = $quantita;
	}
	
	public function toArray(): array
	{
		return [
			'numeroRicetta': $this->numeroRicetta,
			'numero': $this->numero,
			'ingrediente': $this->ingrediente,
			'quantita': $this->quantita
		];
	}
}
?>