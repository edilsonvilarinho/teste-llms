// 08 · Cáustica — estrelas ampliadas se esticam em arcos junto ao anel de Einstein; absorção solta onda.
vec3 cena(vec2 p) {
    float r = length(p);
    float rn = r / uR;
    float thetaE = uR * 1.6;
    float frente = onda(r, 0.3, 0.03, 3.0);
    vec2 b = lentePontual(p, thetaE) + (p / max(r, 1e-4)) * frente * 0.035;
    vec3 c = fundo(b) * mix(1.0, ampliacao(p, thetaE), 0.55);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn) * 0.9;
    c += corAnel(0.6) * gauss(rn - 1.02, 0.011) * 0.8;
    c += C_QUENTE * gauss(rn - 1.2, 0.35) * 0.07;
    return c;
}
