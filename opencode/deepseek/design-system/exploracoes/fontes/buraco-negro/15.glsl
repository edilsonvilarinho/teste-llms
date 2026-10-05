// 15 · Arcos duplos — segunda imagem dos arcos mais distante e tênue, cáustica nas estrelas; contido.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    float thetaE = uR * 1.55;
    vec3 c = fundo(lentePontual(p, thetaE)) * mix(1.0, ampliacao(p, thetaE), 0.4);
    c *= smoothstep(0.985, 1.0, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d * 0.9;
    float reacao = pulso(2.2);
    float arco = arcos(p, rn, 0.72, 1.0) + 0.3 * arcos(p, rn / 1.22, 0.6, 0.7);
    c += corArco() * arco * texturaArco(p, rn) * (0.85 + 0.8 * reacao);
    c += corAnel(0.6) * (gauss(rn - 1.02, 0.009) + 0.45 * gauss(rn - 1.055, 0.007)) * 0.8;
    return c;
}
