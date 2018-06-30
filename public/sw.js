
let cacheName = 'currency-converter-static-v10';

// Default files to always cache
let cacheFiles = [
  './',
  './js/main.js',
  './js/bootstrap.min.js',
  './js/jquery-3.3.1.slim.min.js',
  './js/popper.min.js',
  './css/bootstrap.min.css',
  './css/fontawesome-free-5.1.0-web/css/all.css',
  './css/fontawesome-free-5.1.0-web/webfonts/fa-solid-900.ttf',
  './css/fontawesome-free-5.1.0-web/webfonts/fa-solid-900.woff'
]

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installed');

    // event.waitUntil Delays the event until the Promise is resolved
    event.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then((cache) => {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	); // end event.waitUntil
});


self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('currency-converter-static-') &&
                 !cacheFiles.includes(cacheName);
        }).map((cacheName) => {
          // Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', cacheName);
          //return caches.delete(cacheName); //uncomment this
        })
      );
    })
  );
});

//another way to fetch data
self.addEventListener('fetch', (event) => {
	console.log('[ServiceWorker] Fetch', event.request.url);

	// e.respondWidth Responds to the fetch event
	event.respondWith(

		// Check in cache for the request being made
		caches.match(event.request).then((response) => {
				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", event.request.url, response);
					// Return the cached version
					return response;
				}

        // Not in cache - return the result from the live server
        // `fetch` is essentially a "fallback"
        return fetch(event.request);

			}) // end caches.match(event.request)
	); // end event.respondWith
});
