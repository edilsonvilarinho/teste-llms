// 17 · Estelar contido — Estrelas e nebulosas realistas com terminador, cores contidas. Conjunto: anã vermelha, estrela azul, anã branca, gigante vermelha, nebulosa, galáxia, gasoso com anéis, oceano, cometas e asteroides.
const float ILUMINACAO = 0.0; // iluminação: terminador
const float ESTILO = 0.0; // estilo: realista
const float ATMOSFERA = 2.0; // atmosfera: halo largo
const float SATURACAO = 0.0; // saturação: contida
const float CONJUNTO = 2.0; // conjunto: estelar
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
