'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "ec0966d7168e9dd3b89d8f59ac7bbc8f",
"assets/assets/fonts/HindSiliguri-Bold.ttf": "09e7451bd892e6af09275b701369b454",
"assets/assets/fonts/HindSiliguri-Light.ttf": "8265fea97f78727b251c512253942467",
"assets/assets/fonts/HindSiliguri-Medium.ttf": "41fd138da9f718913aa98aae255b859b",
"assets/assets/fonts/HindSiliguri-Regular.ttf": "5858488e9870f755271e8a71754eda49",
"assets/assets/fonts/HindSiliguri-SemiBold.ttf": "c75e4224905a200c868801e66480b7d3",
"assets/assets/images/cocacola.png": "2a71f584a56d2889e63d9781e7c60578",
"assets/assets/images/dashboard.png": "01243bcdcbcc72c270c19030eafe11bd",
"assets/assets/images/fb.png": "6c1517033429601118f1d9698c9cb428",
"assets/assets/images/footer.jpg": "6ffd10385faa8a4bbc28dd660b11d074",
"assets/assets/images/google.png": "baa58fbc1529cfdee811fd2cd6ad9a14",
"assets/assets/images/img1.png": "82692fd520b913939bee1033cffc2e35",
"assets/assets/images/landing.png": "1a64d0e4c3a0c4bd126fc7e81599f789",
"assets/assets/images/linkedin.png": "524ddcf957551a4b6282cf9f28825b6d",
"assets/assets/images/logo.png": "3d5a36612b9e73013cf2be68bbe2f90f",
"assets/assets/images/logocopy.png": "2e9199ade0593055cc0f3720f3525ba8",
"assets/assets/images/mockup.png": "e9a79acbcae525fc57ca81651afcaed8",
"assets/assets/images/p2p.jpg": "fdadf4c22461c2544b60c68e4258920b",
"assets/assets/images/portfolio00.jpg": "4c83568ac09b3a22a62f388ee7ca1365",
"assets/assets/images/samsung.png": "fc7b329944af591fc4beb52b537647ea",
"assets/assets/images/sell.jpg": "bf2fe91aaa85a064b5920f726a05c0f3",
"assets/assets/images/share.jpg": "d1ca5c14375da96b8a84caecbd16aa38",
"assets/assets/images/vector.png": "0eede854c2d8031066895429c95453b6",
"assets/assets/images/vector1.png": "4bfc0123e83305884cd07ce7d4a37db8",
"assets/FontManifest.json": "746d9bb46f219558ee0cbc6938fccc23",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "f8e81e5e2cb459bfb6b00e67fcf4d215",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "9f09652ae32ec54d08cc6fb426733ada",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icons/Icon-192.png": "d21afd89e314ac2bd58672f2609f3ecb",
"icons/Icon-512.png": "c4477c15850961201e9d285fb6d6aedb",
"icons/Icon-maskable-192.png": "d21afd89e314ac2bd58672f2609f3ecb",
"icons/Icon-maskable-512.png": "c4477c15850961201e9d285fb6d6aedb",
"index.html": "0e49f8a1e16e0fa435de3c233174aff2",
"/": "0e49f8a1e16e0fa435de3c233174aff2",
"main.dart.js": "73ec0a0168afbfe31da7a8b059869ad7",
"manifest.json": "72b65abf750f5d064e6c2a1e9db18182",
"version.json": "cfa61aa4e5881d5fa05774a54b32feac"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
