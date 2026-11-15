const C="issap-v3";
const FILES=["./","index.html","auth.js","firebase-config.js","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","bank/d1.js","bank/d2.js","bank/d3.js","bank/d4.js","bank/d5.js","bank/d6.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// network first so updates show up right away; fall back to cache offline.
// Only this site's files and the Firebase SDK; never Firebase's live API traffic.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin && u.hostname!=="www.gstatic.com") return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
