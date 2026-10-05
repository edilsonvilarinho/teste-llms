// 06 · Cintilação lenta — borda de sombra difusa, anel que cintila devagar (sem estrobo) e brilho generoso.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    float a = atan(p.y, p.x);
    vec3 c = fundo(lentePontual(p, uR * 1.6));
    c *= smoothstep(0.86, 1.07, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d * 1.1;
    c += corArco() * arcos(p, rn, 0.75, 1.15) * texturaArco(p, rn) * 1.05;
    float cintila = 0.7 + 0.3 * fbm(vec2(a * 4.0, TD * 0.45));
    float reacao = pulso(1.8) * (0.4 + 0.6 * pertoDaQueda(p, 1.3));
    c += corAnel(0.7) * gauss(rn - 1.025, 0.016) * cintila * (0.9 + 1.0 * reacao);
    c += mix(C_QUENTE, C_MEDIO, 0.4) * gauss(rn - 1.2, 0.38) * 0.15;
    float plano = exp(-abs(p.y - INCLINACAO * p.x) / uR * 4.0) * exp(-abs(p.x) / uR * 0.45);
    c += C_QUENTE * plano * 0.12;
    return c;
}
