var VERSION = 'ditty-pa-v4.11';
var CACHE = 'ditty-pa-' + VERSION;
var SHELL = [
  '/ditty-pa/index.html',
  '/ditty-pa/manifest.json',
  '/ditty-pa/icon-192.png',
  '/ditty-pa/icon-512.png',
  '/ditty-pa/apple-touch-icon.png',
  '/ditty-pa/favicon.ico'
];

var NO_CACHE = [
  'workers.dev',
  'googleapis.com',
  'anthropic.com',
  'accounts.google.com',
  'api.jsonbin.io'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c) { return c.addAll(SHELL); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  if (NO_CACHE.some(function(d) { return url.indexOf(d) > -1; })) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        if (res && res.status === 200 && e.request.method === 'GET') {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      });
    }).catch(function() {
      return caches.match('/ditty-pa/index.html');
    })
  );
});

// Allow page to force the waiting SW to activate immediately
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
