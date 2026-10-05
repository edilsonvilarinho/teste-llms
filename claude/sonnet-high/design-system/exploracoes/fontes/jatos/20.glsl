// 20 · Bainha marfim — Espinha e bainha marfim médias com clarão polar. O jato dispara a cada 4 absorções.
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 4.0; // forma: núcleo e bainha
const float DURACAO = 1.0; // duração: médio
const float COR = 1.0; // cor: marfim
const float EXTRA = 3.0; // extra: clarão polar
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 4.0; // forma: núcleo e bainha
const float DURACAO = 1.0; // duração: médio
const float COR = 1.0; // cor: marfim
const float EXTRA = 3.0; // extra: clarão polar
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
