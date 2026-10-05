// 08 · Órbita calma — Órbita compartilhada lenta, estrelas calmas, uma lua por planeta, nuvens.
const float GIRO = 0.0; // rotação própria: lenta
const float LUAS = 1.0; // luas: uma por planeta
const float ESTELAR = 0.0; // atividade estelar: calma
const float MOVIMENTO = 2.0; // movimento no espaço: órbita compartilhada
const float EXTRA = 0.0; // vida extra: nuvens e tempestades
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
