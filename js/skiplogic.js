
var skipLogicArray = [];
var currentElement = null;
var formID = null;
var positionOfElement = null;

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
 			$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 			console.log("Fetching skip-logic FAILED!");
 		});
 	}
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
 	var optionSetStorage = '';
 	var valueInputField = '<label>Value</label>: <input type="number" id="valueInputField" /><br />';
 	var equalsOptionSet = '<label>Equal</label>: <select id="equalsOptionSet">';
 	var greaterOptionSet = '<label>Greater</label>: <select id="greaterOptionSet">';
 	var lessOptionSet = '<label>Less</label>: <select id="lessOptionSet">';
 	var falseInputString = '<label>If input-value are false</label>: <select id="falseInputField">';
 	var inputOutputString = '';

 	for(var i = 0; i < skipLogicArray.length; i++) {
 		if(skipLogicArray[i].id === currentElement) {
 			positionOfElement = i;
 			status = skipLogicArray[i].category;
 			i = skipLogicArray.length;
 		}
 	}
 	
 	for(var x = positionOfElement; x < skipLogicArray.length; x++) {
 		if(skipLogicArray[x].true != null) {
 			if(skipLogicArray[x].id != currentElement) {
 				optionSetStorage += '<option value="' + skipLogicArray[x].id + '">' + skipLogicArray[x].name + '</option>';
 			}
 		}
 		if((x+1 === skipLogicArray.length) && (skipLogicArray[x].id == currentElement)) {
 			if(status === 'input') {
 				optionSetStorage = '';
 			}
 			else {
 				trueValueOptionSetString = 'NO VALUE CAN BE SET HERE';
 			}
 		}
 	}

 	if(status === 'input') {
 		if(optionSetStorage != '') {
 			inputOutputString = valueInputField + equalsOptionSet + optionSetStorage + '</select><br />' + greaterOptionSet + optionSetStorage + '</select><br />' + lessOptionSet + optionSetStorage + '</select>';
 			falseInputString += optionSetStorage + '</select>';
 		}
 		else {
 			inputOutputString = 'NO VALUE CAN BE SET HERE';
 			falseInputString = 'NO VALUE CAN BE SET HERE';
 		}
 		
 		$('#skipLogicTrueView').append(inputOutputString);
 		$('#skipLogicFalseView').append(falseInputString);
 	}
 	else {
 		trueValueOptionSetString += optionSetStorage + '</select>';
 		$('#skipLogicTrueView').append(trueValueOptionSetString);
 		$('#skipLogicFalseView').append('OptionSets-value can NEVER be empty!');
 	}
 	$('#buttons').append('<center><input type="button" class="btn btn-success" id="submit" value="Save data" /><input type="button" class="btn btn-danger" id="reset" value="Remove rule" /></center>');

 	document.getElementById('reset').onclick = function() {
 		console.log("reset baby!");
 	}

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

 			skipLogicArray[positionOfElement].true.value = valueToCheck;
 			skipLogicArray[positionOfElement].true.equal.id = equalValueSelected;
 			skipLogicArray[positionOfElement].true.greater.id = greaterValueSelected;
 			skipLogicArray[positionOfElement].true.less.id = lessValueSelected;
 			skipLogicArray[positionOfElement].false = falseValueSelected;
 			
 			// parse
 		}
 		else {
 			var trueOptionSet = document.getElementById("optionSetTrue").selectedIndex;
 			var allTrueOptionSet = document.getElementById("optionSetTrue").options;
 			var trueValueSelected = allTrueOptionSet[trueOptionSet].value;
 			
 			skipLogicArray[positionOfElement].next = trueValueSelected;

 			// parse
 		}
 	}
 }

 function sendFormData() {
 	var url = getHost() + '/api/systemSettings/NT.' + formID + '.skiplogic';

 	$.ajax({
 		url: url,
 		contentType: 'application/text'
 	}).success(function(data) {

 	}).error(function(xhr, textStatus, errorThrown) {

 	});
 }
