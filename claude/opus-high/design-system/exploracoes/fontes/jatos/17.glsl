// 17 · Hélice em gradiente — Hélice quente que esfria para âmbar, longa, com contra-jato. O jato dispara a cada 4 absorções.
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 2.0; // duração: longo
const float COR = 2.0; // cor: gradiente
const float EXTRA = 1.0; // extra: contra-jato lenteado
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 1.0; // gatilho: massa acumulada
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 2.0; // duração: longo
const float COR = 2.0; // cor: gradiente
const float EXTRA = 1.0; // extra: contra-jato lenteado
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
