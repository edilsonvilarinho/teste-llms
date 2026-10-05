// 08 · Bandas inchadas — Bandas suaves num disco médio que incha a cada absorção; Doppler leve.
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 2.0; // reação ao consumo: disco incha
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 2.0; // reação ao consumo: disco incha
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
