// 14 · Pulso de massa — sombra Kerr assimétrica que incha suavemente a cada absorção; brilho generoso.
vec3 cena(vec2 p) {
    float reacao = pulso(2.6);
    float escala = 1.0 + 0.06 * reacao * uMov;
    vec2 q = p + vec2(0.08 * uR, 0.0);
    float rn = length(vec2(q.x * (q.x > 0.0 ? 1.1 : 1.0), q.y)) / (uR * escala);
    vec3 c = fundo(lentePontual(p, uR * 1.55 * escala));
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.85, calor);
    if (atrasDaSombra(q, rn)) d = 0.0;
    c += corDisco(calor) * d * 1.1;
    c += corArco() * arcos(q, rn, 0.75, 1.1) * texturaArco(q, rn) * 1.05;
    c += corAnel(0.7) * gauss(rn - 1.02, 0.012) * (0.9 + 0.7 * reacao);
    c += mix(C_QUENTE, C_MEDIO, 0.4) * gauss(rn - 1.2, 0.4) * (0.13 + 0.08 * reacao);
    return c;
}
