function getUserData() {
	var userUrl = 'http://apps.dhis2.org/demo/api/me';
	console.log("Henter brukerdata fra: " + userUrl);

	$.ajax({
		url: userUrl,
		contentType: "application/json",
		dataType: 'json'
	}).success(function(data) {
		var userLoggedIn = 'Currently logged in as ' + data.organisationUnits[0].name + '/<b>' + data.name + '</b> (' + data.email + ')';
		$('#loginInfo').append(userLoggedIn);
	}).error(function(data) {
		console.log("Error...");
	})
}

function getDataSets() {
	var url = 'http://apps.dhis2.org/demo/api/programs.json';
	console.log("Henter data fra: " + url);

	$.ajax({
		url: url,
		contentType: "application/json",
		dataType: 'json'
	}).success(function(data) {
		populateProgramList(data);
	}).error(function(data) {
		console.log("DATASET ERROR " + data);
	})
};

function populateProgramList(json) {
	$('#dataElementTable').empty();
	var programListFormString = new String();

	$.each(json.programs, function(index, value) {
		if(value.kind == 'SINGLE_EVENT_WITHOUT_REGISTRATION') {
			programListFormString += '<li><a href="#" data-id="' + value.id + '">' + value.name + '</a></li>';
		}
	});

	$('#dataElementList').append(programListFormString);
	$('#dataElementList li a').click(function() {
		$('#program button').text($(this).text());
		getProgramStages();
		console.log($(this));
	});
	//$('#programStagesElementList').append('<option value="#">Select one of the stages...</option>');
}

function getProgramStages() {
	console.log($('dataElementList'));
	// hente ut id (data)
	// hent navn til valg, sett til $('#program button').text(name);
	var psId = $('#dataElementList li a').attr('data-id');
	console.log(psId);
	var programStageUrl = 'http://apps.dhis2.org/demo/api/programs/' + psId + '.json';
	console.log("Programstage: " + programStageUrl);

	$.ajax({
		url: programStageUrl,
		contentType: 'application/json',
		dataType: 'json'
	}).success(function(data) {
		populateProgramStageList(data);
	}).error(function(data) {
		console.log("PROGRAMSTAGE ERROR");
	})
} 

function populateProgramStageList(json) {
	$('#programStagesElementList').empty();
	var programStageListString = new String();
	var options = json.programStages.length;

	console.log(json.programStages.length);
	if(options == 1) {
		document.getElementById('stage').style.display = 'inline';
		// hent navn til valg, sett til $('#stage button').text(json.programStages[0].name);
		getDataElementsWithId(json.programStages[0].id);
	}
	else if(options > 1) {

		$.each(json.programStages, function(index, value) {
			programStageListString += '<li><a href="#" data-id="' + value.id + '">' + value.name + '</a></li>';
		});

		$('programStagesElementList').append(programStageListString);
		$('#programStagesElementList li a').click(function() {
			$('#stage button').text($(this).text());
			getDataElements();
		})
		//$('#programStagesElementList').append(programStageListFormString);
		// append input med tekst select stage
		// append string to element
		// add onchange listener
	}
}

function getDataElements() {
	getDataElementsWithId($('#programStagesElementList li a').attr('data-id'));
}

function getDataElementsWithId(deId) {
	var dataElementsUrl = 'http://apps.dhis2.org/demo/api/programStages/' + deId + '.json';
	console.log("Data elements: " + dataElementsUrl);

	$.ajax({
		url: dataElementsUrl,
		contentType: 'application/json',
		dataType: 'json'
	}).success(function(data) {
		populateDataElementList(data);
	}).error(function(data) {
		console.log("DATAELEMENT ERROR!");
	})
}

function populateDataElementList(json) {
	$('#dataElementTable').empty();
	var dataElementListTableString = '<tr><td>Name</td><td>ID</td>';

	$.each(json.programStageDataElements, function(index, value) {
		dataElementListTableString += '<tr><td>' + value.dataElement.name + '</td><td>' + value.dataElement.id + '</td></tr>'; 
	})
	$('#dataElementTable').append(dataElementListTableString);
}