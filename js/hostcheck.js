/*
* N.E.T Survey
* Created by Thuc Hoang and Nguyen Cong Nguyen
*/

/* 
* Simple function to check if the host are localhost or the DHIS2 demo.
*/

function getHost(){
    var location = window.location;
    if(location.host === 'localhost'){
        return "http://localhost/survey";
    }

    else if(location.host === 'apps.dhis2.org'){
        var xhReq = new XMLHttpRequest();
       xhReq.open("GET", "manifest.webapp", false);
       xhReq.send(null);
       var serverResponse = JSON.parse(xhReq.responseText);
       var dhisAPI = serverResponse.activities.dhis.href;
       return dhisAPI;
    }
    else{
        return "http://" + location.host + "/survey";
    }
}
