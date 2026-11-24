/* SERVICE WORKER DO SITE DE PEDIDOS (modelo MANHUB)
 * Permite instalar o site como app. Sempre busca a versão nova na internet;
 * usa a cópia guardada só sem conexão. Dados do Supabase nunca ficam em cache.
 * Ao publicar uma versão nova, aumente o número abaixo. */
const VERSAO = 'loja-site-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => Promise.all(['./', './index.html', './config.js', './icone-192.png'].map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('loja-site-') && k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(fetch(req).then((resp) => {
    if (resp.ok) { const copia = resp.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); }
    return resp;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))));
});
