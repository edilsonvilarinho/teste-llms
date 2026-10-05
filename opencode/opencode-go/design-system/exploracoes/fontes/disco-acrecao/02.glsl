// 02 · Células quentes — Disco médio de células turbulentas, rotação rápida e beaming forte; mancha quente orbita.
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 1.0; // turbulência: células
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 1.0; // turbulência: células
const float ROTACAO = 1.0; // rotação: rápida
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
