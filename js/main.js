/**
*
*/
var port = chrome.extension.connect({name: "pop_port"});

$(document).ready(function() {
	chrome.storage.sync.get({
		// Defaults to true
		pop_on_watch: true
	}, function(items) {
		document.getElementById('like').checked = items.likesColor;
	});
});

port.onMessage.addListener(function(msg) {
    switch(msg.type) {
			case "update_pop_progress":
				update_progress(msg.progress);
		}
});


function update_progress(progress) {
	// Find the progress bar, unhide it, and update it
	$("#progress_wrapper").show();
	var bar = document.getElementById("progress"); // Don't like jQuery value getting
	var current_value = bar.value;
	console.log(current_value);
	bar.value = progress;
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.type) {
      case "update_pop_progress":
        update_progress(request.progress);
        break;
			case "popcorn_finished":
				// Hide it all and alert that we're coming!
				break;
      default:
        console.log('Unrecognized request type: ' + data['error_type']);
    }
  }
);

