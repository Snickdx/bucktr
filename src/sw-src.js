importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.0/workbox-sw.js');
// importScripts('https://code.jquery.com/jquery-3.2.1.min.js');
// importScripts("https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js");

workbox.setConfig({debug: true});
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

// const orderQueue = new Queue("order-queue", {
//   callbacks: {
//     requestWillEnqueue: (req) => console.log("Offline, queueing req: ", req),
//     queueDidReplay: (reqs)=> console.log("Replayed requests", reqs)
//   }
// });

workbox.precaching.precacheAndRoute([]);


//for handling updates https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});


workbox.googleAnalytics.initialize();


workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources',
  }),
);

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
      }),
    ],
  }),
);


addEventListener('fetch', event => {
  event.respondWith((async () => {
    if (event.request.mode === "navigate" &&
      event.request.method === "GET" &&
      registration.waiting &&
      (await clients.matchAll()).length < 2
    ) {
      registration.waiting.postMessage('skipWaiting');
      return new Response("", {headers: {"Refresh": "0"}});
    }
    return await caches.match(event.request) ||
      fetch(event.request);
  })());
});

self.addEventListener('push', function(event) {
  var title = 'Menumizer Says';
  var body = 'We have received a push message.';
  var icon = 'assets/icon/android-icon-144x144.png';
  var tag = 'test-notification';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});
