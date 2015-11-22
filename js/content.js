/** 
 * What is injected into the netflix watch page
 * 
 */

window.addEventListener("load", function() {
  // Search for title and all that jazz
  // netflix is picky about that...
  // Get the 
  chrome.extension.sendMessage({
    type: "make_popcorn",
    data: {
      title: "Netflix ugh"
    }
  });
  // alert("Sent message!");
}, true);