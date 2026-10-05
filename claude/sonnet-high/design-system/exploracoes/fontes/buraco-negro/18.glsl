// 18 · Turbilhão de plasma — plasma âmbar escorre em espiral junto ao horizonte; fundo ondula; generoso.
vec3 cena(vec2 p) {
    float escala = 1.0 + 0.016 * sin(TD * 0.6);
    float rn = length(p) / (uR * escala);
    float a = atan(p.y, p.x);
    vec2 b = lentePontual(p, uR * 1.55);
    b += normalize(p + 1e-5) * sin(rn * 6.0 - TD * 0.9) * 0.012 * uR / max(rn - 0.6, 0.4);
    vec3 c = fundo(b);
    c *= smoothstep(0.985, 1.0, rn);
    float plasma = fbm(vec2(a * 3.0 - TD * 0.7 / max(rn, 1.0), rn * 7.0 - TD * 0.3));
    float faixa = smoothstep(1.0, 1.05, rn) * (1.0 - smoothstep(1.12, 1.45, rn));
    c += mix(C_QUENTE, C_BRANCO, plasma * 0.6) * faixa * plasma * 0.6;
    float calor;
    float d = disco(p, 0.95, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d * 1.1;
    float reacao = pulso(2.0);
    c += corArco() * arcos(p, rn, 0.75, 1.15) * texturaArco(p, rn) * (1.0 + 0.9 * reacao);
    float cintila = 0.75 + 0.25 * fbm(vec2(a * 5.0, TD * 0.4));
    c += corAnel(0.7) * gauss(rn - 1.02, 0.012) * cintila;
    c += C_QUENTE * gauss(rn - 1.25, 0.45) * 0.15;
    return c;
}
