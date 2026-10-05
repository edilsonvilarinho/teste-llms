// 20 · Esfera em queda — Halo esférico de grãos variados caindo em espiral, sem reação.
const float AMBIENTE = 1.0; // poeira ambiente: esparsa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 1.0; // tamanho: variadas
const float REACAO = 3.0; // reação à absorção: nenhuma
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 1.0; // poeira ambiente: esparsa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 1.0; // tamanho: variadas
const float REACAO = 3.0; // reação à absorção: nenhuma
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
