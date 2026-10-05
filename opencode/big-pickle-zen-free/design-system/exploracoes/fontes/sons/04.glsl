// 04 · Coro distante — Coral de senos suaves, pulso lento no núcleo, jato em coro brilhante; espacializado.
// Variação sonora: a cena é o núcleo escolhido (13); o que muda está em 04.som.js.
vec3 cena(vec2 p) {
    return nucleoEscolhido(p);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
