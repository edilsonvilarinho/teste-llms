// 15 · Ilustrado misto — Atlas desenhado do sistema misto, terminador, halo largo, contido. Conjunto: rochoso, lava, gelo, gasoso com anéis, oceano, anã vermelha, galáxia, nebulosa e dois cometas.
const float ILUMINACAO = 0.0; // iluminação: terminador
const float ESTILO = 1.0; // estilo: ilustrado
const float ATMOSFERA = 2.0; // atmosfera: halo largo
const float SATURACAO = 0.0; // saturação: contida
const float CONJUNTO = 3.0; // conjunto: misto com cometas
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
