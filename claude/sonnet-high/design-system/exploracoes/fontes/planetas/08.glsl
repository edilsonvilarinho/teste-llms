// 08 · Cometas em gravura — Sistema misto com cometas em meio-tom, sem atmosfera. Conjunto: rochoso, lava, gelo, gasoso com anéis, oceano, anã vermelha, galáxia, nebulosa e dois cometas.
const float ILUMINACAO = 0.0; // iluminação: terminador
const float ESTILO = 2.0; // estilo: gravura
const float ATMOSFERA = 0.0; // atmosfera: nenhuma
const float SATURACAO = 1.0; // saturação: média
const float CONJUNTO = 3.0; // conjunto: misto com cometas
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
