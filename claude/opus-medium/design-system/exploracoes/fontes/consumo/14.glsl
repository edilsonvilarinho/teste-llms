// 14 · Mergulho cintilante — Mergulha esticando entre faíscas, acende no contato e o anel responde no ponto de entrada.
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 2.0; // rastro: faíscas
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 2.0; // rastro: faíscas
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
