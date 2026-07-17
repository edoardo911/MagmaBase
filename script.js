const entities = {
    libro: {
        title: "Libro",
        fields: [
            {
                label: "Codice ISBN",
                name: "isbn"
            },
            {
                label: "Titolo",
                name: "titolo"
            },
			{
				label: "Anno",
				name: "anno"
			}
        ]
    },

    ricetta: {
        title: "Ricetta",
        fields: [
            {
                label: "Numero",
                name: "numero"
            },
			{
				label: "Nome",
				name: "nome"
			},
			{
				label: "Tipo",
				name: "tipo"
			}
        ]
    },

    regione: {
        title: "Regione",
        fields: [
			{
				label: "Codice",
				name: "codice"
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
	
	$.ajax({
		url: "search.php",
		method: "POST",
		data: $(this).serialize(),
		success: function(data) {
			$("#result").html(data);
		},
	});
});