/*window.addEventListener("load", function() {
  //alert("Loaded");
  chrome.extension.sendMessage({
    type: "make_popcorn",
    data: {
      prop: "testies"
    }
  });
  alert("Sent message!");
}, true);*/

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "pop_channel"){
      alert("Ported!");
        port.onMessage.addListener(function(msg) {
            // do some stuff here
        });
    }
});