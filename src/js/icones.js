// Pictogramas provisórios desenhados pela equipe (traço simples, sem detalhes que distraem).
// Podem ser trocados por pictogramas ARASAAC (CC BY-NC-SA) na V2, mantendo os mesmos ids.

const T = 'stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"';

export const ICONES = {
  dor: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <rect x="10" y="22" width="44" height="20" rx="10" ${T} transform="rotate(-35 32 32)"/>
    <rect x="25" y="25" width="14" height="14" rx="3" fill="currentColor" opacity=".25" transform="rotate(-35 32 32)"/>
    <circle cx="29" cy="31" r="1.6" fill="currentColor"/><circle cx="35" cy="33" r="1.6" fill="currentColor"/>
    <path d="M50 8l3 6M58 16l-6 2M44 6v6" ${T}/></svg>`,
  fome: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="36" r="16" ${T}/><circle cx="32" cy="36" r="9" ${T} opacity=".5"/>
    <path d="M8 18v12a4 4 0 0 0 8 0V18M12 30v24" ${T}/><path d="M52 18c-4 2-5 8-5 14h5v22" ${T}/></svg>`,
  sede: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M16 10h32l-4 44a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z" ${T}/>
    <path d="M18.5 28h27l-2.6 26H21.2z" fill="currentColor" opacity=".25"/>
    <path d="M28 38c0-3 4-7 4-7s4 4 4 7a4 4 0 0 1-8 0z" fill="currentColor"/></svg>`,
  enjoo: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="24" ${T}/>
    <path d="M22 26l5 2M42 26l-5 2" ${T}/>
    <path d="M20 44c3-3 6-3 8 0s5 3 8 0 6-3 8 0" ${T}/></svg>`,
  frio: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 6v52M9.5 19l45 26M9.5 45l45-26" ${T}/>
    <path d="M25 10l7 6 7-6M25 54l7-6 7 6M8 28l9-2-3-9M56 36l-9 2 3 9M8 36l9 2-3 9M56 28l-9-2 3-9" ${T}/></svg>`,
  calor: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="11" ${T}/><circle cx="32" cy="32" r="11" fill="currentColor" opacity=".25"/>
    <path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.6 5.6M44.8 44.8l5.6 5.6M13.6 50.4l5.6-5.6M44.8 19.2l5.6-5.6" ${T}/></svg>`
};

// Bolinhas da escala: a intensidade nunca depende só da cor.
export function bolinhas(nivel, tamanho = 18) {
  let s = '';
  for (let i = 1; i <= 3; i++) {
    s += `<svg viewBox="0 0 20 20" width="${tamanho}" height="${tamanho}" aria-hidden="true"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="2.5" fill="${i <= nivel ? 'currentColor' : 'none'}"/></svg>`;
  }
  return `<span class="bolinhas" aria-hidden="true">${s}</span>`;
}

// Mini boneco 2D com a região destacada (para os botões de "Onde?").
const PARTES = {
  regiao_cabeca: '<circle cx="30" cy="12" r="8"/>',
  regiao_garganta: '<rect x="27" y="19" width="6" height="5" rx="2"/>',
  regiao_peito: '<ellipse cx="30" cy="31" rx="11" ry="7.5"/>',
  regiao_barriga: '<ellipse cx="30" cy="44" rx="10.5" ry="7"/>',
  regiao_bracos: '<rect x="12" y="26" width="5" height="16" rx="2.5" transform="rotate(18 14.5 34)"/><rect x="43" y="26" width="5" height="16" rx="2.5" transform="rotate(-18 45.5 34)"/>',
  regiao_maos: '<circle cx="12" cy="45" r="3.6"/><circle cx="48" cy="45" r="3.6"/>',
  regiao_pernas: '<rect x="22.5" y="51" width="6" height="14" rx="3"/><rect x="31.5" y="51" width="6" height="14" rx="3"/>',
  regiao_pes: '<ellipse cx="25" cy="68" rx="4.6" ry="2.6"/><ellipse cx="35" cy="68" rx="4.6" ry="2.6"/>'
};

export function miniBoneco(regiao) {
  const corpo = Object.entries(PARTES)
    .map(([id, d]) => `<g class="${regiao === id || regiao === 'corpo_todo' ? 'mb-on' : 'mb-off'}">${d}</g>`)
    .join('');
  return `<svg class="mini-boneco" viewBox="4 2 52 70" aria-hidden="true">${corpo}</svg>`;
}

export const ICONES_UI = {
  som: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  semSom: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  movimento: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12c3-6 6-6 9 0s6 6 9 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  semMovimento: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  ouvir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  esquerda: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-3-6.2M17 2v4h-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="matrix(-1 0 0 1 24 0)"/></svg>',
  direita: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-3-6.2M17 2v4h-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  voltar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  seguir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
};
