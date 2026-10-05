// 12 · Espiral de bokeh — Partículas grandes e suaves espiralando no plano do disco; onda que empurra.
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 1.0; // camada: plano do disco
const float TAMANHO = 2.0; // tamanho: grandes e suaves
const float REACAO = 1.0; // reação à absorção: onda que empurra
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 1.0; // camada: plano do disco
const float TAMANHO = 2.0; // tamanho: grandes e suaves
const float REACAO = 1.0; // reação à absorção: onda que empurra
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
