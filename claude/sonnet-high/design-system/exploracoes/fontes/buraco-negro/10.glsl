// 10 · Espiral de fótons — traços luminosos orbitam o anel; o fundo é arrastado no mesmo sentido.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    float a = atan(p.y, p.x);
    vec2 b = redemoinho(lentePontual(p, uR * 1.5), p, 0.55);
    vec3 c = fundo(b);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.85, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn) * 0.9;
    float tracos = 0.45 + 0.55 * smoothstep(0.2, 1.0, sin(a * 6.0 - TD * 2.0 + rn * 40.0));
    float reacao = pulso(1.6) * (0.4 + 0.6 * pertoDaQueda(p, 1.0));
    c += corAnel(0.7) * gauss(rn - 1.025, 0.014) * tracos * (0.85 + 1.1 * reacao);
    c += C_QUENTE * gauss(rn - 1.2, 0.35) * 0.07;
    return c;
}
