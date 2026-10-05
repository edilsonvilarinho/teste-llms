// 08 · Tempestade esférica — Grãos finos caindo em espiral de todas as direções; onda que empurra.
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 0.0; // tamanho: finas
const float REACAO = 1.0; // reação à absorção: onda que empurra
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 0.0; // tamanho: finas
const float REACAO = 1.0; // reação à absorção: onda que empurra
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
