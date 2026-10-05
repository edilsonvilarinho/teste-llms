// 05 · Minimal luminoso — Gradientes limpos e luz emissiva suave, cores médias. Conjunto: rochoso, lava, gelo, gasoso com anéis, oceano, anã vermelha, galáxia, nebulosa e dois cometas.
const float ILUMINACAO = 3.0; // iluminação: emissiva suave
const float ESTILO = 3.0; // estilo: minimal
const float ATMOSFERA = 1.0; // atmosfera: fina
const float SATURACAO = 1.0; // saturação: média
const float CONJUNTO = 3.0; // conjunto: misto com cometas
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
