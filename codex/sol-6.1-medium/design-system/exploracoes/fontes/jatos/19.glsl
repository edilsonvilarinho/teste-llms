// 19 · Plumas de partículas — Plumas âmbar curtas com partículas subindo. O jato dispara em intervalos regulares (5–9 s na galeria).
const float GATILHO = 0.0; // gatilho: cadência
const float FORMA = 3.0; // forma: plumas
const float DURACAO = 0.0; // duração: curto
const float COR = 0.0; // cor: âmbar
const float EXTRA = 2.0; // extra: partículas no jato
vec3 cena(vec2 p) {
    return cenaJatos(p, FORMA, DURACAO, COR, EXTRA);
}
//== pontos ==
const float GATILHO = 0.0; // gatilho: cadência
const float FORMA = 3.0; // forma: plumas
const float DURACAO = 0.0; // duração: curto
const float COR = 0.0; // cor: âmbar
const float EXTRA = 2.0; // extra: partículas no jato
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosJatos(i, n, DURACAO, COR, EXTRA, pos, tamanho, cor, alfa);
}
