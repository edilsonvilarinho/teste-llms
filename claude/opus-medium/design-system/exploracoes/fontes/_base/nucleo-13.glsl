// Núcleo escolhido em 01/10/2026: buraco-negro 13 · Halo de poeira (escolhas.json).
// Sombra de borda macia, anel largo quente + fio marfim, anel de Einstein, arcos que acendem ao absorver,
// brilho médio e poeira fina orbitando no plano do disco. Incluído pelas galerias seguintes via
// tema.json "incluir"; cada tema muda só o que está em escolha.

const float INCLINACAO = -0.12;

vec3 corDisco(float calor) { return mix(C_QUENTE, C_BRANCO, calor); }
vec3 corArco() { return mix(C_MEDIO, C_BRANCO, 0.35); }
vec3 corAnel(float calor) { return mix(C_QUENTE, C_BRANCO, calor); }

// Ruído angular sem costura em ±π.
float fbmAngular(float r, float a, float giro, vec2 escala) {
    float w = (a + PI) / TAU;
    float n1 = fbm(vec2(r * escala.x, (a - giro) * escala.y));
    float n2 = fbm(vec2(r * escala.x, (a + TAU - giro) * escala.y));
    return mix(n2, n1, w);
}

// Coordenadas no plano do disco: x ao longo da linha do disco, y esticado pela inclinação de visada.
vec2 planoDisco(vec2 p) { return vec2(p.x, (p.y - INCLINACAO * p.x) * 6.4); }

// Disco fino com rotação kepleriana, filamentos alongados e beaming Doppler (x > 0 se aproxima).
float disco(vec2 p, float velocidade, out float calor) {
    vec2 d = planoDisco(p);
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

bool atrasDaSombra(vec2 p, float rn) {
    return rn < 1.0 && (p.y - INCLINACAO * p.x) > -0.08 * uR;
}

float arcos(vec2 p, float rn, float forca, float largura) {
    float s = abs(sin(atan(p.y, p.x)));
    float curva = 1.13 + 0.58 * pow(s, 0.7) * forca;
    float w = (0.04 + 0.15 * pow(s, 1.5)) * largura;
    float m = exp(-pow((rn - curva) / w, 2.0)) * pow(s, 1.3);
    return m * (p.y > 0.0 ? 0.9 : 0.45);
}

float texturaArco(vec2 p, float rn) {
    float a = atan(p.y, p.x);
    float f = fbmAngular(rn, a, TD * 0.35, vec2(9.0, 2.2));
    return 0.45 + 0.9 * f * f;
}

float pertoDaQueda(vec2 p, float largura) {
    float d = abs(mod(atan(p.y, p.x) - uPulso.z + PI, TAU) - PI);
    return exp(-d * d / (largura * largura));
}

// Fundo lenteado do núcleo escolhido (anel de Einstein θE = 1,55·R).
vec3 fundoNucleo(vec2 p) { return fundo(lentePontual(p, uR * 1.55)); }

// Núcleo sem disco: sombra macia, arcos, anel largo quente e fio marfim, halo médio.
// O tema de disco soma o próprio disco; os demais usam nucleoEscolhido().
vec3 nucleoSobre(vec3 fundoCor, vec2 p, float brilhoArcos) {
    float rn = length(p) / uR;
    vec3 c = fundoCor * smoothstep(0.88, 1.06, rn);
    float reacao = pulso(2.0);
    c += corArco() * arcos(p, rn, 0.72, 1.05) * texturaArco(p, rn) * (0.9 + 0.8 * reacao) * brilhoArcos;
    c += corAnel(0.2) * gauss(rn - 1.06, 0.06) * 0.4;
    c += corAnel(0.8) * gauss(rn - 1.02, 0.009) * 0.7;
    c += C_QUENTE * gauss(rn - 1.25, 0.4) * 0.07;
    return c;
}

vec3 nucleoEscolhido(vec2 p) {
    float rn = length(p) / uR;
    vec3 c = nucleoSobre(fundoNucleo(p), p, 1.0);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    return c + corDisco(calor) * d;
}

// Poeira fina do halo (pontos): órbita kepleriana no plano do disco, escondida atrás da sombra.
void poeiraHalo(int i, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    float fi = float(i);
    float raio = uR * (1.5 + 2.2 * pow(hash1(fi * 1.7), 1.6));
    float omega = 0.9 * pow(raio / uR, -1.5);
    float ang = hash1(fi * 3.1) * TAU + TD * omega;
    vec2 local = vec2(cos(ang), sin(ang) / 6.4) * raio;
    pos = vec2(local.x, local.y + INCLINACAO * local.x);
    bool atras = sin(ang) > 0.0 && length(pos) < uR * 1.05;
    tamanho = 1.0 + 1.6 * hash1(fi * 5.3);
    cor = mix(C_QUENTE, C_MEDIO, hash1(fi * 7.7));
    alfa = atras ? 0.0 : (0.18 + 0.3 * hash1(fi * 9.1)) * (1.0 + 0.6 * pulso(2.0)) * uNucleo;
}
