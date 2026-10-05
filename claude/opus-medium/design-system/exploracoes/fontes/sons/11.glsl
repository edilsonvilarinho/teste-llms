// 11 · Sinos no pad — Sinos com duração por material sobre pad em movimento; jato em coro; espacializado.
// Variação sonora: a cena é o núcleo escolhido (13); o que muda está em 11.som.js.
vec3 cena(vec2 p) {
    return nucleoEscolhido(p);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
