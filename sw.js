const CACHE = "smartwallet-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-maskable.svg"];

// Install: cache all core assets
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Supabase API & CDN fonts/scripts → Network only (must be online for live data)
// - App shell (HTML, icons, manifest) → Cache first, fallback to network
self.addEventListener("fetch", e => {
  const url = e.request.url;

  const isExternal =
    url.includes("supabase.co") ||
    url.includes("fonts.googleapis.com") ||
    url.includes("fonts.gstatic.com") ||
    url.includes("unpkg.com") ||
    url.includes("cdn.tailwindcss.com") ||
    url.includes("babel");

  if (isExternal) {
    // Network only for external resources
    e.respondWith(fetch(e.request).catch(() => new Response("", { status: 408, statusText: "Offline" })));
    return;
  }

  // Cache first for local app shell
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      });
    }).catch(() => caches.match("./index.html"))
  );
});
