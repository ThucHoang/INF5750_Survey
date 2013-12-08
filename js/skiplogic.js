
var skipLogicArray = [];
var currentElement = null;
var formID = null;
var positionOfElement = null;
var found = false;

/*
 * Fetching the dataSets from programs.json
 */
 function getAllPrograms() {
 	var url = getHost() + '/api/programs.json';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		populateOptionSet(data);
 	}).error(function(data) {
 		console.log("Error fetching all programs");
 	});
 }

 function populateOptionSet(json) {
 	var outputString = "";

 	if(json.programs.length > 1) {
 		outputString += '<option value="#">Select one of the programs below</option>';
 	}
 	$.each(json.programs, function(index, value) {
 		if(value.type === 3) {
 			outputString += '<option value="' + value.id + '">' + value.name + '</option>';
 		}
 	});
 	$('#programSelect').append(outputString);
 }

 function getSkipLogic() {
 	skipLogicArray = [];
 	$('#skipLogicStatus').empty();
 	$('#skipLogicView').empty();
 	var selectedProgram = document.getElementById("programSelect").selectedIndex;
 	var allPrograms = document.getElementById("programSelect").options;
 	var url = getHost() + '/api/systemSettings/NT.' + allPrograms[selectedProgram].value + '.skiplogic';
 	var dataElementsString = "";
 	formID = allPrograms[selectedProgram].value;

 	if(selectedProgram != 0) {
 		$.ajax({
 			url: url,
 			contentType: 'application/json',
 			dataType: 'json'
 		}).success(function(data) {
 			found = true;
 			if(data.length === 0 || data === null || data === "" || data === undefined) {
 				$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 			}
 			else {
 				$('#skipLogicStatus').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>A pre-defined skip-logic has been found for this particular program!</center></div>');
 				dataElementsString += '<select id="allDataElements" size="' + data.programStageDataElements.length + '">';
 				$.each(data.programStageDataElements, function(index, value) {
 					skipLogicArray[index] = value;
 					dataElementsString += '<option value="' + value.id + '">' + value.name + '</option>';
 				});
 				dataElementsString += '</select>';
 				$('#skipLogicView').append(dataElementsString);

 				$('#allDataElements').change(function() {
 					$('#skipLogicTrueView').empty();
 					$('#skipLogicFalseView').empty();
 					$('#trueView').empty();
 					retrieveTrueFalseValues();
 				}); 
 			}
 		}).error(function(data) {
 			found = false;
 			$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 			console.log("Fetching skip-logic FAILED!");
 		});
 	}
 }

 function reloadSkipLogicArray() {
 	skipLogicArray = [];
 	$('#skipLogicStatus').empty();
 	$('#skipLogicView').empty();
 	$('#buttons').empty();
 	var dataElementsString = "";
 	var url = getHost() + '/api/systemSettings/NT.' + formID + '.skiplogic';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		found = true;
 		if(data.length === 0 || data === null || data === "" || data === undefined) {
 			$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 		}
 		else {
 			$('#skipLogicStatus').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>A pre-defined skip-logic has been found for this particular program!</center></div>');
 			dataElementsString += '<select id="allDataElements" size="' + data.programStageDataElements.length + '">';
 			$.each(data.programStageDataElements, function(index, value) {
 				skipLogicArray[index] = value;
 				dataElementsString += '<option value="' + value.id + '">' + value.name + '</option>';
 			});
 			dataElementsString += '</select>';
 			$('#skipLogicView').append(dataElementsString);
 			retrieveTrueFalseValues();
 		}
 	}).error(function(data) {
 		found = false;
 		$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 		console.log("Fetching skip-logic FAILED!");
 	});
 }

 function retrieveTrueFalseValues() {
 	$('#skipLogicTrueView').empty();
 	$('#skipLogicFalseView').empty();
 	$('#buttons').empty();
 	var selectedProgram = document.getElementById("allDataElements").selectedIndex;
 	var allPrograms = document.getElementById("allDataElements").options;
 	currentElement = allPrograms[selectedProgram].value;
 	var falseValueInputString = 'Current values for False<br /><label>If value are empty show</label>:  <select id="inputFalse"><option value="submitButton">Submit button</option>';
 	var trueValueOptionSetString = '<label>Show this</label>: <select id="optionSetTrue"><option value="submitButton">Submit button</option>';
 	var status = '';
 	
 	if(found === true) {
 		for(var i = 0; i < skipLogicArray.length; i++) {
 			if(skipLogicArray[i].id === currentElement) {
 				positionOfElement = i;
 				status = skipLogicArray[i].category;
 				i = skipLogicArray.length;
 			}
 		}

 		var valueInputField = '<label>Value</label>: <input type="number" id="valueInputField" value="' + skipLogicArray[positionOfElement].true.value + '" /><br />';
 		var equalsOptionSet = '<label>Equal</label>: <select id="equalsOptionSet"><option value="submitButton">Submit button</option>';
 		var greaterOptionSet = '<label>Greater</label>: <select id="greaterOptionSet"><option value="submitButton">Submit button</option>';
 		var lessOptionSet = '<label>Less</label>: <select id="lessOptionSet"><option value="submitButton">Submit button</option>';
 		var falseInputString = '<label>If input-value are false</label>: <select id="falseInputField"><option value="submitButton">Submit button</option>';
 		var inputOutputString = '';

 		// Option value storages
 		var equalOptionSetStorage = '';
 		var greaterOptionSetStorage = '';
 		var lessOptionSetStorage = '';
 		var falseOptionSetStorage = '';
 		var trueOptionSetStorage = '';

 		for(var x = positionOfElement; x < skipLogicArray.length; x++) {
 			if(skipLogicArray[x].true != null) {
 				if(skipLogicArray[x].id != currentElement) {
 					if(skipLogicArray[x].id === skipLogicArray[positionOfElement].true.equal.id) {
 						equalOptionSetStorage += '<option value="' + skipLogicArray[x].id +'" selected="selected">' + skipLogicArray[x].name + '</option>';
 					}
 					else {
 						equalOptionSetStorage += '<option value="' + skipLogicArray[x].id + '">' + skipLogicArray[x].name + '</option>';
 					}

 					if(skipLogicArray[x].id === skipLogicArray[positionOfElement].true.greater.id) {
 						greaterOptionSetStorage += '<option value="' + skipLogicArray[x].id +'" selected="selected">' + skipLogicArray[x].name + '</option>';
 					}
 					else {
 						greaterOptionSetStorage += '<option value="' + skipLogicArray[x].id + '">' + skipLogicArray[x].name + '</option>';
 					}

 					if(skipLogicArray[x].id === skipLogicArray[positionOfElement].true.less.id) {
 						lessOptionSetStorage += '<option value="' + skipLogicArray[x].id +'" selected="selected">' + skipLogicArray[x].name + '</option>';
 					}
 					else {
 						lessOptionSetStorage += '<option value="' + skipLogicArray[x].id + '">' + skipLogicArray[x].name + '</option>';
 					}

 					if(skipLogicArray[x].id === skipLogicArray[positionOfElement].false) {
 						falseOptionSetStorage += '<option value="' + skipLogicArray[x].id +'" selected="selected">' + skipLogicArray[x].name + '</option>';
 					}
 					else {
 						falseOptionSetStorage += '<option value="' + skipLogicArray[x].id + '">' + skipLogicArray[x].name + '</option>';
 					}

 					if(skipLogicArray[x].id === skipLogicArray[positionOfElement].next) {
 						trueOptionSetStorage += '<option value="' + skipLogicArray[x].id +'" selected="selected">' + skipLogicArray[x].name + '</option>';
 					}
 					else {
 						trueOptionSetStorage += '<option value="' + skipLogicArray[x].id + '">' + skipLogicArray[x].name + '</option>';
 					}
 				}
 			}
 			if((x+1 === skipLogicArray.length) && (skipLogicArray[x].id == currentElement)) {
 				if(status === 'input') {
 					equalOptionSetStorage = '';
 					greaterOptionSetStorage = '';
 					lessOptionSetStorage = '';
 					falseOptionSetStorage = '';
 					trueOptionSetStorage = '';
 				}
 				else {
 					trueValueOptionSetString = 'NO VALUE CAN BE SET HERE<br />Submit button will be shown as default.';
 				}
 			}
 		}

 		if(status === 'input') {
 			if(equalOptionSetStorage != '' || greaterOptionSetStorage != '' || lessOptionSetStorage != '' || falseOptionSetStorage != '' || trueOptionSetStorage != '') {
 				inputOutputString = valueInputField + equalsOptionSet + equalOptionSetStorage + '</select><br />' + greaterOptionSet + greaterOptionSetStorage + '</select><br />' + lessOptionSet + lessOptionSetStorage + '</select>';
 				falseInputString += falseOptionSetStorage + '</select>';
 			}
 			else {
 				inputOutputString = 'NO VALUE CAN BE SET HERE<br />Submit button will be shown as default.';
 				falseInputString = 'NO VALUE CAN BE SET HERE<br />Submit button will be shown as default.';
 			}

 			$('#skipLogicTrueView').append(inputOutputString);
 			$('#skipLogicFalseView').append(falseInputString);
 		}
 		else {
 			trueValueOptionSetString += trueOptionSetStorage + '</select>';

 			$('#skipLogicTrueView').append(trueValueOptionSetString);
 			$('#skipLogicFalseView').append('OptionSets-value can NEVER be empty!');
 		}
 		$('#buttons').append('<center><input type="button" class="btn btn-success" id="submit" value="Save data" /></center>');

 		document.getElementById('submit').onclick = function() {
 			if(status === 'input') {
 				var valueToCheck = document.getElementById("valueInputField").value;
 				var equalsOptionSetTrue = document.getElementById("equalsOptionSet").selectedIndex;
 				var allEqualsOptionSet = document.getElementById("equalsOptionSet").options;
 				var equalValueSelected = allEqualsOptionSet[equalsOptionSetTrue].value;

 				var greaterOptionSetTrue = document.getElementById("greaterOptionSet").selectedIndex;
 				var allGreaterOptionSet = document.getElementById("greaterOptionSet").options;
 				var greaterValueSelected = allGreaterOptionSet[greaterOptionSetTrue].value;

 				var lessOptionSetTrue = document.getElementById("lessOptionSet").selectedIndex;
 				var allLessOptionSet = document.getElementById("lessOptionSet").options;
 				var lessValueSelected = allLessOptionSet[lessOptionSetTrue].value;

 				var falseOptionSet = document.getElementById("falseInputField").selectedIndex;
 				var allFalseOptionSet = document.getElementById("falseInputField").options;
 				var falseValueSelected = allFalseOptionSet[falseOptionSet].value;

 				if(valueToCheck != "") {
 					skipLogicArray[positionOfElement].true.value = valueToCheck;	
 				}
 				else {
 					skipLogicArray[positionOfElement].true.value = null;
 				}
 				skipLogicArray[positionOfElement].true.equal.id = equalValueSelected;
 				skipLogicArray[positionOfElement].true.greater.id = greaterValueSelected;
 				skipLogicArray[positionOfElement].true.less.id = lessValueSelected;
 				skipLogicArray[positionOfElement].false = falseValueSelected;

 				//$('#troll').empty();
 				//$('#skipLogicStatus').empty();
 				//$('#troll').append('<center>Please wait while the skip-logic data are getting saved!</center>');
 				sendFormData(JSON.stringify(skipLogicArray));

 				//console.log(JSON.stringify(skipLogicArray));
 				reloadSkipLogicArray();
 			}
 			else {
 				var trueOptionSet = document.getElementById("optionSetTrue").selectedIndex;
 				var allTrueOptionSet = document.getElementById("optionSetTrue").options;
 				var trueValueSelected = allTrueOptionSet[trueOptionSet].value;

 				skipLogicArray[positionOfElement].next = trueValueSelected;
 				$('#skipLogicView').append('<center>Please wait while the skip-logic data are getting saved!</center>');
 				sendFormData(JSON.stringify(skipLogicArray));

 				//console.log(JSON.stringify(skipLogicArray));
 				
 			}
 		}
 	}
 	else {
 		console.log("LOL");
 	// Kennet sin del her <3
 }
}

function sendFormData(info) {
	var url = getHost() + '/api/systemSettings/NT.' + formID + '.skiplogic';
	console.log(url);
	$.ajax({
		type: "POST",
		url: url,
		data: info
	}).success(function(xhr, textStatus, errorThrown) {
		console.log("MUHAAHAHA " + textStatus);
		//$('#troll').load("pages/skiplogic.html");
		$('#skipLogicStatus').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>The skip-logic rule has been saved!</center></div>');

	}).error(function(xhr, textStatus, errorThrown) {
		console.log("OH...");
		$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>A problem has occured while saving the skip-logic rule. Please contact an administrator!</center></div>');
	});
}