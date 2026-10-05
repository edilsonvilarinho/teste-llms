// 01 · Filamentos keplerianos — Disco fino de filamentos girando devagar; onda de brilho circula a partir da queda.
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 0.0; // reação ao consumo: onda que circula
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 0.0; // espessura: fino
const float TURBULENCIA = 0.0; // turbulência: filamentos
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 0.0; // Doppler: leve
const float REACAO = 0.0; // reação ao consumo: onda que circula
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
