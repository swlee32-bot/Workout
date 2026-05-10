const CACHE_NAME = 'workout-pwa-v7';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시 저장 완료');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시된 파일을, 없으면 네트워크에서 가져옴
        return response || fetch(event.request);
      })
  );
});
// 클라이언트(index.html)에서 업데이트하라는 메시지를 받으면 즉시 대기열을 건너뛰고 활성화
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
