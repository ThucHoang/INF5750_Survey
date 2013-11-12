/*
 * N.E.T Survey
 * Created by Thuc Hoang and Nguyen Cong Nguyen
 * 
 * Simple function to check if the host are localhost or the DHIS2 demo.
 */
function getHost() {
	var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "manifest.webapp", false);
    xhReq.send(null);
    var serverResponse = JSON.parse(xhReq.responseText);
    var dhisAPI = serverResponse.activities.dhis.href;
    if(dhisAPI == "*") {
    	console.log("Returning localhost");
    	return "http://localhost/survey";
    }
    else {
    	console.log("Returning " + dhisAPI);
    	return dhisAPI;
    }

	//return location.hostname == "localhost" ? "http://localhost/survey" : "http://apps.dhis2.org/demo";
}
