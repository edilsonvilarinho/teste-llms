// 18 · Gravura viva — Meio-tom com cores vivas e contraluz no sistema planetário. Conjunto: rochoso, lava, gelo, oceano, deserto, gasoso com anéis, gigante de gelo, lua, asteroide e cometa.
const float ILUMINACAO = 1.0; // iluminação: contraluz
const float ESTILO = 2.0; // estilo: gravura
const float ATMOSFERA = 1.0; // atmosfera: fina
const float SATURACAO = 2.0; // saturação: viva
const float CONJUNTO = 0.0; // conjunto: sistema planetário
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
