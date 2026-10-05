// 15 · Espiral espessa cisalhada — Braços em espiral num disco espesso com cisalhamento forte e beaming forte; sem reação.
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 3.0; // reação ao consumo: nenhuma
vec3 cena(vec2 p) {
    return cenaDisco(p, ESPESSURA, TURBULENCIA, ROTACAO, DOPPLER, REACAO);
}
//== pontos ==
const float ESPESSURA = 2.0; // espessura: espesso
const float TURBULENCIA = 2.0; // turbulência: braços em espiral
const float ROTACAO = 2.0; // rotação: diferencial forte
const float DOPPLER = 1.0; // Doppler: forte
const float REACAO = 3.0; // reação ao consumo: nenhuma
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
