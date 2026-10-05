// 04 · Nuvem que se dissolve — Espirala e se expande em nuvem rarefeita com cauda; some no horizonte e o halo se recolhe por um instante.
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 2.0; // espaguetificação: nuvem
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 0.0; // trajetória: espiral
const float ESPAGUETE = 2.0; // espaguetificação: nuvem
const float RASTRO = 1.0; // rastro: cauda de poeira
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
