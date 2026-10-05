// 13 · Giro e cauda — Rotação rápida, uma lua, pulsação e cauda viva em órbita compartilhada.
const float GIRO = 2.0; // rotação própria: rápida
const float LUAS = 1.0; // luas: uma por planeta
const float ESTELAR = 1.0; // atividade estelar: pulsação
const float MOVIMENTO = 2.0; // movimento no espaço: órbita compartilhada
const float EXTRA = 1.0; // vida extra: cauda viva de cometa
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
