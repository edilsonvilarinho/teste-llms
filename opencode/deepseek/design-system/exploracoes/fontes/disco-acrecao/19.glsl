// 19 · Espiral com onda — Braços em espiral num disco fino com cisalhamento forte; onda circula.
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 0.0; // reação ao consumo: onda que circula
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 0.0; // reação ao consumo: onda que circula
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
