// 09 · Contraluz contido — Contraluz realista discreto, cores contidas, sem atmosfera. Conjunto: rochoso, lava, gelo, oceano, deserto, gasoso com anéis, gigante de gelo, lua, asteroide e cometa.
const float ILUMINACAO = 1.0; // iluminação: contraluz
const float ESTILO = 0.0; // estilo: realista
const float ATMOSFERA = 0.0; // atmosfera: nenhuma
const float SATURACAO = 0.0; // saturação: contida
const float CONJUNTO = 0.0; // conjunto: sistema planetário
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
