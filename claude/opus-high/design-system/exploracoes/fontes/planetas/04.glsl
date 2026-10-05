// 04 · Silhuetas coloridas — Corpos em contraluz com borda colorida e halo largo. Conjunto: anã vermelha, estrela azul, anã branca, gigante vermelha, nebulosa, galáxia, gasoso com anéis, oceano, cometas e asteroides.
const float ILUMINACAO = 1.0; // iluminação: contraluz
const float ESTILO = 0.0; // estilo: realista
const float ATMOSFERA = 2.0; // atmosfera: halo largo
const float SATURACAO = 2.0; // saturação: viva
const float CONJUNTO = 2.0; // conjunto: estelar
vec3 cena(vec2 p) {
    return catalogo(p, ILUMINACAO, ESTILO, ATMOSFERA, SATURACAO, CONJUNTO);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
