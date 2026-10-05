// 05 · Espinha e bainha — Espinha estreita e quente dentro de uma bainha turbulenta. O jato dispara a cada 4 absorções.
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 4.0; // forma: núcleo e bainha
const float DURACAO = 0.0; // duração: curto
const float COR = 2.0; // cor: gradiente
const float EXTRA = 0.0; // extra: nenhum
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 4.0; // forma: núcleo e bainha
const float DURACAO = 0.0; // duração: curto
const float COR = 2.0; // cor: gradiente
const float EXTRA = 0.0; // extra: nenhum
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
