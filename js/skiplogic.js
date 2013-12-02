
var skipLogicArray = [];
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

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		dataElementsString += '<select multiple id="allDataElements" size="' + data.programStageDataElements.length + '">';
 		$.each(data.programStageDataElements, function(index, value) {
 			dataElementsString += '<option value="' + value.id + '">' + value.name + '</option>';
 			skipLogicArray[index] = new Array(3);
 			skipLogicArray[index][0] = value.id;
 			skipLogicArray[index][1] = value.true;
 			skipLogicArray[index][2] = value.false;
 		});
 		dataElementsString += '</select>';
 		if(skipLogicArray.length == 0) {
 			$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 		}
 		else {
 			$('#skipLogicStatus').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>A pre-defined skip-logic has been found for this particular program!</center></div>');
 			$('#skipLogicView').append(dataElementsString);
 		}
 		console.log(dataElementsString);
 	}).error(function(data) {
 		$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!</center></div>');
 		console.log("Fetching skip-logic FAILED!");
 	});
 }