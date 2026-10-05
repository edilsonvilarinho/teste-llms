// 17 · Mergulho fragmentado — Mergulha quebrando em fragmentos com filamento; apaga no horizonte e os arcos acendem.
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 0.0; // resposta do núcleo: arcos acendem
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 0.0; // resposta do núcleo: arcos acendem
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
