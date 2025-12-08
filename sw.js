// sw.js

// キャッシュ名（バージョンを変えるときはこの文字列を変える）
const CACHE_NAME = 'eplus-marquee-v1';

// オフライン用にキャッシュしておくファイルたち
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './static/style.css',
  './static/mogiri.css',
  './static/script.js',
  './static/icon/apple-touch-icon.png',
  './static/icon/favicon-32x32.png',
  './static/icon/favicon-16x16.png'
];

// インストール時にキャッシュする
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ネット優先・失敗したらキャッシュから返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
