// 07 · Coroa quente — anel largo e âmbar envolvendo um fio marfim; os arcos acendem ao absorver.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    vec2 b = mix(p, lentePontual(p, uR * 1.3), 0.4);
    vec3 c = fundo(b);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d * 1.1;
    float reacao = pulso(2.0);
    c += corArco() * arcos(p, rn, 0.72, 1.1) * texturaArco(p, rn) * (1.0 + 0.9 * reacao);
    float coroa = gauss(rn - 1.06, 0.06) * (0.85 + 0.15 * ruido(vec2(atan(p.y, p.x) * 6.0, TD * 0.3)));
    c += corAnel(0.15) * coroa * 0.55;
    c += corAnel(0.85) * gauss(rn - 1.015, 0.008) * 0.9;
    c += C_QUENTE * gauss(rn - 1.3, 0.5) * 0.14;
    return c;
}
