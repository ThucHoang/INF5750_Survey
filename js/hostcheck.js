/*
 * N.E.T Survey
 * Created by Thuc Hoang and Nguyen Cong Nguyen
 * 
 * Simple function to check if the host are localhost or the DHIS2 demo.
 */
function getHost() {
	return location.hostname == "localhost" ? "http://localhost/survey" : "http://apps.dhis2.org/demo";
}
