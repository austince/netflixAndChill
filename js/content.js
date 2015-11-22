/** 
 * What is injected into the netflix watch page
 * 
 */

window.addEventListener("load", function() {
  // Search for title and all that jazz
  // netflix is picky about that...
  // Check if the make setting is on
	chrome.storage.sync.get({
		// Defaults to true
		pop_on_watch: true
	}, function(items) {
		if (items.pop_on_watch) {
			alert("Pop corn on the way! Maybe!");
			make_popcorn();
		} else {
			alert("Not making any damn popcorn!");
		}
	});

}, true);


function make_popcorn() {
	chrome.extension.sendMessage({
			type: "make_popcorn",
			data: {
				title: "Netflix ugh"
			}
		});
}
