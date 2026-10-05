// 06 · Órbita limpa — Órbita decaindo sem rastro, só o corpo esticando; avermelha no contato e os arcos acendem.
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 3.0; // rastro: nenhum
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 0.0; // resposta do núcleo: arcos acendem
vec3 cena(vec2 p) {
    return nucleoComResposta(p, RESPOSTA, TRAJETORIA) + materia(p, TRAJETORIA, ESPAGUETE, RASTRO, CONTATO);
}
//== pontos ==
const float TRAJETORIA = 2.0; // trajetória: órbita decaindo
const float ESPAGUETE = 0.0; // espaguetificação: estiramento
const float RASTRO = 3.0; // rastro: nenhum
const float CONTATO = 1.0; // contato com o horizonte: desvio para o vermelho
const float RESPOSTA = 0.0; // resposta do núcleo: arcos acendem
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    pontosConsumo(i, n, TRAJETORIA, RASTRO, pos, tamanho, cor, alfa);
}
