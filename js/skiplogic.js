
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
 	found = false;
 	var selectedProgram = document.getElementById("programSelect").selectedIndex;
 	var allPrograms = document.getElementById("programSelect").options;
 	var url = getHost() + '/api/systemSettings/NT.' + allPrograms[selectedProgram].value + '.skiplogic';
 	var dataElementsString = '<label>Select dataElement</label>:<br />';
 	formID = allPrograms[selectedProgram].value;

 	if(selectedProgram != 0) {
 		$.ajax({
 			url: url,
 			contentType: 'application/json',
 			dataType: 'json'
 		}).success(function(data) {
 			found = true;
 			if(data.length === 0 || data === null || data === "" || data === undefined) {
 				found = false;
 				$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!<br/><span id="create-skip-logic"><b>Click here</b></span> to create a null defined setting</center></div>');
 				document.getElementById('create-skip-logic').onclick = function(){
 					createEmtpySkipLogicSettings(allPrograms[selectedProgram].value);
 				};
 				$('#create-skip-logic').on({
 					mouseenter:function(){
 						$(this).css("text-decoration", "underline");
 					},
 					mouseleave: function(){
 						$(this).css("text-decoration", "none");
 					}
 				});
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
 			$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>No pre-defined skip-logic has been found for this particular program!<br/><span id="create-skip-logic"><b>Click here</b></span> to create a null defined setting</center></div>');
 			console.log("Fetching skip-logic FAILED!");
 			//Javascript vs jquery
 			document.getElementById('create-skip-logic').onclick = function(){
 				createEmtpySkipLogicSettings(allPrograms[selectedProgram].value);
 			};
 			$('#create-skip-logic').on({
 				mouseenter:function(){

 					$(this).css("text-decoration", "underline");
 				},
 				mouseleave: function(){
 					$(this).css("text-decoration", "none");
 				}
 			});
 		});
 	}
 }

 function reloadSkipLogicArray() {
 	skipLogicArray = [];
 	$('#skipLogicStatus').empty();
 	$('#skipLogicView').empty();
 	var dataElementsString = '<label>Select dataElement</label>: ';
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
 			console.log(document.getElementById('skipLogicView'));
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

 		var valueInputField = '<label>Value</label>: <input type="' + skipLogicArray[positionOfElement].type + '" id="valueInputField" ';
 		if(skipLogicArray[positionOfElement].true.value === null) {
 			valueInputField += 'value="" /><br />';
 		}
 		else {
 			valueInputField += 'value="' + skipLogicArray[positionOfElement].true.value + '" /><br />';
 		}
 		console.log(valueInputField);
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
 				if(skipLogicArray[positionOfElement].type === "int") {
 					inputOutputString = valueInputField + equalsOptionSet + equalOptionSetStorage + '</select><br />' + greaterOptionSet + greaterOptionSetStorage + '</select><br />' + lessOptionSet + lessOptionSetStorage + '</select>';
 					falseInputString += falseOptionSetStorage + '</select>';
 				}
 				else {
 					inputOutputString = valueInputField + equalsOptionSet + equalOptionSetStorage + '</select>';
 					falseInputString += falseOptionSetStorage + '</select>';
 				}
 				
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
 		$('#buttons').append('<center><input type="button" class="btn btn-success pull-left" id="submit" value="Save data" /></center>');

 		document.getElementById('submit').onclick = function() {
 			if(status === 'input') {

 				var valueToCheck = document.getElementById("valueInputField").value;
 				var equalsOptionSetTrue = document.getElementById("equalsOptionSet").selectedIndex;
 				var allEqualsOptionSet = document.getElementById("equalsOptionSet").options;
 				var equalValueSelected = allEqualsOptionSet[equalsOptionSetTrue].value;
 				if(skipLogicArray[positionOfElement].type === "int") {
 					var greaterOptionSetTrue = document.getElementById("greaterOptionSet").selectedIndex;
 					var allGreaterOptionSet = document.getElementById("greaterOptionSet").options;
 					var greaterValueSelected = allGreaterOptionSet[greaterOptionSetTrue].value;

 					var lessOptionSetTrue = document.getElementById("lessOptionSet").selectedIndex;
 					var allLessOptionSet = document.getElementById("lessOptionSet").options;
 					var lessValueSelected = allLessOptionSet[lessOptionSetTrue].value;

 				}
 				var falseOptionSet = document.getElementById("falseInputField").selectedIndex;
 				var allFalseOptionSet = document.getElementById("falseInputField").options;
 				var falseValueSelected = allFalseOptionSet[falseOptionSet].value;

 				if(valueToCheck != "") {
 					skipLogicArray[positionOfElement].true.value = valueToCheck;	
 				}
 				else {
 					skipLogicArray[positionOfElement].true.value = null;
 				}

 				if(equalValueSelected != "submitButton") {
 					skipLogicArray[positionOfElement].true.equal.id = equalValueSelected;
 				}
 				else {
 					skipLogicArray[positionOfElement].true.equal.id = null;
 				}
 				
 				if(greaterValueSelected != "submitButton") {
 					skipLogicArray[positionOfElement].true.greater.id = greaterValueSelected;
 				}
 				else {
 					skipLogicArray[positionOfElement].true.greater.id = null;
 				}

 				if(lessValueSelected != "submitButton") {
 					skipLogicArray[positionOfElement].true.less.id = lessValueSelected;
 				}
 				else {
 					skipLogicArray[positionOfElement].true.less.id = null;
 				}

 				if(falseValueSelected != "submitButton") {
 					skipLogicArray[positionOfElement].false = falseValueSelected;
 				}
 				else {
 					skipLogicArray[positionOfElement].false = null;
 				}
 				createSettings(skipLogicArray);
 			}
 			else {
 				var trueOptionSet = document.getElementById("optionSetTrue").selectedIndex;
 				var allTrueOptionSet = document.getElementById("optionSetTrue").options;
 				var trueValueSelected = allTrueOptionSet[trueOptionSet].value;

 				if(trueValueSelected === "submitButton") {
 					skipLogicArray[positionOfElement].next = null;
 				}
 				else {
 					skipLogicArray[positionOfElement].next = trueValueSelected;
 				}
 				$('#skipLogicView').append('<center>Please wait while the skip-logic data are getting saved!</center>');
 				createSettings(skipLogicArray);
 			}
 		}
 	}
 }
 function createSettings(json) {
 	var tmp = {
 		"programID": formID,
 		"programStageDataElements":  json
 	};
 	sendFormData(JSON.stringify(tmp));
 }

 function sendFormData(info) {
 	console.log(info);
 	var url = getHost() + '/api/systemSettings/NT.' + formID + '.skiplogic';
 	console.log(url);
 	$.ajax({
 		type: "POST",
 		url: url,
 		data: info,
 		contentType: 'text/plain',
 	}).success(function(xhr, textStatus, errorThrown) {
 		$('#skipLogicStatus').append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>The skip-logic rule has been saved!</center></div>');
 		$('#skipLogicTrueView').empty();
 		$('#skipLogicFalseView').empty();
 		$('#buttons').empty();
 		reloadSkipLogicArray();
 	}).error(function(xhr, textStatus, errorThrown) {
 		console.log("OH...");
 		$('#skipLogicStatus').append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><center>A problem has occured while saving the skip-logic rule. Please contact an administrator!</center></div>');
 	});
 }
 function createEmtpySkipLogicSettings(id) {
 	var i = 0;
 	var length; 
 	var tmp = {};
 	tmp["programID"] = id;
 	tmp["programStageDataElements"] = [];
 	$.ajax({
 		url: getHost() + '/api/programs/' + id + '.json',
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		$.ajax({
 			url: getHost() + '/api/programStages/'+ data.programStages[0].id + '.json',
 			contentType: 'application/json',
 			dataType: 'json'
 		}).success(function(data) {
 			length = data.programStageDataElements.length;
 			$.each(data.programStageDataElements, function(index, value) {

 				$.ajax({
 					url: getHost() + '/api/dataElements/'+ value.dataElement.id + '.json',
 					contentType: 'application/json',
 					dataType: 'json'
 				}).success(function(data){
 					addDataElementToObject(data, index);
 				});
 			});
 		}).error(function(data){});
 	})
 	.error(function(data){

 	});

 	function addDataElementToObject(data, index) {
 		i++;
 		console.log(data);
 		console.log(index);
 		var element = {
 			"name": data.name,
 			"id": data.id
 		};
 		if(data.optionSet === null){
 			element["category"] = "input";
 			if(data.type === "int"){
 				element["type"] = "int";
 			}
 			else if(data.type === "string") {
 				element["type"] = "text";
 			}
 			else if(data.type === "date") {
 				element["type"] = "date";
 			}
 		}
 		else{
 			element["category"] = "optionset";
 			element["type"] = null;

 		}
 		element["true"] = {
 			"value": null,
 			"greater": {"id": null},
 			"less": {"id": null},
 			"equal": {"id": null}
 		};
 		element["false"] = null;
 		element["next"] = null;
 		console.log(element);
 		tmp.programStageDataElements[index] = element;
 		if(i  === length-1) {
 			sendFormData(JSON.stringify(tmp));
 		}
 	}
 	//console.log(tmp);
 }
