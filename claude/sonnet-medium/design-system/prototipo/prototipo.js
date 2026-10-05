// Protótipo jogável do Umbra com as direções escolhidas em design-system/exploracoes/escolhas.json:
// núcleo 13 · Halo de poeira, disco 01 · Filamentos keplerianos, consumo 12 · Órbita nebulosa,
// espaço-tempo 01 · Grade de Einstein, jatos 11 · Feixe de partículas, partículas 13 · Céu à deriva,
// planetas 04 · Silhuetas coloridas (+ animação provisória 01 · Mundos vivos), sons 05 · Poeira granular.
// Simulação a 60 Hz independente do quadro; render WebGL2 com um contexto. Sem dependências.
(function () {
  'use strict';
  const T = JSON.parse(document.getElementById('tokens').textContent);
  const $ = s => document.querySelector(s);
  const TAU = Math.PI * 2;
  const INCL = T.render.diskTilt; // −0,12

  // ---------- textos dos tokens ----------
  $('#marca').textContent = T.copy.brand;
  $('#frase').textContent = T.copy.opening;
  $('#instrucao').textContent = T.copy.instruction;
  $('#pausa-titulo').textContent = T.copy.pauseTitle;
  $('#pausa-texto').textContent = T.copy.pauseBody;
  $('#ajustes-titulo').textContent = T.copy.settingsTitle;
  T.components.qualitySelector.values.forEach((v, i) => {
    const o = document.createElement('option'); o.value = String(i); o.textContent = v; $('#aj-qualidade').appendChild(o);
  });

  // ---------- preferências (por navegador; protótipo) ----------
  const reduzidoSistema = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefs = { som: !T.audio.mutedDefault, efeitos: Math.round(T.audio.defaultEffects * 100), reduzido: false, qualidade: 0, analise: false };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem('umbra-prototipo') || '{}')); } catch (e) { /* sem armazenamento */ }
  const salvar = () => { try { localStorage.setItem('umbra-prototipo', JSON.stringify(prefs)); } catch (e) { /* idem */ } };
  const reduzido = () => prefs.reduzido || reduzidoSistema;

  // ---------- áudio: 05 · Poeira granular (grãos por material, altura por material, sem drone, jato em sopro) ----------
  const Som = (() => {
    let ctx = null, efeitos = null, vozes = 0;
    const ultimo = [0, 0, 0, 0];
    const PICO = 0.25;
    function iniciar() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      efeitos = ctx.createGain();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -3; comp.knee.value = 0; comp.ratio.value = 20; comp.attack.value = 0.001; comp.release.value = 0.15;
      const teto = ctx.createWaveShaper(), curva = new Float32Array(2049);
      for (let i = 0; i < curva.length; i++) { const x = i / 1024 - 1, m = Math.abs(x); curva[i] = Math.sign(x) * (m < 0.7 ? m : 0.7 + 0.191 * Math.tanh((m - 0.7) / 0.191)); }
      teto.curve = curva;
      efeitos.connect(comp); comp.connect(teto); teto.connect(ctx.destination);
      aplicar();
    }
    function aplicar() {
      if (!ctx) return;
      efeitos.gain.setTargetAtTime(prefs.som ? prefs.efeitos / 100 : 0, ctx.currentTime, 0.08);
      if (prefs.som && ctx.state === 'suspended') ctx.resume();
    }
    function ruido(dur) {
      const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const s = ctx.createBufferSource(); s.buffer = b; return s;
    }
    function envelope(g, t, a, dur, pico) {
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(pico, t + a);
      g.gain.setTargetAtTime(0.0001, t + a + dur * 0.15, Math.max(0.05, dur * 0.22));
    }
    function voz(dur) {
      if (!ctx || !prefs.som || vozes >= T.audio.effectVoicesMax) return false;
      vozes++; setTimeout(() => { vozes--; }, (dur + 0.4) * 1000); return true;
    }
    return {
      iniciar, aplicar,
      suspender() { if (ctx) ctx.suspend(); },
      retomar() { if (ctx && prefs.som) ctx.resume(); },
      absorcao(material, massa) {
        const agora = performance.now();
        if (agora - ultimo[material] < T.audio.groupEventsMs) return; // agrupamento 120 ms
        ultimo[material] = agora;
        const dur = [1.2, 1.4, 2.2, 3.4][material];
        if (!voz(dur)) return;
        const t = ctx.currentTime + 0.01, f = [293.6648, 220, 146.8324, 73.4162][material];
        const pico = PICO * (0.35 + 0.65 * Math.sqrt(Math.min(1, massa)));
        const g = ctx.createGain(); g.connect(efeitos);
        const graos = 10 + Math.round(massa * 10);
        for (let i = 0; i < graos; i++) {
          const tg = t + Math.random() * dur * 0.6, eg = ctx.createGain();
          envelope(eg, tg, 0.005, 0.12, pico * (1 - i / graos) * 5.0);
          const n = ruido(0.2), bp = ctx.createBiquadFilter();
          bp.type = 'bandpass'; bp.frequency.value = f * (1.5 + Math.random()); bp.Q.value = 8;
          n.connect(bp); bp.connect(eg); eg.connect(g); n.start(tg); n.stop(tg + 0.2);
        }
      },
      jato() {
        const dur = 3.2;
        if (!voz(dur)) return;
        const t = ctx.currentTime + 0.01, g = ctx.createGain(); g.connect(efeitos);
        envelope(g, t, 0.6, dur, 1.0);
        const n = ruido(dur + 0.5), bp = ctx.createBiquadFilter();
        bp.type = 'bandpass'; bp.Q.value = 3;
        bp.frequency.setValueAtTime(180, t); bp.frequency.exponentialRampToValueAtTime(1800, t + dur);
        n.connect(bp); bp.connect(g); n.start(t); n.stop(t + dur + 0.5);
      }
    };
  })();

  // ---------- cores dos tokens para GLSL ----------
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const v3 = h => `vec3(${hex(h).map(x => x.toFixed(4)).join(', ')})`;
  const C = T.colors, MC = T.render.matterColors;
  const CORES = `
const vec3 C_FUNDO = ${v3(C.background.value)};
const vec3 C_SUPERFICIE = ${v3(C.surfaceRaised.value)};
const vec3 C_ESTRELA = ${v3(C.textSecondary.value)};
const vec3 C_QUENTE = ${v3(C.diskWarm.value)};
const vec3 C_MEDIO = ${v3(C.diskMid.value)};
const vec3 C_BRANCO = ${v3(C.diskHot.value)};
const vec3 M_GELO = ${v3(MC.ice)};
const vec3 M_LAVA = ${v3(MC.lava)};
const vec3 M_OCEANO = ${v3(MC.ocean)};
const vec3 M_TERRA = ${v3(MC.land)};
const vec3 M_DESERTO = ${v3(MC.desert)};
const vec3 M_GAS = ${v3(MC.gasViolet)};
const vec3 M_ESTRELA_AZUL = ${v3(MC.starBlue)};
const vec3 M_ESTRELA_VERMELHA = ${v3(MC.starRed)};
const vec3 M_NEBULOSA = ${v3(MC.nebulaRose)};
`;

  const COMUM = `
uniform vec2 uRes;
uniform float uTempo;
uniform float uMov;
uniform float uQualidade;
uniform float uR;
uniform vec2 uCentro;
uniform vec4 uPulso;
uniform vec2 uJato;
#define TD (uTempo * uMov)
#define PI 3.14159265359
#define TAU 6.28318530718
${CORES}
const float INCLINACAO = ${INCL.toFixed(3)};
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
float ruido(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
    float v = 0.0; float a = 0.5; int o = 3 + int(uQualidade + 0.5);
    for (int i = 0; i < 5; i++) { if (i >= o) break; v += a * ruido(p); p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03 + vec2(5.7, 8.1); a *= 0.5; }
    return v;
}
mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }
float gauss(float x, float w) { return exp(-(x * x) / (w * w)); }
float pulso(float duracao) {
    float s = uPulso.x; if (s > duracao) return 0.0;
    return smoothstep(0.0, 0.18, s) * (1.0 - smoothstep(0.18, duracao, s)) * (0.45 + 0.55 * uPulso.y);
}
float jato(float duracao) {
    float s = uJato.x; if (s > duracao) return 0.0;
    return smoothstep(0.0, 0.6, s) * (1.0 - smoothstep(duracao - 1.8, duracao, s)) * uJato.y;
}
const vec2 EIXO_JATO = vec2(0.1191, 0.9929);
const vec2 TRAVES_JATO = vec2(0.9929, -0.1191);
`;

  // Cena: fundo com paralaxe, grade de Einstein (espaço-tempo 01), lente, núcleo 13, disco 01, jatos 11.
  const FRAG_CENA = `#version 300 es
precision highp float;
${COMUM}
uniform vec2 uParalaxe;
uniform vec2 uGrade;
uniform float uCelula;
out vec4 corSaida;
vec2 lentePontual(vec2 p, float thetaE) { float r2 = max(dot(p, p), 1e-5); return p - p * (thetaE * thetaE / r2); }
float estrelas(vec2 p, float d) {
    vec2 g = p * d; vec2 c = floor(g); vec2 f = fract(g);
    float s = hash(c); vec2 pos = vec2(hash(c + 3.7), hash(c + 21.0));
    float k = length(f - pos); float b = pow(s, 16.0);
    return exp(-k * k * 1800.0) * b * 1.5 + exp(-k * k * 120.0) * b * 0.08;
}
vec3 fundo(vec2 b) {
    float n = fbm(b * 2.6 + vec2(2.0, TD * 0.004));
    vec3 c = C_FUNDO * 1.2 + C_SUPERFICIE * (0.06 + 0.7 * n * n * n);
    return c + C_ESTRELA * (estrelas(b + 4.0, 70.0) + 0.7 * estrelas(b * 0.7 + 11.2, 38.0));
}
float fbmAngular(float r, float a, float giro, vec2 e) {
    float w = (a + PI) / TAU;
    return mix(fbm(vec2(r * e.x, (a + TAU - giro) * e.y)), fbm(vec2(r * e.x, (a - giro) * e.y)), w);
}
// Disco 01 · Filamentos keplerianos: fino, filamentos, rotação lenta, Doppler leve, onda que circula.
float disco(vec2 p, out float calor) {
    vec2 d = vec2(p.x, (p.y - INCLINACAO * p.x) * 6.4);
    float dr = length(d) / uR; float da = atan(d.y, d.x);
    float mascara = smoothstep(1.2, 1.45, dr) * (1.0 - smoothstep(2.4, 4.65, dr));
    float giro = TD * 0.45 * pow(max(dr, 1.0), -1.5);
    float f = fbmAngular(dr, da, giro, vec2(7.0, 1.7));
    float fino = fbmAngular(dr, da, giro * 1.15, vec2(22.0, 3.2));
    float textura = max(0.25 + 0.95 * f * f + 0.4 * (fino - 0.5), 0.0);
    float aproxima = clamp(p.x / (uR * 2.6), -1.0, 1.0);
    float dop = 1.0 + 0.25 * aproxima; dop *= dop;
    calor = clamp(1.8 / dr - 0.45 + 0.2 * aproxima, 0.0, 1.0);
    float b = (textura * (0.2 + 0.85 / max(dr - 0.95, 0.32)) * 0.7 + gauss(dr - 1.42, 0.16) * 0.55) * dop;
    float s = uPulso.x;
    float frente = uPulso.z + s * 1.8 * uMov;
    float dist = abs(mod(da - frente + PI, TAU) - PI);
    b *= 1.0 + 1.4 * exp(-dist * dist * 6.0) * pulso(3.0) * exp(-(dr - 1.5) * 0.6);
    return mascara * b;
}
float arcos(vec2 p, float rn) {
    float s = abs(sin(atan(p.y, p.x)));
    float curva = 1.13 + 0.58 * pow(s, 0.7) * 0.72;
    float w = (0.04 + 0.15 * pow(s, 1.5)) * 1.05;
    return exp(-pow((rn - curva) / w, 2.0)) * pow(s, 1.3) * (p.y > 0.0 ? 0.9 : 0.45);
}
float texturaArco(vec2 p, float rn) { float f = fbmAngular(rn, atan(p.y, p.x), TD * 0.35, vec2(9.0, 2.2)); return 0.45 + 0.9 * f * f; }
// Espaço-tempo 01: poço de alcance médio, arrasto leve, anéis na absorção, intensidade média.
float ondaAtrasada(float r, float atraso) {
    float s = uPulso.x - atraso; if (s < 0.0 || s > 3.6) return 0.0;
    return gauss(r - (uR + s * 0.26), 0.025) * (1.0 - s / 3.6) * uMov * (0.4 + 0.6 * uPulso.y);
}
float amplitude(vec2 p) { float r = length(p); return ondaAtrasada(r, 0.0) + 0.6 * ondaAtrasada(r, 0.35) + 0.35 * ondaAtrasada(r, 0.7); }
vec2 deformar(vec2 p) {
    float r = length(p); vec2 dir = p / max(r, 1e-4); float alc = 5.0 * uR;
    vec2 q = p + dir * 0.7 * uR * uR * 1.6 / (r + uR * 0.6) * exp(-r / alc);
    q = rot(0.5 * exp(-r / alc) * uR / (r + 0.3 * uR)) * q;
    return q + dir * amplitude(p) * uR * 0.29;
}
float linhasGrade(vec2 g) {
    vec2 d = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), vec2(1e-4));
    return 1.0 - min(min(d.x, d.y), 1.0);
}
// Jatos 11 · Feixe de partículas: feixe colimado, longo (8 s), gradiente quente → âmbar.
vec3 jatos(vec2 p) {
    float env = jato(8.0); if (env <= 0.0) return vec3(0.0);
    float frente = min(uJato.x * uR * 7.0, uR * 11.0);
    float s = dot(p, EIXO_JATO); float t = dot(p, TRAVES_JATO);
    float rn = length(p) / uR;
    vec3 c = vec3(0.0);
    for (int i = 0; i < 2; i++) {
        float ss = i == 0 ? s : -s;
        if (ss < uR * 0.9 || ss > frente) continue;
        float sr = ss / uR;
        float b = gauss(t, uR * 0.07 * (1.0 + 0.12 * sr)) * 1.2 * (1.0 - smoothstep(frente - uR * 1.2, frente, ss)) * smoothstep(0.9, 1.4, sr);
        if (i == 1) b *= 0.45 * smoothstep(0.95, 1.05, rn);
        c += mix(C_BRANCO, C_QUENTE, smoothstep(0.0, 1.0, ss / (uR * 11.0))) * b;
    }
    return c * env * 1.3;
}
void main() {
    vec2 s = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec2 p = s - uCentro;
    float r = length(p); float rn = r / uR;
    vec2 q = deformar(p);
    vec2 b = uCentro + lentePontual(p, uR * 1.55) + (q - p);
    vec3 c = fundo(b + uParalaxe);
    float grade = linhasGrade(q / uCelula + uGrade);
    float alcanceVis = exp(-r / (uR * 11.0));
    c += mix(C_MEDIO, C_QUENTE, exp(-rn * 0.35)) * grade * 0.17 * (0.35 + 0.65 * alcanceVis) * smoothstep(1.05, 2.4, rn);
    c += C_MEDIO * amplitude(p) * 0.042;
    // Núcleo 13 · Halo de poeira.
    c *= smoothstep(0.88, 1.06, rn);
    float reacao = pulso(2.0);
    c += mix(C_MEDIO, C_BRANCO, 0.35) * arcos(p, rn) * texturaArco(p, rn) * (0.9 + 0.8 * reacao);
    c += mix(C_QUENTE, C_BRANCO, 0.2) * gauss(rn - 1.06, 0.06) * 0.4;
    c += mix(C_QUENTE, C_BRANCO, 0.8) * gauss(rn - 1.02, 0.009) * 0.7;
    c += C_QUENTE * gauss(rn - 1.25, 0.4) * 0.07;
    float calor; float d = disco(p, calor);
    if (rn < 1.0 && (p.y - INCLINACAO * p.x) > -0.08 * uR) d = 0.0;
    c += mix(C_QUENTE, C_BRANCO, calor) * d;
    // Consumo 12: anel acende no ponto de entrada.
    vec2 impacto = vec2(cos(uPulso.z), sin(uPulso.z)) * uR * 1.05;
    float local = exp(-pow(length(p - impacto) / (uR * 0.9), 2.0));
    c += mix(C_QUENTE, C_BRANCO, 0.9) * gauss(rn - 1.03, 0.025) * (0.3 + 1.2 * local) * pulso(2.4) * 1.3;
    c += jatos(p);
    vec2 v = gl_FragCoord.xy / uRes - 0.5;
    c = 1.0 - exp(-max(c, vec3(0.0)) * 1.5);
    c = pow(c, vec3(0.89)) * (1.0 - 0.32 * pow(length(v * 1.1), 1.3));
    corSaida = vec4(c, 1.0);
}`;

  const VERT_TELA = `#version 300 es
void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;

  // Corpos: quads instanciados no estilo 04 (contraluz + halo largo, cores vivas), animação 01 · Mundos vivos.
  const VERT_CORPO = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCanto;
layout(location = 1) in vec4 aPosRaio;
layout(location = 2) in vec4 aEstira;
layout(location = 3) in vec4 aEstado;
layout(location = 4) in vec2 aLuz;
uniform vec2 uRes;
out vec2 vLocal;
out vec4 vEstado;
out vec2 vLuz;
flat out float vTipo;
flat out float vSemente;
void main() {
    vec2 c = aCanto * aEstado.w;
    vec2 eixo = aEstira.xy; vec2 perp = vec2(-eixo.y, eixo.x); float st = aEstira.z;
    vec2 s = aPosRaio.xy + (eixo * c.x * (1.0 + st) + perp * c.y / (1.0 + 0.35 * st)) * aPosRaio.z;
    gl_Position = vec4(s.x * 2.0 * uRes.y / uRes.x, s.y * 2.0, 0.0, 1.0);
    vLocal = c; vEstado = aEstado; vTipo = aPosRaio.w; vSemente = aEstira.w;
    vLuz = vec2(dot(aLuz, eixo), dot(aLuz, perp));
}`;

  const FRAG_CORPO = `#version 300 es
precision highp float;
${COMUM}
in vec2 vLocal;
in vec4 vEstado;
in vec2 vLuz;
flat in float vTipo;
flat in float vSemente;
out vec4 corSaida;
vec3 girar(vec3 n, float a) { float c = cos(a); float s = sin(a); return vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z); }
vec2 coordSup(vec3 m) { return m.xy * 1.7 + vec2(m.z * 1.3, m.z * 0.4); }
vec4 solido(vec2 d, float tipo, vec2 luz, float semente) {
    float q = length(d);
    float giro = TD * 0.4 * (tipo > 4.5 && tipo < 6.5 ? 1.5 : 1.0) + semente;
    if (tipo > 8.5 && tipo < 9.5) q *= 1.0 + 0.28 * (ruido(vec2(atan(d.y, d.x) * 2.0 + giro * 1.5, semente)) - 0.5);
    vec3 cor = vec3(0.0); float cob = 0.0;
    if (q < 1.0) {
        vec3 n = vec3(d, sqrt(max(1.0 - q * q, 0.0)));
        vec3 m = girar(n, giro);
        vec2 uv = coordSup(m) + semente * 3.0;
        float det = fbm(uv * 1.6);
        vec3 base;
        if (tipo < 0.5 || (tipo > 6.5 && tipo < 9.5)) base = mix(C_MEDIO * 0.5, C_MEDIO * 0.85, det) * (1.0 - smoothstep(0.62, 0.7, ruido(uv * 4.0)) * 0.4);
        else if (tipo < 1.5) base = mix(C_FUNDO * 4.0, M_LAVA, smoothstep(0.55, 0.75, det));
        else if (tipo < 2.5) base = mix(M_GELO, C_BRANCO, det * 0.6);
        else if (tipo < 3.5) base = mix(M_OCEANO, M_TERRA, smoothstep(0.52, 0.58, det));
        else if (tipo < 4.5) base = mix(M_DESERTO * 0.8, M_DESERTO, 0.5 + 0.5 * sin(m.y * 18.0 + det * 4.0));
        else if (tipo < 5.5) base = mix(M_GAS, C_MEDIO, 0.5 + 0.5 * sin(m.y * 12.0 + fbm(vec2(m.y * 6.0, m.x * 2.0 - TD * 0.3)) * 3.0));
        else base = mix(M_GELO, M_OCEANO, 0.3 + 0.2 * sin(m.y * 6.0 + det));
        if (tipo > 1.5 && tipo < 4.5) {
            vec3 mn = girar(n, giro * 1.6 + TD * 0.05);
            base = mix(base, C_BRANCO, smoothstep(0.5, 0.78, fbm(coordSup(mn) * 2.2 + 9.0)) * 0.75);
        }
        if (tipo > 4.5 && tipo < 5.5) {
            vec3 ms = girar(n, giro + 0.8);
            base = mix(base, M_LAVA, exp(-pow((ms.x - 0.2) / 0.22, 2.0) - pow((ms.y + 0.25) / 0.09, 2.0)) * step(0.0, ms.z) * 0.7);
        }
        vec3 l3 = normalize(vec3(luz, 0.55));
        float rim = pow(1.0 - n.z, 3.0) * max(dot(normalize(d + 1e-5), luz), 0.0);
        cor = base * (0.05 + 1.7 * rim + 0.08 * max(dot(n, l3), 0.0));
        if (tipo > 0.5 && tipo < 1.5) cor += M_LAVA * smoothstep(0.6, 0.78, det) * (0.7 + 0.35 * sin(TD * 0.9 + det * 9.0));
        cob = smoothstep(1.0, 0.95, q);
    }
    if (tipo > 0.5 && tipo < 6.5) {
        vec3 tom = tipo < 1.5 ? M_LAVA : tipo < 3.5 ? M_GELO : tipo < 4.5 ? M_DESERTO : tipo < 5.5 ? M_GAS : M_GELO;
        cor += tom * exp(-max(q - 1.0, 0.0) / 0.45 * 3.0) * smoothstep(0.82, 1.0, q) * (0.3 + 0.7 * max(dot(normalize(d + 1e-5), luz), 0.0)) * 0.55;
    }
    if (tipo > 4.5 && tipo < 5.5) {
        vec2 a = rot(0.35) * d; float r = length(vec2(a.x, a.y * 3.4));
        float anel = smoothstep(1.35, 1.45, r) * (1.0 - smoothstep(2.15, 2.3, r)) * (0.6 + 0.4 * sin(r * 22.0));
        if (a.y < 0.0 || q > 1.0) cor = mix(cor, mix(C_MEDIO, M_DESERTO, 0.5) * 0.85, anel * 0.85);
        cob = max(cob, anel * 0.85);
    }
    // Uma lua por planeta (animação 01).
    if (tipo > 0.5 && tipo < 6.5) {
        float ang = semente * 2.0 + TD * 0.9;
        vec2 c = vec2(cos(ang), sin(ang) * 0.32) * 1.75;
        vec2 dd = (d - c) / 0.17; float qq = length(dd);
        if (qq < 1.0 && !(sin(ang) > 0.0 && length(c) < 1.0)) {
            vec3 n = vec3(dd, sqrt(1.0 - qq * qq));
            float rim = pow(1.0 - n.z, 3.0) * max(dot(normalize(dd + 1e-5), luz), 0.0);
            float cl = smoothstep(1.0, 0.92, qq);
            cor = mix(cor, C_MEDIO * (0.06 + 1.5 * rim), cl); cob = max(cob, cl);
        }
    }
    return vec4(cor, cob);
}
vec4 estrela(vec2 d, float tipo) {
    vec2 e = d / (1.0 + 0.045 * sin(TD * 1.3));
    float q = length(e); float a = atan(e.y, e.x);
    vec3 tom = tipo < 10.5 ? M_ESTRELA_VERMELHA : tipo < 11.5 ? M_ESTRELA_AZUL : tipo < 12.5 ? C_BRANCO : M_ESTRELA_VERMELHA;
    float disco = smoothstep(1.0, 0.94, q);
    vec3 cor = mix(C_BRANCO, tom, smoothstep(0.0, 1.0, q * q)) * disco * (0.8 + 0.3 * fbm(e * 4.0 + vec2(TD * 0.15, -TD * 0.1))) * (tipo > 12.5 ? 0.9 : 1.15);
    cor += tom * exp(-max(q - 1.0, 0.0) * (tipo > 11.5 && tipo < 12.5 ? 1.2 : 2.4)) * (1.0 - disco) * (0.55 + 0.45 * fbm(vec2(a * 3.0, TD * 0.3))) * 0.55;
    return vec4(cor, disco);
}
vec4 difuso(vec2 d, float tipo) {
    if (tipo < 14.5) {
        vec2 g = rot(0.5) * d; g.y /= 0.45; float q = length(g); float a = atan(g.y, g.x);
        float br = pow(0.5 + 0.5 * cos(2.0 * (a - log(max(q, 0.05)) * 2.4 - TD * 0.2)), 3.0);
        return vec4(mix(M_ESTRELA_AZUL, C_QUENTE, smoothstep(0.0, 0.7, q)) * (exp(-q * 2.4) * (0.3 + 1.1 * br * (0.6 + 0.4 * fbm(g * 6.0))) + exp(-q * q * 40.0) * 0.8) * 0.8, 0.0);
    }
    if (tipo < 15.5) {
        vec2 w = d + 0.35 * vec2(fbm(d * 1.4 + TD * 0.05), fbm(d * 1.4 + 7.0 - TD * 0.04));
        float forma = exp(-dot(d, d) * 1.4) * smoothstep(0.35, 0.8, fbm(w * 1.6));
        return vec4(mix(M_NEBULOSA, M_GAS, fbm(w * 2.5 + 4.0)) * forma * 0.75, 0.0);
    }
    if (tipo < 16.5) {
        // Poeira: aglomerado de grãos.
        float g = 0.0;
        for (int i = 0; i < 7; i++) {
            float fi = float(i) + vSemente;
            vec2 o = (vec2(hash1(fi * 1.7), hash1(fi * 2.3)) - 0.5) * 1.3;
            g += exp(-dot(d - o, d - o) / 0.06) * (0.5 + 0.5 * hash1(fi * 3.1));
        }
        return vec4(mix(C_MEDIO, C_QUENTE, 0.3) * g * 0.55, min(g, 1.0) * 0.12 * exp(-dot(d, d) * 0.8));
    }
    // Nuvem de gás.
    float nuvem = smoothstep(0.3, 0.75, fbm(d * 1.8 + vSemente + vec2(TD * 0.04, 0.0))) * exp(-dot(d, d) * 1.2);
    return vec4(mix(C_ESTRELA, M_GAS, 0.5) * nuvem * 0.6, 0.0);
}
vec4 cometa(vec2 d, vec2 fora) {
    float ao = dot(d, fora); float lado = dot(d, vec2(-fora.y, fora.x)); float u = max(ao, 0.0);
    float coma = exp(-dot(d, d) * 2.0);
    float ion = smoothstep(0.0, 1.0, u) * exp(-u / 6.0) * exp(-pow(lado / (0.3 + u * 0.06), 2.0));
    float curva = lado - u * u * 0.012;
    float poeira = smoothstep(0.0, 1.0, u) * exp(-u / 4.5) * exp(-pow(curva / (0.6 + u * 0.16), 2.0));
    return vec4(mix(M_GELO, C_BRANCO, 0.4) * coma * 1.2 + M_ESTRELA_AZUL * ion * 0.6 + mix(C_QUENTE, C_MEDIO, 0.4) * poeira * 0.45, 0.0);
}
void main() {
    float tipo = vTipo;
    float nuvem = vEstado.z;
    vec2 d = vLocal / (1.0 + 2.5 * nuvem);   // consumo 12: corpo vira nuvem ao ser capturado
    vec2 luz = normalize(vLuz + 1e-5);
    vec4 r;
    if (tipo > 7.5 && tipo < 8.5) r = cometa(d, -luz);
    else if (tipo > 13.5) r = difuso(d, tipo);
    else if (tipo > 9.5) r = estrela(d, tipo);
    else r = solido(d, tipo, luz, vSemente);
    if (nuvem > 0.0) {
        float n = smoothstep(0.3, 0.75, fbm(vLocal * 2.0 + uTempo * 0.3)) * exp(-dot(d, d) * 1.2);
        r.rgb = mix(r.rgb, (r.rgb + C_MEDIO * 0.2) * 0.5 + C_QUENTE * n * 0.5, nuvem);
        r.a *= 1.0 - 0.7 * nuvem;
        r.rgb /= 1.0 + 1.5 * nuvem;
    }
    // Consumo 12: desvio para o vermelho no contato com o horizonte.
    float l = dot(r.rgb, vec3(0.333));
    r.rgb = mix(r.rgb, C_QUENTE * 0.55 * l * 1.6, vEstado.y);
    corSaida = vec4(r.rgb, r.a) * vEstado.x;
}`;

  // Pontos sem estado: poeira de fundo com paralaxe (partículas 13), poeira do halo (núcleo 13), partículas do jato (11).
  const VERT_PONTOS = `#version 300 es
precision highp float;
${COMUM}
uniform vec2 uParalaxe;
uniform int uNAmb;
uniform int uNHalo;
uniform float uDpr;
out vec3 vCor;
out float vAlfa;
void main() {
    int i = gl_VertexID;
    float fi = float(i);
    vec2 pos; float tam; vec3 cor; float alfa;
    float meiaL = 0.5 * uRes.x / uRes.y + 0.1;
    if (i < uNAmb) {
        float prof = 0.25 + 0.75 * hash1(fi * 3.37);
        vec2 base = vec2(hash1(fi * 1.13), hash1(fi * 2.71)) * vec2(2.0 * meiaL, 1.2);
        vec2 deriva = vec2(TD * 0.006, TD * 0.0025) * prof;
        pos = mod(base - uParalaxe * prof * 6.0 + deriva, vec2(2.0 * meiaL, 1.2)) - vec2(meiaL, 0.6);
        tam = 0.9 + 0.7 * hash1(fi * 7.3);
        cor = mix(C_QUENTE, C_MEDIO, hash1(fi * 5.1));
        alfa = (0.07 + 0.16 * hash1(fi * 9.7)) * prof * (0.75 + 0.25 * sin(TD * (0.4 + hash1(fi)) + fi));
    } else if (i < uNAmb + uNHalo) {
        float fj = fi - float(uNAmb);
        float raio = uR * (1.5 + 2.2 * pow(hash1(fj * 1.7), 1.6));
        float ang = hash1(fj * 3.1) * TAU + TD * 0.9 * pow(raio / uR, -1.5);
        vec2 l = vec2(cos(ang), sin(ang) / 6.4) * raio;
        pos = uCentro + vec2(l.x, l.y + INCLINACAO * l.x);
        bool atras = sin(ang) > 0.0 && length(pos - uCentro) < uR * 1.05;
        tam = 1.0 + 1.6 * hash1(fj * 5.3);
        cor = mix(C_QUENTE, C_MEDIO, hash1(fj * 7.7));
        alfa = atras ? 0.0 : (0.18 + 0.3 * hash1(fj * 9.1)) * (1.0 + 0.6 * pulso(2.0));
    } else {
        float fj = fi - float(uNAmb + uNHalo);
        float env = jato(8.0);
        float lado = mod(fj, 2.0) < 0.5 ? 1.0 : -1.0;
        float u = fract(hash1(fj * 1.31) + uJato.x * (0.18 + 0.2 * hash1(fj * 2.7)));
        float s = mix(1.1, 10.0, u) * uR;
        float t = (hash1(fj * 3.9) - 0.5) * uR * (0.08 + 0.04 * s / uR);
        pos = uCentro + EIXO_JATO * s * lado + TRAVES_JATO * t;
        tam = 1.0 + 1.4 * hash1(fj * 5.5);
        cor = mix(C_BRANCO, C_QUENTE, u);
        alfa = env * (1.0 - u) * (lado > 0.0 ? 0.6 : 0.25) * min(uJato.x * uR * 7.0 / s, 1.0);
    }
    gl_Position = vec4(pos.x * 2.0 * uRes.y / uRes.x, pos.y * 2.0, 0.0, 1.0);
    gl_PointSize = clamp(tam * uDpr, 1.0, 32.0);
    vCor = cor; vAlfa = alfa;
}`;

  // Faíscas (consumo 12 e reação das partículas 13): posições calculadas na CPU.
  const VERT_FAISCAS = `#version 300 es
precision highp float;
layout(location = 0) in vec4 aDados;
uniform vec2 uRes;
uniform float uDpr;
uniform vec3 uCorA;
uniform vec3 uCorB;
out vec3 vCor;
out float vAlfa;
void main() {
    gl_Position = vec4(aDados.x * 2.0 * uRes.y / uRes.x, aDados.y * 2.0, 0.0, 1.0);
    gl_PointSize = clamp(aDados.w * uDpr, 1.0, 16.0);
    vCor = mix(uCorA, uCorB, fract(aDados.w * 7.13));
    vAlfa = aDados.z;
}`;

  const FRAG_PONTO = `#version 300 es
precision highp float;
in vec3 vCor;
in float vAlfa;
out vec4 corSaida;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = vAlfa * (1.0 - smoothstep(0.0, 1.0, d));
    corSaida = vec4(min(vCor * a, vec3(0.6)), 0.0);
}`;

  // ---------- WebGL2 ----------
  const canvas = $('#cena');
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: true });
  if (!gl) {
    document.body.insertAdjacentHTML('beforeend', '<div class="scrim"><div class="painel"><h2>Sem WebGL2</h2><p>Este navegador não oferece WebGL2, necessário para o protótipo. Abra em um Chrome, Edge, Firefox ou Safari atual.</p></div></div>');
    return;
  }
  function compilar(tipo, fonte) {
    const s = gl.createShader(tipo); gl.shaderSource(s, fonte); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + fonte.split('\n').slice(0, 5).join('\n'));
    return s;
  }
  function programa(vs, fs, nomes) {
    const p = gl.createProgram();
    gl.attachShader(p, compilar(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compilar(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; nomes.forEach(n => { u[n] = gl.getUniformLocation(p, n); });
    return { p, u };
  }
  const UNIFS = ['uRes', 'uTempo', 'uMov', 'uQualidade', 'uR', 'uCentro', 'uPulso', 'uJato'];
  const pCena = programa(VERT_TELA, FRAG_CENA, [...UNIFS, 'uParalaxe', 'uGrade', 'uCelula']);
  const pCorpo = programa(VERT_CORPO, FRAG_CORPO, UNIFS);
  const pPontos = programa(VERT_PONTOS, FRAG_PONTO, [...UNIFS, 'uParalaxe', 'uNAmb', 'uNHalo', 'uDpr']);
  const pFaiscas = programa(VERT_FAISCAS, FRAG_PONTO, ['uRes', 'uDpr', 'uCorA', 'uCorB']);

  const vaoTela = gl.createVertexArray();
  const MAX_CORPOS = 160, STRIDE = 14; // posRaio(4) estira(4) estado(4) luz(2)
  const dadosCorpos = new Float32Array(MAX_CORPOS * STRIDE);
  const vaoCorpo = gl.createVertexArray();
  gl.bindVertexArray(vaoCorpo);
  const vboCanto = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vboCanto);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const vboCorpos = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vboCorpos);
  gl.bufferData(gl.ARRAY_BUFFER, dadosCorpos.byteLength, gl.DYNAMIC_DRAW);
  [[1, 4, 0], [2, 4, 4], [3, 4, 8], [4, 2, 12]].forEach(([loc, n, off]) => {
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, n, gl.FLOAT, false, STRIDE * 4, off * 4); gl.vertexAttribDivisor(loc, 1);
  });
  const MAX_FAISCAS = 700;
  const dadosFaiscas = new Float32Array(MAX_FAISCAS * 4);
  const vaoFaiscas = gl.createVertexArray(); gl.bindVertexArray(vaoFaiscas);
  const vboFaiscas = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vboFaiscas);
  gl.bufferData(gl.ARRAY_BUFFER, dadosFaiscas.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); pausar(); });

  // ---------- qualidade (Auto com histerese simples; Alta; Econômica) ----------
  const PERFIS = [
    { corpos: 70, amb: 1200, halo: 700, jato: 700, faiscas: 350, escala: 0.8, q: 1 },  // Equilíbrio (Auto inicia aqui)
    { corpos: 110, amb: 2400, halo: 1200, jato: 1200, faiscas: 600, escala: 1.0, q: 2 }, // Alta
    { corpos: 45, amb: 500, halo: 300, jato: 300, faiscas: 150, escala: 0.6, q: 0 }     // Econômica
  ];
  let perfilAuto = 0, janelaRuim = 0, janelaBoa = 0;
  const perfil = () => prefs.qualidade === 0 ? PERFIS[perfilAuto] : PERFIS[prefs.qualidade];

  // ---------- simulação ----------
  const ESCALAS = [
    { nome: 'Poeira', ate: 4 }, { nome: 'Asteroides', ate: 32 }, { nome: 'Planetas', ate: 256 },
    { nome: 'Sistemas', ate: 2048 }, { nome: 'Galáxias', ate: Infinity }
  ];
  const escalaDe = M => ESCALAS.findIndex(e => M < e.ate);
  const raioDe = M => 0.55 * Math.sqrt(M);
  // Tipos: 0 rochoso, 1 lava, 2 gelo, 3 oceano, 4 deserto, 5 gasoso com anéis, 6 gigante de gelo, 7 lua, 8 cometa,
  // 9 asteroide, 10 anã vermelha, 11 estrela azul, 12 anã branca, 13 gigante vermelha, 14 galáxia, 15 nebulosa,
  // 16 poeira, 17 nuvem de gás.
  const POPULACAO = [
    [[16, 5], [9, 2.5], [17, 2.5], [7, 0.6]],
    [[9, 3.5], [7, 1.5], [8, 1], [16, 2], [2, 1], [17, 1]],
    [[0, 1], [1, 1], [2, 1], [3, 1.2], [4, 1], [5, 1], [6, 1], [7, 1], [9, 1], [8, 0.6]],
    [[10, 1.5], [11, 1.2], [12, 0.8], [13, 1], [3, 0.8], [5, 0.8], [1, 0.6], [15, 0.8], [8, 0.6]],
    [[14, 3], [15, 2], [11, 1], [13, 1], [10, 0.6]]
  ];
  const PESO = t => t === 16 ? 0.35 : t === 17 ? 0.25 : t === 14 || t === 15 ? 0.5 : t >= 10 ? 1.0 : 0.7;
  const MATERIAL = (t, s, R) => t === 16 ? 0 : t === 17 || t === 15 || t === 5 || t === 6 ? 2 : s > R * 0.45 || t >= 10 ? 3 : 1;
  const EXTENSAO = t => t === 5 ? 2.4 : t >= 1 && t <= 6 ? 2.15 : t >= 10 && t <= 13 ? 3.0 : t === 8 ? 26 : t >= 14 && t <= 15 ? 1.9 : t >= 16 ? 1.4 : 1.25;

  let semente = 1;
  const rnd = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
  const mundo = {};
  function novoUniverso() {
    semente = 1 + Math.floor(Math.random() * 1e6);
    Object.assign(mundo, {
      buraco: { x: 0, y: 0, vx: 0, vy: 0, M: 1 },
      cam: { x: 0, y: 0 }, escala: 0.075 / raioDe(1), paralaxe: [0, 0], grade: [0, 0],
      corpos: [], faiscas: [], pulso: [99, 0, 0, 0], jato: [99, 0], absorcoes: 0, tempo: 0
    });
    preencher(true);
  }
  function sortearTipo(e) {
    const lista = POPULACAO[e], total = lista.reduce((a, [, w]) => a + w, 0);
    let x = rnd() * total;
    for (const [t, w] of lista) { if ((x -= w) <= 0) return t; }
    return lista[0][0];
  }
  function novoCorpo(x, y) {
    const b = mundo.buraco, R = raioDe(b.M), e = Math.max(0, escalaDe(b.M));
    const tipo = sortearTipo(rnd() < 0.18 && e > 0 ? e - 1 : e);
    let s = R * (0.08 + 0.42 * Math.pow(rnd(), 1.6));
    if (rnd() < 0.14) s = R * (0.6 + 0.6 * rnd());            // grandes demais por enquanto: só comíveis depois
    if (tipo === 14 || tipo === 15) s *= 1.6;
    if (tipo === 16 || tipo === 17) s *= 1.2;
    const ang = rnd() * TAU, v = R * 0.06 * rnd();
    return { x, y, s, tipo, semente: rnd() * 40, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, estado: 0, t: 0, a0: 0, r0: 0, dur: 0,
      estira: 0, eixo: [1, 0], vermelho: 0, nuvem: 0, alfa: 1, emitir: 0, tamanho: 1 };
  }
  function extensaoVista() {
    const aspecto = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    return Math.max(0.5 * aspecto, 0.5) / mundo.escala;
  }
  function preencher(inicial) {
    const alvo = perfil().corpos, ext = extensaoVista(), c = mundo.cam;
    let tentativas = 0;
    while (mundo.corpos.length < alvo && tentativas++ < 400) {
      const ang = rnd() * TAU;
      const d = inicial ? ext * (0.3 + 1.4 * Math.sqrt(rnd())) : ext * (1.15 + 0.55 * rnd());
      const x = c.x + Math.cos(ang) * d, y = c.y + Math.sin(ang) * d;
      const b = mundo.buraco;
      if (Math.hypot(x - b.x, y - b.y) < raioDe(b.M) * 6) continue;
      mundo.corpos.push(novoCorpo(x, y));
    }
  }
  function soltarFaiscas(x, y, n, vel) {
    const R = raioDe(mundo.buraco.M), max = perfil().faiscas;
    for (let i = 0; i < n && mundo.faiscas.length < max; i++) {
      const a = rnd() * TAU, v = R * vel * (0.3 + rnd());
      mundo.faiscas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0, dur: 0.8 + rnd() * 0.8, tam: 1 + rnd() * 1.6 });
    }
  }
  function absorver(c) {
    const b = mundo.buraco, R = raioDe(b.M);
    const ganho = PESO(c.tipo) * 0.5 * Math.pow(c.s / 0.55, 2);
    const material = MATERIAL(c.tipo, c.s, R);
    const massa = Math.min(1, Math.log(1 + 20 * ganho / b.M) / Math.log(21));
    b.M += ganho;
    const ang = c.a0 + 3 * TAU; // ângulo final da espiral
    const lx = Math.cos(ang), ly = Math.sin(ang) * 0.34;
    mundo.pulso = [0, Math.max(0.15, massa), Math.atan2(ly + INCL * lx, lx), material];
    mundo.absorcoes++;
    soltarFaiscas(b.x + lx * R, b.y + (ly + INCL * lx) * R, 6 + Math.round(20 * massa), 0.6);
    Som.absorcao(material, massa);
    // Jato 11: gatilho por massa acumulada, a cada 4 absorções.
    if (mundo.absorcoes % 4 === 0 && mundo.jato[0] > 12) { mundo.jato = [0, 0.8 + 0.2 * rnd()]; Som.jato(); }
  }

  const entrada = { ativo: false, x: 0, y: 0, teclas: new Set() };
  function passo(dt) {
    const w = mundo, b = w.buraco;
    w.tempo += dt;
    const R = raioDe(b.M);
    // Movimento do núcleo: segue o dedo; ao soltar, frenagem de 600 ms (motionMs.releaseBrake).
    let alvoVx = 0, alvoVy = 0;
    const vmax = R * 7;
    if (entrada.ativo && tela === 'jogo') {
      const tx = w.cam.x + entrada.x / w.escala, ty = w.cam.y + entrada.y / w.escala;
      alvoVx = (tx - b.x) * 2.5; alvoVy = (ty - b.y) * 2.5;
    }
    const kx = (entrada.teclas.has('ArrowRight') || entrada.teclas.has('d') ? 1 : 0) - (entrada.teclas.has('ArrowLeft') || entrada.teclas.has('a') ? 1 : 0);
    const ky = (entrada.teclas.has('ArrowUp') || entrada.teclas.has('w') ? 1 : 0) - (entrada.teclas.has('ArrowDown') || entrada.teclas.has('s') ? 1 : 0);
    if ((kx || ky) && tela === 'jogo') { alvoVx = kx * vmax; alvoVy = ky * vmax; }
    const vel = Math.hypot(alvoVx, alvoVy);
    if (vel > vmax) { alvoVx *= vmax / vel; alvoVy *= vmax / vel; }
    const ativo = entrada.ativo || kx || ky;
    const k = ativo ? Math.min(1, dt * 4) : Math.min(1, dt / (T.motionMs.releaseBrake / 1000) * 3);
    b.vx += (alvoVx - b.vx) * k; b.vy += (alvoVy - b.vy) * k;
    b.x += b.vx * dt; b.y += b.vy * dt;
    // Câmera suave, sem sacudir; escala segue o crescimento.
    const cx = w.cam.x, cy = w.cam.y;
    const kc = 1 - Math.exp(-dt * 2.5);
    w.cam.x += (b.x - w.cam.x) * kc; w.cam.y += (b.y - w.cam.y) * kc;
    w.escala += (0.075 / R - w.escala) * (1 - Math.exp(-dt / 1.2));
    w.paralaxe[0] += (w.cam.x - cx) * w.escala * 0.08; w.paralaxe[1] += (w.cam.y - cy) * w.escala * 0.08;
    // Grade de Einstein ancorada no mundo: acumula o deslocamento do núcleo em células (célula = 0,55 R).
    const celula = R * 0.55;
    w.grade[0] = (w.grade[0] + (b.x - (w.ultimoX ?? b.x)) / celula) % 1000; w.grade[1] = (w.grade[1] + (b.y - (w.ultimoY ?? b.y)) / celula) % 1000;
    w.ultimoX = b.x; w.ultimoY = b.y;
    w.pulso[0] = Math.min(99, w.pulso[0] + dt); w.jato[0] = Math.min(99, w.jato[0] + dt);

    const alcance = R * 5;
    const ext = extensaoVista();
    for (let i = w.corpos.length - 1; i >= 0; i--) {
      const c = w.corpos[i];
      const dx = c.x - b.x, dy = c.y - b.y, dist = Math.hypot(dx, dy);
      const comivel = c.s <= R * 0.5;
      if (c.estado === 2) {
        // Capturado (consumo 12 · órbita decaindo): espiral no plano do disco, vira nuvem, avermelha e congela.
        c.t += dt / c.dur;
        const t = Math.min(1, c.t);
        const tc = t < 0.82 ? t : 0.82 + 0.18 * (1 - Math.exp(-(t - 0.82) * 14));
        const a = c.a0 + 3 * TAU * tc;
        const r = (c.r0 + (1 - c.r0) * tc) * (1 + 0.22 * (1 - tc) * (Math.cos(a - c.a0) - 1));
        const lx = Math.cos(a) * r, ly = Math.sin(a) * 0.34 * r;
        c.x = b.x + lx * R; c.y = b.y + (ly + INCL * lx) * R;
        c.nuvem = Math.min(1, Math.max(0, (t - 0.35) / 0.65));
        c.vermelho = Math.min(1, Math.max(0, (t - 0.7) / 0.3));
        // Encolhe ao espiralar (a matéria se espalha na nuvem) e some atrás da sombra.
        c.tamanho = 1 - 0.65 * tc;
        const atras = Math.sin(a) > 0 && Math.hypot(lx, ly + INCL * lx) < 1 + c.s * c.tamanho / R;
        c.alfa = Math.exp(-Math.max(t - 0.78, 0) * 9) * (atras ? 0 : 1);
        c.eixo = [-lx / Math.max(1e-4, Math.hypot(lx, ly)), -ly / Math.max(1e-4, Math.hypot(lx, ly))];
        c.estira = 2 * c.nuvem;
        c.emitir += dt * (t > 0.25 && t < 0.95 ? 18 * Math.min(2, c.s / R + 0.3) : 0);
        while (c.emitir >= 1) { c.emitir--; soltarFaiscas(c.x, c.y, 1, 0.35); }
        if (c.t >= 1) { absorver(c); w.corpos.splice(i, 1); }
        continue;
      }
      if (comivel && dist < alcance + c.s) {
        // Atraído: queda acelerando, com componente tangencial.
        c.estado = 1;
        const g = R * 2.2 * Math.pow(R / Math.max(dist, R), 2) * 6;
        c.vx += (-dx / dist * g + -dy / dist * g * 0.35) * dt;
        c.vy += (-dy / dist * g + dx / dist * g * 0.35) * dt;
        const ex = dx / R, ey = (dy - INCL * dx) / (R * 0.34);
        const rr = Math.hypot(ex, ey);
        if (rr < 3.0) {
          c.estado = 2; c.t = 0; c.r0 = rr; c.a0 = Math.atan2(ey, ex);
          c.dur = (2.6 + 1.4 * Math.min(1, c.s / R)) * (rr / 3);
        }
      } else if (!comivel && dist < R * 1.4 + c.s) {
        // Grande demais: maré o estica e ele é desviado, sem atravessar o núcleo.
        const empurra = (R * 1.4 + c.s - dist) * 2;
        c.vx += dx / dist * empurra * dt; c.vy += dy / dist * empurra * dt;
      }
      if (!comivel) {
        const perto = Math.min(1, 2.2 * R / Math.max(dist, 1e-4));
        c.estira = 0.8 * perto * perto; c.eixo = [-dx / dist, -dy / dist];
      }
      c.x += c.vx * dt; c.y += c.vy * dt;
      c.vx *= Math.exp(-dt * 0.05); c.vy *= Math.exp(-dt * 0.05);
      const longe = Math.hypot(c.x - w.cam.x, c.y - w.cam.y) > ext * 2.3;
      const minusculo = c.s * w.escala < 0.0012 && c.estado === 0;
      if (longe || minusculo) w.corpos.splice(i, 1);
    }
    preencher(false);
    for (let i = w.faiscas.length - 1; i >= 0; i--) {
      const f = w.faiscas[i];
      f.vida += dt;
      const dx = b.x - f.x, dy = b.y - f.y, d = Math.max(Math.hypot(dx, dy), R * 0.5);
      f.vx += dx / d * R * 1.5 * dt; f.vy += dy / d * R * 1.5 * dt;
      f.x += f.vx * dt; f.y += f.vy * dt;
      if (f.vida > f.dur || d < R) w.faiscas.splice(i, 1);
    }
  }

  // ---------- render ----------
  let tela = 'abertura', transicao = 0, dpr = 1, mediaQuadro = 16;
  function uniformsBase(u, W, H, centro, Rtela) {
    gl.uniform2f(u.uRes, W, H);
    gl.uniform1f(u.uTempo, mundo.tempo); // TD = uTempo * uMov congela o decorativo no modo reduzido
    gl.uniform1f(u.uMov, reduzido() ? 0 : 1);
    gl.uniform1f(u.uQualidade, perfil().q);
    gl.uniform1f(u.uR, Rtela);
    gl.uniform2f(u.uCentro, centro[0], centro[1]);
    gl.uniform4f(u.uPulso, ...mundo.pulso);
    gl.uniform2f(u.uJato, ...mundo.jato);
  }
  function desenhar() {
    const p = perfil();
    dpr = Math.min(devicePixelRatio || 1, 1.75) * p.escala;
    const W = Math.max(1, Math.round(canvas.clientWidth * dpr)), H = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    gl.viewport(0, 0, W, H);
    const aspecto = W / H;
    const b = mundo.buraco, R = raioDe(b.M);
    // Abertura: núcleo à esquerda e maior; jogo: núcleo acompanhado no centro (layout dos tokens).
    const k = transicao * transicao * (3 - 2 * transicao);
    const largo = aspecto > 1.1;
    const abertura = largo ? [-0.22 * aspecto, 0.02] : [0, 0.17];
    const posJogo = [(b.x - mundo.cam.x) * mundo.escala, (b.y - mundo.cam.y) * mundo.escala];
    const centro = [abertura[0] + (posJogo[0] - abertura[0]) * k, abertura[1] + (posJogo[1] - abertura[1]) * k];
    const zoom = 1 + (largo ? 0.6 : 0.25) * (1 - k);
    const escala = mundo.escala * zoom;
    const Rtela = R * escala;
    const tela2 = (x, y) => [centro[0] + (x - b.x) * escala, centro[1] + (y - b.y) * escala];

    gl.disable(gl.BLEND);
    gl.useProgram(pCena.p); uniformsBase(pCena.u, W, H, centro, Rtela);
    gl.uniform2f(pCena.u.uParalaxe, mundo.paralaxe[0], mundo.paralaxe[1]);
    gl.uniform2f(pCena.u.uGrade, mundo.grade[0], mundo.grade[1]);
    gl.uniform1f(pCena.u.uCelula, Rtela * 0.55);
    gl.bindVertexArray(vaoTela); gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Corpos: maiores primeiro.
    const lista = mundo.corpos.slice().sort((a, c) => c.s - a.s);
    let n = 0;
    for (const c of lista) {
      if (n >= MAX_CORPOS) break;
      const [x, y] = tela2(c.x, c.y);
      const raio = c.s * escala * c.tamanho;
      const ext = EXTENSAO(c.tipo) * (1 + 2.5 * c.nuvem);
      if (Math.abs(x) - raio * ext * 3 > 0.5 * aspecto || Math.abs(y) - raio * ext * 3 > 0.5 || raio < 0.0008 || c.alfa <= 0.001) continue;
      const lx = centro[0] - x, ly = centro[1] - y, ll = Math.max(1e-5, Math.hypot(lx, ly));
      const o = n * STRIDE;
      dadosCorpos.set([x, y, raio, c.tipo, c.eixo[0], c.eixo[1], c.estira, c.semente, c.alfa * Math.min(1, k * 1.5 + 0.35), c.vermelho, c.nuvem, ext, lx / ll, ly / ll], o);
      n++;
    }
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    if (n) {
      gl.useProgram(pCorpo.p); uniformsBase(pCorpo.u, W, H, centro, Rtela);
      gl.bindVertexArray(vaoCorpo);
      gl.bindBuffer(gl.ARRAY_BUFFER, vboCorpos); gl.bufferSubData(gl.ARRAY_BUFFER, 0, dadosCorpos, 0, n * STRIDE);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
    }
    gl.useProgram(pPontos.p); uniformsBase(pPontos.u, W, H, centro, Rtela);
    gl.uniform2f(pPontos.u.uParalaxe, mundo.paralaxe[0], mundo.paralaxe[1]);
    gl.uniform1i(pPontos.u.uNAmb, p.amb); gl.uniform1i(pPontos.u.uNHalo, p.halo); gl.uniform1f(pPontos.u.uDpr, dpr);
    gl.bindVertexArray(vaoTela); gl.drawArrays(gl.POINTS, 0, p.amb + p.halo + p.jato);
    let nf = 0;
    for (const f of mundo.faiscas) {
      if (nf >= MAX_FAISCAS) break;
      const [x, y] = tela2(f.x, f.y);
      dadosFaiscas.set([x, y, (1 - f.vida / f.dur) * 0.6 * (reduzido() ? 0.6 : 1), f.tam], nf * 4); nf++;
    }
    if (nf) {
      gl.useProgram(pFaiscas.p);
      gl.uniform2f(pFaiscas.u.uRes, W, H); gl.uniform1f(pFaiscas.u.uDpr, dpr);
      gl.uniform3f(pFaiscas.u.uCorA, ...hex(C.diskWarm.value)); gl.uniform3f(pFaiscas.u.uCorB, ...hex(C.diskHot.value));
      gl.bindVertexArray(vaoFaiscas); gl.bindBuffer(gl.ARRAY_BUFFER, vboFaiscas);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, dadosFaiscas, 0, nf * 4);
      gl.drawArrays(gl.POINTS, 0, nf);
    }
    gl.bindVertexArray(null);
  }

  // ---------- laço: simulação fixa a 60 Hz, render por quadro ----------
  let acumulado = 0, anterior = performance.now(), rodando = true, janela = 0;
  function quadro(agora) {
    requestAnimationFrame(quadro);
    const dt = Math.min(0.25, (agora - anterior) / 1000); anterior = agora;
    mediaQuadro += (dt * 1000 - mediaQuadro) * 0.05;
    if (!rodando) return;
    if (tela === 'jogo' && transicao < 1) transicao = Math.min(1, transicao + dt / 1.2);
    if (tela === 'abertura' && transicao > 0) transicao = Math.max(0, transicao - dt / 1.2);
    acumulado += dt;
    let passos = 0;
    while (acumulado >= 1 / 60 && passos++ < 8) { passo(1 / 60); acumulado -= 1 / 60; }
    if (passos >= 8) acumulado = 0;
    desenhar();
    // Auto: desce de perfil com quadros lentos sustentados, sobe com folga longa (histerese).
    if (prefs.qualidade === 0) {
      janela += dt;
      if (janela > 1) {
        if (mediaQuadro > 22) { janelaRuim++; janelaBoa = 0; } else if (mediaQuadro < 14) { janelaBoa++; janelaRuim = 0; } else { janelaRuim = 0; janelaBoa = 0; }
        if (janelaRuim >= 2 && perfilAuto !== 2) { perfilAuto = perfilAuto === 1 ? 0 : 2; janelaRuim = 0; }
        if (janelaBoa >= 10 && perfilAuto !== 1) { perfilAuto = perfilAuto === 2 ? 0 : 1; janelaBoa = 0; }
        janela = 0;
      }
    }
    if (prefs.analise) atualizarAnalise();
  }

  // ---------- UI ----------
  const abertura = $('#abertura'), jogo = $('#jogo'), pausa = $('#pausa'), ajustes = $('#ajustes'), analise = $('#analise');
  let origemAjustes = 'abertura', instrucaoVisivel = true;
  function mostrar(nome) {
    tela = nome;
    abertura.hidden = nome !== 'abertura';
    jogo.hidden = nome !== 'jogo' && nome !== 'pausa' && nome !== 'ajustes-jogo';
    pausa.hidden = nome !== 'pausa';
    ajustes.hidden = nome !== 'ajustes' && nome !== 'ajustes-jogo';
    rodando = nome === 'jogo' || nome === 'abertura';
    analise.hidden = !prefs.analise || nome !== 'jogo';
    if (rodando) { anterior = performance.now(); Som.retomar(); } else Som.suspender();
  }
  function pausar() { if (tela === 'jogo') { mostrar('pausa'); $('#continuar').focus(); } }
  $('#comecar').addEventListener('click', () => { Som.iniciar(); mostrar('jogo'); $('#botao-pausa').focus(); });
  $('#abrir-ajustes').addEventListener('click', () => { origemAjustes = 'abertura'; abrirAjustes(); });
  $('#pausa-ajustes').addEventListener('click', () => { origemAjustes = 'pausa'; abrirAjustes(); });
  $('#continuar').addEventListener('click', () => mostrar('jogo'));
  $('#recomecar').addEventListener('click', () => { novoUniverso(); mostrar('jogo'); });
  $('#sair').addEventListener('click', () => { mostrar('abertura'); $('#comecar').focus(); });
  $('#botao-pausa').addEventListener('click', pausar);
  $('#ajustes-voltar').addEventListener('click', () => { mostrar(origemAjustes); (origemAjustes === 'pausa' ? $('#pausa-ajustes') : $('#abrir-ajustes')).focus(); });
  function abrirAjustes() {
    $('#aj-som').checked = prefs.som; $('#aj-efeitos').value = prefs.efeitos; $('#aj-reduzido').checked = prefs.reduzido;
    $('#aj-qualidade').value = String(prefs.qualidade); $('#aj-analise').checked = prefs.analise;
    mostrar(origemAjustes === 'pausa' ? 'ajustes-jogo' : 'ajustes'); $('#aj-som').focus();
  }
  function atualizarSom() {
    $('#botao-som').setAttribute('aria-label', prefs.som ? 'Silenciar áudio' : 'Ativar áudio');
    $('#botao-som use').setAttribute('href', prefs.som ? '#obs-volume' : '#obs-muted');
    Som.aplicar(); salvar();
  }
  $('#botao-som').addEventListener('click', () => { Som.iniciar(); prefs.som = !prefs.som; atualizarSom(); });
  $('#aj-som').addEventListener('change', e => { Som.iniciar(); prefs.som = e.target.checked; atualizarSom(); });
  $('#aj-efeitos').addEventListener('input', e => { prefs.efeitos = +e.target.value; Som.aplicar(); salvar(); });
  $('#aj-reduzido').addEventListener('change', e => { prefs.reduzido = e.target.checked; salvar(); });
  $('#aj-qualidade').addEventListener('change', e => { prefs.qualidade = +e.target.value; salvar(); });
  $('#aj-analise').addEventListener('change', e => { prefs.analise = e.target.checked; analise.hidden = !prefs.analise || tela !== 'jogo'; salvar(); });
  atualizarSom();

  // Painel do protótipo.
  function atualizarAnalise() {
    const M = mundo.buraco.M;
    $('#an-escala').textContent = ESCALAS[Math.max(0, escalaDe(M))].nome;
    $('#an-massa').textContent = M.toFixed(M < 10 ? 2 : 0);
    $('#an-corpos').textContent = mundo.corpos.length;
    $('#an-absorcoes').textContent = mundo.absorcoes;
    $('#an-quadro').textContent = `${mediaQuadro.toFixed(1)} ms · ${['Equilíbrio', 'Alta', 'Econômica'][prefs.qualidade === 0 ? perfilAuto : prefs.qualidade]}`;
  }
  $('#an-crescer').addEventListener('click', () => { mundo.buraco.M *= 2; });
  // Salto de escala do painel: câmera vai direto para a nova escala e o campo é refeito nela.
  $('#an-escala-prox').addEventListener('click', () => {
    const e = Math.max(0, escalaDe(mundo.buraco.M));
    if (ESCALAS[e].ate !== Infinity) mundo.buraco.M = ESCALAS[e].ate * 1.05;
    mundo.escala = 0.075 / raioDe(mundo.buraco.M);
    mundo.corpos.length = 0; mundo.faiscas.length = 0; preencher(true);
  });
  $('#an-jato').addEventListener('click', () => { mundo.jato = [0, 1]; Som.jato(); });

  // Entrada: deslizar move o núcleo; soltar observa.
  function posicao(e) {
    const r = canvas.getBoundingClientRect();
    entrada.x = (e.clientX - r.left - r.width / 2) / r.height;
    entrada.y = -(e.clientY - r.top - r.height / 2) / r.height;
  }
  canvas.addEventListener('pointerdown', e => {
    if (tela !== 'jogo') return;
    entrada.ativo = true; posicao(e); canvas.setPointerCapture(e.pointerId);
    if (instrucaoVisivel) { instrucaoVisivel = false; $('#instrucao').style.opacity = '0'; setTimeout(() => { $('#instrucao').hidden = true; }, 600); }
  });
  canvas.addEventListener('pointermove', e => { if (entrada.ativo) posicao(e); });
  const soltar = () => { entrada.ativo = false; };
  canvas.addEventListener('pointerup', soltar); canvas.addEventListener('pointercancel', soltar);
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (tela === 'jogo') pausar(); else if (tela === 'pausa') mostrar('jogo'); return; }
    if (tela === 'jogo' && /^(Arrow(Up|Down|Left|Right)|[wasd])$/.test(e.key)) { entrada.teclas.add(e.key); e.preventDefault(); }
  });
  addEventListener('keyup', e => entrada.teclas.delete(e.key));
  // Só em primeiro plano: sair da aba pausa a exploração e silencia.
  document.addEventListener('visibilitychange', () => { if (document.hidden) { pausar(); Som.suspender(); } });

  // Gancho só para verificação local (?teste): roda a simulação sem depender do requestAnimationFrame.
  if (location.search.includes('teste')) window.umbraTeste = { mundo, passo, desenhar, raioDe, escalaDe, entrada, mostrar: n => mostrar(n), definirTransicao: v => { transicao = v; } };
  novoUniverso();
  mostrar('abertura');
  $('#comecar').focus();
  requestAnimationFrame(quadro);
})();
