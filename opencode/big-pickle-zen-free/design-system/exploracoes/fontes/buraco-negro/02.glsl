// 02 · Respiração do horizonte — o núcleo respira devagar e cresce um pouco a cada absorção.
vec3 cena(vec2 p) {
    float reacao = pulso(2.4);
    float escala = (1.0 + 0.018 * sin(TD * 0.55)) * (1.0 + 0.05 * reacao * uMov);
    float rn = length(p) / (uR * escala);
    vec2 b = lentePontual(p, uR * 1.25 * escala);
    vec3 c = fundo(mix(p, b, 0.55));
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn);
    c += corAnel(0.5) * gauss(rn - 1.02, 0.014) * (0.8 + 0.5 * reacao);
    c += mix(C_QUENTE, C_MEDIO, 0.5) * gauss(rn - 1.15, 0.25) * (0.08 + 0.07 * reacao);
    return c;
}
