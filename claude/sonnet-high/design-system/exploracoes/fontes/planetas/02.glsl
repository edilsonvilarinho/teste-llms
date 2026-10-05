// 02 · Atlas ilustrado — Faixas chapadas e contorno, como um atlas desenhado, cores vivas. Conjunto: rochoso, lava, gelo, oceano, deserto, gasoso com anéis, gigante de gelo, lua, asteroide e cometa.
const float ILUMINACAO = 0.0; // iluminação: terminador
const float ESTILO = 1.0; // estilo: ilustrado
const float ATMOSFERA = 0.0; // atmosfera: nenhuma
const float SATURACAO = 2.0; // saturação: viva
const float CONJUNTO = 0.0; // conjunto: sistema planetário
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
