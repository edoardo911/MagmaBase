<!DOCTYPE html>
<html>
	<head>
		<title>MAGMABASE</title>
		<meta charset="UTF-8">
	
		<link rel="stylesheet" href="style.css"/>
		
		<script src="https://code.jquery.com/jquery-4.0.0.min.js" integrity="sha256-OaVG6prZf4v69dPg6PhVattBXkcOWQB62pdZ3ORyrao=" crossorigin="anonymous"></script>
		<script src="script.js"></script>
	</head>
	<body>
		<header>
			<span><b>MAGMABASE</b></span>
		</header>
		
		<nav>
			<span class="menu-item" data-type="libro">Libro</span>
			<span class="menu-item" data-type="ricetta">Ricetta</span>
			<span class="menu-item" data-type="regione">Regione</span>
		</nav>
		
		<div class="container">
			<div id="search">
				<span>Filtro Ricerca</span>
			</div>
			
			<div id="content">
				<h2>Risultati della ricerca</h2>
				<div id="result">
				</div>
			</div>
		</div>
		
		<footer>
			<span>Disclaimer: questo è un progetto universitario per UniBG</span>
		</footer>
	</body>
</html>