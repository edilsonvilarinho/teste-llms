// 07 · Espiral fina — Braços em espiral num disco fino e rápido, beaming forte; incha ao consumir.
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 2.0; // reação ao consumo: disco incha
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 2.0; // reação ao consumo: disco incha
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
