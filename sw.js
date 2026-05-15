// 버전을 v9로 올려주세요. (코드를 수정할 때마다 이 숫자를 올려야 합니다)
const CACHE_NAME = 'workout-pwa-v11'; 
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

// [새로 추가된 핵심 로직] 제어권을 가질 때, 현재 CACHE_NAME과 이름이 다른 옛날 캐시를 모두 삭제합니다.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('이전 버전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
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
