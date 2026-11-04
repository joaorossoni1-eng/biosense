// Cena 3D do BioSense: boneco com 8 regiões tocáveis.
// Se existir public/modelos/boneco-menino.glb ou boneco-menina.glb (feitos no Blender
// pela equipe de MA3D), o modelo é carregado no lugar do boneco provisório. As malhas precisam se chamar
// regiao_cabeca, regiao_garganta, regiao_peito, regiao_barriga,
// regiao_bracos, regiao_maos, regiao_pernas e regiao_pes.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const COR_SELECAO = new THREE.Color('#6C5FB5');
const BRANCO = new THREE.Color('#FFFFFF');

// cores do boneco provisório (fora da escala pouco/médio/muito e do lavanda de seleção)
const COMUM = { pele: '#F1C7A5', tenis: '#3A4256', sola: '#EDE8DF', olho: '#1F2A44', bochecha: '#F2A5A0', boca: '#B4534A' };
const ESTILOS = {
  menino: { ...COMUM, cabelo: '#4A3428', camiseta: '#8FB3E3', manga: '#7FA6DC', baixo: '#3D5A99' },
  menina: { ...COMUM, cabelo: '#5A3626', camiseta: '#F3CADB', manga: '#EBB5CB', baixo: '#3D5A99', laco: '#E68FB3' }
};
export const TIPOS = Object.keys(ESTILOS);

export const REGIOES = [
  'regiao_cabeca', 'regiao_garganta', 'regiao_peito', 'regiao_barriga',
  'regiao_bracos', 'regiao_maos', 'regiao_pernas', 'regiao_pes'
];

function mat(cor, rough = 0.72) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(cor), roughness: rough, metalness: 0 });
}
const lathe = (pts, seg = 56) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

// ---------- boneco provisório: menino ou menina, simples e amigável ----------
// Detalhes "fixos" (olhos, cabelo, boca, bochechas) não mudam de cor ao selecionar.
function criarBonecoProvisorio(tipo = 'menino') {
  const COR = ESTILOS[tipo] || ESTILOS.menino;
  const menina = tipo === 'menina';
  const boneco = new THREE.Group();
  const grupos = {};
  for (const id of REGIOES) {
    const g = new THREE.Group();
    g.name = id;
    g.userData.regiao = id;
    grupos[id] = g;
    boneco.add(g);
  }
  // adiciona uma malha a uma região (ou a um "pai" já dentro da região)
  const add = (pai, geo, cor, { pos = [0, 0, 0], rot = [0, 0, 0], esc = [1, 1, 1], fixo = false, rough } = {}) => {
    const m = new THREE.Mesh(geo, mat(cor, rough));
    m.position.set(...pos); m.rotation.set(...rot); m.scale.set(...esc);
    m.castShadow = true;
    if (fixo) { m.userData.fixo = true; m.name = 'fixo_detalhe'; }
    (typeof pai === 'string' ? grupos[pai] : pai).add(m);
    return m;
  };
  // ponto de articulação dentro de uma região (para braços e mãos ficarem alinhados)
  const pivo = (id, pos, rotZ) => {
    const g = new THREE.Group();
    g.position.set(...pos); g.rotation.z = rotZ;
    grupos[id].add(g);
    return g;
  };

  // ----- cabeça -----
  const CY = 2.72, R = 0.42;
  const sup = (x, y) => Math.sqrt(Math.max(0, R * R - x * x - y * y)); // profundidade na superfície da cabeça
  add('regiao_cabeca', new THREE.SphereGeometry(R, 64, 48), COR.pele, { pos: [0, CY, 0], esc: [1, 1.02, 0.97] });
  if (!menina) for (const l of [-1, 1]) {
    add('regiao_cabeca', new THREE.SphereGeometry(0.085, 24, 16), COR.pele, { pos: [l * 0.445, CY - 0.03, 0.0], esc: [0.5, 1, 0.75] });
  }
  add('regiao_cabeca', new THREE.SphereGeometry(0.038, 20, 14), COR.pele, { pos: [0, CY - 0.04, sup(0, -0.04) + 0.01] }); // nariz
  // cabelo: calota inclinada para trás + franja
  add('regiao_cabeca', new THREE.SphereGeometry(R + 0.028, 64, 40, 0, Math.PI * 2, 0, 1.75), COR.cabelo,
    { pos: [0, CY + 0.01, -0.012], rot: [-0.75, 0, 0], esc: [1.02, 1.03, 1], fixo: true, rough: 0.9 });
  if (!menina) {
    for (const [x, rz] of [[-0.17, 0.5], [-0.04, 0.15], [0.1, -0.25]]) {
      add('regiao_cabeca', new THREE.CapsuleGeometry(0.07, 0.1, 6, 16), COR.cabelo,
        { pos: [x, CY + 0.3, sup(x, 0.3) - 0.02], rot: [0.9, 0, rz], fixo: true, rough: 0.9 });
    }
  } else {
    // cabelo comprido atrás, emoldurando o rosto, até os ombros
    add('regiao_cabeca', new THREE.SphereGeometry(R + 0.04, 64, 40), COR.cabelo,
      { pos: [0, CY - 0.13, -0.23], esc: [1.05, 1.2, 0.74], fixo: true, rough: 0.9 });
    // franja de lado
    for (const [x, y, rz, len] of [[-0.2, 0.27, 1.1, 0.16], [-0.05, 0.31, 1.25, 0.18], [0.12, 0.3, 1.35, 0.14]]) {
      add('regiao_cabeca', new THREE.CapsuleGeometry(0.065, len, 6, 16), COR.cabelo,
        { pos: [x, CY + y, sup(x, y) - 0.03], rot: [0.55, 0, rz], fixo: true, rough: 0.9 });
    }
    // laço
    const dir = new THREE.Vector3(0.62, 0.68, 0.12).normalize().multiplyScalar(R + 0.06);
    const laco = new THREE.Group();
    laco.position.set(dir.x, CY + dir.y, dir.z);
    laco.lookAt(new THREE.Vector3(dir.x * 2, CY + dir.y * 2, dir.z * 2));
    grupos.regiao_cabeca.add(laco);
    for (const l of [-1, 1]) {
      add(laco, new THREE.ConeGeometry(0.06, 0.12, 20), COR.laco, { pos: [l * 0.07, 0, 0], rot: [0, 0, l * Math.PI / 2], esc: [1, 1, 0.55], fixo: true });
    }
    add(laco, new THREE.SphereGeometry(0.035, 16, 12), COR.laco, { fixo: true });
  }
  // olhos com brilho
  for (const l of [-1, 1]) {
    const x = l * 0.145, y = 0.04;
    add('regiao_cabeca', new THREE.SphereGeometry(0.058, 24, 16), COR.olho, { pos: [x, CY + y, sup(x, y) - 0.018], esc: [0.9, 1.15, 0.55], fixo: true, rough: 0.35 });
    add('regiao_cabeca', new THREE.SphereGeometry(0.017, 12, 8), '#FFFFFF', { pos: [x + 0.018, CY + y + 0.025, sup(x, y) + 0.012], fixo: true });
    if (menina) {
      for (const k of [0, 1]) {
        add('regiao_cabeca', new THREE.CapsuleGeometry(0.008, 0.028, 4, 8), COR.olho,
          { pos: [x + l * (0.04 + k * 0.016), CY + y + 0.06 - k * 0.012, sup(x, y) - 0.005], rot: [0, 0, -l * (0.5 + k * 0.4)], fixo: true });
      }
    }
    // sobrancelhas
    add('regiao_cabeca', new THREE.TorusGeometry(0.055, 0.011, 6, 16, Math.PI * 0.75), COR.cabelo,
      { pos: [x, CY + 0.13, sup(x, 0.15) - 0.005], rot: [-0.3, 0, Math.PI * 0.125], fixo: true });
    // bochechas
    const bx = l * 0.25, by = -0.08;
    const b = add('regiao_cabeca', new THREE.SphereGeometry(0.065, 20, 12), COR.bochecha, { pos: [bx, CY + by, sup(bx, by) - 0.012], esc: [1, 0.72, 0.25], fixo: true });
    b.lookAt(b.position.clone().add(new THREE.Vector3(bx, by, sup(bx, by)).normalize()));
    b.material.transparent = true; b.material.opacity = 0.75;
  }
  // sorriso
  add('regiao_cabeca', new THREE.TorusGeometry(0.095, 0.018, 8, 28, Math.PI), COR.boca,
    { pos: [0, CY - 0.13, sup(0, -0.13) - 0.01], rot: [-0.35, 0, Math.PI], fixo: true });

  // ----- garganta -----
  add('regiao_garganta', new THREE.CylinderGeometry(0.105, 0.12, 0.26, 32), COR.pele, { pos: [0, 2.27, 0] });

  // ----- tronco (camiseta) -----
  add('regiao_peito', lathe([[0.335, 1.70], [0.337, 1.78], [0.358, 1.86], [0.375, 1.92], [0.37, 2.02], [0.33, 2.11], [0.22, 2.18], [0.12, 2.205], [0.0, 2.21]]),
    COR.camiseta, { esc: [1, 1, 0.72] });
  add('regiao_peito', new THREE.TorusGeometry(0.118, 0.022, 10, 32), COR.manga, { pos: [0, 2.19, 0], rot: [Math.PI / 2, 0, 0], esc: [1, 0.78, 1] }); // gola
  add('regiao_barriga', lathe([[0.30, 1.22], [0.325, 1.32], [0.34, 1.44], [0.338, 1.56], [0.333, 1.62], [0.335, 1.70]]), COR.camiseta, { esc: [1, 1, 0.72] });
  if (!menina) add('regiao_barriga', new THREE.TorusGeometry(0.305, 0.022, 10, 48), COR.manga, { pos: [0, 1.225, 0], rot: [Math.PI / 2, 0, 0], esc: [1, 0.72, 1] }); // barra

  // ----- braços e mãos -----
  for (const l of [-1, 1]) {
    const ombro = [l * 0.37, 2.04, 0];
    const rot = l * 0.13;
    const pb = pivo('regiao_bracos', ombro, rot);
    add(pb, new THREE.SphereGeometry(0.125, 32, 20), COR.manga, { pos: [0, 0, 0] });                 // ombro
    add(pb, new THREE.CylinderGeometry(0.125, 0.115, 0.26, 32), COR.manga, { pos: [0, -0.13, 0] }); // manga curta
    add(pb, new THREE.CapsuleGeometry(0.082, 0.6, 8, 24), COR.pele, { pos: [0, -0.5, 0] });          // braço
    const pm = pivo('regiao_maos', ombro, rot);
    add(pm, new THREE.SphereGeometry(0.1, 32, 24), COR.pele, { pos: [0, -0.9, 0.0], esc: [0.82, 1.12, 0.6] }); // palma
    add(pm, new THREE.CapsuleGeometry(0.03, 0.06, 6, 12), COR.pele, { pos: [-l * 0.055, -0.86, 0.045], rot: [0.3, 0, -l * 0.6] }); // polegar
  }

  // ----- pernas (bermuda no menino, saia na menina) -----
  if (!menina) {
    add('regiao_pernas', lathe([[0.30, 1.24], [0.315, 1.16], [0.31, 1.06], [0.0, 1.03]]), COR.baixo, { esc: [1, 1, 0.74] });
    for (const l of [-1, 1]) {
      add('regiao_pernas', new THREE.CylinderGeometry(0.165, 0.155, 0.3, 32), COR.baixo, { pos: [l * 0.15, 0.95, 0] });
    }
  } else {
    const saia = add('regiao_pernas', lathe([[0.405, 0.88], [0.415, 0.90], [0.37, 1.03], [0.325, 1.18], [0.315, 1.27]], 64), COR.baixo, { esc: [1, 1, 0.8] });
    saia.material.side = THREE.DoubleSide;
  }
  for (const l of [-1, 1]) {
    add('regiao_pernas', new THREE.CapsuleGeometry(0.105, 0.62, 8, 24), COR.pele, { pos: [l * 0.15, 0.5, 0] });
  }

  // ----- pés (tênis) -----
  for (const l of [-1, 1]) {
    add('regiao_pes', new THREE.SphereGeometry(0.15, 32, 24), COR.tenis, { pos: [l * 0.155, 0.11, 0.06], esc: [0.88, 0.62, 1.45] });
    add('regiao_pes', new THREE.CylinderGeometry(0.13, 0.13, 0.035, 32), COR.sola, { pos: [l * 0.155, 0.035, 0.06], esc: [1, 1, 1.62] });
  }

  boneco.position.y = -1.5;
  boneco.userData.tipo = tipo;
  return boneco;
}

// ---------- cena ----------
export class Boneco {
  constructor(container, { aoSelecionar, aoPassar, tipo = 'menino' } = {}) {
    this.tipo = TIPOS.includes(tipo) ? tipo : 'menino';
    this.glbs = {};             // cache dos modelos do Blender por tipo
    this.container = container;
    this.aoSelecionar = aoSelecionar;
    this.aoPassar = aoPassar;
    this.movimento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.interativo = true;
    this.mapa = new Map();      // regiao -> [materiais]
    this.hover = null;
    this.pulso = null;          // regiões que "respiram" devagar no resumo

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    this.camera.position.set(0, 0.15, 7.4);

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#eee4d3', 1.7));
    const frente = new THREE.DirectionalLight('#fff6ec', 0.7);
    frente.position.set(-1, 0.5, 5);
    this.scene.add(frente);
    const sol = new THREE.DirectionalLight('#ffffff', 1.4);
    sol.position.set(2.5, 4, 3);
    sol.castShadow = true;
    sol.shadow.mapSize.set(1024, 1024);
    this.scene.add(sol);

    const chao = new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), new THREE.ShadowMaterial({ opacity: 0.12 }));
    chao.rotation.x = -Math.PI / 2;
    chao.position.y = -1.5;
    chao.receiveShadow = true;
    this.scene.add(chao);

    this.controles = new OrbitControls(this.camera, this.renderer.domElement);
    this.controles.target.set(0, 0.12, 0);
    this.controles.enablePan = false;
    this.controles.enableZoom = false;
    this.controles.enableDamping = true;
    this.controles.dampingFactor = 0.08;
    this.controles.rotateSpeed = 0.6;
    this.controles.minPolarAngle = this.controles.maxPolarAngle = Math.PI / 2 - 0.05; // só gira para os lados

    this.raycaster = new THREE.Raycaster();
    this.ponteiro = new THREE.Vector2();
    this.relogio = new THREE.Clock();

    this.raiz = new THREE.Group();
    this.scene.add(this.raiz);
    this.usarModelo(criarBonecoProvisorio(this.tipo));
    this.tentarCarregarGLB(this.tipo);

    this.ligarEventos();
    new ResizeObserver(() => this.redimensionar()).observe(container);
    this.redimensionar();
    this.renderer.setAnimationLoop(() => this.quadro());
  }

  usarModelo(obj) {
    this.raiz.clear();
    this.mapa.clear();
    this.modelo = obj;
    this.raiz.add(obj);
    obj.traverse((o) => {
      const reg = this.regiaoDe(o);
      if (!o.isMesh || !reg || this.ehFixo(o)) return;
      if (!o.material.userData.base) {
        o.material = o.material.clone();
        o.material.userData.base = o.material.color.clone();
        o.material.userData.alvo = o.material.color.clone();
      }
      if (!this.mapa.has(reg)) this.mapa.set(reg, []);
      this.mapa.get(reg).push(o.material);
      o.castShadow = true;
    });
  }

  // olhos, cabelo, boca... (userData.fixo no provisório; nome começando com "fixo_" no GLB)
  ehFixo(o) {
    for (let p = o; p; p = p.parent) {
      if (p.userData?.fixo || p.name?.startsWith('fixo_')) return true;
    }
    return false;
  }

  // troca entre menino e menina mantendo a região destacada e o giro
  trocarTipo(tipo) {
    if (!TIPOS.includes(tipo) || tipo === this.tipo) return;
    this.tipo = tipo;
    const giro = this.raiz.rotation.y;
    this.usarModelo(this.glbs[tipo] || criarBonecoProvisorio(tipo));
    this.raiz.rotation.y = giro;
    this.atualizarCores();
    if (!this.glbs[tipo]) this.tentarCarregarGLB(tipo);
  }

  // procura public/modelos/boneco-menino.glb ou boneco-menina.glb (feitos no Blender)
  async tentarCarregarGLB(tipo) {
    try {
      const url = new URL(`modelos/boneco-${tipo}.glb`, document.baseURI).href;
      const resp = await fetch(url, { method: 'HEAD' });
      if (!resp.ok || !(resp.headers.get('content-type') || '').match(/gltf|octet|binary/)) return;
      const gltf = await new GLTFLoader().loadAsync(url);
      const encontrados = REGIOES.filter((r) => gltf.scene.getObjectByName(r));
      if (encontrados.length < REGIOES.length) {
        console.warn(`[BioSense] boneco-${tipo}.glb sem todas as regiões:`, REGIOES.filter((r) => !encontrados.includes(r)));
      }
      // ajusta altura e posição automaticamente (pés no chão, centralizado)
      const caixa = new THREE.Box3().setFromObject(gltf.scene);
      const tam = caixa.getSize(new THREE.Vector3());
      const k = 3.2 / (tam.y || 1);
      gltf.scene.scale.setScalar(k);
      const centro = caixa.getCenter(new THREE.Vector3());
      gltf.scene.position.set(-centro.x * k, -1.5 - caixa.min.y * k, -centro.z * k);
      const embrulho = new THREE.Group();
      embrulho.add(gltf.scene);
      this.glbs[tipo] = embrulho;
      if (this.tipo === tipo) {
        const giro = this.raiz.rotation.y;
        this.usarModelo(embrulho);
        this.raiz.rotation.y = giro;
        this.atualizarCores();
      }
      console.info(`[BioSense] modelo boneco-${tipo}.glb carregado`);
    } catch (e) {
      /* sem GLB: fica o boneco provisório */
    }
  }

  regiaoDe(obj) {
    let o = obj;
    while (o) {
      if (REGIOES.includes(o.name)) return o.name;
      if (o.userData?.regiao) return o.userData.regiao;
      o = o.parent;
    }
    return null;
  }

  pick(evento) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ponteiro.set(((evento.clientX - r.left) / r.width) * 2 - 1, -((evento.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ponteiro, this.camera);
    const hit = this.raycaster.intersectObject(this.raiz, true).find((h) => this.regiaoDe(h.object));
    return hit ? this.regiaoDe(hit.object) : null;
  }

  ligarEventos() {
    const el = this.renderer.domElement;
    let inicio = null;
    el.addEventListener('pointerdown', (e) => { inicio = { x: e.clientX, y: e.clientY }; });
    el.addEventListener('pointerup', (e) => {
      if (!inicio || !this.interativo) return;
      const arrastou = Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 8;
      inicio = null;
      if (arrastou) return;
      const reg = this.pick(e);
      if (reg) this.aoSelecionar?.(reg);
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !this.interativo) return;
      const reg = this.pick(e);
      if (reg !== this.hover) {
        this.hover = reg;
        el.style.cursor = reg ? 'pointer' : 'grab';
        this.aoPassar?.(reg);
        this.atualizarCores();
      }
    });
    el.addEventListener('pointerleave', () => { this.hover = null; this.atualizarCores(); });
  }

  // estado = { selecao: [regioes], cor: '#hex' | null, pulso: bool }
  mostrar({ regioes = [], cor = null, pulso = false } = {}) {
    this.estado = { regioes: regioes.includes('corpo_todo') ? [...this.mapa.keys()] : regioes, cor, pulso };
    this.atualizarCores();
  }

  atualizarCores() {
    const sel = this.estado?.regioes || [];
    const cor = this.estado?.cor ? new THREE.Color(this.estado.cor) : COR_SELECAO;
    for (const [reg, mats] of this.mapa) {
      for (const m of mats) {
        const base = m.userData.base;
        if (sel.includes(reg)) m.userData.alvo.copy(cor);
        else if (this.hover === reg) m.userData.alvo.copy(base).lerp(BRANCO, 0.3);
        else m.userData.alvo.copy(base);
      }
    }
  }

  girar(angulo) {
    const dur = this.movimento ? 500 : 0;
    const ini = this.raiz.rotation.y;
    const fim = ini + angulo;
    const t0 = performance.now();
    const passo = (t) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1;
      const s = k * k * (3 - 2 * k);
      this.raiz.rotation.y = ini + (fim - ini) * s;
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  centralizar() {
    this.raiz.rotation.y = 0;
    this.controles.reset();
    this.controles.target.set(0, 0.12, 0);
  }

  redimensionar() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // garante que o boneco inteiro caiba em telas estreitas
    const z = 7.4;
    this.camera.position.z = w / h < 0.75 ? z / Math.max(0.55, (w / h) / 0.75) : z;
    this.camera.updateProjectionMatrix();
  }

  quadro() {
    const dt = Math.min(this.relogio.getDelta(), 0.05);
    const t = this.relogio.elapsedTime;
    const vel = this.movimento ? 6 : 60; // transição de cor suave (sem flash)
    const sel = this.estado?.regioes || [];
    for (const [reg, mats] of this.mapa) {
      for (const m of mats) {
        const alvo = m.userData.alvo;
        m.color.lerp(alvo, 1 - Math.exp(-vel * dt));
        // brilho lento (ciclo de 3 s) apenas nas regiões do resumo
        const brilho = this.movimento && this.estado?.pulso && sel.includes(reg) ? 0.12 + 0.08 * Math.sin(t * 2.1) : 0;
        if (m.emissive) m.emissive.copy(alvo).multiplyScalar(brilho);
      }
    }
    if (this.movimento && this.modelo) {
      // "respiração" bem discreta para o boneco parecer vivo
      const r = 1 + Math.sin(t * 1.4) * 0.008;
      this.modelo.scale.set(1, r, 1);
    }
    this.controles.update();
    this.renderer.render(this.scene, this.camera);
  }
}
