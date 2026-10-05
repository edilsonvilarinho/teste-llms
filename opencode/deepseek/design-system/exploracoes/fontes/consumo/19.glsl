// 19 · Espiral desfiada — Espirala em fios com cauda de poeira, acende no contato e os arcos respondem.
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 0.0; // resposta do núcleo: arcos acendem
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 0.0; // resposta do núcleo: arcos acendem
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
