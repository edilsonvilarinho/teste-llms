// 13 · Halo de poeira — anel largo quente e poeira fina orbitando no plano do disco.
vec3 cena(vec2 p) {
    float rn = length(p) / uR;
    vec3 c = fundo(lentePontual(p, uR * 1.55));
    c *= smoothstep(0.88, 1.06, rn);
    float calor;
    float d = disco(p, 0.8, calor);
    if (atrasDaSombra(p, rn)) d = 0.0;
    c += corDisco(calor) * d;
    float reacao = pulso(2.0);
    c += corArco() * arcos(p, rn, 0.72, 1.05) * texturaArco(p, rn) * (0.9 + 0.8 * reacao);
    c += corAnel(0.2) * gauss(rn - 1.06, 0.06) * 0.4;
    c += corAnel(0.8) * gauss(rn - 1.02, 0.009) * 0.7;
    c += C_QUENTE * gauss(rn - 1.25, 0.4) * 0.07;
    return c;
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    float fi = float(i);
    float raio = uR * (1.5 + 2.2 * pow(hash1(fi * 1.7), 1.6));
    float omega = 0.9 * pow(raio / uR, -1.5);
    float ang = hash1(fi * 3.1) * TAU + TD * omega;
    vec2 local = vec2(cos(ang), sin(ang) / 6.4) * raio;
    pos = vec2(local.x, local.y + INCLINACAO * local.x);
    bool atras = sin(ang) > 0.0 && length(pos) < uR * 1.05;
    tamanho = 1.0 + 1.6 * hash1(fi * 5.3);
    cor = mix(C_QUENTE, C_MEDIO, hash1(fi * 7.7));
    alfa = atras ? 0.0 : (0.18 + 0.3 * hash1(fi * 9.1)) * (1.0 + 0.6 * pulso(2.0));
}
