// 11 · Vórtice profundo — redemoinho forte, subanéis respirando e onda após absorção; brilho generoso.
vec3 cena(vec2 p) {
    float r = length(p);
    float escala = 1.0 + 0.02 * sin(TD * 0.5);
    float rn = r / (uR * escala);
    float frente = onda(r, 0.28, 0.035, 3.4);
    vec2 b = redemoinho(lentePontual(p, uR * 1.6), p, 1.4 + 0.3 * sin(TD * 0.3));
    b += (p / max(r, 1e-4)) * frente * 0.04;
    vec3 c = fundo(b);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 1.0, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d * 1.1;
    c += corArco() * arcos(p, rn, 0.78, 1.15) * texturaArco(p, rn) * 1.05;
    float anel = gauss(rn - 1.04, 0.012) + 0.6 * gauss(rn - 1.02, 0.005) + 0.35 * gauss(rn - 1.008, 0.003);
    c += corAnel(0.65) * anel * 1.1;
    c += mix(C_QUENTE, C_MEDIO, 0.35) * gauss(rn - 1.2, 0.4) * 0.16;
    return c;
}
