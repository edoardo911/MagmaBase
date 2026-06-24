<?php
class Regione
{
	private int $cod;
	private string $nome;
	
	public function __construct($cod, $nome)
	{
		$this->cod = $cod;
		$this->nome = $nome;
	}
	
	public function toArray(): array
	{
		return [
			'cod': $this->cod,
			'nome': $this->nome
		];
	}
}
?>