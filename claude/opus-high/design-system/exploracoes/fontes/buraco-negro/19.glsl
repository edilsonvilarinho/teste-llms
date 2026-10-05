// 19 · Assimetria Kerr — sombra achatada do lado que gira em direção ao observador, anel duplo desigual.
vec3 cena(vec2 p) {
    float reacao = pulso(2.6);
    float escala = 1.0 + 0.045 * reacao * uMov;
    vec2 q = p + vec2(0.13 * uR, 0.0);
    float rn = length(vec2(q.x * (q.x > 0.0 ? 1.18 : 1.0), q.y)) / (uR * escala);
    vec2 b = redemoinho(lentePontual(p, uR * 1.5), p, 0.7);
    vec3 c = fundo(b);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.9, calor);
    if (atrasDaSombra(q, rn)) d = 0.0;
    c += corDisco(calor) * d * 0.9;
    c += corArco() * arcos(q, rn, 0.72, 1.0) * texturaArco(q, rn) * 0.85;
    float lado = 1.0 + 0.8 * clamp(-q.x / max(length(q), 1e-4), -1.0, 1.0);
    c += corAnel(0.6) * (gauss(rn - 1.02, 0.009) * lado + 0.4 * gauss(rn - 1.06, 0.007) * (2.0 - lado));
    return c;
}
