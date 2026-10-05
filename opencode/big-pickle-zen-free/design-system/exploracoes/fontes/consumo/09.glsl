// 09 · Órbita em pedaços — Voltas apertadas que quebram o corpo em pedaços com cauda de poeira; apaga e solta uma onda.
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 1.0; // resposta do núcleo: onda gravitacional
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
