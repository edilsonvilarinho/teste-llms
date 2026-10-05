// 12 · Realista com cometas — Dupla luz realista no sistema misto, halo largo, cores médias. Conjunto: rochoso, lava, gelo, gasoso com anéis, oceano, anã vermelha, galáxia, nebulosa e dois cometas.
const float ILUMINACAO = 2.0; // iluminação: terminador + contraluz
const float ESTILO = 0.0; // estilo: realista
const float ATMOSFERA = 2.0; // atmosfera: halo largo
const float SATURACAO = 1.0; // saturação: média
const float CONJUNTO = 3.0; // conjunto: misto com cometas
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
