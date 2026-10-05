// 15 · Bainha com partículas — Espinha e bainha em gradiente com partículas. O jato dispara quando um corpo grande é absorvido.
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 4.0; // forma: núcleo e bainha
const float DURACAO = 1.0; // duração: médio
const float COR = 2.0; // cor: gradiente
const float EXTRA = 2.0; // extra: partículas no jato
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 4.0; // forma: núcleo e bainha
const float DURACAO = 1.0; // duração: médio
const float COR = 2.0; // cor: gradiente
const float EXTRA = 2.0; // extra: partículas no jato
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
