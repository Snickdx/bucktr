importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new WorkboxSW({clientsClaim: true});
workboxSW.precache([]);




self.addEventListener('push', function(event) {
  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = 'images/android-desktop.png';
  var tag = 'simple-push-example-tag';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});
