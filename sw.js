const C='adhkar-v6',Q='adhkar-q1';
const A=['./','./index.html','./manifest.webmanifest','./aud1.js','./aud2.js','./aud3.js','./aud4.js'];
const QF=["./q1.js", "./q2.js", "./q3.js", "./q4.js", "./q5.js", "./q6.js", "./q7.js", "./q8.js", "./q9.js"];
self.addEventListener('install',e=>{e.waitUntil(Promise.all([caches.open(C).then(c=>c.addAll(A)),caches.open(Q).then(c=>Promise.allSettled(QF.map(u=>c.add(u))))]));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==Q).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 if(/\/q\d+\.js$/.test(new URL(e.request.url).pathname)){e.respondWith(caches.match(e.request,{cacheName:Q}).then(r=>r||fetch(e.request).then(x=>{const cp=x.clone();caches.open(Q).then(c=>c.put(e.request,cp));return x})));return}
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));});
