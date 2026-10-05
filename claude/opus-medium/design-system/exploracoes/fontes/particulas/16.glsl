// 16 · Esfera à deriva — Halo esférico derivando devagar, grãos finos, faíscas.
const float AMBIENTE = 0.0; // poeira ambiente: nenhuma
const float COMPORTAMENTO = 1.0; // comportamento: deriva
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 0.0; // tamanho: finas
const float REACAO = 0.0; // reação à absorção: faíscas
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 0.0; // poeira ambiente: nenhuma
const float COMPORTAMENTO = 1.0; // comportamento: deriva
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 0.0; // tamanho: finas
const float REACAO = 0.0; // reação à absorção: faíscas
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
