// 06 · Feixe com eco — Feixe colimado marfim e contra-jato lenteado. O jato dispara quando um corpo grande é absorvido.
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 0.0; // forma: feixe colimado
const float DURACAO = 1.0; // duração: médio
const float COR = 1.0; // cor: marfim
const float EXTRA = 1.0; // extra: contra-jato lenteado
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 0.0; // forma: feixe colimado
const float DURACAO = 1.0; // duração: médio
const float COR = 1.0; // cor: marfim
const float EXTRA = 1.0; // extra: contra-jato lenteado
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
