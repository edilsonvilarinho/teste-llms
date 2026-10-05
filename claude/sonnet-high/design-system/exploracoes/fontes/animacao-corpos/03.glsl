// 03 · Viagem em paralaxe — Camadas de corpos passam em velocidades diferentes; cometas com cauda viva.
const float GIRO = 1.0; // rotação própria: visível
const float LUAS = 0.0; // luas: nenhuma
const float ESTELAR = 0.0; // atividade estelar: calma
const float MOVIMENTO = 1.0; // movimento no espaço: paralaxe em camadas
const float EXTRA = 1.0; // vida extra: cauda viva de cometa
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
