// 07 · Espiral de fios e faíscas — Espirala desfiando em fios que soltam faíscas; apaga no horizonte e o anel acende no ponto de entrada.
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 2.0; // rastro: faíscas
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 2.0; // rastro: faíscas
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
