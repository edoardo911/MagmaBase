<?php
class Pagina
{
	private int $libro;
	private int $numeroPagina;
	
	public function __construct($libro, $numeroPagina)
	{
		$this->libro = $libro;
		$this->numeroPagina = $numeroPagina;
	}
	
	public function toArray(): array
	{
		return [
			'libro': $this->libro,
			'numeroPagina': $this->numeroPagina
		];
	}
}
?>