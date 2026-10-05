// 09 · Eclipse marfim — mínimo: sombra de borda macia, dois fios de luz e um pulso lento do horizonte.
vec3 cena(vec2 p) {
    float reacao = pulso(2.8);
    float escala = 1.0 + 0.04 * reacao * uMov;
    float rn = length(p) / (uR * escala);
    vec3 c = fundo(mix(p, lentePontual(p, uR * 1.3), 0.35));
    c *= smoothstep(0.9, 1.05, rn);
    float calor;
    float d = disco(p, 0.7, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor * 0.6 + 0.4) * d * 0.85;
    c += corArco() * arcos(p, rn, 0.7, 0.9) * texturaArco(p, rn) * 0.75;
    c += C_MEDIO * (gauss(rn - 1.03, 0.008) + 0.45 * gauss(rn - 1.075, 0.006)) * (0.75 + 0.4 * reacao);
    return c;
}
