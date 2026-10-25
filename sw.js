// 勉強の場のサービスワーカー:つながるときは必ず最新を取りに行き、つながらないときだけ手元の保存を使う
const CACHE = "study-s5";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil((async () => { const scope = self.registration.scope;
  for (const k of await caches.keys()) { if (k === CACHE) continue; const c = await caches.open(k), reqs = await c.keys(); if (reqs.length && reqs.every(r => r.url.startsWith(scope))) await caches.delete(k); }
  await self.clients.claim(); })()); });
self.addEventListener("fetch", e => { const req = e.request; if (req.method !== "GET") return; const url = new URL(req.url);
  if (url.origin !== location.origin || !req.url.startsWith(self.registration.scope)) return;
  e.respondWith((async () => { try { const res = await fetch(req, { cache: "no-store" }); if (res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); } return res; }
    catch (err) { const hit = await caches.match(req); if (hit) return hit; throw err; } })()); });
