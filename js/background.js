/**
 *
 */
var server_addr = 'http://155.246.204.55:8000';
var make_endpoint = '/make';
var time_endpoint = '/time';
var message_key = 'message';
var pop_time_key = 'pop_time';
 
var time_left = 0.0;
var pop_time = 0.0;

var port = null;

chrome.extension.onConnect.addListener(function(port) {
	this.port = port;
	if (port.name == "pop_port") {
		// Update the progress every time the popup window connects
		update_progress();
	}
});

function update_time_left() {
  time_left = get_time_until_done();
}

function update_progress() {
	if (pop_time != 0.0) {
		var prog_percent = parseInt(((pop_time-time_left)/pop_time) * 100);
		port.postMessage({
			type: "update_pop_progress",
			progress: prog_percent
		});
	}
}

function get_time_until_done() {
  var time = 0.0;
  // Wait for the response to come back ya know
  $.ajax({
     async: false,
     type: 'GET',
     url: server_addr + time_endpoint,
     success: function(data) {
          time = data;
     }
  }).fail(function(data) {
    alert("Connet the pop pi, guy!");
  });
  return time;
}

function make_popcorn() {
  $.post(server_addr + make_endpoint, function(data) {
		alert("Success!");
      //alert("Bringing you popcorn in T-Minus " + data.pop_time + " seconds dog!");
      update_time_left();
      while(time_left > 0) {
        // In an effort to not incessently pound the pi with requests
        // Updates every half second
        setTimeout(update_time_left, 500);
      }
			chrome.extension.sendMessage({
				type: "popcorn_finished"
			});
		pop_time != 0.0
  }).fail(function(data) {
    if('error' in data) {
      switch(data['error_type']) {
        case 'busy':
					alert("Popcorn maker is busy dog!");
          break;
      }
    } else {
			alert("Error: " + data);
		}
  });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.type) {
      case "make_popcorn":
        make_popcorn();
        break;
    }
  }
);
