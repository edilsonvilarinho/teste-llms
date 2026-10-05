// Tema jatos relativísticos: núcleo 13 fixo; jatos perpendiculares ao disco, só visuais (nunca alteram
// a simulação). O gatilho (cadência, massa acumulada, corpo grande) é do agendador da galeria/renderer.
// Códigos:
//   forma:   0 feixe colimado, 1 hélice, 2 nós de choque, 3 plumas, 4 núcleo e bainha
//   duracao: 0 curto (3 s), 1 médio (5 s), 2 longo (8 s)
//   cor:     0 âmbar, 1 marfim, 2 gradiente quente→âmbar
//   extra:   0 nenhum, 1 contra-jato lenteado, 2 partículas no jato (pontos), 3 clarão polar antes

const vec2 EIXO_JATO = vec2(0.1191, 0.9929);   // perpendicular ao disco (inclinação −0,12) // nao-cor
const vec2 TRAVES_JATO = vec2(0.9929, -0.1191); // nao-cor

float duracaoJato(float duracao) { return duracao < 0.5 ? 3.0 : duracao < 1.5 ? 5.0 : 8.0; }

vec3 corJato(float cor, float u) {
    if (cor < 0.5) return mix(C_QUENTE, C_MEDIO, 0.25);
    if (cor < 1.5) return mix(C_MEDIO, C_BRANCO, 0.4);
    return mix(C_BRANCO, C_QUENTE, smoothstep(0.0, 1.0, u));
}

// Brilho de um jato no ponto, em coordenadas ao longo (s ≥ 0) e através (t) do eixo.
float feixe(float s, float t, float forma, float frente) {
    float sr = s / uR;
    if (s < uR * 0.9 || s > frente) return 0.0;
    float ponta = 1.0 - smoothstep(frente - uR * 1.2, frente, s);
    float base = smoothstep(0.9, 1.4, sr);
    float b;
    if (forma < 0.5) {
        float w = uR * 0.07 * (1.0 + 0.12 * sr);
        b = gauss(t, w) * 1.2;
    } else if (forma < 1.5) {
        float amp = uR * 0.05 * sr;
        float fase = sr * 2.2 - TD * 3.0;
        float w = uR * 0.05 * (1.0 + 0.1 * sr);
        b = gauss(t - amp * sin(fase), w) + gauss(t + amp * sin(fase), w) * 0.7;
    } else if (forma < 2.5) {
        float w = uR * 0.075 * (1.0 + 0.1 * sr);
        float nos = 0.55 + 1.1 * pow(0.5 + 0.5 * sin(sr * 2.6 - uJato.x * 5.0 * (0.4 + 0.6 * uMov)), 4.0);
        b = gauss(t, w) * nos * 1.4;
    } else if (forma < 3.5) {
        float abre = smoothstep(3.5, 8.0, sr);
        float w = uR * (0.06 + 0.55 * abre);
        float turb = 0.6 + 0.8 * fbm(vec2(t / uR * 3.0, sr * 1.3 - TD * 0.8));
        b = gauss(t, w) * mix(1.2, 0.45 * turb, abre);
    } else {
        float espinha = gauss(t, uR * 0.035 * (1.0 + 0.08 * sr)) * 1.4;
        float bainha = gauss(t, uR * 0.2 * (1.0 + 0.15 * sr)) * (0.18 + 0.2 * fbm(vec2(t / uR * 4.0, sr - TD * 1.2)));
        b = espinha + bainha;
    }
    return b * ponta * base;
}

vec3 jatos(vec2 p, float forma, float duracao, float cor, float extra) {
    float env = jato(duracaoJato(duracao));
    if (env <= 0.0) return vec3(0.0);
    float frente = min(uJato.x * uR * 7.0, uR * 11.0);
    float s = dot(p, EIXO_JATO);
    float t = dot(p, TRAVES_JATO);
    float rn = length(p) / uR;
    float sombra = smoothstep(0.95, 1.05, rn);
    float cima = feixe(s, t, forma, frente);
    float baixo = feixe(-s, t, forma, frente) * 0.45 * sombra;
    float u = abs(s) / (uR * 11.0);
    vec3 c = corJato(cor, u) * (cima + baixo) * env * 1.3;
    if (extra > 0.5 && extra < 1.5) {
        // Imagem lenteada do contra-jato contornando a sombra pelo alto.
        float a = atan(p.y, p.x);
        float arco = gauss(rn - 1.12, 0.05) * exp(-pow((a - 1.45) / 0.35, 2.0));
        c += corJato(cor, 0.2) * arco * env * 0.6;
    }
    if (extra > 2.5) {
        float polo = gauss(t, uR * 0.35) * gauss(abs(s) - uR * 1.1, uR * 0.3);
        float clarao = smoothstep(0.0, 0.5, uJato.x) * (1.0 - smoothstep(0.5, 2.0, uJato.x));
        c += corAnel(0.7) * polo * clarao * 0.7 * uJato.y;
    }
    return c;
}

vec3 cenaJatos(vec2 p, float forma, float duracao, float cor, float extra) {
    return nucleoEscolhido(p) + jatos(p, forma, duracao, cor, extra);
}

// Partículas que sobem pelos jatos enquanto estão ativos.
void particulasJato(int j, float duracao, float cor, out vec2 pos, out float tamanho, out vec3 c, out float alfa) {
    float fj = float(j);
    float env = jato(duracaoJato(duracao));
    float lado = mod(fj, 2.0) < 0.5 ? 1.0 : -1.0;
    float u = fract(hash1(fj * 1.31) + uJato.x * (0.18 + 0.2 * hash1(fj * 2.7)));
    float s = mix(1.1, 10.0, u) * uR;
    float t = (hash1(fj * 3.9) - 0.5) * uR * (0.08 + 0.04 * s / uR);
    pos = EIXO_JATO * s * lado + TRAVES_JATO * t;
    tamanho = 1.0 + 1.4 * hash1(fj * 5.5);
    c = corJato(cor, u);
    alfa = env * (1.0 - u) * (lado > 0.0 ? 0.6 : 0.25) * min(uJato.x * uR * 7.0 / s, 1.0);
}

void pontosJatos(int i, int n, float duracao, float cor, float extra, out vec2 pos, out float tamanho, out vec3 c, out float alfa) {
    int halo = extra > 1.5 && extra < 2.5 ? n * 4 / 10 : n;
    if (i < halo) poeiraHalo(i, pos, tamanho, c, alfa);
    else particulasJato(i - halo, duracao, cor, pos, tamanho, c, alfa);
}
