// 01 · Gargantua sereno — referência enriquecida: anel de Einstein nítido e anel que acende onde a matéria caiu.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    vec3 c = fundo(lentePontual(p, uR * 1.55));
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn) * 0.9;
    float reacao = pulso(1.8) * (0.35 + 0.65 * pertoDaQueda(p, 1.1));
    c += corAnel(0.65) * gauss(rn - 1.02, 0.012) * (0.75 + 1.2 * reacao);
    c += C_QUENTE * gauss(rn - 1.25, 0.4) * 0.04;
    return c;
}
