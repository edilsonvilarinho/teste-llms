// 05 · Mergulho estilhaçado — Mergulha e se parte em fragmentos que soltam faíscas; congela avermelhado e solta uma onda.
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 2.0; // rastro: faíscas
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 2.0; // rastro: faíscas
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
