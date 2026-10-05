// 09 · Filamentos espessos — Filamentos num disco espesso e lento com beaming forte; sem reação.
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 3.0; // reação ao consumo: nenhuma
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 3.0; // reação ao consumo: nenhuma
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
