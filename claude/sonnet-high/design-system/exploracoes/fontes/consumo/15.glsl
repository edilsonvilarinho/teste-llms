// 15 · Órbita desfiada — Voltas apertadas desfiando em fios com cauda; congela avermelhado e solta onda.
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 1.0; // espaguetificação: fios
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
