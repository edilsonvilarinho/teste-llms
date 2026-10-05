// 20 · Mergulho rubro — Mergulha como nuvem com cauda, congela avermelhado; o anel acende no ponto de entrada.
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 2.0; // espaguetificação: nuvem
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 1.0; // trajetória: mergulho
const float ESPAGUETE = 2.0; // espaguetificação: nuvem
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
