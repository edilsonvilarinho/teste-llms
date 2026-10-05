// 01 · Sinos de cristal — Absorções em sino FM com altura por material, drone grave puro e jato em sopro ascendente.
// Variação sonora: a cena é o núcleo escolhido (13); o que muda está em 01.som.js.
vec3 cena(vec2 p) {
    return nucleoEscolhido(p);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
