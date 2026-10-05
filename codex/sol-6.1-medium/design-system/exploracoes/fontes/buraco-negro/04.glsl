// 04 · Arrasto de referenciais — sombra em "D" deslocada pelo spin, fundo arrastado em redemoinho e anel duplo.
vec3 cena(vec2 p) {
    vec2 q = p + vec2(0.1 * uR, 0.0);
    float rn = length(vec2(q.x * (q.x > 0.0 ? 1.12 : 1.0), q.y)) / uR;
    float rp = length(p) / uR;
    vec2 b = lentePontual(p, uR * 1.5);
    b = redemoinho(b, p, 0.8 + 0.2 * sin(TD * 0.4));
    float reacao = pulso(1.4);
    b += normalize(p + 1e-5) * uR * 0.05 * reacao * sin(rp * 14.0 - uPulso.x * 18.0) * uMov;
    vec3 c = fundo(b);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.9, calor);
    if (atrasDaSombra(q, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(q, rn, 0.72, 1.0) * texturaArco(q, rn);
    float lado = 1.0 + 0.6 * clamp(-q.x / max(length(q), 1e-4), -1.0, 1.0);
    c += corAnel(0.6) * (gauss(rn - 1.02, 0.01) + 0.5 * gauss(rn - 1.065, 0.008)) * lado;
    c += C_QUENTE * gauss(rn - 1.2, 0.35) * 0.06;
    return c;
}
