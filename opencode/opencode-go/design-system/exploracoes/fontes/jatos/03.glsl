// 03 · Nós de choque — Nós brilhantes correm pelo feixe; o contra-jato aparece contornando a sombra. O jato dispara quando um corpo grande é absorvido.
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 2.0; // duração: longo
const float COR = 2.0; // cor: gradiente
const float EXTRA = 1.0; // extra: contra-jato lenteado
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 2.0; // forma: nós de choque
const float DURACAO = 2.0; // duração: longo
const float COR = 2.0; // cor: gradiente
const float EXTRA = 1.0; // extra: contra-jato lenteado
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
