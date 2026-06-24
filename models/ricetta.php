<?php
class Ricetta
{
	private int $numero;
	private string $nome;
	private string $tipo;
	
	public function __construct($numero, $nome, $tipo)
	{
		$this->numero = $numero;
		$this->nome = $nome;
		$this->tipo = $tipo;
	}
	
	public function toArray(): array
	{
		return [
			'numero': $this->numero,
			'nome': $this->nome,
			'tipo': $this->tipo
		];
	}
}
?>