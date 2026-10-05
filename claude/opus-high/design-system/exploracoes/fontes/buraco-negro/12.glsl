// 12 · Lente viva — o fundo tremula como ar quente perto do horizonte; absorções fazem a lente vibrar.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    vec2 b = lentePontual(p, uR * 1.5);
    vec2 n = vec2(fbm(p / uR * 2.4 + vec2(TD * 0.25, 0.0)), fbm(p / uR * 2.4 + vec2(7.0, -TD * 0.22))) - 0.5;
    b += n * uR * 0.12 * exp(-(rn - 1.0) * 0.9);
    float reacao = pulso(1.5);
    b += normalize(p + 1e-5) * uR * 0.05 * reacao * sin(rn * 12.0 - uPulso.x * 16.0) * uMov;
    vec3 c = fundo(b);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    c += corArco() * arcos(p, rn, 0.72, 1.0) * texturaArco(p, rn) * 0.9;
    c += corAnel(0.6) * gauss(rn - 1.02, 0.011) * 0.85;
    c += C_QUENTE * gauss(rn - 1.2, 0.35) * 0.07;
    return c;
}
