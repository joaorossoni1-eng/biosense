// Service worker do BioSense: guarda os arquivos do app para funcionar sem internet.
// Não guarda nenhum dado de uso — só os arquivos do próprio app.
const CACHE = 'biosense-v2';
const BASICOS = ['./', './index.html', './manifest.webmanifest',
  './conteudo/sensacoes.json', './conteudo/regioes.json', './conteudo/escala.json',
  './icones/biosense-simbolo.svg', './icones/icone-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// rede primeiro (conteúdo sempre atualizado); sem internet, usa a cópia guardada
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); } return r; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
