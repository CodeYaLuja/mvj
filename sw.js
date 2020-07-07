var cacheName = 'mvj';
var filesToCache = [
    './index.html',
    './style.css',
    './js/main.js',
    './sketch.js',
    './boss.js',
    './bullet.js',
    './enemy.js',
    './player.js',
    './p5.dom.min.js',
    './p5.min.js',
    './p5.sound.min.js',
    './assets/ArcadeNormal-ZDZ.ttf',
    './assets/mvj.jpg',
    './assets/audio/bomb.mp3',
    './assets/audio/boss.mp3',
    './assets/audio/bossdies.mp3',
    './assets/audio/bullet.mp3',
    './assets/audio/enemydies.mp3',
    './assets/audio/playerdies.mp3',
    './assets/audio/starting.mp3',
    './assets/audio/victory.mp3',
    './sprites/faction1/boss1.png',
    './sprites/faction1/boss2.png',
    './sprites/faction1/boss3.png',
    './sprites/faction1/unit1_1.png',
    './sprites/faction1/unit1_2.png',
    './sprites/faction1/unit1_3.png',
    './sprites/faction1/unit2_1.png',
    './sprites/faction1/unit2_2.png',
    './sprites/faction1/unit2_3.png',
    './sprites/faction1/unit3_1.png',
    './sprites/faction1/unit3_2.png',
    './sprites/faction1/unit3_3.png',
    './sprites/faction2/boss1.png',
    './sprites/faction2/boss2.png',
    './sprites/faction2/boss3.png',
    './sprites/faction2/unit1_1.png',
    './sprites/faction2/unit1_2.png',
    './sprites/faction2/unit1_3.png',
    './sprites/faction2/unit2_1.png',
    './sprites/faction2/unit2_2.png',
    './sprites/faction2/unit2_3.png',
    './sprites/faction2/unit3_1.png',
    './sprites/faction2/unit3_2.png',
    './sprites/faction2/unit3_3.png'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache)
                .then(() => console.log('Assets added to cache'))
                .catch(err => console.log('Error while fetching assets', err));
        })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});