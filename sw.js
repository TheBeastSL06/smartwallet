// SmartWallet Service Worker — Network First, No Cache
// Always fetches fresh files. Clears all cache on activate.

self.addEventListener("install", e => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", e => {
  // Delete ALL caches so old broken files are never served
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// Always go to network — never serve from cache
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() =>
      new Response(
        `<!DOCTYPE html><html>
        <head><meta charset="UTF-8"><title>SmartWallet — Offline</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <style>
          body{margin:0;background:#070d1b;color:#fff;font-family:sans-serif;
          display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;}
        </style></head>
        <body>
          <div>
            <div style="font-size:52px;margin-bottom:16px">📶</div>
            <h2 style="color:#10b981;margin:0 0 8px">You are offline</h2>
            <p style="color:#64748b;font-size:14px;margin:0">
              SmartWallet needs an internet connection.<br>
              Please reconnect and try again.
            </p>
          </div>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } }
      )
    )
  );
});
