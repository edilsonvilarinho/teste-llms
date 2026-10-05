// 20 · Constelação lenteada — estrelas atravessam por trás do núcleo e se dividem em duas imagens.
vec3 cena(vec2 p) {
    float r = length(p);
    float rn = r / uR;
    float thetaE = uR * 1.6;
    float frente = onda(r, 0.3, 0.03, 3.0);
    vec2 b = lentePontual(p, thetaE) + (p / max(r, 1e-4)) * frente * 0.035;
    vec3 c = fundo(b) * mix(1.0, ampliacao(p, thetaE), 0.5);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.85, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d * 1.1;
    c += corArco() * arcos(p, rn, 0.75, 1.1) * texturaArco(p, rn) * 1.05;
    float anel = gauss(rn - 1.04, 0.012) + 0.6 * gauss(rn - 1.02, 0.005) + 0.35 * gauss(rn - 1.008, 0.003);
    c += corAnel(0.7) * anel;
    c += mix(C_QUENTE, C_MEDIO, 0.4) * gauss(rn - 1.2, 0.4) * 0.15;
    return c;
}
//== pontos ==
// Lente pontual resolvida por estrela: imagem externa θ+ e interna θ− = (u ± √(u² + 4θE²)) / 2.
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    int estrela = i / 2;
    float fe = float(estrela);
    float thetaE = uR * 1.6;
    vec2 beta = (vec2(hash1(fe * 1.3), hash1(fe * 2.9)) * 2.0 - 1.0) * vec2(0.9, 0.5); // nao-cor
    beta.x = mod(beta.x + 0.9 + TD * 0.006 * (0.5 + hash1(fe * 4.1)), 1.8) - 0.9;
    float u = max(length(beta), 1e-4);
    float raiz = sqrt(u * u + 4.0 * thetaE * thetaE);
    bool externa = (i - estrela * 2) == 0;
    float theta = externa ? (u + raiz) * 0.5 : (u - raiz) * 0.5;
    pos = beta / u * theta;
    float x = u / thetaE;
    float mu = (x * x + 2.0) / (2.0 * x * sqrt(x * x + 4.0)) + (externa ? 0.5 : -0.5);
    bool oculta = length(pos) < uR * 1.02;
    tamanho = clamp(1.2 + 1.4 * sqrt(abs(mu)), 1.2, 6.0);
    cor = mix(C_ESTRELA, C_BRANCO, hash1(fe * 6.7) * 0.5);
    alfa = oculta ? 0.0 : clamp(abs(mu) * 0.22, 0.03, 0.75) * (0.5 + 0.5 * hash1(fe * 8.3));
}
