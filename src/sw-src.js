importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

const DEBUG = false;

workbox.setConfig({debug: DEBUG});

if(DEBUG)workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

if(!DEBUG)workbox.googleAnalytics.initialize();

workbox.precaching.precacheAndRoute([]);

const endpoint = 'https://us-central1-fixmehup.cloudfunctions.net/menumize/(.*)';

const appurl = DEBUG? "localhost:8100/#/recent" : "https://app.menumizer.com/#/recent";

const queue = new workbox.backgroundSync.Plugin('mizerQueue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
  callbacks: {
    requestWillEnqueue: req => {
      console.log("queuing ", req);
      return req;
    },
    queueDidReplay: reqs => {
      console.log("requests replayed", reqs);
      self.registration.showNotification("Results sent in background", {
        body: "Your Mizers are ready! Find them on the recent page.",
        icon: "assets/icon/android-icon-144x144.png",
        badge:'assets/icon/badge.png',
        tag: "workbox-background-sync:mizer-queue",
        actions:[
          {
            action:"gotoMizers",
            title:"See Mizers",
            badge:'assets/icon/badge.png',
            data: reqs
          }
        ]
      })
    }
  }
});

//************************************* Caching Routes ***********************************************
workbox.routing.registerRoute(
  new RegExp(endpoint),
  workbox.strategies.staleWhileRevalidate({
   cacheName:"mizer-cache",
   plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
        maxEntries: 10,
        cacheableResponse: {statuses: [0, 200]}
      }),
     queue
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

//for handling updates https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});

addEventListener('notificationclick', function(event) {
  let data  = event.notification.data;
  
  event.notification.close();
  
  if (event.action === 'goToMizers') {}
  clients.openWindow(appurl);
  
}, false);

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
