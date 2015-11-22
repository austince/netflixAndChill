/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
var server_addr = 'http://155.246.204.55:8000';
var make_endpoint = '/make';
var time_endpoint = '/time';
var message_key = 'message';
var pop_time_key = 'pop_time';
 
var pop_port = chrome.runtime.connect({name:"pop_channel"});

function update_progress(time_left) {
  alert("Progress: " + time_left);
}

function get_time_until_done() {
  var time = 0.0;
  $.ajax({
     async: false,
     type: 'GET',
     url: server_addr + time_endpoint,
     success: function(data) {
          time = data;
     }
  }).fail(function(data) {
    alert("Connet the pi, guy!");
  });
  return time;
}

function make_popcorn() {
  $.post(server_addr + make_endpoint, function(data) {
      //alert("Bringing you popcorn in T-Minus " + data.pop_time + " seconds dog!");
      var time_left = get_time_until_done();
      while(time_left > 0) {
        update_progress(time_left);
        time_left = get_time_until_done();
      }
  }).fail(function(data) {
    if('error' in data) {
      switch(data['error_type']) {
        case 'busy':
          break;
        default:
          console.log('Unrecognized error type: ' + data['error_type']);
      }
    }
  }); 
}


chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.type) {
      case "make_popcorn":
        make_popcorn();
        break;
      default:
        console.log('Unrecognized request type: ' + data['error_type']);
    }
  }
);
