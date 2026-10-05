// 04 · Bandas serenas — Bandas suaves num disco fino lento, sem reação.
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 3.0; // reação ao consumo: nenhuma
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 3.0; // reação ao consumo: nenhuma
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
