
var skipLogicArray = [];
var currentElement = null;
var formID = null;

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
 	var selectedProgram = document.getElementById("allDataElements").selectedIndex;
 	var allPrograms = document.getElementById("allDataElements").options;
 	currentElement = allPrograms[selectedProgram].value;
 	var trueValueInputString = 'Current values for True<br /><label>If value equals</label>:  <input type="text" size="20" id="test" /><br /><label>Show this next</label>: <select id="inputTrue"><option value="submitButton">Submit button</option>';
 	var falseValueInputString = 'Current values for False<br /><label>If value are empty show</label>:  <select id="inputFalse"><option value="submitButton">Submit button</option>';
 	var trueValueOptionSetString = '<label>Show this</label>: <select id="optionSetTrue"><option value="submitButton">Submit button</option>';
 	var falseValueOptionSetString = '<b>OptionSets-value can NEVER be empty!</b>';
 	var status = '';
 	var positionOfElement = null;

 	for(var i = 0; i < skipLogicArray.length; i++) {
 		if(skipLogicArray[i].id === currentElement) {
 			positionOfElement = i;
 			status = skipLogicArray[i].type;
 			i = skipLogicArray.length;
 		}
 	}
 	
 	for(var x = 0; x < skipLogicArray.length; x++) {
 		if(skipLogicArray[x].true != null) {
 			if(skipLogicArray[x].id != currentElement && x > positionOfElement) {
 				if(status == 'input') {
 					trueValueInputString += '<option value="' + skipLogicArray[x].true + '">' + skipLogicArray[x].name + '</option>';
 					falseValueInputString += '<option value="' + skipLogicArray[x].true + '">' + skipLogicArray[x].name + '</option>';
 				} 
 				else {
 					trueValueOptionSetString += '<option value="' + skipLogicArray[x].true + '">' + skipLogicArray[x].name + '</option>';
 				}
 			}
 		}
 		if((x+1 === skipLogicArray.length) && (skipLogicArray[x].id != currentElement)) {
 			if(status === 'input') {
 				trueValueInputString += '<option value="' + skipLogicArray[x].false + '">' + skipLogicArray[x].name + '</option>';
 				falseValueInputString += '<option value="' + skipLogicArray[x].false + '">' + skipLogicArray[x].name + '</option>';
 				trueValueInputString += '</select>';
 				falseValueInputString += '</select>';
 			}
 			else {
 				trueValueOptionSetString += '<option value="' + skipLogicArray[x].false + '">' + skipLogicArray[x].name + '</option>';
 				trueValueOptionSetString += '</select>';
 			}
 		}
 		else if((x+1 === skipLogicArray.length) && (skipLogicArray[x].id == currentElement)) {
 			if(status === 'input') {
 				trueValueInputString = 'NO VALUE CAN BE SET HERE';
 				falseValueInputString = 'NO VALUE CAN BE SET HERE';
 			}
 			else {
 				trueValueOptionSetString = 'NO VALUE CAN BE SET HERE';
 			}
 		}
 	}

 	if(status === 'input') {
 		$('#skipLogicTrueView').append(trueValueInputString);
 		$('#skipLogicFalseView').append(falseValueInputString);
 	}
 	else {
 		$('#skipLogicTrueView').append(trueValueOptionSetString);
 		$('#skipLogicFalseView').append(falseValueOptionSetString);
 	}

 }

 function sendFormData() {
 	var url = getHost() + '/api/systemSettings/NTK.' + formID + '.skiplogic';

 	$.ajax({
 		url: url,
 		contentType: 'application/text'
 	}).success(function(data) {

 	}).error(function(xhr, textStatus, errorThrown) {

 	});
 }
