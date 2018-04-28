importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

workbox.setConfig({debug: true});

workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

// const orderQueue = new workbox.backgroundSync.Queue("order-queue", {
//   callbacks: {
//     requestWillEnqueue: (req) => console.log("Offline, queueing req: ", req),
//     queueDidReplay: (reqs)=> {
//       console.log(reqs);
//       self.registration.showNotification("Results sent in background", {
//         body: "Menumizer your results are ready!",
//         icon: "assets/icon/android-icon-144x144.png",
//         tag: "results-sync"
//       })
//     },
//     requestWillReplay: (req)=> console.log(req),
//     maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
//   }
// });

workbox.precaching.precacheAndRoute([]);

//for handling updates https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
addEventListener('message', messageEvent => {
  console.log("message received in sw!");
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});

workbox.googleAnalytics.initialize();

workbox.routing.registerRoute(
  new RegExp('https://us-central1-fixmehup.cloudfunctions.net/menumize/(.*)'),
  workbox.strategies.staleWhileRevalidate({
   cacheName:"mizers",
   plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
        maxEntries: 10,
      }),
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources',
  }),
);


workbox.routing.registerRoute(
  /.*(?:googleapis)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'googleapis',
  }),
);

workbox.routing.registerRoute(
  /.*(?:gstatic)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'gstatic',
  }),
);



addEventListener('fetch', event => {
  // Clone the request to ensure it's save to read when
  // adding to the Queue.
  const promiseChain = fetch(event.request.clone())
    .catch((err) => {
      return orderQueue.addRequest(event.request);
    });
  
  event.waitUntil(promiseChain);
  
  event.respondWith((async () => {
    if (event.request.mode === "navigate" && event.request.method === "GET" && registration.waiting && (await clients.matchAll()).length < 2) {
      registration.waiting.postMessage('skipWaiting');
      return new Response("", {headers: {"Refresh": "0"}});
    }
    return await caches.match(event.request) ||
      fetch(event.request);
  })());
});

// self.addEventListener('push', function(event) {
//   var title = 'Menumizer Says';
//   var body = 'We have received a push message.';
//   var icon = 'assets/icon/android-icon-144x144.png';
//   var tag = 'test-notification';
//   if(tag === 'test-notification')
//     event.waitUntil(
//       self.registration.showNotification(title, {
//         body: body,
//         icon: icon,
//         tag: tag
//       })
//     );
// });
