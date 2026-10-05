// 16 · Bandas rápidas — Bandas suaves num disco fino e rápido com desvio de calor; mancha quente.
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
