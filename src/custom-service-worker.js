importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  self.addEventListener('notificationclick', event => {
    if (!event.notification.data?.url) {
      return;
    }

    if (clients.openWindow) {
      event.waitUntil(clients.openWindow(event.notification.data.url));

      return;
    }

    window.open(event.notification.data.url, '_blank');
  });
})();
