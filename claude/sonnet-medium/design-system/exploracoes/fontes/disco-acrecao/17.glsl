// 17 · Filamentos que incham — Filamentos num disco médio, lento, com desvio de calor; incha.
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 2.0; // reação ao consumo: disco incha
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 2.0; // reação ao consumo: disco incha
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
