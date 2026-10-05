// 02 · Mergulho com cauda — Cai quase em linha reta, estica e arrasta uma cauda de poeira; apaga no horizonte e solta uma onda no espaço.
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
