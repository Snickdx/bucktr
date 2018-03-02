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

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  
  
  // event.waitUntil(
  //   caches.keys().then(function(names) {
  //     for (let name of names) caches.delete(name);
  //     self.skipWaiting().then(()=> workboxSW.clientsClaim());
  //     console.log("Caches Cleared!");
  //   })
  // );
  
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
