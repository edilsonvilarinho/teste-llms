// 03 · Galáxia em miniatura — Disco espesso com braços em espiral e desvio de calor; incha ao consumir.
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 2.0; // reação ao consumo: disco incha
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 2.0; // reação ao consumo: disco incha
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
