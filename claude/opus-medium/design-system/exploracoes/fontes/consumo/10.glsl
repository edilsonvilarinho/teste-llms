// 10 · Espiral de fragmentos — Espirala em fragmentos sem rastro e acende no contato; o halo se recolhe.
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 3.0; // rastro: nenhum
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 3.0; // espaguetificação: fragmentos
const float RASTRO = 3.0; // rastro: nenhum
const float CONTATO = 2.0; // contato com o horizonte: brilho no contato
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
