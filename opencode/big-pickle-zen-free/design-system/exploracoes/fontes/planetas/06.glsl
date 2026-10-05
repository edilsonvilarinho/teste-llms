// 06 · Fogo e gelo vivos — Lava incandescente e gelo nítido, realista, cores vivas. Conjunto: mundos de lava e de gelo, gigante vermelha, gigante de gelo, estrela azul, cometa, asteroide e lua.
const float ILUMINACAO = 0.0; // iluminação: terminador
const float ESTILO = 0.0; // estilo: realista
const float ATMOSFERA = 1.0; // atmosfera: fina
const float SATURACAO = 2.0; // saturação: viva
const float CONJUNTO = 1.0; // conjunto: gelo e fogo
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
