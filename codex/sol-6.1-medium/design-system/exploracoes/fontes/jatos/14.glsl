// 14 · Plumas com eco — Plumas marfim e o contra-jato contornando a sombra. O jato dispara a cada 4 absorções.
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 3.0; // forma: plumas
const float DURACAO = 0.0; // duração: curto
const float COR = 1.0; // cor: marfim
const float EXTRA = 1.0; // extra: contra-jato lenteado
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 3.0; // forma: plumas
const float DURACAO = 0.0; // duração: curto
const float COR = 1.0; // cor: marfim
const float EXTRA = 1.0; // extra: contra-jato lenteado
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
