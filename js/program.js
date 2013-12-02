/*
 * Created by Thuc Hoang and Nguyen Cong Nguyen
 */

 // Global variables
 var dataElementArray = [];
 var skipLogicArray = [];
 var bypass = false;
 var found = false;
 var skiplogic = false;
 var endOfElements = false;
 var dangerOptionSet = false;
 var counter = 0;
 var dataElementPos = 0;
 var index = 0;
 var currentElement = null;
 var formName = null;
 var programID = null;
 var orgUnitId = null;
 var eventDateID = null;
 var JSONStorage = null;

/*
 * Fetching the data for the current user logged in
 */
 function getUserData() {
 	$('#loginInfo').empty();
 	var url = getHost() + '/api/me.json';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		checkUserCredentials(data);
 		writeLoggedInUser(data);
 	}).error(function(data) {
 		console.log("Error...");
 	});
 }

/*
 * Printing out the current users REAL name
 */
 function writeLoggedInUser(json) {
 	var userLoggedIn = 'Logged in as <b>' + json.name + '</b> (<a href="' + getHost() + '/dhis-web-commons-security/logout.action" target="_self">Logout</a>)';
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

/*
 * Fetching the dataSets from programs.json
 */
 function getDataSets() {
 	var url = getHost() + '/api/programs.json';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		populateProgramList(data);
 	}).error(function(data) {
 		console.log("DATASET ERROR " + data);
 	});
 }

/*
 * Populates the selector, only if they are of type 3 (Single-event-without-registration)
 */
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

/*
 * When a program has been selected the program ID are retrieved
 */
 function getProgramStages() {
 	bypass = false;
 	found = false;
 	currentElement = null;
 	counter = 0;
 	dataElementArray = [];
 	skipLogicArray = [];
 	dataElementPos = 0;

 	//Should clear view before fetching data
 	$('#skipLogicAlert').empty();
 	$('#alertArea').empty();
 	$('#programNameView').empty();
 	$('#button').empty();
 	$('#formData').text("");

 	var selectedProgram = document.getElementById("formSelector").selectedIndex;
 	var allPrograms = document.getElementById("formSelector").options;
 	var url = getHost() + '/api/programs/' + allPrograms[selectedProgram].value + '.json';
 	programID = allPrograms[selectedProgram].value;
 	if(selectedProgram != 0){

 		if(allPrograms[selectedProgram].value != '#') {
 			$.ajax({
 				url: url,
 				contentType: 'application/json',
 				dataType: 'json'
 			}).success(function(data) {
 				$('#programNameView').append('You have chosen the program: <b>' + data.name + '</b><br /><br />');
 				formName = data.name;
 				JSONStorage = data;
 				fetchSkipLogic(allPrograms[selectedProgram].value);
 				getDataElements(data.programStages[0].id);
 			}).error(function(data) {
 				console.log("PROGRAMSTAGE ERROR");
 			});
 		} 
 		else {
 			$('#formData').empty();
 		}
 	}
 }

/*
 * Checking the server if there's any pre-made skiplogic
 */
 function fetchSkipLogic(id) {
 	var url = getHost() + '/api/systemSettings/NT.' + id + '.skiplogic';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		$.each(data.programStageDataElements, function(index, value) {
 			skipLogicArray[index] = new Array(3);
 			skipLogicArray[index][0] = value.id;
 			skipLogicArray[index][1] = value.true;
 			skipLogicArray[index][2] = value.false;
 		});
 		if(skipLogicArray.length == 0) {
 			$('#skipLogicAlert').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 		}
 		else {
 			found = true;
 			$('#skipLogicAlert').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>A pre-defined skip-logic has been found for this particular program!</center></div>');
 		}
 	}).error(function(data) {
 		$('#skipLogicAlert').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 		found = false;
 		console.log("Fetching skip-logic FAILED!");
 	});
 }

/*
 * Adding the Organisation Units field with all organisation units with access to the current programstage
 */
 function appendOrgUnits(json) {
 	var optionsAmount = json.organisationUnits.length;
 	var optionSetListFromString = '<p></p><label>Organisation Unit<sup><font color="red">*</font></sup></label>: <select class="form-control" name="orgUnits"><div class="form-group"><option value="#">Select one Organisation Unit</option></div>';
 	for(var i = 0; i < optionsAmount; i++) {
 		optionSetListFromString += '<div class="form-group">';
 		optionSetListFromString += '<option value="' + json.organisationUnits[i].id + '">' + json.organisationUnits[i].name + '</option>';
 		optionSetListFromString += '</div>';
 	}
 	optionSetListFromString += '</select>';
 	$('#orgUnit').append(optionSetListFromString);
 }

/*
 * Adding the date of event
 */
 function appendEventDate() {
 	$('#eventDate').append('<p></p><label>Date of the event<sup><font color="red">*</font></sup></label>: <input type="text" id="formElement" class="form-control" name="eventDate"  value="' + new Date().toJSON().slice(0, 10) + '" aria-required="true" required /><p></p>');
 	currentElement = "eventDate";
 }

/*
 * Creates a div with it's own unique ID to make sure that the questions are shown in the correct order (not really needed)
 * Also checking the inputs when pressing next question
 */
 function getDataElements(id) {
 	var url = getHost() + '/api/programStages/' + id + '.json';
 	currentElement = null;
 	$('#formData').empty();
 	
 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		$('#formData').append('<div class="elementDiv" id="orgUnit"></div>');
 		$('#formData').append('<div class="elementDiv" id="eventDate"></div>');
 		$.each(data.programStageDataElements, function(index, value) {
 			$('#formData').append('<div class="elementDiv" id="' + value.dataElement.id + '"></div>');

 			if(index === 0) {
 				currentElement = "orgUnits";
 				dataElementArray.push(value.dataElement.id);
 			}
 			else {
 				dataElementArray.push(value.dataElement.id);
 			}
 		});

 		appendOrgUnits(JSONStorage);
 		$('#button').append('<p></p><input type="button" id="next" class="btn btn-default" value="Next Question" />');

 		$("form.form-horizontal .elementDiv:first-child").fadeIn(500).focus();

 		document.getElementById('next').onclick = function() {
 			var check = null;
 			$('#skipLogicAlert').empty();

 			checkIfNoMoreTrueElements();

 			if(!bypass && dangerOptionSet) {
 				// Do nothing
 			}
 			else {
 				check = document.getElementsByName(currentElement)[0].value;
 			}

 			if(check == "" && currentElement != "eventDate") {
 				$('#' + currentElement).hide();
 			}

 			if(found) {
 				checkIfNoMoreTrueElements();
 			}
 			if(check == "" && currentElement == "eventDate") {
 				$('#skipLogicAlert').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>Please insert the date of the event!</center>');
 			}
 			else if(currentElement == "orgUnits") {
 				var orgUnitID = document.getElementsByName(currentElement)[0].value;
 				if(orgUnitID == "#") {
 					$('#skipLogicAlert').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>Please choose a organisation unit to register this event on!</center>');
 				}
 				else {
 					orgUnitId = orgUnitID;
 					appendEventDate();
 				}
 			}
 			else if(currentElement == "eventDate") {
 				var eventDateId = document.getElementsByName(currentElement)[0].value;

 				if(found) {
 					eventDateID = eventDateId;
 					checkInputWithSkipLogic();
 					getDataElementInfo(currentElement);
 				}
 				else {
 					eventDateID = eventDateId;
 					currentElement = dataElementArray[counter];
 					getDataElementInfo(currentElement);
 				}
 			}
 			else {
 				if(skipLogicArray.length == 0 && !found) {
 					if(check == "") {
 						$('#' + currentElement).hide();
 					}
 					currentElement = dataElementArray[counter+1];

 					if(counter >= dataElementArray.length-1) {
 						showSubmitButton();
 					}
 					else {
 						getDataElementInfo(currentElement);
 					}
 					counter++;
 				}
 				else {
 					checkIfNoMoreTrueElements();
 					checkInputWithSkipLogic();
 				}
 			}
 		}
 	}).error(function(data) {
 		console.log("DATA ARRAY ERROR");
 	});
 }

/*
 * If skiplogic are present, this function will be activated and skiplogic will be retrieved
 */
 function checkInputWithSkipLogic() {
 	var check = false;
 	var element = null;
 	index = 0;

 	checkIfNoMoreTrueElements();
 	while(!check) {
 		if(!dangerOptionSet) {
 			element = document.getElementsByName(currentElement)[0].value;
 		}

 		checkIfNoMoreTrueElements();
 		if(currentElement == "eventDate") {
 			currentElement = skipLogicArray[0][0];
 			check = true;
 			break;
 		}

 		if(skipLogicArray[dataElementPos][index] == currentElement) {
 			$('#skipLogicAlert').empty();

 			if(element != undefined && element != "") {
 				if(skipLogicArray[dataElementPos][index+1] != null) {
 					getDataElementInfo(skipLogicArray[dataElementPos][index+1]);
 					currentElement = skipLogicArray[dataElementPos][index+1];
 				}
 			}
 			else {
 				if(skipLogicArray[dataElementPos][index+2] != null) {
 					getDataElementInfo(skipLogicArray[dataElementPos][index+2]);
 					currentElement = skipLogicArray[dataElementPos][index+2];
 				}
 			}
 			check = true;
 		}
 		dataElementPos++;
 		index++;
 	}
 }

/*
 * Showing the submit buttin of the function gets called
 */
 function showSubmitButton() {
 	$('#button').empty();
 	$('#button').append('<input type="button" id="submit" class="btn btn-default" value="Submit form" />');

 	document.getElementById('submit').onclick = function() {
 		submitForm();
 	}
 }

/*
 * If there's no true elements (left side) then show submit button
 */
 function checkIfNoMoreTrueElements() {
 	for(var i = 0; i < skipLogicArray.length; i++) {
 		if(skipLogicArray[i][0] == currentElement) {
 			if(skipLogicArray[i][1] == null) {
 				showSubmitButton();
 			}
 		}
 	}	
 }

/*
 * Retrieving the json object for a dataElement
 */
 function getDataElementInfo(id) {
 	var url = getHost() + '/api/dataElements/' + id + '.json';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		checkDataElementOptions(data);
 	}).error(function(data) {
 		console.log("DataElements ERROR!");
 	});
 }

/*
 * Checking if the dataElement are a input field or optionset
 */
 function checkDataElementOptions(json) {
 	if(json.optionSet == null) {
 		populateDataElements(json);
 	}
 	else {
 		getOptionSets(json, json.optionSet.id);
 	}
 }

/*
 * Creates an input field based on the types that are defined below
 */
 function populateDataElements(json) {
 	if(json.type == "string" && json.textType == "text") {
 		$('#' + json.id).append('<label>' + json.name + '</label>: <input type="text" id="' + json.id + '-id" class="form-control" name="' + json.id + '"/><p></p>');
 	}
 	else if(json.type == "int" && json.numberType == "int") {
 		$('#' + json.id).append('<label>' + json.name + '</label>: <input type="number" id="' + json.id + '-id" class="form-control" name="' + json.id + '"/><p></p>');
 	}
 	else if(json.type == "date" && json.numberType == "number") {
 		$('#' + json.id).append('<p></p><label>' + json.name + '</label>: <input type="text" id="' + json.id + '-id" class="form-control" name="' + json.id + '""  value="' + new Date().toJSON().slice(0, 10) + '"/><p></p>');
 	}
 	else {
 		$('#skipLogicAlert').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>An error has occured! Please tell the admin!</center>');
 	}
 }

/*
 * Retrieves the data to create the option sets
 */
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
 	});
 }

/*
 * Populates the selector with the option set data
 */
 function populateOptionSetList(json, data) {
 	var optionsAmount = data.options.length;
 	if(optionsAmount <= 1500 || bypass == true) {
 		var optionSetListFromString = '<p></p><label>' + json.name + '</label>: <select class="form-control" id="' + json.id + '-id" name="' + json.id + '">';
 		for(var i = 0; i < optionsAmount; i++) {
 			optionSetListFromString += '<div class="form-group">';
 			optionSetListFromString += '<option value="' + data.options[i] + '">' + data.options[i] + '</option>';
 			optionSetListFromString += '</div>';
 		}
 		optionSetListFromString += '</select>';
 		$('#' + json.id).append(optionSetListFromString);
 	}
 	else {
 		var alertString = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center><strong>Warning!!</strong> ' + json.name + ' has too many alternatives (' + optionsAmount + ' options (HOLY!)), we\'ve removed it for your own sake! Click <a href="#" class="alert-link" id="bypass">here</a> if you want to bypass this!</center></div>';
 		$('#alertArea').append(alertString);
 		dangerOptionSet = true;
 		showSubmitButton();

 		$('#bypass').click(function() {
 			bypass = true;
 			$('#alertArea').empty();
 			populateOptionSetList(json, data);
 		});
 	}
 }