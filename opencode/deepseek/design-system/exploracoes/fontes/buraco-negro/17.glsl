// 17 · Silêncio absoluto — quase só sombra, um fio de luz e uma vibração sutil da lente ao absorver.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    vec2 b = mix(p, lentePontual(p, uR * 1.25), 0.4);
    float reacao = pulso(1.6);
    b += normalize(p + 1e-5) * uR * 0.03 * reacao * sin(rn * 10.0 - uPulso.x * 12.0) * uMov;
    vec3 c = fundo(b) * 0.85;
    c *= smoothstep(0.9, 1.06, rn);
    float calor;
    float d = disco(p, 0.6, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor * 0.5 + 0.3) * d * 0.7;
    c += corArco() * arcos(p, rn, 0.68, 0.85) * texturaArco(p, rn) * 0.6;
    c += C_MEDIO * gauss(rn - 1.03, 0.008) * 0.55;
    return c;
}
