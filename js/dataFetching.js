function getUserData() {
	var userUrl = 'http://apps.dhis2.org/demo/api/me';
	console.log("Henter brukerdata fra: " + userUrl);

	$.ajax({
		url: userUrl,
		contentType: "application/json",
		dataType: 'json'
	}).success(function(data) {
		var userLoggedIn = 'Currently logged in as ' + data.name + ' (' + data.birthday + ')';
		$('#navbar-text').append(userLoggedIn);
		console.log(userLoggedIn);
		console.log("Bruker: " + data.name);
		console.log("Bursdag: " + data.birthday);
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
	var programListFormString = '<option value="#">Select one of the programs...</option>';
	$.each(json.programs, function(index, value) {
		if(value.kind == 'SINGLE_EVENT_WITHOUT_REGISTRATION') {
		programListFormString += '<option value="' + value.id + '">' + value.name + '</option>';
			console.log(index + ": " + value.name + " & " + value.id);
			}
		});
	$('#dataElementList').append(programListFormString);
	//$('#programStagesElementList').append('<option value="#">Select one of the stages...</option>');
}

function getProgramStages(id) {
	var programStageUrl = 'http://apps.dhis2.org/demo/api/programs/' + id + '.json';
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
	var programStageListFormString = new String();
	$.each(json.programStages, function(index, value) {
		programStageListFormString += '<option value="' + value.id + '">' + value.name + '</option>';
	});
	$('#programStagesElementList').append(programStageListFormString);
}

function getDataElements(id) {
	var dataElementsUrl = 'http://apps.dhis2.org/demo/api/programStages/' + id + '.json';
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
	var dataElementListTableString = '<tr>';

	$.each(json.programStageDataElements, function(index, value) {
		dataElementListTableString += '<td>' + value.name + '</td><td>' + value.id + '</td>'; 
	})
	dataElementListTableString += '</tr>';
	$('#dataElementTable').append(dataElementListTableString);
}