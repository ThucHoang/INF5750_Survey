/*
 * Created by Thuc Hoang and Nguyen Cong Nguyen
 *
 * Fetching data from DHIS2 (if localhost it will fetch data from pre-saved json files)
 */

function getUserData() {
	$('#loginInfo').empty();
	var userUrl = getHost() + '/api/me.json';
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
	var url = getHost() + '/api/programs.json';
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
	$('#formSelector').empty();
	var programListFormString = new String();

	$.each(json.programs, function(index, value) {
		if(value.type == 3) {
		programListFormString += '<option value="' + value.id + '">' + value.name + '</option>';
		//programListFormString += '<li><a href="#" data-id="' + value.id + '">' + value.name + '</a></li>';
		}
	});
	$('#formSelector').append(programListFormString);
}
	/*
	$('#dataElementList li a').click(function() {
		$('#program button').text($(this).text());
		getProgramStages($(this).text());
	}); 
	//$('#programStagesElementList').append('<option value="#">Select one of the stages...</option>');
}
*/
function getProgramStages() {
	var selectedProgram = document.getElementById("formSelector").selectedIndex;
	var allPrograms = document.getElementById("formSelector").options;
	// hente ut id (data)
	// hent navn til valg, sett til $('#program button').text(name);
	//var psId = $('#dataElementList li a').attr('data-id');
	//console.log(psId);
	var programStageUrl = getHost() + '/api/programs/' + allPrograms[selectedProgram].value + '.json';
	console.log("Programstage: " + programStageUrl);

	$.ajax({
		url: programStageUrl,
		contentType: 'application/json',
		dataType: 'json'
	}).success(function(data) {
		getDataElements(data.programStages[0].id);
	}).error(function(data) {
		console.log("PROGRAMSTAGE ERROR");
	})
} 

function getDataElements(id) {
	var dataElementsUrl = getHost() + '/api/programStages/' + id + '.json';
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
/*
function getDataElements(id) {
	var datael = 'http://apps.dhis2.org/demo/api/dataElements/' + id + '.json';
	console.log("DataElements: ") + datael;

	$.ajax({
		url: datael,
		contentType: 'application/json',
		dataType: 'json'
	}).success(function(data) {
		populateDataElements(data);
	}).error(function(data) {
		console.log("DataElements ERROR!");
	})
}

function populateDataElements(json) {
	console.log(json.name);
	if(json.optionSet != null) {
		getOptionSets(json.optionSet.id);
	}
}

function getOptionSets(id) {
	var optionSetUrl = 'http://apps.dhis2.org/demo/api/optionSets/' + id + '.json';
	console.log("OptionSet: " + optionSetUrl);

	$.ajax({
		url: optionSetUrl,
		contentType: 'application/json',
		dataType: 'json'
	}).success(function(data) {
		populateOptionSetList(data);
	}).error(function(data) {
		console.log("OptionSets ERROR!");
	})
}

function populateOptionSetList(json) {
	if(json.name == "Gender") {
		for(var i = 0; i < json.options.length; i++) {
			console.log(i + ": " + json.options[i]);
		}	
	}
}*/