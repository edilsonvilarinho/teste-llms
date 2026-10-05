// 17 · Fundo atraído — Fundo de grãos variados puxado em espiral; acendem na absorção.
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 0.0; // camada: fundo com paralaxe
const float TAMANHO = 1.0; // tamanho: variadas
const float REACAO = 2.0; // reação à absorção: acendem
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 2.0; // poeira ambiente: densa
const float COMPORTAMENTO = 2.0; // comportamento: atração em espiral
const float CAMADA = 0.0; // camada: fundo com paralaxe
const float TAMANHO = 1.0; // tamanho: variadas
const float REACAO = 2.0; // reação à absorção: acendem
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
