// 05 · Onda gravitacional — cada absorção solta uma frente que deforma o fundo; entre elas, ondulação lenta.
vec3 cena(vec2 p) {
    float r = length(p);
    float rn = r / uR;
    vec2 dir = p / max(r, 1e-4);
    float frente = onda(r, 0.32, 0.028, 3.2);
    float viva = sin(rn * 7.0 - TD * 1.1) * 0.01 * uR / max(rn - 0.6, 0.4);
    vec2 b = lentePontual(p, uR * 1.5) + dir * (viva + frente * 0.04);
    vec3 c = fundo(b);
    c += C_MEDIO * frente * 0.05;
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn) * 0.85;
    c += corAnel(0.6) * gauss(rn - 1.02, 0.011) * 0.75;
    return c;
}
