// 20 · Ilustrado emissivo — Faixas chapadas com luz própria no sistema misto, cores vivas. Conjunto: rochoso, lava, gelo, gasoso com anéis, oceano, anã vermelha, galáxia, nebulosa e dois cometas.
const float ILUMINACAO = 3.0; // iluminação: emissiva suave
const float ESTILO = 1.0; // estilo: ilustrado
const float ATMOSFERA = 1.0; // atmosfera: fina
const float SATURACAO = 2.0; // saturação: viva
const float CONJUNTO = 3.0; // conjunto: misto com cometas
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
