// 12 · Bandas de fogo — Bandas suaves num disco espesso, rápido e com desvio de calor; onda circula.
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 0.0; // reação ao consumo: onda que circula
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 2.0; // Doppler: com desvio de calor
const float REACAO = 0.0; // reação ao consumo: onda que circula
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
