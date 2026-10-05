// 16 · Nós orbitais — três pontos quentes orbitam o anel; cada absorção acende um novo onde a matéria caiu.
float no(float a, float centro) {
    float d = mod(a - centro + PI, TAU) - PI;
    return exp(-d * d * 40.0) + 0.5 * exp(d * 3.0) * step(d, 0.0) * exp(-d * d * 2.0);
}
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    float a = atan(p.y, p.x);
    vec3 c = fundo(lentePontual(p, uR * 1.55));
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn) * 0.9;
    float nos = 0.0;
    for (int k = 0; k < 3; k++) nos += no(a, TD * 0.9 + float(k) * TAU / 3.0);
    float novo = no(a, uPulso.z + uPulso.x * 0.9 * uMov) * pulso(3.0) * 1.6;
    float faixa = gauss(rn - 1.03, 0.018);
    c += corAnel(0.55) * faixa * 0.45;
    c += corAnel(0.9) * faixa * (nos * 0.55 + novo);
    c += C_QUENTE * gauss(rn - 1.2, 0.35) * 0.06;
    return c;
}
