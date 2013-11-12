/*
 * Created by Thuc Hoang and Nguyen Cong Nguyen
 *
 * Fetching data from DHIS2 (if localhost it will fetch data from pre-saved json files)
 */

 var bypass = "false";

 function getUserData() {
 	$('#loginInfo').empty();
 	var url = getHost() + '/api/me.json';

 	$.ajax({
 		url: url,
 		contentType: "application/json",
 		dataType: 'json'
 	}).success(function(data) {
 		checkUserCredentials(data);
 		writeLoggedInUser(data);
 	}).error(function(data) {
 		console.log("Error...");
 	})
 }

 function writeLoggedInUser(json) {
 	var userLoggedIn = 'Logged in as ' + json.organisationUnits[0].name + '/<b>' + json.name + '</b> (<a href="' + getHost() + '/dhis-web-commons-security/logout.action" target="_self">Logout</a>)';
 	$('#loginInfo').append(userLoggedIn);
 }

 function checkUserCredentials(json) {
 	var authGroups = json.userCredentials.userAuthorityGroups;
 	for(var i = 0; i < authGroups.length; i++) {
 		if(authGroups[i].name != "Superuser" && json.disabled == "false") {
 			$('#skip-logic').hide();
 		}
 		else {
 			console.log('SUPERUSER DETECTED! SHOW ALL THE SHIT!');
 		}
 	}
 }

 function getDataSets() {
 	var url = getHost() + '/api/programs.json';

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
 	bypass = "false";
 	$('#alertArea').empty();
 	$('#programNameView').empty();
 	var selectedProgram = document.getElementById("formSelector").selectedIndex;
 	var allPrograms = document.getElementById("formSelector").options;
 	var url = getHost() + '/api/programs/' + allPrograms[selectedProgram].value + '.json';

 	if(allPrograms[selectedProgram].value != '#') {
 		$.ajax({
 			url: url,
 			contentType: 'application/json',
 			dataType: 'json'
 		}).success(function(data) {
 			$('#programNameView').append('You have chosen the program: <b>' + data.name + '</b><br /><br />');
 			getDataElements(data.programStages[0].id);
 		}).error(function(data) {
 			console.log("PROGRAMSTAGE ERROR");
 		})
 	} 
 	else {
 		$('#formData').empty();
 	}
 }


 function getDataElements(id) {
 	var url = getHost() + '/api/programStages/' + id + '.json';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		$('#formData').empty();
 		$.each(data.programStageDataElements, function(index, value) {
 			$('#formData').append('<p id="' + value.dataElement.id + '"></p>');
 			getDataElementsInfo(value.dataElement.id);
 		});
 		$('#formData').append('<input type="button" class="btn btn-default" value="Submit form" onclick="submitForm()"></input>');
 	}).error(function(data) {
 		console.log("DATAELEMENT ERROR!");
 	})
 }

 function getDataElementsInfo(id) {
 	var url = getHost() + '/api/dataElements/' + id + '.json';

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
 		$('#' + json.id).append(json.name + ': <input type="text" class="form-control" id="' + json.id + '" name="' + json.name + '">');
 	}
 	if(json.type == "int" && json.numberType == "int") {
 		$('#' + json.id).append(json.name + ': <input type="number" class="form-control" id="' + json.id + '" name="' + json.name + '">');
 	}
 	if(json.type == "date" && json.numberType == "number") {
 		$('#' + json.id).append(json.name + ': <input type="date" class="form-control" id="' + json.id + '" name="' + json.name + '">');
 	}
 }

 function getOptionSets(json, id) {
 	var optionSetUrl = getHost() + '/api/optionSets/' + id + '.json';

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
 	var optionSetListFromString = json.name + ': <select class="form-control">';
 	var optionsAmount = data.options.length;
 	if(data.options.length <= 100 || bypass == "true") {
 		for(var i = 0; i < optionsAmount; i++) {
 			optionSetListFromString += '<div class="form-group">';
 			optionSetListFromString += json.name + ': ' + '<option value="' + i + '">' + data.options[i] + '</option>';
 			optionSetListFromString += '</div>';
 		}
 		optionSetListFromString += '</select>';
 		$('#' + json.id).append(optionSetListFromString);
 	}
 	else {
 		var alertString = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Warning!!</strong> ' + json.name + ' has too many alternatives (' + optionsAmount + ' options (HOLY!)), we\'ve removed it for your own sake! Click <a href="#" class="alert-link" id="bypass">here</a> if you want to bypass this!</div>';
 		$('#alertArea').append(alertString);

 		$('#bypass').click(function(){
			bypass = "true";
			$('#alertArea').empty();
			populateOptionSetList(json,data);
		});
 	}
 }