function getDataSets() {
	var url = 'http://apps.dhis2.org/demo/api/programs.json';
	console.log("Henter data fra: " + url);
	$.ajax({
		url: url,
		contentType: "application/json",
		dataType: 'json',
		crossDomain: true
	}).success(function(data) {
		console.log("yay!");

		$.each(data.programs, function(index, value) {
			console.log(index + ": " + value.name + " & " + value.id);
		});
			//console.log(index + ": " + value);
	}).error(function(data) {
		console.log("DATASET ERROR " + data);
	})
	};

function getUserData() {
	var userUrl = 'http://apps.dhis2.org/demo/api/me';
	console.log("Henter brukerdata fra: " + userUrl);

	var user = $.ajax({
		url: userUrl,
		contentType: "application/json",
		dataType: 'json',
		crossDomain: true
	}).success(function(data) {
		console.log("Bruker: " + data.name);
		console.log("Bursdag: " + data.birthday);
	}).error(function(data) {
		console.log("Error...");
	})
}
	
function populateDataSetList(json) {
	
}
