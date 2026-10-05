// 16 · Tudo vivo — Rotação rápida, sistemas de luas, proeminências, deriva e todos os efeitos.
const float GIRO = 2.0; // rotação própria: rápida
const float LUAS = 2.0; // luas: sistemas de luas
const float ESTELAR = 3.0; // atividade estelar: proeminências
const float MOVIMENTO = 0.0; // movimento no espaço: deriva suave
const float EXTRA = 3.0; // vida extra: tudo junto
vec3 cena(vec2 p) {
    return corposAnimados(p, GIRO, LUAS, ESTELAR, MOVIMENTO, EXTRA);
}
//== pontos ==
void pontos(int i, int n, out vec2 pos, out float tamanho, out vec3 cor, out float alfa) {
    poeiraHalo(i, pos, tamanho, cor, alfa);
}
