const entities = {
    libro: {
        title: "Libro",
        fields: [
            {
                label: "Codice ISBN",
                name: "isbn",
				searchable: true
            },
            {
                label: "Titolo",
                name: "titolo",
				searchable: true
            },
			{
				label: "Anno",
				name: "anno",
				searchable: true
			},
			{
				label: "N. pagine",
				name: "numPagine",
				searchable: false
			},
			{
				label: "N. ricette",
				name: "numRicette",
				searchable: false
			}
        ]
    },

    ricetta: {
        title: "Ricetta",
        fields: [
            {
                label: "Numero",
                name: "numero",
				searchable: true
            },
			{
				label: "Nome",
				name: "nome",
				searchable: true
			},
			{
				label: "Tipo",
				name: "tipo",
				searchable: true
			},
			{
				label: "Regione",
				name: "regioni",
				searchable: false
			},
			{
				label: "N. pubblicazioni",
				name: "numPubblicazioni",
				searchable: false
			}
        ]
    },

    regione: {
        title: "Regione",
        fields: [
			{
				label: "Codice",
				name: "cod"
			},
            {
                label: "Nome",
                name: "nome"
            }
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
	});
	
	$('.menu-item').first().addClass('selected');
	showEntity("libro");
});

$(document).on("submit", "#searchForm", function(e) {
	e.preventDefault();

	const entityName = $(this).find('[name="entity"]').val();

	$.ajax({
		url: "search.php",
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
		$('#result').html('<p>Nessun risultato trovato.</p>');
		return;
	}

	let html = '<table id="resultsTable"><thead><tr>';

	entity.fields.forEach(field => {
		html += `<th>${field.label}</th>`;
	});
	html += '</tr></thead><tbody>';

	data.forEach(row => {
		html += '<tr>';
		entity.fields.forEach(field => {
			const value = row[field.name] ?? '';
			html += `<td>${$('<div>').text(value).html()}</td>`;
		});
		html += '</tr>';
	});

	html += '</tbody></table>';

	$('#result').html(html);
}
