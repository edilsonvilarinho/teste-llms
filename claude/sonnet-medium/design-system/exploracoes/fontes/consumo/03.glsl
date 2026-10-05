// 03 · Órbita em fios — Dá voltas cada vez mais apertadas e se desfia em cinco fios; um brilho suave marca o contato e o anel acende ali.
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 2.0; // resposta do núcleo: anel local
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
