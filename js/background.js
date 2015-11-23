/**
 * @author austin
 */
var server_addr = 'http://155.246.204.109:8000';
var make_endpoint = '/make';
var time_endpoint = '/time';
var message_key = 'message';
var pop_time_key = 'pop_time';

var port = null;
var is_popping = false;
var end_time = new Date();
var pop_time = 0.0;


// Just trying out different ways to communicate
// This way uses ports. It's ok at best. Tough when port closes
chrome.extension.onConnect.addListener(function(port) {
	this.port = port;
	if (port.name == "pop_port") {
		// Update the progress every time the popup window connects
		if (is_popping) {
			update_progress();
		}
	}
});

function update_progress() {
	var seconds_left = end_time.getSeconds() - (new Date()).getSeconds();
	var prog_percent = parseInt(((pop_time-seconds_left/pop_time) * 100));

	try {
		port.postMessage({
			type: "update_pop_progress",
			progress: prog_percent
		});
	} catch (err) {
		// When the port(aka the popup) has been closed
		console.log(err);
	}
}

function get_time_until_done() {
  var time = 0.0;
  // Wait for the response to come back ya know
	// Should only run once when the make command
  $.ajax({
     async: false,
     type: 'GET',
     url: server_addr + time_endpoint,
     success: function(data) {
          time = data['time_remaining'];
     }
  }).fail(function(data) {
    alert("Connet the pop pi, guy!");
  });

	var time_done = new Date();
	time_done.setSeconds(time_done.getSeconds() + time);

  return time_done;
}

function make_popcorn() {
  $.post(server_addr + make_endpoint, function(data) {
			is_popping = true;
      //alert("Bringing you popcorn in T-Minus " + data.pop_time + " seconds dog!");
			end_time = get_time_until_done();
			pop_time = end_time.getSeconds() - (new Date()).getSeconds();

			// Wait the poptime until sending out the finished message!
			setTimeout(function() {
				chrome.extension.sendMessage({
				type: "popcorn_finished"
					});
				// Reset pop time
				pop_time = 0.0;
				is_popping = false;
			}, pop_time * 1000);

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
