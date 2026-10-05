// 07 · Estelar ilustrado — Estrelas, nebulosa e galáxia em estilo ilustrado, dupla luz. Conjunto: anã vermelha, estrela azul, anã branca, gigante vermelha, nebulosa, galáxia, gasoso com anéis, oceano, cometas e asteroides.
const float ILUMINACAO = 2.0; // iluminação: terminador + contraluz
const float ESTILO = 1.0; // estilo: ilustrado
const float ATMOSFERA = 1.0; // atmosfera: fina
const float SATURACAO = 1.0; // saturação: média
const float CONJUNTO = 2.0; // conjunto: estelar
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
