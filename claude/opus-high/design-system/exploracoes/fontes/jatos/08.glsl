// 08 · Nós com partículas — Nós de choque curtos com partículas correndo junto. O jato dispara a cada 4 absorções.
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 0.0; // duração: curto
const float COR = 1.0; // cor: marfim
const float EXTRA = 2.0; // extra: partículas no jato
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 0.0; // duração: curto
const float COR = 1.0; // cor: marfim
const float EXTRA = 2.0; // extra: partículas no jato
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
