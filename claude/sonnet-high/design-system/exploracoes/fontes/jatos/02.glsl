// 02 · Hélice marfim — Dois fios marfim girando em hélice, com partículas subindo. O jato dispara a cada 4 absorções.
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 1.0; // duração: médio
const float COR = 1.0; // cor: marfim
const float EXTRA = 2.0; // extra: partículas no jato
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 1.0; // duração: médio
const float COR = 1.0; // cor: marfim
const float EXTRA = 2.0; // extra: partículas no jato
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
