// 03 · Bokeh profundo — Partículas grandes e suaves em camadas de fundo com paralaxe lenta.
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 1.0; // comportamento: deriva
const float CAMADA = 0.0; // camada: fundo com paralaxe
const float TAMANHO = 2.0; // tamanho: grandes e suaves
const float REACAO = 3.0; // reação à absorção: nenhuma
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 1.0; // comportamento: deriva
const float CAMADA = 0.0; // camada: fundo com paralaxe
const float TAMANHO = 2.0; // tamanho: grandes e suaves
const float REACAO = 3.0; // reação à absorção: nenhuma
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
