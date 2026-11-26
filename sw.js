const C='adhkar-v10',Q='adhkar-q1';
const A=['./','./index.html','./manifest.webmanifest','./aud1.js','./aud2.js','./aud3.js','./aud4.js'];
const QF=['./hisn1.js','./hisn2.js',"./q1.js", "./q2.js", "./q3.js", "./q4.js", "./q5.js", "./q6.js", "./q7.js", "./q8.js", "./q9.js"];
self.addEventListener('install',e=>{e.waitUntil(Promise.all([caches.open(C).then(c=>c.addAll(A)),caches.open(Q).then(c=>Promise.allSettled(QF.map(u=>c.add(u))))]));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==Q).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 if(/\/(q|hisn)\d+\.js$/.test(new URL(e.request.url).pathname)){e.respondWith(caches.match(e.request,{cacheName:Q}).then(r=>r||fetch(e.request).then(x=>{const cp=x.clone();caches.open(Q).then(c=>c.put(e.request,cp));return x})));return}
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}e.waitUntil(self.registration.showNotification(d.title||'أذكار وصلاة على النبي',{body:d.body||'',tag:d.tag||undefined,lang:'ar',dir:'rtl'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return self.clients.openWindow('./')}))});
