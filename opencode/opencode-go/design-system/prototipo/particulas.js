// Protótipo 2 do Umbra: mesma direção escolhida, renderizada como o Black Hole Bloom faz na Unity —
// tudo que é matéria vira partícula luminosa, a cena é HDR e passa por bloom. Cada técnica aqui existe
// 1:1 no OpenGL ES 3.0 do Android:
//  - partículas simuladas na GPU por transform feedback (GLES 3.0), dezenas de milhares por quadro;
//  - render em textura HDR (RGBA16F: EXT_color_buffer_float/half_float), com recuo para RGBA8;
//  - duas camadas: o que está atrás do núcleo é curvado pela lente na tela (os arcos nascem da física),
//    o que está na frente não;
//  - bloom em cadeia de mipmaps (Kawase dual filter), o mesmo princípio do pós-processamento da Unity.
(function () {
  'use strict';
  const T = JSON.parse(document.getElementById('tokens').textContent);
  const $ = s => document.querySelector(s);
  const TAU = Math.PI * 2, INCL = T.render.diskTilt, ACH = 0.16;
  $('#instrucao').textContent = T.copy.instruction;

  // ---------- paletas (Obsidiana enriquecida; Neon só como referência de comparação) ----------
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const C = T.colors, MC = T.render.matterColors;
  const PALETAS = [
    { // Obsidiana: núcleo e disco marfim/âmbar; cores próprias só na matéria.
      discoQuente: hex(C.diskHot.value), discoFrio: hex(C.diskWarm.value), anel: hex(C.diskHot.value),
      neb1: hex(C.surfaceRaised.value), neb2: hex(MC.gasViolet), neb3: hex(C.background.value), nebForca: 0.55,
      jato: hex(C.diskHot.value), jatoPonta: hex(C.diskWarm.value), poeira: hex(C.diskMid.value), grade: hex(C.diskMid.value),
      fumaca: hex(C.diskWarm.value)
    },
    { // Neon: aproximação da referência (turquesa, azul, magenta). Fora do Obsidiana; só para comparar.
      discoQuente: [0.75, 1.0, 0.95], discoFrio: [0.1, 0.75, 0.7], anel: [0.85, 1.0, 1.0],
      neb1: [0.05, 0.25, 0.55], neb2: [0.0, 0.45, 0.45], neb3: [0.02, 0.04, 0.12], nebForca: 1.0,
      jato: [1.0, 0.5, 0.95], jatoPonta: [0.4, 0.3, 1.0], poeira: [0.6, 0.85, 1.0], grade: [0.4, 0.8, 0.9],
      fumaca: [0.2, 0.9, 0.8]
    }
  ];
  let paleta = 0;

  // ---------- WebGL2 ----------
  const canvas = $('#cena');
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, premultipliedAlpha: true });
  if (!gl) {
    document.body.insertAdjacentHTML('beforeend', '<div class="aviso"><div><h2>Sem WebGL2</h2><p>Este navegador não oferece WebGL2 (equivalente ao OpenGL ES 3.0 do Android). Abra num Chrome, Edge, Firefox ou Safari atual.</p></div></div>');
    return;
  }
  const hdr = !!gl.getExtension('EXT_color_buffer_float');
  const FORMATO = hdr ? { interno: gl.RGBA16F, tipo: gl.HALF_FLOAT } : { interno: gl.RGBA8, tipo: gl.UNSIGNED_BYTE };
  const MAX_PONTO = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1];

  function compilar(tipo, fonte) {
    const s = gl.createShader(tipo); gl.shaderSource(s, fonte); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function programa(vs, fs, nomes, varyings) {
    const p = gl.createProgram();
    gl.attachShader(p, compilar(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compilar(gl.FRAGMENT_SHADER, fs));
    if (varyings) gl.transformFeedbackVaryings(p, varyings, gl.INTERLEAVED_ATTRIBS);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; nomes.forEach(n => { u[n] = gl.getUniformLocation(p, n); });
    return { p, u };
  }

  const RUIDO = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float h1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
float ruido(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * ruido(p); p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03 + vec2(5.7, 8.1); a *= 0.5; }
    return v;
}
float gauss(float x, float w) { return exp(-(x * x) / (w * w)); }
mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }
`;
  const TELA_VS = `#version 300 es
out vec2 vUV;
void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); vUV = p; gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;

  // ---------- 1. Simulação de partículas (transform feedback) ----------
  // Estado por partícula (10 floats): pos(2) vel(2) vida(idade, duração) dados(tipo, semente, tamanho px, brilho).
  // Tipos: −1 morta, 0 poeira ambiente, 1 disco (pos = ângulo, raio em R), 2 detrito, 3 jato, 4 faísca, 5 fumaça do disco.
  const SIM_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aVel;
layout(location = 2) in vec2 aVida;
layout(location = 3) in vec4 aDados;
out vec2 vPos; out vec2 vVel; out vec2 vVida; out vec4 vDados;
uniform float uDt; uniform vec2 uBuraco; uniform vec2 uCam; uniform float uR; uniform float uGM; uniform float uExt; uniform float uMov;
const float INCL = ${INCL.toFixed(3)}; const float ACH = ${ACH};
float h1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
vec2 noDisco(vec2 rel) { return vec2(rel.x, (rel.y - INCL * rel.x) / ACH) / uR; }
void main() {
    vec2 pos = aPos; vec2 vel = aVel; vec2 vida = aVida; vec4 d = aDados; float tipo = d.x;
    vida.x += uDt;
    if ((tipo > -0.5 && tipo < 0.5) || tipo > 5.5) {
        vec2 rel = pos - uBuraco; float r = length(rel);
        float g = uGM / max(r * r, uR * uR) * smoothstep(tipo > 5.5 ? 14.0 * uR : 10.0 * uR, 5.0 * uR, r);
        vel += -rel / max(r, 1e-4) * g * uDt + vec2(-rel.y, rel.x) / max(r, 1e-4) * g * 0.45 * uDt;
        vel *= exp(-uDt * 0.25);
        pos += (vel + vec2(0.03, 0.012) * uR * uMov) * uDt;
        vec2 dc = pos - uCam; float E = uExt * 1.3;
        if (tipo < 0.5) {
            if (abs(dc.x) > E) { pos.x = uCam.x - sign(dc.x) * E * 0.98; vel = vec2(0.0); }
            if (abs(dc.y) > E) { pos.y = uCam.y - sign(dc.y) * E * 0.98; vel = vec2(0.0); }
        } else if (vida.x > vida.y || length(dc) > E * 2.5) { tipo = -1.0; }
        vec2 e = noDisco(pos - uBuraco);
        if (r < 3.2 * uR && length(e) < 2.8) { tipo = 1.0; pos = vec2(atan(e.y, e.x), length(e)); vel = vec2(0.0); vida = vec2(0.0, 30.0 + 20.0 * h1(d.y)); }
    } else if (tipo > 0.5 && tipo < 1.5 || (tipo > 4.5 && tipo < 5.5)) {
        // Disco: rotação kepleriana e queda lenta, acelerando perto do horizonte.
        float rr = pos.y;
        pos.x += 1.25 * pow(max(rr, 1.0), -1.5) * uDt;
        pos.y -= (0.035 + 0.05 * h1(d.y)) / max(rr, 1.0) * uDt * (1.0 + 3.0 * smoothstep(1.7, 1.05, rr));
        if (pos.y < 1.02 || vida.x > vida.y) tipo = -1.0;
    } else if (tipo > 1.5 && tipo < 2.5) {
        vec2 rel = pos - uBuraco; float r = length(rel);
        vel += -rel / max(r, 1e-4) * uGM / max(r * r, uR * uR) * uDt;
        pos += vel * uDt;
        vec2 e = noDisco(pos - uBuraco);
        if (length(e) < 2.6) { tipo = 1.0; pos = vec2(atan(e.y, e.x), length(e)); vel = vec2(0.0); vida = vec2(0.0, 25.0 + 15.0 * h1(d.y)); }
        else if (vida.x > vida.y) tipo = -1.0;
    } else if (tipo > 2.5 && tipo < 4.5) {
        pos += vel * uDt; vel *= exp(-uDt * (tipo < 3.5 ? 0.15 : 1.6));
        if (vida.x > vida.y) tipo = -1.0;
    }
    d.x = tipo;
    vPos = pos; vVel = vel; vVida = vida; vDados = d;
}`;
  const SIM_FS = `#version 300 es
precision mediump float; out vec4 o; void main() { o = vec4(0.0); }`;

  // ---------- 2. Desenho das partículas (pontos aditivos HDR, camada de trás ou da frente) ----------
  const PART_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aVel;
layout(location = 2) in vec2 aVida;
layout(location = 3) in vec4 aDados;
uniform vec2 uRes; uniform vec2 uCam; uniform float uEscala; uniform vec2 uBuraco; uniform float uR;
uniform float uCamada; uniform float uDpr; uniform float uMaxPonto; uniform float uTempo; uniform float uPulso;
uniform vec3 uDiscoQuente; uniform vec3 uDiscoFrio; uniform vec3 uPoeira; uniform vec3 uJato; uniform vec3 uJatoPonta; uniform vec3 uFumaca;
uniform vec3 uMat[8];
const float INCL = ${INCL.toFixed(3)}; const float ACH = ${ACH};
const vec2 EIXO = vec2(0.1191, 0.9929);
float h1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
out vec3 vCor; out float vSuave;
void main() {
    float tipo = aDados.x; float sem = aDados.y;
    vec2 mundo; bool atras = true; vec3 cor; float tam = aDados.z; float brilho = aDados.w;
    if (tipo < -0.5) { gl_Position = vec4(3.0, 3.0, 0.0, 1.0); gl_PointSize = 0.0; vCor = vec3(0.0); vSuave = 1.0; return; }
    float idade = aVida.x / max(aVida.y, 1e-3);
    vSuave = 1.0;
    if ((tipo > 0.5 && tipo < 1.5) || (tipo > 4.5 && tipo < 5.5)) {
        float a = aPos.x; float r = aPos.y;
        vec2 l = vec2(cos(a), sin(a) * ACH) * r * uR;
        l.y += (h1(sem * 3.1) - 0.5) * 0.06 * uR * r;
        mundo = uBuraco + vec2(l.x, l.y + INCL * l.x);
        atras = sin(a) > 0.0;
        float calor = clamp(1.75 / r - 0.42, 0.0, 1.0);
        float doppler = 1.0 + 0.4 * cos(a);
        float nasce = smoothstep(0.0, 0.08, idade) * (1.0 - smoothstep(0.85, 1.0, idade));
        cor = mix(uDiscoFrio, uDiscoQuente, calor) * (0.07 + 0.55 * calor * calor) * doppler * nasce * brilho * (1.0 + 0.8 * uPulso);
        if (tipo > 4.5) { cor = uFumaca * 0.018 * nasce * (1.0 + calor); tam *= 1.0 + r * 0.5; vSuave = 2.0; }
    } else {
        mundo = aPos;
        if (tipo > 5.5) {
            float f = fract(brilho); int ci = int(brilho);
            cor = uMat[ci] * (0.6 + 2.2 * f) * (0.75 + 0.25 * sin(uTempo * (0.7 + h1(sem)) + sem * 7.0));
            if (f > 0.9) { tam *= 7.0; cor *= 0.1; vSuave = 2.0; }
        }
        else if (tipo < 0.5) { cor = uPoeira * 0.22 * brilho * (0.75 + 0.25 * sin(uTempo * (0.5 + h1(sem)) + sem * 9.0)); }
        else if (tipo < 2.5) { cor = uMat[int(mod(brilho, 8.0))] * 1.4 * (1.0 - idade * 0.5); }
        else if (tipo < 3.5) {
            atras = dot(aPos - uBuraco, EIXO) < 0.0;
            cor = mix(uJato, uJatoPonta, idade) * 2.2 * (1.0 - idade) * (atras ? 0.5 : 1.0);
        } else { cor = mix(uDiscoQuente, uDiscoFrio, idade) * 2.5 * (1.0 - idade); }
    }
    if ((uCamada < 0.5) != atras) { gl_Position = vec4(3.0, 3.0, 0.0, 1.0); gl_PointSize = 0.0; vCor = vec3(0.0); return; }
    vec2 tela = (mundo - uCam) * uEscala;
    gl_Position = vec4(tela.x * 2.0 * uRes.y / uRes.x, tela.y * 2.0, 0.0, 1.0);
    gl_PointSize = clamp(tam * uDpr, 1.0, uMaxPonto);
    vCor = cor;
}`;
  const PART_FS = `#version 300 es
precision mediump float;
in vec3 vCor; in float vSuave;
out vec4 o;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = vSuave > 1.5 ? exp(-d * d * 3.0) * (1.0 - d) : (1.0 - smoothstep(0.0, 1.0, d)) * (1.0 - smoothstep(0.0, 1.0, d));
    o = vec4(vCor * max(a, 0.0), 0.0);
}`;

  // ---------- 3. Fundo: nebulosa volumosa, estrelas, grade de Einstein (espaço-tempo 01) ----------
  const FUNDO_FS = `#version 300 es
precision highp float;
${RUIDO}
in vec2 vUV; out vec4 o;
uniform vec2 uRes; uniform vec2 uCentro; uniform float uR; uniform vec2 uParalaxe; uniform vec2 uGrade; uniform float uTempo;
uniform vec3 uNeb1; uniform vec3 uNeb2; uniform vec3 uNeb3; uniform float uNebForca; uniform vec3 uGradeCor; uniform float uOnda; uniform float uOndaForca;
float estrelas(vec2 p, float d) {
    vec2 g = p * d; vec2 c = floor(g); vec2 f = fract(g);
    float s = hash(c); vec2 pos = vec2(hash(c + 3.7), hash(c + 21.0));
    float k = length(f - pos); float b = pow(s, 16.0);
    return exp(-k * k * 1800.0) * b * 2.5 + exp(-k * k * 120.0) * b * 0.15;
}
vec2 deformar(vec2 p) {
    float r = length(p); vec2 dir = p / max(r, 1e-4); float alc = 5.0 * uR;
    vec2 q = p + dir * 0.7 * uR * uR * 1.6 / (r + uR * 0.6) * exp(-r / alc);
    q = rot(0.5 * exp(-r / alc) * uR / (r + 0.3 * uR)) * q;
    float s = uOnda;
    float onda = s < 3.6 ? gauss(r - (uR + s * 0.26 * uOndaForca), 0.025 * uOndaForca) * (1.0 - s / 3.6) : 0.0;
    return q + dir * onda * uR * 0.29 * uOndaForca;
}
void main() {
    vec2 s = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec2 b = s + uParalaxe;
    // Nebulosa em três camadas de fbm com distorção de domínio (fumaça volumosa, como a referência).
    vec2 w = b * 1.6 + vec2(fbm(b * 1.3 + uTempo * 0.01), fbm(b * 1.3 + 4.0 - uTempo * 0.008)) * 0.8;
    float n1 = fbm(w); float n2 = fbm(w * 2.1 + 7.0); float n3 = fbm(b * 0.7 + 2.0);
    vec3 c = uNeb3 * 0.6;
    c += uNeb1 * pow(smoothstep(0.35, 0.85, n1), 2.0) * 0.55 * uNebForca;
    c += uNeb2 * pow(smoothstep(0.45, 0.9, n2 * n3 * 1.6), 2.0) * 0.4 * uNebForca;
    c += vec3(0.8, 0.85, 0.95) * (estrelas(b * 1.0 + 4.0, 70.0) + 0.7 * estrelas(b * 0.6 + 11.2, 38.0));
    vec2 p = s - uCentro; float rn = length(p) / uR;
    vec2 q = deformar(p) / (uR * 0.55) + uGrade;
    vec2 g = abs(fract(q - 0.5) - 0.5) / max(fwidth(q), vec2(1e-4));
    float linha = 1.0 - min(min(g.x, g.y), 1.0);
    c += uGradeCor * linha * 0.12 * smoothstep(1.05, 2.4, rn) * (0.35 + 0.65 * exp(-length(p) / (uR * 11.0)));
    o = vec4(c, 1.0);
}`;

  // ---------- 4. Corpos (planetas, asteroides, estrelas) com borda suave e emissão para o bloom ----------
  const CORPO_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCanto;
layout(location = 1) in vec4 aPosRaio;
layout(location = 2) in vec4 aExtra;
uniform vec2 uRes;
out vec2 vLocal; flat out float vTipo; flat out float vSem; out vec2 vLuz; out float vAlfa;
void main() {
    float ext = aExtra.w;
    vec2 s = aPosRaio.xy + aCanto * ext * aPosRaio.z;
    gl_Position = vec4(s.x * 2.0 * uRes.y / uRes.x, s.y * 2.0, 0.0, 1.0);
    vLocal = aCanto * ext; vTipo = aPosRaio.w; vSem = aExtra.z; vLuz = aExtra.xy; vAlfa = 1.0;
}`;
  const CORPO_FS = `#version 300 es
precision highp float;
${RUIDO}
in vec2 vLocal; flat in float vTipo; flat in float vSem; in vec2 vLuz; in float vAlfa;
out vec4 o;
uniform float uTempo; uniform vec3 uMat[8];
vec3 girar(vec3 n, float a) { float c = cos(a); float s = sin(a); return vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z); }
void main() {
    vec2 d = vLocal; float tipo = vTipo; vec2 luz = normalize(vLuz + 1e-5);
    int ci = tipo > 8.5 ? 0 : int(tipo + 0.5);
    float q = length(d);
    vec3 cor = vec3(0.0); float cob = 0.0;
    if (tipo > 9.5) {
        // Estrela: núcleo quente, coroa larga que o bloom espalha.
        vec3 tom = uMat[int(tipo) - 4];
        float disco = smoothstep(1.0, 0.85, q);
        cor = mix(vec3(1.0), tom, q * q) * disco * (3.0 + 0.6 * fbm(d * 4.0 + uTempo * 0.1));
        cor += tom * exp(-max(q - 1.0, 0.0) * 2.2) * (1.0 - disco) * (0.8 + 0.4 * fbm(vec2(atan(d.y, d.x) * 3.0, uTempo * 0.3)));
        o = vec4(cor * vAlfa, disco * vAlfa); return;
    }
    if (tipo > 8.5) q *= 1.0 + 0.25 * (ruido(vec2(atan(d.y, d.x) * 2.0 + uTempo * 0.4, vSem)) - 0.5);
    if (q < 1.0) {
        vec3 n = vec3(d, sqrt(max(1.0 - q * q, 0.0)));
        vec3 m = girar(n, uTempo * 0.35 + vSem);
        vec2 uv = m.xy * 1.7 + vec2(m.z * 1.3, m.z * 0.4) + vSem * 3.0;
        float det = fbm(uv * 1.8);
        vec3 base = uMat[ci] * (0.55 + 0.6 * det);
        if (tipo > 4.5 && tipo < 5.5) base = mix(uMat[5], vec3(0.85, 0.82, 0.76), 0.5 + 0.5 * sin(m.y * 12.0 + det * 3.0));
        float lambert = max(dot(n, normalize(vec3(luz, 0.5))), 0.0);
        float rim = pow(1.0 - n.z, 2.5) * max(dot(normalize(d + 1e-5), luz), 0.0);
        // Estilo 04 (contraluz) com preenchimento suave: o lado escuro não vira recorte preto.
        cor = base * (0.1 + 0.3 * lambert) + base * rim * 1.6;
        if (tipo > 0.5 && tipo < 1.5) cor += uMat[1] * smoothstep(0.6, 0.78, det) * 1.6;
        cob = smoothstep(1.0, 0.86, q);
    }
    // Atmosfera e brilho de borda: suaviza a silhueta e alimenta o bloom.
    float halo = exp(-max(q - 0.95, 0.0) * 14.0) * smoothstep(0.8, 1.0, q) * (0.25 + 0.75 * max(dot(normalize(d + 1e-5), luz), 0.0));
    cor += uMat[ci] * halo * 0.35;
    if (tipo > 4.5 && tipo < 5.5) {
        vec2 a = rot(0.35) * d; float r = length(vec2(a.x, a.y * 3.4));
        float anel = smoothstep(1.35, 1.48, r) * (1.0 - smoothstep(2.1, 2.3, r)) * (0.55 + 0.45 * sin(r * 22.0));
        if (a.y < 0.0 || q > 1.0) { cor = mix(cor, vec3(0.75, 0.7, 0.6) * 0.9, anel * 0.8); cob = max(cob, anel * 0.8); }
    }
    o = vec4(cor * vAlfa, cob * vAlfa);
}`;

  // ---------- 5. Composição: lente na camada de trás, sombra e anel (núcleo 13), camada da frente ----------
  const COMPOR_FS = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 o;
uniform sampler2D tAtras; uniform sampler2D tFrente;
uniform vec2 uRes; uniform vec2 uCentro; uniform float uR; uniform float uPulso; uniform vec3 uAnel; uniform vec3 uHalo;
float gauss(float x, float w) { return exp(-(x * x) / (w * w)); }
vec2 paraUV(vec2 s) { return vec2(s.x * uRes.y / uRes.x, s.y) + 0.5; }
void main() {
    vec2 s = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec2 p = s - uCentro; float r = length(p); float rn = r / uR;
    float thetaE = uR * 1.55;
    vec2 beta = p - p * (thetaE * thetaE / max(r * r, 1e-6));
    vec3 c = texture(tAtras, paraUV(uCentro + beta)).rgb;
    c *= smoothstep(0.88, 1.06, rn);
    c += uHalo * gauss(rn - 1.06, 0.06) * (0.5 + 0.8 * uPulso);
    c += uAnel * gauss(rn - 1.02, 0.01) * (1.1 + 1.6 * uPulso);
    c += texture(tFrente, vUV).rgb;
    o = vec4(c, 1.0);
}`;

  // ---------- 6. Bloom (Kawase dual filter) e saída ----------
  const BAIXO_FS = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 o;
uniform sampler2D tFonte; uniform vec2 uTexel; uniform float uLimiar;
void main() {
    vec3 c = texture(tFonte, vUV).rgb * 4.0;
    c += texture(tFonte, vUV + uTexel * vec2(-1.0, -1.0)).rgb + texture(tFonte, vUV + uTexel * vec2(1.0, -1.0)).rgb;
    c += texture(tFonte, vUV + uTexel * vec2(-1.0, 1.0)).rgb + texture(tFonte, vUV + uTexel * vec2(1.0, 1.0)).rgb;
    c /= 8.0;
    if (uLimiar > 0.0) {
        float b = max(c.r, max(c.g, c.b));
        float joelho = clamp(b - uLimiar + 0.5, 0.0, 1.0);
        float contrib = max(b - uLimiar, joelho * joelho * 0.5) / max(b, 1e-4);
        c *= contrib;
    }
    o = vec4(c, 1.0);
}`;
  const CIMA_FS = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 o;
uniform sampler2D tFonte; uniform vec2 uTexel;
void main() {
    vec3 c = texture(tFonte, vUV + uTexel * vec2(-2.0, 0.0)).rgb + texture(tFonte, vUV + uTexel * vec2(2.0, 0.0)).rgb;
    c += texture(tFonte, vUV + uTexel * vec2(0.0, -2.0)).rgb + texture(tFonte, vUV + uTexel * vec2(0.0, 2.0)).rgb;
    c += (texture(tFonte, vUV + uTexel * vec2(-1.0, 1.0)).rgb + texture(tFonte, vUV + uTexel * vec2(1.0, 1.0)).rgb
        + texture(tFonte, vUV + uTexel * vec2(-1.0, -1.0)).rgb + texture(tFonte, vUV + uTexel * vec2(1.0, -1.0)).rgb) * 2.0;
    o = vec4(c / 12.0, 1.0);
}`;
  const SAIDA_FS = `#version 300 es
precision highp float;
in vec2 vUV; out vec4 o;
uniform sampler2D tCena; uniform sampler2D tBloom; uniform float uBloom; uniform float uExposicao;
void main() {
    vec3 c = texture(tCena, vUV).rgb + texture(tBloom, vUV).rgb * uBloom;
    c = 1.0 - exp(-c * uExposicao);
    c = pow(c, vec3(0.9));
    vec2 v = vUV - 0.5;
    c *= 1.0 - 0.35 * pow(length(v * 1.15), 1.4);
    o = vec4(c, 1.0);
}`;

  const pSim = programa(SIM_VS, SIM_FS, ['uDt', 'uBuraco', 'uCam', 'uR', 'uGM', 'uExt', 'uMov'], ['vPos', 'vVel', 'vVida', 'vDados']);
  const pPart = programa(PART_VS, PART_FS, ['uRes', 'uCam', 'uEscala', 'uBuraco', 'uR', 'uCamada', 'uDpr', 'uMaxPonto', 'uTempo', 'uPulso',
    'uDiscoQuente', 'uDiscoFrio', 'uPoeira', 'uJato', 'uJatoPonta', 'uFumaca', 'uMat']);
  const pFundo = programa(TELA_VS, FUNDO_FS, ['uRes', 'uCentro', 'uR', 'uParalaxe', 'uGrade', 'uTempo', 'uNeb1', 'uNeb2', 'uNeb3', 'uNebForca', 'uGradeCor', 'uOnda', 'uOndaForca']);
  const pCorpo = programa(CORPO_VS, CORPO_FS, ['uRes', 'uTempo', 'uMat']);
  const pCompor = programa(TELA_VS, COMPOR_FS, ['tAtras', 'tFrente', 'uRes', 'uCentro', 'uR', 'uPulso', 'uAnel', 'uHalo']);
  const pBaixo = programa(TELA_VS, BAIXO_FS, ['tFonte', 'uTexel', 'uLimiar']);
  const pCima = programa(TELA_VS, CIMA_FS, ['tFonte', 'uTexel']);
  const pSaida = programa(TELA_VS, SAIDA_FS, ['tCena', 'tBloom', 'uBloom', 'uExposicao']);

  // Cores da matéria (render.matterColors) por índice de material visual.
  const MAT = [hex(C.diskMid.value), hex(MC.lava), hex(MC.ice), hex(MC.ocean), hex(MC.desert), hex(MC.gasViolet), hex(MC.starRed), hex(MC.starBlue)];
  // Tipos de corpo: 0 rochoso, 1 lava, 2 gelo, 3 oceano, 4 deserto, 5 gasoso com anéis, 9 asteroide,
  // 10 anã vermelha (cor 6), 11 estrela azul (cor 7).

  // ---------- buffers de partículas (ping-pong) ----------
  const QUALIDADES = [
    { particulas: 14000, escala: 0.6, mips: 4, corpos: 18 },
    { particulas: 32000, escala: 0.75, mips: 5, corpos: 26 },
    { particulas: 64000, escala: 1.0, mips: 6, corpos: 34 }
  ];
  let qualidade = 1;
  const FL = 10;
  let N = 0, buffers = [], vaos = [], tfs = [], fonte = 0, cursor = 0;
  function criarParticulas() {
    buffers.forEach(b => gl.deleteBuffer(b)); vaos.forEach(v => gl.deleteVertexArray(v)); tfs.forEach(t => gl.deleteTransformFeedback(t));
    N = QUALIDADES[qualidade].particulas;
    const dados = new Float32Array(N * FL);
    for (let i = 0; i < N; i++) dados[i * FL + 6] = -1; // todas mortas
    buffers = [0, 1].map(() => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, dados, gl.DYNAMIC_COPY); return b; });
    vaos = buffers.map(b => {
      const v = gl.createVertexArray(); gl.bindVertexArray(v); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      [[0, 2, 0], [1, 2, 2], [2, 2, 4], [3, 4, 6]].forEach(([l, n, o]) => { gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, FL * 4, o * 4); });
      return v;
    });
    tfs = buffers.map(b => { const t = gl.createTransformFeedback(); gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, t); gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, b); return t; });
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null); gl.bindVertexArray(null);
    fonte = 0; cursor = 0;
  }
  // Emissões do quadro: acumuladas na CPU e gravadas no buffer-fonte antes da simulação (anel circular).
  let emissoes = [];
  function emitir(x, y, vx, vy, duracao, tipo, tamanho, brilho) {
    emissoes.push(x, y, vx, vy, 0, duracao, tipo, Math.random() * 100, tamanho, brilho);
  }
  function gravarEmissoes() {
    if (!emissoes.length) return;
    const dados = new Float32Array(emissoes); emissoes = [];
    let n = dados.length / FL;
    if (n > N) n = N;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[fonte]);
    const primeira = Math.min(n, N - cursor);
    gl.bufferSubData(gl.ARRAY_BUFFER, cursor * FL * 4, dados, 0, primeira * FL);
    if (n > primeira) gl.bufferSubData(gl.ARRAY_BUFFER, 0, dados, primeira * FL, (n - primeira) * FL);
    cursor = (cursor + n) % N;
  }

  // ---------- render targets ----------
  const quadro = { w: 0, h: 0 };
  let alvos = null;
  function textura(w, h) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, FORMATO.interno, w, h, 0, gl.RGBA, FORMATO.tipo, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    return { t, f, w, h };
  }
  function criarAlvos(w, h) {
    if (alvos) Object.values(alvos).flat().forEach(a => { gl.deleteTexture(a.t); gl.deleteFramebuffer(a.f); });
    const mips = [];
    let mw = w, mh = h;
    for (let i = 0; i < QUALIDADES[qualidade].mips; i++) { mw = Math.max(1, mw >> 1); mh = Math.max(1, mh >> 1); mips.push(textura(mw, mh)); }
    alvos = { atras: [textura(w, h)], frente: [textura(w, h)], cena: [textura(w, h)], mips };
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // ---------- corpos (geometria instanciada) ----------
  const MAX_CORPOS = 120, CF = 8;
  const dadosCorpos = new Float32Array(MAX_CORPOS * CF);
  const vaoCorpo = gl.createVertexArray(); gl.bindVertexArray(vaoCorpo);
  const vboCanto = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vboCanto);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const vboCorpos = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vboCorpos);
  gl.bufferData(gl.ARRAY_BUFFER, dadosCorpos.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, CF * 4, 0); gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, CF * 4, 16); gl.vertexAttribDivisor(2, 1);
  const vaoTela = gl.createVertexArray();
  gl.bindVertexArray(null);

  // ---------- simulação de jogo (CPU: núcleo, corpos, eventos) ----------
  const raioDe = M => 0.55 * Math.sqrt(M);
  const mundo = {
    buraco: { x: 0, y: 0, vx: 0, vy: 0, M: 1 }, cam: { x: 0, y: 0 }, escala: 0.5 * T.render.coreHeightRange[0] / raioDe(1),
    corpos: [], paralaxe: [0, 0], grade: [0, 0], tempo: 0, pulso: 99, onda: 99, jato: 99, absorcoes: 0, ultimo: [0, 0]
  };
  const ESCALAS = [4, 32, 256, 2048];
  const POP = [[[9, 4], [0, 2], [2, 1]], [[9, 3], [0, 2], [2, 2], [1, 1]], [[0, 1], [1, 1], [2, 1], [3, 1.2], [4, 1], [5, 1], [9, 1]],
    [[10, 1.5], [11, 1.2], [3, 1], [5, 1], [1, 1]], [[10, 1], [11, 2], [5, 1]]];
  const COR_TIPO = t => t >= 10 ? (t === 10 ? 6 : 7) : t === 9 ? 0 : t;
  function sortear(e) {
    const l = POP[e], tot = l.reduce((a, [, w]) => a + w, 0); let x = Math.random() * tot;
    for (const [t, w] of l) if ((x -= w) <= 0) return t;
    return l[0][0];
  }
  const escalaDe = M => { let e = 0; while (e < ESCALAS.length && M >= ESCALAS[e]) e++; return e; };
  // Crescimento visível: dentro de cada faixa o núcleo vai de 12% a 24% da altura (render.coreHeightRange);
  // ao cruzar para a próxima faixa a câmera recua em 6 s (motionMs.cameraScaleTransition, curva de câmera).
  // Depois de Galáxias, cada ×8 de massa é uma nova faixa.
  const NOMES = ['Poeira', 'Asteroides', 'Planetas', 'Sistemas', 'Galáxias'];
  function faixa(M) {
    const e = escalaDe(M);
    if (e < ESCALAS.length) return { indice: e, lo: e === 0 ? 1 : ESCALAS[e - 1], hi: ESCALAS[e] };
    const k = Math.floor(Math.log(M / ESCALAS[ESCALAS.length - 1]) / Math.log(8));
    const lo = ESCALAS[ESCALAS.length - 1] * Math.pow(8, k);
    return { indice: e + k, lo, hi: lo * 8 };
  }
  function raioTelaAlvo(M) {
    const f = faixa(M), u = Math.min(1, Math.max(0, Math.log(M / f.lo) / Math.log(f.hi / f.lo)));
    const [d0, d1] = T.render.coreHeightRange;
    return 0.5 * (d0 + (d1 - d0) * u);
  }
  // cubic-bezier(0.4, 0, 0.2, 1) de motion.camera, resolvido por bisseção.
  function curvaCamera(x) {
    const bz = (t, a, b) => 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t;
    let lo = 0, hi = 1;
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (bz(m, 0.4, 0.2) < x) lo = m; else hi = m; }
    return bz((lo + hi) / 2, 0, 1);
  }
  const extensao = () => Math.max(0.5 * canvas.clientWidth / Math.max(1, canvas.clientHeight), 0.5) / mundo.escala;
  function novoCorpo(inicial) {
    const b = mundo.buraco, R = raioDe(b.M), ext = extensao();
    const ang = Math.random() * TAU, d = inicial ? ext * (0.35 + 1.3 * Math.sqrt(Math.random())) : ext * (1.15 + 0.5 * Math.random());
    const x = mundo.cam.x + Math.cos(ang) * d, y = mundo.cam.y + Math.sin(ang) * d;
    if (Math.hypot(x - b.x, y - b.y) < R * 6) return null;
    const tipo = sortear(escalaDe(b.M));
    let s = R * (0.08 + 0.4 * Math.pow(Math.random(), 1.6));
    if (Math.random() < 0.06) s = R * (0.6 + 0.5 * Math.random());
    const va = Math.random() * TAU, v = R * 0.08 * Math.random();
    return { x, y, s, tipo, sem: Math.random() * 40, vx: Math.cos(va) * v, vy: Math.sin(va) * v, preso: false, t: 0, a0: 0, r0: 0, dur: 0, tam: 1, emitir: 0 };
  }
  function preencher(inicial) {
    let tent = 0;
    while (mundo.corpos.length < QUALIDADES[qualidade].corpos && tent++ < 200) { const c = novoCorpo(inicial); if (c) mundo.corpos.push(c); }
  }
  // Disco inicial e poeira ambiente.
  function semear() {
    const R = raioDe(mundo.buraco.M), ext = extensao();
    for (let i = 0; i < N * 0.28; i++) {
      const r = 1.3 + 3.0 * Math.pow(Math.random(), 1.4), a = Math.random() * TAU;
      emissoes.push(a, r, 0, 0, Math.random() * 20, 30 + 20 * Math.random(), Math.random() < 0.12 ? 5 : 1, Math.random() * 100,
        Math.random() < 0.12 ? 18 + 20 * Math.random() : 1.4 + 2.2 * Math.random(), 0.8 + 0.4 * Math.random());
    }
    for (let i = 0; i < N * 0.22; i++) {
      emitir(mundo.cam.x + (Math.random() * 2 - 1) * ext * 1.3, mundo.cam.y + (Math.random() * 2 - 1) * ext * 1.3, 0, 0, 1e6, 0, 1 + 1.5 * Math.random(), 0.6 + 0.8 * Math.random());
    }
  }
  // Aglomerados de matéria luminosa (o grosso da matéria, como na referência): partículas na GPU,
  // centro rastreado na CPU com a mesma física para contar a absorção.
  const aglomerados = [];
  function novoAglomerado(inicial) {
    const b = mundo.buraco, R = raioDe(b.M), ext = extensao();
    const ang = Math.random() * TAU, d = inicial ? ext * (0.4 + 1.2 * Math.sqrt(Math.random())) : ext * (1.1 + 0.4 * Math.random());
    const x = mundo.cam.x + Math.cos(ang) * d, y = mundo.cam.y + Math.sin(ang) * d;
    if (Math.hypot(x - b.x, y - b.y) < R * 6) return;
    const raio = R * (0.35 + 0.8 * Math.random()), n = Math.round((60 + 140 * Math.random()) * QUALIDADES[qualidade].particulas / 32000);
    const cor = [0, 1, 2, 3, 4, 5, 6, 7][Math.floor(Math.random() * 8)];
    const va = Math.random() * TAU, v = R * 0.05 * Math.random(), giro = (Math.random() - 0.5) * 0.6;
    for (let i = 0; i < n; i++) {
      const pa = Math.random() * TAU, pr = raio * Math.sqrt(-Math.log(1 - Math.random() * 0.95)) * 0.5;
      const px = Math.cos(pa) * pr, py = Math.sin(pa) * pr;
      emitir(x + px, y + py, Math.cos(va) * v - py * giro, Math.sin(va) * v + px * giro, 90, 6, 2 + 3 * Math.random(), cor + Math.min(0.999, Math.random()));
    }
    aglomerados.push({ x, y, vx: Math.cos(va) * v, vy: Math.sin(va) * v, massa: n / 1000, vida: 0 });
  }
  function atualizarAglomerados(dt) {
    const b = mundo.buraco, R = raioDe(b.M), GM = 13 * R * R * R, ext = extensao();
    for (let i = aglomerados.length - 1; i >= 0; i--) {
      const a = aglomerados[i]; a.vida += dt;
      const dx = a.x - b.x, dy = a.y - b.y, r = Math.hypot(dx, dy);
      const g = GM / Math.max(r * r, R * R) * Math.min(1, Math.max(0, (14 * R - r) / (9 * R)));
      a.vx += (-dx / r * g - dy / r * g * 0.45) * dt; a.vy += (-dy / r * g + dx / r * g * 0.45) * dt;
      a.vx *= Math.exp(-dt * 0.25); a.vy *= Math.exp(-dt * 0.25);
      a.x += (a.vx + 0.03 * R) * dt; a.y += (a.vy + 0.012 * R) * dt;
      if (r < R * 3.2) {
        b.M += a.massa * (b.M < 4 ? 1.2 : 0.4 + b.M * 0.02);
        mundo.pulso = 0; mundo.onda = 0; mundo.absorcoes++;
        Som.absorcao(0, Math.min(1, a.massa * 4));
        if (mundo.absorcoes % 4 === 0 && mundo.jato > 12) { mundo.jato = 0; Som.jato(); }
        aglomerados.splice(i, 1);
      } else if (a.vida > 90 || Math.hypot(a.x - mundo.cam.x, a.y - mundo.cam.y) > ext * 3) aglomerados.splice(i, 1);
    }
    const alvo = Math.round(14 * QUALIDADES[qualidade].particulas / 32000) + 6;
    let tent = 0;
    while (aglomerados.length < alvo && tent++ < 4) novoAglomerado(false);
  }
  // Marco de escala, sem fanfarra nem flash: onda forte no espaço-tempo, anel de matéria se afastando,
  // disco acende e um grave granular longo.
  function marcoEscala() {
    const b = mundo.buraco, R = raioDe(b.M);
    mundo.onda = 0; mundo.ondaForca = 3.5; mundo.pulso = 0;
    const n = Math.round(900 * QUALIDADES[qualidade].particulas / 32000);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, v = R * (1.6 + 0.8 * Math.random());
      emitir(b.x + Math.cos(a) * R * 1.4, b.y + Math.sin(a) * R * 1.4, Math.cos(a) * v, Math.sin(a) * v, 2.5 + Math.random(), 4, 1.5 + 1.5 * Math.random(), 1);
    }
    Som.absorcao(3, 1);
  }
  function absorver(c) {
    const b = mundo.buraco;
    const ganho = 0.35 * Math.pow(c.s / 0.55, 2);
    const massa = Math.min(1, Math.log(1 + 20 * ganho / b.M) / Math.log(21));
    b.M += ganho;
    mundo.pulso = 0; mundo.onda = 0; mundo.absorcoes++;
    Som.absorcao(c.tipo === 9 ? 1 : c.tipo >= 10 || c.s > raioDe(b.M) * 0.35 ? 3 : c.tipo === 5 ? 2 : 0, massa);
    if (mundo.absorcoes % 4 === 0 && mundo.jato > 12) { mundo.jato = 0; Som.jato(); }
  }

  const entrada = { ativo: false, x: 0, y: 0 };
  function passo(dt) {
    const w = mundo, b = w.buraco;
    w.tempo += dt; w.pulso += dt; w.onda += dt; w.jato += dt;
    const R = raioDe(b.M), vmax = R * 7;
    let ax = 0, ay = 0;
    if (entrada.ativo) { ax = (w.cam.x + entrada.x / w.escala - b.x) * 2.5; ay = (w.cam.y + entrada.y / w.escala - b.y) * 2.5; }
    const v = Math.hypot(ax, ay); if (v > vmax) { ax *= vmax / v; ay *= vmax / v; }
    const k = entrada.ativo ? Math.min(1, dt * 4) : Math.min(1, dt * 5);
    b.vx += (ax - b.vx) * k; b.vy += (ay - b.vy) * k; b.x += b.vx * dt; b.y += b.vy * dt;
    const cx = w.cam.x, cy = w.cam.y, kc = 1 - Math.exp(-dt * 2.5);
    w.cam.x += (b.x - w.cam.x) * kc; w.cam.y += (b.y - w.cam.y) * kc;
    const fx = faixa(b.M), alvoEscala = raioTelaAlvo(b.M) / R;
    if (w.faixa === undefined) w.faixa = fx.indice;
    if (fx.indice > w.faixa) { w.transicao = { t: 0, de: w.escala }; marcoEscala(); }
    w.faixa = fx.indice;
    if (w.transicao) {
      w.transicao.t += dt;
      const u = Math.min(1, w.transicao.t / (T.motionMs.cameraScaleTransition / 1000));
      w.escala = w.transicao.de + (alvoEscala - w.transicao.de) * curvaCamera(u);
      if (u >= 1) w.transicao = null;
    } else {
      w.escala += (alvoEscala - w.escala) * (1 - Math.exp(-dt / 0.8));
    }
    w.ondaForca = Math.max(1, (w.ondaForca || 1) - dt * 0.6);
    w.paralaxe[0] += (w.cam.x - cx) * w.escala * 0.08; w.paralaxe[1] += (w.cam.y - cy) * w.escala * 0.08;
    const cel = R * 0.55;
    w.grade[0] = (w.grade[0] + (b.x - w.ultimo[0]) / cel) % 1000; w.grade[1] = (w.grade[1] + (b.y - w.ultimo[1]) / cel) % 1000;
    w.ultimo = [b.x, b.y];
    const ext = extensao();
    // Disco reabastecido continuamente; fumaça luminosa em parte das partículas.
    const taxa = N * 0.28 / 40;
    let novos = taxa * dt + (w.restoDisco || 0);
    while (novos >= 1) {
      novos--;
      const r = 2.2 + 2.2 * Math.random(), a = Math.random() * TAU, fumaca = Math.random() < 0.12;
      emissoes.push(a, r, 0, 0, 0, 30 + 20 * Math.random(), fumaca ? 5 : 1, Math.random() * 100, fumaca ? 18 + 20 * Math.random() : 1.4 + 2.2 * Math.random(), 0.8 + 0.4 * Math.random());
    }
    w.restoDisco = novos;
    // Jato 11: feixe de partículas por 8 s.
    if (w.jato < 8) {
      const n = Math.round(700 * dt * QUALIDADES[qualidade].particulas / 32000);
      for (let i = 0; i < n; i++) {
        const lado = Math.random() < 0.5 ? 1 : -1, vel = R * (5 + 3 * Math.random()), esp = (Math.random() - 0.5) * 0.08;
        const ex = 0.1191 + esp, ey = 0.9929;
        emitir(b.x + ex * R * 1.1 * lado, b.y + ey * R * 1.1 * lado, (ex * vel) * lado + b.vx, (ey * vel) * lado + b.vy, 1.6 + Math.random(), 3, 1.5 + 2 * Math.random(), 1);
      }
    }
    for (let i = w.corpos.length - 1; i >= 0; i--) {
      const c = w.corpos[i];
      const dx = c.x - b.x, dy = c.y - b.y, dist = Math.hypot(dx, dy);
      if (c.preso) {
        // Consumo 12 com partículas de verdade: o corpo espirala, encolhe e se desfaz em detritos que alimentam o disco.
        c.t += dt / c.dur;
        const t = Math.min(1, c.t), a = c.a0 + 2.2 * TAU * t, r = c.r0 + (1.15 - c.r0) * t;
        const lx = Math.cos(a) * r * R, ly = Math.sin(a) * ACH * r * R * 2.2;
        const nx = b.x + lx, ny = b.y + ly + INCL * lx;
        const vx = (nx - c.x) / dt, vy = (ny - c.y) / dt;
        c.x = nx; c.y = ny; c.tam = 1 - t;
        c.emitir += dt * 260 * Math.min(2.5, c.s / R + 0.4) * (QUALIDADES[qualidade].particulas / 32000);
        while (c.emitir >= 1) {
          c.emitir--;
          const ra = Math.random() * TAU, rr = Math.sqrt(Math.random()) * c.s * c.tam;
          emitir(c.x + Math.cos(ra) * rr, c.y + Math.sin(ra) * rr, vx * 0.9 + (Math.random() - 0.5) * R * 0.5, vy * 0.9 + (Math.random() - 0.5) * R * 0.5,
            6, 2, 1.2 + 2.2 * Math.random(), COR_TIPO(c.tipo));
        }
        if (Math.random() < dt * 30) emitir(c.x, c.y, (Math.random() - 0.5) * R * 2, (Math.random() - 0.5) * R * 2, 0.6 + 0.6 * Math.random(), 4, 1.5 + Math.random(), 1);
        if (c.t >= 1) {
          for (let j = 0; j < 60; j++) { const ra = Math.random() * TAU; emitir(c.x, c.y, Math.cos(ra) * R * 0.8, Math.sin(ra) * R * 0.8, 0.8, 4, 1.5, 1); }
          absorver(c); w.corpos.splice(i, 1);
        }
        continue;
      }
      const comivel = c.s <= R * 0.5;
      if (comivel && dist < R * 5 + c.s) {
        const g = R * 13 * Math.pow(R / Math.max(dist, R), 2);
        c.vx += (-dx / dist * g - dy / dist * g * 0.35) * dt; c.vy += (-dy / dist * g + dx / dist * g * 0.35) * dt;
        const ex = dx / R, ey = (dy - INCL * dx) / (R * ACH * 2.2), rr = Math.hypot(ex, ey);
        if (rr < 3.4) { c.preso = true; c.t = 0; c.r0 = rr; c.a0 = Math.atan2(ey, ex); c.dur = 1.6 + 1.2 * Math.min(1, c.s / R); }
      } else if (!comivel && dist < R * 1.5 + c.s) {
        const e = (R * 1.5 + c.s - dist) * 2; c.vx += dx / dist * e * dt; c.vy += dy / dist * e * dt;
      }
      // Asteroides em movimento soltam poeira fina: rastro em vez de recorte estático.
      if ((c.tipo === 9 || dist < R * 6) && Math.random() < dt * 8 * (QUALIDADES[qualidade].particulas / 32000)) {
        emitir(c.x, c.y, c.vx * 0.3 + (Math.random() - 0.5) * R * 0.1, c.vy * 0.3 + (Math.random() - 0.5) * R * 0.1, 2.5, 2, 1 + Math.random(), COR_TIPO(c.tipo));
      }
      c.x += c.vx * dt; c.y += c.vy * dt;
      if (Math.hypot(c.x - w.cam.x, c.y - w.cam.y) > ext * 2.3 || c.s * w.escala < 0.0012) w.corpos.splice(i, 1);
    }
    preencher(false);
    atualizarAglomerados(dt);
  }

  // ---------- áudio: sons 05 · Poeira granular ----------
  const Som = (() => {
    let ctx = null, saida = null, ativo = false; const ult = [0, 0, 0, 0];
    function ruido(d) { const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * d), ctx.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(); s.buffer = b; return s; }
    function env(g, t, a, d, p) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(p, t + a); g.gain.setTargetAtTime(0.0001, t + a + d * 0.15, Math.max(0.05, d * 0.22)); }
    return {
      alternar() {
        if (!ctx) {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
          saida = ctx.createGain(); saida.gain.value = T.audio.defaultEffects;
          const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -3; comp.ratio.value = 20; comp.knee.value = 0; comp.attack.value = 0.001; comp.release.value = 0.15;
          const teto = ctx.createWaveShaper(), cv = new Float32Array(2049);
          for (let i = 0; i < cv.length; i++) { const x = i / 1024 - 1, m = Math.abs(x); cv[i] = Math.sign(x) * (m < 0.7 ? m : 0.7 + 0.191 * Math.tanh((m - 0.7) / 0.191)); }
          teto.curve = cv; saida.connect(comp); comp.connect(teto); teto.connect(ctx.destination);
        }
        ativo = !ativo; if (ativo) ctx.resume(); else ctx.suspend(); return ativo;
      },
      absorcao(m, massa) {
        if (!ativo) return; const agora = performance.now(); if (agora - ult[m] < 120) return; ult[m] = agora;
        const t = ctx.currentTime + 0.01, dur = [1.2, 1.4, 2.2, 3.4][m], f = [293.6648, 220, 146.8324, 73.4162][m], pico = 0.25 * (0.35 + 0.65 * Math.sqrt(massa));
        const g = ctx.createGain(); g.connect(saida); const n = 10 + Math.round(massa * 10);
        for (let i = 0; i < n; i++) { const tg = t + Math.random() * dur * 0.6, eg = ctx.createGain(); env(eg, tg, 0.005, 0.12, pico * (1 - i / n) * 5); const s = ruido(0.2), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * (1.5 + Math.random()); bp.Q.value = 8; s.connect(bp); bp.connect(eg); eg.connect(g); s.start(tg); s.stop(tg + 0.2); }
      },
      jato() {
        if (!ativo) return; const t = ctx.currentTime + 0.01, g = ctx.createGain(); g.connect(saida); env(g, t, 0.6, 3.2, 1.0);
        const s = ruido(3.7), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3; bp.frequency.setValueAtTime(180, t); bp.frequency.exponentialRampToValueAtTime(1800, t + 3.2);
        s.connect(bp); bp.connect(g); s.start(t); s.stop(t + 3.7);
      },
      suspender() { if (ctx && ativo) ctx.suspend(); }, retomar() { if (ctx && ativo) ctx.resume(); }
    };
  })();

  // ---------- quadro ----------
  let dpr = 1, pausado = false, media = 16, anterior = performance.now(), acumulado = 0;
  function desenhar(dt) {
    const Q = QUALIDADES[qualidade], P = PALETAS[paleta];
    dpr = Math.min(devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.round(canvas.clientWidth * dpr)), H = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const w = Math.max(1, Math.round(W * Q.escala)), h = Math.max(1, Math.round(H * Q.escala));
    if (quadro.w !== w || quadro.h !== h || !alvos) { quadro.w = w; quadro.h = h; criarAlvos(w, h); }
    const b = mundo.buraco, R = raioDe(b.M), esc = mundo.escala;
    const centro = [(b.x - mundo.cam.x) * esc, (b.y - mundo.cam.y) * esc];
    const pulsoVis = mundo.pulso < 2.2 ? Math.sin(Math.min(1, mundo.pulso / 0.18) * Math.PI / 2) * (1 - mundo.pulso / 2.2) : 0;
    const Rvis = R * (1 + 0.05 * pulsoVis);
    const Rt = Rvis * esc;

    // 1. Simulação na GPU (sem rasterização).
    gravarEmissoes();
    gl.useProgram(pSim.p);
    gl.uniform1f(pSim.u.uDt, dt); gl.uniform2f(pSim.u.uBuraco, b.x, b.y); gl.uniform2f(pSim.u.uCam, mundo.cam.x, mundo.cam.y);
    gl.uniform1f(pSim.u.uR, R); gl.uniform1f(pSim.u.uGM, 13 * R * R * R); gl.uniform1f(pSim.u.uExt, extensao()); gl.uniform1f(pSim.u.uMov, 1);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindVertexArray(vaos[fonte]);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tfs[1 - fonte]);
    gl.beginTransformFeedback(gl.POINTS); gl.drawArrays(gl.POINTS, 0, N); gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
    fonte = 1 - fonte;

    const pulso = mundo.pulso < 2.2 ? Math.sin(Math.min(1, mundo.pulso / 0.18) * Math.PI / 2) * (1 - mundo.pulso / 2.2) : 0;
    // 2. Camada de trás: fundo, corpos, partículas atrás do núcleo.
    gl.bindFramebuffer(gl.FRAMEBUFFER, alvos.atras[0].f); gl.viewport(0, 0, w, h);
    gl.disable(gl.BLEND);
    gl.useProgram(pFundo.p);
    gl.uniform2f(pFundo.u.uRes, w, h); gl.uniform2f(pFundo.u.uCentro, ...centro); gl.uniform1f(pFundo.u.uR, Rt);
    gl.uniform2f(pFundo.u.uParalaxe, ...mundo.paralaxe); gl.uniform2f(pFundo.u.uGrade, ...mundo.grade); gl.uniform1f(pFundo.u.uTempo, mundo.tempo);
    gl.uniform3f(pFundo.u.uNeb1, ...P.neb1); gl.uniform3f(pFundo.u.uNeb2, ...P.neb2); gl.uniform3f(pFundo.u.uNeb3, ...P.neb3);
    gl.uniform1f(pFundo.u.uNebForca, P.nebForca); gl.uniform3f(pFundo.u.uGradeCor, ...P.grade); gl.uniform1f(pFundo.u.uOnda, mundo.onda); gl.uniform1f(pFundo.u.uOndaForca, mundo.ondaForca || 1);
    gl.bindVertexArray(vaoTela); gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    let n = 0;
    for (const c of mundo.corpos) {
      if (n >= MAX_CORPOS) break;
      const x = (c.x - mundo.cam.x) * esc, y = (c.y - mundo.cam.y) * esc, raio = c.s * esc * c.tam;
      if (raio < 0.0008) continue;
      const ext = c.tipo === 5 ? 2.4 : c.tipo >= 10 ? 3.2 : 1.4;
      const lx = centro[0] - x, ly = centro[1] - y, ll = Math.max(1e-5, Math.hypot(lx, ly));
      dadosCorpos.set([x, y, raio, c.tipo, lx / ll, ly / ll, c.sem, ext], n * CF); n++;
    }
    if (n) {
      gl.useProgram(pCorpo.p); gl.uniform2f(pCorpo.u.uRes, w, h); gl.uniform1f(pCorpo.u.uTempo, mundo.tempo);
      gl.uniform3fv(pCorpo.u.uMat, MAT.flat());
      gl.bindVertexArray(vaoCorpo); gl.bindBuffer(gl.ARRAY_BUFFER, vboCorpos); gl.bufferSubData(gl.ARRAY_BUFFER, 0, dadosCorpos, 0, n * CF);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
    }
    gl.blendFunc(gl.ONE, gl.ONE);
    const desenharParticulas = camada => {
      gl.useProgram(pPart.p);
      gl.uniform2f(pPart.u.uRes, w, h); gl.uniform2f(pPart.u.uCam, mundo.cam.x, mundo.cam.y); gl.uniform1f(pPart.u.uEscala, esc);
      gl.uniform2f(pPart.u.uBuraco, b.x, b.y); gl.uniform1f(pPart.u.uR, Rvis); gl.uniform1f(pPart.u.uCamada, camada);
      gl.uniform1f(pPart.u.uDpr, dpr * Q.escala); gl.uniform1f(pPart.u.uMaxPonto, MAX_PONTO); gl.uniform1f(pPart.u.uTempo, mundo.tempo); gl.uniform1f(pPart.u.uPulso, pulso);
      gl.uniform3f(pPart.u.uDiscoQuente, ...P.discoQuente); gl.uniform3f(pPart.u.uDiscoFrio, ...P.discoFrio); gl.uniform3f(pPart.u.uPoeira, ...P.poeira);
      gl.uniform3f(pPart.u.uJato, ...P.jato); gl.uniform3f(pPart.u.uJatoPonta, ...P.jatoPonta); gl.uniform3f(pPart.u.uFumaca, ...P.fumaca);
      gl.uniform3fv(pPart.u.uMat, MAT.flat());
      gl.bindVertexArray(vaos[fonte]); gl.drawArrays(gl.POINTS, 0, N);
    };
    desenharParticulas(0);
    // 3. Camada da frente.
    gl.bindFramebuffer(gl.FRAMEBUFFER, alvos.frente[0].f); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    desenharParticulas(1);
    gl.disable(gl.BLEND);
    // 4. Composição com lente.
    gl.bindFramebuffer(gl.FRAMEBUFFER, alvos.cena[0].f);
    gl.useProgram(pCompor.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, alvos.atras[0].t);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, alvos.frente[0].t);
    gl.uniform1i(pCompor.u.tAtras, 0); gl.uniform1i(pCompor.u.tFrente, 1);
    gl.uniform2f(pCompor.u.uRes, w, h); gl.uniform2f(pCompor.u.uCentro, ...centro); gl.uniform1f(pCompor.u.uR, Rt); gl.uniform1f(pCompor.u.uPulso, pulso);
    gl.uniform3f(pCompor.u.uAnel, ...P.anel); gl.uniform3f(pCompor.u.uHalo, ...P.discoFrio);
    gl.bindVertexArray(vaoTela); gl.drawArrays(gl.TRIANGLES, 0, 3);
    // 5. Bloom.
    let origem = alvos.cena[0];
    gl.useProgram(pBaixo.p); gl.uniform1i(pBaixo.u.tFonte, 0); gl.activeTexture(gl.TEXTURE0);
    alvos.mips.forEach((m, i) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, m.f); gl.viewport(0, 0, m.w, m.h);
      gl.bindTexture(gl.TEXTURE_2D, origem.t);
      gl.uniform2f(pBaixo.u.uTexel, 1 / origem.w, 1 / origem.h); gl.uniform1f(pBaixo.u.uLimiar, i === 0 ? (hdr ? 1.0 : 0.7) : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      origem = m;
    });
    gl.useProgram(pCima.p); gl.uniform1i(pCima.u.tFonte, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    for (let i = alvos.mips.length - 1; i > 0; i--) {
      const de = alvos.mips[i], para = alvos.mips[i - 1];
      gl.bindFramebuffer(gl.FRAMEBUFFER, para.f); gl.viewport(0, 0, para.w, para.h);
      gl.bindTexture(gl.TEXTURE_2D, de.t); gl.uniform2f(pCima.u.uTexel, 0.5 / de.w, 0.5 / de.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.BLEND);
    // 6. Saída com tonemap.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
    gl.useProgram(pSaida.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, alvos.cena[0].t);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, alvos.mips[0].t);
    gl.uniform1i(pSaida.u.tCena, 0); gl.uniform1i(pSaida.u.tBloom, 1);
    gl.uniform1f(pSaida.u.uBloom, paleta === 1 ? 0.9 : 0.6); gl.uniform1f(pSaida.u.uExposicao, 1.1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  }
  function laco(agora) {
    requestAnimationFrame(laco);
    const dt = Math.min(0.1, (agora - anterior) / 1000); anterior = agora;
    media += (dt * 1000 - media) * 0.05;
    if (pausado) return;
    acumulado += dt; let k = 0;
    while (acumulado >= 1 / 60 && k++ < 6) { passo(1 / 60); acumulado -= 1 / 60; }
    if (k >= 6) acumulado = 0;
    desenhar(Math.min(dt, 1 / 20));
    $('#info').textContent = `${media.toFixed(1)} ms · ${N.toLocaleString('pt-BR')} partículas · ${hdr ? 'HDR 16 bits' : 'sem HDR (8 bits)'} · ${NOMES[Math.min(NOMES.length - 1, escalaDe(mundo.buraco.M))]} · massa ${mundo.buraco.M.toFixed(1)}`;
  }

  // ---------- controles ----------
  $('#paleta').addEventListener('change', e => { paleta = +e.target.value; });
  $('#qualidade').addEventListener('change', e => { qualidade = +e.target.value; criarParticulas(); alvos = null; quadro.w = 0; semear(); mundo.corpos.length = 0; preencher(true); aglomerados.length = 0; for (let i = 0; i < 16; i++) novoAglomerado(true); });
  $('#som').addEventListener('click', e => { const on = Som.alternar(); e.target.setAttribute('aria-pressed', on); e.target.textContent = on ? 'Som ligado' : 'Ativar som'; });
  $('#crescer').addEventListener('click', () => { mundo.buraco.M *= 2; });
  $('#pausa').addEventListener('click', e => { pausado = !pausado; e.target.setAttribute('aria-pressed', pausado); e.target.textContent = pausado ? 'Continuar' : 'Pausar'; if (pausado) Som.suspender(); else { anterior = performance.now(); Som.retomar(); } });
  function posicao(e) { const r = canvas.getBoundingClientRect(); entrada.x = (e.clientX - r.left - r.width / 2) / r.height; entrada.y = -(e.clientY - r.top - r.height / 2) / r.height; }
  canvas.addEventListener('pointerdown', e => {
    entrada.ativo = true; posicao(e); canvas.setPointerCapture(e.pointerId);
    const i = $('#instrucao'); if (!i.hidden) { i.style.opacity = '0'; setTimeout(() => { i.hidden = true; }, 600); }
  });
  canvas.addEventListener('pointermove', e => { if (entrada.ativo) posicao(e); });
  canvas.addEventListener('pointerup', () => { entrada.ativo = false; });
  canvas.addEventListener('pointercancel', () => { entrada.ativo = false; });
  document.addEventListener('visibilitychange', () => { if (document.hidden && !pausado) $('#pausa').click(); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); pausado = true; });

  if (location.search.includes('teste')) window.umbraTeste = { mundo, passo, desenhar, entrada, raioDe };
  criarParticulas();
  semear();
  preencher(true);
  for (let i = 0; i < 16; i++) novoAglomerado(true);
  requestAnimationFrame(laco);
})();
