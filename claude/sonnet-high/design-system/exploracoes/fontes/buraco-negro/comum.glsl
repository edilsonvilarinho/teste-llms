// Blocos comuns do tema buraco-negro. O disco é o mesmo em todas as variações (tilt −0,12 do token
// render.diskTilt, espessura 1/6,4 do ScenePass) para comparar só núcleo, anel, lente, reação e brilho.
// Disco e matéria em tema próprio (disco-acrecao, consumo).

const float INCLINACAO = -0.12;

vec3 corDisco(float calor) { return mix(C_QUENTE, C_BRANCO, calor); }
vec3 corArco() { return mix(C_MEDIO, C_BRANCO, 0.35); }
vec3 corAnel(float calor) { return mix(C_QUENTE, C_BRANCO, calor); }

// Ruído angular sem costura em ±π: mistura a volta atual com a seguinte.
float fbmAngular(float r, float a, float giro, vec2 escala) {
    float w = (a + PI) / TAU;
    float n1 = fbm(vec2(r * escala.x, (a - giro) * escala.y));
    float n2 = fbm(vec2(r * escala.x, (a + TAU - giro) * escala.y));
    return mix(n2, n1, w);
}

// Disco fino com rotação kepleriana (ω ∝ r^−1,5), filamentos turbulentos alongados no sentido da órbita
// e beaming Doppler: o lado que se aproxima (x > 0) fica mais claro e mais quente.
float disco(vec2 p, float velocidade, out float calor) {
    vec2 d = vec2(p.x, (p.y - INCLINACAO * p.x) * 6.4);
    float dr = length(d) / uR;
    float da = atan(d.y, d.x);
    float mascara = smoothstep(1.22, 1.5, dr) * (1.0 - smoothstep(2.4, 4.4, dr));
    float giro = TD * velocidade * pow(max(dr, 1.0), -1.5);
    float filamentos = fbmAngular(dr, da, giro, vec2(7.0, 1.7));
    float fino = fbmAngular(dr, da, giro * 1.15, vec2(22.0, 3.2));
    float textura = 0.25 + 0.95 * filamentos * filamentos + 0.4 * (fino - 0.5);
    float aproxima = clamp(p.x / (uR * 2.6), -1.0, 1.0);
    float doppler = 0.62 + 0.38 * (1.0 + aproxima) * (1.0 + aproxima) * 0.5;
    calor = clamp(1.8 / dr - 0.45 + 0.25 * aproxima, 0.0, 1.0);
    float bordaQuente = gauss(dr - 1.42, 0.16) * 0.55;
    return mascara * (max(textura, 0.0) * (0.2 + 0.85 / max(dr - 0.95, 0.32)) * 0.7 + bordaQuente) * doppler;
}

// Parte de trás do disco fica escondida pela sombra; a frente passa diante dela.
bool atrasDaSombra(vec2 p, float rn) {
    return rn < 1.0 && (p.y - INCLINACAO * p.x) > -0.08 * uR;
}

// Arcos de Gargantua: imagem lenteada do disco por trás do núcleo, larga em cima, fina embaixo,
// desaparecendo nas laterais onde encontra o disco.
float arcos(vec2 p, float rn, float forca, float largura) {
    float s = abs(sin(atan(p.y, p.x)));
    float curva = 1.13 + 0.58 * pow(s, 0.7) * forca;
    float w = (0.04 + 0.15 * pow(s, 1.5)) * largura;
    float m = exp(-pow((rn - curva) / w, 2.0)) * pow(s, 1.3);
    return m * (p.y > 0.0 ? 0.9 : 0.45);
}

// Textura dos arcos: os mesmos filamentos do disco vistos por cima, correndo no sentido da órbita.
float texturaArco(vec2 p, float rn) {
    float a = atan(p.y, p.x);
    float f = fbmAngular(rn, a, TD * 0.35, vec2(9.0, 2.2));
    return 0.45 + 0.9 * f * f;
}

// Ampliação de uma lente pontual; concentra estrelas junto ao anel de Einstein.
float ampliacao(vec2 p, float thetaE) {
    float x = thetaE / max(length(p), 1e-4);
    return min(1.0 / max(abs(1.0 - x * x * x * x), 0.05), 9.0);
}

// Redemoinho de arrasto de referenciais: giro decai com 1/r².
vec2 redemoinho(vec2 b, vec2 p, float giro) {
    float rn = length(p) / uR;
    return rot(giro / (rn * rn + 0.35)) * b;
}

// Distância angular até o ponto de queda da última absorção (0 = mesmo ângulo).
float pertoDaQueda(vec2 p, float largura) {
    float d = abs(mod(atan(p.y, p.x) - uPulso.z + PI, TAU) - PI);
    return exp(-d * d / (largura * largura));
}
