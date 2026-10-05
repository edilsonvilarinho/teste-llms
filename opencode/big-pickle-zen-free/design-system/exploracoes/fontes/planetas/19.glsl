// 19 · Minimal gelo e fogo — Gradientes em contraluz para lava e gelo, cores médias. Conjunto: mundos de lava e de gelo, gigante vermelha, gigante de gelo, estrela azul, cometa, asteroide e lua.
const float ILUMINACAO = 1.0; // iluminação: contraluz
const float ESTILO = 3.0; // estilo: minimal
const float ATMOSFERA = 1.0; // atmosfera: fina
const float SATURACAO = 1.0; // saturação: média
const float CONJUNTO = 1.0; // conjunto: gelo e fogo
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
