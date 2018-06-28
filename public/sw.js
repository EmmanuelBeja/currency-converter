
var cacheName = 'currency-converter-static-v2';

// Default files to always cache
var cacheFiles = [
  './',
  './convert',
  './js/main.js',
  './js/bootstrap.min.js',
  './js/jquery-3.3.1.slim.min.js',
  './js/popper.min.js',
  './css/bootstrap.min.css',
  './css/fontawesome-free-5.1.0-web/css/all.css'
]

self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Installed');

    // event.waitUntil Delays the event until the Promise is resolved
    event.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then(function(cache) {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	); // end event.waitUntil
});


self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activated');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('currency-converter-static-') &&
                 !cacheFiles.includes(cacheName);
        }).map(function(cacheName) {
          // Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
	console.log('[ServiceWorker] Fetch', event.request.url);

	// e.respondWidth Responds to the fetch event
	event.respondWith(

		// Check in cache for the request being made
		caches.match(event.request)

			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", event.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

				var requestClone = event.request.clone();
				return fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ")
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(event.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', event.request.url);

							// Return the response
							return response;

				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(event.request)
	); // end event.respondWith
});
