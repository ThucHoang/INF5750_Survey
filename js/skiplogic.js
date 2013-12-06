
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
 		if(value.type == 3) {
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
 			console.log(data);
 			if(data.length == 0 || data == null || data == "" || data == undefined) {
 				$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 			}
 			else {
 				$('#skipLogicStatus').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>A pre-defined skip-logic has been found for this particular program!</center></div>');
 				dataElementsString += '<select id="allDataElements" size="10">';
 				$.each(data.programStageDataElements, function(index, value) {
 					dataElementsString += '<option value="' + value.id + '">' + value.name + '</option>';
 					skipLogicArray[index] = new Array(4);
 					skipLogicArray[index][0] = value.id;
 					skipLogicArray[index][1] = value.true;
 					skipLogicArray[index][2] = value.false;
 					skipLogicArray[index][3] = value.name;
 				});
 				dataElementsString += '</select>';
 				$('#skipLogicView').append(dataElementsString);

 				$('#allDataElements').change(function() {
 					$('#skipLogicTrueView').empty();
 					$('#skipLogicFalseView').empty();
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
 	var selectedProgram = document.getElementById("allDataElements").selectedIndex;
 	var allPrograms = document.getElementById("allDataElements").options;
 	currentElement = allPrograms[selectedProgram].value;
 	var test = 'If value equals: <input type="text" size="30" id="test" /><br />Show: <select id="trueView">';

 	for(var i = 0; i < skipLogicArray.length; i++) {
 		if(skipLogicArray[i][0] == allPrograms[selectedProgram].value) {
 			if(skipLogicArray[i][1] != null) {
 				test += '<option value="' + skipLogicArray[i][1] + '">' + returnNameOfId(skipLogicArray[i][1]) + '</option>';
 			}
 			else {
 				console.log("no true value");
 			}
 			if(skipLogicArray[i][2] != null) {

 			}
 			else {
 				console.log("no false value");
 			}
 		}
 	}
 	test += '</select>';
 	$('#skipLogicTrueView').append(test);
 }

 function returnNameOfId(id) {
 	for(var i = 0; i < skipLogicArray.length; i++) {
 		if(skipLogicArray[i][0] == id) {
 			return skipLogicArray[i][3];
 		}
 	}
 	return null;
 }

 function returnIdOfName(name) {
 	for(var i = 0; i < skipLogicArray.length; i++) {
 		if(skipLogicArray[i][4] == name) {
 			return skipLogicArray[i][0];
 		}
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
