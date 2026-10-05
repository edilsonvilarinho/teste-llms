// 18 · Células calmas — Células num disco espesso e rápido, Doppler leve; sem reação.
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 1.0; // turbulência: células
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 3.0; // reação ao consumo: nenhuma
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 1.0; // turbulência: células
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 3.0; // reação ao consumo: nenhuma
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
