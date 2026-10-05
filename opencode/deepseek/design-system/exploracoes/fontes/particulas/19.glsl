// 19 · Bokeh com faíscas — Fundo de bolhas suaves em órbita lenta e faíscas na absorção.
const float AMBIENTE = 1.0; // poeira ambiente: esparsa
const float COMPORTAMENTO = 0.0; // comportamento: órbita
const float CAMADA = 0.0; // camada: fundo com paralaxe
const float TAMANHO = 2.0; // tamanho: grandes e suaves
const float REACAO = 0.0; // reação à absorção: faíscas
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 1.0; // poeira ambiente: esparsa
const float COMPORTAMENTO = 0.0; // comportamento: órbita
const float CAMADA = 0.0; // camada: fundo com paralaxe
const float TAMANHO = 2.0; // tamanho: grandes e suaves
const float REACAO = 0.0; // reação à absorção: faíscas
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
