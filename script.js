const entities = {
    libro: {
        title: "Libro",
        fields: [
            { label: "Codice ISBN", name: "isbn", searchable: true, numeric: true},
            { label: "Titolo", name: "titolo", searchable: true },
            { label: "Anno", name: "anno", searchable: true, numeric: true },
            { label: "N. pagine", name: "numPagine", searchable: false, numeric: true },
            { label: "N. ricette", name: "numRicette", searchable: false, numeric: true }
        ]
    },
    ricetta: {
        title: "Ricetta",
        fields: [
            { label: "Numero", name: "numero", searchable: true, numeric: true },
            { label: "Nome", name: "nome", searchable: true },
            { label: "Tipo", name: "tipo", searchable: true },
            { label: "Regione", name: "regioni", searchable: false },
            { label: "N. pubblicazioni", name: "numPubblicazioni", searchable: false, numeric: true }
        ]
    },
    regione: {
        title: "Regione",
        fields: [
            { label: "Codice", name: "codice", searchable: true, numeric: true},
            { label: "Nome", name: "nome", searchable: true },
            { label: "N. ricette", name: "numRicette", searchable: false, numeric: true }
        ]
    }
};

function showEntity(entityName) {
    const entity = entities[entityName];

    let html = `
        <h2>${entity.title}</h2>
        <form id="searchForm">
    `;

    entity.fields.forEach(field => {
		if (field.searchable === false) return;
        html += `
			<label>${field.label}</label>
			<input
				type="text"
				name="${field.name}"
			>
        `;
    });
	
	html += `<input type="hidden" name="entity" value="${entityName}">`;
    html += `
            <button type="submit">
                Cerca <i class="fa-solid fa-magnifying-glass"></i>
            </button>

		</form>
		`;
    $('#search').html(html);
}

$(function() {
	$('.menu-item').click(function() {
		$('.menu-item').removeClass('selected');
		$(this).addClass('selected');

		const entity = $(this).data('type');
		showEntity(entity);
		$('#result').empty();
		$('#resultHint').hide();
	});
	
	$('.menu-item').first().addClass('selected');
	showEntity("libro");
});

$(document).on("submit", "#searchForm", function(e) {
	e.preventDefault();

	const entityName = $(this).find('[name="entity"]').val();

	$.ajax({
		url: "searches/search.php",
		method: "POST",
		data: $(this).serialize(),
		dataType: "json",
		success: function(data) {
			renderResults(entityName, data);
		},
		error: function() {
			$("#result").html("<p>Si è verificato un errore durante la ricerca.</p>");
		}
	});
});

function renderResults(entityName, data) {
	const entity = entities[entityName];

	if (!Array.isArray(data) || data.length === 0) {
		$('#resultHint').hide();
		$('#result').html('<p>Nessun risultato trovato.</p>');
		return;
	}

	$('#resultHint').show();

	let html = '<table id="resultsTable"><thead><tr>';
	entity.fields.forEach(field => {
		html += `<th>${field.label}</th>`;
	});
	html += '</tr></thead><tbody></tbody></table>';
	$('#result').html(html);

	const $tbody = $('#resultsTable tbody');
	data.forEach(row => {
		const $tr = $('<tr>');
		entity.fields.forEach(field => {
			const value = row[field.name] ?? '';
			const $td = $('<td>').text(value);
			if (field.numeric) $td.addClass('numeric');
			$tr.append($td);
		});
		$tr.data('rowData', row);
		$tr.data('entityName', entityName);
		$tbody.append($tr);
		}
	);
}

$(document).on('click', '#resultsTable tbody tr', function () {
	const row = $(this).data('rowData');
	const entityName = $(this).data('entityName');
	showDetailModal(entityName, row);
});

$(document).on('click', '#new_recipe', function () {
	renderCrudRecipeDetail();
	$('#detailModal').fadeIn(150);
});

const entityDetailRenderers = {
	ricetta: renderRicettaDetail,
	libro: renderLibroDetail,
	regione: renderRegioneDetail
};

function showDetailModal(entityName, row) {
	const entity = entities[entityName];
	$('#modalTitle').text(entity.title);

	if (entityDetailRenderers[entityName]) {
		entityDetailRenderers[entityName](row);
	} else {
		renderDefaultDetail(entity, row);
	}
	
	$('#detailModal').fadeIn(150);
}

function renderDefaultDetail(entity, row) {
	let bodyHtml = '';
	entity.fields.forEach(field => {
		const value = row[field.name] ?? '';
		bodyHtml += `<dt>${field.label}</dt><dd>${$('<div>').text(value).html()}</dd>`;
	});
	$('#modalBody').html(bodyHtml);
}

function renderRicettaDetail(row) {
	$('#modalTitle').html(row.nome + " <i class='fa-solid fa-scroll'></i>");
	$('#modalBody').html('<p>Caricamento dettagli...</p>');

	const ingredientiRequest = $.ajax({
		url: 'searches/get_ingredienti.php',
		method: 'POST',
		data: { numero: row.numero },
		dataType: 'json'
	});

	const pubblicazioniRequest = $.ajax({
		url: 'searches/get_pubblicazioni.php',
		method: 'POST',
		data: { numero: row.numero },
		dataType: 'json'
	});

	$.when(ingredientiRequest, pubblicazioniRequest).done(function(ingredientiResult, pubblicazioniResult) {
		const ingredienti = ingredientiResult[0];
		const pubblicazioni = pubblicazioniResult[0];

		let html = '';
		entities.ricetta.fields.forEach(field => {
			if (field.name === 'nome') return; // already shown as the modal title
			const value = row[field.name] ?? '';
			html += `<dt>${field.label}</dt><dd>${$('<div>').text(value).html()}</dd>`;
		});

		html += '<h4>Ingredienti</h4>';
		if (!Array.isArray(ingredienti) || ingredienti.length === 0) {
			html += '<p>Nessun ingrediente trovato.</p>';
		} else {
			html += '<table class="modal-table"><thead><tr><th>Ingrediente</th><th>Quantità</th></tr></thead><tbody>';
			ingredienti.forEach(item => {
				const ingrediente = $('<div>').text(item.ingrediente).html();
				const quantita = $('<div>').text(item.quantita).html();
				html += `<tr><td>${ingrediente}</td><td>${quantita}</td></tr>`;
			});
			html += '</tbody></table>';
		}

		html += '<h4>Pubblicazioni</h4>';
		if (!Array.isArray(pubblicazioni) || pubblicazioni.length === 0) {
			html += '<p>Nessuna pubblicazione trovata.</p>';
		} else {
			html += '<ul class="modal-list">';
			pubblicazioni.forEach(item => {
				const libro = $('<div>').text(item.libro).html();
				const pagina = $('<div>').text(item.numeroPagina).html();
				html += `<li>${libro} (pagina ${pagina})</li>`;
			});
			html += '</ul>';
		}

		html += `<button id='edit-recipe' data-id='${row.numero}'>Modifica <i class='fa-solid fa-pen'></i></button>`;
		html += `<button id='delete-recipe' data-id='${row.numero}'>Elimina <i class='fa-solid fa-trash-can'></i></button>`;

		$('#modalBody').html(html);
	}).fail(function() {
		$('#modalBody').html('<p>Errore nel caricamento dei dettagli.</p>');
	});
}

function renderLibroDetail(row) {
	$('#modalTitle').html(row.titolo + " <i class='fa-solid fa-book'></i>");
	$('#modalBody').html('<p>Caricamento pubblicazioni...</p>');

	$.ajax({
		url: 'searches/get_pubblicazioni_libro.php',
		method: 'POST',
		data: { isbn: row.isbn },
		dataType: 'json',
		success: function(data) {
			let html = '';
			entities.libro.fields.forEach(field => {
				if (field.name === 'titolo') return; // already shown as the modal title
				const value = row[field.name] ?? '';
				html += `<dt>${field.label}</dt><dd>${$('<div>').text(value).html()}</dd>`;
			});

			html += '<h4>Pubblicazioni</h4>';
			if (!Array.isArray(data) || data.length === 0) {
				html += '<p>Nessuna pubblicazione trovata.</p>';
			} else {
				html += '<ul class="modal-list">';
				data.forEach(item => {
					const titolo = $('<div>').text(item.titolo).html();
					const pagina = $('<div>').text(item.numeroPagina).html();
					html += `<li>${titolo} (pagina ${pagina})</li>`;
				});
				html += '</ul>';
			}

			$('#modalBody').html(html);
		},
		error: function() {
			$('#modalBody').html('<p>Errore nel caricamento delle pubblicazioni.</p>');
		}
	});
}

function renderRegioneDetail(row) {
	$('#modalTitle').html(row.nome + " <i class='fa-solid fa-earth-americas'></i>");
	$('#modalBody').html('<p>Caricamento ricette...</p>');

	$.ajax({
		url: 'searches/get_ricette_regionali.php',
		method: 'POST',
		data: { cod: row.codice },
		dataType: 'json',
		success: function(data) {
			let html = '';
			entities.regione.fields.forEach(field => {
				if (field.name === 'nome') return; // already shown as the modal title
				const value = row[field.name] ?? '';
				html += `<dt>${field.label}</dt><dd>${$('<div>').text(value).html()}</dd>`;
			});

			html += '<h4>Ricette regionali</h4>';
			if (!Array.isArray(data) || data.length === 0) {
				html += '<p>Nessuna ricetta trovata.</p>';
			} else {
				html += '<ul class="modal-list">';
				data.forEach(item => {
					const titolo = $('<div>').text(item.titolo).html();
					html += `<li>${titolo}</li>`;
				});
				html += '</ul>';
			}

			$('#modalBody').html(html);
		},
		error: function() {
			$('#modalBody').html('<p>Errore nel caricamento delle ricette.</p>');
		}
	});
}

function renderCrudRecipeDetail() {
	$('#modalTitle').html("Nuova Ricetta <i class='fa-solid fa-scroll'></i>");
	$('#modalBody').html("Caricamento...");

	let selectBook = '';
	let selectPage = "<select name='pagina' id='pagina-ricetta-nuova' required><option value=''>--Scegli pagina--</option></select>";
	let selectRegion = '';

	$.ajax({
		url: 'searches/get_crud_info.php',
		method: 'GET',
		success: function(data) {
			//libri
			selectBook = "<select name='isbn' id='libro-ricetta-nuova' required><option value=''>--Seleziona libro--</option>";
			data["libri"].forEach(item => {
				selectBook += `<option value='${item.codISBN}'>${item.titolo}</option>`;
			});
			selectBook += "</select>";
			//regioni
			selectRegion = "<select name='regione' required><option value=''>--Seleziona regione--</option>";
			data["regioni"].forEach(item => {
				selectRegion += `<option value='${item.cod}'>${item.nome}</option>`;
			});
			selectRegion += "</select>";

			$('#modalBody').html(`
				<form id='createForm' class='popup'>
					<label>Titolo</label>
					<input type='text' name='titolo' required/>

					<label>Tipo</label>
					<select name='tipo' required>
						<option value=''>--Seleziona tipo--</option>
						<option value='antipasto'>Antipasto</option>
						<option value='primo'>Primo</option>
						<option value='secondo'>Secondo</option>
						<option value='contorno'>Contorno</option>
						<option value='dessert'>Dessert</option>
					</select>
					
					<label>Libro</label>
					${selectBook}

					<label>Pagina</label>
					${selectPage}

					<label>Regione</label>
					${selectRegion}

					<button type='submit'>Crea +</button>
				</form>
			`);
		},
		error: function() {
			$('#modalBody').html('<p>Errore nel caricamento dei dati.</p>');
		}
	});
}

$(document).on("submit", "#createForm", function(e) {
	e.preventDefault();

	$.ajax({
		url: "crud/post_ricetta.php",
		method: "POST",
		data: $(this).serialize(),
		dataType: "json",
		success: function(data) {
			window.location.reload();
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
});

$(document).on('change', '#libro-ricetta-nuova', function() {
	$.ajax({
		url: 'searches/get_pages.php',
		method: 'GET',
		data: { 'isbn': $(this).val() },
		dataType: 'json',
		success: function(data) {
			let html = "<option value=''>--Scegli pagina--</option>";
			data.forEach((item) => {
				html += `<option value='${item.numeroPagina}'>${item.numeroPagina}</option>`;
			});
			$("#pagina-ricetta-nuova").html(html);
		},
		error: function() {
			$('#modalBody').html('<p>Errore nel caricamento delle pagine.</p>');
		}
	});
});

$(document).on('click', '#delete-recipe', function() {
	$.ajax({
		url: 'crud/delete_ricetta.php',
		method: 'POST',
		data: { 'numero': $(this).data("id") },
		dataType: 'json',
		success: function(data) {
			window.location.reload();
		},
		error: function(err) {
			console.log(err.responseText);
		}
	});
});

$(document).on('click', '#modalClose', closeModal);
$(document).on('click', '#detailModal', function (e) {
	if (e.target === this) closeModal(); // only close on backdrop click, not inside the box
});
$(document).on('keydown', function (e) {
	if (e.key === 'Escape') closeModal();
});

function closeModal() {
	$('#detailModal').fadeOut(150);
}
