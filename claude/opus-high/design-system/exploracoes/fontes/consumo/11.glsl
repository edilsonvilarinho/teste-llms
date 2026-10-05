// 11 · Mergulho em fios rubros — Mergulha desfiando sem rastro, congela avermelhado; o halo se recolhe.
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 3.0; // rastro: nenhum
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 3.0; // rastro: nenhum
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
