// 13 · Nós âmbar — Nós de choque âmbar de duração média. O jato dispara em intervalos regulares (5–9 s na galeria).
const float GATILHO = 0.0; // gatilho: cadência
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 1.0; // duração: médio
const float COR = 0.0; // cor: âmbar
const float EXTRA = 0.0; // extra: nenhum
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 0.0; // gatilho: cadência
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 1.0; // duração: médio
const float COR = 0.0; // cor: âmbar
const float EXTRA = 0.0; // extra: nenhum
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
