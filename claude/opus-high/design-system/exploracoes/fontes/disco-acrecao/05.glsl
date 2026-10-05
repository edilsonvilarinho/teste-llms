// 05 · Filamentos rápidos — Disco médio de filamentos girando rápido com desvio de calor; onda circula.
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 0.0; // reação ao consumo: onda que circula
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 0.0; // reação ao consumo: onda que circula
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
