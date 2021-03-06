if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then((registration) => {
    console.log('Registration successful, scope is:', registration.scope);
  })
  .catch((error) => {
    console.log('Service worker registration failed, error:', error);
  });

  navigator.serviceWorker..addEventListener("updatefound", function(){//listen for updates
    console.log('update found');
    var worker = registration.installing//get the updated service worker
    registration.installing.addEventListener("statechange", function(e){//listen for state change of the update
      if (worker.state == "installed") {//if state becomes installed
        worker.postMessage({action: "update"});//use postMessage API
      }
    })
  })
  navigator.serviceWorker.addEventListener("contollerchange", function(){
    window.location.reload();
  })
}
