/*
 * Created by Thuc Hoang and Nguyen Cong Nguyen
 */

/*
 * A function created to extract data from the form (by retrieving the name of the dataElements and their value)
 */
 $.fn.serializeObject = function() {
  var object = Object.create(null),
  elementMapper = function(dataElement) {
    dataElement.name = $.camelCase(dataElement.name);
    return dataElement;
  },
  appendToResult = function(i, dataElement) {
    var list = object[dataElement.name];
    if ('undefined' != typeof list && list !== null) {
      object[dataElement.name] = list.push ? list.push(dataElement.value) : [list, dataElement.value];
    } else {
      object[dataElement.name] = dataElement.value;
    }
  };
  $.each($.map(this.serializeArray(), elementMapper), appendToResult);
  return object;
};

/*
 * By pressing the submit-button on the program.html page this function will be called.
 */
 function submitForm() {
  var json = $('#formData').serializeObject();
  $('#content').empty();
  $('#content').append('<br /><br /><center>Please wait while the data is getting sent to the server.</center>');
  parseJSON(json);
}

/*
 * Parsing the json-object and creates a new one, for the sole purpose of sending this data to DHIS
 */
 function parseJSON(json) {
  var i = 0;
  var emptyValues = 0;
  var count = Object.keys(json).length;
  var eventJSON = '{"eventList":[{"program":"' + programID + '","orgUnit":"' + orgUnitId + '","eventDate":"' + eventDateID + '","dataValues":[';
  $.each(json, function(id, value) {
    if(value != "") {
      if(id == "orgUnits" || id == "eventDate") {

      }
      else if(count == i+1) {
        eventJSON += '{"dataElement":"' + id + '","value": "' + value + '"}';
      }
      else {
        eventJSON += '{"dataElement":"' + id + '","value": "' + value + '"},';
      }
      i++;
    }
    else {
      i++;
      emptyValues++;
    }
  });
  eventJSON += ']}]}';
  sendJSON(eventJSON);
}

/*
 * Posting the json object to api/events
 */
 function sendJSON(json) {
  var url = getHost() + '/api/events';

  $.ajax({
    type: 'POST',
    url: url,
    data: json,
    contentType: 'application/json',
  }).success(function(xhr, textStatus, errorThrown) {
    if(textStatus == "success") {
      $('#content').empty();
      $('#content').append('<center><img src="img/check_normal.png" /><h1><b>Success!</b></h1><br />The form data for the program<h1><b>' + formName + '</b></h1> has been sent!</center><br />');
    }
  }).error(function(xhr, textStatus, errorThrown) {
    $('#content').empty();
    $('#content').append('<br /><br /><center><h1>An error has occured! The from data has not been sent!<br /><b>Please retry!</b></center>');
  });
}