// 14 · Células que incham — Células num disco médio e rápido, Doppler leve; incha ao consumir.
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 1.0; // turbulência: células
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 2.0; // reação ao consumo: disco incha
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 1.0; // turbulência: células
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 2.0; // reação ao consumo: disco incha
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
