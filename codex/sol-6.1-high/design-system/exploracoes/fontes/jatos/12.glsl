// 12 · Hélice breve — Hélice marfim curta após um clarão polar. O jato dispara quando um corpo grande é absorvido.
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 0.0; // duração: curto
const float COR = 1.0; // cor: marfim
const float EXTRA = 3.0; // extra: clarão polar
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 2.0; // gatilho: corpo grande
const float FORMA = 1.0; // forma: hélice
const float DURACAO = 0.0; // duração: curto
const float COR = 1.0; // cor: marfim
const float EXTRA = 3.0; // extra: clarão polar
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
