// 03 · Subanéis — três imagens do anel de fótons (n = 1, 2, 3), cada uma girando em ritmo próprio.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    float a = atan(p.y, p.x);
    vec3 c = fundo(lentePontual(p, uR * 1.55));
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    float reacao = pulso(2.2);
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn) * (0.9 + 0.8 * reacao);
    float anel = gauss(rn - 1.04, 0.011) * (0.85 + 0.15 * sin(a * 3.0 - TD * 0.6));
    anel += 0.6 * gauss(rn - 1.02, 0.005) * (0.85 + 0.15 * sin(a * 5.0 + TD * 0.9));
    anel += 0.4 * gauss(rn - 1.008, 0.0028) * (0.8 + 0.2 * sin(a * 7.0 - TD * 1.3));
    c += corAnel(0.7) * anel;
    c += C_QUENTE * gauss(rn - 1.2, 0.35) * 0.07;
    return c;
}
