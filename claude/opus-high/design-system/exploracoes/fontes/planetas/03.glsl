// 03 · Gravura celeste — Meio-tom de gravura com halo largo, cores contidas. Conjunto: mundos de lava e de gelo, gigante vermelha, gigante de gelo, estrela azul, cometa, asteroide e lua.
const float ILUMINACAO = 2.0; // iluminação: terminador + contraluz
const float ESTILO = 2.0; // estilo: gravura
const float ATMOSFERA = 2.0; // atmosfera: halo largo
const float SATURACAO = 0.0; // saturação: contida
const float CONJUNTO = 1.0; // conjunto: gelo e fogo
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
