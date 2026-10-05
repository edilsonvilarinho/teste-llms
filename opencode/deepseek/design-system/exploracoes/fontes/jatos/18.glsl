// 18 · Nós marfim longos — Nós de choque marfim longos, sem extras. O jato dispara quando um corpo grande é absorvido.
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 2.0; // duração: longo
const float COR = 1.0; // cor: marfim
const float EXTRA = 0.0; // extra: nenhum
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 2.0; // duração: longo
const float COR = 1.0; // cor: marfim
const float EXTRA = 0.0; // extra: nenhum
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
