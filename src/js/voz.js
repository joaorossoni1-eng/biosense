// Áudio do BioSense.
// Prioridade: arquivo gravado pela equipe (campo "audio" no JSON) → voz do navegador (pt-BR).
// Nada é gravado nem enviado: a voz só toca no aparelho.

let ligado = true;
let vozPt = null;
let tocando = null;

function escolherVoz() {
  if (!('speechSynthesis' in window)) return;
  const vozes = speechSynthesis.getVoices();
  vozPt = vozes.find((v) => v.lang === 'pt-BR' && /female|feminina|luciana|francisca|google/i.test(v.name))
    || vozes.find((v) => v.lang === 'pt-BR')
    || vozes.find((v) => v.lang?.startsWith('pt')) || null;
}
if ('speechSynthesis' in window) {
  escolherVoz();
  speechSynthesis.onvoiceschanged = escolherVoz;
}

export function somLigado() { return ligado; }
export function ligarSom(v) { ligado = v; if (!v) parar(); }

export function parar() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (tocando) { tocando.pause(); tocando = null; }
}

// partes: lista de { texto, audio } tocadas em sequência
export async function falar(partes) {
  if (!ligado) return;
  parar();
  const lista = (Array.isArray(partes) ? partes : [partes]).map((p) => (typeof p === 'string' ? { texto: p } : p));
  for (const p of lista) {
    if (!ligado) return;
    if (p.audio) {
      const ok = await tocarArquivo(p.audio);
      if (ok) continue;
    }
    await falarTexto(p.texto);
  }
}

function tocarArquivo(src) {
  return new Promise((resolve) => {
    const a = new Audio(new URL(src, document.baseURI).href);
    tocando = a;
    a.onended = () => resolve(true);
    a.onerror = () => resolve(false);
    a.play().catch(() => resolve(false));
  });
}

function falarTexto(texto) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window) || !texto) return resolve();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'pt-BR';
    if (vozPt) u.voice = vozPt;
    u.rate = 0.88;   // um pouco mais devagar que o normal
    u.pitch = 1.05;
    u.onend = u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}
