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
                Cerca
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
	$('#modalTitle').text(row.nome);
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

		$('#modalBody').html(html);
	}).fail(function() {
		$('#modalBody').html('<p>Errore nel caricamento dei dettagli.</p>');
	});
}

function renderLibroDetail(row) {
	$('#modalTitle').text(row.titolo);
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
	$('#modalTitle').text(row.nome);
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
