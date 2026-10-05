// 13 · Cisalhamento fino — Filamentos num disco fino com rotação diferencial forte e beaming forte; mancha quente.
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
