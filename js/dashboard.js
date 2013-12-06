/*
 * Created by Thuc Hoang and Nguyen-Cong Nguyen
 */

/*
 * Retrieving the data for the current logged in user
 */
 function getUserData() {
 	var url = getHost() + '/api/me.json';

 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		refreshDashboardData(data);
 		getDataAboutMe(data);
 	}).error(function(data) {
 		console.log("Could not retrieve user data");
 	});
 }

/*
 * Refreshing the view with the new data retrieved
 */
 function refreshDashboardData(json) {
 	$('#userInformation').empty();

 	$('#userInformation').append('<h1>Welcome ' + json.name + '!</h1><br />');
 	if(json.organisationUnits.length > 1) {
 		$('#userInformation').append('You are a member of these organization units: ');	
 	}
 	else {
 		$('#userInformation').append('You are a member of this organization unit: ');
 	}

 	for(var i = 1; i <= json.organisationUnits.length; i++) {
 		$('#userInformation').append('<b>');
 		if(i != json.organisationUnits.length) {
 			$('#userInformation').append(json.organisationUnits[i-1].name + ', ');	
 		}
 		else {
 			$('#userInformation').append(json.organisationUnits[i-1].name + '.');
 		}
 		$('#userInformation').append('<br/></b>');
 	}
 	getNumberOfProgramsWithAccess();
 }

/*
 * Retrieves the number of programs the user can access
 */
 function getNumberOfProgramsWithAccess() {
 	var url = getHost() + '/api/programs.json';
 	var singleEvent = 0;
 	var multiEvent = 0;
 	
 	$.ajax({
 		url: url,
 		contentType: 'application/json',
 		dataType: 'json'
 	}).success(function(data) {
 		var length = data.programs.length;
 		$('#userInformation').append('<br />You have access to ' + data.programs.length + ' programs');
 		console.log(data.programs);

 		for(var i = 0; i < length; i++) {
 			if(data.programs[i].type == 3) {
 				singleEvent++;
 			}
 			else {
 				multiEvent++;
 			}
 		}
 		$('#userInformation').append(' (Where ' + singleEvent + ' are single events and ' + multiEvent + ' are multi events)!');
 	}).error(function(data) {
 		console.log("ERROR WITH # of programs");
 	});
 }

 function getDataAboutMe(json) {
 	$('#detailedInfo').empty();
 	$('#detailedInfo').append('<br/><h2>User information:</h2>');

 	$('#jobTitleData').text(json.jobTitle);
 	$('#introductionData').append(json.introduction);
 	$('#emailData').append(json.email);
 	$('#birthdayData').append(json.birthday);
 }