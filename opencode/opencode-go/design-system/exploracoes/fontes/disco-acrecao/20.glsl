// 20 · Bandas com mancha — Bandas suaves num disco médio e lento com beaming forte; mancha quente orbita.
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 1.0; // espessura: médio
const float TURBULENCIA = 3.0; // turbulência: bandas suaves
const float ROTACAO = 0.0; // rotação: lenta
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 1.0; // reação ao consumo: mancha quente orbitando
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
