// 11 · Halo silencioso — Halo esférico fino em órbita, sem reação, só a poeira do núcleo.
const float AMBIENTE = 0.0; // poeira ambiente: nenhuma
const float COMPORTAMENTO = 0.0; // comportamento: órbita
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 0.0; // tamanho: finas
const float REACAO = 3.0; // reação à absorção: nenhuma
vec3 cena(vec2 p) {
    return cenaParticulas(p) * (0.96 + 0.04 * AMBIENTE);
}
//== pontos ==
const float AMBIENTE = 0.0; // poeira ambiente: nenhuma
const float COMPORTAMENTO = 0.0; // comportamento: órbita
const float CAMADA = 2.0; // camada: halo esférico
const float TAMANHO = 0.0; // tamanho: finas
const float REACAO = 3.0; // reação à absorção: nenhuma
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosParticulas(i, n, AMBIENTE, COMPORTAMENTO, CAMADA, TAMANHO, REACAO, pos, tamanho, cor, alfa);
}
