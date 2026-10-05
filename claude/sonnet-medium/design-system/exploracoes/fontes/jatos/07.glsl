// 07 · Hélice longa — Hélice marfim longa, anunciada por clarão polar. O jato dispara em intervalos regulares (5–9 s na galeria).
const float GATILHO = 0.0; // gatilho: cadência
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 2.0; // duração: longo
const float COR = 1.0; // cor: marfim
const float EXTRA = 3.0; // extra: clarão polar
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 0.0; // gatilho: cadência
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 2.0; // duração: longo
const float COR = 1.0; // cor: marfim
const float EXTRA = 3.0; // extra: clarão polar
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
