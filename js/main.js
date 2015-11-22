/**
*
*/
var port = chrome.extension.connect({name: "pop_port"});

$(document).ready(function() {
	document.getElementById('popcorn_check').addEventListener('click', sync_settings);

	chrome.storage.sync.get({
		// Defaults to true
		pop_on_watch: true
	}, function(items) {
		document.getElementById('popcorn_check').checked = items.pop_on_watch;
	});
});

port.onMessage.addListener(function(msg) {
    switch(msg.type) {
			case "update_pop_progress":
				update_progress(msg.progress);
		}
});

function sync_settings() {
	chrome.storage.sync.set({
		pop_on_watch: document.getElementById('popcorn_check').checked
	});
}

function update_progress(progress) {
	// Find the progress bar, unhide it, and update it
	$("#progress_wrapper").show();
	var bar = document.getElementById("progress"); // Don't like jQuery value getting
	var current_value = bar.value;
	bar.value = progress;
}

