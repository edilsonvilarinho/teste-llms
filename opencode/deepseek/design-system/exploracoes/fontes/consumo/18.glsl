// 18 · Órbita silenciosa — Órbita decaindo esticando com filamento; apaga e o halo se recolhe.
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 0.0; // rastro: filamento
const float CONTATO = 0.0; // contato com o horizonte: apagar
const float RESPOSTA = 3.0; // resposta do núcleo: halo se recolhe
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
