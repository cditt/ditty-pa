// CACHE is a fixed name now, not tied to a version string. It never needs to
// be manually bumped again: index.html is served network-first below, so a
// fresh index.html upload is picked up immediately on the next load without
// any cache-name change or service worker update at all.
var CACHE = 'ditty-pa-shell';

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

// The app shell HTML is always fetched fresh over the network when online,
// so new deploys activate immediately with no version bump. Falls back to
// the last cached copy when offline, preserving offline support.
var NETWORK_FIRST = [
  '/ditty-pa/index.html',
  '/ditty-pa/'
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

function isNetworkFirst(url) {
  return NETWORK_FIRST.some(function(p) {
    return url.indexOf(p) > -1 && url.indexOf(p) === url.length - p.length;
  });
}

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  if (NO_CACHE.some(function(d) { return url.indexOf(d) > -1; })) return;

  if (e.request.method === 'GET' && isNetworkFirst(url)) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function() {
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('/ditty-pa/index.html');
        });
      })
    );
    return;
  }

  // Icons and manifest: unchanged cache-first behavior, exactly as before.
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
