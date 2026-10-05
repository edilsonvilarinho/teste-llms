// 16 · Espiral nebulosa — Espirala como nuvem com filamento, avermelha no contato e solta onda.
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 2.0; // espaguetificação: nuvem
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 2.0; // espaguetificação: nuvem
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
