// 05 · Nuvem flutuante — Halo esférico de grãos que flutuam devagar, com poeira densa ao fundo.
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 1.0; // comportamento: deriva
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 1.0; // tamanho: variadas
const float REACAO = 2.0; // reação à absorção: acendem
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 1.0; // comportamento: deriva
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 1.0; // tamanho: variadas
const float REACAO = 2.0; // reação à absorção: acendem
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
