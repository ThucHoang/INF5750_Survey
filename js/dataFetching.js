/*
 * Created by Thuc Hoang and Nguyen Cong Nguyen
 *
 * Fetching data from DHIS2 (if localhost it will fetch data from pre-saved json files)
 */

 function getUserData() {
 	$('#loginInfo').empty();
 	var url = getHost() + '/api/me.json';
 	console.log("Henter brukerdata fra: " + url);

 	$.ajax({
 		url: url,
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
 	if(json.programs.length > 1) {
 		programListFormString += '<option value="#">Select one of the programs below</option>'
 	}
 	$.each(json.programs, function(index, value) {
 		if(value.type == 3) {
 			programListFormString += '<option value="' + value.id + '">' + value.name + '</option>';
 		}
 	});
 	$('#formSelector').append(programListFormString);
 }

 function getProgramStages() {
 	var selectedProgram = document.getElementById("formSelector").selectedIndex;
 	var allPrograms = document.getElementById("formSelector").options;
 	var url = getHost() + '/api/programs/' + allPrograms[selectedProgram].value + '.json';
 	console.log("Programstage: " + url);

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		getDataElements(data.programStages[0].id);
 	}).error(function(data) {
 		console.log("PROGRAMSTAGE ERROR");
 	})
 } 

 function getDataElements(id) {
 	var url = getHost() + '/api/programStages/' + id + '.json';
 	console.log("Data elements: " + url);

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		$('#formData').empty();
 		$.each(data.programStageDataElements, function(index, value) {
 			$('#formData').append('<p id="' + value.dataElement.id + '"></p>')
 			getDataElementsInfo(value.dataElement.id);
 		});
 	}).error(function(data) {
 		console.log("DATAELEMENT ERROR!");
 	})
 }

 function getDataElementsInfo(id) {
 	var url = getHost() + '/api/dataElements/' + id + '.json';
 	console.log("DataElements: " + id);

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		checkDataElementOptions(data);
 	}).error(function(data) {
 		console.log("DataElements ERROR!");
 	})
 }

 function checkDataElementOptions(json) {
 	if(json.optionSet == null) {
 		populateDataElements(json);
 	}
 	else {
 		getOptionSets(json, json.optionSet.id);
 	}
 }

 function populateDataElements(json) {
 	var dataElementListFormString = new String();
 	
 	if(json.type == "string" && json.textType == "text") {
 		$('#' + json.id).append(json.name + ': <input type="text" name="' + json.name + '"><br />');
 	}
 	if(json.type == "int" && json.numberType == "int") {
 		$('#' + json.id).append(json.name + ': <input type="number" name="' + json.name + '"><br />');
 	}
 	if(json.type == "date" && json.numberType == "number") {
 		$('#' + json.id).append(json.name + ': <input type="date" name="' + json.name + '"><br />');
 	}
 }

 function getOptionSets(json, id) {
 	var optionSetUrl = getHost() + '/api/optionSets/' + id + '.json';
 	console.log(json.name + " optionSet: " + optionSetUrl);

 	$.ajax({
 		url: optionSetUrl,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		populateOptionSetList(json, data);
 	}).error(function(data) {
 		console.log("OptionSets ERROR!");
 	})
 }

 function populateOptionSetList(json, data) {
 	var optionSetListFromString = json.name + ': <select>';
 	for(var i = 0; i < data.options.length; i++) {
 		optionSetListFromString += name + ': ' + '<option value="' + i + '">' + data.options[i] + '</option>';
 	}
 	optionSetListFromString += '</select><br />';
 	$('#' + json.id).append(optionSetListFromString);
 }