var CACHE = 'ditty-pa-shell';
var SHELL = [
  '/ditty-pa/index.html',
  '/ditty-pa/manifest.json',
  '/ditty-pa/icon-192.png',
  '/ditty-pa/icon-512.png',
  '/ditty-pa/apple-touch-icon.png',
  '/ditty-pa/favicon.ico'
];
var NO_CACHE = ['workers.dev','googleapis.com','anthropic.com','accounts.google.com','api.jsonbin.io','open-meteo.com','yahoo.com'];
var NETWORK_FIRST = ['/ditty-pa/index.html','/ditty-pa/','portfolio-poster.css','vault-look.css','weather-poster.css','vault.svg'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});
function isNetworkFirst(url) {
  return NETWORK_FIRST.some(function(p){ return url.indexOf(p)>-1; });
}
self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  if (NO_CACHE.some(function(d){ return url.indexOf(d)>-1; })) return;
  if (e.request.method==='GET' && isNetworkFirst(url)) {
    e.respondWith(fetch(e.request).catch(function(){ return caches.match(e.request); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(cached){ return cached || fetch(e.request); }));
});
