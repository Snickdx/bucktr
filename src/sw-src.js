importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new WorkboxSW({clientsClaim: true});
workboxSW.precache([]);


self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
  
  event.waitUntil(
    caches.keys().then(function(names) {
      for (let name of names)
        caches.delete(name);
    })
  );
  
  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
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
