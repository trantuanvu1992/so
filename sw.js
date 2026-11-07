// Sổ Tài Chính – lưu sẵn giao diện trên máy: mở app tức thì, bản mới tự cập nhật ở lần mở sau
const C='stc-shell-v3';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png'])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(/(^|\.)script\.google(usercontent)?\.com$/.test(u.hostname))return; // dữ liệu: luôn lấy mới
  const key=u.origin===location.origin&&r.mode==='navigate'?'./index.html':r;
  e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(key,res.clone());return res}).catch(()=>hit);
    return hit||net}))});
