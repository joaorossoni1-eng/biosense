import '../css/estilo.css';
import { Boneco } from './boneco.js';
import { ICONES, ICONES_UI, bolinhas, miniBoneco } from './icones.js';
import { falar, parar, ligarSom, somLigado } from './voz.js';

const $ = (s, el = document) => el.querySelector(s);

// ---------- conteúdo (JSON editável por Processos Biológicos) ----------
async function carregar(nome) {
  const r = await fetch(new URL(`conteudo/${nome}.json`, document.baseURI));
  return r.json();
}
const [{ sensacoes }, { regioes }, { niveis }] = await Promise.all([
  carregar('sensacoes'), carregar('regioes'), carregar('escala')
]);
const porId = (lista, id, campo = 'id') => lista.find((x) => x[campo] === id);

// ---------- estado ----------
const estado = { modo: 'contar', passo: 'onde', regiao: null, sensacao: null, nivel: null, descobrir: null };
const PASSOS = [
  { id: 'onde', rotulo: 'Onde?' },
  { id: 'oque', rotulo: 'O quê?' },
  { id: 'quanto', rotulo: 'Quanto?' }
];

// ---------- cena 3D ----------
let ajustesSalvos = null;
try { ajustesSalvos = JSON.parse(localStorage.getItem('biosense-ajustes') || 'null'); } catch {}

const boneco = new Boneco($('#cena'), {
  tipo: ajustesSalvos?.tipo || 'menino',
  aoSelecionar: (reg) => {
    if (estado.modo === 'contar' && estado.passo === 'onde') escolherRegiao(reg);
  }
});

// ---------- ajustes ----------
const btnSom = $('#btn-som');
const btnMov = $('#btn-movimento');
function pintarAjustes() {
  btnSom.innerHTML = somLigado() ? ICONES_UI.som : ICONES_UI.semSom;
  btnSom.setAttribute('aria-pressed', somLigado());
  btnSom.setAttribute('aria-label', somLigado() ? 'Som ligado. Toque para desligar' : 'Som desligado. Toque para ligar');
  btnSom.title = somLigado() ? 'Som ligado' : 'Som desligado';
  btnMov.innerHTML = boneco.movimento ? ICONES_UI.movimento : ICONES_UI.semMovimento;
  btnMov.setAttribute('aria-pressed', boneco.movimento);
  btnMov.setAttribute('aria-label', boneco.movimento ? 'Movimento ligado. Toque para parar' : 'Movimento parado. Toque para ligar');
  btnMov.title = boneco.movimento ? 'Movimento ligado' : 'Movimento parado';
  document.documentElement.classList.toggle('sem-movimento', !boneco.movimento);
}
btnSom.onclick = () => { ligarSom(!somLigado()); pintarAjustes(); salvarAjustes(); };
btnMov.onclick = () => { boneco.movimento = !boneco.movimento; pintarAjustes(); salvarAjustes(); };
$('#btn-info').innerHTML = ICONES_UI.info;
$('#btn-info').onclick = () => { parar(); $('#dlg-info').showModal(); };
$('#girar-esq').innerHTML = ICONES_UI.esquerda;
$('#girar-dir').innerHTML = ICONES_UI.direita;
$('#girar-esq').onclick = () => boneco.girar(-Math.PI / 2);
$('#girar-dir').onclick = () => boneco.girar(Math.PI / 2);

// ajustes do aparelho (som/movimento) — preferência local, nenhum dado da criança
function salvarAjustes() {
  try { localStorage.setItem('biosense-ajustes', JSON.stringify({ som: somLigado(), mov: boneco.movimento, tipo: boneco.tipo })); } catch {}
}
if (ajustesSalvos) { ligarSom(ajustesSalvos.som); boneco.movimento = ajustesSalvos.mov; }
pintarAjustes();

// ---------- menino ou menina ----------
function pintarTipo() {
  document.querySelectorAll('.tipo').forEach((b) => b.setAttribute('aria-pressed', b.dataset.tipo === boneco.tipo));
}
document.querySelectorAll('.tipo').forEach((b) => {
  b.onclick = () => {
    boneco.trocarTipo(b.dataset.tipo);
    pintarTipo();
    salvarAjustes();
    falar(b.textContent);
    avisar(`Boneco: ${b.textContent}`);
  };
});
pintarTipo();

// ---------- modos ----------
document.querySelectorAll('.modo').forEach((b) => {
  b.onclick = () => trocarModo(b.dataset.modo);
});
function trocarModo(modo) {
  parar();
  estado.modo = modo;
  document.querySelectorAll('.modo').forEach((b) => b.setAttribute('aria-pressed', b.dataset.modo === modo));
  if (modo === 'contar') reiniciar(false);
  else { estado.descobrir = null; render(); }
}

// ---------- ações do fluxo ----------
function escolherRegiao(id) {
  estado.regiao = id;
  const r = porId(regioes, id);
  falar({ texto: r.nome, audio: r.audio });
  avisar(`${r.nome} escolhida`);
  render(false);
}
function escolherSensacao(id) {
  estado.sensacao = id;
  const s = porId(sensacoes, id);
  falar({ texto: s.nome, audio: s.audio });
  avisar(`${s.nome} escolhida`);
  render(false);
}
function escolherNivel(n) {
  estado.nivel = n;
  const nv = porId(niveis, n, 'nivel');
  falar({ texto: nv.nome, audio: nv.audio });
  avisar(`${nv.nome} escolhido`);
  render(false);
}
function irPara(passo) {
  parar();
  estado.passo = passo;
  render();
  if (passo === 'resumo') falarResumo();
  else falar(perguntaFalada());
}
function reiniciar(falarPergunta = true) {
  Object.assign(estado, { passo: 'onde', regiao: null, sensacao: null, nivel: null });
  boneco.centralizar();
  render();
  if (falarPergunta) falar(perguntaFalada());
}

function frase() {
  const s = porId(sensacoes, estado.sensacao);
  const r = porId(regioes, estado.regiao);
  const n = porId(niveis, estado.nivel, 'nivel');
  return { s, r, n, texto: `${s.frase} ${r.frase}.`, nivel: n.frase };
}
function falarResumo() {
  const { s, r, n } = frase();
  falar([{ texto: `${s.frase} ${r.frase}.` }, { texto: n.frase, audio: n.audio }]);
}
function perguntaFalada() {
  return { onde: 'Onde você sente?', oque: 'O que você sente?', quanto: 'Quanto você sente?' }[estado.passo];
}

// ---------- render ----------
const conteudo = $('#conteudo');
const progresso = $('#progresso');

function render(focar = true) {
  document.body.dataset.modo = estado.modo;
  document.body.dataset.passo = estado.modo === 'contar' ? estado.passo : 'descobrir';
  if (estado.modo === 'descobrir') renderDescobrir();
  else renderContar();
  boneco.interativo = estado.modo === 'contar' && estado.passo === 'onde';
  $('#dica').hidden = !boneco.interativo;
  if (focar) $('h1', conteudo)?.focus({ preventScroll: true });
}

function renderProgresso() {
  if (estado.modo !== 'contar') { progresso.hidden = true; return; }
  progresso.hidden = false;
  const atual = PASSOS.findIndex((p) => p.id === estado.passo);
  progresso.innerHTML = PASSOS.map((p, i) => {
    const feito = estado.passo === 'resumo' || i < atual;
    const agora = i === atual;
    return `<li class="${feito ? 'feito' : ''} ${agora ? 'agora' : ''}" ${agora ? 'aria-current="step"' : ''}>
      <span class="num">${feito ? '✓' : i + 1}</span><span>${p.rotulo}</span></li>`;
  }).join('');
}

function cabecalho(titulo, falaExtra) {
  return `<div class="pergunta">
    <h1 tabindex="-1">${titulo}</h1>
    <button class="icone-btn ouvir" data-ouvir aria-label="Ouvir de novo">${ICONES_UI.ouvir}</button>
  </div>${falaExtra ? `<p class="apoio">${falaExtra}</p>` : ''}`;
}

function rodape({ voltar, seguir, podeSeguir }) {
  return `<div class="rodape">
    ${voltar ? `<button class="botao" data-voltar="${voltar}">${ICONES_UI.voltar}<span>Voltar</span></button>` : '<span></span>'}
    ${seguir ? `<button class="botao primario" data-seguir="${seguir}" ${podeSeguir ? '' : 'disabled'}><span>Continuar</span>${ICONES_UI.seguir}</button>` : ''}
  </div>`;
}

function renderContar() {
  renderProgresso();
  const p = estado.passo;
  let html = '';

  if (p === 'onde') {
    html += cabecalho('Onde você sente?', 'Toque no boneco ou escolha abaixo.');
    html += `<div class="opcoes opcoes-regioes" role="group" aria-label="Partes do corpo">` +
      regioes.map((r) => `<button class="opcao" data-regiao="${r.id}" aria-pressed="${estado.regiao === r.id}">
        ${miniBoneco(r.id)}<span>${r.nome}</span></button>`).join('') + `</div>`;
    html += rodape({ seguir: 'oque', podeSeguir: !!estado.regiao });
    boneco.mostrar({ regioes: estado.regiao ? [estado.regiao] : [] });
  }

  if (p === 'oque') {
    const r = porId(regioes, estado.regiao);
    html += cabecalho('O que você sente?', `Em: <strong>${r.nome}</strong>`);
    html += `<div class="opcoes opcoes-sensacoes" role="group" aria-label="Sensações">` +
      sensacoes.map((s) => `<button class="opcao sensacao" data-sensacao="${s.id}" aria-pressed="${estado.sensacao === s.id}">
        <span class="picto">${ICONES[s.icone]}</span><span>${s.nome}</span></button>`).join('') + `</div>`;
    html += rodape({ voltar: 'onde', seguir: 'quanto', podeSeguir: !!estado.sensacao });
    boneco.mostrar({ regioes: [estado.regiao] });
  }

  if (p === 'quanto') {
    const s = porId(sensacoes, estado.sensacao);
    const r = porId(regioes, estado.regiao);
    html += cabecalho('Quanto você sente?', `<strong>${s.nome}</strong> ${r.frase}`);
    html += `<div class="opcoes opcoes-escala" role="group" aria-label="Intensidade">` +
      niveis.map((n) => `<button class="opcao nivel nivel-${n.nivel}" data-nivel="${n.nivel}" aria-pressed="${estado.nivel === n.nivel}" style="--cor-nivel:${n.cor}">
        <span class="barra" aria-hidden="true"><span></span></span>
        ${bolinhas(n.nivel, 22)}<span class="nivel-nome">${n.nome}</span></button>`).join('') + `</div>`;
    html += rodape({ voltar: 'oque', seguir: 'resumo', podeSeguir: !!estado.nivel });
    const n = estado.nivel ? porId(niveis, estado.nivel, 'nivel') : null;
    boneco.mostrar({ regioes: [estado.regiao], cor: n?.cor });
  }

  if (p === 'resumo') {
    const { s, n, texto } = frase();
    html += `<div class="resumo" style="--cor-nivel:${n.cor}">
      <p class="rotulo">Mostre para um adulto</p>
      <div class="cartao-resumo">
        <span class="picto grande">${ICONES[s.icone]}</span>
        <div>
          <h1 tabindex="-1">${texto}</h1>
          <p class="resumo-nivel">${bolinhas(n.nivel, 26)}<strong>${n.nome}</strong></p>
        </div>
      </div>
      <div class="acoes">
        <button class="botao primario" data-ouvir>${ICONES_UI.ouvir}<span>Ouvir de novo</span></button>
        <button class="botao" data-saber="${s.id}"><span>Saber mais sobre ${s.nome.toLowerCase()}</span></button>
        <button class="botao" data-recomecar><span>Contar outra coisa</span></button>
      </div>
      <button class="link" data-voltar="quanto">${ICONES_UI.voltar}<span>Trocar a resposta</span></button>
    </div>`;
    boneco.mostrar({ regioes: [estado.regiao], cor: n.cor, pulso: true });
  }

  conteudo.innerHTML = html;
}

function renderDescobrir() {
  renderProgresso();
  const atual = estado.descobrir ? porId(sensacoes, estado.descobrir) : null;
  let html = cabecalho('O que o corpo sente?', 'Escolha uma sensação para descobrir.');
  html += `<div class="opcoes opcoes-sensacoes" role="group" aria-label="Sensações">` +
    sensacoes.map((s) => `<button class="opcao sensacao" data-descobrir="${s.id}" aria-pressed="${estado.descobrir === s.id}">
      <span class="picto">${ICONES[s.icone]}</span><span>${s.nome}</span></button>`).join('') + `</div>`;
  if (atual) {
    html += `<article class="cartao-descobrir">
      <h2>${atual.descobrir.titulo}</h2>
      <p>${atual.descobrir.texto}</p>
      <div class="acoes">
        <button class="botao primario" data-ouvir-descobrir>${ICONES_UI.ouvir}<span>Ouvir</span></button>
        <button class="botao" data-contar="${atual.id}"><span>Contar que eu sinto ${atual.nome.toLowerCase()}</span></button>
      </div>
      ${atual.descobrir.revisado ? '' : '<p class="selo">Texto em revisão científica</p>'}
    </article>`;
    boneco.mostrar({ regioes: atual.descobrir.regioes, pulso: true });
  } else {
    boneco.mostrar({ regioes: [] });
  }
  conteudo.innerHTML = html;
}

// ---------- eventos do painel (delegação) ----------
conteudo.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.regiao) escolherRegiao(d.regiao);
  else if (d.sensacao) escolherSensacao(d.sensacao);
  else if (d.nivel) escolherNivel(Number(d.nivel));
  else if (d.seguir) irPara(d.seguir);
  else if (d.voltar) irPara(d.voltar);
  else if (d.recomecar !== undefined) reiniciar();
  else if (d.saber) { trocarModo('descobrir'); abrirDescobrir(d.saber); }
  else if (d.contar) { trocarModo('contar'); estado.sensacao = d.contar; render(); falar(perguntaFalada()); }
  else if (d.descobrir) abrirDescobrir(d.descobrir);
  else if (d.ouvirDescobrir !== undefined) {
    const s = porId(sensacoes, estado.descobrir);
    falar([s.descobrir.titulo, s.descobrir.texto]);
  } else if (d.ouvir !== undefined) {
    if (estado.modo === 'contar' && estado.passo === 'resumo') falarResumo();
    else if (estado.modo === 'contar') falar(perguntaFalada());
    else falar('O que o corpo sente? Escolha uma sensação para descobrir.');
  }
});

function abrirDescobrir(id) {
  estado.descobrir = id;
  render(false);
  const s = porId(sensacoes, id);
  falar([s.descobrir.titulo, s.descobrir.texto]);
  $('.cartao-descobrir h2')?.scrollIntoView({ block: 'nearest', behavior: boneco.movimento ? 'smooth' : 'auto' });
}

function avisar(t) { $('#aviso').textContent = t; }

// ---------- início ----------
render(false);

// PWA: funciona offline depois do primeiro acesso
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register(new URL('sw.js', document.baseURI)).catch(() => {});
}

// gancho para testes automáticos
window.__biosense = { boneco, estado, escolherRegiao, escolherSensacao, escolherNivel, irPara, trocarModo, abrirDescobrir };
